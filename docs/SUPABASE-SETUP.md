# Supabase Setup Guide

Complete guide for deploying your application with Supabase (PostgreSQL) and Vercel.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Create Supabase Project](#create-supabase-project)
3. [Get Database Credentials](#get-database-credentials)
4. [Configure Vercel Environment Variables](#configure-vercel-environment-variables)
5. [Run Database Migrations](#run-database-migrations)
6. [Deploy to Vercel](#deploy-to-vercel)
7. [Verify Deployment](#verify-deployment)
8. [Troubleshooting](#troubleshooting)
9. [Optional Features](#optional-features)

---

## Prerequisites

Before you begin, make sure you have:

- ✅ A [Supabase](https://supabase.com) account (free tier is fine)
- ✅ A [Vercel](https://vercel.com) account
- ✅ Your project connected to a Git repository (GitHub, GitLab, or Bitbucket)
- ✅ [Node.js](https://nodejs.org) installed locally (v18 or higher)
- ✅ A [Resend](https://resend.com) account for email functionality

---

## Create Supabase Project

### Step 1: Sign up and Create Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"New Project"**
3. Sign in with GitHub (recommended) or email
4. Create a new organization (if you don't have one)

### Step 2: Project Configuration

Fill in the project details:

```
Project Name: sate-itik-db (or your preferred name)
Database Password: [Use a strong password - SAVE THIS!]
Region: Select closest to your users
  - Southeast Asia (Singapore) - asia-southeast1
  - US East (North Virginia) - us-east-1
  - Europe (Frankfurt) - eu-central-1
Pricing Plan: Free (sufficient for development/small apps)
```

### Step 3: Wait for Initialization

- The project takes **~2 minutes** to set up
- You'll see a progress indicator
- Don't close the browser tab during initialization

---

## Get Database Credentials

### Connection Pooler (Recommended for Vercel)

Supabase provides two types of connections:

1. **Connection Pooler** - Best for serverless (Vercel) ✅
2. **Direct Connection** - Best for long-running servers

For Vercel deployment, always use the **Connection Pooler**!

### How to Get Connection String

1. Go to your Supabase project dashboard
2. Click **Project Settings** (gear icon in sidebar)
3. Navigate to **Database** section
4. Scroll down to **Connection String**
5. Select **URI** tab
6. Copy the connection string

**Example Connection String:**
```
postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**Important:** Replace `[YOUR-PASSWORD]` with your actual database password!

### Connection String Breakdown

```
postgresql://                              # Protocol
postgres.xxxxxxxxxxxxx                     # Username (auto-generated)
:[YOUR-PASSWORD]                           # Your database password
@aws-0-ap-southeast-1.pooler.supabase.com  # Pooler hostname
:6543                                      # Pooler port (not 5432!)
/postgres                                  # Database name
```

### Save These Credentials

Create a secure note with:

```bash
# Supabase Credentials
Project Reference: xxxxxxxxxxxxx
Database Password: your-strong-password-here
Pooler URL: postgresql://postgres.xxxxxxxxxxxxx:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
Direct URL: postgresql://postgres.xxxxxxxxxxxxx:PASSWORD@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

---

## Configure Vercel Environment Variables

### Step 1: Go to Vercel Dashboard

1. Open [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Required Variables

Click **"Add New"** and add each of these:

#### Database Configuration

```bash
# Variable Name: DB_TYPE
# Value: postgres
# Environments: ✅ Production ✅ Preview ✅ Development

# Variable Name: DATABASE_URL
# Value: postgresql://postgres.xxxxxxxxxxxxx:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
# Environments: ✅ Production ✅ Preview ✅ Development
```

#### Authentication

```bash
# Variable Name: JWT_SECRET
# Value: [Generate a strong random string - see below]
# Environments: ✅ Production ✅ Preview ✅ Development
```

**Generate JWT Secret:**
```bash
# Run this in your terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use:
openssl rand -hex 32
```

#### Email Service (Resend)

```bash
# Variable Name: RESEND_API_KEY
# Value: re_xxxxxxxxxxxxx
# Environments: ✅ Production ✅ Preview ✅ Development

# Variable Name: RESEND_FROM
# Value: onboarding@resend.dev (for testing) or noreply@yourdomain.com (for production)
# Environments: ✅ Production ✅ Preview ✅ Development
```

**Get Resend API Key:**
1. Go to [https://resend.com/api-keys](https://resend.com/api-keys)
2. Click **"Create API Key"**
3. Name it: "Vercel Production"
4. Copy the key (starts with `re_`)

#### Application URL

```bash
# Variable Name: NEXT_PUBLIC_APP_URL
# Value: https://your-app-name.vercel.app
# Environments: ✅ Production ✅ Preview ✅ Development
```

#### Optional: File Upload (UploadThing)

```bash
# Variable Name: UPLOADTHING_SECRET
# Value: sk_live_xxxxxxxxxxxxx
# Environments: ✅ Production ✅ Preview ✅ Development

# Variable Name: UPLOADTHING_APP_ID
# Value: xxxxxxxxxxxxx
# Environments: ✅ Production ✅ Preview ✅ Development
```

**Get UploadThing Credentials:**
1. Go to [https://uploadthing.com/dashboard](https://uploadthing.com/dashboard)
2. Create an app or select existing one
3. Copy App ID and Secret Key

#### Optional: Maps (Mapbox)

```bash
# Variable Name: NEXT_PUBLIC_MAPBOX_TOKEN
# Value: pk.xxxxxxxxxxxxx
# Environments: ✅ Production ✅ Preview ✅ Development

# Variable Name: NEXT_PUBLIC_MAPBOX_SESSION_TOKEN
# Value: sk.xxxxxxxxxxxxx
# Environments: ✅ Production ✅ Preview ✅ Development
```

### Complete Environment Variables Checklist

- [ ] `DB_TYPE=postgres`
- [ ] `DATABASE_URL=postgresql://...`
- [ ] `JWT_SECRET=...`
- [ ] `RESEND_API_KEY=re_...`
- [ ] `RESEND_FROM=onboarding@resend.dev`
- [ ] `NEXT_PUBLIC_APP_URL=https://...`
- [ ] `UPLOADTHING_SECRET=sk_...` (optional)
- [ ] `UPLOADTHING_APP_ID=...` (optional)
- [ ] `NEXT_PUBLIC_MAPBOX_TOKEN=pk_...` (optional)

---

## Run Database Migrations

**Important:** Run migrations BEFORE deploying to Vercel!

### Step 1: Update Local Environment

Create or update `.env.local` with Supabase credentials:

```bash
# Copy this to .env.local
DB_TYPE=postgres
DATABASE_URL=postgresql://postgres.xxxxxxxxxxxxx:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

# Other variables (same as Vercel)
JWT_SECRET=your-generated-secret
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM=onboarding@resend.dev
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Generate Migrations

```bash
# Generate PostgreSQL migrations
npm run db:generate:postgres
```

This creates migration files in `drizzle/postgres/` folder.

### Step 3: Run Migrations on Supabase

```bash
# Apply migrations to Supabase database
npm run db:migrate
```

You should see:
```
✅ Using PostgreSQL database
✅ Migrations applied successfully
```

### Step 4: Seed Database (Optional)

```bash
# Add sample data (admins, locations, tickets, etc.)
DB_TYPE=postgres npm run db:seed
```

This will:
- Create admin users
- Add sample locations
- Create ticket categories
- Add sample tickets and replies
- Add sample server data

### Step 5: Verify in Supabase Dashboard

1. Go to Supabase Dashboard
2. Click **Table Editor** in sidebar
3. You should see all your tables:
   - `admins`
   - `users`
   - `locations`
   - `tickets`
   - `ticket_categories`
   - `ticket_replies`
   - `ticket_attachments`
   - `server_data`
   - `activity_calendar`
   - `answer_config`

---

## Deploy to Vercel

### Option 1: Auto Deploy (Recommended)

If your project is connected to Git:

```bash
# Commit and push your changes
git add .
git commit -m "Add Supabase integration"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Build your app
3. Deploy to production
4. Use environment variables you set

### Option 2: Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Option 3: Deploy via Vercel Dashboard

1. Go to your Vercel project
2. Click **Deployments** tab
3. Click **"Redeploy"** on the latest deployment
4. Select **"Use existing Build Cache"** = No
5. Click **"Redeploy"**

---

## Verify Deployment

### Check 1: Deployment Logs

1. Go to Vercel project → **Deployments**
2. Click on the latest deployment
3. Check **Build Logs** for errors
4. Look for:
   ```
   ✅ Using PostgreSQL database
   ✓ Compiled successfully
   ```

### Check 2: Visit Your App

1. Open your deployed URL: `https://your-app.vercel.app`
2. Try to access the login page
3. Check if the app loads without errors

### Check 3: Test Login

1. Go to `/login`
2. Try logging in with seeded admin account:
   ```
   Username: admin
   Password: admin123
   ```
   (If you ran the seed command)

### Check 4: Test Database Connection

1. Create a test ticket
2. Check if it saves to database
3. Verify in Supabase Table Editor

### Check 5: Test Email Functionality

1. Create a ticket
2. Check if notification email is sent
3. Check Resend dashboard for email logs

### Check 6: Check Vercel Function Logs

1. Go to Vercel project → **Logs**
2. Look for any database connection errors
3. Check for successful queries

---

## Troubleshooting

### Error: "Failed to connect to database"

**Cause:** Wrong connection string or firewall issue

**Solution:**
1. Verify `DATABASE_URL` in Vercel environment variables
2. Make sure you're using the **Pooler URL** (port 6543, not 5432)
3. Check password is correct (no special characters breaking the URL)
4. Verify Supabase project is active (not paused)

### Error: "Invalid connection string"

**Cause:** Malformed DATABASE_URL

**Solution:**
```bash
# Correct format:
postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

# Common mistakes:
# ❌ Missing password
# ❌ Using direct connection URL (port 5432)
# ❌ Special characters in password not URL-encoded
```

### Error: "Table does not exist"

**Cause:** Migrations not run

**Solution:**
```bash
# Run migrations locally pointing to Supabase
DB_TYPE=postgres npm run db:migrate
```

### Error: "Too many connections"

**Cause:** Exceeding Supabase connection limit (free tier: 60 connections)

**Solution:**
1. Use **Connection Pooler** (you should already be using this)
2. Check for connection leaks in your code
3. Upgrade Supabase plan if needed
4. Reduce concurrent users/requests

### Build Error: "Module not found"

**Cause:** Missing dependencies

**Solution:**
```bash
# Make sure postgres package is installed
npm install postgres

# Redeploy
git add package.json package-lock.json
git commit -m "Add postgres dependency"
git push
```

### Error: "Database timeout"

**Cause:** Slow queries or database not responding

**Solution:**
1. Check Supabase project status
2. Verify network connectivity
3. Optimize slow queries
4. Check Supabase dashboard for alerts

### Email Not Sending

**Cause:** Missing or invalid Resend API key

**Solution:**
1. Verify `RESEND_API_KEY` in Vercel env vars
2. Check API key is valid in Resend dashboard
3. For testing, use `onboarding@resend.dev` as sender
4. Check Resend logs for error details

---

## Optional Features

### Enable Row Level Security (RLS)

Supabase has built-in RLS for additional security:

1. Go to Supabase Dashboard → **Authentication** → **Policies**
2. Enable RLS for sensitive tables
3. Create policies for your use case

**Note:** This app doesn't use Supabase Auth by default, it uses JWT tokens.

### Set Up Database Backups

Supabase Pro includes automatic backups:

1. Go to **Settings** → **Database**
2. Scroll to **Backups** section
3. Configure backup schedule
4. Download manual backup:
   ```bash
   # From Supabase dashboard
   Database → Backups → Download
   ```

### Monitor Database Performance

1. Go to **Reports** in Supabase dashboard
2. Check:
   - API requests
   - Database queries
   - Storage usage
   - Active connections

### Set Up Alerts

1. Go to **Settings** → **Integrations**
2. Connect Slack, Discord, or email
3. Get notified of:
   - High CPU usage
   - Storage limits
   - Connection limits

### Enable Database Extensions

Supabase supports PostgreSQL extensions:

1. Go to **Database** → **Extensions**
2. Enable useful extensions:
   - `uuid-ossp` - UUID generation
   - `pg_trgm` - Full-text search
   - `pgcrypto` - Encryption functions

### Database Connection Pooling Settings

For better performance:

1. Go to **Settings** → **Database**
2. Scroll to **Connection Pooling**
3. Adjust settings:
   ```
   Pool Mode: Transaction (recommended for serverless)
   Pool Size: 15 (default)
   Max Client Connections: 200 (Pro tier)
   ```

---

## Migration from MySQL to PostgreSQL

If you're migrating from MySQL:

### Differences to Note

1. **Auto-increment:**
   - MySQL: `AUTO_INCREMENT`
   - PostgreSQL: `SERIAL` or `uuid_default()`

2. **Date/Time:**
   - MySQL: `DATETIME`
   - PostgreSQL: `TIMESTAMP`

3. **Enum:**
   - MySQL: Inline `ENUM('a', 'b')`
   - PostgreSQL: Must define `pgEnum` first

4. **String functions:**
   - MySQL: `CONCAT()`
   - PostgreSQL: `||` operator or `CONCAT()`

### Data Migration Script

If you have existing MySQL data:

```bash
# Export from MySQL
mysqldump -u root -p sate_jip_db > mysql_dump.sql

# Install pgloader (converts MySQL to PostgreSQL)
# Ubuntu/Debian:
sudo apt-get install pgloader

# macOS:
brew install pgloader

# Migrate data
pgloader mysql://user:pass@localhost/sate_jip_db \
          postgresql://postgres:pass@aws-0-region.pooler.supabase.com:6543/postgres
```

---

## Production Checklist

Before going live:

- [ ] All environment variables set in Vercel
- [ ] Database migrations run successfully
- [ ] Admin users created
- [ ] Email sending tested
- [ ] File uploads working (if using UploadThing)
- [ ] Maps displaying correctly (if using Mapbox)
- [ ] SSL/HTTPS enabled (automatic on Vercel)
- [ ] Custom domain configured (optional)
- [ ] Database backups enabled
- [ ] Error monitoring set up (Sentry, LogRocket, etc.)
- [ ] Performance tested with realistic data
- [ ] Security headers configured
- [ ] Rate limiting implemented (if needed)

---

## Useful Commands

```bash
# Local development with Supabase
DB_TYPE=postgres npm run dev

# Generate PostgreSQL migrations
npm run db:generate:postgres

# Run migrations
npm run db:migrate

# Seed database
DB_TYPE=postgres npm run db:seed

# Open Drizzle Studio (database GUI)
DB_TYPE=postgres npm run db:studio

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

---

## Support & Resources

- **Supabase Docs:** [https://supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs:** [https://vercel.com/docs](https://vercel.com/docs)
- **Drizzle ORM Docs:** [https://orm.drizzle.team](https://orm.drizzle.team)
- **Resend Docs:** [https://resend.com/docs](https://resend.com/docs)
- **Next.js Docs:** [https://nextjs.org/docs](https://nextjs.org/docs)

### Community

- **Supabase Discord:** [https://discord.supabase.com](https://discord.supabase.com)
- **Vercel Discord:** [https://vercel.com/discord](https://vercel.com/discord)

---

## Summary

**Quick Setup:**

1. ✅ Create Supabase project
2. ✅ Get connection pooler URL
3. ✅ Set environment variables in Vercel
4. ✅ Run `npm run db:migrate` locally
5. ✅ Deploy to Vercel
6. ✅ Test your app!

**Environment Variables:**
```bash
DB_TYPE=postgres
DATABASE_URL=postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres
JWT_SECRET=your-secret
RESEND_API_KEY=re_xxxxx
RESEND_FROM=onboarding@resend.dev
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**That's it! Your app is now running on Supabase + Vercel!** 🎉

---

*Last updated: October 2024*