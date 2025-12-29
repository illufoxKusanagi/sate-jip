Konten Lengkap untuk Disalin (Full Guide)
(Mulai salin dari sini dan tempelkan ke dalam dokumen Anda di sub-bab 4.1.1)

4.1.1 Arsitektur dan Pilar Fundamental Aplikasi
Sebelum membahas implementasi antarmuka pengguna per halaman, penting untuk memahami tiga pilar arsitektur fundamental yang menjadi fondasi dari keseluruhan sistem SATE-ITIK. Pilar-pilar ini tidak terikat pada satu fitur saja, melainkan berlaku secara menyeluruh untuk memastikan aplikasi berjalan secara konsisten, aman, dan andal. Ketiga pilar tersebut adalah Basis Data Terpusat, Manajemen Hak Akses Multi-Peran, dan Mekanisme Validasi Data.

4.1.1.1 Basis Data Terpusat (MySQL & Drizzle ORM)
Seluruh data yang dihasilkan dan dikelola oleh aplikasi SATE-ITIK disimpan dalam satu basis data (database) terpusat menggunakan MySQL. MySQL dipilih karena keandalannya yang telah teruji, performa yang baik untuk beban kerja transaksional, dan ekosistem yang matang.

Untuk menjembatani antara kode aplikasi yang ditulis dalam TypeScript dengan database MySQL, sistem ini memanfaatkan Object-Relational Mapper (ORM) modern bernama Drizzle ORM. Penggunaan Drizzle ORM memberikan beberapa keuntungan signifikan:

Keamanan Tipe (Type Safety): Drizzle memastikan bahwa setiap interaksi dengan database (membaca, menulis, mengubah data) sepenuhnya aman secara tipe, yang secara drastis mengurangi risiko bug terkait ketidakcocokan tipe data.
Kueri SQL-Like: Sintaks yang digunakan sangat mirip dengan SQL murni, sehingga memudahkan penulisan kueri yang kompleks sekalipun, sambil tetap mendapatkan keuntungan dari keamanan tipe.
Abstraksi yang Efisien: Drizzle menyediakan lapisan abstraksi yang tipis namun kuat, memungkinkan pengembang untuk fokus pada logika bisnis tanpa kehilangan kontrol atas performa kueri database.
Dengan arsitektur ini, semua fitur mulai dari inventaris server, manajemen tiket, hingga agenda kegiatan, mengakses dan memanipulasi data dari satu sumber kebenaran (single source of truth), sehingga menjamin konsistensi dan integritas data di seluruh aplikasi.

4.1.1.2 Manajemen Hak Akses Multi-Peran (Multi-Role Access Control)
Keamanan dan pembatasan akses merupakan aspek krusial dalam sistem informasi pemerintah. Aplikasi SATE-ITIK mengimplementasikan mekanisme hak akses berbasis peran (Role-Based Access Control - RBAC) untuk memastikan bahwa setiap pengguna hanya dapat mengakses fitur dan melakukan tindakan yang sesuai dengan wewenangnya.

Setiap akun pengguna yang terdaftar dalam sistem akan diberi sebuah "peran" (role). Peran ini mendefinisikan batasan-batasan akses secara spesifik. Contoh implementasi peran dalam sistem ini adalah:

Super Admin: Memiliki hak akses penuh ke seluruh fitur tanpa terkecuali, termasuk kemampuan untuk menambah, mengubah, dan menghapus akun admin lain.
Admin Pusat Data: Hak aksesnya terbatas hanya pada menu "Pusat Data Pemerintah". Pengguna dengan peran ini tidak dapat melihat atau berinteraksi dengan menu E-Ticketing atau Agenda Kegiatan.
Staf Help Desk: Diberikan akses khusus ke menu "E-Ticketing" untuk mengelola laporan dan keluhan dari pengguna. Peran ini tidak memiliki izin untuk mengubah data server atau lokasi.
Mekanisme ini diimplementasikan di level backend dan frontend. Di backend, setiap permintaan API akan diverifikasi untuk memastikan pengguna memiliki izin yang sesuai. Di frontend, menu navigasi dan tombol aksi akan ditampilkan atau disembunyikan secara dinamis berdasarkan peran pengguna yang sedang login.

4.1.1.3 Mekanisme Validasi Data (Zod)
Untuk menjaga integritas dan kualitas data yang masuk ke dalam database, setiap input dari pengguna akan melewati proses validasi yang ketat. Validasi ini berfungsi sebagai "penjaga gerbang" yang memastikan data memenuhi kriteria yang telah ditentukan sebelum diproses atau disimpan. Sistem ini menggunakan pustaka Zod untuk mendefinisikan dan menjalankan aturan-aturan validasi.

Zod memungkinkan pembuatan skema validasi yang deklaratif dan sangat mudah dibaca. Proses validasi ini diterapkan di dua lapisan:

Validasi di Sisi Klien (Frontend): Sebelum formulir dikirim, validasi dijalankan di peramban pengguna untuk memberikan umpan balik instan, misalnya memberitahu bahwa "format email tidak valid" atau "kolom deskripsi tidak boleh kosong".
Validasi di Sisi Server (Backend): Sebagai lapisan keamanan kedua, data yang diterima oleh API akan divalidasi ulang menggunakan skema Zod yang sama. Ini penting untuk melindungi sistem dari permintaan yang dimanipulasi atau dikirim langsung ke API tanpa melalui antarmuka pengguna.
Contoh penerapan validasi dalam sistem:

Pada formulir Manajemen Server, sistem memvalidasi bahwa format alamat IP sudah benar dan posisi unit di dalam rak adalah sebuah angka.
Pada formulir Pengajuan Tiket, sistem memastikan bahwa kolom email berisi alamat email yang valid dan deskripsi masalah memiliki panjang karakter minimal.
Dengan validasi berlapis ini, risiko data yang tidak valid, tidak lengkap, atau "sampah" masuk ke dalam database dapat diminimalkan secara signifikan.

(Selesai menyalin)