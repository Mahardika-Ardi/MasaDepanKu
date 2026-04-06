# MasaDepanKu

MasaDepanKu adalah aplikasi **web fullstack** untuk membantu pengguna mempersiapkan arah masa depan melalui proses:

- registrasi & login,
- manajemen data pengguna,
- dan pembuatan pertanyaan berbasis AI (Gemini) untuk eksplorasi minat/kemampuan.

Project ini menggunakan arsitektur **monorepo npm workspaces** dengan dua aplikasi utama:

- `backend` → REST API (Express + Prisma + MySQL)
- `frontend` → UI (React + Vite + Tailwind CSS)

---

## Tech Stack

### Backend

- Node.js + Express 5
- Prisma ORM + MariaDB adapter
- JWT (auth)
- Zod (validasi DTO)
- Swagger (dokumentasi API)
- Google Gemini API (`@google/genai`)

### Frontend

- React 19
- React Router
- Vite
- Tailwind CSS

### Monorepo / Tools

- npm workspaces
- concurrently
- ESLint

---

## Struktur Project

```bash
MasaDepanKu/
├── backend/
│   ├── prisma/
│   └── src/
│       ├── ai/
│       ├── bootstrap/
│       ├── config/
│       ├── controller/
│       ├── dto/
│       ├── middlewares/
│       ├── routes/
│       ├── services/
│       └── utils/
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       └── pages/
├── package.json
└── README.md
```

---

## Fitur Utama

- Autentikasi pengguna (register & login).
- Proteksi endpoint menggunakan JWT bearer token.
- Role-based dan ownership check untuk endpoint user tertentu.
- Generate pertanyaan berbasis AI (Gemini).
- Dokumentasi API otomatis via Swagger.
- UI halaman register & login yang siap dipakai.

---

## Prasyarat

Pastikan environment Anda sudah memiliki:

- Node.js (disarankan versi LTS terbaru)
- npm
- Database MySQL/MariaDB aktif
- API key Gemini

---

## Instalasi

Dari root project:

```bash
npm install
```

Instalasi ini akan menginstal dependency untuk workspace root, backend, dan frontend.

---

## Konfigurasi Environment

Buat file `.env` di folder `backend/`.

Contoh minimal:

```env
# Backend
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=ganti_dengan_secret_yang_aman

# Database (dipakai PrismaMariaDb adapter di runtime app)
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_NAME=masadepanku

# Prisma migrations / prisma CLI
DATABASE_URL="mysql://root:password@localhost:3306/masadepanku"

# AI
GEMINI_API_KEY=isi_api_key_gemini
```

> Catatan: project saat ini membaca konfigurasi database dengan dua pola:
>
> - runtime app via `DATABASE_HOST`, `DATABASE_USER`, `DATABASE_NAME`
> - prisma CLI/migration via `DATABASE_URL`

---

## Menjalankan Project

### Jalankan backend + frontend sekaligus

```bash
npm run dev
```

### Jalankan terpisah

```bash
npm run start:be
npm run start:fe
```

Default URL:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Swagger API docs: `http://localhost:3000/api-documentation`

---

## Script yang Tersedia

### Root

- `npm run dev` → jalankan backend & frontend bersamaan.
- `npm run start:be` → jalankan backend mode development.
- `npm run start:fe` → jalankan frontend mode development.

### Backend (`backend/package.json`)

- `npm run start`
- `npm run start:dev`
- `npm run start:watch`
- `npm run lint`
- `npm run lint:fix`

### Frontend (`frontend/package.json`)

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

---

## Ringkasan Endpoint API

Prefix endpoint mengikuti route yang terdaftar di backend:

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Users

- `GET /users/getUsers`
- `GET /users/getSpecificUser`
- `PATCH /users/updateUsers/:id`
- `DELETE /users/deleteUser/:id`

### Question

- `POST /question/create`

Untuk detail schema request/response, gunakan Swagger UI.

---

## Alur Singkat Penggunaan

1. User melakukan register.
2. User login dan menerima JWT token.
3. Token disimpan (contoh saat ini: `localStorage` di frontend).
4. Frontend mengirim token lewat header `Authorization: Bearer <token>` ke endpoint yang diproteksi.
5. User dapat meminta generate pertanyaan via endpoint question.

---

## Catatan Pengembangan

- Repo ini masih aktif dikembangkan; beberapa modul dapat berubah.
- Disarankan menambahkan:
  - `.env.example`
  - test otomatis (unit/integration)
  - CI lint + test
  - hardening keamanan (rate limit, input sanitization tambahan, dsb.)

---

## Lisensi

Belum ditentukan.

---

## Kontributor

Silakan buat issue/PR untuk perbaikan bug, peningkatan dokumentasi, atau fitur baru.
