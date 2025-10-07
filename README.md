# SATE-JIP: Sistem Informasi Infrastruktur Regional

## Gambaran Umum

SATE-JIP (Sistem Aplikasi Terintegrasi - Jaringan Infrastruktur Pemerintah) adalah aplikasi berbasis web yang komprehensif yang dirancang untuk mengelola dan memantau data infrastruktur pemerintah Kabupaten Madiun. Sistem ini menyediakan manajemen terpusat untuk lokasi infrastruktur internet, personel administratif, dan penjadwalan kegiatan di seluruh kantor pemerintah (OPD).

## Fitur Utama

### Manajemen Infrastruktur
- Visualisasi peta interaktif lokasi infrastruktur menggunakan Mapbox
- Data lokasi komprehensif termasuk koordinat, spesifikasi internet, dan jenis infrastruktur
- Dukungan untuk berbagai kategori infrastruktur: kantor OPD, fasilitas publik, dan kantor kecamatan
- Pemantauan status lokasi secara real-time (aktif, tidak aktif, pemeliharaan)
- Informasi infrastruktur terperinci termasuk penyedia ISP, kecepatan internet, dan jenis koneksi

### Manajemen Administratif
- Sistem informasi personel (PIC) untuk setiap kantor pemerintah
- Manajemen kontak dengan integrasi WhatsApp
- Kontrol akses berbasis peran untuk administrator
- Autentikasi pengguna dan manajemen sesi

### Kalender Aktivitas
- Sistem kalender interaktif dengan berbagai mode tampilan (bulan, minggu, hari, tahun)
- Pembuatan dan pengelolaan acara untuk kegiatan pemerintah
- Kategorisasi acara berbasis OPD
- Penjadwalan ulang acara dengan drag-and-drop
- Klasifikasi acara dengan kode warna
- Kemampuan filter dan pencarian acara

### Visualisasi Data
- Dashboard statistik dengan diagram lingkaran dan tabel
- Analitik distribusi lokasi
- Statistik penyedia ISP
- Distribusi jenis infrastruktur
- Analisis kecepatan internet dan infrastruktur

### Manajemen Konfigurasi
- Konfigurasi OPD (Organisasi Perangkat Daerah)
- Pengaturan penyedia ISP
- Manajemen konfigurasi sistem

## Stack Teknologi

### Frontend
- **Framework**: Next.js 15.1.4 (React 19)
- **Komponen UI**: Radix UI, shadcn/ui
- **Styling**: Tailwind CSS v4
- **Animasi**: Framer Motion
- **Peta**: Mapbox GL JS, React Map GL
- **Form**: React Hook Form dengan validasi Zod
- **Tabel**: TanStack Table (React Table v8)
- **Grafik**: Recharts
- **Ikon**: Lucide React

### Backend
- **Runtime**: Node.js 18
- **Database ORM**: Drizzle ORM
- **Database**: MySQL
- **API**: Next.js API Routes

### Alat Pengembangan
- **Bahasa**: TypeScript
- **Package Manager**: npm
- **Linting**: ESLint
- **Code Formatting**: Prettier (implisit melalui ESLint)

### Deployment
- **Containerization**: Docker dengan multi-stage builds
- **Development**: Docker Compose dengan hot-reload
- **Production**: Build standalone Next.js yang teroptimasi

## Persyaratan Sistem

### Untuk Pengembangan
- Node.js 18 atau lebih tinggi
- npm 9 atau lebih tinggi
- MySQL 8.0 atau lebih tinggi
- Git

### Untuk Deployment Docker
- Docker Engine 20.10 atau lebih tinggi
- Docker Compose 2.0 atau lebih tinggi

## Instalasi

### Setup Pengembangan Lokal

1. Clone repository:
```bash
git clone https://github.com/diskominfo-madiunkab/sate-itik-diskominfo.git
cd sate-jip
```

2. Install dependencies:
```bash
npm install
```

3. Konfigurasi environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` dengan kredensial database Anda:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password_anda
DB_NAME=sate_jip_db
```

4. Jalankan migrasi database:
```bash
npm run db:push
```

5. Jalankan development server:
```bash
npm run dev
```

Aplikasi akan tersedia di `http://localhost:3000`.

### Deployment Docker

#### Mode Development

1. Jalankan container development:
```bash
docker compose -f docker-compose.dev.yml up
```

Mode ini mencakup:
- Fungsi hot-reload
- Source code di-mount sebagai volume
- Port 3000 diekspos

#### Mode Production

1. Build dan jalankan container production:
```bash
docker compose up -d
```

Mode ini mencakup:
- Build multi-stage yang teroptimasi
- Server Next.js standalone
- Konfigurasi production-ready
- Non-root user untuk keamanan

2. Lihat logs:
```bash
docker compose logs -f
```

3. Hentikan container:
```bash
docker compose down
```

## Panduan Pengguna

### Autentikasi

1. Navigasi ke `/login`
2. Masukkan kredensial admin:
   - Username: `admin`
   - Password: `password`
3. Klik "Login" untuk mengakses dashboard

### Navigasi Dashboard

Dashboard utama (`/dashboard`) menyediakan akses ke:

- **Tampilan Peta**: Visualisasi Mapbox interaktif dari semua lokasi infrastruktur
- **Tabel Lokasi**: Tabel komprehensif dari semua lokasi terdaftar dengan filter dan sorting
- **Tabel Admin**: Manajemen informasi personel dan kontak
- **Statistik**: Analitik visual dari distribusi infrastruktur

### Mengelola Lokasi

1. Navigasi ke dashboard
2. Gunakan peta untuk melihat pin lokasi
3. Klik pada pin mana pun untuk melihat informasi terperinci
4. Gunakan tabel lokasi untuk:
   - Mencari lokasi tertentu
   - Filter berdasarkan berbagai kriteria
   - Sorting berdasarkan kolom
   - Ekspor data

### Kalender Aktivitas

Akses kalender di `/activityCalendar`:

1. **Melihat Acara**:
   - Beralih antara tampilan Bulan, Minggu, Hari, dan Tahun
   - Klik pada acara mana pun untuk melihat detail
   - Gunakan navigator tanggal untuk berpindah antar periode

2. **Membuat Acara**:
   - Klik "Add Event" atau klik pada tanggal
   - Isi detail acara:
     - Judul (wajib)
     - Nama OPD (wajib)
     - Tanggal/Waktu Mulai (wajib)
     - Tanggal/Waktu Selesai (wajib)
     - Deskripsi (opsional)
     - Kategori warna
   - Klik "Create" untuk menyimpan

3. **Mengedit Acara**:
   - Klik pada acara untuk membuka detail
   - Klik tombol "Edit"
   - Modifikasi informasi acara
   - Simpan perubahan

4. **Drag and Drop**:
   - Drag acara untuk menjadwal ulang
   - Dialog konfirmasi muncul (jika diaktifkan di pengaturan)
   - Konfirmasi atau batalkan perubahan

5. **Pengaturan Kalender**:
   - Toggle format 12/24 jam
   - Aktifkan/nonaktifkan konfirmasi drag
   - Ubah gaya badge acara (dot/standard)

### Manajemen Konfigurasi

Akses konfigurasi di `/dataConfig`:

1. **Konfigurasi OPD**:
   - Tambahkan kantor pemerintah baru
   - Edit informasi OPD yang ada
   - Kelola jenis OPD dan alamat

2. **Konfigurasi ISP**:
   - Tambahkan penyedia layanan internet
   - Update informasi penyedia

## Panduan Developer

### Struktur Proyek

```
src/
├── app/                          # Direktori aplikasi Next.js
│   ├── activityCalendar/        # Halaman kalender
│   ├── api/                     # Route API
│   │   ├── event/              # Endpoint manajemen event
│   │   └── statistics/         # Endpoint statistik
│   ├── context/                # Context React
│   ├── dashboard/              # Halaman dashboard
│   ├── dataConfig/             # Halaman konfigurasi
│   └── login/                  # Halaman autentikasi
├── components/                  # Komponen bersama
│   ├── chart/                  # Komponen chart
│   ├── map/                    # Komponen map
│   ├── sidebar/                # Sidebar navigasi
│   └── ui/                     # Primitif UI
├── lib/                        # Utilitas dan konfigurasi
│   ├── data/                   # Data statis dan mock data
│   ├── db/                     # Konfigurasi database
│   ├── mapbox/                 # Utilitas Mapbox
│   └── utils/                  # Fungsi helper
└── modules/                    # Modul fitur
    └── components/
        └── calendar/           # Modul kalender
```

### Skema Database

Aplikasi menggunakan Drizzle ORM dengan MySQL. Tabel utama:

**eventCalendar**
- `id`: Primary key auto-increment
- `title`: Judul event (wajib)
- `description`: Deskripsi event (opsional)
- `opdName`: Nama OPD terkait (wajib)
- `startDate`: Timestamp mulai event (wajib)
- `endDate`: Timestamp selesai event (wajib)
- `color`: Warna kategori event (wajib)
- `createdAt`: Timestamp pembuatan record
- `updatedAt`: Timestamp update record

Lihat `src/lib/db/schema.ts` untuk definisi skema lengkap.

### Endpoint API

#### Manajemen Event

**GET /api/event**
- Mengambil semua event
- Returns: Array objek event

**POST /api/event**
- Membuat event baru
- Body: Data event sesuai eventSchema
- Returns: Objek event yang dibuat

**GET /api/event/[id]**
- Mengambil satu event
- Params: Event ID
- Returns: Objek event

**PUT /api/event/[id]**
- Update event
- Params: Event ID
- Body: Data event yang diupdate
- Returns: Objek event yang diupdate

**DELETE /api/event/[id]**
- Hapus event
- Params: Event ID
- Returns: Status sukses

Lihat `src/app/api/event/route.ts` untuk detail implementasi.

### Menambahkan Fitur Baru

#### Menambahkan Halaman Baru

1. Buat file halaman di `src/app/halaman-anda/page.tsx`:
```typescript
"use client";

export default function HalamanBaru() {
  return <div>Konten Halaman Baru</div>;
}
```

2. Tambahkan route ke sidebar di `src/components/sidebar/app-sidebar.tsx`:
```typescript
{
  title: "Fitur Baru",
  url: "/fitur-baru",
  icon: Icon,
}
```

#### Menambahkan Route API Baru

1. Buat file route di `src/app/api/route-anda/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Implementasi
  return NextResponse.json({ data: [] });
}
```

2. Implementasikan request handler dengan validasi yang tepat menggunakan Zod
3. Gunakan Drizzle ORM untuk operasi database

#### Membuat Komponen Baru

1. Buat file komponen di direktori yang sesuai:
```typescript
"use client"; // Jika menggunakan fitur client-side

interface ComponentProps {
  // Definisi props
}

export function KomponenBaru({ }: ComponentProps) {
  return <div>Konten Komponen</div>;
}
```

2. Export dari index jika membuat library komponen

### Environment Variables

Variabel yang diperlukan di `.env.local`:

```env
# Konfigurasi Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password_anda
DB_NAME=sate_jip_db

# Mapbox (jika diperlukan)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=token_anda
```

### Migrasi Database

Menggunakan Drizzle Kit:

```bash
# Generate migration
npm run db:generate

# Push perubahan langsung ke database
npm run db:push

# Buka Drizzle Studio
npm run db:studio
```

Lihat `drizzle.config.ts` untuk konfigurasi.

### Panduan Gaya Kode

- Gunakan TypeScript untuk semua kode baru
- Ikuti pola komponen fungsional React
- Gunakan directive `"use client"` untuk komponen client
- Implementasikan error handling yang tepat dengan try-catch
- Gunakan Zod untuk validasi skema
- Ikuti konvensi penamaan yang ada
- Tambahkan komentar JSDoc untuk fungsi yang kompleks

### Checklist Testing

Sebelum deployment:

1. Test alur autentikasi
2. Verifikasi semua operasi CRUD
3. Cek fungsionalitas kalender di semua tampilan
4. Validasi pengiriman form
5. Test fitur drag-and-drop
6. Verifikasi persistensi data
7. Cek desain responsif
8. Test Docker builds

## Referensi API

### API Event Kalender

Semua endpoint event berada di `/api/event`.

**Skema Event**:
```typescript
{
  title: string;          // Wajib, minimal 1 karakter
  description?: string;   // Opsional
  opdName: string;        // Wajib, minimal 1 karakter
  startDate: string;      // Wajib, format ISO 8601
  endDate: string;        // Wajib, format ISO 8601
  color: "blue" | "green" | "red" | "yellow" | "purple" | "orange"; // Wajib
}
```

**Format Response**:
```typescript
{
  id: number;
  title: string;
  description: string | null;
  opdName: string;
  startDate: string;
  endDate: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}
```

## Deployment

### Checklist Deployment Production

1. Update environment variables untuk production
2. Set kredensial database yang aman
3. Konfigurasi host database production
4. Build Docker image:
```bash
docker compose build
```

5. Jalankan services:
```bash
docker compose up -d
```

6. Verifikasi deployment:
```bash
docker compose logs -f
```

7. Test semua fungsionalitas kritis
8. Setup monitoring dan logging

### Konfigurasi Docker

Konfigurasi production menggunakan:
- Build multi-stage untuk optimasi
- Non-root user untuk keamanan
- Output standalone Next.js
- Port 3000 diekspos

Lihat `Dockerfile` dan `docker-compose.yml` untuk detail.

## Troubleshooting

### Masalah Umum

**Koneksi Database Gagal**
- Verifikasi kredensial database di `.env.local`
- Cek service MySQL berjalan
- Konfirmasi database ada dan dapat diakses

**Docker Build Gagal**
- Bersihkan cache Docker: `docker system prune -a`
- Rebuild tanpa cache: `docker compose build --no-cache`
- Cek ketersediaan ruang disk

**Event Kalender Tidak Tersimpan**
- Verifikasi endpoint API dapat diakses
- Cek network tab untuk error response
- Validasi data event terhadap skema

**Peta Tidak Ditampilkan**
- Verifikasi token Mapbox valid
- Cek browser console untuk error
- Pastikan koordinat geografis valid

### Mendapatkan Bantuan

Untuk masalah yang tidak tercakup di sini:
1. Cek dokumentasi yang ada di `CALENDAR_INTEGRATION_PLAN.md`
2. Review `DOCKER_DEPLOYMENT.md` untuk masalah deployment
3. Inspeksi browser console untuk error client-side
4. Cek server logs untuk error API

## Kontribusi

Ketika berkontribusi pada proyek ini:

1. Fork repository
2. Buat feature branch
3. Ikuti gaya kode dan konvensi yang ada
4. Tulis commit message yang jelas
5. Test secara menyeluruh sebelum submit
6. Update dokumentasi sesuai kebutuhan
7. Submit pull request dengan deskripsi detail

## Lisensi

Proyek ini adalah perangkat lunak proprietary yang dikembangkan untuk Dinas Komunikasi dan Informatika Kabupaten Madiun.

---

<div align="center">

**Informasi Proyek**

Versi: 1.0.0 | Terakhir Diperbarui: 2025

Dipelihara oleh: [Arief Satria](https://github.com/illufoxKusanagi)

Organisasi: Dinas Komunikasi dan Informatika Kabupaten Madiun

---

© 2025 Dinas Komunikasi dan Informatika Kabupaten Madiun. Hak cipta dilindungi.

</div>
