# AI Customer Support Intelligence Platform - Backend Service

Layanan backend untuk AI Customer Support Intelligence Platform yang dirancang untuk mengelola pesan pelanggan dengan analisis otomatis menggunakan Artificial Intelligence (Google Gemini). Sistem ini menyediakan API untuk deteksi sentimen, penentuan prioritas, kategorisasi masalah, serta memberikan ringkasan dan saran balasan otomatis untuk meningkatkan efisiensi agen dukungan pelanggan.

## Daftar Isi

- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Prasyarat Sistem](#prasyarat-sistem)
- [Instalasi dan Konfigurasi](#instalasi-dan-konfigurasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Struktur Proyek](#struktur-proyek)
- [Dokumentasi API](#dokumentasi-api)
- [Lisensi](#lisensi)

## Teknologi yang Digunakan

Proyek ini dibangun menggunakan teknologi berikut:

- **Runtime Environment:** Node.js (JavaScript server-side)
- **Web Framework:** Express.js (REST API framework)
- **Database:** Supabase (PostgreSQL Database-as-a-Service)
- **Artificial Intelligence:** Google Gemini (via Google Generative AI SDK)
- **Utilities:** Dotenv (Manajemen variabel lingkungan), Nodemon (Alat pengembangan)

## Prasyarat Sistem

Sebelum menjalankan proyek ini di lingkungan lokal, pastikan perangkat Anda telah memenuhi persyaratan berikut:

- **Node.js**: Versi 18.0.0 atau lebih baru
- **NPM (Node Package Manager)**: Terinstal bersamaan dengan Node.js
- **Git**: Untuk manajemen versi dan pengunduhan repository
- **Akun Supabase**: Proyek aktif dengan URL dan API Key
- **Google AI Studio API Key**: Kunci akses valid untuk model Gemini

## Instalasi dan Konfigurasi

### 1. Kloning Repository dan Instalasi Dependensi

Unduh kode sumber dan instal paket dependensi yang diperlukan melalui terminal:
```bash
cd Backend
npm install
```

### 2. Konfigurasi Variabel Lingkungan (.env)

Sistem memerlukan konfigurasi variabel lingkungan untuk dapat terhubung ke database dan layanan AI. Buat file bernama `.env` di dalam direktori `Backend`.

Salin konfigurasi di bawah ini dan sesuaikan nilainya dengan kredensial Anda:
```env
# Konfigurasi Server
PORT=4000

# Konfigurasi Supabase (Database)
SUPABASE_URL=https://id-proyek-anda.supabase.co
SUPABASE_KEY=kunci-anon-publik-anda

# Konfigurasi Google AI (Gemini)
GEMINI_API_KEY=kunci-api-google-ai-anda
```

> **Peringatan Keamanan:** File `.env` berisi informasi sensitif (API Key). Pastikan file ini terdaftar di dalam `.gitignore` dan tidak pernah diunggah ke repository publik.

## Menjalankan Aplikasi

Anda dapat menjalankan server dalam dua mode:

### Mode Pengembangan (Development)

Menggunakan nodemon untuk memulai ulang server secara otomatis setiap kali ada perubahan kode:
```bash
npm run dev
```

### Mode Produksi

Menjalankan server menggunakan Node.js standar:
```bash
npm start
```

Jika berhasil, terminal akan menampilkan pesan bahwa server berjalan di `http://localhost:4000` dan koneksi ke Supabase telah siap.

## Struktur Proyek

Proyek ini menerapkan struktur modular untuk memudahkan pemeliharaan, keterbacaan kode, dan pengembangan lebih lanjut:
```
Backend/
├── config/
│   ├── supabaseClient.js   # Inisialisasi klien Supabase
│   └── gemini.js           # Konfigurasi dan inisialisasi model AI Gemini
├── controllers/
│   └── messageController.js# Logika bisnis untuk setiap endpoint API
├── routes/
│   └── messageRoutes.js    # Definisi rute URL (Routing)
├── services/
│   └── aiService.js        # Layanan khusus untuk interaksi dengan AI (Prompt Engineering)
├── index.js                # Titik masuk utama aplikasi server
├── package.json            # Daftar dependensi proyek
└── .env                    # File konfigurasi lingkungan (disembunyikan)
```

## Dokumentasi API

Layanan ini menyediakan RESTful API. Semua endpoint memiliki awalan dasar: `http://localhost:4000/api`

### 1. Mengambil Semua Pesan (Inbox)

Mendapatkan daftar seluruh pesan yang masuk, diurutkan dari yang terbaru.

- **Method:** `GET`
- **Endpoint:** `/messages`
- **Deskripsi:** Digunakan untuk menampilkan tabel pesan di halaman utama (Inbox). Fitur prioritas yang dihasilkan AI dapat digunakan untuk indikator visual (High/Medium/Low).

**Contoh Response Sukses (200 OK):**
```json
[
  {
    "id": 1,
    "customer_name": "Budi Santoso",
    "subject": "Kendala Login",
    "content": "Saya tidak bisa masuk aplikasi...",
    "priority": "High",
    "status": "Open",
    "created_at": "2024-01-10T08:00:00Z"
  }
]
```

### 2. Mengambil Detail Pesan

Mendapatkan informasi rinci satu pesan spesifik, termasuk hasil analisis AI (Ringkasan Masalah dan Saran Balasan).

- **Method:** `GET`
- **Endpoint:** `/messages/:id`
- **Parameter URL:** `id` (Integer) - ID unik pesan

**Contoh Response Sukses (200 OK):**
```json
{
  "id": 5,
  "customer_name": "Siti Aminah",
  "content": "Pembayaran gagal terus padahal saldo cukup...",
  "category": "Billing",
  "sentiment": "Negative",
  "priority": "High",
  "ai_summary": "Pelanggan mengalami kegagalan transaksi meskipun saldo mencukupi.",
  "ai_suggested_reply": "Halo Kak Siti, mohon maaf atas ketidaknyamanannya. Bisa informasikan metode pembayaran yang digunakan?"
}
```

### 3. Membuat Pesan Baru (Simulasi)

Mensimulasikan pesan baru yang masuk dari pelanggan. Endpoint ini akan memicu proses analisis AI di latar belakang (asynchronous background process).

- **Method:** `POST`
- **Endpoint:** `/messages`
- **Content-Type:** `application/json`

**Body Request:**
```json
{
  "customer_name": "Rara Sekar",
  "subject": "Internet Mati",
  "content": "Koneksi internet di rumah saya mati total sejak pagi."
}
```

> **Catatan:** Respon API akan dikembalikan segera setelah data disimpan ke database. Kolom hasil analisis AI (kategori, sentimen, ringkasan) akan diperbarui beberapa detik kemudian setelah proses AI selesai.

### 4. Membalas Pesan

Mengirimkan balasan agen CS dan menutup tiket secara otomatis.

- **Method:** `POST`
- **Endpoint:** `/messages/:id/reply`
- **Parameter URL:** `id` (Integer) - ID unik pesan
- **Content-Type:** `application/json`

**Body Request:**
```json
{
  "reply_content": "Halo Kak Rara, teknisi kami sedang meluncur ke lokasi."
}
```

**Respons:** Mengembalikan objek pesan yang telah diperbarui dengan status `Closed`.

Dibuat dengan  menggunakan Node.js, Express.js, Supabase, dan Google Gemini AI