# 📧 Email Setup Guide - Resend Configuration

This guide will help you set up email notifications for the SATE-ITIK ticketing system using Resend.

---

## 📋 Table of Contents

1. [How Email Works in This System](#how-email-works-in-this-system)
2. [Setting Up Resend for Testing](#setting-up-resend-for-testing)
3. [Configuration Steps](#configuration-steps)
4. [Testing Email Sending](#testing-email-sending)
5. [When Emails Are Sent](#when-emails-are-sent)
6. [Troubleshooting](#troubleshooting)

---

## 🔍 How Email Works in This System

The system automatically sends emails in these scenarios:

### 1. **New Ticket Created** ✉️
- **Trigger**: When a user submits a new ticket via the web form
- **Recipient**: The customer (email provided in the ticket form)
- **Email Contains**:
  - Ticket number (e.g., `TKT-250128-0001`)
  - Ticket subject
  - Confirmation message
  - Instructions for tracking the ticket

### 2. **Staff Reply to Ticket** 💬
- **Trigger**: When support staff replies to a ticket
- **Recipient**: The customer who created the ticket
- **Email Contains**:
  - Ticket number
  - Staff member's reply message
  - Link to view the ticket

### 3. **Ticket Status Changed** 🔄
- **Trigger**: When ticket status changes (open → in progress → resolved → closed)
- **Recipient**: The customer
- **Email Contains**:
  - Old status → New status
  - Ticket details
  - Next steps (if applicable)

---

## 🚀 Setting Up Resend for Testing

### Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Click **"Sign Up"** (it's FREE!)
3. Verify your email address
4. Log in to your dashboard

### Step 2: Get Your API Key

1. In the Resend dashboard, click **"API Keys"** in the left sidebar
2. Click **"Create API Key"**
3. Give it a name: `SATE-ITIK Development`
4. Select permissions: **"Sending access"**
5. Click **"Create"**
6. **COPY THE API KEY** - you won't see it again!
   - It looks like: `re_123456789abcdefghijklmnop`

### Step 3: Note the Default Sender

For testing, Resend provides a default sender email:
- **Email**: `onboarding@resend.dev`
- **No verification needed** for testing
- **Limitation**: Can only send to YOUR email address (the one you signed up with)

---

## ⚙️ Configuration Steps

### For Local Development

1. **Open your `.env.local` file** (create if it doesn't exist):

   ```bash
   # Email Configuration (Resend)
   RESEND_API_KEY=re_your_api_key_here
   RESEND_FROM=onboarding@resend.dev
   
   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. **Replace `re_your_api_key_here`** with your actual API key from Step 2

3. **Save the file**

4. **Restart your development server**:
   ```bash
   npm run dev
   ```

### For Render Deployment

1. Go to **Render Dashboard** → Your Web Service → **Environment** tab

2. Add these environment variables:
   ```
   RESEND_API_KEY=re_your_api_key_here
   RESEND_FROM=onboarding@resend.dev
   ```

3. Click **"Save Changes"**

4. Render will automatically redeploy

---

## 🧪 Testing Email Sending

### Method 1: Create a Test Ticket (Recommended)

1. **Start your app**:
   ```bash
   npm run dev
   ```

2. **Open the ticket submission form**:
   - Go to: `http://localhost:3000/submit-ticket` (or your ticket form URL)

3. **Fill out the form**:
   - **Your Name**: John Doe
   - **Email**: YOUR_ACTUAL_EMAIL@gmail.com ⚠️ **Use your Resend signup email!**
   - **Subject**: Test Ticket - Email Verification
   - **Description**: This is a test ticket to verify email sending works correctly.
   - **Category**: Select any category
   - **Priority**: Select any priority

4. **Submit the ticket**

5. **Check your email** (within 1-2 minutes):
   - Look in **Inbox** and **Spam** folder
   - You should receive: "Support Ticket Created - Ticket #TKT-XXXXXX"

### Method 2: Use the Test Script

We'll create a test script for you:

1. **Create a test file**: `scripts/test-resend.ts`

   ```typescript
   import { sendEmail } from "../src/lib/utils/ticket-utils";
   
   async function testResend() {
     console.log("🧪 Testing Resend Email...\n");
     
     console.log("📧 Configuration:");
     console.log(`   API Key: ${process.env.RESEND_API_KEY?.slice(0, 15)}...`);
     console.log(`   From: ${process.env.RESEND_FROM}\n`);
     
     console.log("📤 Sending test email...");
     
     const result = await sendEmail({
       to: "YOUR_EMAIL@gmail.com", // ⚠️ Change this to your Resend signup email
       subject: "Test Email from SATE-ITIK",
       html: `
         <h1>✅ Email Configuration Working!</h1>
         <p>If you're reading this, your Resend email configuration is set up correctly.</p>
         <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
       `,
     });
     
     if (result.success) {
       console.log("✅ Email sent successfully!");
       console.log("📬 Check your inbox (and spam folder)");
     } else {
       console.error("❌ Failed to send email:");
       console.error(result.error);
     }
   }
   
   testResend().catch(console.error);
   ```

2. **Run the test**:
   ```bash
   npx tsx scripts/test-resend.ts
   ```

3. **Check your email**

### Method 3: Use the Existing Test Script

If you have `scripts/test-email.ts`:

```bash
# Make sure your .env.local has RESEND_API_KEY and RESEND_FROM
npm run test:email
```

---

## 📬 When Emails Are Sent

### Automatic Email Triggers

| Event | Trigger Location | Email Sent To | Template Used |
|-------|-----------------|---------------|---------------|
| **Ticket Created** | `POST /api/tickets` | Customer email | `ticketCreatedEmail()` |
| **Staff Reply** | `POST /api/tickets/[id]/replies` | Customer email | `ticketReplyEmail()` |
| **Status Changed** | `PATCH /api/tickets/[id]` | Customer email | `ticketStatusChangedEmail()` |

### Email Flow Example

```
1. Customer submits ticket with email: john@example.com
   → System creates ticket #TKT-250128-0001
   → Email sent to: john@example.com
   → Subject: "Ticket #TKT-250128-0001 Created - Cannot login"

2. Staff replies to the ticket
   → Email sent to: john@example.com
   → Subject: "New Reply on Ticket #TKT-250128-0001"
   → Contains staff's reply message

3. Staff closes the ticket
   → Email sent to: john@example.com
   → Subject: "Ticket Status Updated - #TKT-250128-0001"
   → Shows status change: OPEN → CLOSED
```

---

## ⚠️ Important Testing Limitations

### With Default Domain (`onboarding@resend.dev`)

✅ **Can Do**:
- Send emails to YOUR email (the one you signed up with on Resend)
- Test email templates
- Verify email configuration works

❌ **Cannot Do**:
- Send emails to other people's email addresses
- Send emails to customers (they won't receive them)

### To Send to Anyone (Production Setup)

You need to verify your own domain:

1. **Add your domain in Resend**:
   - Go to Resend Dashboard → **Domains**
   - Click **"Add Domain"**
   - Enter your domain: `yourdomain.com`

2. **Add DNS records**:
   - Resend will show you DNS records to add
   - Add them in your domain registrar (GoDaddy, Namecheap, etc.)
   - Wait for verification (can take 1-24 hours)

3. **Update environment variable**:
   ```bash
   RESEND_FROM=support@yourdomain.com
   ```

4. **Now you can send to anyone!** 🎉

---

## 🐛 Troubleshooting

### ❌ "No email service configured"

**Problem**: `RESEND_API_KEY` is not set

**Solution**:
```bash
# Check your .env.local file
cat .env.local | grep RESEND

# Should show:
# RESEND_API_KEY=re_xxxxx
# RESEND_FROM=onboarding@resend.dev

# If missing, add them and restart:
npm run dev
```

### ❌ "Failed to send email: Missing API key"

**Problem**: API key is invalid or not loaded

**Solution**:
1. Verify API key in Resend dashboard
2. Copy a fresh API key
3. Update `.env.local`
4. Restart dev server

### ❌ Email not received

**Possible Causes**:

1. **Wrong recipient email**:
   - With `onboarding@resend.dev`, you can ONLY send to YOUR Resend signup email
   - Solution: Use your Resend account email as the recipient

2. **Email in spam folder**:
   - Check spam/junk folder
   - Mark as "Not Spam"

3. **Resend API error**:
   - Check console for error messages
   - Verify API key is correct
   - Check Resend dashboard → Logs for delivery status

### ❌ "Email sent successfully" but no email received

**Check Resend Dashboard**:
1. Go to Resend Dashboard → **Emails**
2. Look for your test email
3. Check status:
   - ✅ **Delivered** - Email was sent (check spam folder)
   - ⏳ **Queued** - Still processing
   - ❌ **Failed** - Click for error details

### 🔍 Debug Mode

Enable detailed logging:

```typescript
// In src/lib/utils/ticket-utils.ts
export async function sendEmail({ to, subject, html }: SendEmailParams) {
  console.log("📧 Attempting to send email:");
  console.log(`   To: ${to}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   API Key: ${process.env.RESEND_API_KEY?.slice(0, 10)}...`);
  
  // ... rest of the code
}
```

---

## 📊 Email Templates

The system includes 3 professional HTML email templates:

### 1. Ticket Created Email
- Blue header
- Shows ticket number prominently
- Includes subject and customer name
- Professional footer

### 2. Ticket Reply Email
- Green header
- Shows staff member's reply in a highlighted box
- Includes original ticket details

### 3. Status Changed Email
- Dynamic color based on new status
- Shows status transition with arrows
- Different messages for resolved/closed statuses

**Template Location**: `src/lib/utils/ticket-utils.ts`

---

## 🎯 Quick Start Checklist

- [ ] Created Resend account at resend.com
- [ ] Copied API key from Resend dashboard
- [ ] Added `RESEND_API_KEY` to `.env.local`
- [ ] Added `RESEND_FROM=onboarding@resend.dev` to `.env.local`
- [ ] Restarted development server (`npm run dev`)
- [ ] Created test ticket with YOUR email address
- [ ] Received email in inbox (or spam folder)
- [ ] ✅ Email system is working!

---

## 🚀 Production Checklist

For deploying to production (Render, company server):

- [ ] Verified your custom domain in Resend
- [ ] Updated `RESEND_FROM` to use your domain
- [ ] Added environment variables to production
- [ ] Tested sending to multiple email addresses
- [ ] Configured SPF/DKIM/DMARC records for better deliverability
- [ ] Set up email monitoring/logging
- [ ] Tested all 3 email templates (create, reply, status)

---

## 📞 Need Help?

- **Resend Docs**: https://resend.com/docs
- **Resend Support**: https://resend.com/support
- **Check Logs**: Look at your app console for error messages
- **Verify Config**: Use `npm run test:email` to verify setup

---

## 💡 Pro Tips

1. **Save Test Emails**: Create a dedicated email folder for test emails
2. **Whitelist Sender**: Add `onboarding@resend.dev` to contacts
3. **Monitor Logs**: Check Resend dashboard for delivery metrics
4. **Rate Limits**: Free tier allows 100 emails/day (perfect for testing!)
5. **Multiple Environments**: Use different API keys for dev/staging/production

---

**Happy Testing! 🎉**

If you see "✅ Email sent successfully" in your console and receive the email, your setup is complete!