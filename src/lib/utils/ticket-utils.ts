// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// interface SendEmailParams {
//   to: string;
//   subject: string;
//   html: string;
// }

// export async function sendEmail({ to, subject, html }: SendEmailParams) {
//   try {
//     const { data, error } = await resend.emails.send({
//       from: process.env.RESEND_FROM || "support@yourdomain.com",
//       to,
//       subject,
//       html,
//     });

import { Resend } from "resend";

// Lazy initialize Resend only when needed (runtime)
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  if (!resend) {
    throw new Error("Resend API key is not configured");
  }
  return resend;
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const client = getResendClient(); // Changed this line
    const { data, error } = await client.emails.send({
      from: process.env.RESEND_FROM || "support@yourdomain.com",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Email error:", error);
      return { success: false, error };
    }

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

// Email templates
export function ticketCreatedEmail(
  ticketNumber: string,
  subject: string,
  customerName: string,
) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .ticket-number { font-size: 24px; font-weight: bold; color: #3b82f6; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Support Ticket Created</h1>
          </div>
          <div class="content">
            <p>Hi ${customerName},</p>
            <p>Thank you for contacting us. Your support ticket has been successfully created.</p>
            <p><strong>Ticket Number:</strong> <span class="ticket-number">${ticketNumber}</span></p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p>Our support team will review your request and respond as soon as possible. You can track the status of your ticket using the ticket number above.</p>
            <p>If you have any additional information to add, please reply to this email.</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply directly to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function ticketReplyEmail(
  ticketNumber: string,
  subject: string,
  customerName: string,
  replyMessage: string,
  staffName: string,
) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .reply-box { background: white; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Reply on Your Ticket</h1>
          </div>
          <div class="content">
            <p>Hi ${customerName},</p>
            <p>Your support ticket <strong>#${ticketNumber}</strong> has a new reply from our team.</p>
            <div class="reply-box">
              <p><strong>${staffName} wrote:</strong></p>
              <p>${replyMessage.replace(/\n/g, "<br>")}</p>
            </div>
            <p>If you have any questions or need further assistance, feel free to reply to this email.</p>
          </div>
          <div class="footer">
            <p>Ticket #${ticketNumber} - ${subject}</p>
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function ticketStatusChangedEmail(
  ticketNumber: string,
  subject: string,
  customerName: string,
  oldStatus: string,
  newStatus: string,
) {
  const statusColors: Record<string, string> = {
    open: "#3b82f6",
    in_progress: "#8b5cf6",
    resolved: "#10b981",
    closed: "#6b7280",
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${statusColors[newStatus] || "#3b82f6"}; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Ticket Status Updated</h1>
          </div>
          <div class="content">
            <p>Hi ${customerName},</p>
            <p>The status of your support ticket <strong>#${ticketNumber}</strong> has been updated.</p>
            <p>
              <span class="status-badge" style="background: #ef4444; color: white;">${oldStatus.toUpperCase()}</span>
              →
              <span class="status-badge" style="background: ${statusColors[newStatus]}; color: white;">${newStatus.toUpperCase()}</span>
            </p>
            <p><strong>Subject:</strong> ${subject}</p>
            ${newStatus === "resolved" ? "<p>If your issue has been resolved, you can close this ticket. If you need further assistance, please let us know.</p>" : ""}
            ${newStatus === "closed" ? "<p>This ticket has been closed. If you have any additional questions, feel free to submit a new ticket.</p>" : ""}
          </div>
          <div class="footer">
            <p>Ticket #${ticketNumber}</p>
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
