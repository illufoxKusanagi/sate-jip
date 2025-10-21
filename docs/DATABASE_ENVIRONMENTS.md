# Database Environment Configuration Guide

## Overview

This project uses different database configurations for **local development** and **Docker/production** environments.

## Environment Files

### 1. `.env` - Docker/Production Environment
```bash
# Used by Docker containers
DB_HOST=mysql          # Docker service name
DB_PORT=3306
DB_USER=root
DB_PASSWORD=12345678Haha
DB_NAME=sate_jip_db
DATABASE_URL="mysql://root:12345678Haha@mysql:3306/sate_jip_db"
```

### 2. `.env.local` - Local Development Environment
```bash
# Used when running commands from your local machine
DB_HOST=localhost      # Your local machine
DB_PORT=3306
DB_USER=root
DB_PASSWORD=12345678Haha
DB_NAME=sate_jip_db
DATABASE_URL="mysql://root:12345678Haha@localhost:3306/sate_jip_db"
```

## NPM Scripts

### Local Development (Uses `.env.local`)
Run these from your **local machine** when Docker is running:

```bash
# Database schema management
npm run db:generate    # Generate new migration files
npm run db:push        # Push schema changes directly to DB
npm run db:migrate     # Apply pending migrations
npm run db:studio      # Open Drizzle Studio (database GUI)

# Database seeding
npm run db:seed        # Seed database with initial data
```

### Docker/Production (Uses `.env`)
Run these **inside Docker container** or in production:

```bash
# Database schema management
npm run db:generate:docker
npm run db:push:docker
npm run db:migrate:docker

# Database seeding
npm run db:seed:docker
```

## How It Works

### Local Development Workflow

1. **Start Docker containers** (MySQL runs on `localhost:3306`):
   ```bash
   npm run docker:up
   ```

2. **Make schema changes** in `src/lib/db/schema.ts`

3. **Generate migration**:
   ```bash
   npm run db:generate
   ```

4. **Apply migration**:
   ```bash
   npm run db:migrate
   ```

5. **View database** (optional):
   ```bash
   npm run db:studio
   # Opens at https://local.drizzle.studio
   ```

### Production/Docker Workflow

The production setup **automatically** runs migrations on startup via `docker-entrypoint.sh`:

1. Container starts
2. Waits for MySQL to be ready
3. Runs `npm run db:migrate:docker`
4. Starts Next.js server

**Manual migration in Docker** (if needed):
```bash
# Enter the container
docker exec -it sate-jip-app-diskominfo bash

# Run migration
npm run db:migrate:docker
```

## Adding New Columns with NOT NULL

When adding a `notNull()` column to a table that already has data:

### Option 1: With Default Value (Recommended)
```typescript
// schema.ts
export const yourTable = mysqlTable("your_table", {
  newColumn: varchar("new_column", { length: 255 })
    .notNull()
    .default("default_value"),
});
```

Then:
```bash
npm run db:generate  # Creates migration
npm run db:migrate   # Applies it
```

### Option 2: Two-Step Migration
```typescript
// Step 1: Add as nullable
newColumn: varchar("new_column", { length: 255 }),
```

1. Generate and apply migration
2. Update existing records manually
3. Change to `notNull()` in schema
4. Generate and apply new migration

### Option 3: Development Only - Push
```bash
npm run db:push  # Direct schema sync (may lose data)
```

## Troubleshooting

### Error: `ENOTFOUND mysql`
**Problem**: Running database commands from local machine without `.env.local`  
**Solution**: Use the regular commands (not `:docker` versions) which load `.env.local`

### Error: `Table already exists`
**Problem**: Migration already applied  
**Solution**: This is normal - no action needed

### Error: `Cannot add NOT NULL column`
**Problem**: Adding `notNull()` column to table with existing data  
**Solution**: Add a `.default()` value to the column definition

## File Structure

```
├── .env                    # Docker/production config
├── .env.local              # Local development config
├── drizzle.config.ts       # Drizzle configuration
├── docker-entrypoint.sh    # Production startup script
├── drizzle/                # Migration files
│   ├── 0000_*.sql
│   ├── 0001_*.sql
│   └── meta/
├── src/lib/db/
│   └── schema.ts           # Database schema
└── scripts/
    └── seed-admins.ts      # Seeding scripts
```

## Important Notes

1. **Never commit** `.env` or `.env.local` with real credentials
2. **Local commands** use `dotenv -e .env.local` to load localhost config
3. **Docker commands** use default `.env` with mysql hostname
4. **Production** runs migrations automatically on container startup
5. **Migrations** are one-way - test in development first!

## Quick Reference

| Task               | Local Command         | Docker Command               |
| ------------------ | --------------------- | ---------------------------- |
| Generate migration | `npm run db:generate` | `npm run db:generate:docker` |
| Apply migration    | `npm run db:migrate`  | `npm run db:migrate:docker`  |
| Push schema        | `npm run db:push`     | `npm run db:push:docker`     |
| Open Studio        | `npm run db:studio`   | N/A (local only)             |
| Seed data          | `npm run db:seed`     | `npm run db:seed:docker`     |
