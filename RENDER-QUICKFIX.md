# 🚀 Quick Fix for Render Deployment

## The Problem

Your app is stuck in a loop waiting for MySQL, but Render doesn't have MySQL running. You need to use PostgreSQL instead.

## ✅ Quick Fix Steps

### Step 1: Create PostgreSQL Database on Render

1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"PostgreSQL"**
3. Fill in:
   - **Name**: `sate-itik-db` (or any name you prefer)
   - **Database**: `sate_itik` (auto-filled)
   - **User**: `sate_itik` (auto-filled)
   - **Region**: Same region as your web service
   - **PostgreSQL Version**: 16 (latest)
   - **Plan**: **Free** ✅
4. Click **"Create Database"**
5. Wait ~1 minute for it to provision
6. **Copy the "Internal Database URL"** (looks like: `postgresql://sate_itik:xxxxx@dpg-xxxxx/sate_itik`)

### Step 2: Update Your Web Service Environment Variables

1. Go to your web service in Render Dashboard
2. Click **"Environment"** tab
3. **Add/Update these environment variables:**

   ```
   DB_TYPE=postgres
   DATABASE_URL=<paste the Internal Database URL from Step 1>
   SKIP_DB_WAIT=true
   ```

4. **Remove or update these variables** (if they exist):
   - Remove: `DB_HOST` 
   - Remove: `DB_PORT`
   - Remove: `DB_USER`
   - Remove: `DB_PASSWORD`
   - Remove: `DB_NAME`

### Step 3: Add Other Required Variables

While you're in the Environment tab, make sure you have:

```
NEXT_PUBLIC_APP_URL=https://your-app-name.onrender.com
JWT_SECRET=<generate random 32+ character string>
RESEND_API_KEY=<your resend API key>
RESEND_FROM=onboarding@resend.dev
```

**Generate JWT_SECRET:**
```bash
# Run this on your local machine:
openssl rand -base64 32
```

### Step 4: Redeploy

Two options:

**Option A: Manual Deploy**
1. Click **"Manual Deploy"** → **"Deploy latest commit"**

**Option B: Push to trigger auto-deploy**
```bash
git commit --allow-empty -m "Trigger Render rebuild with PostgreSQL"
git push
```

### Step 5: Run Database Migrations

After the app deploys successfully:

1. Go to your web service → **"Shell"** tab
2. Run:
   ```bash
   npm run db:migrate
   ```

OR run locally:
```bash
# Set the DATABASE_URL to your Render PostgreSQL (use External Database URL)
DATABASE_URL="postgresql://..." npm run db:migrate
```

---

## 📋 Complete Environment Variables Checklist

Here's what your Render Environment Variables should look like:

### ✅ Required (Database)
```
DB_TYPE=postgres
DATABASE_URL=postgresql://user:pass@host/database
SKIP_DB_WAIT=true
```

### ✅ Required (App)
```
NEXT_PUBLIC_APP_URL=https://your-app.onrender.com
JWT_SECRET=your-random-32-char-string
```

### ✅ Required (Email)
```
RESEND_API_KEY=re_xxxxx
RESEND_FROM=onboarding@resend.dev
```

### ⚠️ Optional (if using)
```
UPLOADTHING_SECRET=sk_live_xxxxx
UPLOADTHING_APP_ID=xxxxx
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxxxx
NEXT_PUBLIC_MAPBOX_SESSION_TOKEN=sk.xxxxx
```

---

## 🎯 What Changed

### Before (❌ Not working)
```bash
DB_TYPE=mysql          # ❌ No MySQL on Render free tier
DB_HOST=mysql          # ❌ Looking for non-existent container
# No SKIP_DB_WAIT      # ❌ Waits forever for MySQL
```

### After (✅ Working)
```bash
DB_TYPE=postgres       # ✅ Using Render's free PostgreSQL
DATABASE_URL=postgresql://...  # ✅ Managed database connection
SKIP_DB_WAIT=true      # ✅ Skips waiting, uses managed DB
```

---

## 🔍 Verify It's Working

After redeployment, check the logs:

### ✅ Good logs:
```
🚀 Starting SATE-ITIK application...
📊 Database type: postgres
⏭️  Skipping database connection wait (using managed database)
🔄 Running database migrations...
✅ Database setup complete!
🎯 Starting Next.js server...
```

### ❌ Bad logs (if you still see this):
```
⏳ Waiting for MySQL to be ready...
MySQL is unavailable - sleeping
```

If you still see the bad logs, double-check:
1. `DB_TYPE=postgres` is set correctly
2. `SKIP_DB_WAIT=true` is set
3. You've redeployed after making changes

---

## 🆘 Troubleshooting

### "Still waiting for MySQL"
- Make sure you **saved** the environment variables
- Make sure you **redeployed** after saving
- Check that `DB_TYPE=postgres` (not `DB_TYPE=mysql`)

### "Database connection error"
- Verify the `DATABASE_URL` is correct (copy from PostgreSQL dashboard)
- Use **Internal Database URL** (starts with `postgresql://`)
- Make sure your web service and database are in the **same region**

### "Missing API Key" errors
- Add `RESEND_API_KEY` to environment variables
- For testing, you can use a dummy key, but email won't work

### Migrations fail
- Make sure you ran `npm run db:generate:postgres` locally first
- Push the generated migration files to git
- Then run `npm run db:migrate` in Render shell

---

## 📚 Next Steps

After your app is running:

1. **Run migrations** (see Step 5)
2. **Test the app** - Visit your Render URL
3. **Set up custom domain** (optional)
4. **Configure Resend** with verified domain for production emails

---

## 💡 Pro Tips

1. **Use Internal Database URL** for better performance (not External)
2. **Free tier limitations**: 
   - Database: 1GB storage, shared CPU
   - Web service: Spins down after 15 min inactivity
3. **Upgrade later**: When ready for production, upgrade to paid tier for better performance

---

## 🎉 Summary

You changed from:
- ❌ MySQL (not available free on Render)
- ❌ Waiting for local Docker MySQL container

To:
- ✅ PostgreSQL (free managed database on Render)
- ✅ Skip container wait, use managed database

That's it! Your app should now deploy successfully on Render.