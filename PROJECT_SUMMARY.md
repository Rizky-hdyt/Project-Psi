# PROJECT SUMMARY — Freelance City Index: Yogyakarta Edition

> Dokumen rangkuman lengkap tentang apa yang sudah dibangun di project ini.
> Dibuat agar bisa dibaca/di-upload ke Claude web, Claude Desktop, atau dibagikan ke tim/dosen
> tanpa perlu membuka seluruh kode.
>
> **Tanggal dibuat:** 27 Juni 2026 (diperbarui 28 Juni 2026)
> **Status:** MVP V1 selesai + fitur tambahan + 1 fitur V2 (Compare District). ✅ **SUDAH DEPLOY ke Vercel.**
> **URL live:** https://project-psi-gamma.vercel.app/

---

## 1. Apa Produk Ini

**Freelance City Index: Yogyakarta Edition** adalah **Decision Support System (DSS)** — sistem pendukung keputusan, **bukan** chatbot, direktori, atau platform booking.

**Tujuan:** Membantu freelancer / remote worker memilih **distrik kerja terbaik** di antara 5 Kabupaten/Kota DIY (Kota Yogyakarta, Sleman, Bantul, Gunungkidul, Kulon Progo) lewat **weighted scoring** yang transparan dan reproducible.

**Output:** Ranking 5 distrik beralasan, berdasarkan 4 indikator dan preferensi user.

### 3 Nilai Inti (tidak boleh dilanggar)
1. **Transparent Recommendation** — bobot & kontribusi selalu terlihat (halaman Algorithm + Why This Match).
2. **Deterministik** — input sama → output sama. Tidak ada `Math.random()`, tidak ada AI/LLM di V1.
3. **No accounts in V1** — semua state quiz/hasil efemeral (di React state + URL params), kecuali Admin yang punya login.

---

## 2. Tech Stack (versi aktual terinstall)

| Layer | Teknologi | Versi |
|---|---|---|
| Framework | **Next.js** (App Router) | 16.2.9 |
| UI Library | **React** | 19.2.4 |
| Bahasa | **TypeScript** (strict mode) | 5.x |
| Styling | **Tailwind CSS** (CSS-based config) | v4 |
| Komponen | **shadcn/ui** + **@base-ui/react** | — |
| Ikon | **Lucide React** | 1.21 |
| Database | **Neon PostgreSQL** (serverless) | — |
| ORM | **Prisma** + `@prisma/adapter-neon` | 7.8.0 |
| Auth | **jose** (JWT) + httpOnly cookie | 6.2.3 |
| Toast | **sonner** | 2.0.7 |
| Font | Fraunces (display) + Inter (body) + JetBrains Mono (data) | — |

> ⚠️ **Catatan:** Dokumen perencanaan (CLAUDE.md) menyebut "Next.js 15", tapi versi terinstall sebenarnya **Next.js 16.2.9**. Stack awal di GSD menyebut "React + Vite + React Router" — itu rencana lama, **realisasinya pakai Next.js App Router**.

---

## 3. Empat Persona (baku)

1. **Tech Professional**
2. **Creative Professional**
3. **Student & Fresh Graduate**
4. **Digital Nomad**

---

## 4. Metodologi Scoring (DSS)

### 4.1 Empat indikator (skala 0–100)
| Indikator | Arah |
|---|---|
| Internet | tinggi = baik |
| Cost of Living | biaya rendah = skor tinggi (dibalik) |
| Community | tinggi = baik |
| Environment | tinggi = baik |

### 4.2 Bobot dasar per persona (Internet / Cost / Community / Environment)
| Persona | Internet | Cost | Community | Environment |
|---|:--:|:--:|:--:|:--:|
| Tech Professional | 40% | 25% | 20% | 15% |
| Creative Professional | 20% | 25% | 25% | 30% |
| Student & Fresh Graduate | 20% | 45% | 20% | 15% |
| Digital Nomad | 30% | 25% | 25% | 20% |

### 4.3 Empat sinyal input quiz
1. **Budget** (Rp 2jt–6,5jt) → flag "di bawah UMK" + tiebreaker, bukan bobot langsung.
2. **Internet Priority**: Low ×0.7 / Medium ×1.0 / High ×1.3 / Ultra ×1.6
3. **Community Priority**: Low ×0.7 / Medium ×1.0 / High ×1.3
4. **Environment Preference**: Quiet/Cafe/Coworking/Flexible → delta ±5 ke skor Environment.

### 4.4 Alur kalkulasi (deterministik)
```
base_weight(persona) → adjustment 4 sinyal → renormalisasi (Σ = 1)
→ Skor_distrik = Σ(nilai_indikator × bobot') untuk tiap distrik valid
→ kecualikan distrik dengan data invalid/0
→ urutkan desc → tiebreaker: UMK terendah menang jika seri
→ rank 1 = Best Match
→ Why This Match: 2 kontribusi tertinggi + teks trade-off
```

### 4.5 Reference case (sudah diverifikasi match persis)
Input: Tech Professional, Internet High, Community Medium, Environment Cafe →
- Bobot': Internet 0.444 / Cost 0.214 / Community 0.171 / Environment 0.171
- Hasil: **Sleman 79.2 (Best Match)**, Kota Yogyakarta 77.4, Bantul 72.1

---

## 5. Data 5 Distrik (seed)

| Distrik | Tipe | UMK | Coworking | Internet | Biaya Kost | Estimasi Hidup |
|---|---|---|:--:|:--:|---|---|
| Kota Yogyakarta | Kota | 2.830.000 | 12 | 90 Mbps | 900rb–2jt | 3,2jt |
| Sleman | Kabupaten | 2.690.000 | 9 | 85 Mbps | 700rb–1,6jt | 2,8jt |
| Bantul | Kabupaten | 2.490.000 | 5 | 70 Mbps | 500rb–1,2jt | 2,3jt |
| Gunungkidul | Kabupaten | 2.330.000 | 2 | 45 Mbps | 350rb–800rb | 1,9jt |
| Kulon Progo | Kabupaten | 2.490.000 | 3 | 55 Mbps | 400rb–900rb | 2,1jt |

**Skor indikator per distrik (0–100):**
| Distrik | Internet | Cost | Community | Environment |
|---|:--:|:--:|:--:|:--:|
| Kota Yogyakarta | 90 | 55 | 90 | 60 |
| Sleman | 85 | 70 | 80 | 75 |
| Bantul | 70 | 80 | 60 | 80 |
| Gunungkidul | 40 | 95 | 30 | 85 |
| Kulon Progo | 50 | 88 | 40 | 78 |

> Data hidup di **Neon PostgreSQL** (production) dan ada mirror seed di `src/data/districts.seed.json`.

---

## 6. Halaman & Route (11 halaman + 7 API)

### Halaman (user-facing)
| Route | Fungsi | FR |
|---|---|---|
| `/` | Landing Page — hero, value prop, preview 5 distrik clickable | FR-000 |
| `/quiz` | Quiz Step 1 (input) + Step 2 (Algorithm Explanation) via state | FR-001–007 |
| `/result` | Ranking 5 distrik + Best Match + Why This Match + tombol Bandingkan | FR-008,009,012 |
| `/compare` | **Perbandingan 2–3 distrik side-by-side** (fitur V2) | V2 |
| `/district/[id]` | District Detail + Snapshot (6 elemen) + Suggested Places | FR-011 |
| `/algoritma` | Halaman penjelasan algoritma (4 tab) — tambahan | — |
| `/not-found` | Halaman 404 on-brand | — |

### Halaman Admin
| Route | Fungsi | FR |
|---|---|---|
| `/admin/login` | Login admin (JWT) | FR-A01 |
| `/admin` | Dashboard — tabel 5 distrik + peringatan data >7 hari | FR-A02 |
| `/admin/data` | Form input skor 0–100 + validasi inline | FR-A03, A05 |
| `/admin/audit` | Tabel audit log perubahan | FR-A04 |

### API Routes
| Route | Method | Auth | Fungsi |
|---|---|:--:|---|
| `/api/districts` | GET | ❌ | Semua distrik + skor |
| `/api/districts/[id]` | GET | ❌ | Satu distrik |
| `/api/auth/login` | POST | ❌ | Login → set cookie JWT |
| `/api/auth/logout` | POST | ❌ | Hapus cookie |
| `/api/auth/session` | GET | ❌ | Cek session aktif |
| `/api/admin/scores` | PUT | ✅ | Update skor + catat audit |
| `/api/admin/audit` | GET | ✅ | Baca audit log |

---

## 7. Functional Requirements — Status

| FR | Fitur | Status |
|---|---|:--:|
| FR-000 | Landing Page | ✅ |
| FR-001 | Pilih 1 dari 4 persona | ✅ |
| FR-002 | Budget slider (Rp 2jt–6,5jt) | ✅ |
| FR-003 | Internet Priority (Low/Medium/High/Ultra) | ✅ |
| FR-004 | Community Priority (Low/Medium/High) | ✅ |
| FR-005 | Environment Preference (Quiet/Cafe/Coworking/Flexible) | ✅ |
| FR-006 | Weighted scoring engine | ✅ |
| FR-007 | Algorithm Explanation (bobot + formula) | ✅ |
| FR-008 | Ranking + skor 4 indikator + data mentah | ✅ |
| FR-009 | Badge "Best Match" rank 1 | ✅ |
| FR-010 | Real-time recompute tanpa reload | ✅ |
| FR-011 | District Detail + Snapshot | ✅ |
| FR-012 | Why This Match (2 kontribusi + trade-off) | ✅ |
| FR-A01 | Admin login | ✅ |
| FR-A02 | Admin dashboard | ✅ |
| FR-A03 | Admin input data | ✅ |
| FR-A04 | Admin audit log | ✅ |
| FR-A05 | Validasi 0–100 | ✅ |

**Semua 18 FR inti = SELESAI.**

---

## 8. Fitur Tambahan (di luar FR wajib)

| Fitur | File | Keterangan |
|---|---|---|
| Halaman Algoritma `/algoritma` | `src/app/algoritma/page.tsx` | 4 tab: Cara Kerja, Bobot, Formula, Sumber Data |
| Suggested Places | `src/components/district/SuggestedPlaces.tsx` + `src/data/places.seed.ts` | 50+ tempat (kafe/coworking/quiet) per distrik, dipersonalisasi |
| District Preview clickable | `src/components/landing/DistrictPreviewSection.tsx` | 5 tile di landing, expand panel |
| Page Transition | `src/components/shared/PageTransition.tsx` | Fade-in 0.25s antar halaman |
| Calculating Animation | dalam `src/app/quiz/page.tsx` | Animasi 4-langkah sebelum ke /result |
| Footer tipis | `src/components/shared/Footer.tsx` + `ConditionalFooter.tsx` | Non-admin, brand + sumber data + tech |
| 404 Page | `src/app/not-found.tsx` | On-brand |
| **Compare District (V2)** | `src/app/compare/page.tsx` + Dialog di result | Pilih 2–3 distrik, bandingkan side-by-side |

---

## 9. Fitur Compare District (V2 — detail)

**Alur:**
1. Di `/result`, klik tombol **"Bandingkan"** di pojok kanan atas.
2. Muncul **Dialog (pop-up)** berisi 5 distrik (checkbox + rank + skor).
3. Pilih **2–3 distrik** → tombol "Bandingkan (n)" aktif.
4. Navigasi ke `/compare?districts=id1,id2&persona=...&budget=...` (URL shareable).
5. Halaman `/compare` menampilkan:
   - Gradient header cards per distrik (skor besar + rank + emoji)
   - **Tabel indikator kompak** (kolom = distrik, baris = 4 indikator, highlight ▲ untuk nilai terbaik)
   - Data Mentah (fact cards: UMK, coworking, internet, tipe)
   - Karakteristik per distrik
   - Why This Match per distrik (jika ada quiz context)
   - Tombol "Detail [Nama]" per distrik
6. Semua section responsif (mobile: stack 1 kolom; desktop: 2–3 kolom).

---

## 10. Backend & Database

### Skema Database (Prisma → Neon PostgreSQL)
**3 tabel:**

**District** — `id, nama, tipe, umk, coworkingCount, internetMbps, kostMin, kostMax, estimasiBiayaHidup, ringkasanKarakteristik`

**DistrictScore** — `id, districtId (FK), indicatorId, skor (Float), updatedAt` — unique per (districtId, indicatorId). 20 baris (5 distrik × 4 indikator).

**AuditLog** — `id, districtId (FK), indicatorId, nilaiLama, nilaiBaru, operator, createdAt`

### Auth
- `jose` JWT, algoritma HS256, cookie `fci_session` (httpOnly, 8 jam)
- Credentials dari environment variables (`ADMIN_USERNAME`, `ADMIN_PASSWORD`)
- ⚠️ Password masih **plain-text compare** dari env (belum hashing/bcrypt) — lihat §12

---

## 11. Struktur Folder Utama

```
freelance-city-index/
├── prisma/
│   ├── schema.prisma          # 3 model: District, DistrictScore, AuditLog
│   ├── seed.ts                # seed 5 distrik + 20 skor ke Neon
│   └── migrations/            # migration init
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing
│   │   ├── quiz/              # Quiz (Step 1 + 2 + calculating animation)
│   │   ├── result/           # Ranking + Compare Dialog
│   │   ├── compare/          # Halaman perbandingan (V2)
│   │   ├── district/[id]/    # District Detail + Snapshot
│   │   ├── algoritma/        # Halaman algoritma
│   │   ├── admin/            # login, dashboard, data, audit
│   │   ├── api/              # 7 API routes
│   │   ├── layout.tsx        # root layout (font, footer, transition)
│   │   ├── not-found.tsx     # 404
│   │   └── globals.css       # Tailwind v4 config + design tokens
│   ├── components/
│   │   ├── ui/               # shadcn (button, dialog, slider, table, dll)
│   │   ├── shared/           # Navbar, Footer, WhyThisMatch, EmptyState, dll
│   │   ├── quiz/             # PersonaCardSelector, WeightBarChart, dll
│   │   ├── landing/          # AlgorithmSection, DistrictPreviewSection
│   │   └── district/         # SuggestedPlaces
│   ├── lib/
│   │   ├── scoring/          # weights, normalize, score, rank, whyThisMatch (pure functions)
│   │   ├── validation/       # adminInput (validasi 0–100)
│   │   ├── auth.ts           # JWT sign/verify
│   │   ├── db.ts             # Prisma client
│   │   └── utils.ts          # cn() helper
│   ├── data/                 # districts.seed.json, districts.visuals.ts, places.seed.ts
│   ├── types/                # district, persona, quiz, recommendation
│   ├── hooks/                # useQuizState, useDistricts
│   ├── contexts/             # AdminContext
│   └── generated/prisma/     # Prisma client generated
└── package.json
```

---

## 12. Yang BELUM Dibuat (gap vs dokumen)

### Ada di PRD
| Item | Lokasi PRD | Status | Prioritas |
|---|---|---|---|
| ~~Survei Relevance Score~~ ✅ SUDAH DIBUAT (efemeral) | §3 Success Metrics | `RelevanceSurvey.tsx` di /result — popup rating + komentar | 🟡 Lanjutan: persist ke DB (tabel Survey + API) |
| Halaman 403 admin | Admin Decision Points | belum (cuma redirect login) | 🟢 Rendah |
| Optimistic locking (konflik 2 admin) | Admin Edge Cases | belum | 🟢 Rendah |

### Hanya di Dokumen Pendukung (bukan PRD)
| Item | Lokasi | Prioritas |
|---|---|---|
| Label "Tidak ada yang cocok 100% — terdekat" | Dok 2 §7, §8 | 🟡 Sedang |
| Password hashing + rate-limit login | Dok 2 NFR05 | 🟡 Sedang |

### Tahapan project
- ✅ **Fase 9: Deploy ke Vercel SELESAI** — live di https://project-psi-gamma.vercel.app/ (env vars sudah diset, auto-deploy tiap git push)
- Favicon branded + OG meta tags — disarankan (opsional)
- Dokumen pengujian P20 (cross-browser, Lighthouse, heuristic, usability test) — belum

---

## 13. Out of Scope (sengaja TIDAK dibuat di V1)

**→ V2:** Login pengguna, Save Result, History, Favorites, District Visualization (radar/bar chart), Interactive Map/Google Maps, Email notification.
*(Compare District sudah dibuat lebih awal sebagai pengecualian.)*

**→ V3:** AI/chatbot, forum, review/rating publik, rekomendasi akomodasi, mobile app native, multi-language.

---

## 14. Cara Menjalankan (lokal)

```bash
cd freelance-city-index
npm install
# pastikan .env berisi DATABASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET
npm run db:seed      # isi data awal ke Neon (sekali saja)
npm run dev          # http://localhost:3000
```

**Admin login (default):** username `admin` / password sesuai `.env`.

---

## 15. Arah Desain

Tema **"Field Notes dari Lapangan"** — nuansa peta kerja & instrumen ukur, bukan batik dekoratif.

**Palet warna:**
| Token | Hex | Peran |
|---|---|---|
| ink | `#1C2521` | Teks utama |
| paper | `#F7F5EF` | Background |
| sawah | `#2F6F4E` | Aksen primer (CTA, Best Match) |
| pesisir | `#1F5C73` | Aksen sekunder (data/chart) |
| genteng | `#B5562F` | Signature (sangat terbatas) |
| warning | `#B8860B` | Kuning — peringatan informatif |
| error | `#B3261E` | Merah — error sesungguhnya |

**Aturan warna:** kuning = peringatan (data lampau, budget rendah), merah = error (koneksi putus, validasi gagal). Tidak boleh tertukar.

**Signature element:** Bar bobot indikator yang beranimasi di halaman Algorithm & Result.

---

*Dokumen ini dirangkum dari struktur kode aktual + PRD + 5 Dokumen Pendukung per 27 Juni 2026.*
