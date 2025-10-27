import { config } from "dotenv";
import { sendEmail, testEmailConnection, getEmailService } from "../src/lib/email";
import { ticketCreatedEmail, ticketReplyEmail, ticketStatusChangedEmail } from "../src/lib/email/templates";

// Load environment variables
config({ path: ".env.local" });

async function testEmail() {
  console.log("\n🔍 Testing Email Configuration...\n");
  console.log("=" .repeat(50));
  
  // Show which service is configured
  const service = getEmailService();
  console.log(`📧 Email Service: ${service.toUpperCase()}`);
  
  if (service === "smtp") {
    console.log(`   Host: ${process.env.SMTP_HOST}`);
    console.log(`   User: ${process.env.SMTP_USER}`);
    console.log(`   From: ${process.env.SMTP_FROM}`);
  } else if (service === "resend") {
    console.log(`   API Key: ${process.env.RESEND_API_KEY?.slice(0, 10)}...`);
    console.log(`   From: ${process.env.RESEND_FROM}`);
  }
  
  console.log("=" .repeat(50) + "\n");

  // Test connection
  const isConnected = await testEmailConnection();
  if (!isConnected && service !== "resend") {
    console.error("\n❌ Connection test failed. Please check your configuration.\n");
    return;
  }

  // Test 1: Ticket Created Email
  console.log("\n📨 Test 1: Sending Ticket Created Email...");
  const result1 = await sendEmail({
    to: "ariefsatria2409@gmail.com",
    subject: "Test: New Ticket Created - TKT-2410-0001",
    html: ticketCreatedEmail({
      ticketNumber: "TKT-2410-0001",
      subject: "Cannot access admin dashboard",
      customerName: "Arief Satria",
      description: "Getting 403 error when trying to login",
    }),
  });

  if (result1.success) {
    console.log(`✅ Test 1 passed! Message ID: ${result1.messageId}`);
  } else {
    console.error("❌ Test 1 failed:", result1.error);
    return;
  }

  // Test 2: Reply Email
  console.log("\n📨 Test 2: Sending Reply Email...");
  const result2 = await sendEmail({
    to: "ariefsatria2409@gmail.com",
    subject: "Test: New Reply on Ticket TKT-2410-0001",
    html: ticketReplyEmail({
      ticketNumber: "TKT-2410-0001",
      subject: "Cannot access admin dashboard",
      customerName: "Arief Satria",
      replyMessage: "Hi Arief,\n\nThank you for contacting us. We've reviewed your account and found the issue.\n\nYour account permissions have been updated. Please try logging in again.\n\nBest regards,\nSupport Team",
      staffName: "Support Agent",
    }),
  });

  if (result2.success) {
    console.log(`✅ Test 2 passed! Message ID: ${result2.messageId}`);
  } else {
    console.error("❌ Test 2 failed:", result2.error);
    return;
  }

  // Test 3: Status Change Email
  console.log("\n📨 Test 3: Sending Status Change Email...");
  const result3 = await sendEmail({
    to: "ariefsatria2409@gmail.com",
    subject: "Test: Ticket Status Updated - TKT-2410-0001",
    html: ticketStatusChangedEmail({
      ticketNumber: "TKT-2410-0001",
      subject: "Cannot access admin dashboard",
      customerName: "Arief Satria",
      oldStatus: "open",
      newStatus: "resolved",
    }),
  });

  if (result3.success) {
    console.log(`✅ Test 3 passed! Message ID: ${result3.messageId}`);
  } else {
    console.error("❌ Test 3 failed:", result3.error);
    return;
  }

  console.log("\n" + "=".repeat(50));
  console.log("🎉 All email tests passed successfully!");
  console.log("=".repeat(50) + "\n");
  console.log("✅ Email system is ready for development!");
  console.log(`📧 Using: ${service.toUpperCase()}`);
  console.log("\n💡 Tip: Check your inbox at ariefsatria2409@gmail.com\n");
}

testEmail().catch(console.error);
