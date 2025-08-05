# 📦 Next.js Project Setup Guide

Project ini dibangun menggunakan [Next.js](https://nextjs.org) dan menggunakan ORM [Prisma](https://www.prisma.io/) untuk manajemen database.

## ⚙️ Langkah Instalasi

Ikuti langkah-langkah berikut untuk menjalankan project ini secara lokal:

---

### 1. Clone Repository

```bash
git clone https://github.com/adityyapratama/penelitian-tulungagung
cd penelitian-tulungagung
```

---

### 2. Install Dependencies

Install semua dependency dengan npm:

```bash
npm install
```

---

### 3. Konfigurasi Environment

Buat file `.env` di root project dan isi dengan koneksi database. Contoh:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/namadatabase"
```

---

### 4. Migrasi Database

Jalankan migrasi Prisma untuk membuat struktur tabel:

```bash
npx prisma migrate dev
```

---

### 5. Seed Data (Opsional)

Jika ingin mengisi data awal ke database, jalankan:

```bash
npx prisma db seed
```

Pastikan file `prisma/seed.ts` sudah dibuat dan dikonfigurasi dengan benar.

---

### 6. Jalankan Development Server

Mulai server pengembangan:

```bash
npm run dev
```

Akses aplikasi di browser melalui: [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Struktur Penting

- `app/` – Halaman utama aplikasi
- `prisma/` – Skema Prisma dan seed data
- `.env` – Konfigurasi environment (jangan upload ke Git)

---

## 📚 Referensi

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
