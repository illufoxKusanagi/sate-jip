# 📧 Email Setup Guide - Gmail to Resend Migration

## 🎯 Strategy Overview

**Development (Now):** Use Gmail SMTP for immediate testing  
**Production (Later):** Switch to Resend once domain is verified

This approach gives you:
- ✅ Start coding immediately
- ✅ Test email features during development
- ✅ Easy one-line switch to production
- ✅ No downtime waiting for DNS

---

## 📋 Step 1: Set Up Gmail App Password (5 minutes)

### 1. Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Wait a few minutes for it to activate

### 2. Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and **Other (Custom name)**
3. Enter: "Ticketing System Dev"
4. Click **Generate**
5. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### 3. Update .env.local

Replace these lines in your `.env.local`:

```bash
USE_SMTP=true
SMTP_USER=your-gmail@gmail.com        # Your Gmail address
SMTP_PASSWORD=abcd efgh ijkl mnop     # The 16-char app password
SMTP_FROM=your-gmail@gmail.com        # Same as SMTP_USER
```

**Example:**
```bash
USE_SMTP=true
SMTP_USER=ariefsatria2409@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
SMTP_FROM=ariefsatria2409@gmail.com
```

---

## ✅ Step 2: Test Email Setup

Run the test script:

```bash
npx tsx scripts/test-email.ts
```

**Expected Output:**
```
🔍 Testing Email Configuration...
==================================================
📧 Email Service: SMTP
   Host: smtp.gmail.com
   User: your-gmail@gmail.com
   From: your-gmail@gmail.com
==================================================

📨 Test 1: Sending Ticket Created Email...
✅ Test 1 passed! Message ID: <...>

📨 Test 2: Sending Reply Email...
✅ Test 2 passed! Message ID: <...>

📨 Test 3: Sending Status Change Email...
✅ Test 3 passed! Message ID: <...>

==================================================
🎉 All email tests passed successfully!
==================================================
✅ Email system is ready for development!
📧 Using: SMTP

💡 Tip: Check your inbox at your-gmail@gmail.com
```

**Check your email** - You should receive 3 test emails with beautiful HTML templates!

---

## 🚀 Step 3: Use in Your Code

The system automatically detects which service to use based on environment variables.

### In API Routes (Example):

```typescript
import { sendEmail } from "@/lib/email";
import { ticketCreatedEmail } from "@/lib/email/templates";

// Create ticket...
const newTicket = { /* ... */ };

// Send email - automatically uses Gmail (dev) or Resend (prod)
await sendEmail({
  to: customerEmail,
  subject: `Ticket #${ticketNumber} Created`,
  html: ticketCreatedEmail({
    ticketNumber,
    subject: ticketSubject,
    customerName: customerName,
  }),
});
```

That's it! The system handles Gmail or Resend automatically.

---

## 🔄 Step 4: Switch to Resend (Later in Production)

When your Resend domain is verified (shows green in dashboard):

### Option A: One-Line Change (Recommended)

Just change one line in `.env.local`:

```bash
# Change from:
USE_SMTP=true

# To:
USE_SMTP=false
```

That's it! All emails will now use Resend.

### Option B: Environment-Based (Best for Deployment)

Set in your hosting platform (Vercel, etc.):

**Development (.env.local):**
```bash
USE_SMTP=true  # Uses Gmail
```

**Production (Vercel/Hosting):**
```bash
USE_SMTP=false  # Uses Resend
# or just omit USE_SMTP entirely
```

No code changes needed!

---

## 🎨 Email Templates Available

Three beautiful, responsive templates are ready:

### 1. Ticket Created Email
```typescript
ticketCreatedEmail({
  ticketNumber: "TKT-2410-0001",
  subject: "Cannot login",
  customerName: "John Doe",
})
```

### 2. Reply Email
```typescript
ticketReplyEmail({
  ticketNumber: "TKT-2410-0001",
  subject: "Cannot login",
  customerName: "John Doe",
  replyMessage: "We've fixed your issue...",
  staffName: "Support Agent",
})
```

### 3. Status Change Email
```typescript
ticketStatusChangedEmail({
  ticketNumber: "TKT-2410-0001",
  subject: "Cannot login",
  customerName: "John Doe",
  oldStatus: "open",
  newStatus: "resolved",
})
```

---

## 🔍 Troubleshooting

### Error: "Invalid credentials"
- ✅ Make sure you're using **App Password**, not your regular Gmail password
- ✅ Remove any spaces from the app password
- ✅ Ensure 2FA is enabled on your Google account

### Error: "Username and Password not accepted"
- ✅ Wait a few minutes after generating app password
- ✅ Try generating a new app password
- ✅ Make sure SMTP_USER is your full Gmail address

### Emails going to spam
- ✅ Normal during development
- ✅ In production with Resend + verified domain, deliverability is excellent

### Want to test both services?
```bash
# Test Gmail
USE_SMTP=true npx tsx scripts/test-email.ts

# Test Resend (once domain verified)
USE_SMTP=false npx tsx scripts/test-email.ts
```

---

## 📊 Comparison: Gmail vs Resend

| Feature            | Gmail SMTP (Dev)      | Resend (Prod)       |
| ------------------ | --------------------- | ------------------- |
| **Setup Time**     | 5 minutes             | 24-48 hours (DNS)   |
| **Daily Limit**    | 500 emails/day        | 3,000/month free    |
| **Deliverability** | Good (may go to spam) | Excellent           |
| **Cost**           | Free                  | Free up to 3k/month |
| **Professional**   | Uses your Gmail       | Custom domain       |
| **Best For**       | Development           | Production          |

---

## ✅ Checklist

**For Development (Now):**
- [ ] Enable 2FA on Gmail
- [ ] Generate App Password
- [ ] Update `.env.local` with SMTP credentials
- [ ] Run `npx tsx scripts/test-email.ts`
- [ ] Verify 3 test emails received
- [ ] Start building ticketing system!

**For Production (Later):**
- [ ] Wait for Resend DNS to verify (check dashboard)
- [ ] Change `USE_SMTP=false` in production environment
- [ ] Test email in production
- [ ] Done!

---

## 🎯 Next Steps

**Your email system is ready!** Now you can:

1. ✅ **Start building** the ticketing system (Phase 1, Week 1)
2. ✅ **Test emails** during development using Gmail
3. ✅ **Switch to Resend** when domain is verified (one line change)

**Follow the guide:** `docs/TICKETING_NATIVE_GUIDE.md`  
**Start at:** Phase 1 > Week 1 > Day 1: Database Schema

---

**Questions?** The email system is production-ready and will work seamlessly in both development and production!
