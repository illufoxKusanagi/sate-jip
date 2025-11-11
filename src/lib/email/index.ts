/**
 * Universal Email Service
 * Supports both Gmail SMTP (development) and Resend (production)
 * Automatically switches based on environment variables
 */

import nodemailer from "nodemailer";
import { Resend } from "resend";

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: any;
}

const useResend = process.env.RESEND_API_KEY && !process.env.USE_SMTP;
const useSmtp =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD;

let resend: Resend | null = null;
if (useResend) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

let transporter: nodemailer.Transporter | null = null;
if (useSmtp) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

/**
 * Send email using available service (Resend or SMTP)
 */
export async function sendEmail({
  to,
  subject,
  html,
  from,
}: SendEmailParams): Promise<EmailResult> {
  const fromAddress =
    from ||
    process.env.RESEND_FROM ||
    process.env.SMTP_FROM ||
    "noreply@example.com";

  if (resend && !process.env.USE_SMTP) {
    try {
      console.log(`📧 Sending via Resend to: ${to}`);

      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      });

      if (error) {
        console.error("❌ Resend error:", error);
        return { success: false, error };
      }

      console.log("✅ Email sent via Resend:", data?.id);
      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error("❌ Resend exception:", error);
      return { success: false, error };
    }
  }

  if (transporter) {
    try {
      console.log(`📧 Sending via SMTP to: ${to}`);

      const info = await transporter.sendMail({
        from: fromAddress,
        to: Array.isArray(to) ? to.join(", ") : to,
        subject,
        html,
      });

      console.log("✅ Email sent via SMTP:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ SMTP error:", error);
      return { success: false, error };
    }
  }

  console.error(
    "❌ No email service configured! Set either RESEND_API_KEY or SMTP credentials.",
  );
  return {
    success: false,
    error: "No email service configured",
  };
}

/**
 * Get current email service being used
 */
export function getEmailService(): "resend" | "smtp" | "none" {
  if (resend && !process.env.USE_SMTP) return "resend";
  if (transporter) return "smtp";
  return "none";
}

/**
 * Test email connection
 */
export async function testEmailConnection(): Promise<boolean> {
  const service = getEmailService();
  console.log(`🔍 Testing ${service} connection...`);

  if (service === "smtp" && transporter) {
    try {
      await transporter.verify();
      console.log("✅ SMTP connection verified");
      return true;
    } catch (error) {
      console.error("❌ SMTP connection failed:", error);
      return false;
    }
  }

  if (service === "resend") {
    console.log("✅ Resend is configured");
    return true;
  }

  console.error("❌ No email service configured");
  return false;
}
