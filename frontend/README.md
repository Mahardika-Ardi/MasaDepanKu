# Frontend MasaDepanKu

Frontend MasaDepanKu adalah aplikasi web berbasis **React + Vite** yang menjadi antarmuka utama pengguna untuk login, melihat profil, dan menjalankan alur tes karier.

---

## Daftar Isi

1. [Fitur](#fitur)
2. [Halaman Utama](#halaman-utama)
3. [Tech Stack](#tech-stack)
4. [Struktur Folder](#struktur-folder)
5. [Konfigurasi Environment](#konfigurasi-environment)
6. [Menjalankan Frontend](#menjalankan-frontend)
7. [Scripts](#scripts)
8. [Integrasi API](#integrasi-api)
9. [Alur Auth](#alur-auth)
10. [Troubleshooting](#troubleshooting)

---

## Fitur

- Halaman register dan login pengguna.
- Protected route berbasis token.
- Halaman beranda (`/beranda`) dengan data profil user.
- Halaman profil (`/profile`) dan alur tes karier (`/jelajah-karir`, `/career-test`).
- Penyimpanan token login pada `localStorage`.
- Integrasi API backend untuk autentikasi, profil, dan endpoint terkait.
- **Indikator status backend** di beranda melalui endpoint `GET /health`.

---

## Halaman Utama

- `/register` → form registrasi user baru.
- `/login` → form autentikasi.
- `/beranda` → dashboard sederhana + ringkasan profil + status backend.
- `/profile` → detail profil pengguna.
- `/jelajah-karir` → intro tes karier.
- `/career-test` → halaman pengerjaan tes.

---

## Tech Stack

- React 19
- React Router DOM
- Vite
- Tailwind CSS
- ESLint

---

## Struktur Folder

```bash
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── CareerTestIntroPage.jsx
│   │   ├── CareerTestPage.jsx
│   │   └── RequireAuth.jsx
│   ├── utils/
│   │   └── apiBaseUrl.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
└── README.md
```

---

## Konfigurasi Environment

Buat file `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Catatan:

- Nilai ini dipakai sebagai base URL API.
- Jika kosong, aplikasi akan fallback ke `/api`.

---

## Menjalankan Frontend

Dari root monorepo:

```bash
npm run start:fe
```

Atau dari workspace frontend:

```bash
npm run dev -w frontend
```

Default local URL:

- `http://localhost:5173`

---

## Scripts

- `npm run dev -w frontend` → development server
- `npm run build -w frontend` → build produksi
- `npm run preview -w frontend` → preview hasil build
- `npm run lint -w frontend` → lint source

---

## Integrasi API

Contoh endpoint yang dipakai frontend:

- `POST /auth/register`
- `POST /auth/login`
- `GET /profile/getSpecificProfile`
- `GET /health`

Pastikan backend mengizinkan origin frontend melalui CORS.

---

## Alur Auth

1. User login dari halaman `/login`.
2. Token dari response backend disimpan di `localStorage`.
3. Route private dibungkus komponen `RequireAuth`.
4. Request API protected mengirim header:

```http
Authorization: Bearer <token>
```

5. Saat token invalid/expired, user diarahkan kembali ke halaman login.

---

## Troubleshooting

### 1) Frontend gagal fetch API

- cek backend aktif di URL yang benar
- cek `VITE_API_URL`
- cek konfigurasi CORS backend

### 2) Halaman private redirect terus ke login

- token tidak tersimpan
- token expired
- format response login berubah

### 3) Status backend di beranda selalu offline

- endpoint `GET /health` tidak tersedia / backend mati
- URL API frontend salah
