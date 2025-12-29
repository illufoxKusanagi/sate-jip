/**
 * Email Templates for Ticketing System
 */

interface TicketEmailData {
  ticketNumber: string;
  subject: string;
  customerName: string;
  description?: string;
}

interface ReplyEmailData extends TicketEmailData {
  replyMessage: string;
  staffName: string;
}

interface StatusChangeEmailData extends TicketEmailData {
  oldStatus: string;
  newStatus: string;
}

const statusColors: Record<string, string> = {
  open: "#3b82f6",
  in_progress: "#8b5cf6",
  waiting_response: "#f59e0b",
  resolved: "#10b981",
  closed: "#6b7280",
};

const statusLabels: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  waiting_response: "Waiting for Response",
  resolved: "Resolved",
  closed: "Closed",
};

/**
 * Email template when a new ticket is created
 */
export function ticketCreatedEmail(data: TicketEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content { 
            padding: 30px; 
          }
          .ticket-number { 
            display: inline-block;
            font-size: 20px; 
            font-weight: bold; 
            color: #3b82f6;
            background: #eff6ff;
            padding: 8px 16px;
            border-radius: 6px;
            font-family: 'Monaco', 'Courier New', monospace;
          }
          .info-box {
            background: #f9fafb;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .info-box strong {
            color: #1f2937;
          }
          .button {
            display: inline-block;
            background: #3b82f6;
            color: white !important;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
          }
          .footer { 
            padding: 20px; 
            text-align: center; 
            color: #6b7280; 
            font-size: 14px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
          }
          .footer a {
            color: #3b82f6;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎫 Support Ticket Created</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${data.customerName}</strong>,</p>
            <p>Thank you for contacting us. Your support ticket has been successfully created and our team has been notified.</p>
            
            <div class="info-box">
              <p><strong>Ticket Number:</strong><br>
              <span class="ticket-number">${data.ticketNumber}</span></p>
              <p><strong>Subject:</strong> ${data.subject}</p>
            </div>

            <p>Our support team will review your request and respond as soon as possible. You will receive email updates whenever there are changes to your ticket.</p>
            
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our team will review your request</li>
              <li>You'll receive email updates on progress</li>
              <li>You can reply to this email to add more information</li>
            </ul>

            <p>Please keep your ticket number handy for reference.</p>
          </div>
          <div class="footer">
            <p>This is an automated message from the Support Team.</p>
            <p>&copy; ${new Date().getFullYear()} Diskominfo Madiun. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Email template when staff replies to a ticket
 */
export function ticketReplyEmail(data: ReplyEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content { 
            padding: 30px; 
          }
          .ticket-number {
            display: inline-block;
            font-family: 'Monaco', 'Courier New', monospace;
            font-weight: bold;
            color: #10b981;
            background: #d1fae5;
            padding: 4px 8px;
            border-radius: 4px;
          }
          .reply-box { 
            background: #f9fafb;
            padding: 20px; 
            border-left: 4px solid #10b981; 
            margin: 20px 0;
            border-radius: 4px;
          }
          .reply-box .author {
            font-weight: 600;
            color: #047857;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .reply-box .message {
            color: #1f2937;
            white-space: pre-wrap;
          }
          .footer { 
            padding: 20px; 
            text-align: center; 
            color: #6b7280; 
            font-size: 14px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💬 New Reply on Your Ticket</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${data.customerName}</strong>,</p>
            <p>Your support ticket <strong class="ticket-number">${data.ticketNumber}</strong> has a new reply from our team.</p>
            
            <div class="reply-box">
              <div class="author">
                <span>👤</span>
                <strong>${data.staffName}</strong> replied:
              </div>
              <div class="message">${data.replyMessage.replace(/\n/g, "<br>")}</div>
            </div>

            <p><strong>Subject:</strong> ${data.subject}</p>
            
            <p>If you have any questions or need further assistance, simply reply to this email and we'll continue the conversation.</p>
          </div>
          <div class="footer">
            <p>Ticket <strong>${data.ticketNumber}</strong> - ${data.subject}</p>
            <p>&copy; ${new Date().getFullYear()} Diskominfo Madiun. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Email template when ticket status changes
 */
export function ticketStatusChangedEmail(data: StatusChangeEmailData): string {
  const oldStatusColor = statusColors[data.oldStatus] || "#6b7280";
  const newStatusColor = statusColors[data.newStatus] || "#6b7280";
  const oldStatusLabel = statusLabels[data.oldStatus] || data.oldStatus;
  const newStatusLabel = statusLabels[data.newStatus] || data.newStatus;

  let statusMessage = "";
  if (data.newStatus === "resolved") {
    statusMessage = `
      <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; color: #047857;">
          <strong>✅ Great news!</strong> Your issue has been resolved. 
          If everything is working correctly, you can close this ticket. 
          If you need further assistance, please let us know.
        </p>
      </div>
    `;
  } else if (data.newStatus === "closed") {
    statusMessage = `
      <div style="background: #f3f4f6; border-left: 4px solid #6b7280; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; color: #374151;">
          <strong>ℹ️ Ticket Closed</strong> - This ticket has been closed. 
          If you have any additional questions, feel free to submit a new ticket.
        </p>
      </div>
    `;
  } else if (data.newStatus === "in_progress") {
    statusMessage = `
      <div style="background: #ede9fe; border-left: 4px solid #8b5cf6; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; color: #6d28d9;">
          <strong>🚀 Good news!</strong> Our team is actively working on your request.
          You'll receive updates as we make progress.
        </p>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, ${newStatusColor} 0%, ${newStatusColor}dd 100%);
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content { 
            padding: 30px; 
          }
          .status-change {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin: 25px 0;
          }
          .status-badge { 
            display: inline-block; 
            padding: 8px 16px; 
            border-radius: 20px; 
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
          }
          .arrow {
            font-size: 24px;
            color: #9ca3af;
          }
          .footer { 
            padding: 20px; 
            text-align: center; 
            color: #6b7280; 
            font-size: 14px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Ticket Status Updated</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${data.customerName}</strong>,</p>
            <p>The status of your support ticket <strong>#${data.ticketNumber}</strong> has been updated.</p>
            
            <div class="status-change">
              <span class="status-badge" style="background: ${oldStatusColor}22; color: ${oldStatusColor};">
                ${oldStatusLabel}
              </span>
              <span class="arrow">→</span>
              <span class="status-badge" style="background: ${newStatusColor}; color: white;">
                ${newStatusLabel}
              </span>
            </div>

            <p><strong>Subject:</strong> ${data.subject}</p>
            
            ${statusMessage}
            
            <p>You'll continue to receive email updates as your ticket progresses.</p>
          </div>
          <div class="footer">
            <p>Ticket <strong>#${data.ticketNumber}</strong></p>
            <p>&copy; ${new Date().getFullYear()} Diskominfo Madiun. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
