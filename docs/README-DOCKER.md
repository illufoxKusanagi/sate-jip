# 🐳 Docker Deployment - Sate Itik Diskominfo

## Quick Start

### 1️⃣ Setup Environment
```bash
# Copy environment template
cp .env.example .env

# Edit dengan konfigurasi production
nano .env
```

### 2️⃣ Run dengan Script Helper
```bash
# Make script executable
chmod +x docker-start.sh

# Start production
./docker-start.sh prod

# Atau manual
docker-compose -f docker-compose.prod.yml up -d
```

### 3️⃣ Verify
```bash
# Check status
docker ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Test access
curl http://localhost:3000
```

## 📋 Available Commands

### Using Helper Script
```bash
./docker-start.sh dev        # Development mode
./docker-start.sh prod       # Production mode
./docker-start.sh build      # Build production image
./docker-start.sh stop       # Stop containers
./docker-start.sh restart    # Restart containers
./docker-start.sh logs       # View logs
./docker-start.sh status     # Check status
./docker-start.sh clean      # Remove all containers & images
```

### Direct Docker Commands
```bash
# Build
docker-compose -f docker-compose.prod.yml build

# Start
docker-compose -f docker-compose.prod.yml up -d

# Stop
docker-compose -f docker-compose.prod.yml down

# Logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart
docker-compose -f docker-compose.prod.yml restart
```

## 🗂️ File Structure
```
.
├── Dockerfile                  # Production multi-stage build
├── Dockerfile.dev             # Development
├── docker-compose.yml         # Development compose
├── docker-compose.prod.yml    # Production compose
├── docker-start.sh            # Helper script
├── .dockerignore              # Files to exclude
└── .env                       # Environment variables
```

## ✨ Features

### Multi-Stage Build
- **Stage 1 (deps)**: Install dependencies
- **Stage 2 (builder)**: Build Next.js app
- **Stage 3 (runner)**: Minimal production image

### Optimizations
- ✅ Image size: ~150-200MB (vs ~1GB without optimization)
- ✅ Non-root user for security
- ✅ Layer caching for fast rebuilds
- ✅ Standalone output
- ✅ Health checks
- ✅ Log rotation

## 🔧 Configuration

### Environment Variables
Edit `.env` file:
```bash
# Database
DB_HOST=10.10.2.5
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx
NEXT_PUBLIC_MAPBOX_SESSION_TOKEN=sk.xxx

# App
NEXT_PUBLIC_APP_URL=https://sate-itik.madiunkab.go.id
NODE_ENV=production
```

### Ports
Default: `3000:3000` (Host:Container)

Ubah port di `docker-compose.prod.yml`:
```yaml
ports:
  - "8080:3000"  # Access via port 8080
```

## 🚀 Deployment Workflow

### Initial Deployment
```bash
# 1. Clone repository
git clone <repo-url>
cd sate-itik-diskominfo

# 2. Setup environment
cp .env.example .env
nano .env

# 3. Build and run
./docker-start.sh prod
```

### Update & Redeploy
```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild image
docker-compose -f docker-compose.prod.yml build --no-cache

# 3. Restart container
docker-compose -f docker-compose.prod.yml up -d
```

## 🔍 Troubleshooting

### Container tidak start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs app

# Check status
docker ps -a

# Restart
docker-compose -f docker-compose.prod.yml restart
```

### Database connection error
```bash
# Verify environment variables
docker exec sate-jip-app-diskominfo-prod env | grep DB_

# Test connection
docker exec -it sate-jip-app-diskominfo-prod sh
nc -zv $DB_HOST $DB_PORT
```

### Port already in use
```bash
# Find process using port
lsof -i :3000

# Kill process or change port in docker-compose.prod.yml
```

### Image too large
```bash
# Check image size
docker images sate-jip-app

# Rebuild without cache
docker-compose -f docker-compose.prod.yml build --no-cache

# Prune unused data
docker system prune -a
```

## 📊 Monitoring

### Health Check
```bash
# Container health status
docker inspect sate-jip-app-diskominfo-prod | grep -A 10 Health

# Manual health check
wget --spider http://localhost:3000
```

### Resource Usage
```bash
# Real-time stats
docker stats sate-jip-app-diskominfo-prod

# Logs
docker-compose -f docker-compose.prod.yml logs -f --tail=100
```

## 🔐 Security

- ✅ Non-root user (nextjs:nodejs)
- ✅ Minimal base image (Alpine)
- ✅ No sensitive files in image (.dockerignore)
- ✅ Environment variables via .env
- ✅ Health checks enabled

## 📚 Documentation

- Full Guide: [DOCKER.md](./DOCKER.md)
- Deployment: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Environment: [.env.example](./.env.example)

## ⚡ Performance

| Metric | Value |
|--------|-------|
| Image Size | ~150-200MB |
| Build Time | ~3-5 minutes |
| Start Time | ~5-10 seconds |
| Memory Usage | ~200-300MB |

## 🆘 Support

Untuk pertanyaan atau issue:
1. Check [DOCKER.md](./DOCKER.md) untuk panduan lengkap
2. Review logs: `./docker-start.sh logs`
3. Hubungi tim development Diskominfo Madiun

---

Made with ❤️ by Diskominfo Kabupaten Madiun
