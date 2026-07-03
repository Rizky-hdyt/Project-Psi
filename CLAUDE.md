# CLAUDE.md — Freelance City Index: Yogyakarta Edition

Project memory permanen untuk Claude Code. Baca file ini secara penuh sebelum mengerjakan task apa pun di repo ini. File ini adalah satu-satunya source-of-truth arsitektur & desain untuk implementasi — PRD dan 5 dokumen pendukung adalah source-of-truth *produk/requirement*.

---

## 0. Skill yang Terinstall — Wajib Dipanggil Sesuai Konteks

Skill berikut sudah terinstall di Claude Code untuk project ini. **Jangan membuat keputusan yang seharusnya dijawab skill tanpa memanggilnya dulu.**

### Skill inti (dipakai hampir setiap task)

| Skill | Kapan dipanggil | Apa yang dicegahnya kalau dilewati |
|---|---|---|
| **`frontend-design`** | Setiap kali membuat komponen UI baru, halaman baru, atau mengubah keputusan visual (warna, tipografi, layout, copy). Panggil di awal sesi kerja UI, bukan di akhir sebagai "polish". | Hasil jadi template generik (cream+serif, dark+neon, atau broadsheet hairline — 3 default yang harus dihindari secara sadar untuk brief ini). |
| **`tailwind-v4-shadcn`** | Setiap kali menulis className, mengonfigurasi tema/CSS variables, atau generate komponen shadcn baru. | Salah pakai konvensi Tailwind v3 (mis. `tailwind.config.js` JS-based) padahal v4 pakai CSS-based config; komponen shadcn ter-generate dengan setup yang tidak cocok. |
| **`vercel-react-best-practices`** | Setiap kali menyusun struktur komponen, data fetching, code-splitting, atau menyiapkan build untuk deploy. | Pola React yang tidak idiomatic untuk Next.js 15/React 19 modern, struktur file yang sulit di-maintain, perf issue yang baru ketahuan saat deploy. |
| **`find-skills`** | Saat menghadapi task yang terasa butuh skill spesifik tapi tidak yakin yang mana (mis. testing, accessibility audit, animasi kompleks). Panggil sebelum mengasumsikan "tidak ada skill yang cocok". | Reinventing the wheel untuk hal yang sebenarnya sudah ada panduannya. |

### Skill desain UI/UX tambahan (pilih sesuai jenis task, jangan panggil semuanya sekaligus)

| Skill | Kapan dipanggil | Catatan pemakaian di project ini |
|---|---|---|
| **`ui-ux-pro-max`** | Task desain yang butuh referensi sistematis: pilih style/palet/font pairing, guideline UX spesifik (form, table, chart, accessibility), atau review UI terhadap best practice. | Palet & tipografi project sudah dikunci di §9 — pakai skill ini untuk guideline UX & pola komponen, **bukan** untuk mengganti token warna/font yang sudah baku. |
| **`impeccable`** | Audit/polish UI yang sudah ada: hierarchy, spacing, interaction states, micro-interactions, error/empty states, responsive behavior. | Cocok untuk pass "rapikan" setelah fitur jadi — mis. konsistensi states di tabel §11. |
| **`design-taste-frontend`** | Redesign halaman atau landing page ketika hasil terasa templated/AI-generated dan butuh arah desain yang lebih kuat. | Overlap dengan `frontend-design` — pakai salah satu per sesi, jangan dua-duanya. |
| **`redesign-existing-projects`** | Upgrade menyeluruh halaman existing tanpa merombak fungsionalitas (audit dulu, baru apply). | Wajib tetap patuh token §9.1–9.4; hasil audit yang menyarankan ganti palet global = tolak. |
| **`image-to-code`** | Mengimplementasikan UI dari gambar/screenshot referensi (mis. folder `Referensi ui/`). | Referensi = acuan pola layout, bukan copy verbatim — konten & warna tetap ikut CLAUDE.md. |

**Urutan kerja yang disarankan untuk task UI baru:** `find-skills` (kalau ragu) → `frontend-design` **atau** `design-taste-frontend` (tentukan arah visual/copy) → `tailwind-v4-shadcn` (implementasi styling) → `vercel-react-best-practices` (struktur & performa) → build → `impeccable` (polish pass, opsional).

**Aturan konflik:** semua skill desain di atas bersifat *advisory*. Kalau saran skill bertentangan dengan token desain §9 (warna, font, radius) atau aturan §11 (states/error), **CLAUDE.md menang** — skill hanya boleh memperkaya, bukan mengganti keputusan yang sudah dikunci.

---

## 1. Apa Produk Ini

**Freelance City Index: Yogyakarta Edition** adalah **Decision Support System (DSS)** — bukan chatbot, bukan direktori, bukan platform booking. Outputnya adalah *ranking distrik beralasan* berbasis weighted scoring yang transparan dan reproducible, untuk membantu freelancer/remote worker memilih distrik kerja terbaik di antara 5 Kabupaten/Kota DIY: **Kota Yogyakarta, Sleman, Bantul, Gunungkidul, Kulon Progo**.

Istilah resmi di UI/copy/kode: **"distrik"** (sesuai PRD). Dokumen pendukung teknis kadang memakai "wilayah/Kabupaten-Kota" — keduanya entitas yang sama, tapi **kode dan UI selalu pakai "distrik"**.

### Nilai inti produk (tidak boleh dilanggar oleh keputusan teknis apa pun)
1. **Transparent Recommendation** — setiap rekomendasi harus bisa dijelaskan (bobot terlihat di Algorithm step, Why This Match menunjukkan kontribusi).
2. **Deterministik** — input sama harus selalu menghasilkan output sama. Tidak ada randomness, tidak ada LLM/AI di V1, tidak ada hasil yang berubah tanpa perubahan input.
3. **No accounts in V1** — tidak ada login pengguna, tidak ada Save Result/History. Semua state quiz & hasil bersifat **efemeral/sesi** (in-memory client-side), kecuali sisi Admin yang memang punya auth.

---

## 2. Empat Persona (baku — gunakan persis nama ini di mana pun)

1. **Tech Professional**
2. **Creative Professional**
3. **Student & Fresh Graduate**
4. **Digital Nomad**

❌ Jangan pernah pakai nama lama: "Developer", "Creator", "Student" (tanpa "& Fresh Graduate"). Kalau ditemukan di kode/copy lama, itu bug — ganti ke 4 nama baku di atas.

---

## 3. Functional Requirements — Peta Nomor FR Final (v1.1)

PRD sudah direvisi: Community Priority disisipkan sebagai **FR-004** (bukan suffix "b"), dan FR sesudahnya bergeser. **Pakai tabel ini sebagai rujukan nomor FR yang benar** — jangan pakai nomor dari draft lama mana pun.

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

## 4. DSS Methodology — Wajib Dipatuhi Scoring Engine

Detail lengkap & contoh numerik: `docs/Dokumen_Pendukung_1_DSS_Methodology.md`.

### 4.1 Empat indikator (skala 0–100)
| Indikator | Arah |
|---|---|
| Internet | tinggi = baik |
| Cost of Living | **biaya rendah = skor tinggi** (dibalik) |
| Community | tinggi = baik |
| Environment | tinggi = baik (kebisingan dibalik) |

### 4.2 Bobot dasar per persona (Internet / Cost / Community / Environment)
| Persona | Internet | Cost | Community | Environment |
|---|:--:|:--:|:--:|:--:|
| Tech Professional | 40% | 25% | 20% | 15% |
| Creative Professional | 20% | 25% | 25% | 30% |
| Student & Fresh Graduate | 20% | 45% | 20% | 15% |
| Digital Nomad | 30% | 25% | 25% | 20% |

`Weight` table = 4 persona × 4 indikator = **16 baris wajib**, termasuk Digital Nomad (sering terlewat).

### 4.3 Empat sinyal input quiz (urutan tampil = urutan FR)
1. **Budget** (FR-002) → sinyal afordabilitas (flag "di bawah UMK") + **tiebreaker**, BUKAN bobot indikator langsung.
2. **Internet Priority** (FR-003): Low ×0.7 / Medium ×1.0 / High ×1.3 / Ultra ×1.6
3. **Community Priority** (FR-004): Low ×0.7 / Medium ×1.0 / High ×1.3
4. **Environment Preference** (FR-005): Quiet/Cafe/Coworking/Flexible → delta ±5 ke skor Environment saja (tidak menambah Community — hindari double counting)

### 4.4 Alur kalkulasi (deterministik)
```
base_weight(persona) → terapkan adjustment dari 4 sinyal → renormalisasi (Σ bobot' = 1)
→ Skor_distrik = Σ(nilai_indikator_i × bobot_i') untuk tiap distrik valid
→ kecualikan distrik dengan data invalid/0
→ urutkan skor desc → tiebreaker: UMK terendah menang jika skor seri
→ rank 1 = Best Match (FR-009)
→ Why This Match (FR-012): ambil 2 kontribusi tertinggi (nilai_i × bobot_i'), generate teks trade-off
```

**Unit test reference case** (dari Dok 1 §9, harus match persis): Tech Professional, Internet High, Community Medium, Environment Cafe →
- bobot': Internet 0.444, Cost 0.214, Community 0.171, Environment 0.171
- Sleman = 79.2 (Best Match), Kota Yogyakarta = 77.4, Bantul = 72.1

### 4.5 Kapan kalkulasi & real-time update terjadi
- Quiz Step 1 (FR-001–005): isi input, **belum ada kalkulasi skor**.
- "Find My Best Region" ditekan → trigger FR-006 → tampil Step 2 (FR-007: bobot + formula).
- "See Results" → render `/result` (FR-008).
- Kalau user kembali ke Step 1 dan ubah input setelah hasil tampil → skor update tanpa reload (FR-010, client-side recompute).

---

## 5. Information Architecture & Routing

Detail lengkap: `docs/Dokumen_Pendukung_4_IA_DataModel.md`.

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

"Why This Match" adalah **komponen** (`WhyThisMatch`), dirender di `/result` (kartu Best Match + saat distrik diklik) dan `/district/:id` — reuse satu komponen, jangan duplikasi.

### User flow inti
```
Landing → "Mulai" → Quiz Step 1 → validasi (persona wajib) → "Find My Best Region"
  → Step 2 Algorithm → "See Results" → hitung skor 5 distrik
  → semua distrik invalid? → Empty State
  → Result (ranking + Best Match + Why This Match)
  → klik distrik → District Detail + Snapshot → kembali → Result
  → "Try Again" → reset ke Step 1 tanpa reload
```

---

## 6. Data Model (acuan types/interfaces — bukan skema backend penuh di V1)

V1 = MVP akademik, hosting/DB tier gratis. Data 5 distrik × 4 indikator boleh berupa **JSON seed/mock di client**; admin panel boleh tetap mock kecuali user eksplisit minta backend penuh — **konfirmasi dulu sebelum membangun backend nyata.**

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

---

## 7. MVP Scope — Batas Tegas (MoSCoW Discipline)

### ✅ V1 (sedang dibangun)
Landing, Quiz (4 persona + 4 sinyal input termasuk Community Priority), Algorithm Explanation, Recommendation Engine, Result Page, Why This Match, District Detail + Snapshot, Admin (Login/Dashboard/Data Management/Audit Log). Mobile-responsive, Bahasa Indonesia, tanpa akun pengguna.

### ❌ Eksplisit DI LUAR scope V1 — jangan bangun kecuali user konfirmasi sadar pindah ke V2/V3
- Login/registrasi pengguna, Save Result, History, Favorites (→ V2)
- Compare District, District Visualization (radar/bar chart), Interactive Map/Google Maps API (→ V2)
- Email notification (→ V2)
- AI Assisted Recommendation, chatbot, Generative AI apa pun (→ V3)
- Accommodation/Coworking Recommendation, forum, review/rating, chat, social media integration (→ V3)
- Mobile app native, multi-language, push notification (→ V3)

Kalau sebuah task tampak menyentuh salah satu item di atas, **berhenti dan konfirmasi ke user** dulu.

---

## 8. Tech Stack

```
Next.js 15 (App Router) + React 19 + TypeScript (strict mode)
Tailwind CSS v4
shadcn/ui
Lucide Icons
```

**Keputusan terkunci:** Pakai **Next.js 15 App Router**, bukan React + Vite + React Router. Routing ditangani oleh `app/` directory Next.js. State quiz tetap client-side (`"use client"` + `useState`/Context) karena semua kalkulasi bersifat efemeral. Tidak ada SSR/SSG untuk halaman publik di V1 — semua page bisa dirender sebagai Client Components.

---

## 9. Arah & Token Desain

Brief: ini alat keputusan berbasis data (DSS), bukan brand konsumer. Audiens melek digital (freelancer/nomad), terbiasa produk SaaS modern. Pekerjaan utama UI: mengubah data mentah jadi keputusan dipahami < 60 detik — **visualisasi skor & bobot adalah produknya, bukan dekorasi**.

Arah yang dipilih — **"Field Notes dari Lapangan"**: nuansa peta kerja & instrumen ukur, bukan batik dekoratif generik. Warna diambil dari kondisi nyata DIY (hijau sawah/pegunungan utara, biru pesisir selatan, terracotta genteng kota) diterjemahkan jadi palet fungsional modern. Sengaja menghindari 3 pola default AI-generated: (1) cream+serif+terracotta lifestyle-magazine, (2) dark+neon-accent gaming/crypto, (3) broadsheet hairline tanpa radius yang terlalu dingin.

### 9.1 Warna (CSS variables di `globals.css`, Tailwind v4 CSS-based config)

| Token | Hex | Peran |
|---|---|---|
| `--color-ink` | `#1C2521` | Teks utama — hijau-hitam hangat, bukan `#000` |
| `--color-paper` | `#F7F5EF` | Background utama — putih gading, bukan `#FFF` |
| `--color-sawah` | `#2F6F4E` | Aksen primer — CTA, indikator positif, Best Match |
| `--color-pesisir` | `#1F5C73` | Aksen sekunder — data/chart, link |
| `--color-genteng` | `#B5562F` | Aksen tersier — **sangat terbatas**, signature element saja, BUKAN untuk error |
| `--color-line` | `#D8D3C4` | Border/divider |
| `--color-warning` | `#B8860B` | Label kuning: data >7 hari, budget di bawah UMK |
| `--color-warning-bg` | `#FBF3DA` | Background chip warning |
| `--color-error` | `#B3261E` | Error sesungguhnya: koneksi putus, validasi gagal, akses ditolak |
| `--color-error-bg` | `#FBEAE9` | Background pesan error |

**Aturan warna tegas:** kuning = peringatan informatif (data lampau, budget rendah). Merah = error yang menghentikan alur. Jangan tukar keduanya, dan jangan pakai `--color-genteng` untuk error (itu warna brand, bukan status).

### 9.2 Tipografi

| Peran | Font | Pemakaian |
|---|---|---|
| Display | **Fraunces** (700 untuk headline) | Hero Landing, angka skor besar di Result |
| Body/UI | **Inter** | Semua teks UI, label, form, tabel |
| Data/Mono | **JetBrains Mono** atau **IBM Plex Mono** | **Khusus** angka skor (0–100), bobot (%), UMK — menegaskan kesan "terukur" |

Skala (`rem`, base 16px): `text-xs 0.75` / `text-sm 0.875` / `text-base 1` / `text-lg 1.125` / `text-xl 1.5` / `text-2xl 2` / `text-3xl 2.75`.

### 9.3 Layout
- Border-radius: `0.5rem` (kartu/tombol), `9999px` (badge/chip/pill).
- Spacing: default Tailwind v4 scale, jangan custom — konsisten dengan shadcn/ui.
- Container: max `1120px` (Quiz/Result), max `680px` (form admin).
- Shadow kartu: tipis (`0 1px 2px rgba(28,37,33,0.06), 0 1px 3px rgba(28,37,33,0.08)`) — tenang, bukan dramatis.

### 9.4 Signature element
**Bar bobot indikator yang "hidup"** di Algorithm Explanation (FR-007) dan Result Page: 4 bar horizontal tipis (Internet/Cost/Community/Environment), bar terisi `--color-sawah`, track kosong `--color-line`, angka bobot dalam font mono di ujung bar, beranimasi halus (200–300ms ease-out) saat bobot berubah akibat input user. Ini elemen visual identitas produk — **jangan duplikasi secara dekoratif** di tempat yang tidak relevan (mis. Landing Page).

---

## 10. Layout & Komponen per Halaman

### Landing (`/`) — FR-000
Hero = tesis produk: headline langsung sebut masalah nyata ("Distrik mana di Yogyakarta paling cocok untuk kerjamu?"), bukan jargon. Satu CTA "Mulai" (`--color-sawah`, radius 8px, target ≥44px). Hindari hero image stok cafe/laptop generik.

### Quiz Step 1 — Input (`/quiz` state 1) — FR-001–005
Urutan vertikal, mobile-first:
1. `PersonaCardSelector` — 4 kartu (grid 2x2 mobile / 4x1 desktop). Terpilih: border 2px `--color-sawah` + tint 8%.
2. `BudgetSlider` — shadcn `Slider`, nilai terpilih besar di atas dalam font mono ("Rp 4.000.000").
3. `InternetPrioritySelect` — 4 pill (Low/Medium/High/Ultra), aktif = fill `--color-pesisir`.
4. `CommunityPrioritySelect` — 3 pill (Low/Medium/High), **pola visual identik** dengan Internet Priority (menegaskan simetri logika §4.3).
5. `EnvironmentPreferenceSelect` — grid 2x2, ikon Lucide per opsi (`Volume1`, `Coffee`, `Building2`, `Shuffle`).
6. CTA "Find My Best Region" — disabled sampai persona terpilih; kalau user coba submit tanpa persona → `InlineValidationError` merah muncul tepat di bawah `PersonaCardSelector` ("Pilih dulu profil freelancer Anda"), bukan toast/modal.

### Quiz Step 2 — Algorithm Explanation (state internal `/quiz`) — FR-007
4 `WeightBarChart` (signature element §9.4) + `FormulaExample` (satu baris formula angka asli sesi user, font mono). CTA "See Results".

### Result (`/result`) — FR-008, FR-009, FR-012
5 `DistrictRankCard` terurut skor desc. Kartu rank 1: border 2px `--color-sawah`, elevated, `BestMatchBadge` (ikon `Star` + "Best Match"). Kartu rank 2–5: border 1px `--color-line`, tanpa badge, lebih "diam". Tiap kartu: skor total (font mono besar) + 4 mini-bar/chip indikator + nilai mentah (UMK/coworking/internet). `UMKBelowBudgetLabel` chip kuning kalau relevan. `WhyThisMatch`: 2 kontribusi tertinggi sebagai chip/mini-bar + paragraf naratif + baris trade-off (visual lebih muted). `EmptyState` (semua distrik dikecualikan): ikon `MapPinOff`/`RefreshCw`, "Data semua wilayah sedang diperbarui — silakan coba lagi nanti", treatment netral (bukan merah/kuning).

### District Detail (`/district/:id`) — FR-011
`DistrictSnapshot`: 6 elemen (Internet Quality, Rentang Biaya Kost, Estimasi Biaya Hidup, Aktivitas Komunitas, Best For Persona, Ringkasan Karakteristik) sebagai grid fact-card (2 kolom mobile / 3 kolom desktop), ikon Lucide representatif (`Wifi`, `Home`, `Wallet`, `Users`, `Award`, `MapPin`). `WhyThisMatch` di-reuse dari Result (props district berbeda). `BackToResultButton` (`ArrowLeft` + "Kembali ke hasil").

### Admin (`/admin/*`) — FR-A01–A05
Visual lebih utilitarian — tabel dominan, dekorasi minim (menandakan ini tooling internal). `DistrictSummaryTable`/`AuditLogTable` pakai shadcn `Table`; baris data >7 hari diberi background `--color-warning-bg` selebar baris. `IndicatorInputForm`: 4 input 0–100, validasi inline real-time (border merah + pesan saat nilai di luar rentang, tanpa tunggu submit). `SaveConfirmationToast`: toast hijau singkat, tidak memblokir alur.

---

## 11. UI States & Error Handling

| State | Trigger | Tampilan | Warna |
|---|---|---|---|
| Loading hasil | "See Results" → render `/result` | Skeleton loading meniru layout asli (5 skeleton card), bukan spinner generik | Netral |
| Error koneksi | Gagal load hasil | "Koneksi terputus. Coba lagi?" + tombol retry | Merah (`--color-error`) |
| Distrik data invalid/0 | Indikator belum diisi admin | Dikecualikan dari ranking + catatan "[Nama Distrik] data sedang diperbarui" | Netral/abu |
| Semua distrik dikecualikan | Semua data invalid/>7 hari | Empty state informatif (§10 Result) | Netral |
| Budget di bawah UMK | Hasil scoring | Label "Budget di bawah UMK" pada kartu relevan | Kuning (`--color-warning`) |
| Data >7 hari (admin) | Timestamp kedaluwarsa | Label peringatan di tabel | Kuning |
| Skor seri | 2+ distrik skor identik | Tiebreaker UMK terendah otomatis, hanya 1 badge Best Match | — |
| Validasi gagal (quiz) | Persona belum dipilih saat submit | Error inline dekat elemen terkait, tombol non-aktif | Merah, inline |
| Validasi gagal (admin form) | Input bukan angka 0–100 | Error merah per-field real-time | Merah, inline |
| Admin akses ditolak | Role bukan admin | Halaman 403 sederhana | — |
| Layar <360px | Breakpoint sempit | Single-column, touch target ≥44px | — |

**Prinsip:** kuning = peringatan informatif, merah = error sesungguhnya. Jangan tertukar — ini menjaga transparansi (FR-007/FR-012) supaya peringatan tidak terasa seperti kegagalan sistem.

---

## 12. Voice & Microcopy

Bahasa Indonesia, nada langsung & membantu — bukan formal-birokratis, bukan playful berlebihan. Aktif, spesifik, jujur saat gagal/kosong.

| Konteks | Jangan | Pakai |
|---|---|---|
| CTA utama | "Submit" / "Lanjutkan" | "Mulai", "Lihat Hasil", "Cari Distrik Terbaik" |
| Error validasi persona | "Error: field required" | "Pilih dulu profil freelancer Anda" |
| Empty state | "Tidak ada data" | "Data semua wilayah sedang diperbarui — silakan coba lagi nanti" |
| Konfirmasi admin | "Success" | "Data [nama distrik] berhasil diperbarui" |
| Label warning | "Warning!" | "Budget di bawah UMK" / "Data diperbarui >7 hari lalu" |

---

## 13. Struktur Folder

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
│   │       ├── WeightBarChart.tsx            # signature element §9.4
│   │       └── FormulaExample.tsx
│   ├── lib/
│   │   ├── scoring/
│   │   │   ├── weights.ts             # PersonaWeight base table (16 rows)
│   │   │   ├── normalize.ts           # adjustment + renormalisasi
│   │   │   ├── score.ts               # Skor_distrik calculation
│   │   │   ├── rank.ts                # ranking + tiebreaker UMK
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
├── styles/globals.css                 # Tailwind v4 CSS-based config + design tokens §9
├── next.config.ts
├── tsconfig.json
└── package.json
```

**Catatan Next.js App Router:**
- Semua page yang butuh state/interaktivitas wajib `"use client"` di baris pertama.
- `app/layout.tsx` = tempat import Google Fonts (Fraunces, Inter, JetBrains Mono).
- Quiz Step 2 (Algorithm Explanation) = **state internal** di `app/quiz/page.tsx`, bukan route `/quiz/algorithm` terpisah (sesuai keputusan arsitektur §5).
- `lib/scoring/` = pure functions, tidak ada DOM/React/`"use client"` di dalamnya.
- `data/districts.seed.json` = satu-satunya sumber data V1 — jangan bangun API route Next.js kecuali diminta eksplisit.

---

## 14. Aturan Coding

1. TypeScript strict — tidak ada `any` tanpa justifikasi eksplisit dalam komentar.
2. Scoring engine = pure functions, tidak ada `Math.random()` atau timestamp non-deterministik di dalam kalkulasi.
3. State quiz & hasil di React state/context, **tidak** di localStorage/sessionStorage — selaras "efemeral di V1, tanpa akun" (§1).
4. Semua angka indikator divalidasi 0–100 sebelum disimpan/dipakai (FR-A05) — satu fungsi validasi terpusat, jangan duplikasi logic.
5. Copy UI berbahasa Indonesia (§12), termasuk error & empty state.
6. Istilah "distrik" konsisten di semua UI copy & nama variabel/komponen user-facing.
7. Cek primitif shadcn/ui dulu sebelum membuat komponen custom dari nol.
8. Touch target ≥44px mobile (NFR02); `aria-label` jelas pada kontrol non-teks; visible focus ring (jangan `outline-none` tanpa pengganti); hormati `prefers-reduced-motion`.
9. Warna error/warning ikut §9.1/§11 — jangan tukar kuning↔merah, jangan pakai `--color-genteng` untuk error.
10. Komponen yang dipakai >1 halaman (`WhyThisMatch`, `EmptyState`, badge) taruh di `components/shared/`, jangan diduplikasi di `app/`.
11. Commit/PR scope kecil — satu FR atau satu komponen per perubahan jika memungkinkan, agar mudah direview terhadap Acceptance Criteria (Dok 2 §7).

---

## 15. Checklist Sebelum Build Komponen Baru

1. Sudah panggil `frontend-design` kalau ini keputusan visual baru?
2. Sudah cek shadcn/ui primitif yang sesuai (`Slider`, `Button`, `Card`, `Badge`, `Toast`, `Table`)?
3. Warna yang dipakai dari token §9.1 — bukan warna Tailwind default di luar daftar itu?
4. Kalau menampilkan skor/bobot/UMK — sudah pakai font mono (§9.2)?
5. Kalau ini state error/warning/empty — sudah dicek ke tabel §11 untuk treatment warna yang benar?
6. Kalau komponen dipakai >1 halaman — ditaruh di `components/shared/`, bukan diduplikasi?
7. Responsive dari mobile (<360px) ke atas — bukan desktop-first lalu di-squeeze?
8. Nomor FR yang dirujuk di komentar/commit sudah sesuai tabel §3 (bukan nomor draft lama)?

---

## 16. Hal yang Wajib Ditanyakan ke User Sebelum Asumsi

- Apakah backend/API sungguhan dibutuhkan untuk admin panel V1, atau cukup mock/JSON-based untuk keperluan akademik/demo?
- Apakah `/algorithm` perlu jadi route URL terpisah (deep-link-able) atau cukup state di `/quiz` (default arsitektur §5)?

---

## 17. Referensi Dokumen Sumber

| Dokumen | Isi |
|---|---|
| `docs/PRD_Revised_v2.1.docx` | Problem statement, objectives, success metrics, scope, FR (§3 di sini), workflow |
| `docs/Dokumen_Pendukung_1_DSS_Methodology.md` | Definisi indikator, bobot persona, recommendation logic, Why This Match logic, contoh perhitungan, spesifikasi UI per sinyal |
| `docs/Dokumen_Pendukung_2_Validation_Risk.md` | NFR, assumptions, limitations, risk assessment, user testing plan, acceptance criteria, UI States |
| `docs/Dokumen_Pendukung_3_Future_Roadmap.md` | Roadmap V1/V2/V3, scope mapping out-of-scope |
| `docs/Dokumen_Pendukung_4_IA_DataModel.md` | Sitemap, route inventory, user flow, data flow, entity preparation, District Snapshot, Component Inventory |
| `docs/Dokumen_Pendukung_5_Competitive_Positioning.md` | Competitive positioning vs Google/ChatGPT |

Saat ragu soal detail produk, cek dokumen sumber dulu — terutama scoring logic (Dok 1) dan acceptance criteria (Dok 2) — sebelum mengasumsikan.
