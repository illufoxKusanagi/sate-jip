# Native Ticketing System - Prerequisites Checklist

## 📋 Pre-Development Checklist

Before starting the ticketing system, ensure you have everything ready.

---

## ✅ System Requirements

### Hardware
- [x] **RAM**: Minimum 8GB (16GB recommended for development)
- [x] **Storage**: At least 5GB free space for project
- [x] **CPU**: Multi-core processor recommended

### Software
- [x] **Node.js**: 18.0.0 or higher
  ```bash
  node --version  # Should be v18+ or v20+
  ```
- [x] **npm/yarn/pnpm**: Latest version
  ```bash
  npm --version
  ```
- [x] **MySQL**: 8.0 or higher
  ```bash
  mysql --version
  ```
- [x] **Git**: For version control
  ```bash
  git --version
  ```

---

## 📦 NPM Packages to Install

### Core Dependencies (Must Install)

```bash
# File Upload
npm install uploadthing@^6.0.0 @uploadthing/react@^6.0.0

# Rich Text Editor
npm install @tiptap/react@^2.1.0 \
            @tiptap/starter-kit@^2.1.0 \
            @tiptap/extension-link@^2.1.0 \
            @tiptap/extension-image@^2.1.0 \
            @tiptap/extension-placeholder@^2.1.0

# Email (Choose ONE)
# Option 1: Resend (Recommended - easier setup)
npm install resend@^3.0.0

# Option 2: Nodemailer (More flexible)
npm install nodemailer@^6.9.0
npm install -D @types/nodemailer

# Date Utilities
npm install date-fns@^3.0.0

# ID Generation (if not already installed)
npm install nanoid@^5.0.0
```

### Optional Dependencies (Enhanced Features)

```bash
# Real-time Updates (Phase 3)
npm install pusher@^5.2.0 pusher-js@^8.4.0

# Charts & Analytics
npm install recharts@^2.10.0

# PDF Generation
npm install jspdf@^2.5.0 html2canvas@^1.4.0

# Markdown Support
npm install react-markdown@^9.0.0 remark-gfm@^4.0.0

# Excel Export
npm install xlsx@^0.18.0

# Code Syntax Highlighting (for technical support)
npm install react-syntax-highlighter@^15.5.0
npm install -D @types/react-syntax-highlighter
```

---

## 🔐 Environment Variables

Create or update `.env.local`:

```bash
# ==============================================
# TICKETING SYSTEM CONFIGURATION
# ==============================================

# --- Email Configuration ---
# For Gmail SMTP:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password  # Use App Password, not regular password
SMTP_FROM=support@yourdomain.com
SMTP_FROM_NAME="Your Company Support"

# Alternative: Resend API (Recommended)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM=support@yourdomain.com

# --- File Upload (UploadThing) ---
UPLOADTHING_SECRET=sk_live_xxxxxxxxxxxxxxxxxxxxx
UPLOADTHING_APP_ID=xxxxxxxxxxxxx
NEXT_PUBLIC_UPLOADTHING_APP_ID=xxxxxxxxxxxxx

# Upload Limits
NEXT_PUBLIC_MAX_FILE_SIZE=10485760  # 10MB in bytes
NEXT_PUBLIC_MAX_FILES_PER_TICKET=5
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/*,application/pdf,.doc,.docx,.txt,.log

# --- Ticket Configuration ---
NEXT_PUBLIC_TICKET_PREFIX=TKT
NEXT_PUBLIC_TICKETS_PER_PAGE=20
NEXT_PUBLIC_ENABLE_PUBLIC_SUBMISSION=true
NEXT_PUBLIC_ENABLE_EMAIL_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_FILE_ATTACHMENTS=true

# --- Real-time Updates (Pusher - Optional) ---
NEXT_PUBLIC_PUSHER_KEY=xxxxxxxxxxxxxxxxxxxxx
PUSHER_SECRET=xxxxxxxxxxxxxxxxxxxxx
PUSHER_APP_ID=xxxxxxxxxxxxx
NEXT_PUBLIC_PUSHER_CLUSTER=ap1  # or your region

# --- Admin Configuration ---
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_NOTIFICATION_EMAIL=admin@yourdomain.com

# --- Feature Flags ---
ENABLE_KNOWLEDGE_BASE=false
ENABLE_TICKET_RATING=true
ENABLE_SLA_TRACKING=false
ENABLE_AUTO_ASSIGNMENT=false

# --- Security ---
RATE_LIMIT_TICKET_SUBMISSION=10  # Max tickets per hour per IP
RATE_LIMIT_WINDOW_MS=3600000     # 1 hour in milliseconds
```

---

## 🌐 Third-Party Service Accounts

### 1. Email Service (Choose ONE)

#### Option A: Resend (Recommended) ⭐

**Why Resend?**
- ✅ Easy setup (5 minutes)
- ✅ Generous free tier (3,000 emails/month)
- ✅ Built for developers
- ✅ Excellent documentation
- ✅ Better deliverability than SMTP

**Setup Steps:**
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use their test domain)
3. Create API key
4. Add to `.env.local`

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM=support@yourdomain.com
```

**Pricing:** Free up to 3,000 emails/month, then $20/month for 50,000 emails

#### Option B: Gmail SMTP

**Setup Steps:**
1. Enable 2FA on your Gmail account
2. Generate App Password:
   - Go to Google Account → Security
   - Search "App passwords"
   - Create new app password for "Mail"
3. Use credentials in `.env.local`

```bash
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # 16-character app password
```

**Limitations:**
- ⚠️ 500 emails/day limit
- ⚠️ Might be flagged as spam
- ⚠️ Not recommended for production

#### Option C: SendGrid / Mailgun / Amazon SES

Similar to Resend but with different pricing:
- **SendGrid**: Free 100 emails/day
- **Mailgun**: Free 5,000 emails/month
- **Amazon SES**: $0.10 per 1,000 emails

### 2. File Upload (UploadThing)

**Why UploadThing?**
- ✅ Built for Next.js
- ✅ Free 2GB storage
- ✅ Automatic image optimization
- ✅ No S3 configuration needed

**Setup Steps:**
1. Sign up at [uploadthing.com](https://uploadthing.com)
2. Create new app
3. Get API credentials
4. Add to `.env.local`

```bash
UPLOADTHING_SECRET=sk_live_xxxxxxxxxxxxxxxxxxxxx
UPLOADTHING_APP_ID=xxxxxxxxxxxxx
```

**Alternative: AWS S3**
If you prefer S3, you'll need:
```bash
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

### 3. Real-time Updates (Pusher - Optional)

**When do you need this?**
- Multiple admin users working simultaneously
- Want instant updates without page refresh
- Building collaborative features

**Setup Steps:**
1. Sign up at [pusher.com](https://pusher.com)
2. Create new app
3. Get credentials
4. Add to `.env.local`

**Free Tier:** 200K messages/day, 100 concurrent connections

**Alternative:** Socket.io (self-hosted, free but requires setup)

---

## 🗄️ Database Setup

### MySQL Database Preparation

```sql
-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS your_database_name 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- Create dedicated user for ticketing (recommended)
CREATE USER 'ticketing_user'@'localhost' IDENTIFIED BY 'strong_password_here';

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON your_database_name.* TO 'ticketing_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SHOW GRANTS FOR 'ticketing_user'@'localhost';
```

### Connection String

Update your `DATABASE_URL` in `.env`:
```bash
DATABASE_URL="mysql://ticketing_user:strong_password_here@localhost:3306/your_database_name"
```

### Test Connection

```bash
# Using MySQL CLI
mysql -u ticketing_user -p -h localhost your_database_name

# Or test with Node.js
node -e "
const mysql = require('mysql2/promise');
mysql.createConnection(process.env.DATABASE_URL)
  .then(() => console.log('✅ Connected!'))
  .catch(err => console.error('❌ Error:', err));
"
```

---

## 🛠️ Development Tools (Optional but Recommended)

### VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",  // Works with Drizzle too
    "mtxr.sqltools",
    "mtxr.sqltools-driver-mysql",
    "formulahendry.auto-rename-tag",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

### MySQL GUI Tools (Choose ONE)

- **TablePlus** (Mac/Windows) - $89 lifetime, best UX
- **MySQL Workbench** - Free, official
- **DBeaver** - Free, open source
- **phpMyAdmin** - Free, web-based

### API Testing

- **Postman** - Full-featured, popular
- **Insomnia** - Lightweight alternative
- **Thunder Client** - VS Code extension
- **curl** - Command line

---

## 📱 Browser Requirements

### For Development
- Chrome/Edge (DevTools)
- Firefox (Optional)

### For Testing
- [x] Chrome (Latest)
- [x] Firefox (Latest)
- [ ] Safari (Latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔒 Security Setup

### 1. Gmail App Password (if using Gmail SMTP)

**Steps:**
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification → Enable
3. Security → App passwords
4. Generate new password for "Mail"
5. Copy 16-character password
6. Add to `.env.local` as `SMTP_PASSWORD`

### 2. Domain Verification (for Email)

For production email:
1. Add SPF record to DNS:
   ```
   v=spf1 include:_spf.resend.com ~all
   ```

2. Add DKIM record (provided by email service)

3. Add DMARC record:
   ```
   v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
   ```

### 3. CORS Configuration

Add to `next.config.ts`:
```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: process.env.NEXT_PUBLIC_APP_URL || "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
    ];
  },
};
```

---

## 🧪 Testing Prerequisites

### Sample Data for Testing

```sql
-- Test user account
INSERT INTO users (id, email, name, role) VALUES
  ('test-admin-1', 'admin@test.com', 'Test Admin', 'admin'),
  ('test-user-1', 'user@test.com', 'Test User', 'user');

-- Test ticket categories (run after schema migration)
-- Refer to seed-ticket-categories.ts script
```

### Test Email Address

Set up a test email to receive notifications:
- Use [mailtrap.io](https://mailtrap.io) (free testing inbox)
- Use [ethereal.email](https://ethereal.email) (temporary email)
- Use Gmail with filters to separate test emails

---

## 📚 Knowledge Prerequisites

### Must Know ✅
- [x] TypeScript basics
- [x] React/Next.js fundamentals
- [x] SQL queries (SELECT, INSERT, UPDATE, DELETE)
- [x] REST API concepts
- [x] Form handling & validation

### Should Learn 📖
- [ ] Email protocols (SMTP basics)
- [ ] File upload best practices
- [ ] Rich text editor usage
- [ ] WebSocket basics (if using real-time)
- [ ] Rate limiting concepts

### Nice to Have 🎯
- [ ] Testing (Jest, React Testing Library)
- [ ] Docker basics
- [ ] CI/CD concepts
- [ ] Monitoring & logging

---

## 📋 Pre-Development Checklist

### Before You Start Coding

- [ ] All NPM packages installed (`npm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] Database created and accessible
- [ ] Email service account created (Resend/Gmail)
- [ ] File upload service account created (UploadThing)
- [ ] MySQL GUI tool installed
- [ ] API testing tool ready (Postman/Thunder Client)
- [ ] Git repository initialized
- [ ] README updated with new features

### Quick Test

Run this command to verify everything:

```bash
# Test database connection
npm run db:push

# Test Next.js server
npm run dev

# Test email (create test script)
node scripts/test-email.js

# Test file upload (create test page)
# Visit http://localhost:3000/test-upload
```

---

## 🚨 Common Setup Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:**
```bash
# Check MySQL is running
sudo systemctl status mysql  # Linux
brew services list | grep mysql  # Mac

# Test connection manually
mysql -u root -p

# Verify DATABASE_URL format
mysql://user:password@localhost:3306/database
```

### Issue: "SMTP authentication failed"
**Solution:**
- Gmail: Use App Password, not regular password
- Enable "Less secure app access" (not recommended)
- Switch to Resend (easier)

### Issue: "Module not found: Can't resolve 'uploadthing'"
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or clear Next.js cache
rm -rf .next
npm run dev
```

### Issue: "Prisma/Drizzle schema not found"
**Solution:**
```bash
# Generate Drizzle schema
npm run db:generate

# Push to database
npm run db:push

# Verify tables exist
mysql -u root -p your_database -e "SHOW TABLES;"
```

---

## ✅ Final Checklist

Before proceeding to implementation:

### Essential ✅
- [ ] Node.js 18+ installed
- [ ] MySQL 8+ running
- [ ] All core packages installed
- [ ] `.env.local` configured
- [ ] Database connection working
- [ ] Email service setup (Resend/Gmail)
- [ ] File upload service setup (UploadThing)

### Recommended ⭐
- [ ] MySQL GUI tool installed
- [ ] API testing tool ready
- [ ] VS Code extensions installed
- [ ] Git repository initialized
- [ ] Test email configured

### Optional 🎯
- [ ] Pusher account (real-time)
- [ ] Domain verified for emails
- [ ] Monitoring tools setup
- [ ] CI/CD pipeline ready

---

## 🎯 Next Steps

Once everything is checked off:

1. ✅ Read `TICKETING_NATIVE_GUIDE.md` for implementation
2. ✅ Start with Phase 1 (Database Schema)
3. ✅ Follow step-by-step instructions
4. ✅ Test each feature as you build
5. ✅ Refer back to this checklist if issues arise

---

## 📞 Need Help?

**Common Resources:**
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- Drizzle ORM: [orm.drizzle.team](https://orm.drizzle.team)
- shadcn/ui: [ui.shadcn.com](https://ui.shadcn.com)
- Resend Docs: [resend.com/docs](https://resend.com/docs)
- UploadThing: [docs.uploadthing.com](https://docs.uploadthing.com)

**Troubleshooting:**
- Check existing `TROUBLESHOOTING.md` in your project
- Search GitHub Issues for similar problems
- Stack Overflow with specific error messages
- Next.js Discord community

---

**✅ Prerequisites Complete? → Start Building!**

Proceed to `TICKETING_NATIVE_GUIDE.md` Phase 1 to begin implementation.
