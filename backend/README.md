# Backend MasaDepanKu

Backend **MasaDepanKu** adalah REST API berbasis Express untuk menangani autentikasi, manajemen user, dan pembuatan pertanyaan berbasis AI (Gemini).

Backend ini dibangun untuk bekerja bersama frontend MasaDepanKu dalam arsitektur monorepo.

---

## Fitur Utama

- **Auth API**: register & login dengan JWT.
- **User API**: ambil list user, ambil user spesifik, update, dan hapus.
- **Authorization middleware**:
  - verifikasi token Bearer
  - role-based access control
  - ownership check untuk endpoint tertentu
- **AI Question API**: generate pertanyaan menggunakan Gemini API.
- **Swagger docs**: dokumentasi endpoint otomatis.
- **Prisma ORM** untuk akses database MySQL/MariaDB.

---

## Tech Stack

- Node.js
- Express 5
- Prisma ORM + `@prisma/adapter-mariadb`
- MySQL/MariaDB
- Zod (validasi DTO)
- JWT (`jsonwebtoken`)
- Bcrypt
- Swagger (`swagger-jsdoc`, `swagger-ui-express`)
- Google GenAI (`@google/genai`)

---

## Struktur Folder (Backend)

```bash
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── ai/
│   │   ├── client/
│   │   ├── prompts/
│   │   └── schemas/
│   ├── bootstrap/
│   ├── config/
│   ├── controller/
│   ├── dto/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── package.json
└── README.md
```

---

## Prasyarat

Sebelum menjalankan backend:

- Node.js (LTS disarankan)
- npm
- Database MySQL/MariaDB aktif
- Gemini API key

---

## Konfigurasi Environment

Buat file `.env` di direktori `backend/`.

Contoh minimal:

```env
# Server
PORT=3000
FRONTEND_URL=http://localhost:5173

# Security
JWT_SECRET=ganti_dengan_secret_aman

# Database (dipakai runtime app / Prisma MariaDB adapter)
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_NAME=masadepanku

# Prisma CLI / migrations
DATABASE_URL="mysql://root:password@localhost:3306/masadepanku"

# AI
GEMINI_API_KEY=isi_api_key_gemini
```

> Catatan penting:
>
> - Runtime koneksi DB menggunakan `DATABASE_HOST`, `DATABASE_USER`, dan `DATABASE_NAME`.
> - Perintah Prisma migration/CLI membaca `DATABASE_URL`.

---

## Instalasi

Dari root monorepo:

```bash
npm install
```

Atau khusus backend:

```bash
npm install -w backend
```

---

## Menjalankan Backend

### Dari root monorepo

```bash
npm run start:be
```

### Dari workspace backend

```bash
npm run start -w backend
npm run start:dev -w backend
```

Default endpoint:

- API base: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api-documentation`

---

## Scripts Backend

- `npm run start -w backend` → jalankan server normal
- `npm run start:dev -w backend` → jalankan dengan nodemon
- `npm run start:watch -w backend` → watch mode
- `npm run lint -w backend` → lint seluruh source backend
- `npm run lint:fix -w backend` → lint + auto-fix

Jika berada di folder `backend/`, gunakan:

- `npm run start`
- `npm run start:dev`
- `npm run start:watch`
- `npm run lint`
- `npm run lint:fix`

---

## Ringkasan Endpoint

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

Untuk request/response schema detail, cek Swagger.

---

## Authentication & Authorization

### Header yang dipakai

Untuk endpoint terproteksi:

```http
Authorization: Bearer <jwt_token>
```

### Mekanisme akses

- `verifyMiddleware` memvalidasi JWT.
- `roleCheck(...)` membatasi endpoint berdasarkan role (`ADMIN` / `USER`).
- `ownerShipCheck` memastikan user hanya memodifikasi data yang diizinkan.

---

## Database (Prisma)

Skema utama mencakup model:

- `Users`
- `PhotoProfile`
- `ProfilDetail`
- `GroupQuestion`
- `Question`
- `UserAnswer`

Enum penting:

- `Role`: `USER`, `ADMIN`
- `Category`: `teknis`, `sosial`, `kreatif`, `analitis`, `manajerial`

Jika Anda menambah/mengubah schema:

```bash
npx prisma migrate dev --schema prisma/schema.prisma
npx prisma generate --schema prisma/schema.prisma
```

Jalankan command tersebut dari folder `backend/`.

---

## AI Question Flow (Ringkas)

1. Endpoint `POST /question/create` dipanggil dengan `user_id`.
2. Service membuat `GroupQuestion` baru untuk user.
3. Backend memanggil Gemini melalui `@google/genai`.
4. Output divalidasi dengan Zod schema.
5. Pertanyaan disimpan ke database.

---

## Error Handling

Backend menggunakan error handler middleware global untuk menangani error terpusat setelah route diproses.

---

## Troubleshooting

### 1) Server gagal start karena Gemini key

Pastikan `GEMINI_API_KEY` sudah terisi valid di `.env`.

### 2) Koneksi database gagal

Periksa:

- host/user/db name (`DATABASE_HOST`, `DATABASE_USER`, `DATABASE_NAME`)
- kredensial di `DATABASE_URL` untuk Prisma CLI
- service MySQL/MariaDB aktif

### 3) 401 Unauthorized

Periksa:

- header `Authorization` format `Bearer <token>`
- token belum expired
- `JWT_SECRET` konsisten saat sign & verify

---

## Rekomendasi Lanjutan

- Tambahkan `.env.example` khusus backend.
- Tambahkan automated test (unit + integration).
- Tambahkan rate limiting dan hardening security.
- Rapikan standar response/error agar konsisten lintas controller.

---

## Kontribusi

Silakan buat issue/PR untuk peningkatan performa, keamanan, dokumentasi, dan fitur backend lainnya.
