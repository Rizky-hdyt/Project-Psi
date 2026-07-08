"# Project-Psi" 
# Freelance City Index: Yogyakarta Edition

**Decision Support System untuk Pemilihan Distrik Kerja Terbaik bagi Freelancer dan Remote Worker di DIY**

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Live Demo

**Aplikasi Live:** [https://project-psi-gamma.vercel.app/](https://project-psi-gamma.vercel.app/)

## 📋 Daftar Isi

- [Ringkasan Proyek](#ringkasan-proyek)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Setup Database](#setup-database)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Testing](#testing)
- [Build untuk Production](#build-untuk-production)
- [Struktur Proyek](#struktur-proyek)
- [API Documentation](#api-documentation)
- [Kontribusi](#kontribusi)

---

## 📖 Ringkasan Proyek

Freelance City Index (FCI) adalah Decision Support System yang membantu freelancer dan remote worker memilih lokasi kerja terbaik di antara 5 kabupaten/kota Daerah Istimewa Yogyakarta (Kota Yogyakarta, Sleman, Bantul, Gunungkidul, Kulon Progo) berdasarkan empat indikator utama:

- **Internet Quality** - Kecepatan dan stabilitas koneksi internet
- **Cost of Living** - Biaya hidup bulanan (sewa kost, makanan, transportasi)
- **Community** - Jumlah dan aktifitas komunitas coworking & networking
- **Environment** - Preferensi lingkungan kerja (tenang, cafe, coworking, fleksibel)

Sistem ini menggunakan algoritma weighted scoring yang terpersonalisasi berdasarkan persona pengguna dan preferensi individual untuk menghasilkan rekomendasi yang dapat dijelaskan secara transparan.

---

## ✨ Fitur Utama

### Untuk Pengguna (Public)

✅ **Landing Page** - Halaman awal dengan value proposition dan CTA  
✅ **Persona Quiz** - Kuis interaktif 5 langkah (pilih persona, budget, prioritas internet/community, lingkungan kerja)  
✅ **Scoring Engine** - Algoritma weighted scoring terstandar dengan personalisasi  
✅ **Algorithm Explanation** - Transparansi penuh: tampilkan bobot terpersonalisasi dan formula perhitungan  
✅ **Result Page** - Ranking 5 distrik dengan skor detail, badge "Best Match", dan snapshot data  
✅ **Why This Match** - Penjelasan naratif mengapa distrik menjadi rekomendasi terbaik  
✅ **District Detail** - Profil lengkap distrik dengan:
  - Ranking kecamatan (25 kecamatan di 5 distrik)
  - Tabel perbandingan indikator
  - Data mentah (UMK, coworking count, internet speed, sewa kost range, estimasi biaya hidup)
  - Snapshot shareable via URL
  
✅ **FCI Assistant** - Chatbot Q&A hybrid (rule-based untuk FAQ, AI untuk pertanyaan kompleks)  
✅ **Relevance Survey** - Survei post-result untuk feedback (1–5 rating)  
✅ **Mobile-Responsive** - Full support desktop & mobile

### Untuk Admin (Authenticated)

✅ **Admin Login** - Autentikasi JWT dengan session 8 jam  
✅ **Admin Dashboard** - Ringkasan data distrik + monitoring timestamp + peringatan data kedaluwarsa  
✅ **Data Management** - Form input skor indikator (0–100) dengan validasi real-time  
✅ **Audit Log** - Riwayat lengkap perubahan (nilai lama/baru, operator, timestamp)  

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16.2.9 (App Router)
- **UI Library:** React 19.2.4
- **Styling:** Tailwind CSS v4 (CSS-based config, tanpa `tailwind.config.js`)
- **State Management:** React Context API + useReducer
- **API Client:** Fetch API (native)
- **Build Tool:** Vercel deployment

### Backend
- **Runtime:** Node.js (via Vercel Functions)
- **API:** REST API dengan Next.js Route Handlers
- **ORM:** Prisma ^7.8
- **Database:** PostgreSQL (Neon serverless, driver `@neondatabase/serverless` + `@prisma/adapter-neon`)
- **Auth:** Session cookie httpOnly (JWT via `jose`), bukan Bearer token
- **AI:** Google Gemini API (`GEMINI_API_KEY`) untuk FCI Assistant, hybrid dengan rule-based Q&A

### Development Tools
- **Version Control:** Git & GitHub
- **Package Manager:** npm / yarn
- **Design:** Figma (design system & prototypes)
- **Testing:** Jest (unit & integration tests - optional)
- **Code Quality:** ESLint + Prettier
- **Deployment:** Vercel (auto-deploy dari main branch)

---

## 🔧 Prasyarat

Sebelum memulai, pastikan Anda memiliki:

- **Node.js** v18.0.0 atau lebih tinggi ([download](https://nodejs.org/))
- **npm** v9.0.0 atau lebih tinggi (included dengan Node.js)
- **Git** untuk version control ([download](https://git-scm.com/))
- **Database Connection String** dari Neon PostgreSQL (atau PostgreSQL lokal)
- **Text Editor/IDE** - VS Code, WebStorm, atau sejenisnya

### Verifikasi Instalasi

```bash
node --version      # v18.0.0+
npm --version       # v9.0.0+
git --version       # git version 2.x+
```

---

## 📦 Instalasi

> **Penting:** kode aplikasi Next.js ada di subfolder **`freelance-city-index/`**, bukan di root repository. Root repository (`Project-Psi/`) berisi dokumen (`docs/`, `CLAUDE.md`, `RIWAYAT_PENGERJAAN.md`, dsb), sedangkan semua perintah `npm`/`prisma` di bawah ini dijalankan **di dalam** folder `freelance-city-index/`.

### 1. Clone Repository

```bash
git clone https://github.com/Rizky-hdyt/Project-Psi.git
cd Project-Psi/freelance-city-index
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Prisma Client

Generate Prisma Client (juga otomatis dijalankan ulang tiap `npm run build`):

```bash
npx prisma generate
```

---

## ⚙️ Konfigurasi Environment

### 1. Buat File `.env`

Di dalam folder `freelance-city-index/`, buat file `.env` (bisa juga copy dari `.env.example` yang sudah ada di folder ini) dengan format berikut:

```env
# ===========================
# DATABASE CONFIGURATION
# ===========================
DATABASE_URL="postgresql://username:password@host/database_name?sslmode=require"

# Contoh menggunakan Neon PostgreSQL:
# DATABASE_URL="postgresql://user:password@ep-xxx.region.neon.tech/dbname?sslmode=require"

# ===========================
# ADMIN CREDENTIALS (DEVELOPMENT ONLY)
# ===========================
# WARNING: Jangan commit file .env ke repository!
ADMIN_USERNAME=admin
ADMIN_PASSWORD=freelancecity2026

# ===========================
# AUTH — JWT SESSION COOKIE
# ===========================
# String acak minimal 32 karakter, dipakai untuk sign token session admin.
# Tanpa ini token tetap jalan (ada fallback), tapi TIDAK aman — wajib diisi.
JWT_SECRET=ganti-dengan-string-acak-minimal-32-karakter

# ===========================
# GEMINI API — untuk FCI Assistant (chatbot)
# ===========================
# Buat API key di https://aistudio.google.com/apikey
# Tanpa key ini, FCI Assistant hanya bisa jawab lewat rule-based Q&A (fallback),
# bagian yang butuh Gemini (pertanyaan kompleks/di luar FAQ) tidak akan jalan.
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-flash-lite-latest
```

Catatan: aplikasi ini tidak memakai `NODE_ENV` atau `NEXT_PUBLIC_API_URL` secara manual — `NODE_ENV` diatur otomatis oleh Next.js, dan tidak ada variabel `NEXT_PUBLIC_*` yang dipakai di kode saat ini.

### 2. Konfigurasi Neon PostgreSQL

Project ini **wajib pakai Neon** (bukan PostgreSQL lokal biasa) — `src/lib/db.ts` secara eksplisit pakai `@prisma/adapter-neon` + `@neondatabase/serverless` (koneksi via WebSocket ke Neon), bukan koneksi TCP standar. PostgreSQL lokal/biasa tidak akan tersambung lewat adapter ini tanpa modifikasi kode.

1. Daftar di [neon.tech](https://neon.tech/)
2. Buat project baru dan copy connection string
3. Paste ke `DATABASE_URL` di `.env`

**Format connection string Neon:**
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

---

## 🗄️ Setup Database

### 1. Jalankan Prisma Migration

Migration yang sudah ada di `prisma/migrations/` akan diterapkan ke database:

```bash
npm run db:migrate
```

Kalau prompt minta nama migration baru (hanya kalau kamu mengubah `schema.prisma`), isi bebas — untuk sekadar apply migration yang sudah ada, prompt ini biasanya tidak muncul.

### 2. Seed Database

Untuk populate data initial (5 distrik + 25 kecamatan, dari `prisma/seed.ts`):

```bash
npm run db:seed
```

Sumber data seed: `src/data/districts.seed.json`

### 3. Verifikasi Database

Buka Prisma Studio untuk verifikasi data:

```bash
npm run db:studio
```

Akses di: [http://localhost:5555](http://localhost:5555)

---

## 🚀 Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di: **[http://localhost:3000](http://localhost:3000)**

**Features di development mode:**
- Hot reload (auto-refresh saat file berubah)
- Error boundary dengan detail stack trace
- Prisma logging untuk debug query

### Production Mode (Lokal)

```bash
npm run build
npm start
```

---

## 🧪 Testing

> Belum ada automated test suite (Jest/dsb) di project ini — tidak ada script `test` di `package.json` dan tidak ada file `*.test.ts`. Verifikasi saat ini dilakukan manual seperti di bawah. Kalau ingin menambah unit test untuk scoring engine (`src/lib/scoring/`), pastikan setup Jest ditambahkan dulu (`package.json` scripts + config) sebelum menulis test.

### Manual Testing

1. **Persona Quiz Path**
   - Verifikasi semua 4 persona dapat dipilih
   - Test budget slider (Rp 2jt – Rp 6.5jt)
   - Verifikasi validasi form sebelum lanjut (persona wajib dipilih)

2. **Scoring Engine**
   - Test dengan reference case: Tech Professional / Internet High / Community Medium / Environment Cafe
   - Expected ranking: Sleman (75,9 — Best Match) > Kota Yogyakarta (74,8) > Bantul (68,0)
   - Lihat detail rumus & rincian bobot di `docs/Dokumen_Pendukung_1_DSS_Methodology.md` §9

3. **Result Page**
   - Verifikasi ranking dan skor muncul
   - Klik "Why This Match" → check penjelasan naratif
   - Klik "Detail Distrik" → check ranking kecamatan

4. **Admin Panel**
   - Login dengan credentials di `.env`
   - Update skor indikator
   - Verifikasi audit log terupdate

---

## 📦 Build untuk Production

### 1. Build Optimized

```bash
npm run build
```

Output akan tersimpan di folder `.next/`

### 2. Test Production Build Lokal

```bash
npm start
```

### 3. Deploy ke Vercel (Recommended)

**Opsion A: Via Vercel CLI**

```bash
npm i -g vercel
vercel
```

**Opsi B: Via GitHub Integration**

1. Push ke GitHub repository
2. Login ke [vercel.com](https://vercel.com)
3. Connect GitHub repository
4. **Penting:** di project settings, set **Root Directory** ke `freelance-city-index` (karena aplikasi Next.js ada di subfolder, bukan di root repo)
5. Vercel akan auto-deploy pada setiap push ke main branch

**Konfigurasi Environment Variables di Vercel:**

Di Vercel dashboard → Settings → Environment Variables, tambahkan semua variabel yang ada di `.env.example`:
```
DATABASE_URL = "postgresql://..."
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "..."
JWT_SECRET = "..."
GEMINI_API_KEY = "..."
GEMINI_MODEL = "gemini-flash-lite-latest"
```

---

## 📁 Struktur Proyek

Repository root (`Project-Psi/`) berisi dokumen proyek (`CLAUDE.md`, `docs/` — PRD & dokumen pendukung, `RIWAYAT_PENGERJAAN.md`) dan subfolder `freelance-city-index/` yang berisi aplikasi Next.js-nya:

```
Project-Psi/
├── CLAUDE.md, RIWAYAT_PENGERJAAN.md, dsb   # dokumen proyek (bukan kode aplikasi)
├── docs/                                    # PRD + 5 dokumen pendukung
└── freelance-city-index/                    # <-- aplikasi Next.js ada di sini
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx              # Landing page (/)
    │   │   ├── quiz/                 # Quiz Step 1 & 2 (/quiz)
    │   │   ├── result/                # Result & ranking distrik (/result)
    │   │   ├── district/[id]/        # District detail + kecamatan (/district/:id)
    │   │   ├── admin/                 # Login, dashboard, data management, audit log
    │   │   ├── assistant/, algoritma/, compare/  # halaman tambahan di luar §6 CLAUDE.md
    │   │   ├── api/
    │   │   │   ├── districts/, districts/[id]/   # GET data distrik
    │   │   │   ├── auth/login|logout|session/     # auth via cookie session
    │   │   │   ├── admin/scores/, admin/scores/bulk/,
    │   │   │   │   admin/subdistrict-scores/bulk/, admin/audit/
    │   │   │   ├── chat/                          # FCI Assistant (Gemini)
    │   │   │   └── survey/                        # Relevance Survey
    │   │   └── layout.tsx             # Root layout
    │   ├── components/{quiz,result,district,admin,shared,ui,landing}/
    │   ├── lib/
    │   │   ├── scoring/               # weights.ts, normalize.ts, score.ts, rank.ts,
    │   │   │                          # rankSubDistricts.ts, whyThisMatch.ts (pure functions)
    │   │   ├── assistant/             # geminiClient.ts, qaBank.ts (FCI Assistant)
    │   │   ├── validation/            # validasi 0-100 (FR-A05)
    │   │   ├── auth.ts                # sign/verify session JWT
    │   │   └── db.ts                  # Prisma client + Neon adapter
    │   ├── data/districts.seed.json   # seed data 5 distrik + 25 kecamatan
    │   ├── types/
    │   └── generated/prisma/          # Prisma Client hasil `prisma generate`
    ├── prisma/
    │   ├── schema.prisma
    │   ├── seed.ts
    │   └── migrations/
    ├── public/
    ├── .env.example                    # template — copy jadi `.env`
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    └── postcss.config.mjs             # Tailwind v4 (tanpa tailwind.config.js)
```

---

## 📡 API Documentation

> Catatan penting: kalkulasi skor & ranking distrik/kecamatan (FR-006, FR-010) dijalankan **client-side** (pure functions di `src/lib/scoring/`), **bukan** lewat API — tidak ada endpoint `POST /api/score`. API hanya dipakai untuk baca/tulis data distrik ke database dan untuk fitur admin/chatbot/survey.
>
> Autentikasi admin memakai **session cookie httpOnly** (`fci_session`, JWT via `jose`), bukan Bearer token di header. Saat testing via `curl`, gunakan `-c cookie.txt` (simpan cookie) lalu `-b cookie.txt` (kirim cookie) — lihat contoh di bawah.

### Public Endpoints (Tanpa Authentication)

**GET /api/districts**
```bash
curl http://localhost:3000/api/districts
```
Response: Array semua distrik, termasuk `scores` (skor 4 indikator) dan `subDistricts` (beserta skornya).

**GET /api/districts/[id]**
```bash
curl http://localhost:3000/api/districts/yogyakarta-kota
```
Response: Detail 1 distrik + `scores`-nya (404 kalau `id` tidak ditemukan).

**POST /api/chat** — FCI Assistant (chatbot hybrid rule-based + Gemini)
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Kenapa Sleman jadi rekomendasi terbaik saya?",
    "ctx": {
      "personaLabel": "Tech Professional",
      "bestName": "Sleman",
      "bestScore": 75.9,
      "isBelowUMK": false
    },
    "history": []
  }'
```
Response: `{ "answer": "..." }`. Butuh `GEMINI_API_KEY` terisi untuk pertanyaan di luar FAQ rule-based.

**POST /api/survey** — Relevance Survey
```bash
curl -X POST http://localhost:3000/api/survey \
  -H "Content-Type: application/json" \
  -d '{
    "relevansi": 5,
    "kemudahan": 4,
    "komentar": "Rekomendasinya masuk akal",
    "personaId": "tech-professional"
  }'
```
Response: hasil survey tersimpan (`relevansi`/`kemudahan` wajib integer 1–5).

### Auth Endpoints

**POST /api/auth/login**
```bash
curl -c cookie.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "freelancecity2026"
  }'
```
Response: `{ "ok": true }` + set cookie `fci_session` (httpOnly, valid 8 jam).

**GET /api/auth/session**
```bash
curl -b cookie.txt http://localhost:3000/api/auth/session
```
Response: `{ "authenticated": true, "username": "admin" }`, atau `401` kalau sesi tidak ada/kedaluwarsa.

**POST /api/auth/logout**
```bash
curl -b cookie.txt -X POST http://localhost:3000/api/auth/logout
```
Response: menghapus cookie sesi.

### Admin Endpoints (Butuh Cookie Sesi Login)

**PUT /api/admin/scores** — update 1 skor indikator distrik
```bash
curl -b cookie.txt -X PUT http://localhost:3000/api/admin/scores \
  -H "Content-Type: application/json" \
  -d '{
    "districtId": "yogyakarta-kota",
    "indicatorId": "internet",
    "skor": 95
  }'
```
Response: skor yang di-upsert + entry baru di audit log.

**PUT /api/admin/scores/bulk** — update beberapa indikator 1 distrik sekaligus (atomic, dengan optimistic locking)
```bash
curl -b cookie.txt -X PUT http://localhost:3000/api/admin/scores/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "districtId": "yogyakarta-kota",
    "indicators": [
      { "indicatorId": "internet", "skor": 95, "expectedUpdatedAt": null }
    ]
  }'
```
Response: `{ "ok": true, "updated": [...] }`, atau `409` kalau ada admin lain sudah mengubah data yang sama (`expectedUpdatedAt` tidak cocok).

**PUT /api/admin/subdistrict-scores/bulk** — sama seperti di atas, tapi untuk skor kecamatan.

**GET /api/admin/audit**
```bash
curl -b cookie.txt http://localhost:3000/api/admin/audit
```
Response: 100 entry audit log terbaru (nilai lama/baru, operator, timestamp, nama distrik).

---

## 🤝 Kontribusi

Kami welcome kontribusi! Berikut caranya:

1. **Fork repository** ini
2. **Buat feature branch:**
   ```bash
   git checkout -b feature/nama-fitur
   ```
3. **Commit changes:**
   ```bash
   git commit -am 'Add: deskripsi fitur baru'
   ```
4. **Push ke branch:**
   ```bash
   git push origin feature/nama-fitur
   ```
5. **Buat Pull Request** dengan deskripsi detail

### Coding Standards

- Gunakan TypeScript strict mode
- Format dengan Prettier
- Lint dengan ESLint
- Test critical logic
- Dokumentasi untuk public functions

---

## 📊 Data Model

### Entity Relationship Diagram

```
DISTRICT (5 distrik)
├── 1:N ──→ DISTRICT_SCORE (20 baris = 5 × 4 indikator)
├── 1:N ──→ SUB_DISTRICT (25 kecamatan)
│           ├── 1:N ──→ SUB_DISTRICT_SCORE (100 baris = 25 × 4 indikator)
│           └── FK: district_id
└── 1:N ──→ AUDIT_LOG (riwayat perubahan)

Indicators: Internet | Cost of Living | Community | Environment
Personas: Tech Professional | Creative Professional | Student & Fresh Graduate | Digital Nomad
```

---

## 🔒 Security Notes

⚠️ **Development Only:**
- `.env` berisi credentials - JANGAN commit ke repository (sudah masuk `.gitignore`)
- Admin username/password default hanya untuk development — wajib diganti untuk production
- `JWT_SECRET` punya fallback string statis kalau tidak diisi (`src/lib/auth.ts`) — **wajib diisi manual** di production, jangan andalkan fallback
- Gunakan secret management (Vercel Environment Variables, dsb) untuk production

✅ **Sudah diterapkan:**
- Session cookie httpOnly + JWT expiry 8 jam (`src/lib/auth.ts`)
- SQL injection protection via Prisma ORM
- HTTPS enforce di Vercel

⚠️ **Belum diterapkan (perlu jadi perhatian sebelum production sungguhan):**
- Admin password masih dibandingkan sebagai plaintext (`src/app/api/auth/login/route.ts`), belum di-hash (mis. bcrypt)
- Belum ada rate limiting untuk endpoint login

---

## 📝 License

MIT License - Proyek akademik untuk Universitas Islam Indonesia, Fakultas Teknologi Industri, Program Studi Informatika.

---

## 👥 Tim Pengembang

**Kelompok 6: Innovative Technology Group**

- **Zulfani Syfa Raudhatul Jannah** (24523259)
- **Mohammad Rizky Hidayat** (24523091)
- **Aditya Fajar Aritama** (24523xxx)

**Pembimbing/Sponsor:** KHOLID HARYONO, S.T., M.KOM.

---

## 📞 Support & Questions

Untuk pertanyaan atau issue:

1. **Buka GitHub Issue** di repository ini
2. **Cek Existing Issues** sebelum membuat yang baru
3. **Sertakan detail:** OS, Node version, error message, steps to reproduce

---

## 📚 Referensi

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma ORM Guide](https://www.prisma.io/docs/)
- [Neon Database Setup](https://neon.tech/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [React Best Practices](https://react.dev/)

---

**Last Updated:** July 2026  
**Project Status:** ✅ Active Development  
**Next Phase:** Public Beta Testing & User Feedback