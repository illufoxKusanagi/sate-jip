/**
 * Test Resend Email Configuration
 *
 * This script tests if your Resend email setup is working correctly.
 *
 * Usage:
 *   npx tsx scripts/test-resend.ts
 *
 * Make sure you have these environment variables set in .env.local:
 *   RESEND_API_KEY=re_your_api_key_here
 *   RESEND_FROM=onboarding@resend.dev
 */

import { Resend } from "resend";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env.local") });

// Configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || "onboarding@resend.dev";

// ⚠️ IMPORTANT: Change this to YOUR email address (the one you used to sign up on Resend)
// With the default domain (onboarding@resend.dev), you can ONLY send to yourself
const TEST_RECIPIENT = "your-email@example.com"; // ← CHANGE THIS!

async function testResend() {
  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║          🧪 Testing Resend Email Configuration              ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  // Check configuration
  console.log("📋 Configuration Check:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (!RESEND_API_KEY) {
    console.error("❌ ERROR: RESEND_API_KEY is not set!");
    console.error("\n💡 Solution:");
    console.error("   1. Go to https://resend.com/api-keys");
    console.error("   2. Create an API key");
    console.error("   3. Add to .env.local:");
    console.error("      RESEND_API_KEY=re_your_api_key_here");
    console.error("      RESEND_FROM=onboarding@resend.dev\n");
    process.exit(1);
  }

  console.log(`✅ API Key: ${RESEND_API_KEY.slice(0, 15)}...${RESEND_API_KEY.slice(-4)}`);
  console.log(`✅ From Email: ${RESEND_FROM}`);
  console.log(`📧 Test Recipient: ${TEST_RECIPIENT}`);

  if (TEST_RECIPIENT === "your-email@example.com") {
    console.error("\n❌ ERROR: Please update TEST_RECIPIENT with your actual email!\n");
    console.error("💡 Open scripts/test-resend.ts and change line 28:");
    console.error("   const TEST_RECIPIENT = \"your-actual-email@gmail.com\";\n");
    process.exit(1);
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Initialize Resend
  const resend = new Resend(RESEND_API_KEY);

  // Prepare test email
  const now = new Date();
  const timestamp = now.toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
    dateStyle: "full",
    timeStyle: "long",
  });

  console.log("📤 Sending test email...\n");

  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM,
      to: TEST_RECIPIENT,
      subject: `✅ Test Email from SATE-ITIK - ${now.toLocaleTimeString()}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 10px;
                padding: 40px;
                text-align: center;
                color: white;
              }
              .success-icon {
                font-size: 64px;
                margin-bottom: 20px;
              }
              h1 {
                margin: 0 0 10px 0;
                font-size: 28px;
              }
              .info-box {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                text-align: left;
              }
              .info-row {
                margin: 10px 0;
                padding: 8px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.3);
              }
              .info-row:last-child {
                border-bottom: none;
              }
              .label {
                font-weight: bold;
                opacity: 0.9;
              }
              .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.3);
                font-size: 14px;
                opacity: 0.8;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="success-icon">✅</div>
              <h1>Email Configuration Successful!</h1>
              <p>Your Resend email setup is working correctly.</p>

              <div class="info-box">
                <div class="info-row">
                  <span class="label">Sent via:</span> Resend API
                </div>
                <div class="info-row">
                  <span class="label">From:</span> ${RESEND_FROM}
                </div>
                <div class="info-row">
                  <span class="label">To:</span> ${TEST_RECIPIENT}
                </div>
                <div class="info-row">
                  <span class="label">Timestamp:</span> ${timestamp}
                </div>
                <div class="info-row">
                  <span class="label">System:</span> SATE-ITIK Ticketing System
                </div>
              </div>

              <div class="footer">
                <p><strong>What's Next?</strong></p>
                <p>Your email system is ready! When users create tickets, they will automatically receive confirmation emails.</p>
                <p style="margin-top: 20px; font-size: 12px;">
                  This is a test email from the SATE-ITIK ticketing system.<br>
                  If you didn't request this, you can safely ignore it.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("❌ Failed to send email!\n");
      console.error("Error details:");
      console.error(JSON.stringify(error, null, 2));
      console.error("\n💡 Common issues:");
      console.error("   - Invalid API key (check your Resend dashboard)");
      console.error("   - Wrong sender email (use onboarding@resend.dev for testing)");
      console.error("   - Rate limit exceeded (free tier: 100 emails/day)\n");
      process.exit(1);
    }

    console.log("✅ Email sent successfully!\n");
    console.log("📬 Email Details:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log(`   Email ID: ${data?.id}`);
    console.log(`   From: ${RESEND_FROM}`);
    console.log(`   To: ${TEST_RECIPIENT}`);
    console.log(`   Status: Sent`);

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("📥 Next Steps:");
    console.log("   1. Check your inbox: " + TEST_RECIPIENT);
    console.log("   2. If not in inbox, check SPAM folder");
    console.log("   3. Verify email received and looks good");
    console.log("   4. Mark as 'Not Spam' if needed");
    console.log("\n💡 Note: With onboarding@resend.dev, you can only send to");
    console.log("   the email you used to sign up on Resend.\n");
    console.log("🎉 Your email system is ready to use!\n");

    // Show link to Resend dashboard
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("📊 Track this email:");
    console.log("   https://resend.com/emails/" + data?.id);
    console.log("\n");

  } catch (error) {
    console.error("❌ Unexpected error occurred!\n");
    console.error(error);
    console.error("\n💡 Make sure:");
    console.error("   - You have internet connection");
    console.error("   - Resend API is accessible");
    console.error("   - Your API key is valid\n");
    process.exit(1);
  }
}

// Run the test
console.log("\n");
testResend()
  .then(() => {
    console.log("✅ Test completed successfully!\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  });
