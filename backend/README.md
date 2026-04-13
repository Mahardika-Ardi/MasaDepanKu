# Backend MasaDepanKu

Backend MasaDepanKu adalah layanan REST API berbasis **Express** untuk autentikasi, manajemen user/profile, sesi tes, serta integrasi AI (Gemini) pada fitur pertanyaan dan analisis karier.

---

## Daftar Isi

1. [Fitur](#fitur)
2. [Arsitektur Singkat](#arsitektur-singkat)
3. [Struktur Folder](#struktur-folder)
4. [Prasyarat](#prasyarat)
5. [Environment Variables](#environment-variables)
6. [Menjalankan Backend](#menjalankan-backend)
7. [Scripts](#scripts)
8. [Health Check](#health-check)
9. [Dokumentasi API](#dokumentasi-api)
10. [Ringkasan Endpoint](#ringkasan-endpoint)
11. [Catatan Keamanan](#catatan-keamanan)
12. [Troubleshooting](#troubleshooting)

---

## Fitur

- Auth API (`register`, `login`) berbasis JWT.
- User API (list, detail, update, delete).
- Profile API untuk data profil dan nilai raport.
- Question / Analysis API terintegrasi Gemini.
- Middleware proteksi endpoint:
  - verifikasi token
  - role check
  - ownership check
- Upload middleware untuk kebutuhan berkas/foto.
- Swagger docs untuk eksplorasi endpoint.
- **Endpoint health check** untuk pemantauan status service.

---

## Arsitektur Singkat

Backend disusun modular per domain:

- `*.routes.js` → definisi endpoint
- `*.controller.js` → handler request/response
- `*.service.js` → business logic
- `*.repository.js` → akses database (Prisma)
- `dto/` → validasi payload (Zod)

Route-loader melakukan auto-discovery file `*.routes.js` di dalam `src/` dan memasangnya berdasarkan nama folder.

---

## Struktur Folder

```bash
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── scripts/
├── src/
│   ├── ai/
│   ├── analysis/
│   ├── auth/
│   ├── bootstrap/
│   ├── config/
│   ├── middlewares/
│   ├── profile/
│   ├── question/
│   ├── testsession/
│   ├── user/
│   ├── useranswer/
│   ├── app.js
│   └── server.js
└── README.md
```

---

## Prasyarat

- Node.js (LTS)
- npm
- Database MariaDB/MySQL aktif
- Gemini API key (untuk fitur AI)

---

## Environment Variables

Buat file `backend/.env`:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=replace_with_secure_secret

DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_NAME=masadepanku
DATABASE_URL="mysql://root:password@localhost:3306/masadepanku"

GEMINI_API_KEY=your_gemini_api_key
```

Keterangan:

- `DATABASE_HOST`, `DATABASE_USER`, `DATABASE_NAME` dipakai koneksi runtime aplikasi.
- `DATABASE_URL` dipakai perintah Prisma CLI (migrasi/deploy).

---

## Menjalankan Backend

Dari root monorepo:

```bash
npm run start:be
```

Atau langsung dari workspace backend:

```bash
npm run start -w backend
npm run start:dev -w backend
```

Default URL:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-documentation`
- Health: `http://localhost:3000/health`

---

## Scripts

- `npm run start -w backend` → run server normal
- `npm run start:dev -w backend` → run dengan nodemon
- `npm run start:watch -w backend` → mode watch
- `npm run lint -w backend` → lint source
- `npm run lint:fix -w backend` → lint + auto-fix
- `npm run prisma:deploy -w backend` → deploy migration
- `npm run make -w backend` → utility generate script internal

---

## Health Check

Endpoint:

```http
GET /health
```

Contoh response:

```json
{
  "success": true,
  "message": "MasaDepanKu backend is healthy",
  "timestamp": "2026-04-13T00:00:00.000Z",
  "uptime": 123.45,
  "environment": "development"
}
```

Use case:

- verifikasi service hidup dari frontend
- readiness/liveness probe di deployment
- monitoring sederhana dari tool eksternal

---

## Dokumentasi API

Swagger UI tersedia di:

```text
http://localhost:3000/api-documentation
```

Gunakan Swagger untuk:

- melihat daftar endpoint terbaru
- memeriksa schema request/response
- mencoba request langsung dari browser

---

## Ringkasan Endpoint

### Auth

- `POST /auth/register`
- `POST /auth/login`

### User

- `GET /users/getUsers`
- `GET /users/getSpecificUser`
- `PATCH /users/updateUsers/:id`
- `DELETE /users/deleteUser/:id`

### Profile

- `GET /profile/getSpecificProfile`
- endpoint profile lain tersedia di Swagger

### Question / Analysis

- `POST /question/create`
- endpoint analysis tersedia di Swagger

---

## Catatan Keamanan

- Simpan `JWT_SECRET` di environment, jangan hard-code.
- Jangan commit file `.env` ke repository.
- Batasi origin CORS via `FRONTEND_URL`.
- Validasi payload input tetap wajib di level DTO/service.

---

## Troubleshooting

### 1) Koneksi database gagal

- cek service MariaDB/MySQL berjalan
- cek `DATABASE_HOST`, `DATABASE_USER`, `DATABASE_NAME`
- jalankan migration yang dibutuhkan

### 2) Endpoint protected selalu 401

- pastikan header `Authorization: Bearer <token>` benar
- cek token expired

### 3) Fitur AI gagal

- pastikan `GEMINI_API_KEY` valid
- cek quota / limit provider
