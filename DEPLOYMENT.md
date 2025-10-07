# Panduan Deployment Production

## Persiapan Environment

### 1. Environment Variables
Salin file `.env.example` menjadi `.env` dan isi dengan nilai yang sesuai:

```bash
cp .env.example .env
```

Konfigurasi yang perlu diisi:
- `NEXT_PUBLIC_MAPBOX_TOKEN`: Token Mapbox untuk fitur peta
- `NEXT_PUBLIC_MAPBOX_SESSION_TOKEN`: Session token Mapbox
- `DATABASE_URL`: URL koneksi database MySQL
- `DB_HOST`: Host database
- `DB_PORT`: Port database (default: 3306)
- `DB_USER`: Username database
- `DB_PASSWORD`: Password database
- `DB_NAME`: Nama database
- `NEXT_PUBLIC_APP_URL`: URL aplikasi di production
- `JWT_SECRET`: Secret key untuk JWT authentication

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Generate dan push schema database:

```bash
npm run db:generate
npm run db:push
```

Seed data admin (opsional):

```bash
npm run db:seed-admins
```

## Build Production

### Standard Build

```bash
npm run build
```

Build akan menghasilkan folder `.next` dengan optimasi production.

### Start Production Server

```bash
npm start
```

Server akan berjalan di port 3000 (default).

## Deployment dengan Docker (Recommended)

### Persiapan

Pastikan sudah install Docker dan Docker Compose:
```bash
docker --version
docker-compose --version
```

### 1. Setup Environment

Copy file `.env.example` menjadi `.env` dan sesuaikan konfigurasi:

```bash
cp .env.example .env
```

Edit file `.env` dengan konfigurasi production yang sesuai.

### 2. Build dan Run dengan Docker Compose

#### Development Mode
```bash
docker-compose -f docker-compose.dev.yml up -d
```

#### Production Mode (Recommended)
```bash
# Build image
docker-compose -f docker-compose.prod.yml build

# Run container
docker-compose -f docker-compose.prod.yml up -d
```

Atau gunakan npm scripts:
```bash
npm run docker:up    # Development
```

### 3. Monitoring

Cek status container:
```bash
docker-compose -f docker-compose.prod.yml ps
```

Lihat logs:
```bash
# Real-time logs
docker-compose -f docker-compose.prod.yml logs -f

# atau dengan npm script
npm run docker:logs
```

Cek health container:
```bash
docker inspect sate-jip-app-diskominfo-prod | grep -A 10 Health
```

### 4. Manage Container

Stop container:
```bash
docker-compose -f docker-compose.prod.yml down
# atau
npm run docker:down
```

Restart container:
```bash
docker-compose -f docker-compose.prod.yml restart
```

Rebuild setelah update code:
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### 5. Database Migration di Docker

Jalankan migration dalam container:
```bash
# Generate schema
docker exec -it sate-jip-app-diskominfo-prod npm run db:generate

# Push ke database
docker exec -it sate-jip-app-diskominfo-prod npm run db:push

# Seed admins
docker exec -it sate-jip-app-diskominfo-prod npm run db:seed-admins
```

### Docker Image Size Optimization

Image menggunakan multi-stage build untuk ukuran minimal:
- Stage 1: Install dependencies
- Stage 2: Build aplikasi
- Stage 3: Runtime image (hanya file yang diperlukan)

Hasil: Image production ~150-200MB (vs ~1GB tanpa optimization)

## Deployment ke Server Production

### Menggunakan PM2 (Recommended)

1. Install PM2 globally:
```bash
npm install -g pm2
```

2. Build aplikasi:
```bash
npm run build
```

3. Start dengan PM2:
```bash
pm2 start npm --name "sate-itik" -- start
```

4. Auto restart saat reboot:
```bash
pm2 startup
pm2 save
```

### Menggunakan Nginx sebagai Reverse Proxy

Contoh konfigurasi Nginx:

```nginx
server {
    listen 80;
    server_name sate-itik.madiunkab.go.id;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Checklist Production

- [ ] Environment variables sudah dikonfigurasi dengan benar
- [ ] Database sudah disetup dan migrasi berhasil
- [ ] Build berhasil tanpa error
- [ ] SSL/TLS certificate sudah terpasang (HTTPS)
- [ ] Firewall dikonfigurasi dengan benar
- [ ] Backup database sudah diatur
- [ ] Monitoring dan logging sudah disetup
- [ ] PM2 atau process manager lain sudah dikonfigurasi
- [ ] Nginx atau reverse proxy sudah dikonfigurasi

## Troubleshooting

### Build Error
Jika terjadi error saat build, cek:
1. Versi Node.js minimal v18.17
2. Semua dependencies terinstall dengan benar
3. Environment variables sudah lengkap

### Database Connection Error
1. Pastikan database server bisa diakses dari server aplikasi
2. Cek credential database di `.env`
3. Pastikan database sudah dibuat

### Port Already in Use
Jika port 3000 sudah digunakan, set custom port:
```bash
PORT=3001 npm start
```

## Monitoring & Maintenance

### Check Application Status
```bash
pm2 status
pm2 logs sate-itik
```

### Restart Application
```bash
pm2 restart sate-itik
```

### Update Application
```bash
git pull
npm install
npm run build
pm2 restart sate-itik
```

## Security Best Practices

1. Gunakan HTTPS di production
2. Jangan commit file `.env` ke git
3. Gunakan password database yang kuat
4. Update dependencies secara berkala
5. Enable rate limiting untuk API endpoints
6. Backup database secara regular
7. Monitor logs untuk aktivitas mencurigakan

## Performance Optimization

Aplikasi sudah dikonfigurasi dengan:
- ✅ Standalone output untuk deployment yang lebih ringan
- ✅ Gzip compression
- ✅ Image optimization (AVIF, WebP)
- ✅ Static page generation
- ✅ Security headers

## Support

Untuk issue atau pertanyaan, hubungi tim development Diskominfo Kabupaten Madiun.
