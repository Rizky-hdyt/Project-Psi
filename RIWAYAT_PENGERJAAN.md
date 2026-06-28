# Riwayat Pengerjaan — Freelance City Index: Yogyakarta Edition

> Dokumen ini merangkum semua yang sudah dikerjakan dari awal sampai selesai,
> termasuk keputusan teknis yang diambil secara proaktif (di luar perintah eksplisit).
> Tujuannya biar bisa dijelaskan ke dosen dengan jelas.

---

## Changelog — Perubahan Terbaru

> Urutan terbaru di atas.

---

### 2026-06-28 — Deploy ke Vercel + Fix Layout + Bersih-bersih Repo

**Konteks:** Project di-deploy agar bisa diakses dari HP/jaringan mana pun (sebelumnya hanya WiFi lokal).

**1. Deploy ke Vercel (live: https://project-psi-gamma.vercel.app/)**
- `package.json`: ubah build script jadi `prisma generate && next build` — wajib agar Prisma client ter-generate di server Vercel (folder `src/generated/prisma` ada di .gitignore, jadi tidak ikut ke repo).
- `src/lib/db.ts`: tambah `neonConfig.webSocketConstructor = ws` + import `ws` — Node.js 18 di Vercel tidak punya WebSocket native, koneksi Neon butuh ini. Tanpa ini API error 500.
- Env vars diset manual di Vercel dashboard: DATABASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET.
- Auto-deploy aktif: tiap `git push` ke main → Vercel build ulang otomatis.

**2. Fix layout (dari screenshot HP user)**
- `src/app/result/page.tsx`: header diubah — judul "Your District Ranking" + subtitle di atas memanjang horizontal, tombol Bandingkan & Retake Quiz dipindah ke bawah (sebelumnya judul kiri besar + tombol kanan bikin judul wrap 3 baris di HP). Judul dikecilkan `text-2xl→text-xl` di mobile.
- `src/app/district/[id]/page.tsx`: tambah `mt-6` antara WhyThisMatch dan SuggestedPlaces — sebelumnya dua kartu putih nempel tanpa jarak terlihat seperti area kosong aneh.

**3. Bersih-bersih repo**
- Buat `.gitignore` di root `C:\Project psi\` (sebelumnya belum ada) — ignore PDF, video, gambar, folder Referensi ui/, screenshots/.
- `git rm --cached` 9 file gambar (`Referensi ui/frames/` + `freelance-city-index/screenshots/`) — hapus dari repo, file lokal tetap ada.
- `PANDUAN_KODE.md` (dokumen penjelasan kode untuk user, dibuat sesi ini) sengaja di-gitignore — tidak masuk repo.
- Update `PROJECT_SUMMARY.md`: status jadi "sudah deploy" + URL, survei relevance ditandai sudah dibuat.

---

### 2026-06-27 — Fix Mobile: Touch Response + Hydration Error + Survey Popup Redesign

**Konteks:** Testing di HP via WiFi lokal (192.168.1.2:3000) — ditemukan beberapa tombol tidak merespons di mobile.

**Root cause yang ditemukan (dari dev log):**
- `ReferenceError: IndicatorCard is not defined` — sisa cache `.next` dari kode lama, menyebabkan React gagal hydrate → semua `onClick` handler tidak jalan, hanya link `<a href>` yang berfungsi
- `Blocked cross-origin request /_next/webpack-hmr from 192.168.1.2` — HMR WebSocket diblokir dari IP luar WiFi

**Fix yang dilakukan:**

1. **RelevanceSurvey redesign → floating popup** (`src/components/shared/RelevanceSurvey.tsx`)
   - Dari: section besar di bawah halaman result
   - Jadi: popup kecil fixed `bottom-6 right-6 z-50 w-72`, muncul otomatis setelah 3.5 detik
   - Rating: ikon bintang (fill on select), lebih compact dari tombol angka
   - Komentar: hidden default, muncul saat klik "+ Tambah masukan teks"
   - Tutup: tombol ×, atau link "Lewati", atau auto-close 2.5s setelah submit
   - Animasi: `slide-in-from-bottom-4 fade-in 300ms`

2. **Touch fixes global** (`src/app/globals.css`)
   - Tambah `touch-action: manipulation` untuk semua `button`, `a`, `[role="button"]`, dll
   - Eliminasi 300ms tap delay di iOS/Android

3. **Persona card hover fix** (`src/components/quiz/PersonaCardSelector.tsx`)
   - Wrap `hover:-translate-y-0.5` dalam `@media(hover:hover)` → iOS tidak lagi butuh dua tap
   - Tambah `active:scale-[0.98]` sebagai visual feedback saat tap

4. **Slider thumb touch target** (`src/components/ui/slider.tsx`)
   - Thumb: `size-3` → `size-4` (lebih besar)
   - Touch area: `after:-inset-2` → `after:-inset-5` (total ~42px, mendekati minimum 44px)

5. **allowedDevOrigins** (`next.config.ts`)
   - Tambah `192.168.1.2` agar HMR WebSocket tidak diblokir saat akses dari HP via WiFi lokal

6. **Cache .next dihapus + server restart**
   - Eliminasi `IndicatorCard is not defined` dari cache lama
   - Compile ulang dari nol

**Hasil:** Semua tombol di HP berfungsi normal setelah hard refresh.

---

### 2026-06-27 — Fitur: Survei Relevansi & Kepuasan (Relevance Score)

**Konteks:** Memenuhi PRD §3 Success Metrics + materi kuliah P20 (Satisfaction Score). Satu-satunya item yang PRD janjikan tapi belum ada di kode.

**File baru:**
- `src/components/shared/RelevanceSurvey.tsx` — komponen survei di akhir halaman `/result`

**File diubah:**
- `src/app/result/page.tsx` — import + render `<RelevanceSurvey />` di bawah area kartu/sidebar

**Isi survei (ringkas, fokus aplikasi):**
1. Relevansi rekomendasi (1–5) — metrik inti DSS: "Seberapa sesuai rekomendasi distrik ini dengan kebutuhan Anda?"
2. Kemudahan penggunaan aplikasi (1–5) — usability web
3. Masukan tambahan (opsional, maks 300 char) — data kualitatif pelengkap

**Perilaku:**
- Tombol "Kirim Penilaian" disabled sampai kedua rating diisi
- Setelah kirim → state "Terima kasih" (CheckCircle2, hijau sawah)
- A11y: `radiogroup`/`radio`, aria-label per nilai, focus ring

**Keputusan teknis:**
- **V1 efemeral** — jawaban TIDAK disimpan (sesuai permintaan user: "buat sementara dulu")
- Disiapkan untuk persistensi nanti: tipe `SurveyResponse` + fungsi `persistResponse()` placeholder dengan TODO(db) — tinggal colok fetch ke API route saat siap
- Token desain on-brand (sawah, line, mono untuk angka); TypeScript 0 error; build clean 18 routes

---

### 2026-06-27 — Fitur V2: Compare District (redesign → dedicated page)

**File baru:**
- `src/app/compare/page.tsx` — halaman `/compare` khusus untuk perbandingan detail

**File diubah:**
- `src/app/result/page.tsx` — tombol "Bandingkan" di header → buka Dialog, navigasi ke `/compare`
- `src/components/ui/dialog.tsx` — shadcn Dialog, baru diinstall

**Alur UX:**
1. Di result page, klik tombol **"Bandingkan"** (BarChart3 icon) di pojok kanan atas
2. Dialog pop-up muncul: 5 kartu distrik dengan checkbox, rank, dan skor
3. Pilih 2–3 distrik → tombol "Bandingkan (n)" aktif
4. Klik → navigasi ke `/compare?districts=id1,id2&persona=...&budget=...&...`
5. Halaman `/compare` menampilkan side-by-side column per distrik:
   - Header kolom: gradient card dengan emoji, nama, rank, skor besar
   - Indikator bars: 4 baris (Internet/Biaya/Komunitas/Lingkungan), highlight hijau = terbaik
   - Data mentah: UMK, coworking count, internet Mbps, tipe wilayah
   - Karakteristik: teks ringkasan per distrik
   - Why This Match: teks alasan cocok (hanya muncul jika quiz context tersedia)
   - Tombol "Lihat Detail" per kolom → `/district/:id`

**Teknis:**
- URL `/compare` menyertakan quiz params → shareable link
- Dialog reset pilihan (`useEffect` + `selected = []`) saat ditutup
- TypeScript 0 error setelah install shadcn Dialog

**Redesign compare page (visual):**
- Bukan tabel kaku — diganti section-per-indikator yang responsif
- Header: gradient cards per distrik (`grid-cols-1 sm:grid-cols-2/3`)
- Indikator: 4 kartu terpisah (Internet/Biaya/Komunitas/Lingkungan), tiap distrik = satu baris dengan bar tebal (h-3), highlight hijau = terbaik
- Data Mentah: fact cards per distrik (emoji mini-header + 4 baris data)
- Karakteristik: deskripsi per distrik dalam card
- Why This Match: kartu hijau muted, hanya muncul jika ada quiz context
- Action buttons: grid responsif → "Detail [Nama]" per distrik
- Semua section: `grid-cols-1` mobile, `sm:grid-cols-2/3` desktop — tidak ada horizontal scroll

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
