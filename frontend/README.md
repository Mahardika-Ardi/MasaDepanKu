# Frontend MasaDepanKu

Frontend **MasaDepanKu** adalah aplikasi React berbasis Vite yang menyediakan antarmuka autentikasi pengguna (register/login) dan menjadi fondasi UI untuk fitur-fitur pengembangan berikutnya.

---

## Tujuan Frontend

Aplikasi ini dirancang untuk:

- memberikan alur registrasi pengguna yang sederhana,
- menangani login dan penyimpanan token autentikasi,
- menjadi titik integrasi ke API backend MasaDepanKu.

Saat ini fokus utama ada di halaman autentikasi dengan UI gelap modern menggunakan Tailwind CSS.

---

## Tech Stack

- **React 19**
- **Vite 8**
- **React Router DOM 7**
- **Tailwind CSS 3**
- **ESLint 9**

---

## Struktur Folder

```bash
frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## Fitur yang Sudah Tersedia

- **Routing dasar**:
  - `/` → redirect ke `/register`
  - `/register` → halaman registrasi
  - `/login` → halaman login
- **Form register** dengan validasi sederhana di sisi client.
- **Form login** yang mengirim kredensial ke backend.
- **Penyimpanan token** login ke `localStorage`.
- **Feedback status** (loading/sukses/gagal) pada submit form.

---

## Prasyarat

Sebelum menjalankan frontend, pastikan:

- Node.js (LTS disarankan)
- npm
- backend MasaDepanKu sudah berjalan

---

## Konfigurasi Environment

Buat file `.env` di folder `frontend/` dengan isi minimal:

```env
VITE_API_URL=http://localhost:3000
```

> Gunakan URL backend tanpa trailing slash agar endpoint fetch tetap konsisten.

---

## Instalasi

Dari root monorepo:

```bash
npm install
```

Atau khusus frontend:

```bash
npm install -w frontend
```

---

## Menjalankan Frontend

Dari root monorepo:

```bash
npm run start:fe
```

Atau langsung di workspace frontend:

```bash
npm run dev -w frontend
```

Aplikasi akan berjalan (default) di:

- `http://localhost:5173`

---

## Daftar Script Frontend

- `npm run dev -w frontend` → jalankan development server Vite
- `npm run build -w frontend` → build produksi
- `npm run preview -w frontend` → preview hasil build
- `npm run lint -w frontend` → jalankan ESLint

Jika Anda sudah berada di folder `frontend/`, script yang setara:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

---

## Integrasi API (Ringkas)

Frontend melakukan request ke backend untuk endpoint:

- `POST /auth/register`
- `POST /auth/login`

Kebutuhan backend:

- CORS mengizinkan origin frontend
- endpoint auth aktif
- format response konsisten (`Success`, `Message`, `Information`)

---

## UX Notes

- UI menggunakan tema gelap dengan gaya form yang konsisten.
- Halaman register menyediakan tombol placeholder “Masuk dengan Google” (belum terhubung OAuth).
- Setelah register sukses, user diarahkan otomatis ke halaman login.

---

## Pengembangan Lanjutan (Saran)

- Tambahkan state management untuk sesi user (context/store).
- Tambahkan protected route setelah login.
- Tambahkan halaman dashboard setelah autentikasi.
- Tambahkan test (React Testing Library / Vitest).
- Tambahkan notifikasi toast untuk feedback UX yang lebih baik.

---

## Troubleshooting

### 1) Gagal fetch ke backend

Periksa:

- `VITE_API_URL` di `.env`
- backend berjalan di URL yang benar
- konfigurasi CORS backend

### 2) Token tidak tersimpan

Periksa output network/browser console, lalu pastikan response login mengandung token di `Information.token`.

### 3) Perubahan style tidak muncul

Pastikan server dev aktif, simpan file, dan cek apakah Tailwind class tidak typo.

---

## Kontribusi

Silakan buat issue/PR untuk:

- peningkatan UI/UX,
- perbaikan validasi form,
- refactor struktur komponen,
- integrasi fitur frontend berikutnya.
