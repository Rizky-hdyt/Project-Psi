# GSD — Freelance City Index: Yogyakarta Edition (MVP V1)

**Format:** Discuss → Plan → Execute → Verify → Ship
**Lingkup:** Seluruh MVP V1 (FR-000 s/d FR-A05, lihat CLAUDE.md §3)
**Sumber kebenaran:** `PRD_Revised_v2.1.docx` (requirement) + 5 Dokumen Pendukung (metodologi/risiko/roadmap/IA/positioning) + `CLAUDE.md` (arsitektur & desain implementasi)
**Status dokumen ini:** Living document — update tiap kali keputusan baru dikunci atau tahap berpindah.

---

## 1. DISCUSS

Tahap ini mengunci **keputusan produk & asumsi** sebelum task di-breakdown jadi plan. Apa pun yang belum dikunci di sini akan jadi sumber asumsi liar saat eksekusi — jangan lompat ke Plan kalau ada baris "OPEN" di bawah.

### 1.1 Apa yang sedang dibangun

DSS (Decision Support System) — bukan chatbot, bukan direktori, bukan platform booking. Output: ranking 5 distrik DIY (Kota Yogyakarta, Sleman, Bantul, Gunungkidul, Kulon Progo) berdasarkan weighted scoring 4 indikator (Internet, Cost of Living, Community, Environment) yang dipersonalisasi lewat 4 persona + 4 sinyal input quiz.

**Tiga nilai inti yang tidak boleh dilanggar keputusan teknis apa pun** (CLAUDE.md §1):
1. Transparent Recommendation — bobot & kontribusi selalu terlihat (Algorithm step, Why This Match).
2. Deterministik — input sama → output sama. Tidak ada `Math.random()`, tidak ada AI/LLM di V1.
3. No accounts in V1 — semua state quiz/hasil efemeral (in-memory/React state), kecuali Admin yang punya auth.

### 1.2 Keputusan yang sudah dikunci (hasil sesi ini)

| # | Keputusan | Status | Catatan |
|---|---|---|---|
| D1 | Lingkup GSD = seluruh MVP V1 (semua FR §3 CLAUDE.md) | 🔒 Locked | Bukan per-modul |
| D2 | Admin panel (Login, Data Management, Audit Log) = **UI dulu, mock/JSON di client** | 🔒 Locked (sementara) | **Belum backend sungguhan.** Ini eksplisit ditandai "sementara" — lihat 1.4 Open Question OQ-1 untuk kapan ini perlu direvisit |
| D3 | Route `/algorithm` = **state internal di `/quiz`**, bukan route URL terpisah | 🔒 Locked | Sesuai default Dok. Pendukung 4 §2 & CLAUDE.md §5 — tidak deep-link-able, konsisten dengan dokumen sumber |
| D4 | Output GSD = file markdown sebagai panduan kerja | 🔒 Locked | File ini |

### 1.3 Asumsi yang diwarisi dari dokumen sumber (sudah final di level produk)

Asumsi ini **bukan** untuk didiskusikan ulang di sini — sudah dikunci di PRD/Dok Pendukung. Dicatat agar Plan/Execute tidak menabraknya:

- Data BPS, APJII, direktori coworking tersedia publik & dapat diakses mingguan (Dok 2 §2).
- Community & Environment dikonversi 0–100 via rubrik + minimal 2 penilai (inter-rater) — proses ini di luar scope kode, tapi field-nya harus ada di data model.
- UMK DIY 2026 dipakai sebagai acuan tiebreaker & flag "di bawah UMK" (Kota 2,83jt — Gunungkidul 2,33jt, PRD §4.2).
- Data 5 distrik × 4 indikator = `data/districts.seed.json`, satu-satunya sumber data V1 (CLAUDE.md §13).
- Tim 4 orang part-time, hosting & DB tier gratis, deadline 1 semester (PRD §4.2) — relevan untuk skala scope per-sprint di Plan.

### 1.4 Open Questions — wajib dijawab sebelum tahap terkait dieksekusi

| ID | Pertanyaan | Kapan harus dijawab | Default kalau tidak dijawab |
|---|---|---|---|
| OQ-1 | Admin panel pindah dari mock ke backend sungguhan — kapan & pakai stack apa? | Sebelum mulai Execute Fase 5 (Admin) jika backend dibutuhkan | Tetap mock/JSON, admin panel = UI-only demo |
| OQ-2 | Apakah rubrik konversi Community/Environment (inter-rater) sudah difinalkan tim non-teknis? | Sebelum seed data final diisi (Dok 1 §3) | Pakai data placeholder yang jelas ditandai "contoh", bukan data asli |
| OQ-3 | Apakah perlu user testing round (Dok 2 §6) dijadwalkan sebelum atau sesudah kode MVP selesai? | Sebelum tahap Verify produk (bukan verify kode) | Asumsikan setelah kode MVP selesai (sesuai urutan dokumen) |

> **Aturan:** kalau saat Plan/Execute ketemu keputusan baru yang belum ada di §1.2 atau §1.4, **berhenti dan tambahkan ke tabel ini dulu** sebelum lanjut — jangan diam-diam diasumsikan.

---

## 2. PLAN

Breakdown FR (CLAUDE.md §3) jadi fase kerja berurutan. Tiap fase = unit kerja yang bisa di-Execute → Verify → Ship secara independen sebelum lanjut ke fase berikutnya (selaras CLAUDE.md §14.11: "Commit/PR scope kecil — satu FR atau satu komponen per perubahan").

### 2.1 Urutan fase (dependency-driven, bukan sekadar nomor FR)

```
Fase 0: Project Setup
  └─> Fase 1: Design Tokens & Shared Components
        └─> Fase 2: Scoring Engine (lib/scoring/*, pure functions)
              ├─> Fase 3: Quiz Flow (Step 1 + Step 2)
              │     └─> Fase 4: Result + District Detail
              └─> Fase 5: Admin (Login, Dashboard, Data Management, Audit Log) — UI/mock
                    └─> Fase 6: Cross-cutting polish (a11y, responsive, error states)
                          └─> Fase 7: Integration pass & demo readiness
```

**Kenapa Scoring Engine duluan, sebelum Quiz UI?** Karena scoring engine adalah pure function tanpa dependency UI, dan Result Page tidak bisa diuji tanpa dia. Dok 1 §9 sudah menyediakan unit test reference case (Tech Professional/High/Medium/Cafe → Sleman 79.2) — ini dipakai sebagai test pertama sebelum UI apa pun disambungkan.

### 2.2 Detail per fase

#### Fase 0 — Project Setup
- Inisialisasi React 19 + Vite + TypeScript (strict) + Tailwind v4 + shadcn/ui + React Router (CLAUDE.md §8).
- Buat struktur folder persis sesuai CLAUDE.md §13.
- `globals.css` dengan CSS variables token warna (§9.1) — kosong dulu/placeholder, diisi penuh di Fase 1.
- **Output:** repo boot, `npm run dev` jalan, halaman blank.

#### Fase 1 — Design Tokens & Shared Components
- Panggil skill `frontend-design` dulu (sesuai CLAUDE.md §0 — wajib di awal sesi kerja UI, bukan di akhir).
- Isi `globals.css` penuh: warna (§9.1), tipografi Fraunces/Inter/JetBrains Mono (§9.2), spacing/radius/shadow (§9.3).
- Bangun `components/shared/`: `EmptyState`, badge kuning/merah generik — komponen ini dipakai lintas halaman sehingga harus ada sebelum Fase 3–5 butuh mereka.
- **Output:** style guide hidup — bisa didemokan lewat halaman test sederhana sebelum dipakai di fitur nyata.

#### Fase 2 — Scoring Engine (FR-006, fondasi FR-007/008/009/012)
- `lib/scoring/weights.ts` — base weight table, **16 baris wajib** (4 persona × 4 indikator, termasuk Digital Nomad — item yang CLAUDE.md tandai "sering terlewat").
- `lib/scoring/normalize.ts` — adjustment dari 4 sinyal quiz + renormalisasi (Dok 1 §6).
- `lib/scoring/score.ts` — kalkulasi `Skor_distrik = Σ(nilai_i × bobot_i')`.
- `lib/scoring/rank.ts` — ranking desc + tiebreaker UMK terendah + exclude data invalid/0.
- `lib/scoring/whyThisMatch.ts` — top-2 kontribusi + generate teks (Dok 1 §8).
- **Unit test wajib:** reference case Dok 1 §9 harus match persis (Sleman 79.2, Kota 77.4, Bantul 72.1; bobot' Internet 0.444/Cost 0.214/Community 0.171/Environment 0.171).
- **Output:** fungsi pure, fully testable, tanpa React/DOM — bisa di-Verify sebelum disentuh UI.

#### Fase 3 — Quiz Flow (FR-000, FR-001–005, FR-007, FR-010)
- `LandingPage` (FR-000): hero + CTA "Mulai".
- `QuizPage` orchestrator + `Step1Input` (FR-001–005): `PersonaCardSelector`, `BudgetSlider`, `InternetPrioritySelect`, `CommunityPrioritySelect`, `EnvironmentPreferenceSelect`.
- Validasi: CTA "Find My Best Region" disabled sampai persona dipilih; `InlineValidationError` (CLAUDE.md §10).
- `Step2AlgorithmExplanation` (FR-007): `WeightBarChart` signature element (§9.4) + `FormulaExample` dengan angka asli sesi user.
- FR-010 (real-time recompute tanpa reload): pasang sejak awal di state management, bukan ditempel belakangan.
- **Output:** alur Landing → Quiz Step 1 → Step 2 jalan penuh, scoring tersambung ke Fase 2, belum render Result.

#### Fase 4 — Result + District Detail (FR-008, FR-009, FR-011, FR-012)
- `ResultPage`: 5 `DistrictRankCard` terurut skor desc, `BestMatchBadge` di rank 1.
- `WhyThisMatch` (taruh di `components/shared/` sejak awal — dipakai 2 tempat, jangan duplikasi).
- `DistrictDetailPage` + `DistrictSnapshot` (6 elemen fact-card, Dok 4 §6).
- Edge cases dari Dok 2 §8 / PRD §6.1: data invalid dikecualikan, semua dikecualikan → `EmptyState`, budget di bawah UMK → label kuning, skor seri → tiebreaker.
- **Output:** alur penuh Landing → Quiz → Result → District Detail → kembali, sesuai user flow CLAUDE.md §5.

#### Fase 5 — Admin (FR-A01–A05) — UI/mock dulu (sesuai D2)
- `AdminLoginPage`, `AdminDashboardPage` (`DistrictSummaryTable` + `StaleDataWarningBadge`), `DataManagementPage` (`IndicatorInputForm` validasi inline 0–100), `AuditLogPage`.
- **Eksplisit:** data tersimpan ke state mock/JSON in-memory, bukan database sungguhan. UI harus tetap berperilaku seperti produk nyata (toast konfirmasi, audit log tercatat di state) — tapi tidak ada backend di belakangnya.
- Catat di kode (komentar) bagian mana yang nanti perlu diganti kalau OQ-1 dijawab "ya, backend sungguhan".
- **Output:** admin panel bisa didemokan end-to-end secara visual, dengan pemahaman eksplisit bahwa ini bukan implementasi produksi.

#### Fase 6 — Cross-cutting polish
- A11y: `aria-label`, focus ring, `prefers-reduced-motion`, touch target ≥44px (CLAUDE.md §14.8).
- Responsive sweep dari <360px ke atas (mobile-first, bukan desktop-first di-squeeze).
- Voice/microcopy check terhadap tabel CLAUDE.md §12.

#### Fase 7 — Integration pass & demo readiness
- Jalankan seluruh Acceptance Criteria Dok 2 §7 sebagai checklist manual.
- Jalankan seluruh UI States Dok 2 §8 / CLAUDE.md §11 sebagai checklist manual.
- Siapkan demo path untuk sidang/presentasi.

### 2.3 Yang sengaja TIDAK masuk Plan ini (out-of-scope V1)

Sesuai CLAUDE.md §7 — kalau muncul godaan menambah ini saat Execute, **stop dan konfirmasi ke user dulu**, jangan diam-diam dikerjakan:
- Login/registrasi pengguna, Save Result, History, Favorites → V2
- Compare District, District Visualization (radar/bar), Interactive Map/Google Maps API → V2
- Email notification → V2
- AI Assisted Recommendation, chatbot, Generative AI apa pun → V3
- Accommodation/Coworking Recommendation, forum, review/rating, chat, social media integration → V3
- Mobile app native, multi-language, push notification → V3

---

## 3. EXECUTE

Aturan eksekusi per fase (berlaku untuk semua Fase 0–7 di atas):

1. **Checklist sebelum mulai komponen baru** — pakai persis CLAUDE.md §15 (8 poin: frontend-design dipanggil?, shadcn primitif dicek?, token warna §9.1?, font mono untuk skor/bobot/UMK?, treatment warna error/warning sesuai §11?, komponen shared ditaruh benar?, mobile-first?, nomor FR di commit sesuai §3?).
2. **Satu FR atau satu komponen per unit kerja** — scope kecil, mudah di-Verify terhadap Acceptance Criteria spesifik (CLAUDE.md §14.11).
3. **Scoring engine = zero DOM/React, zero randomness** — pelanggaran ini langsung gagal Verify, tidak perlu nunggu review (CLAUDE.md §14.2).
4. **Stop-and-ask triggers** selama Execute:
   - Menyentuh salah satu item out-of-scope §2.3 di atas.
   - Perlu menjawab OQ-1/OQ-2/OQ-3 sebelum bisa lanjut.
   - Nomor FR yang dirujuk tidak ada di tabel CLAUDE.md §3 (kemungkinan pakai nomor draft lama).

*(Detail teknis tiap komponen — props, state shape, file path — dieksekusi langsung di kode saat fase berjalan, bukan ditulis di sini agar dokumen ini tidak basi duluan sebelum kode ada.)*

---

## 4. VERIFY

Verifikasi dua lapis: **kode** (tiap fase) dan **produk** (lintas fase, sebelum Ship).

### 4.1 Verify per fase (kode)

| Fase | Kriteria lulus |
|---|---|
| 0 | `npm run dev` jalan tanpa error, struktur folder cocok CLAUDE.md §13 |
| 1 | Token warna/font terlihat di style guide test page, tidak ada warna di luar §9.1 dipakai |
| 2 | Unit test reference case Dok 1 §9 **match persis** angka (Sleman 79.2/Kota 77.4/Bantul 72.1); 16 baris weight table lengkap termasuk Digital Nomad |
| 3 | FR-010 nyata: ubah input di Step 1 setelah balik dari Step 2/Result → skor update tanpa reload halaman |
| 4 | Edge cases Dok 2 §8 teruji manual: data invalid dikecualikan, semua dikecualikan → empty state, skor seri → 1 badge Best Match saja |
| 5 | Validasi 0–100 admin form real-time (sebelum submit, bukan sesudah); audit log tercatat di state mock setiap simpan |
| 6 | Lighthouse a11y check kasar + manual keyboard nav; test di breakpoint 359px |
| 7 | Seluruh tabel Acceptance Criteria Dok 2 §7 dicentang satu-satu |

### 4.2 Verify produk (sebelum Ship, lintas fase)

- Apakah 3 nilai inti (§1.1) masih utuh di implementasi akhir — terutama "Deterministik" (cek tidak ada `Math.random()`/timestamp di jalur kalkulasi) dan "No accounts in V1" (cek tidak ada localStorage/sessionStorage dipakai untuk state quiz, sesuai CLAUDE.md §14.3)?
- Apakah istilah "distrik" konsisten di semua UI copy (bukan "wilayah/Kabupaten-Kota" yang bocor dari dokumen teknis)?
- Apakah 4 nama persona baku dipakai persis (bukan "Developer"/"Creator"/dst — CLAUDE.md §2)?
- OQ-3: apakah user testing round (Dok 2 §6, target completion ≥70%, relevance ≥70%) perlu dijalankan sebelum dianggap "selesai", atau cukup demo internal?

---

## 5. SHIP

- **Definisi "shipped" untuk konteks akademik ini:** kode MVP V1 lengkap (Fase 0–7 lulus Verify) + siap didemokan untuk sidang/presentasi — **bukan** deploy produksi publik dengan data real.
- Sebelum tag sebagai shipped, pastikan OQ-1 dan OQ-2 di §1.4 sudah punya jawaban (boleh jawabannya "tetap default", tapi harus sadar, bukan terlewat).
- Hosting: Vercel/Netlify tier gratis (PRD §4.2) — admin panel di-deploy dengan pemahaman eksplisit bahwa datanya mock (sesuai D2), jangan sampai terkesan sebagai sistem produksi nyata ke penguji.
- Setelah ship MVP V1, item di luar scope (§2.3) dirujuk balik ke Dok. Pendukung 3 (Roadmap V2/V3) — bukan ditambahkan diam-diam ke V1.

---

## Lampiran — Peta Rujukan Cepat

| Butuh tahu... | Cek dokumen |
|---|---|
| Nomor FR yang benar | CLAUDE.md §3 |
| Formula scoring & contoh angka | Dokumen Pendukung 1 §4, §9 |
| Acceptance Criteria per fitur | Dokumen Pendukung 2 §7 |
| UI State & warna error/warning | Dokumen Pendukung 2 §8, CLAUDE.md §9.1/§11 |
| Out-of-scope → versi berapa | Dokumen Pendukung 3 |
| Route & component inventory | Dokumen Pendukung 4 §2, §7 |
| Kenapa produk ini beda dari Google/ChatGPT (untuk bagian pitching/sidang) | Dokumen Pendukung 5 |
