# SATE-ITIK: Sistem Akses Terpadu Infrastruktur Jaringan TIK

## Gambaran Umum

SATE-ITIK (Sistem Akses Terpadu Infrastruktur Jaringan TIK) adalah aplikasi berbasis web yang komprehensif yang dirancang untuk mengelola dan memantau data infrastruktur pemerintah Kabupaten Madiun. Sistem ini menyediakan manajemen terpusat untuk lokasi infrastruktur internet, personel administratif, penjadwalan kegiatan, server datacenter, dan sistem helpdesk di seluruh kantor pemerintah (OPD).

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
- Kontrol akses berbasis peran (role-based access control)
- Autentikasi pengguna dengan JWT (JSON Web Tokens)
- Manajemen sesi yang aman dengan enkripsi password menggunakan bcrypt

### Manajemen Server & Datacenter

- **Visualisasi Rak Server**: Tampilan visual interaktif dari rak server (Rak A, B, C, D)
- **Manajemen Unit Server**: Pelacakan posisi unit, ukuran, dan status setiap server
- **Monitoring Status**: Pemantauan real-time status server (online, offline, maintenance, standby)
- **Informasi Aset**: Pencatatan nomor aset, serial number, IP address, dan spesifikasi teknis
- **Aplikasi Terinstal**: Dokumentasi aplikasi yang terinstal di setiap server
- **Dual View**: Mode visualisasi rak dan tabel data untuk kemudahan manajemen

### Sistem Helpdesk & Ticketing

- **Pembuatan Tiket**: Form pengajuan tiket dukungan dari pengguna
- **Kategori Tiket**: Klasifikasi tiket berdasarkan kategori yang dapat dikonfigurasi
- **Prioritas Tiket**: Manajemen prioritas (rendah, sedang, tinggi, urgent)
- **Status Tracking**: Pelacakan status tiket (terbuka, dalam progress, menunggu jawaban, selesai, ditutup)
- **Sistem Balasan**: Thread komunikasi antara pengguna dan staff
- **File Attachment**: Dukungan upload file untuk dokumentasi masalah
- **Rich Text Editor**: Editor TipTap untuk format pesan yang lebih baik
- **Email Notification**: Integrasi dengan Resend & Nodemailer untuk notifikasi email
- **Assignment System**: Penugasan tiket ke staff tertentu
- **Response Metrics**: Pelacakan waktu respon pertama dan waktu penyelesaian

### Kalender Aktivitas

- Sistem kalender interaktif dengan berbagai mode tampilan (bulan, minggu, hari, tahun)
- Pembuatan dan pengelolaan acara untuk kegiatan pemerintah
- Kategorisasi acara berbasis OPD
- Penjadwalan ulang acara dengan drag-and-drop
- Klasifikasi acara dengan kode warna
- Kemampuan filter dan pencarian acara
- Pengaturan format waktu 12/24 jam

### Visualisasi Data

- Dashboard statistik dengan diagram lingkaran dan tabel
- Analitik distribusi lokasi
- Statistik penyedia ISP
- Distribusi jenis infrastruktur
- Analisis kecepatan internet dan infrastruktur
- Dashboard pusat data untuk monitoring menyeluruh

### Manajemen Konfigurasi

- Konfigurasi OPD (Organisasi Perangkat Daerah)
- Pengaturan penyedia ISP
- Manajemen kategori tiket
- Konfigurasi sistem umum

## Stack Teknologi

### Frontend

- **Framework**: Next.js 15.5.3 (React 19.1)
- **Komponen UI**: Radix UI, shadcn/ui
- **Styling**: Tailwind CSS v4
- **Animasi**: Framer Motion, Motion
- **Peta**: Mapbox GL JS, React Map GL
- **Form**: React Hook Form dengan validasi Zod v4
- **Tabel**: TanStack Table (React Table v8)
- **Grafik**: Recharts
- **Ikon**: Lucide React
- **Kalender**: FullCalendar v6.1
- **Rich Text Editor**: TipTap v3.8 dengan Extension Image & Link
- **File Upload**: UploadThing
- **Notifikasi**: Sonner (Toast notifications)
- **Theming**: next-themes untuk dark/light mode

### Backend

- **Runtime**: Node.js 20+
- **Database ORM**: Drizzle ORM v0.44
- **Database**: MySQL 8.0+
- **API**: Next.js API Routes dengan Vercel Functions
- **Autentikasi**: JWT (JSON Web Tokens) dengan jose library
- **Password Hashing**: bcryptjs
- **Email Service**: Resend, Nodemailer
- **ID Generation**: UUID v13, NanoID v5

### Alat Pengembangan

- **Bahasa**: TypeScript 5
- **Package Manager**: npm
- **Linting**: ESLint
- **Database Tools**: Drizzle Kit v0.31
- **Script Runner**: tsx untuk TypeScript execution
- **Environment Management**: dotenv-cli

### Deployment

- **Containerization**: Docker dengan multi-stage builds
- **Development**: Docker Compose dengan hot-reload
- **Production**: Build standalone Next.js yang teroptimasi

## Persyaratan Sistem

### Untuk Pengembangan

- Node.js 20 atau lebih tinggi
- npm 9 atau lebih tinggi
- MySQL 8.0+
- Git

### Untuk Deployment Docker

- Docker Engine 20.10 atau lebih tinggi
- Docker Compose 2.0 atau lebih tinggi

## Instalasi

### Setup Pengembangan Lokal

1. Clone repository:

```bash
git clone https://github.com/diskominfo-madiunkab/sate-itik-diskominfo.git
cd sate-itik
```

2. Install dependencies:

```bash
npm install
```

3. Konfigurasi environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` dengan kredensial Anda:

```env
# Database Configuration (MySQL)
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sate_itik_db

# JWT Secret (generate dengan: openssl rand -base64 32)
JWT_SECRET=your_jwt_secret_key

# Mapbox (opsional)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token

# Email Service (opsional)
RESEND_API_KEY=your_resend_api_key

# UploadThing (opsional)
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

4. Jalankan migrasi database:

```bash
npm run db:push
```

5. Seed data admin awal (opsional):

```bash
npm run db:seed
```

6. Jalankan development server:

```bash
npm run dev
```

Aplikasi akan tersedia di `http://localhost:3000`.

### Deployment Docker

#### Mode Development

1. Jalankan dengan MySQL:

```bash
npm run docker:up:mysql
```

Mode ini mencakup:

- Fungsi hot-reload
- Source code di-mount sebagai volume
- Port 3000 diekspos
- Database service terintegrasi

2. Lihat logs:

```bash
npm run docker:logs:mysql
```

#### Mode Production

1. Build dan jalankan container production:

```bash
docker compose -f docker-compose.prod.yml up -d
```

Mode ini mencakup:

- Build multi-stage yang teroptimasi
- Server Next.js standalone
- Konfigurasi production-ready
- Non-root user untuk keamanan
- Health checks

2. Hentikan container:

```bash
npm run docker:down
```

## Panduan Pengguna

### Autentikasi

1. Navigasi ke `/login`
2. Masukkan kredensial admin:
   - Username: sesuai data seed
   - Password: sesuai data seed
3. Sistem akan menggunakan JWT untuk manajemen sesi
4. Token disimpan secara aman di localStorage

### Navigasi Dashboard

Dashboard utama (`/dashboard`) menyediakan akses ke:

- **Tampilan Peta**: Visualisasi Mapbox interaktif dari semua lokasi infrastruktur
- **Tabel Lokasi**: Tabel komprehensif dari semua lokasi terdaftar dengan filter dan sorting
- **Tabel Admin/PIC**: Manajemen informasi personel dan kontak
- **Statistik**: Analitik visual dari distribusi infrastruktur

### Manajemen Lokasi

1. Navigasi ke `/locations` atau dashboard
2. Gunakan peta untuk melihat pin lokasi
3. Klik pada pin untuk melihat informasi terperinci
4. Gunakan tabel lokasi untuk:
   - Mencari lokasi tertentu
   - Filter berdasarkan berbagai kriteria
   - Sorting berdasarkan kolom
   - Edit atau hapus data (untuk admin)

### Manajemen Server (`/server-management`)

1. **Visualisasi Rak**:

   - Lihat tampilan visual dari 4 rak server (A, B, C, D)
   - Setiap unit menampilkan status dengan kode warna
   - Klik unit untuk melihat detail server

2. **Menambah Server**:

   - Klik tombol "Add Server"
   - Isi informasi: nama server, posisi unit, ukuran, rak, brand
   - Tambahkan nomor aset, serial number, IP address
   - Pilih status (online, offline, maintenance, standby)
   - Input spesifikasi teknis (JSON format)
   - Daftar aplikasi terinstal

3. **Data Table View**:
   - Lihat semua server dalam format tabel
   - Filter dan sort data
   - Edit atau hapus server

### Sistem Helpdesk (`/tickets`)

1. **Mengajukan Tiket**:

   - Navigasi ke `/tickets`
   - Isi form tiket:
     - Subject (judul masalah)
     - Kategori (pilih dari daftar)
     - Prioritas (rendah, sedang, tinggi, urgent)
     - Deskripsi detail
     - Email dan nomor telepon
     - Upload file pendukung (opsional)

2. **Manajemen Tiket** (`/tickets/help-desk`):

   - Lihat semua tiket yang masuk
   - Filter berdasarkan status, prioritas, kategori
   - Assign tiket ke staff
   - Update status tiket
   - Balas tiket dengan rich text editor
   - Upload file attachment dalam balasan

3. **Status Tiket**:
   - **Terbuka**: Tiket baru yang belum ditangani
   - **Dalam Progress**: Sedang dikerjakan
   - **Menunggu Jawaban**: Menunggu respon dari pengguna
   - **Selesai**: Masalah telah diselesaikan
   - **Ditutup**: Tiket ditutup secara permanen

### Kalender Aktivitas (`/activity-calendar`)

1. **Melihat Acara**:

   - Beralih antara tampilan Bulan, Minggu, Hari, dan Tahun
   - Klik pada acara untuk melihat detail
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
   - Dialog konfirmasi muncul (jika diaktifkan)
   - Konfirmasi atau batalkan perubahan

### Manajemen Admin/PIC (`/admins`)

1. Navigasi ke halaman Admin
2. Lihat daftar seluruh PIC (Penanggung Jawab)
3. Tambah PIC baru (untuk admin):
   - Klik "Tambahkan PIC"
   - Isi nama, NIP, jabatan, instansi, nomor WhatsApp
4. Edit atau hapus data PIC yang ada

### Konfigurasi Data (`/data-config`)

1. **Konfigurasi OPD**:

   - Tambahkan kantor pemerintah baru
   - Edit informasi OPD yang ada
   - Kelola jenis OPD dan alamat

2. **Konfigurasi ISP**:

   - Tambahkan penyedia layanan internet
   - Update informasi penyedia

3. **Kategori Tiket**:
   - Buat kategori tiket baru
   - Atur warna dan ikon kategori
   - Aktifkan/nonaktifkan kategori

## Panduan Developer

### Struktur Proyek

```
src/
├── app/                          # Direktori aplikasi Next.js
│   ├── access-denied/           # Halaman akses ditolak
│   ├── activity-calendar/       # Halaman kalender
│   ├── admins/                  # Halaman manajemen PIC
│   ├── api/                     # Route API
│   │   ├── admins/             # Endpoint manajemen admin
│   │   ├── configs/            # Endpoint konfigurasi
│   │   ├── event/              # Endpoint manajemen event
│   │   ├── locations/          # Endpoint lokasi
│   │   ├── login/              # Endpoint autentikasi
│   │   ├── logout/             # Endpoint logout
│   │   ├── server-data/        # Endpoint data server
│   │   ├── statistics/         # Endpoint statistik
│   │   ├── tickets/            # Endpoint tiket helpdesk
│   │   └── uploadthing/        # Endpoint upload file
│   ├── context/                # Context React
│   │   ├── auth-context.tsx   # Context autentikasi
│   │   └── map-context.tsx    # Context peta
│   ├── dashboard/              # Halaman dashboard
│   ├── data-central-dashboard/ # Dashboard pusat data
│   ├── data-config/            # Halaman konfigurasi
│   ├── locations/              # Halaman lokasi
│   ├── login/                  # Halaman autentikasi
│   ├── server-management/      # Halaman manajemen server
│   ├── tickets/                # Halaman tiket helpdesk
│   │   └── help-desk/         # Dashboard admin tiket
│   └── unauthorized/           # Halaman unauthorized
├── components/                  # Komponen bersama
│   ├── chart/                  # Komponen chart & tabel
│   ├── dialogs/                # Dialog components
│   ├── forms/                  # Form components
│   ├── layout/                 # Layout components
│   ├── map/                    # Komponen map
│   ├── sidebar/                # Sidebar navigasi
│   └── ui/                     # Primitif UI (shadcn)
├── lib/                        # Utilitas dan konfigurasi
│   ├── data/                   # Data statis dan mock data
│   ├── db/                     # Konfigurasi database
│   │   ├── schema.mysql.ts    # Schema MySQL
│   │   └── connection.ts      # Database connection
│   ├── mapbox/                 # Utilitas Mapbox
│   ├── types/                  # TypeScript types
│   └── utils/                  # Fungsi helper
└── modules/                    # Modul fitur
    └── components/
        └── calendar/           # Modul kalender
```

### Skema Database

Aplikasi menggunakan Drizzle ORM dengan dukungan MySQL. Tabel utama:

**locations** - Lokasi infrastruktur

- `id`: Primary key (UUID)
- `locationName`: Nama lokasi
- `latitude`, `longitude`: Koordinat geografis
- `opdPengampu`: OPD pengelola
- `ispName`: Nama ISP
- `internetSpeed`, `internetRatio`: Spesifikasi internet
- `status`: Status lokasi (active, inactive, maintenance)

**admins** - Data PIC/Admin

- `id`: Primary key (UUID)
- `nama`, `nip`, `jabatan`: Informasi personel
- `instansi`: Instansi tempat bekerja
- `whatsapp`: Nomor kontak

**users** - Pengguna sistem

- `id`: Primary key (UUID)
- `username`: Username (unique)
- `password`: Password terenkripsi (bcrypt)
- `role`: Peran (admin, user)

**eventCalendar** - Event/Kegiatan

- `id`: Primary key (UUID)
- `title`, `description`: Informasi event
- `startDate`, `endDate`: Waktu event
- `opdName`: OPD penyelenggara
- `color`: Warna kategori

**serverData** - Data Server

- `id`: Primary key (UUID)
- `serverName`: Nama server
- `unitPosition`, `unitSize`: Posisi di rak
- `rackName`: Nama rak (A, B, C, D)
- `assetNumber`, `serialNumber`: Nomor identifikasi
- `ipAddress`: IP Address
- `status`: Status (online, offline, maintenance, standby)
- `specification`: Spesifikasi teknis (JSON)
- `installedApps`: Aplikasi terinstal (JSON array)

**tickets** - Tiket Helpdesk

- `id`: Primary key (NanoID)
- `ticketNumber`: Nomor tiket (unique)
- `subject`, `description`: Isi tiket
- `submittedBy`, `email`, `phone`: Info pelapor
- `categoryId`: Kategori tiket (foreign key)
- `priority`: Prioritas (rendah, sedang, tinggi, urgent)
- `status`: Status tiket
- `assignedTo`: Staff yang ditugaskan
- `firstResponseAt`, `resolvedAt`, `closedAt`: Metrics

**ticketCategories** - Kategori Tiket

- `id`: Primary key (NanoID)
- `name`, `description`: Informasi kategori
- `color`, `icon`: Tampilan visual
- `sortOrder`: Urutan tampilan
- `isActive`: Status aktif

**ticketReplies** - Balasan Tiket

- `id`: Primary key (NanoID)
- `ticketId`: ID tiket (foreign key)
- `message`, `messageHtml`: Isi balasan
- `authorId`, `authorName`, `authorEmail`: Info penulis
- `isStaffReply`: Balasan dari staff atau user
- `isInternal`: Catatan internal

**ticketAttachments** - File Attachment

- `id`: Primary key (NanoID)
- `ticketId`, `replyId`: Relasi
- `fileName`, `fileUrl`: Informasi file
- `fileSize`, `mimeType`: Metadata

Lihat `src/lib/db/schema.mysql.ts` untuk definisi lengkap.

### Endpoint API

#### Autentikasi

**POST /api/login**

- Body: `{ username: string, password: string }`
- Returns: JWT token dan user data

**POST /api/logout**

- Membersihkan sesi pengguna
- Returns: Status sukses

#### Manajemen Event

**GET /api/event**

- Mengambil semua event
- Returns: Array objek event

**POST /api/event**

- Membuat event baru
- Body: Data event sesuai schema
- Returns: Objek event yang dibuat

**GET /api/event/[id]**

- Mengambil satu event
- Returns: Objek event

**PUT /api/event/[id]**

- Update event
- Returns: Objek event yang diupdate

**DELETE /api/event/[id]**

- Hapus event
- Returns: Status sukses

#### Manajemen Server

**GET /api/server-data**

- Mengambil semua data server
- Returns: Array objek server

**POST /api/server-data**

- Menambah server baru
- Body: Data server
- Returns: Server yang dibuat

**PUT /api/server-data/[id]**

- Update data server
- Returns: Server yang diupdate

**DELETE /api/server-data/[id]**

- Hapus server
- Returns: Status sukses

#### Manajemen Tiket

**GET /api/tickets**

- Mengambil semua tiket
- Query params: status, priority, category untuk filter
- Returns: Array tiket

**POST /api/tickets**

- Membuat tiket baru
- Body: Data tiket
- Returns: Tiket yang dibuat dengan nomor tiket otomatis

**GET /api/tickets/[id]**

- Mengambil detail tiket dengan replies dan attachments
- Returns: Objek tiket lengkap

**PUT /api/tickets/[id]**

- Update tiket (status, assignment, dll)
- Returns: Tiket yang diupdate

**DELETE /api/tickets/[id]**

- Hapus tiket
- Returns: Status sukses

**POST /api/tickets/[id]/reply**

- Menambahkan balasan ke tiket
- Body: Message, author info
- Returns: Reply yang dibuat

### Autentikasi & Autorisasi

Sistem menggunakan JWT (JSON Web Tokens) untuk autentikasi:

1. **Login**: User mengirim credentials → server validasi → generate JWT
2. **Token Storage**: Token disimpan di localStorage client
3. **Request**: Setiap API request menyertakan token di header
4. **Verification**: Server verify token sebelum proses request
5. **Role Check**: Middleware memeriksa role untuk akses tertentu

Implementasi di `src/app/context/auth-context.tsx` dan middleware di API routes.

### Menambahkan Fitur Baru

#### Menambahkan Halaman Baru

1. Buat file halaman di `src/app/halaman-baru/page.tsx`:

```typescript
"use client";

import { PageStructure } from "@/components/layout/page-structure";

export default function HalamanBaru() {
  return (
    <PageStructure>
      <div className="flex flex-col gap-6">
        <h1 className="heading-1">Halaman Baru</h1>
      </div>
    </PageStructure>
  );
}
```

2. Tambahkan route ke sidebar di `src/components/sidebar/app-sidebar.tsx`

#### Menambahkan Tabel Database

1. Tambahkan definisi tabel di schema:

```typescript
// src/lib/db/schema.mysql.ts
export const tableBaru = mysqlTable("table_baru", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  // ... kolom lainnya
  createdAt: timestamp("created_at").defaultNow(),
});
```

2. Generate migration:

```bash
npm run db:generate
```

3. Push ke database:

```bash
npm run db:push
```

#### Menambahkan API Endpoint

1. Buat file route di `src/app/api/endpoint-baru/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { tableBaru } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  try {
    const data = await db.select().from(tableBaru);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

2. Implementasikan validasi menggunakan Zod
3. Tambahkan autentikasi jika diperlukan

### Environment Variables

Variabel yang diperlukan di `.env.local`:

```env
# Database Configuration
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sate_itik_db

# JWT Secret
JWT_SECRET=your_secret_key_minimum_32_chars

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token

# Email Services
RESEND_API_KEY=your_resend_api_key

# File Upload
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# Node Environment
NODE_ENV=development
```

### Database Management

Menggunakan Drizzle Kit:

```bash
# Generate migration
npm run db:generate

# Push perubahan langsung ke database
npm run db:push

# Buka Drizzle Studio untuk GUI database
npm run db:studio

# Seed data admin
npm run db:seed

# Test email functionality
npm run test:email
npm run test:resend
```

### Docker Commands

```bash
# Development dengan MySQL
npm run docker:up:mysql
npm run docker:logs:mysql
npm run docker:down:mysql

# Production
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml down
```

### Panduan Gaya Kode

- Gunakan TypeScript untuk semua kode baru
- Ikuti pola komponen fungsional React
- Gunakan directive `"use client"` untuk komponen client-side
- Implementasikan error handling dengan try-catch
- Gunakan Zod untuk validasi skema
- Ikuti konvensi penamaan yang ada:
  - Components: PascalCase (`MyComponent.tsx`)
  - Files: kebab-case (`my-file.ts`)
  - Functions: camelCase (`myFunction`)
- Tambahkan komentar JSDoc untuk fungsi kompleks
- Gunakan TypeScript types/interfaces yang jelas

### Testing Checklist

Sebelum deployment:

- [ ] Test alur autentikasi dan autorisasi
- [ ] Verifikasi semua operasi CRUD
- [ ] Test sistem tiket (buat, balas, update status)
- [ ] Cek manajemen server (add, edit, delete, visualisasi)
- [ ] Test fungsionalitas kalender di semua view
- [ ] Validasi form submission dengan Zod
- [ ] Test drag-and-drop features
- [ ] Verifikasi persistensi data
- [ ] Cek responsive design (mobile, tablet, desktop)
- [ ] Test upload file dan email notifications
- [ ] Verifikasi Docker builds
- [ ] Test role-based access control

## Referensi API

### API Tiket Helpdesk

**Skema Tiket**:

```typescript
{
  subject: string; // Wajib
  categoryId: string; // Wajib
  priority: string; // Wajib
  description: string; // Wajib
}
```
