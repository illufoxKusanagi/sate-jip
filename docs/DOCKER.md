# Docker Deployment Guide

## Quick Start

### 1. Setup Environment
```bash
cp .env.example .env
# Edit .env dengan konfigurasi production
```

### 2. Build & Run
```bash
# Production
docker-compose -f docker-compose.prod.yml up -d --build

# Development
docker-compose up -d
```

### 3. Check Status
```bash
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

## File Structure

```
.
├── Dockerfile                  # Production Dockerfile (multi-stage)
├── Dockerfile.dev             # Development Dockerfile
├── docker-compose.yml         # Development compose
├── docker-compose.prod.yml    # Production compose
└── .dockerignore              # Files to exclude from image
```

## Dockerfile Explanation

### Multi-Stage Build

**Stage 1: Dependencies**
- Base image: `node:20-alpine`
- Install dependencies dengan `npm ci`
- Layer ini di-cache untuk mempercepat rebuild

**Stage 2: Builder**
- Copy dependencies dari stage 1
- Build aplikasi Next.js
- Generate standalone output

**Stage 3: Runner (Production)**
- Base image minimal: `node:20-alpine`
- Copy hanya file yang diperlukan untuk runtime
- Run sebagai non-root user (security)
- Image size minimal ~150-200MB

### Key Features
- ✅ Multi-stage build untuk optimasi size
- ✅ Non-root user untuk security
- ✅ Standalone output (all-in-one deployment)
- ✅ Layer caching untuk fast rebuild
- ✅ Health check support

## Docker Compose Files

### docker-compose.yml (Development)
```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app              # Hot reload
      - /app/node_modules   # Exclude node_modules
    env_file:
      - .env
```

### docker-compose.prod.yml (Production)
```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: runner      # Use production stage
    restart: always       # Auto restart
    ports:
      - "3000:3000"
    env_file:
      - .env
    # NO volumes - self-contained image
    healthcheck:
      test: ["CMD-SHELL", "wget --spider -q http://localhost:3000"]
      interval: 30s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Common Commands

### Build

```bash
# Build production image
docker-compose -f docker-compose.prod.yml build

# Build tanpa cache (fresh build)
docker-compose -f docker-compose.prod.yml build --no-cache

# Build specific service
docker-compose -f docker-compose.prod.yml build app
```

### Run

```bash
# Start containers
docker-compose -f docker-compose.prod.yml up -d

# Start dengan rebuild
docker-compose -f docker-compose.prod.yml up -d --build

# Start tanpa detach (lihat logs)
docker-compose -f docker-compose.prod.yml up
```

### Stop/Remove

```bash
# Stop containers
docker-compose -f docker-compose.prod.yml stop

# Stop dan remove containers
docker-compose -f docker-compose.prod.yml down

# Stop dan remove termasuk volumes
docker-compose -f docker-compose.prod.yml down -v

# Remove images juga
docker-compose -f docker-compose.prod.yml down --rmi all
```

### Logs & Monitoring

```bash
# Tail logs
docker-compose -f docker-compose.prod.yml logs -f

# Logs specific service
docker-compose -f docker-compose.prod.yml logs -f app

# Show last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100

# Check container status
docker-compose -f docker-compose.prod.yml ps

# Check resource usage
docker stats sate-jip-app-diskominfo-prod
```

### Execute Commands in Container

```bash
# Open shell
docker exec -it sate-jip-app-diskominfo-prod sh

# Run database migration
docker exec -it sate-jip-app-diskominfo-prod npm run db:push

# Run seed
docker exec -it sate-jip-app-diskominfo-prod npm run db:seed-admins

# Check environment
docker exec -it sate-jip-app-diskominfo-prod env
```

### Inspect

```bash
# Inspect container
docker inspect sate-jip-app-diskominfo-prod

# Check health status
docker inspect sate-jip-app-diskominfo-prod | grep -A 10 Health

# View image layers
docker history sate-jip-app:latest

# Check image size
docker images sate-jip-app
```

## Update & Redeploy

### Update Code

```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild image
docker-compose -f docker-compose.prod.yml build --no-cache

# 3. Restart with new image
docker-compose -f docker-compose.prod.yml up -d
```

### Zero-Downtime Update

```bash
# 1. Build new image dengan tag berbeda
docker build -t sate-jip-app:v2 .

# 2. Start container baru di port berbeda
docker run -d -p 3001:3000 --name sate-jip-v2 sate-jip-app:v2

# 3. Test container baru
curl http://localhost:3001

# 4. Update reverse proxy ke port baru
# nginx/traefik config update

# 5. Stop container lama
docker stop sate-jip-app-diskominfo-prod
```

## Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL=mysql://user:pass@host:3306/dbname
DB_HOST=10.10.2.5
DB_PORT=3306
DB_USER=username
DB_PASSWORD=password
DB_NAME=database

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx
NEXT_PUBLIC_MAPBOX_SESSION_TOKEN=sk.xxx

# App
NEXT_PUBLIC_APP_URL=https://sate-itik.madiunkab.go.id
JWT_SECRET=your_secret_key_here
NODE_ENV=production
```

### Pass via Docker Compose

```yaml
environment:
  - NODE_ENV=production
  - CUSTOM_VAR=value
env_file:
  - .env
```

### Pass via CLI

```bash
docker run -e NODE_ENV=production -e DB_HOST=localhost ...
```

## Troubleshooting

### Container tidak start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs app

# Check container status
docker-compose -f docker-compose.prod.yml ps

# Restart container
docker-compose -f docker-compose.prod.yml restart app
```

### Build error

```bash
# Build dengan verbose output
docker-compose -f docker-compose.prod.yml build --progress=plain

# Build tanpa cache
docker-compose -f docker-compose.prod.yml build --no-cache
```

### Database connection error

```bash
# Check network
docker network ls
docker network inspect sate-jip-network

# Verify env variables
docker exec sate-jip-app-diskominfo-prod env | grep DB_

# Test database connection dari container
docker exec -it sate-jip-app-diskominfo-prod sh
# Inside container:
nc -zv $DB_HOST $DB_PORT
```

### Image size terlalu besar

```bash
# Check image size
docker images sate-jip-app

# Check layers
docker history sate-jip-app:latest

# Prune unused data
docker system prune -a
```

### Port sudah digunakan

```bash
# Check port usage
lsof -i :3000
netstat -tuln | grep 3000

# Kill process atau ganti port di docker-compose.yml
ports:
  - "3001:3000"  # Host:Container
```

## Best Practices

### Security
- ✅ Run sebagai non-root user
- ✅ Tidak include sensitive files (.env di .dockerignore)
- ✅ Use specific image tags (node:20-alpine, bukan node:latest)
- ✅ Minimal base image (alpine)
- ✅ Regular security updates

### Performance
- ✅ Multi-stage build
- ✅ Layer caching optimization
- ✅ .dockerignore untuk exclude unnecessary files
- ✅ Standalone output Next.js
- ✅ Health checks

### Maintenance
- ✅ Logging dengan rotation
- ✅ Health checks
- ✅ Restart policy
- ✅ Resource limits (optional)

### Resource Limits (Optional)

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

## Production Checklist

- [ ] Environment variables sudah diset dengan benar
- [ ] File `.env` tidak di-commit ke git
- [ ] Database bisa diakses dari container
- [ ] Build berhasil tanpa error
- [ ] Container bisa start dan health check passing
- [ ] Logging sudah dikonfigurasi
- [ ] Backup strategy sudah disetup
- [ ] Monitoring sudah aktif
- [ ] SSL/TLS certificate (jika pakai Nginx)
- [ ] Firewall rules sudah benar
- [ ] Auto-restart enabled

## Support

Untuk issue atau pertanyaan terkait Docker deployment, silakan hubungi tim development.
