# 🚨 URGENT FIX FOR RENDER - DO THIS NOW

## The Problem

Your app is waiting for PostgreSQL at `localhost:3306` (MySQL port!) because:
1. You have old MySQL environment variables set in Render
2. The app is reading `DB_HOST` and `DB_PORT` from old config

## ✅ SOLUTION - Follow These Steps EXACTLY

### Step 1: Go to Render Dashboard

1. Open [Render Dashboard](https://dashboard.render.com/)
2. Click on your web service (the one that's failing)
3. Click **"Environment"** tab on the left

### Step 2: DELETE These Variables (if they exist)

**IMPORTANT**: Remove these old MySQL variables:

- ❌ DELETE: `DB_HOST`
- ❌ DELETE: `DB_PORT` 
- ❌ DELETE: `DB_USER`
- ❌ DELETE: `DB_PASSWORD`
- ❌ DELETE: `DB_NAME`

Click the trash icon next to each one to delete them.

### Step 3: SET These Variables

Make sure you have EXACTLY these variables set:

```
DB_TYPE=postgres
SKIP_DB_WAIT=true
DATABASE_URL=<your PostgreSQL Internal Database URL>
```

**Where to get DATABASE_URL:**
1. In Render Dashboard, go to your PostgreSQL database
2. Scroll down to "Connections"
3. Copy the **"Internal Database URL"** (NOT External)
4. It should look like: `postgresql://username:xxxxx@dpg-xxxxx/database_name`

### Step 4: Add Other Required Variables

```
NEXT_PUBLIC_APP_URL=https://your-app-name.onrender.com
JWT_SECRET=<generate random string - see below>
RESEND_API_KEY=<your resend key>
RESEND_FROM=onboarding@resend.dev
```

**Generate JWT_SECRET:** 
- On your computer run: `openssl rand -base64 32`
- Or use any random 32+ character string

### Step 5: Push Your Code Changes

Since we fixed the entrypoint script, you need to push:

```bash
git add docker-entrypoint.sh
git commit -m "Fix entrypoint for Render PostgreSQL deployment"
git push
```

### Step 6: Verify Environment Variables

Before Render auto-deploys, double-check your Environment tab shows:

**✅ Should HAVE these:**
- `DB_TYPE` = `postgres`
- `SKIP_DB_WAIT` = `true`
- `DATABASE_URL` = `postgresql://...`
- `NEXT_PUBLIC_APP_URL` = `https://...`
- `JWT_SECRET` = (some long string)
- `RESEND_API_KEY` = `re_...`
- `RESEND_FROM` = `onboarding@resend.dev`

**❌ Should NOT have these:**
- `DB_HOST` (DELETE IT!)
- `DB_PORT` (DELETE IT!)
- `DB_USER` (DELETE IT!)
- `DB_PASSWORD` (DELETE IT!)
- `DB_NAME` (DELETE IT!)

### Step 7: Wait for Auto-Deploy

Render will automatically deploy when you push. Watch the logs.

**You should see:**
```
🚀 Starting SATE-ITIK application...
📊 Database type: postgres
⏭️  Skipping database connection wait (using managed database)
🔄 Running database migrations...
✅ Database setup complete!
🎯 Starting Next.js server...
```

**You should NOT see:**
```
⏳ Waiting for PostgreSQL at localhost:3306...  ❌ WRONG!
```

### Step 8: Run Migrations (After Successful Deploy)

Once your app is running:

1. Go to your web service in Render
2. Click **"Shell"** tab
3. Run this command:
   ```bash
   npm run db:migrate
   ```

---

## 🎯 Quick Summary

The issue: Old `DB_HOST=localhost` and `DB_PORT=3306` from MySQL config

The fix:
1. ✅ DELETE old DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
2. ✅ SET `DB_TYPE=postgres`
3. ✅ SET `SKIP_DB_WAIT=true`
4. ✅ SET `DATABASE_URL=postgresql://...`
5. ✅ Push code changes
6. ✅ Wait for deploy
7. ✅ Run migrations

---

## 🆘 Still Not Working?

### Check the logs for this line:
```
📊 Database type: postgres
⏭️  Skipping database connection wait (using managed database)
```

If you see this ✅ **GOOD!** - The app should start successfully.

If you still see "Waiting for PostgreSQL" ❌ **BAD!**
- Make sure you **saved** the environment variables
- Make sure you **deleted** DB_HOST and DB_PORT
- Make sure SKIP_DB_WAIT is exactly: `true` (lowercase, no quotes)

---

## 📋 Complete Environment Variable List

Copy this exactly to Render Environment tab:

```
# Database (PostgreSQL)
DB_TYPE=postgres
SKIP_DB_WAIT=true
DATABASE_URL=postgresql://your_user:your_pass@dpg-xxxxx/your_db

# App URLs
NEXT_PUBLIC_APP_URL=https://your-app.onrender.com

# Security
JWT_SECRET=your-random-32-character-secret-here

# Email (Resend)
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM=onboarding@resend.dev

# Optional - if using UploadThing
UPLOADTHING_SECRET=sk_live_xxxxx
UPLOADTHING_APP_ID=xxxxx

# Optional - if using Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxxxx
NEXT_PUBLIC_MAPBOX_SESSION_TOKEN=sk.xxxxx
```

---

## 🎉 Done!

After these steps, your app will:
- ✅ Skip waiting for database (uses managed PostgreSQL)
- ✅ Start up in seconds
- ✅ Connect to Render's PostgreSQL database
- ✅ Work perfectly!

No more infinite loops! 🚀