# MasaDepanKu

MasaDepanKu adalah aplikasi **fullstack web** untuk membantu pelajar mengenali potensi diri, melakukan tes minat-bakat, dan mendapatkan insight karier berbasis data profil serta AI.

Project ini menggunakan arsitektur **monorepo npm workspace**:

- `backend/` → REST API (Express + Prisma + MariaDB/MySQL)
- `frontend/` → Web client (React + Vite + Tailwind)

---

## Daftar Isi

1. [Ringkasan Fitur](#ringkasan-fitur)
2. [Arsitektur Monorepo](#arsitektur-monorepo)
3. [Tech Stack](#tech-stack)
4. [Quick Start](#quick-start)
5. [Konfigurasi Environment](#konfigurasi-environment)
6. [Menjalankan Aplikasi](#menjalankan-aplikasi)
7. [Daftar Script](#daftar-script)
8. [Endpoint Penting](#endpoint-penting)
9. [Alur Pengguna](#alur-pengguna)
10. [Troubleshooting](#troubleshooting)
11. [Roadmap Pengembangan](#roadmap-pengembangan)

---

## Ringkasan Fitur

- ✅ Registrasi dan login pengguna (JWT).
- ✅ Proteksi endpoint menggunakan middleware autentikasi.
- ✅ Profil pengguna + data akademik dasar (jurusan, nilai raport).
- ✅ Pembuatan pertanyaan/analisis berbasis AI (Gemini).
- ✅ Halaman beranda React dengan integrasi API profil.
- ✅ **Health check endpoint backend** (`GET /health`) untuk monitoring konektivitas.
- ✅ **Status koneksi backend di frontend** (ditampilkan di halaman beranda).
- ✅ Dokumentasi API melalui Swagger UI.

---

## Arsitektur Monorepo

```bash
MasaDepanKu/
├── backend/                # Express API + Prisma
│   ├── prisma/
│   ├── src/
│   └── README.md
├── frontend/               # React + Vite UI
│   ├── public/
│   ├── src/
│   └── README.md
├── package.json            # workspace scripts
└── README.md
```

---

## Tech Stack

### Backend

- Node.js + Express 5
- Prisma ORM + MariaDB/MySQL
- JWT, bcrypt, Zod
- Swagger (`swagger-jsdoc`, `swagger-ui-express`)
- Google GenAI (`@google/genai`)

### Frontend

- React 19
- React Router
- Vite
- Tailwind CSS

### Tooling

- npm workspaces
- concurrently
- ESLint

---

## Quick Start

```bash
# 1) Install dependency root + seluruh workspace
npm install

# 2) Jalankan backend + frontend bersamaan
npm run dev
```

Akses default:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-documentation`
- Health check: `http://localhost:3000/health`

---

## Konfigurasi Environment

### 1) Backend (`backend/.env`)

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=replace_with_secure_secret

# Runtime DB config
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_NAME=masadepanku

# Prisma CLI/migration
DATABASE_URL="mysql://root:password@localhost:3306/masadepanku"

# AI
GEMINI_API_KEY=your_gemini_key
```

### 2) Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000
```

> Gunakan URL backend **tanpa trailing slash** untuk menghindari duplikasi path.

---

## Menjalankan Aplikasi

### Opsi A — dari root (disarankan)

```bash
npm run dev
```

### Opsi B — jalankan terpisah

```bash
npm run start:be
npm run start:fe
```

---

## Daftar Script

### Root

- `npm run dev` → menjalankan backend + frontend bersamaan
- `npm run start:be` → menjalankan backend (`nodemon`)
- `npm run start:fe` → menjalankan frontend (`vite`)
- `npm run lint` → lint backend dan frontend

### Backend

- `npm run start -w backend`
- `npm run start:dev -w backend`
- `npm run lint -w backend`
- `npm run lint:fix -w backend`
- `npm run prisma:deploy -w backend`

### Frontend

- `npm run dev -w frontend`
- `npm run build -w frontend`
- `npm run preview -w frontend`
- `npm run lint -w frontend`

---

## Endpoint Penting

### Public

- `GET /` → sanity check sederhana
- `GET /health` → status backend (uptime, timestamp, environment)
- `POST /auth/register`
- `POST /auth/login`

### Protected (contoh)

- `GET /profile/getSpecificProfile`
- `GET /users/getUsers`
- `POST /question/create`

Untuk detail payload request/response lengkap, gunakan Swagger UI.

---

## Alur Pengguna

1. User melakukan registrasi akun.
2. User login untuk memperoleh token JWT.
3. Frontend menyimpan token (saat ini di `localStorage`).
4. Frontend mengirim token melalui header `Authorization: Bearer <token>`.
5. User mengakses profil, tes karier, dan fitur AI berdasarkan endpoint yang tersedia.

---

## Troubleshooting

### Backend tidak bisa diakses frontend

- Pastikan backend hidup di port yang benar.
- Pastikan `FRONTEND_URL` backend sesuai origin frontend.
- Pastikan `VITE_API_URL` frontend benar.

### Endpoint profile gagal 401

- Token tidak ada / expired.
- Login ulang untuk mendapatkan token baru.

### Swagger kosong / error

- Cek startup log backend.
- Pastikan route dokumentasi di `/api-documentation`.

---

## Roadmap Pengembangan

- [ ] Tambah unit/integration test backend.
- [ ] Tambah e2e test frontend.
- [ ] Tambah observability (structured logging + metrics).
- [ ] Tambah CI lint/test/build.
- [ ] Lengkapi dokumentasi deployment production.

---

## Dokumentasi Per Workspace

- Panduan backend detail: [`backend/README.md`](./backend/README.md)
- Panduan frontend detail: [`frontend/README.md`](./frontend/README.md)
