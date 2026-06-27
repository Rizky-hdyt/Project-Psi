# Riwayat Pengerjaan — Freelance City Index: Yogyakarta Edition

> Dokumen ini merangkum semua yang sudah dikerjakan dari awal sampai selesai,
> termasuk keputusan teknis yang diambil secara proaktif (di luar perintah eksplisit).
> Tujuannya biar bisa dijelaskan ke dosen dengan jelas.

---

## Changelog — Perubahan Terbaru

> Urutan terbaru di atas.

---

### 2026-06-27 — Bug Fix: Admin Gerak Otomatis

**Masalah:** Halaman admin login dan admin dashboard bergerak bolak-balik secara otomatis.

**Root cause:** `useEffect` di `AdminLayoutInner` langsung redirect ke `/admin/login` saat `state.isAuthenticated = false`, padahal nilai itu sementara selama session check (`state.checking = true`) belum selesai. Akibatnya:
1. Buka `/admin` → `isAuthenticated = false` (sementara) → redirect ke login
2. Session check selesai → `isAuthenticated = true` → redirect balik ke `/admin`
3. Gerak bolak-balik

**Fix:**
- `src/app/admin/layout.tsx` — tambah `!state.checking` ke kondisi redirect useEffect
- `src/app/admin/login/page.tsx` — tampil spinner kecil saat `state.checking` (bukan blank)
- `src/components/shared/Footer.tsx` — desain ulang jadi satu bar tipis (py-4)
- `src/components/shared/ConditionalFooter.tsx` — footer tidak render di /admin/* (cegah layout shift)
- `src/components/shared/PageTransition.tsx` — skip animasi di /admin/* (cegah visual gerak saat redirect)

---

### 2026-06-27 — Fitur Baru: Footer, 404, Page Transition, Calculating Animation

**File baru:**
- `src/components/shared/Footer.tsx` — footer tipis satu bar: brand + sumber data + tech stack
- `src/components/shared/ConditionalFooter.tsx` — hanya render di non-admin pages
- `src/components/shared/PageTransition.tsx` — fade-in 0.25s antar halaman
- `src/app/not-found.tsx` — 404 on-brand (MapPinOff, tombol Beranda + Quiz)

**File diubah:**
- `src/app/layout.tsx` — tambah Footer (ConditionalFooter) + PageTransition wrapper
- `src/app/quiz/page.tsx` — animasi 4-langkah "Menghitung hasil..." sebelum pindah ke /result
- `src/app/globals.css` — tambah @keyframes page-fade-in

**Bug fixes di sesi yang sama:**
- Rules of Hooks: `useMemo` di result page dipindah sebelum early return
- Admin login double navigate: hapus `router.push` dari handleSubmit
- Quiz stale closure: capture `quiz.completeInput` di awal sebelum setTimeout
- Progress bar quiz: formula difix dari `(calcStep-1)/4` → `calcStep/4` (bisa sampai 100%)
- Timeout cleanup: `useRef + useEffect` untuk clear semua timeout saat unmount

---

### 2026-06-26 — Fitur Baru: Halaman Algoritma Tersendiri

**File baru:**
- `src/app/algoritma/page.tsx` — halaman `/algoritma` dengan Navbar + tombol kembali + AlgorithmSection
- `src/components/landing/AlgorithmSection.tsx` — 4 tab: Cara Kerja, Bobot Kriteria, Formula, Sumber Data

**File diubah:**
- `src/app/page.tsx` — ganti AlgorithmSection di landing jadi AlgorithmTeaser (teaser card + link ke /algoritma)
- `src/components/shared/Navbar.tsx` — tambah link "Algoritma" → /algoritma

**Keputusan arsitektur:** `/algoritma` route tersendiri (bukan state di /quiz) atas permintaan user — bisa di-share linknya, ada tombol kembali ke beranda.

---

### 2026-06-26 — Fitur Baru: SuggestedPlaces di District Detail

**File baru:**
- `src/data/places.seed.ts` — 50+ tempat (kafe, coworking, quiet, perpustakaan) untuk 5 distrik, fungsi `getRecommendedPlaces(districtId, environmentPreference, personaId)`
- `src/components/district/SuggestedPlaces.tsx` — grid place cards dengan toggle show more

**File diubah:**
- `src/app/district/[id]/page.tsx` — tambah SuggestedPlaces setelah WhyThisMatch

**Logika personalisasi:**
- cafe → prioritas kafe, secondary coworking (tech/nomad)
- coworking → prioritas coworking, secondary kafe
- quiet → tempat tenang/alam, secondary perpustakaan
- flexible → per persona (tech/nomad=coworking, creative=kafe+quiet, student=perpustakaan)

---

### 2026-06-26 — UI Upgrade: Landing Page District Preview Clickable

**File baru:**
- `src/components/landing/DistrictPreviewSection.tsx` — 5 tile distrik di landing yang bisa diklik, expand panel dengan foto + deskripsi distrik

**Teknis:**
- CSS grid trick `gridTemplateRows: "0fr" → "1fr"` untuk smooth expand tanpa library
- `src/data/districts.visuals.ts` — gradient, emoji, picsum imageUrl per distrik

---

### 2026-06-26 — Fase 8: Backend + Koneksi Frontend → API

**Stack backend:**
- Neon PostgreSQL (serverless free tier)
- Prisma 7.8.0 + `@prisma/adapter-neon` + `@neondatabase/serverless`
- Auth: `jose` JWT + httpOnly cookie `fci_session` (8 jam, HS256)

**File baru:**
- `.env` — DATABASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET (gitignored)
- `prisma/schema.prisma` — 3 model: District, DistrictScore, AuditLog
- `prisma/seed.ts` — seed 5 distrik + 20 skor ke Neon
- `src/lib/db.ts` — Prisma client singleton
- `src/lib/auth.ts` — signToken, verifyToken, getSession
- `src/app/api/districts/route.ts` — GET semua distrik + skor
- `src/app/api/districts/[id]/route.ts` — GET satu distrik
- `src/app/api/auth/login/route.ts` — POST login
- `src/app/api/auth/logout/route.ts` — POST logout
- `src/app/api/auth/session/route.ts` — GET cek session
- `src/app/api/admin/scores/route.ts` — PUT update skor (protected)
- `src/app/api/admin/audit/route.ts` — GET audit log (protected)

**File diubah untuk koneksi frontend → API:**
- `src/hooks/useDistricts.ts` — fetch /api/districts, flatten scores
- `src/contexts/AdminContext.tsx` — async login/logout/updateScore, session check on mount
- Semua halaman admin + result + district → pakai useDistricts

**Catatan Prisma 7:**
- WAJIB pakai driver adapter, tidak bisa `new PrismaClient()` tanpa adapter
- `PrismaNeon` minta `{ connectionString }` objek
- Import dari `@/generated/prisma/client`
- Seed butuh `ws` + `neonConfig.webSocketConstructor = ws`

---

### 2026-06-21 — Fase 5-7: Admin Panel + A11y + Integration

**Fase 5 — Admin Panel:**
- AdminContext (useReducer: auth + scores + auditLog)
- admin/layout.tsx (auth guard + sidebar desktop + mobile drawer)
- admin/login/page.tsx, admin/page.tsx, admin/data/page.tsx, admin/audit/page.tsx

**Fase 6 — Aksesibilitas & Responsive:**
- motion-safe: prefix pada animasi
- aria-label, aria-current, focus-visible ring semua kontrol
- Mobile hamburger + drawer admin

**Fase 7 — Integration:**
- Build clean, 0 error, 9 routes

---

### 2026-06-21 — Fase 1-4: Core DSS + UI Upgrade

**Fase 1 — Quiz & Scoring Engine:**
- `src/lib/scoring/weights.ts` — 16 baris PersonaWeight (4 persona × 4 indikator)
- `src/lib/scoring/normalize.ts` — adjustment multiplier + renormalisasi
- `src/lib/scoring/score.ts` — Skor_distrik = Σ(skor × bobot)
- `src/lib/scoring/rank.ts` — ranking + tiebreaker UMK
- `src/lib/scoring/whyThisMatch.ts` — top-2 kontribusi generator
- `src/hooks/useQuizState.ts` — state machine quiz (step 1/2, input, validasi)

**Verifikasi:** Reference case Dok 1 §9 match persis:
- Tech Professional, Internet High, Community Medium, Environment Cafe
- Sleman = 79.2 (Best Match), Kota Yogyakarta = 77.4, Bantul = 72.1

**Fase 2 — All Pages:**
- Landing, Quiz (Step 1 + Step 2), Result (5 DistrictRankCard), District Detail

**Fase 3 — UI Upgrade (Tanah Jogja palette):**
- PersonaCardSelector, WeightBarChart, InternetPrioritySelect, CommunityPrioritySelect
- EnvironmentPreferenceSelect, BudgetSlider, Navbar (glass), WhyThisMatch

**Fase 4 — District Visual Identity:**
- `src/data/districts.visuals.ts` — gradient + emoji per distrik
- Result: gradient strip header per kartu, emoji avatar, sidebar Score Comparison

---

## Status Akhir

| Komponen | Status |
|---|---|
| Landing Page | ✅ |
| Quiz (Step 1 + Step 2 + Calculating) | ✅ |
| Result Page | ✅ |
| District Detail + SuggestedPlaces | ✅ |
| Halaman Algoritma (/algoritma) | ✅ |
| 404 Page | ✅ |
| Footer (tipis, non-admin) | ✅ |
| Admin Login | ✅ (fix gerak bolak-balik) |
| Admin Dashboard | ✅ |
| Admin Data Management | ✅ |
| Admin Audit Log | ✅ |
| Backend API (Neon + Prisma + JWT) | ✅ |
| Build TypeScript | ✅ 0 error, 17 routes |
| Deploy Vercel | 🔜 Fase 9 |
