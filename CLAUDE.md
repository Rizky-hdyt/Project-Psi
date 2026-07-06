# CLAUDE.md — Freelance City Index: Yogyakarta Edition

Project memory permanen untuk Claude Code. Baca file ini secara penuh sebelum mengerjakan task apa pun di repo ini. File ini adalah satu-satunya source-of-truth arsitektur & desain untuk implementasi — PRD dan 5 dokumen pendukung adalah source-of-truth *produk/requirement*.

**Cara baca dokumen ini:** setiap section ditandai salah satu dari tiga label di kanan judulnya:
- **[PERMANEN]** — business logic, arsitektur, algoritma, data model, routing. Tidak boleh berubah karena permintaan visual apa pun, termasuk saat Complete UI Rebuild Mode aktif.
- **[DEFAULT — Normal Mode]** — keputusan visual/presentasi V1 saat ini. Berlaku sebagai default selama tidak ada instruksi rebuild eksplisit. **Diabaikan sepenuhnya** saat Complete UI Rebuild Mode aktif, kecuali user secara eksplisit minta dipertahankan.
- **[CAMPURAN]** — section berisi campuran functional requirement (permanen) dan spesifikasi visual (default), dipisahkan jelas di dalam section itu sendiri.

---

## 0. Operating Modes — Wajib Dibaca Dulu

Project ini punya dua mode kerja. Default selalu **Normal Development Mode** kecuali user secara eksplisit memicu **Complete UI Rebuild Mode**.

### 0.1 Normal Development Mode (default)

Aktif untuk: bug fix, pengembangan fitur baru, perbaikan performa, perbaikan aksesibilitas, refactor kode, dan **perbaikan UI kecil/incremental**.

Di mode ini:
- Pertahankan design system dan identitas visual yang sedang berjalan (lihat §10 — semua yang berlabel **[DEFAULT — Normal Mode]**).
- Perbaikan kecil pada UI diperbolehkan (ganti warna satu komponen, perbaiki spacing, tambah state hover, dsb).
- **Redesign besar tidak diperbolehkan** di mode ini walau task terasa "butuh UI lebih bagus" — kalau ragu apakah perubahan sudah termasuk redesign besar, tanyakan ke user dulu, jangan asumsikan.
- Semua section berlabel **[PERMANEN]** tetap wajib dipatuhi seperti biasa.

### 0.2 Complete UI Rebuild Mode

**Trigger eksplisit** — mode ini AKTIF ketika user menulis permintaan sejenis (Bahasa Indonesia maupun Inggris):
- "redesign total", "desain ulang dari awal", "rebuild UI", "remake semua halaman"
- "complete redesign", "rebuild frontend", "redesign from scratch", "complete overhaul"
- "buat identitas visual baru", "activate Complete UI Rebuild Mode"

Kalau ragu apakah permintaan user memicu mode ini atau cuma perbaikan UI biasa, **tanyakan satu kali**, jangan menebak.

**Saat mode ini aktif, Claude WAJIB:**

✅ Pertahankan (tidak boleh berubah):
- Business logic & scoring algorithm (§5 DSS Methodology — bobot, formula, tiebreaker)
- Semua fitur & Functional Requirements (§4)
- Routing & Information Architecture (§6 — struktur route, state machine quiz Step 1/2, dsb)
- Autentikasi admin, API integrations, koneksi database, Prisma models
- State management pattern (React state/context untuk quiz, tidak localStorage)
- Validation logic (§15 aturan coding, validasi 0–100, dsb)
- Data model / interfaces (§7)
- Project architecture & folder structure (§14)

🎨 Boleh dirombak total dari nol (tidak terikat ke keputusan visual manapun sebelumnya):
- Palet warna, token CSS, tipografi, radius, shadow, spacing scale
- Layout tiap halaman (hero, quiz, result, district detail, admin)
- Component hierarchy & visual hierarchy
- Navigasi, sidebar, card style, tabel, form, tombol
- Signature element / identitas visual (§10.4 lama boleh diganti total)
- Microcopy contoh (§13 — bahasa tetap Indonesia, tapi kalimat spesifik bebas)

**Prinsip kunci:** interface baru **tidak wajib mirip** desain sebelumnya kecuali user secara eksplisit minta dipertahankan. Jangan menganggap palet/font/layout lama sebagai "jangkar" yang harus dipertahankan sebagian — kalau mode ini aktif, mulai dari prinsip desain pertama (first principles), bukan dari revisi warna/font di atas struktur lama.

### 0.3 User Intent Priority

**Instruksi eksplisit user selalu menang di atas keputusan visual sebelumnya.** Urutan prioritas saat ada konflik:

1. **Instruksi eksplisit user di percakapan saat ini**
2. **Operating Mode yang sedang aktif** (§0.1 atau §0.2)
3. **Project Architecture & Routing** (§6, §14 — berlaku selalu, kedua mode)
4. **Business Logic & Algoritma** (§5, §4, §7 — berlaku selalu, kedua mode)
5. **Skill yang terinstall** (§1 — dipakai untuk mengisi *bagaimana* eksekusi, bukan menimpa poin 1–4)
6. **Keputusan UI sebelumnya** (§10 — prioritas terendah; hanya berlaku sebagai default kalau tidak ada sinyal lain di atasnya)

Contoh penerapan: kalau user bilang "redesign total pakai skill X", maka skill X (poin 5) boleh menentukan warna/font/layout baru sepenuhnya, dan itu **mengalahkan** §10 lama (poin 6) — tapi tetap tidak boleh mengubah formula scoring (poin 4) atau menambah fitur di luar scope V1 (poin 3) tanpa konfirmasi user.

---

## 1. Skill yang Terinstall — Wajib Dipanggil Sesuai Konteks & Mode

Skill berikut sudah terinstall di Claude Code untuk project ini. **Jangan membuat keputusan yang seharusnya dijawab skill tanpa memanggilnya dulu.**

### 1.1 Skill inti (dipakai di kedua mode)

| Skill | Kapan dipanggil | Apa yang dicegahnya kalau dilewati |
|---|---|---|
| **`vercel-react-best-practices`** | Setiap kali menyusun struktur komponen, data fetching, code-splitting, atau menyiapkan build untuk deploy. Berlaku di kedua mode karena ini soal arsitektur React/Next.js, bukan visual. | Pola React yang tidak idiomatic untuk Next.js 15/React 19, struktur file sulit maintain, perf issue baru ketahuan saat deploy. |
| **`prisma-database-setup`** | Setiap kali mengubah/menyiapkan koneksi database, provider Prisma, atau troubleshoot koneksi. | Konfigurasi Prisma salah provider, koneksi gagal di production (mis. lupa `ws` polyfill untuk Neon di Vercel). |
| **`tailwind-v4-shadcn`** | Setiap kali menulis className, konfigurasi tema/CSS variables, atau generate komponen shadcn baru — di KEDUA mode, karena ini soal konvensi teknis Tailwind v4, bukan soal token warna spesifik. | Salah pakai konvensi Tailwind v3 (`tailwind.config.js` JS-based) padahal v4 pakai CSS-based config. |
| **`find-skills`** | Saat menghadapi task yang terasa butuh skill spesifik tapi tidak yakin yang mana. | Reinventing the wheel untuk hal yang sudah ada panduannya. |

### 1.2 Skill desain — full power hanya di Complete UI Rebuild Mode

Skill berikut **boleh menentukan arah visual sepenuhnya** ketika Complete UI Rebuild Mode aktif (§0.2). Di Normal Mode, pakai hanya untuk audit/polish kecil yang konsisten dengan design system default (§10) — jangan biarkan skill ini mendorong redesign besar tanpa user memicu Rebuild Mode secara eksplisit.

| Skill | Peran saat Rebuild Mode aktif | Peran saat Normal Mode |
|---|---|---|
| **`ui-ux-pro-max`** | Sumber utama: pilih style/palet/font pairing/pattern komponen dari database 50+ style, 161 palet, 57 font pairing. Boleh mengganti identitas visual total. | Referensi guideline UX (form, table, chart, a11y) saja — jangan pakai untuk ganti token warna/font. |
| **`design-taste-frontend`** (alias "Taste") | Sumber arah desain utama: brief inference, 3 dial (Variance/Motion/Density), anti-slop discipline (no em-dash, no eyebrow berlebih, no hero-metric klise, dsb). | Tidak dipakai untuk redesign; boleh dipakai sebagai referensi anti-pattern check ringan. |
| **`impeccable`** | Audit + build end-to-end untuk kualitas produksi (kontras, motion, states) di desain baru. | Dipakai untuk polish pass kecil: perbaiki hierarchy/spacing/states pada desain yang sudah ada, bukan mengganti desainnya. |
| **`image-to-code`** | Kalau user melampirkan referensi visual (screenshot/gambar), generate & analisis image dulu sebelum implementasi — dipakai penuh untuk membangun tampilan baru. | Tidak relevan kecuali user eksplisit minta implementasi dari gambar referensi untuk komponen kecil. |
| **`redesign-existing-projects`** | Panduan urutan kerja saat merombak project existing: audit dulu → font swap → palet → states → layout → component replacement. Dipakai sebagai *proses*, bukan pembatas hasil akhir. | Tidak dipakai (Normal Mode tidak melakukan redesign). |
| **`frontend-design`** | Alternatif untuk `design-taste-frontend` bila user minta panduan arah desain generik (brainstorm → plan → critique → build). Pilih salah satu, jangan dua-duanya di sesi yang sama. | Dipakai untuk keputusan visual kecil yang butuh sedikit kreativitas (mis. copy baru, ikon baru) tanpa mengubah struktur besar. |

**Skill overlap:** `frontend-design` dan `design-taste-frontend` melakukan hal serupa (brief inference, anti-slop, dial system). Pilih salah satu per sesi kerja berdasarkan mana yang lebih baru/relevan dengan permintaan user — jangan panggil keduanya untuk task yang sama.

### 1.3 Urutan kerja yang disarankan

**Normal Mode, task UI kecil:** `find-skills` (kalau ragu) → `tailwind-v4-shadcn` (implementasi) → `vercel-react-best-practices` (struktur) → `impeccable` (polish pass, opsional) → build.

**Complete UI Rebuild Mode:** `design-taste-frontend` atau `ui-ux-pro-max` (tentukan arah visual baru sepenuhnya) → `image-to-code` (kalau ada referensi gambar) → `tailwind-v4-shadcn` (implementasi styling) → `impeccable` (audit kualitas produksi) → `vercel-react-best-practices` (struktur & performa) → build.

### 1.4 Aturan konflik antar skill

Kalau saran dua skill bertentangan (mis. `ui-ux-pro-max` merekomendasikan satu palet, `design-taste-frontend` merekomendasikan palet lain): ikuti **§0.3 User Intent Priority** dulu — kalau user tidak menentukan, prioritaskan skill yang paling baru dipanggil dalam sesi yang sama, dan skill dengan aturan paling spesifik (anti-slop checklist `design-taste-frontend` lebih detail dari database umum `ui-ux-pro-max`, jadi menang soal larangan pola AI-generated).

Skill desain (poin 1.2) **tidak boleh** menimpa apa pun yang berlabel **[PERMANEN]** di dokumen ini (algoritma scoring, routing, data model) — skill hanya mengatur presentasi.

---

## 2. Apa Produk Ini [PERMANEN]

**Freelance City Index: Yogyakarta Edition** adalah **Decision Support System (DSS)** — bukan chatbot, bukan direktori, bukan platform booking. Outputnya adalah *ranking distrik beralasan* berbasis weighted scoring yang transparan dan reproducible, untuk membantu freelancer/remote worker memilih distrik kerja terbaik di antara 5 Kabupaten/Kota DIY: **Kota Yogyakarta, Sleman, Bantul, Gunungkidul, Kulon Progo**.

Istilah resmi di UI/copy/kode: **"distrik"** (sesuai PRD). Dokumen pendukung teknis kadang memakai "wilayah/Kabupaten-Kota" — keduanya entitas yang sama, tapi **kode dan UI selalu pakai "distrik"**. Ini berlaku permanen di kedua Operating Mode — redesign visual tidak boleh mengganti istilah ini.

### Nilai inti produk (tidak boleh dilanggar oleh keputusan teknis maupun visual apa pun)
1. **Transparent Recommendation** — setiap rekomendasi harus bisa dijelaskan (bobot terlihat, kontribusi ditunjukkan). Ini persyaratan fungsional: mekanisme transparansi harus ADA, wujud visualnya bebas.
2. **Deterministik** — input sama harus selalu menghasilkan output sama. Tidak ada randomness, tidak ada LLM/AI di V1, tidak ada hasil yang berubah tanpa perubahan input.
3. **No accounts in V1** — tidak ada login pengguna, tidak ada Save Result/History. Semua state quiz & hasil bersifat **efemeral/sesi** (in-memory client-side), kecuali sisi Admin yang memang punya auth.

---

## 3. Empat Persona [PERMANEN — baku, gunakan persis nama ini di mana pun]

1. **Tech Professional**
2. **Creative Professional**
3. **Student & Fresh Graduate**
4. **Digital Nomad**

❌ Jangan pernah pakai nama lama: "Developer", "Creator", "Student" (tanpa "& Fresh Graduate"). Kalau ditemukan di kode/copy lama, itu bug — ganti ke 4 nama baku di atas. Berlaku permanen di kedua Operating Mode: redesign visual boleh mengganti kartu/ikon/warna persona, tapi **nama & definisi 4 persona ini tidak boleh berubah**.

---

## 4. Functional Requirements — Peta Nomor FR Final v1.1 [PERMANEN]

PRD sudah direvisi: Community Priority disisipkan sebagai **FR-004** (bukan suffix "b"), dan FR sesudahnya bergeser. **Pakai tabel ini sebagai rujukan nomor FR yang benar** — jangan pakai nomor dari draft lama mana pun. Tabel ini tetap berlaku identik di kedua Operating Mode; yang berubah saat Rebuild Mode hanya *bagaimana* tiap FR diwujudkan secara visual (lihat §11).

| FR | Fitur | Halaman/Step |
|---|---|---|
| FR-000 | Landing Page | `/` |
| FR-001 | Pilih 1 dari 4 persona | `/quiz` Step 1 |
| FR-002 | Budget slider (Rp 2jt–6,5jt) | `/quiz` Step 1 |
| FR-003 | Internet Priority (Low/Medium/High/Ultra) | `/quiz` Step 1 |
| FR-004 | **Community Priority** (Low/Medium/High) | `/quiz` Step 1 |
| FR-005 | Environment Preference (Quiet/Cafe/Coworking/Flexible) | `/quiz` Step 1 |
| FR-006 | Weighted scoring engine | trigger: "Find My Best Region" |
| FR-007 | Algorithm Explanation (bobot + formula) | `/quiz` Step 2 (state, bukan route) |
| FR-008 | Ranking + skor 4 indikator + data mentah per kartu | `/result` |
| FR-009 | Badge "Best Match" pada rank 1 | `/result` |
| FR-010 | Real-time recompute tanpa reload saat input diubah | `/result` (setelah kembali ke Step 1) |
| FR-011 | District Detail + District Snapshot | `/district/:id` |
| FR-012 | Why This Match (2 kontribusi tertinggi + trade-off) | komponen di `/result` & `/district/:id` |
| FR-A01–A05 | Admin: login, dashboard, input data, validasi 0–100, audit log | `/admin/*` |

---

## 5. DSS Methodology — Wajib Dipatuhi Scoring Engine [PERMANEN, PALING KRITIS]

**Section ini adalah inti algoritma produk. Tidak boleh berubah oleh permintaan redesign visual apa pun, di kedua Operating Mode, tanpa konfirmasi eksplisit user.** Detail lengkap & contoh numerik: `docs/Dokumen_Pendukung_1_DSS_Methodology.md`.

### 5.1 Empat indikator (skala 0–100)
| Indikator | Arah |
|---|---|
| Internet | tinggi = baik |
| Cost of Living | **biaya rendah = skor tinggi** (dibalik) |
| Community | tinggi = baik |
| Environment | tinggi = baik (kebisingan dibalik) |

### 5.2 Bobot dasar per persona (Internet / Cost / Community / Environment)
| Persona | Internet | Cost | Community | Environment |
|---|:--:|:--:|:--:|:--:|
| Tech Professional | 40% | 25% | 20% | 15% |
| Creative Professional | 20% | 25% | 25% | 30% |
| Student & Fresh Graduate | 20% | 45% | 20% | 15% |
| Digital Nomad | 30% | 25% | 25% | 20% |

`Weight` table = 4 persona × 4 indikator = **16 baris wajib**, termasuk Digital Nomad (sering terlewat).

### 5.3 Empat sinyal input quiz (urutan tampil = urutan FR)
1. **Budget** (FR-002) → sinyal afordabilitas (flag "di bawah UMK") + **tiebreaker**, BUKAN bobot indikator langsung.
2. **Internet Priority** (FR-003): Low ×0.3 / Medium ×1.0 / High ×1.7 / Ultra ×2.5
3. **Community Priority** (FR-004): Low ×0.3 / Medium ×1.0 / High ×1.8
4. **Environment Preference** (FR-005): delta ke **bobot** Environment saja (tidak menambah Community — hindari double counting): Quiet +0.15 / Cafe +0.08 / Coworking +0.04 / Flexible +0

> Rentang multiplier diperlebar 2026-07-06 (sebelumnya 0.7–1.6 dan delta Environment flat +0.05 untuk semua non-Flexible): dengan rentang lama, bobot persona terlalu dominan — simulasi 192 kombinasi input menunjukkan Best Match nyaris tidak pernah berubah apa pun jawaban user. Dengan rentang baru + data seed rebalance, 4 distrik berbeda bisa jadi Best Match tergantung jawaban (lihat RIWAYAT_PENGERJAAN.md).

### 5.4 Alur kalkulasi (deterministik)
```
base_weight(persona) → terapkan adjustment dari 4 sinyal → renormalisasi (Σ bobot' = 1)
→ Skor_distrik = Σ(nilai_indikator_i × bobot_i') untuk tiap distrik valid
→ kecualikan distrik dengan data invalid/0
→ urutkan skor desc → tiebreaker: UMK terendah menang jika skor seri
→ rank 1 = Best Match (FR-009)
→ Why This Match (FR-012): ambil 2 kontribusi tertinggi (nilai_i × bobot_i'), generate teks trade-off
```

**Unit test reference case** (dari Dok 1 §9, harus match persis — diperbarui 2026-07-06 setelah rebalance data seed + pelebaran multiplier, lihat RIWAYAT_PENGERJAAN.md): Tech Professional, Internet High, Community Medium, Environment Cafe →
- bobot': Internet 0.500, Cost 0.184, Community 0.147, Environment 0.169
- Sleman = 75.9 (Best Match), Kota Yogyakarta = 74.8, Bantul = 68.0

### 5.5 Kapan kalkulasi & real-time update terjadi
- Quiz Step 1 (FR-001–005): isi input, **belum ada kalkulasi skor**.
- "Find My Best Region" ditekan → trigger FR-006 → tampil Step 2 (FR-007: bobot + formula).
- "See Results" → render `/result` (FR-008).
- Kalau user kembali ke Step 1 dan ubah input setelah hasil tampil → skor update tanpa reload (FR-010, client-side recompute).

---

## 6. Information Architecture & Routing [PERMANEN]

Detail lengkap: `docs/Dokumen_Pendukung_4_IA_DataModel.md`. Struktur route dan urutan flow ini permanen di kedua Operating Mode — Rebuild Mode boleh mengganti total tampilan tiap halaman, tapi **tidak boleh menambah/menghapus route atau mengubah urutan state**, kecuali user eksplisit minta.

```
/                       Landing Page                          FR-000
/quiz                   Quiz — state internal:
                           Step 1: Input (persona, budget, internet, community, environment)   FR-001–005
                           Step 2: Algorithm Explanation        ← STATE, BUKAN route terpisah    FR-007
/result                 Recommendation Result                 FR-008, FR-009
/district/:id           District Detail + Snapshot            FR-011
/admin/login            Admin Login                            FR-A01
/admin                  Dashboard                               FR-A02
/admin/data             Data Management                         FR-A03, FR-A05
/admin/audit            Audit Log                                FR-A04
```

**Keputusan arsitektur tetap:** `/algorithm` **bukan** route Next.js mandiri — Algorithm Explanation adalah Step 2 di dalam state machine `/quiz`. Jangan buat route terpisah kecuali user secara eksplisit minta diubah.

"Why This Match" adalah **komponen** (`WhyThisMatch`), dirender di `/result` (kartu Best Match + saat distrik diklik) dan `/district/:id` — reuse satu komponen, jangan duplikasi. Ini persyaratan arsitektur (reuse code), bukan soal visual — Rebuild Mode boleh mendesain ulang tampilan `WhyThisMatch` sepenuhnya, tapi tetap harus 1 komponen yang dipakai di 2 tempat.

### User flow inti (permanen)
```
Landing → "Mulai" → Quiz Step 1 → validasi (persona wajib) → "Find My Best Region"
  → Step 2 Algorithm → "See Results" → hitung skor 5 distrik
  → semua distrik invalid? → Empty State
  → Result (ranking + Best Match + Why This Match)
  → klik distrik → District Detail + Snapshot → kembali → Result
  → "Try Again" → reset ke Step 1 tanpa reload
```

---

## 7. Data Model [PERMANEN — acuan types/interfaces, bukan skema backend penuh di V1]

V1 = MVP akademik, hosting/DB tier gratis. Data 5 distrik × 4 indikator boleh berupa **JSON seed/mock di client**; admin panel boleh tetap mock kecuali user eksplisit minta backend penuh — **konfirmasi dulu sebelum membangun backend nyata**. Interface di bawah ini adalah kontrak data permanen — Rebuild Mode tidak boleh mengubah bentuk data, hanya boleh mengubah cara data ini divisualisasikan.

```typescript
interface District {
  id: string;
  nama: string;
  tipe: "Kota" | "Kabupaten";
  umk: number;
  coworkingCount: number;
  internetMbps: number;
  ringkasanKarakteristik: string;
}

interface Indicator {
  id: "internet" | "cost" | "community" | "environment";
  nama: string;
  arah: "tinggi-baik" | "rendah-baik";
}

interface DistrictScore {
  districtId: string;
  indicatorId: Indicator["id"];
  skor: number; // 0-100
  updatedAt: string; // ISO date
}

interface Persona {
  id: "tech-professional" | "creative-professional" | "student-fresh-graduate" | "digital-nomad";
  nama: string;
}

interface PersonaWeight {
  personaId: Persona["id"];
  indicatorId: Indicator["id"];
  baseWeight: number; // contoh: 0.40
}

interface QuizInput {
  personaId: Persona["id"];           // FR-001
  budget: number;                      // FR-002, 2_000_000 - 6_500_000
  internetPriority: "low" | "medium" | "high" | "ultra";  // FR-003
  communityPriority: "low" | "medium" | "high";            // FR-004
  environmentPreference: "quiet" | "cafe" | "coworking" | "flexible"; // FR-005
}

interface RecommendationResult {
  sessionId: string; // efemeral, tidak persisted di V1
  personaId: Persona["id"];
  input: QuizInput;
  ranked: Array<{
    districtId: string;
    skorTotal: number;
    skorPerIndikator: Record<Indicator["id"], number>;
    kontribusi: Record<Indicator["id"], number>;
  }>;
  whyText: Record<string /* districtId */, string>;
  createdAt: string;
}
```

**Extension 2026-07-06 — Kecamatan (ranking level 2):** ditambahkan `SubDistrict` &
`SubDistrictScore` (relasi ke `District`, skema di `prisma/schema.prisma`) untuk
ranking kecamatan di dalam satu distrik — lihat `src/types/district.ts`,
`src/lib/scoring/rankSubDistricts.ts`, dan RIWAYAT_PENGERJAAN.md (lanjutan 13) untuk
detail & rationale lengkap. Ini aditif murni: interface `District`/`DistrictScore`/
`RecommendationResult` di atas tidak berubah, tidak ada indikator ke-5 (kolom
tambahan dataset kecamatan seperti `Tourism_Score` diperlakukan sebagai data
mentah/tampilan, bukan bobot scoring — sama seperti `umk`/`coworkingCount` di
level distrik).

---

## 8. MVP Scope — Batas Tegas (MoSCoW Discipline) [PERMANEN]

### ✅ V1 (sedang dibangun)
Landing, Quiz (4 persona + 4 sinyal input termasuk Community Priority), Algorithm Explanation, Recommendation Engine, Result Page, Why This Match, District Detail + Snapshot, Admin (Login/Dashboard/Data Management/Audit Log). Mobile-responsive, Bahasa Indonesia, tanpa akun pengguna.

### ❌ Eksplisit DI LUAR scope V1 — jangan bangun kecuali user konfirmasi sadar pindah ke V2/V3
- Login/registrasi pengguna, Save Result, History, Favorites (→ V2)
- Compare District, District Visualization (radar/bar chart), Interactive Map/Google Maps API (→ V2)
- Email notification (→ V2)
- AI Assisted Recommendation, chatbot, Generative AI apa pun (→ V3)
- Accommodation/Coworking Recommendation, forum, review/rating, chat, social media integration (→ V3)
- Mobile app native, multi-language, push notification (→ V3)

Kalau sebuah task tampak menyentuh salah satu item di atas, **berhenti dan konfirmasi ke user** dulu. Ini berlaku di kedua Operating Mode — Complete UI Rebuild Mode mengubah *tampilan*, bukan *scope fitur*.

---

## 9. Tech Stack [PERMANEN — framework, FLEKSIBEL — pilihan library visual]

```
Next.js 15 (App Router) + React 19 + TypeScript (strict mode)
Tailwind CSS v4
shadcn/ui
```

**Keputusan terkunci (permanen, kedua mode):** Pakai **Next.js 15 App Router**, bukan React + Vite + React Router. Routing ditangani oleh `app/` directory Next.js. State quiz tetap client-side (`"use client"` + `useState`/Context) karena semua kalkulasi bersifat efemeral. Tidak ada SSR/SSG untuk halaman publik di V1 — semua page bisa dirender sebagai Client Components. Tailwind v4 dan shadcn/ui sebagai fondasi styling juga permanen (mengganti keduanya = migrasi framework, bukan redesign visual — butuh konfirmasi eksplisit user).

**Fleksibel (default V1, boleh diganti di Rebuild Mode):**
- **Icon library** — V1 pakai `lucide-react`. Ini pilihan default, bukan kuncian permanen. Skill desain (`design-taste-frontend`) merekomendasikan Phosphor/Hugeicons/Radix Icons/Tabler sebagai alternatif yang kurang "terasa AI-generated". Kalau Complete UI Rebuild Mode aktif dan skill merekomendasikan ganti icon library, boleh diikuti — asalkan satu library dipakai konsisten di seluruh app (jangan campur 2 icon set).
- **Font Google Fonts spesifik** — lihat §10, ini 100% default, bukan permanen.

---

## 10. Design System — DEFAULT V1 (Normal Mode Only) [DEFAULT]

**PENTING:** Seluruh section ini adalah keputusan visual V1 saat ini — bukan aturan permanen. Berlaku sebagai default selama Normal Development Mode (§0.1). **Begitu Complete UI Rebuild Mode aktif (§0.2), seluruh isi §10 ini boleh diabaikan total** dan digantikan sepenuhnya oleh arah baru dari skill desain (§1.2), kecuali user eksplisit minta elemen tertentu dipertahankan.

Brief awal V1: alat keputusan berbasis data (DSS), bukan brand konsumer. Audiens melek digital (freelancer/nomad), terbiasa produk SaaS modern. Pekerjaan utama UI: mengubah data mentah jadi keputusan dipahami < 60 detik — **visualisasi skor & bobot adalah produknya, bukan dekorasi**. Prinsip "visualisasi skor & bobot adalah inti produk" ini sendiri sebaiknya tetap dipegang bahkan setelah rebuild (karena ini soal *fungsi* UI, bukan gaya), tapi *bagaimana* visualisasi itu dibuat 100% bebas.

### 10.1 Riwayat identitas visual (histori, bukan acuan wajib)

Project ini sudah melalui beberapa iterasi identitas visual dalam pengembangan V1:
1. **"Field Notes dari Lapangan"** — hijau sawah/pesisir/genteng, Fraunces + Inter + JetBrains Mono.
2. **"Data-Dense Dashboard"** — biru + amber, Fira Sans + Fira Code.
3. **"Terracotta + Slate"** — terracotta + slate netral, Space Grotesk + Space Mono.

Riwayat ini dicatat supaya Claude tahu konteks evolusi desain, **bukan berarti iterasi terbaru otomatis jadi acuan wajib**. Kalau tidak ada instruksi lain, **cek langsung ke `src/app/globals.css`** untuk tahu token warna & font yang sedang benar-benar aktif di kode — jangan asumsikan dari daftar di atas, karena bisa saja sudah berubah lagi setelah dokumen ini ditulis.

### 10.2 Cara kerja token (tetap berlaku strukturnya, isinya default)

Warna didefinisikan sebagai CSS variables di `globals.css` (Tailwind v4 CSS-based config), dengan pola nama semantik (`--ink`, `--paper`, `--sawah`/primary, `--pesisir`/accent, `--genteng`/tersier, `--line`/border, `--warning`, `--error`, dst). **Pola penamaan token semantik ini sendiri boleh dipertahankan** (memudahkan maintenance), tapi **nilai hex di baliknya 100% default** — Rebuild Mode bebas mengganti seluruh nilai token, mengganti nama token, atau mendesain ulang sistem token dari nol.

Aturan semantik yang **tetap disarankan dipertahankan** (soal kejelasan komunikasi ke user, bukan soal estetika — lihat §12.1):
- Warna "warning" dan warna "error" harus tetap dua warna yang berbeda dan tidak saling tertukar maknanya.
- Kontras teks vs background tetap harus lulus WCAG AA.

### 10.3 Tipografi (default, sepenuhnya fleksibel)

V1 memakai pola 3 peran: **Display** (headline besar), **Body/UI** (teks umum), **Data/Mono** (angka skor, bobot %, UMK). Pola 3-peran ini (bukan font spesifiknya) cukup berguna dipertahankan karena produk ini data-heavy dan angka perlu terasa "terukur" — tapi font spesifik yang dipilih untuk tiap peran 100% bebas ditentukan ulang oleh skill desain saat Rebuild Mode.

### 10.4 Layout & signature element (default, sepenuhnya fleksibel)

V1 pernah punya beberapa keputusan layout: border-radius konsisten, spacing mengikuti Tailwind scale, container max-width per halaman, shadow tipis untuk kartu, dan satu "signature element" (bar bobot indikator yang hidup, dipakai di Algorithm Explanation & Result). Semua ini **contoh implementasi V1, bukan wajib**. Rebuild Mode boleh:
- Mengubah radius/spacing/shadow scale sepenuhnya.
- Mengganti atau menghapus signature element lama, atau membuat signature element baru yang berbeda.
- Mendesain ulang container width, grid system, breakpoint strategy.

Yang tetap disarankan (prinsip fungsional, bukan gaya): kalau ada elemen visual yang jadi "identitas" halaman (signature element), pertahankan konsistensi elemen itu di seluruh halaman yang relevan — jangan taruh secara acak/dekoratif di tempat yang tidak fungsional (mis. Landing Page kalau elemen itu sejatinya representasi bobot quiz).

---

## 11. Layout & Komponen per Halaman [CAMPURAN — functional requirement permanen, spesifikasi visual default]

Setiap sub-section di bawah dipisah dua kolom: **Yang harus ada (permanen, fungsional)** vs **Tampilan saat ini (default V1, boleh diganti total di Rebuild Mode)**.

### 11.1 Landing (`/`) — FR-000

**Permanen (functional):** Satu CTA utama menuju `/quiz`. Headline harus menyampaikan tesis produk (distrik mana yang cocok untuk kerja) dalam bahasa yang jelas, bukan jargon generik.

**Default V1 (visual, bebas diganti):** Warna CTA, layout hero (split/centered/dsb), copy headline spesifik, ada-tidaknya preview hasil di hero, jumlah & susunan section pendukung (stat strip, preview distrik, algorithm teaser, capability showcase, cara kerja, CTA penutup) — semua ini iterasi desain V1, bukan struktur wajib.

### 11.2 Quiz Step 1 — Input (`/quiz` state 1) — FR-001–005

**Permanen (functional):** Wajib ada 5 kontrol input dalam urutan ini: (1) pilih persona [FR-001, wajib diisi sebelum submit], (2) budget slider Rp 2jt–6,5jt [FR-002], (3) internet priority 4 opsi [FR-003], (4) community priority 3 opsi [FR-004], (5) environment preference 4 opsi [FR-005]. CTA "lanjut ke Step 2" harus disabled/tervalidasi sampai persona terpilih, dengan pesan error inline (bukan toast/modal) kalau user coba submit tanpa persona.

**Default V1 (visual, bebas diganti):** Bentuk komponen tiap input (card grid, pill, dropdown, dsb), ikon per opsi, warna aktif/hover, tata letak vertikal/horizontal, copy label & pertanyaan spesifik, ada-tidaknya pengelompokan visual (card per pertanyaan atau form polos).

### 11.3 Quiz Step 2 — Algorithm Explanation (state internal `/quiz`) — FR-007

**Permanen (functional):** Harus menampilkan bobot 4 indikator yang sudah disesuaikan input user, dan formula/contoh perhitungan dengan angka asli dari sesi user (bukan placeholder statis). CTA lanjut ke `/result`.

**Default V1 (visual, bebas diganti):** Bentuk visualisasi bobot (bar chart horizontal atau bentuk lain), styling formula, layout keseluruhan step ini.

### 11.4 Result (`/result`) — FR-008, FR-009, FR-012

**Permanen (functional):** Tampilkan 5 distrik terurut skor desc. Distrik rank 1 harus punya penanda visual "Best Match" yang jelas berbeda dari rank lainnya (FR-009). Tiap kartu distrik menampilkan skor total + skor 4 indikator + minimal 1 data mentah relevan (UMK/coworking/internet). Kalau budget di bawah UMK distrik, harus ada penanda itu. Komponen `WhyThisMatch` (2 kontribusi tertinggi + trade-off, FR-012) wajib ada di kartu Best Match minimal, dan bisa diakses untuk distrik lain. Kalau semua distrik dikecualikan (data invalid), tampilkan Empty State yang menjelaskan kenapa dan apa langkah selanjutnya (bukan halaman kosong).

**Default V1 (visual, bebas diganti):** Bentuk kartu (expandable/flat/tab), warna badge Best Match, mini-chart per indikator, sidebar perbandingan skor, ada-tidaknya fitur compare/dialog, semua styling visual.

**Extension 2026-07-06:** subtitle kecil "Area terbaik: {kecamatan}" di kartu Best
Match & tiap kartu ranking, dihitung dari `rankSubDistricts` — lihat RIWAYAT_PENGERJAAN.md
lanjutan 13.

### 11.5 District Detail (`/district/:id`) — FR-011

**Permanen (functional):** District Snapshot wajib menampilkan minimal 6 aspek: Internet Quality, Rentang Biaya Kost, Estimasi Biaya Hidup, Aktivitas Komunitas, Best For Persona, Ringkasan Karakteristik. `WhyThisMatch` di-reuse dari komponen yang sama dipakai di Result (§6). Wajib ada cara kembali ke Result.

**Extension 2026-07-06:** section tambahan "Kecamatan Terbaik di {distrik}" — ranking
level 2 (5 kecamatan di dalam distrik ini), formula sama persis dengan ranking
distrik (`rankSubDistricts`, reuse `computeAdjustedWeights`/`computeDistrictScore`).
Detail & rationale di RIWAYAT_PENGERJAAN.md lanjutan 13.

**Default V1 (visual, bebas diganti):** Layout grid snapshot (2/3 kolom), ada-tidaknya hero image/gradient, ikon representatif tiap aspek, styling tombol kembali.

### 11.6 Admin (`/admin/*`) — FR-A01–A05

**Permanen (functional):** Login wajib sebelum akses dashboard/data/audit. Input indikator wajib divalidasi 0–100 dengan feedback real-time (sebelum submit, bukan cuma saat submit). Audit log harus mencatat perubahan data (nilai lama, nilai baru, siapa, kapan). Data yang berumur >7 hari harus punya penanda visual yang berbeda dari data segar (soal kejelasan informasi, bukan soal warna spesifik).

**Default V1 (visual, bebas diganti):** Styling tabel, warna badge "data lama", bentuk form input, komponen toast konfirmasi — semua bebas, termasuk mengganti dari tabel ke card list kalau itu pilihan desain yang lebih baik selama datanya tetap sama-sama scannable.

**Extension 2026-07-06:** `/admin/data` — tiap kartu distrik dapat section
"Kecamatan" collapsible (5 form skor per distrik, validasi & audit log sama persis
polanya dengan distrik). `/admin/audit` & Dashboard menampilkan label "Kec. {nama}
({distrik})" untuk entri kecamatan.

---

## 12. UI States & Error Handling [CAMPURAN]

### 12.1 Trigger & perilaku (permanen — WAJIB ada mekanismenya, terlepas dari visualnya)

| State | Trigger | Perilaku wajib |
|---|---|---|
| Loading hasil | "See Results" → render `/result` | Harus ada indikasi loading yang meniru bentuk konten asli (bukan blank screen) |
| Error koneksi | Gagal load hasil | Harus ada pesan jelas + tombol retry |
| Distrik data invalid/0 | Indikator belum diisi admin | Distrik itu dikecualikan dari ranking, dengan catatan alasan yang terlihat user |
| Semua distrik dikecualikan | Semua data invalid/>7 hari | Empty state informatif, bukan halaman kosong/error generik |
| Budget di bawah UMK | Hasil scoring | Harus ada penanda yang terlihat pada kartu relevan |
| Data >7 hari (admin) | Timestamp kedaluwarsa | Harus ada label peringatan yang terlihat di tabel/list |
| Skor seri | 2+ distrik skor identik | Tiebreaker UMK terendah otomatis (§5.4), hanya 1 badge Best Match yang tampil |
| Validasi gagal (quiz) | Persona belum dipilih saat submit | Error inline dekat elemen terkait (bukan toast/modal), tombol submit non-aktif sampai valid |
| Validasi gagal (admin form) | Input bukan angka 0–100 | Error real-time per-field, sebelum submit |
| Admin akses ditolak | Role bukan admin | Halaman ditolak akses yang jelas (403 atau setara) |
| Layar sempit (<360px) | Breakpoint sempit | Layout tetap single-column, seluruh kontrol tetap bisa disentuh (≥44px, NFR02) |

### 12.2 Kode visual saat ini (default V1, bebas diganti)

V1 memakai konvensi: kuning/amber untuk peringatan informatif (data lampau, budget di bawah UMK), merah untuk error yang menghentikan alur (koneksi putus, validasi gagal, akses ditolak). **Prinsip pemisahan dua kategori ini** (peringatan informatif ≠ error yang memblokir) sebaiknya dipertahankan di desain apa pun karena ini soal kejelasan komunikasi ke user, bukan soal selera warna — tapi **hex/warna spesifik yang dipakai untuk mewakili tiap kategori 100% bebas diganti**, asal kedua kategori itu tetap punya representasi visual yang jelas berbeda satu sama lain dan tidak mengandalkan warna saja (sertakan ikon/teks, prinsip aksesibilitas).

---

## 13. Voice & Microcopy [CAMPURAN]

**Permanen:** Semua copy UI berbahasa Indonesia (kebutuhan audiens produk ini). Nada harus langsung & membantu, bukan formal-birokratis maupun playful berlebihan — aktif, spesifik, jujur saat gagal/kosong.

**Default V1 (contoh kalimat, bebas ditulis ulang):**

| Konteks | Jangan | Contoh V1 (boleh diganti kalimatnya) |
|---|---|---|
| CTA utama | "Submit" / "Lanjutkan" | "Mulai", "Lihat Hasil", "Cari Distrik Terbaik" |
| Error validasi persona | "Error: field required" | "Pilih dulu profil freelancer Anda" |
| Empty state | "Tidak ada data" | "Data semua wilayah sedang diperbarui, silakan coba lagi nanti" |
| Konfirmasi admin | "Success" | "Data [nama distrik] berhasil diperbarui" |
| Label warning | "Warning!" | "Budget di bawah UMK" / "Data diperbarui lebih dari 7 hari lalu" |

Kalau Rebuild Mode mengganti identitas visual, copy contoh di atas boleh ditulis ulang total selama tetap: Bahasa Indonesia, aktif, spesifik, dan tidak melanggar prinsip di §12.1 (state harus tetap jelas maknanya).

---

## 14. Struktur Folder [PERMANEN]

```
freelance-city-index/
├── CLAUDE.md
├── docs/                              # salinan PRD final + 5 dok pendukung (reference, read-only)
│   ├── PRD_Revised_v2.1.docx
│   ├── Dokumen_Pendukung_1_DSS_Methodology.md
│   ├── Dokumen_Pendukung_2_Validation_Risk.md
│   ├── Dokumen_Pendukung_3_Future_Roadmap.md
│   ├── Dokumen_Pendukung_4_IA_DataModel.md
│   └── Dokumen_Pendukung_5_Competitive_Positioning.md
├── public/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── layout.tsx                 # root layout (font import, metadata)
│   │   ├── page.tsx                   # Landing Page (/)  FR-000
│   │   ├── quiz/
│   │   │   └── page.tsx               # Quiz Page (/quiz) — Step 1 & Step 2 via state FR-001–007
│   │   ├── result/
│   │   │   └── page.tsx               # Result Page (/result)  FR-008, FR-009
│   │   ├── district/
│   │   │   └── [id]/
│   │   │       └── page.tsx           # District Detail (/district/:id)  FR-011
│   │   └── admin/
│   │       ├── login/
│   │       │   └── page.tsx           # Admin Login (/admin/login)  FR-A01
│   │       ├── page.tsx               # Admin Dashboard (/admin)  FR-A02
│   │       ├── data/
│   │       │   └── page.tsx           # Data Management (/admin/data)  FR-A03, FR-A05
│   │       └── audit/
│   │           └── page.tsx           # Audit Log (/admin/audit)  FR-A04
│   ├── components/
│   │   ├── ui/                        # shadcn/ui generated components
│   │   ├── shared/
│   │   │   └── WhyThisMatch.tsx       # reused di Result & District Detail
│   │   └── quiz/                      # komponen khusus Quiz
│   │       ├── PersonaCardSelector.tsx
│   │       ├── BudgetSlider.tsx
│   │       ├── InternetPrioritySelect.tsx
│   │       ├── CommunityPrioritySelect.tsx   # FR-004
│   │       ├── EnvironmentPreferenceSelect.tsx
│   │       ├── WeightBarChart.tsx            # signature element V1 — nama file boleh tetap walau visualnya diganti total
│   │       └── FormulaExample.tsx
│   ├── lib/
│   │   ├── scoring/
│   │   │   ├── weights.ts             # PersonaWeight base table (16 rows)
│   │   │   ├── normalize.ts           # adjustment + renormalisasi
│   │   │   ├── score.ts               # Skor_distrik calculation
│   │   │   ├── rank.ts                # ranking + tiebreaker UMK
│   │   │   ├── rankSubDistricts.ts    # ranking level 2: kecamatan di dalam 1 distrik (2026-07-06)
│   │   │   └── whyThisMatch.ts        # top-2 kontribusi generator
│   │   ├── utils.ts                   # shadcn cn() helper
│   │   └── validation/adminInput.ts   # validasi 0-100, FR-A05
│   ├── data/districts.seed.json       # 5 distrik × 4 indikator, mock/seed V1
│   ├── types/
│   │   ├── district.ts
│   │   ├── persona.ts
│   │   ├── quiz.ts
│   │   └── recommendation.ts
│   └── hooks/
│       ├── useQuizState.ts
│       └── useScoring.ts
├── styles/globals.css                 # Tailwind v4 CSS-based config + design tokens (§10 — isi token DEFAULT, struktur file PERMANEN)
├── next.config.ts
├── tsconfig.json
└── package.json
```

**Catatan Next.js App Router (permanen):**
- Semua page yang butuh state/interaktivitas wajib `"use client"` di baris pertama.
- `app/layout.tsx` = tempat import font (Google Fonts atau self-hosted) — font spesifik yang di-import boleh berubah (§9/§10.3), tapi lokasi importnya tetap di sini.
- Quiz Step 2 (Algorithm Explanation) = **state internal** di `app/quiz/page.tsx`, bukan route `/quiz/algorithm` terpisah (sesuai keputusan arsitektur §6).
- `lib/scoring/` = pure functions, tidak ada DOM/React/`"use client"` di dalamnya.
- `data/districts.seed.json` = satu-satunya sumber data V1 — jangan bangun API route Next.js kecuali diminta eksplisit.
- Nama file komponen visual (mis. `WeightBarChart.tsx`) boleh tetap dipertahankan namanya walau isinya didesain ulang total saat Rebuild Mode, supaya import path & referensi kode lain tidak ikut berubah. Kalau signature element diganti konsepnya secara fundamental (bukan cuma gaya), rename file boleh dilakukan — update semua importnya sekaligus.

---

## 15. Aturan Coding [PERMANEN — kecuali disebutkan lain]

1. TypeScript strict — tidak ada `any` tanpa justifikasi eksplisit dalam komentar.
2. Scoring engine = pure functions, tidak ada `Math.random()` atau timestamp non-deterministik di dalam kalkulasi.
3. State quiz & hasil di React state/context, **tidak** di localStorage/sessionStorage — selaras "efemeral di V1, tanpa akun" (§2).
4. Semua angka indikator divalidasi 0–100 sebelum disimpan/dipakai (FR-A05) — satu fungsi validasi terpusat, jangan duplikasi logic.
5. Copy UI berbahasa Indonesia (§13), termasuk error & empty state.
6. Istilah "distrik" konsisten di semua UI copy & nama variabel/komponen user-facing.
7. Cek primitif shadcn/ui dulu sebelum membuat komponen custom dari nol.
8. Touch target ≥44px mobile (NFR02); `aria-label` jelas pada kontrol non-teks; visible focus ring (jangan `outline-none` tanpa pengganti); hormati `prefers-reduced-motion`.
9. **[DEFAULT]** Warna error/warning ikut prinsip §12.1 (jangan tukar makna kuning↔merah) — hex spesifiknya bebas mengikuti token aktif yang didefinisikan di `globals.css` saat itu.
10. Komponen yang dipakai >1 halaman (`WhyThisMatch`, `EmptyState`, badge) taruh di `components/shared/`, jangan diduplikasi di `app/`.
11. Commit/PR scope kecil — satu FR atau satu komponen per perubahan jika memungkinkan, agar mudah direview terhadap Acceptance Criteria (Dok 2 §7). Pengecualian: task Complete UI Rebuild Mode boleh menyentuh banyak file sekaligus karena sifatnya memang menyeluruh — sebutkan di commit message bahwa ini rebuild visual, bukan berarti tiap file punya FR yang berbeda-beda.

---

## 16. Checklist Sebelum Build Komponen Baru [Mode-aware]

Checklist ini berlaku beda tergantung Operating Mode yang aktif (§0):

**Kalau Normal Development Mode (default):**
1. Apakah perubahan ini masih tergolong perbaikan kecil, atau sudah termasuk redesign besar? Kalau ragu, tanya user dulu sebelum lanjut.
2. Sudah cek shadcn/ui primitif yang sesuai (`Slider`, `Button`, `Card`, `Badge`, `Toast`, `Table`)?
3. Warna yang dipakai konsisten dengan token yang **sedang aktif** di `globals.css` — bukan token dari riwayat desain lama (§10.1)?
4. Kalau menampilkan skor/bobot/UMK — sudah pakai font mono yang sedang aktif (§10.3)?
5. Kalau ini state error/warning/empty — sudah dicek ke §12.1 untuk trigger yang benar dan §12.2 untuk kode visual yang sedang aktif?
6. Kalau komponen dipakai >1 halaman — ditaruh di `components/shared/`, bukan diduplikasi?
7. Responsive dari mobile (<360px) ke atas — bukan desktop-first lalu di-squeeze?
8. Nomor FR yang dirujuk di komentar/commit sudah sesuai tabel §4?

**Kalau Complete UI Rebuild Mode aktif:**
1. Sudah panggil skill desain yang relevan (§1.2) untuk menentukan arah visual baru sebelum mulai coding?
2. Sudah pastikan semua item **[PERMANEN]** di §2–§9, §14–§15 tidak tersentuh (algoritma, routing, data model, auth, validasi)?
3. Sudah cek daftar functional requirement per halaman di §11 kolom "Yang harus ada" — supaya redesign tidak sengaja menghilangkan fitur?
4. Desain baru tidak wajib mirip desain sebelumnya — jangan menganggap warna/font lama sebagai jangkar kecuali user eksplisit minta dipertahankan (§0.2).
5. Setelah desain baru selesai, update §10 (dan §10.1 riwayat identitas visual) supaya dokumen ini tetap jadi source-of-truth yang akurat.

---

## 17. Hal yang Wajib Ditanyakan ke User Sebelum Asumsi

- Apakah backend/API sungguhan dibutuhkan untuk admin panel V1, atau cukup mock/JSON-based untuk keperluan akademik/demo?
- Apakah `/algorithm` perlu jadi route URL terpisah (deep-link-able) atau cukup state di `/quiz` (default arsitektur §6)?
- Kalau permintaan user ambigu antara "perbaikan UI kecil" dan "redesign total" — tanyakan mode mana yang dimaksud (§0) sebelum mulai kerja.

---

## 18. Referensi Dokumen Sumber

| Dokumen | Isi |
|---|---|
| `docs/PRD_Revised_v2.1.docx` | Problem statement, objectives, success metrics, scope, FR (§4 di sini), workflow |
| `docs/Dokumen_Pendukung_1_DSS_Methodology.md` | Definisi indikator, bobot persona, recommendation logic, Why This Match logic, contoh perhitungan, spesifikasi UI per sinyal |
| `docs/Dokumen_Pendukung_2_Validation_Risk.md` | NFR, assumptions, limitations, risk assessment, user testing plan, acceptance criteria, UI States |
| `docs/Dokumen_Pendukung_3_Future_Roadmap.md` | Roadmap V1/V2/V3, scope mapping out-of-scope |
| `docs/Dokumen_Pendukung_4_IA_DataModel.md` | Sitemap, route inventory, user flow, data flow, entity preparation, District Snapshot, Component Inventory |
| `docs/Dokumen_Pendukung_5_Competitive_Positioning.md` | Competitive positioning vs Google/ChatGPT |

Saat ragu soal detail produk, cek dokumen sumber dulu, terutama scoring logic (Dok 1) dan acceptance criteria (Dok 2), sebelum mengasumsikan. Saat ragu soal detail visual, cek langsung ke `globals.css` dan komponen aktif di kode — dokumen ini mencatat riwayat & prinsip, bukan snapshot pasti dari tampilan yang sedang berjalan.
