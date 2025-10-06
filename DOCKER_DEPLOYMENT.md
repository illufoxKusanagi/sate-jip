# Docker Deployment Guide

This project supports both **development** and **production** Docker deployments.

## 📦 Production Deployment

Production uses a **multi-stage build** for optimal image size and security.

### How it works:
1. **Stage 1 (deps)**: Installs all dependencies
2. **Stage 2 (builder)**: Builds the Next.js application (`npm run build`)
3. **Stage 3 (runner)**: Creates minimal production image with standalone output

### Commands:

```bash
# Build and start production containers
docker compose up -d

# Build only (without starting)
docker compose build

# View logs
docker compose logs -f app

# Stop containers
docker compose down

# Rebuild from scratch (no cache)
docker compose build --no-cache
docker compose up -d
```

### What happens:
- ✅ Automatically runs `npm run build` during image creation
- ✅ Runs `node server.js` (Next.js standalone production server)
- ✅ Optimized image size (~200MB vs ~1GB in dev)
- ✅ Runs as non-root user for security
- ✅ No source code volumes mounted (immutable deployment)

### Environment Variables:
Make sure you have `.env.local` file with all required environment variables:
```env
DATABASE_URL=mysql://...
NEXT_PUBLIC_MAPBOX_TOKEN=...
# ... other variables
```

---

## 🔧 Development Deployment

Development uses **hot-reload** with mounted volumes for rapid development.

### Commands:

```bash
# Build and start development containers
docker compose -f docker-compose.dev.yml up -d

# View logs with hot-reload output
docker compose -f docker-compose.dev.yml logs -f app

# Stop development containers
docker compose -f docker-compose.dev.yml down
```

### What happens:
- ✅ Runs `npm run dev` with Turbopack
- ✅ Source code mounted as volume (changes reflect immediately)
- ✅ Faster iteration during development
- ⚠️ Larger image size (includes all dev dependencies)

---

## 🗂️ File Structure

```
.
├── Dockerfile              # Production multi-stage build
├── Dockerfile.dev          # Development simple build
├── docker-compose.yml      # Production compose config
├── docker-compose.dev.yml  # Development compose config
├── .dockerignore           # Files excluded from Docker context
└── next.config.ts          # Includes output: "standalone"
```

---

## 🚀 Deployment Workflow

### First-time setup:
```bash
# 1. Create environment file
cp env-example .env.local
# Edit .env.local with your production values

# 2. Build the production image
docker compose build

# 3. Start the containers
docker compose up -d

# 4. Check if it's running
docker compose ps
docker compose logs -f app
```

### Updating code:
```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild the image (includes new build)
docker compose build

# 3. Recreate containers with new image
docker compose up -d

# The old containers are automatically replaced
```

---

## 📊 Monitoring

```bash
# Check container status
docker compose ps

# View real-time logs
docker compose logs -f app

# Check resource usage
docker stats sate-jip-app-diskominfo

# Execute commands inside container
docker compose exec app sh
```

---

## 🔍 Troubleshooting

### Build fails:
```bash
# Clear Docker cache and rebuild
docker compose build --no-cache
```

### App won't start:
```bash
# Check logs
docker compose logs app

# Verify environment variables
docker compose exec app env | grep -i next
```

### Port already in use:
```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use 3001 instead of 3000
```

### Database connection issues:
```bash
# Make sure DATABASE_URL in .env.local is correct
# If using external MySQL, ensure it allows connections from Docker network
```

---

## 🎯 Best Practices

1. **Use `.env.local` for production** - Never commit secrets to git
2. **Always rebuild after code changes** - `docker compose build`
3. **Use production compose for deployment** - `docker-compose.yml` (not dev)
4. **Monitor logs regularly** - `docker compose logs -f`
5. **Backup your data** - Especially if using database containers
6. **Use specific versions** - Pin Node.js version in Dockerfile (already using `node:18-alpine`)

---

## 🆚 Development vs Production

| Feature     | Development                                   | Production              |
| ----------- | --------------------------------------------- | ----------------------- |
| Command     | `docker compose -f docker-compose.dev.yml up` | `docker compose up`     |
| Build       | Single-stage                                  | Multi-stage (optimized) |
| Source code | Mounted as volume                             | Baked into image        |
| Hot reload  | ✅ Yes                                         | ❌ No                    |
| Image size  | ~1.2 GB                                       | ~200 MB                 |
| Security    | Standard user                                 | Non-root user           |
| Performance | Dev server                                    | Production optimized    |
| Use case    | Local development                             | Deployment to server    |

---

## 📝 Notes

- The production build runs `npm run build` **during image creation**, not at runtime
- Changes to code require rebuilding the image: `docker compose build && docker compose up -d`
- The standalone output mode (`next.config.ts`) creates a self-contained production server
- Database connections should use the container's internal network or external host
