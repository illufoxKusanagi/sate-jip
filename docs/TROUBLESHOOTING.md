# Troubleshooting Guide - Sate Itik Diskominfo

## Map tidak muncul di Docker (hanya loading)

### Gejala
- Aplikasi berjalan dengan `npm run start`: Map tampil normal ✅
- Aplikasi berjalan di Docker: Map hanya loading terus ❌

### Penyebab
Environment variables `NEXT_PUBLIC_*` tidak ter-embed saat build time di Docker. Next.js memerlukan env vars ini tersedia saat build untuk client-side code.

### Solusi
Environment variables harus di-pass sebagai **build arguments** di Docker:

#### 1. Pastikan `.env` sudah diisi dengan benar
```bash
# .env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx
NEXT_PUBLIC_MAPBOX_SESSION_TOKEN=sk.xxx
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

#### 2. Build dengan build args
```bash
# Otomatis via docker-compose (sudah dikonfigurasi)
docker-compose -f docker-compose.prod.yml build

# Atau manual via docker build
docker build \
  --build-arg NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx \
  --build-arg NEXT_PUBLIC_MAPBOX_SESSION_TOKEN=sk.xxx \
  --build-arg NEXT_PUBLIC_APP_URL=https://your-domain.com \
  -t sate-jip-app .
```

#### 3. Verifikasi env vars di container
```bash
# Start container
docker-compose -f docker-compose.prod.yml up -d

# Check env vars
docker exec sate-jip-app-diskominfo-prod env | grep NEXT_PUBLIC

# Buka browser console dan cek
console.log(process.env.NEXT_PUBLIC_MAPBOX_TOKEN)
```

### Konfigurasi yang Diperlukan

**Dockerfile:**
```dockerfile
# Build arguments
ARG NEXT_PUBLIC_MAPBOX_TOKEN
ARG NEXT_PUBLIC_MAPBOX_SESSION_TOKEN
ARG NEXT_PUBLIC_APP_URL

# Set environment variables for build
ENV NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN
ENV NEXT_PUBLIC_MAPBOX_SESSION_TOKEN=$NEXT_PUBLIC_MAPBOX_SESSION_TOKEN
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
```

**docker-compose.prod.yml:**
```yaml
services:
  app:
    build:
      args:
        - NEXT_PUBLIC_MAPBOX_TOKEN=${NEXT_PUBLIC_MAPBOX_TOKEN}
        - NEXT_PUBLIC_MAPBOX_SESSION_TOKEN=${NEXT_PUBLIC_MAPBOX_SESSION_TOKEN}
        - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
```

---

## Database Connection Error di Docker

### Gejala
```
Failed to establish database connection: ECONNREFUSED
```

### Penyebab
Database host tidak bisa diakses dari dalam container Docker.

### Solusi

#### 1. Cek konfigurasi database di `.env`
```bash
# Jangan gunakan 'localhost' jika database di host machine
DB_HOST=host.docker.internal  # Untuk Mac/Windows
# atau
DB_HOST=172.17.0.1  # Untuk Linux
# atau
DB_HOST=10.10.2.5   # IP server database production
```

#### 2. Verifikasi koneksi dari container
```bash
# Masuk ke container
docker exec -it sate-jip-app-diskominfo-prod sh

# Test koneksi ke database
nc -zv $DB_HOST $DB_PORT

# Jika nc tidak tersedia, install dulu
apk add netcat-openbsd
nc -zv $DB_HOST $DB_PORT
```

#### 3. Pastikan database port terbuka
```bash
# Di server database, pastikan MySQL listen ke 0.0.0.0
# Edit /etc/mysql/mysql.conf.d/mysqld.cnf
bind-address = 0.0.0.0

# Restart MySQL
sudo systemctl restart mysql
```

#### 4. Cek firewall
```bash
# Allow port 3306 dari Docker network
sudo ufw allow from 172.17.0.0/16 to any port 3306
```

---

## Port Already in Use

### Gejala
```
Error: bind: address already in use
```

### Solusi

#### 1. Cek process yang menggunakan port
```bash
# Mac/Linux
lsof -i :3001
netstat -tuln | grep 3001

# Kill process
kill -9 <PID>
```

#### 2. Atau gunakan port berbeda
Edit `docker-compose.prod.yml`:
```yaml
ports:
  - "3002:3000"  # Gunakan port 3002 di host
```

---

## Container Crash Loop / Restart Terus

### Diagnosis
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs --tail=100 app

# Check container status
docker ps -a
docker inspect sate-jip-app-diskominfo-prod
```

### Kemungkinan Penyebab

#### 1. Missing Environment Variables
**Solusi:** Pastikan semua env vars ada di `.env`

#### 2. Node Version Mismatch
**Solusi:** Rebuild dengan no cache
```bash
docker-compose -f docker-compose.prod.yml build --no-cache
```

#### 3. Permission Issues
**Solusi:** Sudah menggunakan non-root user di Dockerfile

---

## Build Gagal - npm ci Error

### Gejala
```
npm ci requires package-lock.json
```

### Solusi
```bash
# Generate package-lock.json
npm install --package-lock-only

# Commit ke git
git add package-lock.json
git commit -m "Add package-lock.json"

# Rebuild
docker-compose -f docker-compose.prod.yml build
```

---

## Image Size Terlalu Besar

### Diagnosis
```bash
docker images sate-jip-app
```

### Solusi

#### 1. Pastikan menggunakan multi-stage build
Dockerfile sudah menggunakan 3 stage (deps → builder → runner)

#### 2. Cek .dockerignore
Pastikan exclude:
- node_modules
- .next
- .git
- Documentation files

#### 3. Prune Docker
```bash
docker system prune -a
docker builder prune
```

---

## Health Check Failing

### Diagnosis
```bash
docker inspect sate-jip-app-diskominfo-prod | grep -A 10 Health
```

### Solusi

#### 1. Test health check manually
```bash
docker exec sate-jip-app-diskominfo-prod wget --spider -q http://localhost:3000
echo $?  # Harus 0 jika sukses
```

#### 2. Install wget di container (jika perlu)
Update Dockerfile:
```dockerfile
RUN apk add --no-cache wget
```

#### 3. Atau ubah health check command
```yaml
healthcheck:
  test: ["CMD-SHELL", "curl -f http://localhost:3000 || exit 1"]
```

---

## Browser Console Errors

### Map tidak load
```javascript
// Check di browser console
console.log('Mapbox Token:', process.env.NEXT_PUBLIC_MAPBOX_TOKEN);
```

**Jika undefined:** Rebuild Docker dengan build args (lihat solusi di atas)

### CORS Error
Pastikan `NEXT_PUBLIC_APP_URL` sesuai dengan domain yang diakses.

---

## Performance Issues

### Container lambat
```bash
# Check resource usage
docker stats sate-jip-app-diskominfo-prod

# Set resource limits di docker-compose.prod.yml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 2G
```

### Build terlalu lama
```bash
# Use layer caching - jangan selalu --no-cache
docker-compose -f docker-compose.prod.yml build

# Only use --no-cache jika ada masalah
docker-compose -f docker-compose.prod.yml build --no-cache
```

---

## Clean Start (Reset Everything)

Jika semua solusi di atas tidak berhasil:

```bash
# 1. Stop all containers
docker-compose -f docker-compose.prod.yml down

# 2. Remove all related containers
docker ps -a | grep sate-jip | awk '{print $1}' | xargs docker rm -f

# 3. Remove images
docker images | grep sate-jip | awk '{print $3}' | xargs docker rmi -f

# 4. Remove volumes (HATI-HATI: data akan hilang)
docker volume ls | grep sate-jip | awk '{print $2}' | xargs docker volume rm

# 5. Clean Docker system
docker system prune -a --volumes

# 6. Rebuild from scratch
docker-compose -f docker-compose.prod.yml build --no-cache

# 7. Start fresh
docker-compose -f docker-compose.prod.yml up -d
```

---

## Data Tidak Tampil di Tabel (Table Shows "No results")

### Gejala
- API endpoint mengembalikan data dengan benar
- Tabel di frontend menampilkan "No results found"
- Data `dataConfig` dalam format JSON string di database

### Penyebab
API mengembalikan `dataConfig` sebagai JSON string, bukan object. Frontend mengharapkan object, sehingga tidak bisa render data.

### Contoh Data dari API:
```json
{
  "id": "xxx",
  "dataType": "OPD",
  "dataConfig": "{\"name\":\"Dinas XXX\",\"address\":\"Jl. XXX\"}",  // ❌ String
  "createdAt": "2025-10-06"
}
```

### Yang Diharapkan:
```json
{
  "id": "xxx",
  "dataType": "OPD",
  "dataConfig": {  // ✅ Object
    "name": "Dinas XXX",
    "address": "Jl. XXX"
  },
  "createdAt": "2025-10-06"
}
```

### Solusi
Parse JSON string di frontend saat fetch data:

```typescript
// Di fetchAllData()
const rawData = await response.json();

// Parse dataConfig JSON string to object
const allData: ConfigData[] = rawData.map((item: any) => ({
  ...item,
  dataConfig: typeof item.dataConfig === 'string'
    ? JSON.parse(item.dataConfig)
    : item.dataConfig
}));
```

### Lokasi File:
- `src/app/dataConfig/page.tsx` - Line ~217-225

### Verifikasi:
1. Buka browser console: `http://localhost:3001/dataConfig`
2. Check Network tab, lihat response `/api/configs`
3. Pastikan data ter-parse dengan benar

---

## Getting Help

### Log Collection
```bash
# Container logs
docker-compose -f docker-compose.prod.yml logs --tail=200 > logs.txt

# System info
docker version > system-info.txt
docker-compose version >> system-info.txt
docker info >> system-info.txt

# Environment check
docker exec sate-jip-app-diskominfo-prod env > env-vars.txt
```

### Debug Mode
```bash
# Start container dengan verbose logging
docker-compose -f docker-compose.prod.yml up --verbose

# Masuk ke container untuk debug
docker exec -it sate-jip-app-diskominfo-prod sh
```

---

## Checklist Debugging

- [ ] `.env` file ada dan terisi lengkap
- [ ] Database bisa diakses dari container
- [ ] Environment variables ter-pass ke build args
- [ ] Port tidak konflik dengan service lain
- [ ] Docker images ter-build dengan benar
- [ ] Container status healthy
- [ ] Browser console tidak ada error
- [ ] Mapbox token valid dan aktif
- [ ] Firewall tidak blocking koneksi

---

**Untuk bantuan lebih lanjut:**
- Cek logs: `./docker-start.sh logs`
- Review konfigurasi: [DOCKER.md](./DOCKER.md)
- Hubungi tim development Diskominfo Madiun
