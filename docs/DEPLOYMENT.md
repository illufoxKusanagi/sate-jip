# Deployment Guide

This guide covers deploying the SATE-ITIK application to different environments.

## Table of Contents

- [Render Deployment (PostgreSQL)](#render-deployment-postgresql)
- [Company Server Deployment (MySQL)](#company-server-deployment-mysql)
- [Environment Variables Reference](#environment-variables-reference)

---

## Render Deployment (PostgreSQL)

Render offers free PostgreSQL databases, making it ideal for demo/staging deployments.

### Prerequisites

1. A Render account
2. Your code pushed to a Git repository (GitHub, GitLab, etc.)

### Steps

1. **Create a PostgreSQL Database on Render**
   - Go to your Render dashboard
   - Click "New +" → "PostgreSQL"
   - Choose a name (e.g., `sate-itik-db`)
   - Select the Free tier
   - Click "Create Database"
   - Copy the "Internal Database URL" (starts with `postgresql://`)

2. **Create a Web Service on Render**
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Configure the service:
     - **Name**: `sate-itik-app`
     - **Environment**: `Docker`
     - **Region**: Choose closest to your users
     - **Branch**: `main` (or your default branch)
     - **Dockerfile Path**: `./Dockerfile`

3. **Set Environment Variables**

   In the Render dashboard, go to your web service → Environment tab and add:

   ```bash
   # Database Configuration
   DB_TYPE=postgres
   DATABASE_URL=<paste your Internal Database URL from step 1>
   SKIP_DB_WAIT=true
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=https://your-app-name.onrender.com
   JWT_SECRET=<generate a random 32+ character string>
   
   # Email Configuration (Resend)
   RESEND_API_KEY=<your resend API key>
   RESEND_FROM=onboarding@resend.dev
   
   # UploadThing (if using file uploads)
   UPLOADTHING_SECRET=<your uploadthing secret>
   UPLOADTHING_APP_ID=<your uploadthing app id>
   
   # Mapbox (if using maps)
   NEXT_PUBLIC_MAPBOX_TOKEN=<your mapbox token>
   NEXT_PUBLIC_MAPBOX_SESSION_TOKEN=<your mapbox session token>
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your Docker container
   - The build will take 5-10 minutes

5. **Run Migrations** (First time only)
   
   After the first deploy, you need to run database migrations:
   
   - Go to your web service → Shell tab
   - Run:
     ```bash
     npm run db:migrate
     ```
   
   Alternatively, connect to your database locally and run:
   ```bash
   DATABASE_URL="<your external database URL>" npm run db:migrate
   ```

6. **Access Your App**
   - Your app will be available at: `https://your-app-name.onrender.com`

### Important Notes for Render

- ✅ Use `SKIP_DB_WAIT=true` to skip waiting for local database containers
- ✅ Use `DB_TYPE=postgres` for PostgreSQL
- ✅ Render's free tier may spin down after inactivity (takes ~30s to wake up)
- ✅ Use the "Internal Database URL" for better performance (not external)

---

## Company Server Deployment (MySQL)

For production deployment on your company server with MySQL.

### Prerequisites

1. A server with Docker and Docker Compose installed
2. MySQL database set up (either containerized or external)
3. SSH access to the server

### Option A: Using Docker Compose (MySQL included)

If you want to run both the app and MySQL in Docker:

1. **Clone the repository on your server**
   ```bash
   git clone <your-repo-url>
   cd sate-itik
   ```

2. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` with production values**
   ```bash
   # Database Configuration
   DB_TYPE=mysql
   DB_HOST=mysql
   DB_PORT=3306
   DB_USER=sate_user
   DB_PASSWORD=<strong-password>
   DB_NAME=sate_itik_db
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=https://your-production-domain.com
   JWT_SECRET=<generate a random 32+ character string>
   
   # Email Configuration
   RESEND_API_KEY=<your resend API key>
   RESEND_FROM=noreply@your-domain.com
   
   # UploadThing
   UPLOADTHING_SECRET=<your uploadthing secret>
   UPLOADTHING_APP_ID=<your uploadthing app id>
   
   # Mapbox
   NEXT_PUBLIC_MAPBOX_TOKEN=<your mapbox token>
   NEXT_PUBLIC_MAPBOX_SESSION_TOKEN=<your mapbox session token>
   ```

4. **Start the services**
   ```bash
   npm run docker:up:mysql
   # Or manually:
   docker compose -f docker-compose.mysql.yml up -d
   ```

5. **Run migrations**
   ```bash
   npm run db:migrate
   ```

6. **Access your app**
   - App runs on port 3000 by default
   - Set up nginx/apache as reverse proxy for SSL/domain

### Option B: Using External MySQL Database

If your company has an existing MySQL server:

1. **Build and run only the app container**
   
   Create a custom `docker-compose.prod.yml`:
   ```yaml
   version: '3.8'
   
   services:
     app:
       build:
         context: .
         dockerfile: Dockerfile
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - DB_TYPE=mysql
         - DB_HOST=<your-mysql-host>
         - DB_PORT=3306
         - DB_USER=<your-mysql-user>
         - DB_PASSWORD=<your-mysql-password>
         - DB_NAME=<your-database-name>
         - SKIP_DB_WAIT=true
         - NEXT_PUBLIC_APP_URL=https://your-domain.com
         - JWT_SECRET=${JWT_SECRET}
         - RESEND_API_KEY=${RESEND_API_KEY}
         - RESEND_FROM=${RESEND_FROM}
         - UPLOADTHING_SECRET=${UPLOADTHING_SECRET}
         - UPLOADTHING_APP_ID=${UPLOADTHING_APP_ID}
       restart: unless-stopped
   ```

2. **Deploy**
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

3. **Run migrations**
   ```bash
   docker compose -f docker-compose.prod.yml exec app npm run db:migrate
   ```

### Production Checklist

- [ ] Use strong passwords for database
- [ ] Set up SSL/TLS certificates (Let's Encrypt)
- [ ] Configure reverse proxy (nginx/apache)
- [ ] Set up automatic backups for MySQL
- [ ] Configure log rotation
- [ ] Set up monitoring (uptime, errors)
- [ ] Use production domain for `NEXT_PUBLIC_APP_URL`
- [ ] Configure verified sender domain in Resend
- [ ] Set up firewall rules
- [ ] Regular security updates

---

## Environment Variables Reference

### Required Variables

| Variable | Description | Render (PostgreSQL) | Company (MySQL) |
|----------|-------------|---------------------|-----------------|
| `DB_TYPE` | Database type | `postgres` | `mysql` |
| `DATABASE_URL` | Full database URL (PostgreSQL) | ✅ Required | ❌ Not used |
| `DB_HOST` | Database host (MySQL) | ❌ Not used | ✅ Required |
| `DB_PORT` | Database port (MySQL) | ❌ Not used | `3306` |
| `DB_USER` | Database user (MySQL) | ❌ Not used | ✅ Required |
| `DB_PASSWORD` | Database password (MySQL) | ❌ Not used | ✅ Required |
| `DB_NAME` | Database name (MySQL) | ❌ Not used | ✅ Required |
| `SKIP_DB_WAIT` | Skip waiting for DB on startup | `true` | `true` for external DB |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL | ✅ Required | ✅ Required |
| `JWT_SECRET` | Secret for JWT tokens | ✅ Required | ✅ Required |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RESEND_API_KEY` | Resend email API key | - |
| `RESEND_FROM` | Email sender address | `onboarding@resend.dev` |
| `UPLOADTHING_SECRET` | UploadThing secret | - |
| `UPLOADTHING_APP_ID` | UploadThing app ID | - |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox public token | - |
| `NEXT_PUBLIC_MAPBOX_SESSION_TOKEN` | Mapbox session token | - |

---

## Troubleshooting

### "MySQL/PostgreSQL is unavailable - sleeping" (loops forever)

**Cause**: The entrypoint script is waiting for a database that doesn't exist or isn't accessible.

**Solution**: Set `SKIP_DB_WAIT=true` when using managed/external databases.

### Build fails with "Missing API Key" or "ECONNREFUSED"

**Cause**: Build stage is trying to connect to services that don't exist during build.

**Solution**: The Dockerfile already has dummy values for build. If you see this, check that you haven't modified the build stage.

### Migrations fail

**PostgreSQL**: Make sure you're using the correct schema
```bash
npm run db:generate:postgres
npm run db:migrate
```

**MySQL**: Make sure you're using the correct schema
```bash
npm run db:generate:mysql
npm run db:migrate
```

### Port already in use

If port 3000 is already taken:
- Change the port mapping in docker-compose: `"3001:3000"`
- Or stop the conflicting service

---

## Quick Reference

### Render (Free Tier - PostgreSQL)
```bash
DB_TYPE=postgres
DATABASE_URL=postgresql://user:pass@host/db
SKIP_DB_WAIT=true
```

### Company Server - Docker Compose (MySQL)
```bash
DB_TYPE=mysql
DB_HOST=mysql
# No SKIP_DB_WAIT needed (uses docker network)
```

### Company Server - External MySQL
```bash
DB_TYPE=mysql
DB_HOST=your-mysql-server.com
SKIP_DB_WAIT=true
```

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the logs: `docker logs <container-name>`
3. Check environment variables are set correctly
4. Verify database connectivity

---

**Last Updated**: October 2025