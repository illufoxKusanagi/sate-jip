# Docker Guide - Dual Database Setup

This guide shows you how to run your application with either MySQL or PostgreSQL using Docker.

---

## Quick Start

### Option 1: MySQL (Default)

```bash
# Start MySQL + App
npm run docker:up:mysql

# Or manually:
docker compose -f docker-compose.mysql.yml up -d

# Check logs
npm run docker:logs:mysql

# Stop
npm run docker:down:mysql
```

### Option 2: PostgreSQL

```bash
# Start PostgreSQL + App
npm run docker:up:postgres

# Or manually:
docker compose -f docker-compose.postgres.yml up -d

# Check logs
npm run docker:logs:postgres

# Stop
npm run docker:down:postgres
```

---

## Available Docker Compose Files

1. **`docker-compose.yml`** - Main file with both MySQL and PostgreSQL (manual selection)
2. **`docker-compose.mysql.yml`** - MySQL only setup
3. **`docker-compose.postgres.yml`** - PostgreSQL only setup

---

## Complete Setup Guide

### For MySQL Development

1. **Create/Update `.env` file**:
```bash
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=12345678Haha
DB_NAME=sate_jip_db

# Other variables...
JWT_SECRET=your-secret
RESEND_API_KEY=re_xxxxx
RESEND_FROM=onboarding@resend.dev
```

2. **Start MySQL container**:
```bash
npm run docker:up:mysql
```

3. **Wait for MySQL to be ready** (check logs):
```bash
npm run docker:logs:mysql
# Look for: "ready for connections"
```

4. **Run migrations**:
```bash
npm run db:generate
npm run db:migrate
```

5. **Seed database** (optional):
```bash
npm run db:seed
```

6. **Start development** (in another terminal):
```bash
npm run dev
```

---

### For PostgreSQL Development

1. **Create/Update `.env` file**:
```bash
DB_TYPE=postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sate_jip_db

# Or use individual variables:
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=sate_jip_db

# Other variables...
JWT_SECRET=your-secret
RESEND_API_KEY=re_xxxxx
RESEND_FROM=onboarding@resend.dev
```

2. **Start PostgreSQL container**:
```bash
npm run docker:up:postgres
```

3. **Wait for PostgreSQL to be ready**:
```bash
npm run docker:logs:postgres
# Look for: "database system is ready to accept connections"
```

4. **Run migrations**:
```bash
npm run db:generate:postgres
npm run db:migrate
```

5. **Seed database** (optional):
```bash
DB_TYPE=postgres npm run db:seed
```

6. **Start development**:
```bash
npm run dev
```

---

## NPM Scripts Reference

### Docker Commands

| Command | Description |
|---------|-------------|
| `npm run docker:up` | Start default docker-compose.yml |
| `npm run docker:up:mysql` | Start MySQL + App |
| `npm run docker:up:postgres` | Start PostgreSQL + App |
| `npm run docker:down` | Stop default setup |
| `npm run docker:down:mysql` | Stop MySQL setup |
| `npm run docker:down:postgres` | Stop PostgreSQL setup |
| `npm run docker:logs` | View all logs |
| `npm run docker:logs:mysql` | View MySQL logs |
| `npm run docker:logs:postgres` | View PostgreSQL logs |

### Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate migrations (auto-detect DB) |
| `npm run db:generate:mysql` | Generate MySQL migrations |
| `npm run db:generate:postgres` | Generate PostgreSQL migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema without migrations |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Seed database with sample data |

---

## Docker Containers Info

### MySQL Container
- **Image**: `mysql:8.0`
- **Container Name**: `sate-jip-mysql`
- **Port**: `3306:3306`
- **Volume**: `mysql-data`
- **Default User**: `root`
- **Default Password**: `12345678Haha` (change in `.env`)
- **Default Database**: `sate_jip_db`

### PostgreSQL Container
- **Image**: `postgres:16-alpine`
- **Container Name**: `sate-jip-postgres`
- **Port**: `5432:5432`
- **Volume**: `postgres-data`
- **Default User**: `postgres`
- **Default Password**: `postgres` (change in `.env`)
- **Default Database**: `sate_jip_db`

### App Container
- **Image**: Built from Dockerfile
- **Container Name**: `sate-jip-app-diskominfo`
- **Port**: `3000:3000`
- **Network**: `sate-jip-network`

---

## Common Commands

### View Running Containers
```bash
docker ps
```

### Connect to Database

**MySQL**:
```bash
# From host
docker exec -it sate-jip-mysql mysql -uroot -p12345678Haha sate_jip_db

# Or using MySQL client
mysql -h localhost -P 3306 -u root -p12345678Haha sate_jip_db
```

**PostgreSQL**:
```bash
# From host
docker exec -it sate-jip-postgres psql -U postgres -d sate_jip_db

# Or using psql client
psql -h localhost -p 5432 -U postgres -d sate_jip_db
```

### View Container Logs
```bash
# MySQL
docker logs -f sate-jip-mysql

# PostgreSQL
docker logs -f sate-jip-postgres

# App
docker logs -f sate-jip-app-diskominfo
```

### Restart Container
```bash
# MySQL
docker restart sate-jip-mysql

# PostgreSQL
docker restart sate-jip-postgres

# App
docker restart sate-jip-app-diskominfo
```

### Remove All Data (Start Fresh)
```bash
# Stop containers
npm run docker:down:mysql
# or
npm run docker:down:postgres

# Remove volumes
docker volume rm sate-jip_mysql-data
# or
docker volume rm sate-jip_postgres-data

# Start again
npm run docker:up:mysql
```

---

## Switching Between Databases

You can easily switch between MySQL and PostgreSQL:

### Switch to MySQL:
```bash
# 1. Stop PostgreSQL (if running)
npm run docker:down:postgres

# 2. Update .env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306

# 3. Start MySQL
npm run docker:up:mysql

# 4. Run dev
npm run dev
```

### Switch to PostgreSQL:
```bash
# 1. Stop MySQL (if running)
npm run docker:down:mysql

# 2. Update .env
DB_TYPE=postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sate_jip_db

# 3. Start PostgreSQL
npm run docker:up:postgres

# 4. Run dev
npm run dev
```

---

## Troubleshooting

### Port Already in Use

**MySQL (3306)**:
```bash
# Find process using port
sudo lsof -i :3306

# Kill the process or change port in docker-compose
ports:
  - "3307:3306"  # Use port 3307 on host
```

**PostgreSQL (5432)**:
```bash
# Find process using port
sudo lsof -i :5432

# Kill the process or change port
ports:
  - "5433:5432"  # Use port 5433 on host
```

### Database Connection Refused

1. Check if container is running:
```bash
docker ps | grep sate-jip
```

2. Check container logs:
```bash
docker logs sate-jip-mysql
# or
docker logs sate-jip-postgres
```

3. Verify database is healthy:
```bash
docker inspect sate-jip-mysql | grep Health
# or
docker inspect sate-jip-postgres | grep Health
```

### Container Won't Start

1. Check logs:
```bash
docker logs sate-jip-mysql
```

2. Remove and recreate:
```bash
docker rm -f sate-jip-mysql
npm run docker:up:mysql
```

### Data Persistence Issues

Volumes are stored at:
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect sate-jip_mysql-data

# Backup volume
docker run --rm -v sate-jip_mysql-data:/data -v $(pwd):/backup ubuntu tar czf /backup/mysql-backup.tar.gz /data
```

---

## Production Deployment

For production, update `docker-compose.yml` or create `docker-compose.prod.yml`:

1. Use strong passwords
2. Set `NODE_ENV=production`
3. Configure proper health checks
4. Set up log rotation
5. Use secrets for sensitive data
6. Configure proper restart policies

Example production environment variables:
```bash
DB_TYPE=mysql
DB_PASSWORD=strong-random-password-here
JWT_SECRET=strong-jwt-secret-here
RESEND_API_KEY=re_production_key
NODE_ENV=production
```

---

## Summary

**Quick Commands**:
```bash
# MySQL Setup
npm run docker:up:mysql && npm run db:migrate && npm run dev

# PostgreSQL Setup  
npm run docker:up:postgres && DB_TYPE=postgres npm run db:migrate && npm run dev

# Stop Everything
npm run docker:down:mysql
npm run docker:down:postgres
```

That's it! Your database is ready to use! 🚀