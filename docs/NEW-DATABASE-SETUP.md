# Dual Database Setup Guide

This project supports both **MySQL** and **PostgreSQL** databases, allowing you to:
- Use **MySQL** for local development and company servers
- Use **PostgreSQL** for free deployments on Vercel/Render

The database is automatically selected based on the `DB_TYPE` environment variable.

---

## Quick Start

### For Local Development (MySQL)

1. **Set up environment variables** in `.env.local`:
```bash
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sate_jip_db
```

2. **Start MySQL using Docker**:
```bash
npm run docker:up
```

3. **Generate and run migrations**:
```bash
npm run db:generate
npm run db:migrate
```

4. **Seed the database** (optional):
```bash
npm run db:seed
```

5. **Start development server**:
```bash
npm run dev
```

---

### For Deployment (PostgreSQL on Render/Vercel)

1. **Create a PostgreSQL database** on your platform:
   - **Render**: Add PostgreSQL from dashboard
   - **Vercel**: Add Vercel Postgres from dashboard

2. **Set environment variables** on your platform:
```bash
DB_TYPE=postgres
DATABASE_URL=postgresql://user:password@host:5432/database

# Other required variables
JWT_SECRET=your-secret-key
RESEND_API_KEY=re_your_key
RESEND_FROM=onboarding@resend.dev
NEXT_PUBLIC_APP_URL=https://yourapp.onrender.com
```

3. **Run migrations** from your local machine:
```bash
# Update .env.local temporarily with production DATABASE_URL
DB_TYPE=postgres
DATABASE_URL=postgresql://user:password@host:5432/database

# Run migrations
npm run db:generate:postgres
npm run db:migrate
```

4. **Deploy your application** - it will automatically use PostgreSQL!

---

## Database Commands

### MySQL Commands
```bash
# Generate migrations for MySQL
npm run db:generate:mysql

# Push schema to MySQL (no migrations)
DB_TYPE=mysql npm run db:push

# Open Drizzle Studio for MySQL
DB_TYPE=mysql npm run db:studio
```

### PostgreSQL Commands
```bash
# Generate migrations for PostgreSQL
npm run db:generate:postgres

# Push schema to PostgreSQL (no migrations)
DB_TYPE=postgres npm run db:push

# Open Drizzle Studio for PostgreSQL
DB_TYPE=postgres npm run db:studio
```

### Auto-detect Database (uses DB_TYPE env var)
```bash
# Generate migrations (auto-detects based on DB_TYPE)
npm run db:generate

# Migrate database
npm run db:migrate

# Seed database
npm run db:seed
```

---

## Environment Variables

### Required for MySQL
```bash
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sate_jip_db
```

### Required for PostgreSQL
```bash
DB_TYPE=postgres
DATABASE_URL=postgresql://user:password@host:5432/database
```

### Common Variables (both databases)
```bash
# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Email (Resend)
RESEND_API_KEY=re_your_api_key
RESEND_FROM=onboarding@resend.dev

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# File Upload (UploadThing)
UPLOADTHING_SECRET=sk_live_xxxxx
UPLOADTHING_APP_ID=xxxxx

# Maps (Mapbox)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxxxx
NEXT_PUBLIC_MAPBOX_SESSION_TOKEN=sk.xxxxx
```

---

## How It Works

### Schema Files
- `src/lib/db/schema.mysql.ts` - MySQL schema
- `src/lib/db/schema.postgres.ts` - PostgreSQL schema
- `src/lib/db/schema.ts` - Smart switcher (exports the right schema based on DB_TYPE)

### Connection Files
- `src/lib/db/connection.ts` - Handles both MySQL and PostgreSQL connections

### Drizzle Config Files
- `drizzle.config.mysql.ts` - MySQL configuration
- `drizzle.config.postgres.ts` - PostgreSQL configuration
- `drizzle.config.ts` - Main config (switches based on DB_TYPE)

### Migration Folders
- `drizzle/mysql/` - MySQL migrations
- `drizzle/postgres/` - PostgreSQL migrations

---

## Common Issues

### Issue: "Missing DATABASE_URL"
**Solution**: Make sure you set `DATABASE_URL` when using PostgreSQL:
```bash
DB_TYPE=postgres
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### Issue: "Missing DB_HOST"
**Solution**: Make sure you set MySQL credentials when using MySQL:
```bash
DB_TYPE=mysql
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpass
```

### Issue: "Cannot connect to database during build"
**Solution**: This is normal. The connection only happens at runtime, not during build.

### Issue: "Schema differences between MySQL and PostgreSQL"
**Solution**: The schemas are designed to be compatible. If you modify one, make sure to update both.

---

## Switching Between Databases

You can easily switch between databases by changing the `DB_TYPE` environment variable:

```bash
# Use MySQL
DB_TYPE=mysql npm run dev

# Use PostgreSQL
DB_TYPE=postgres npm run dev
```

---

## Testing Locally with PostgreSQL

If you want to test with PostgreSQL locally:

1. **Install PostgreSQL** or use Docker:
```bash
docker run --name postgres-test -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

2. **Update `.env.local`**:
```bash
DB_TYPE=postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
```

3. **Run migrations**:
```bash
npm run db:generate:postgres
npm run db:migrate
```

4. **Start dev server**:
```bash
npm run dev
```

---

## Production Checklist

### Before Deploying:

- [ ] Set `DB_TYPE=postgres` on deployment platform
- [ ] Set `DATABASE_URL` to your PostgreSQL connection string
- [ ] Set all other required environment variables (JWT_SECRET, RESEND_API_KEY, etc.)
- [ ] Run migrations on production database
- [ ] Test email functionality with Resend
- [ ] Verify file uploads work with UploadThing

### After Deploying:

- [ ] Check application logs for database connection
- [ ] Test login functionality
- [ ] Create a test ticket to verify database writes
- [ ] Verify email notifications are sent

---

## Support

If you encounter issues:
1. Check the logs: `npm run docker:logs` (for local Docker)
2. Verify environment variables are set correctly
3. Ensure database is accessible from your application
4. Check that migrations have been run

---

## Summary

**Local Development (MySQL)**:
```bash
DB_TYPE=mysql
npm run docker:up
npm run db:migrate
npm run dev
```

**Production Deployment (PostgreSQL)**:
```bash
# On deployment platform (Render/Vercel):
DB_TYPE=postgres
DATABASE_URL=postgresql://...

# Locally, run migrations:
npm run db:generate:postgres
npm run db:migrate

# Deploy!
```

That's it! Your app now supports both MySQL and PostgreSQL! 🎉