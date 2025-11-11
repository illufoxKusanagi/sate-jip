# 🚀 Quick Email Setup - 5 Minutes

## Step 1: Get Resend API Key (2 minutes)

1. Go to https://resend.com and sign up (FREE!)
2. Go to **API Keys** → **Create API Key**
3. Copy the key (looks like: `re_xxxxx`)

## Step 2: Configure Your App (1 minute)

Add to `.env.local`:

```bash
RESEND_API_KEY=re_your_actual_key_here
RESEND_FROM=onboarding@resend.dev
```

## Step 3: Test Email (1 minute)

1. Open `scripts/test-resend.ts`
2. Change line 28:
   ```typescript
   const TEST_RECIPIENT = "your-actual-email@gmail.com"; // ← YOUR EMAIL!
   ```

3. Run test:
   ```bash
   npm run test:resend
   ```

4. Check your email! ✅

## Step 4: Try Creating a Ticket (1 minute)

1. Start app: `npm run dev`
2. Go to ticket form (e.g., `/submit-ticket`)
3. Fill form with YOUR email address
4. Submit
5. Check your email - you should get "Ticket Created" email! 🎉

---

## ⚠️ IMPORTANT

With `onboarding@resend.dev`, you can **ONLY** send emails to:
- The email you used to sign up on Resend

To send to anyone:
- Verify your own domain in Resend
- Change `RESEND_FROM=support@yourdomain.com`

---

## 📧 When Are Emails Sent?

✅ **Automatically sent:**

1. **New ticket created** → Email to customer
2. **Staff replies** → Email to customer
3. **Status changed** → Email to customer

❌ **NOT sent:**

- To staff members (not implemented yet)
- CC/BCC (not implemented yet)

---

## 🆘 Troubleshooting

**No email received?**
- Check SPAM folder
- Make sure you used YOUR Resend signup email
- Check console for errors
- Run `npm run test:resend` to debug

**"Missing API key" error?**
- Check `.env.local` has `RESEND_API_KEY`
- Restart dev server: `npm run dev`

---

**Need more help?** Read `EMAIL-SETUP-GUIDE.md` for detailed instructions.
