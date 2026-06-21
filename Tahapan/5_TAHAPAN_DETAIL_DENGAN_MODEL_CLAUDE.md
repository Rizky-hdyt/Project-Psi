# 5 Tahapan DISCUSS-PLAN-EXECUTE-VERIFY-SHIP — Detail & Rekomendasi Model Claude

Format: Per tahapan → sub-fase → deliverable → model Claude recommended

---

## TAHAPAN 1: DISCUSS (Hari 1)

Tujuan: Kunci keputusan produk, asumsi, scope, dan open questions.

### 1.1 Sub-fase: Alignment Produk & Requirement

**Aktivitas:**
- Review PRD + 5 Dokumen Pendukung + CLAUDE.md bersama tim (atau dalam hati kalau solo).
- Identifikasi 3 nilai inti produk (Transparent/Deterministik/No Accounts).
- List keputusan yang sudah final (dari sesi ini: D1/D2/D3 di GSD) vs yang masih open (OQ-1/2/3).

**Deliverable:**
- Dokumen keputusan terkunci (sudah ada: GSD §1.2 Discuss).
- List open questions dengan target kapan harus dijawab (GSD §1.4).

**Rekomendasi Model:** `Claude 3.5 Sonnet`
- Tugas: validasi logika keputusan, cek konsistensi dokumen, highlight contradictions kalau ada.
- Kenapa Sonnet: tidak butuh kode, cukup pemahaman dokumen & logical reasoning.

**Durasi:** 1–2 jam

---

### 1.2 Sub-fase: Inventory Functional Requirements (FR)

**Aktivitas:**
- Pemetaan FR (CLAUDE.md §3) ke halaman/komponen yang harus dibangun.
- Setiap FR dicek Acceptance Criteria-nya (Dok 2 §7) & edge case-nya (Dok 2 §8).
- Buat checklist FR yang akan di-Verify later.

**Deliverable:**
- Tabel FR mapping ke routes/components (sudah ada sebagian di CLAUDE.md §5 & §13, diperluas).
- Acceptance Criteria checklist printable (format: FR ID | Kriteria lulus | Bagaimana ditest).

**Rekomendasi Model:** `Claude 3.5 Sonnet`
- Tugas: organize requirement jadi struktur yang mudah dicek (bukan coding, cuma organizing).

**Durasi:** 1 jam

---

### 1.3 Sub-fase: Asumsi Data & Skala

**Aktivitas:**
- Confirm data 5 distrik × 4 indikator: berapa sumber yang authentic vs placeholder untuk MVP?
- Confirm 4 persona + 16 base weight sudah final atau masih iterasi?
- Confirm referensi case (Dok 1 §9): Sleman 79.2 / Kota Yogyakarta 77.4 / Bantul 72.1 — ini yang jadi truth untuk unit test.

**Deliverable:**
- `data/districts.seed.json` template (dengan placeholder jika data sesungguhnya belum ready).
- `lib/scoring/weights.ts` base weight table (16 baris, sudah baku per CLAUDE.md §2).
- Unit test reference case (persis angka Dok 1 §9).

**Rekomendasi Model:** `Claude 3.5 Sonnet`
- Tugas: organize data template, validate terhadap schema yang direncanakan.

**Durasi:** 30–45 menit

---

## TAHAPAN 2: PLAN (Hari 2–3)

Tujuan: Breakdown FR jadi task, urutan fase, estimasi, dan assign ke model/skill yang tepat.

### 2.1 Sub-fase: Task Breakdown per Fase (Fase 0–7)

**Aktivitas:**
- Dari GSD §2, perluas setiap fase jadi task konkret (bukan cuma deskripsi umum).
- Tiap task: file path, komponen, deps, estimated effort (berapakah PR/commit).
- Identify blocking dependencies (mis.: Fase 2 harus selesai sebelum Fase 3 dimulai).

**Deliverable:**
- Task list per fase dalam format markdown atau spreadsheet.
  ```
  Fase 0 — Project Setup
    □ Task 0.1: React 19 + Vite + TypeScript init
      - File: vite.config.ts, tsconfig.json, package.json
      - Deps: none (blocking)
      - Effort: 30 min
      - Model: Sonnet (setup, bukan logic kompleks)
    □ Task 0.2: Folder structure sesuai CLAUDE.md §13
      - File: src/**/*.tsx scaffold (empty files)
      - Deps: Task 0.1
      - Effort: 15 min
      - Model: Sonnet
    □ Task 0.3: Tailwind v4 + globals.css CSS-based config
      - File: tailwind.config.js, globals.css
      - Deps: Task 0.1
      - Effort: 20 min
      - Model: Sonnet (bisa sebut skill `tailwind-v4-shadcn`)
  ... dst
  ```

**Rekomendasi Model:** `Claude 3.5 Sonnet`
- Tugas: organize task logis, identify deps, estimasi realistis (bukan optimistic).

**Durasi:** 2–3 jam

---

### 2.2 Sub-fase: Distribusi Task ke Sprint/Batch

**Aktivitas:**
- Kelompok task jadi batch executable hari ini / minggu depan / dst sesuai tim capacity.
- Setiap batch punya clear entrada (precondition) dan keluaran (deliverable yang bisa di-Verify).
- Catat task mana yang boleh paralel vs harus sequential.

**Deliverable:**
- Sprint plan (atau daily batch kalau tim moving fast).
- Dependency graph (bisa ASCII art atau visual).

**Rekomendasi Model:** `Claude 3.5 Sonnet`
- Tugas: organize timeline, highlight critical path.

**Durasi:** 1 jam

---

### 2.3 Sub-fase: Teknis Design Decisions — Komponen & State Shape

**Aktivitas:**
- Rancang TypeScript interfaces per entitas (District, Indicator, QuizInput, RecommendationResult, dsb) — sudah ada skema di CLAUDE.md §6, diperdalam.
- Rancang React state management strategy (Context? Zustand? Reducer?) untuk quiz state (Step 1 → Step 2 → Result).
- Rancang data flow diagram (Input → Validation → Scoring → Ranking → Render).

**Deliverable:**
- `types/` folder structure dengan interface definitions.
- State management design doc (siapa hold state apa, bagaimana share antar komponen).
- Data flow diagram (bisa ASCII, bisa Mermaid).

**Rekomendasi Model:** `Claude Opus` (untuk Fase ini) atau `Claude 3.5 Sonnet`
- **Model Opus recommended** jika: state management kompleks, banyak edge case, ada optimization yang perlu reasoning mendalam.
- **Model Sonnet OK** jika: state management straightforward (satu Context atau Zustand store, pola baku).

**Durasi:** 1–2 jam (tergantung kompleksitas state)

---

### 2.4 Sub-fase: Design Tokens & UI Specification

**Aktivitas:**
- Detil dari CLAUDE.md §9 (warna, font, spacing, shadow) dituliskan lengkap untuk CSS config.
- Signature element `WeightBarChart` dirancang: props shape, animasi spec, aksesibilitas.
- Komponen shared (`EmptyState`, badge, error states) dirancang sekali, reuse di mana-mana.

**Deliverable:**
- `globals.css` lengkap dengan CSS variables.
- Komponenspec doc: `WeightBarChart.tsx` interface, animation timing, accessibility.
- Shared components list dengan props & usage examples.

**Rekomendasi Model:** `Claude 3.5 Sonnet` (+ skill `frontend-design` dipanggil di Fase Execute nanti, bukan di sini)
- Tugas: translate figma-less design brief (§9 CLAUDE.md) jadi CSS variables dan TypeScript interfaces.

**Durasi:** 1 jam

---

## TAHAPAN 3: EXECUTE (Hari 4–10+)

Tujuan: Kode MVP dari task yang sudah diplan, fase per fase, dengan checkpoint Verify di tiap akhir fase.

### 3.1 Sub-fase: EXECUTE Fase 0 — Project Setup

**Aktivitas:**
- Init React 19 + Vite + TypeScript strict.
- Folder structure scaffold.
- Tailwind v4 CSS-based config + globals.css CSS variables.
- shadcn/ui setup.

**Checkpoint Verify Fase 0:**
- `npm run dev` jalan tanpa error.
- Folder cocok CLAUDE.md §13.
- TypeScript `npx tsc --noEmit` no error.

**Rekomendasi Model:** `Claude 3.5 Sonnet`
- Tugas: standard boilerplate setup.
- Kenapa Sonnet: setup bukan logic kompleks, banyak template.

**Durasi:** 1–1.5 jam (termasuk debug setup)

---

### 3.2 Sub-fase: EXECUTE Fase 1 — Design Tokens & Shared Components

**Aktivitas:**
- Isi `globals.css` dengan token warna (§9.1 CLAUDE.md) — **panggil skill `frontend-design` di sini**.
- Panggil skill `tailwind-v4-shadcn` untuk generate shadcn primitives & custom config.
- Bangun `components/shared/EmptyState.tsx`, badge generik, error/warning states.
- Buat halaman test sederhana untuk showcase design tokens.

**Checkpoint Verify Fase 1:**
- Warna di luar token list tidak ada di kode.
- shadcn primitif terimport dengan benar.
- Design tokens terlihat di test page.
- TypeScript strict no error.

**Rekomendasi Model:** `Claude 3.5 Sonnet`
- Tugas: implement design tokens & shared components sesuai spec dari PLAN.
- Skill calls: `frontend-design` (at start), `tailwind-v4-shadcn` (for primitives).

**Durasi:** 1.5–2 jam

---

### 3.3 Sub-fase: EXECUTE Fase 2 — Scoring Engine (Pure Functions)

**Aktivitas:**
- `lib/scoring/weights.ts`: hardcode 16-baris weight table (4 persona × 4 indikator).
- `lib/scoring/normalize.ts`: implement adjustment dari 4 sinyal input quiz (Dok 1 §6).
- `lib/scoring/score.ts`: implement Skor_distrik = Σ(nilai_i × bobot_i').
- `lib/scoring/rank.ts`: ranking desc + tiebreaker UMK terendah + exclude invalid data.
- `lib/scoring/whyThisMatch.ts`: top-2 kontribusi + generate teks.
- `__tests__/scoring.test.ts`: unit test dengan reference case Dok 1 §9 (Sleman 79.2, Kota 77.4, Bantul 72.1).

**Checkpoint Verify Fase 2:**
- Unit test reference case **match persis** ke angka (79.2/77.4/72.1).
- Zero `Math.random()` atau timestamp non-deterministik di scoring functions.
- 16-baris weight table lengkap (pastikan Digital Nomad ada — item yang CLAUDE.md tandai "sering terlewat").

**Rekomendasi Model:** `Claude Opus` (recommended) atau `Claude 3.5 Sonnet`
- **Model Opus recommended** untuk Fase 2 karena:
  - Math-heavy logic (weighted scoring, normalisasi, tiebreaker).
  - Presisi angka kritis (reference case harus match persis).
  - Edge case handling kompleks (data invalid, tie, semua distrik gugur).
  - Context yang perlu dijaga konsisten dengan Dok 1 logic.
- **Fallback ke Sonnet**: kalau Opus tidak tersedia, Sonnet masih bisa tapi mungkin perlu lebih banyak iterasi verifikasi.

**Durasi:** 2–3 jam (termasuk unit test iteration sampai match persis)

---

### 3.4 Sub-fase: EXECUTE Fase 3 — Quiz Flow (Step 1 + Step 2)

**Aktivitas:**
- `LandingPage.tsx` (FR-000): hero + CTA "Mulai".
- `routes/quiz/QuizPage.tsx` orchestrator dengan step state machine.
- `routes/quiz/steps/Step1Input.tsx` (FR-001–005): persona selector, budget slider, 3 priority selects.
- Validasi: persona wajib sebelum CTA aktif; `InlineValidationError`.
- `routes/quiz/steps/Step2AlgorithmExplanation.tsx` (FR-007): `WeightBarChart` + `FormulaExample` dengan angka asli sesi user.
- Hook `useQuizState()` dan `useScoring()` untuk manage state dan compute bobot on-the-fly.
- FR-010: real-time recompute saat input berubah (tidak perlu reload, state update local).

**Checkpoint Verify Fase 3:**
- Alur Landing → Quiz Step 1 → Step 2 jalan lancar.
- Persona wajib sebelum CTA "Find My Best Region" aktif.
- Bobot di Step 2 berubah sesuai input Step 1 secara real-time.
- Unit test scoring engine yang sudah dijalankan di Fase 2 masih berfungsi saat diintegrasikan ke React state.

**Rekomendasi Model:** `Claude Opus` (recommended) atau `Claude 3.5 Sonnet`
- **Model Opus recommended** untuk Fase 3 karena:
  - State management kompleks (multi-step, kontrol alur).
  - Integrasi scoring engine (pure function) ke React render (side effects).
  - Real-time recompute logic (FR-010) perlu handle batching/debouncing dengan benar.
  - Signature element `WeightBarChart` butuh animation + responsive design thinking.
- **Fallback ke Sonnet**: kalau ragu, start dengan Sonnet, tapi expect iteration lebih banyak di Verify.

**Durasi:** 3–4 jam

---

### 3.5 Sub-fase: EXECUTE Fase 4 — Result Page + District Detail

**Aktivitas:**
- `routes/result/ResultPage.tsx` (FR-008/009): 5 `DistrictRankCard` terurut, `BestMatchBadge` di rank 1.
- `components/shared/WhyThisMatch.tsx` (FR-012): reuse di Result & District Detail, 2 kontribusi tertinggi + teks + trade-off.
- `routes/district-detail/DistrictDetailPage.tsx` (FR-011): `DistrictSnapshot` 6 elemen.
- Edge cases: data invalid dikecualikan, semua dikecualikan → `EmptyState`, budget di bawah UMK → label kuning, skor seri → 1 badge saja.
- Alur: "Try Again" reset ke Step 1 tanpa reload; klik distrik → Detail → kembali → Result.

**Checkpoint Verify Fase 4:**
- Seluruh edge case Dok 2 §8 + PRD §6.1 teruji manual: 
  - Data invalid dikecualikan dari ranking (dengan catatan "sedang diperbarui").
  - Semua dikecualikan → `EmptyState` informatif (ikon + teks, bukan halaman kosong).
  - Skor seri (2+ distrik identical) → tiebreaker UMK terendah, **hanya 1 badge "Best Match"**.
  - Budget di bawah UMK → label kuning (bukan merah) di kartu relevan.
- Alur user flow (Result → Detail → back) lancar.

**Rekomendasi Model:** `Claude 3.5 Sonnet` (Fase ini relatif straightforward setelah Fase 3 siap)
- Tugas: render 5 kartu + handle edge state logic, integrasikan `WhyThisMatch` component.
- Kenapa Sonnet cukup: logic sudah di upstream (Fase 2 scoring, Fase 3 state). Fase 4 lebih banyak styling & conditional render.

**Durasi:** 2–3 jam

---

### 3.6 Sub-fase: EXECUTE Fase 5 — Admin Panel (UI/Mock)

**Aktivitas:**
- `AdminLoginPage.tsx`: form login, validasi password (hard-coded untuk demo, bukan real auth).
- `AdminDashboardPage.tsx` (FR-A02/A03): tabel ringkasan 5 distrik + timestamp + peringatan >7 hari.
- `DataManagementPage.tsx` (FR-A01/A05): form input 4 indikator per distrik, validasi inline 0–100 real-time.
- `AuditLogPage.tsx` (FR-A04): tabel audit log (tanggal, field, nilai lama/baru, admin).
- State mock: data disimpan ke Context/Zustand store in-memory (bukan backend), tapi **UI berperilaku seperti produk nyata** (toast konfirmasi, audit log tercatat).
- Catat di kode: komentar eksplisit mana yang nanti perlu diganti kalau backend sungguhan (sesuai OQ-1).

**Checkpoint Verify Fase 5:**
- Admin dapat login dengan hard-coded kredensial (demo saja).
- Form validasi 0–100 real-time, reject input di luar rentang dengan error merah.
- Audit log tersatat di state mock setiap simpan.
- Timestamp alert kuning muncul kalau data >7 hari.
- Toast konfirmasi muncul saat simpan (UI feedback berasa produksi, tapi datanya mock).

**Rekomendasi Model:** `Claude 3.5 Sonnet`
- Tugas: UI form & table, state management mock.
- Kenapa Sonnet: tidak ada logika kompleks, paling banyak CRUD sederhana & form validation.

**Durasi:** 2–2.5 jam

---

### 3.7 Sub-fase: EXECUTE Fase 6 — Cross-cutting Polish

**Aktivitas:**
- A11y audit: `aria-label`, focus ring visible, `prefers-reduced-motion`, touch target ≥44px (Lighthouse audit).
- Mobile responsive sweep: test <360px breakpoint (Dok 2 NFR02), bukan hanya desktop.
- Voice/microcopy: cek tabel CLAUDE.md §12, replace generic error dengan yang spesifik ("Pilih dulu profil freelancer Anda" vs "Error: field required").
- Error boundary: kalau ada error, jangan crash halaman (graceful fallback).

**Checkpoint Verify Fase 6:**
- Lighthouse a11y score ≥90 (atau di atas minimum yang dapat diterima).
- Manual keyboard nav: Tab melalui seluruh kontrol, fokus terlihat jelas.
- Mobile <360px: layout single-column, tidak ada overflow, touch target ≥44px.

**Rekomendasi Model:** `Claude 3.5 Sonnet`
- Tugas: audit & refactor a11y, test responsive.
- Kenapa Sonnet: polish bukan logic baru, mostly review & tweak.

**Durasi:** 1.5–2 jam

---

### 3.8 Sub-fase: EXECUTE Fase 7 — Integration Pass & Demo Readiness

**Aktivitas:**
- End-to-end flow test: Landing → Quiz Step 1/2 → Result → District Detail → kembali → Try Again → loop.
- Jalankan seluruh Acceptance Criteria Dok 2 §7 sebagai checklist manual (bukan automated test).
- Jalankan seluruh UI States Dok 2 §8 sebagai scenario manual.
- Siapkan demo path: clear URL routes, consistent sample data, no console errors.
- Data validation: 5 distrik × 4 indikator di `districts.seed.json` sesuai schema, UMK baku, coworking count, internet Mbps — jangan mix real dengan placeholder.

**Checkpoint Verify Fase 7:**
- Checklist Acceptance Criteria (semua FR centang).
- Checklist UI States (semua scenario teruji).
- Console: no errors, no warnings yang ignore-able.
- Semua nilai warna dari token list (§9.1), tidak ada hardcode hex.
- 4 nama persona konsisten di semua UI copy.
- Istilah "distrik" bukan "wilayah" di UI.

**Rekomendasi Model:** `Claude 3.5 Sonnet`
- Tugas: checklist & cleanup, bukan new feature.

**Durasi:** 1–1.5 jam

---

## TAHAPAN 4: VERIFY (Hari 10–11)

Tujuan: QA sistematis sebelum Ship — verifikasi kode, verifikasi produk, cek asumsi.

### 4.1 Sub-fase: Verify Kode (Per-Fase)

**Aktivitas:**
- Per-fase test terhadap kriteria yang sudah ditentukan di EXECUTE plan (§3.1–3.8).
- Fokus: unit test scoring engine (Fase 2), integration test alur quiz (Fase 3–4), a11y audit (Fase 6).

**Deliverable:**
- Test report: per-fase, pass/fail, catat bugs atau deviation.

**Rekomendasi Model:** `Claude 3.5 Sonnet` (testing mindset)
- Tugas: trace kode terhadap Acceptance Criteria, catat deviation.
- Tools: manual browser testing + Lighthouse + Chrome DevTools.

**Durasi:** 2–3 jam

---

### 4.2 Sub-fase: Verify Produk (Lintas Fase)

**Aktivitas:**
- Cek 3 nilai inti (§1.1): Transparent (bobot terlihat?) / Deterministik (input sama → output sama?) / No Accounts (tidak ada localStorage/sessionStorage untuk quiz?).
- Cek istilah konsisten: "distrik" di semua UI, "persona" nama tepat (4 nama baku, bukan "Developer" dst).
- Cek data model: 5 distrik × 4 indikator lengkap, 16-baris weight table untuk 4 persona (termasuk Digital Nomad).

**Deliverable:**
- Product verification checklist: semua poin centang.

**Rekomendasi Model:** `Claude 3.5 Sonnet`
- Tugas: trace terhadap dokumen sumber (PRD, Dok 1–5, CLAUDE.md), cek alignment.

**Durasi:** 1 jam

---

### 4.3 Sub-fase: Review Open Questions (OQ-1/2/3)

**Aktivitas:**
- OQ-1: Backend untuk admin? → Keputusan: tetap mock atau mulai backend planning?
- OQ-2: Rubrik Community/Environment final dari tim non-teknis? → Data seed sudah authentic atau placeholder?
- OQ-3: User testing round sebelum atau sesudah MVP? → Jadwal dan logistics.

**Deliverable:**
- Jawaban update untuk GSD §1.4 Open Questions.

**Rekomendasi Model:** `Claude 3.5 Sonnet` (atau team discussion)
- Tugas: facilitate keputusan, catat implikasi teknis setiap opsi.

**Durasi:** 30 min (atau lebih kalau ada diskusi tim)

---

## TAHAPAN 5: SHIP (Hari 12)

Tujuan: Final cleanup, deployment, dokumentasi, handoff.

### 5.1 Sub-fase: Final Checklist & Cleanup

**Aktivitas:**
- Code review: no unused imports, no `console.log`, no commented-out code.
- README.md: setup instruction, `npm run dev`, `npm test`, folder explanation.
- CHANGELOG.md: list FR yang delivered di MVP V1.
- Catat di README: admin panel datanya mock (jangan terkesan produksi), sesuai D2.

**Deliverable:**
- Clean codebase, README lengkap.

**Rekomendasi Model:** `Claude 3.5 Sonnet`
- Tugas: code cleanup & doc generation.

**Durasi:** 30 min

---

### 5.2 Sub-fase: Deployment & Hosting

**Aktivitas:**
- Deploy ke Vercel/Netlify tier gratis (PRD §4.2).
- Set environment variable kalau ada (contoh: API endpoint untuk backend later).
- Test di live URL: Landing → Result → Detail alur jalan.
- Share URL untuk sidang/presentasi.

**Checkpoint:**
- Live URL jalan tanpa error.
- Mobile responsive saat diakses dari phone.

**Rekomendasi Model:** `Claude 3.5 Sonnet`
- Tugas: deployment guide, troubleshoot hosting issue.

**Durasi:** 30 min

---

### 5.3 Sub-fase: Dokumentasi & Handoff

**Aktivitas:**
- Arch doc: flow diagram, state diagram, component tree (bisa ASCII, bisa export dari figma kalau ada).
- Scoring engine doc: formula, contoh kalkulasi sesuai reference case, link ke Dok 1.
- API contract (kalau backend ditambah nanti): endpoint spec, request/response schema.
- Panduan next step: kapan mulai V2, roadmap item mana duluan (Dok 3).

**Deliverable:**
- `/docs` folder lengkap di repo, atau wiki/notion.

**Rekomendasi Model:** `Claude 3.5 Sonnet`
- Tugas: doc generation dari kode & whiteboard.

**Durasi:** 1 jam

---

### 5.4 Sub-fase: Demo Script & Presentasi

**Aktivitas:**
- Tulis scenario demo: akun admin + 4 persona user test.
- Siapkan sample data di `districts.seed.json` yang jelas & representative.
- Tulis slide deck untuk sidang (problem → solution → MVP feature overview → demo walkthrough).

**Deliverable:**
- Demo script (text atau video recording).
- Slide deck (Figma atau Google Slides).

**Rekomendasi Model:** `Claude 3.5 Sonnet`
- Tugas: scenario planning, copy penjelasan.

**Durasi:** 1–2 jam

---

## Ringkasan Model Recommendation per Tahapan

| Tahapan | Sub-fase | Primary Model | Fallback | Durasi |
|---|---|---|---|---|
| **DISCUSS** | 1.1 Alignment | Sonnet | — | 1–2h |
| | 1.2 FR Inventory | Sonnet | — | 1h |
| | 1.3 Asumsi Data | Sonnet | — | 0.5h |
| **PLAN** | 2.1 Task Breakdown | Sonnet | — | 2–3h |
| | 2.2 Sprint/Batch | Sonnet | — | 1h |
| | 2.3 Teknis Design | **Opus** (recommended) / Sonnet | Sonnet | 1–2h |
| | 2.4 Design Tokens | Sonnet | — | 1h |
| **EXECUTE** | 3.1 Fase 0 (Setup) | Sonnet | — | 1–1.5h |
| | 3.2 Fase 1 (Design) | Sonnet | — | 1.5–2h |
| | 3.3 Fase 2 (Scoring) | **Opus** (recommended) / Sonnet | Sonnet (careful) | 2–3h |
| | 3.4 Fase 3 (Quiz) | **Opus** (recommended) / Sonnet | Sonnet (careful) | 3–4h |
| | 3.5 Fase 4 (Result/Detail) | Sonnet | — | 2–3h |
| | 3.6 Fase 5 (Admin) | Sonnet | — | 2–2.5h |
| | 3.7 Fase 6 (Polish) | Sonnet | — | 1.5–2h |
| | 3.8 Fase 7 (Integration) | Sonnet | — | 1–1.5h |
| **VERIFY** | 4.1 Verify Kode | Sonnet | — | 2–3h |
| | 4.2 Verify Produk | Sonnet | — | 1h |
| | 4.3 Review OQ | Sonnet | — | 0.5h |
| **SHIP** | 5.1 Final Cleanup | Sonnet | — | 0.5h |
| | 5.2 Deployment | Sonnet | — | 0.5h |
| | 5.3 Dokumentasi | Sonnet | — | 1h |
| | 5.4 Demo/Presentasi | Sonnet | — | 1–2h |

---

## Kapan Pakai Opus vs Sonnet — Keputusan Cepat

**Pakai Opus untuk:**
- **Fase 2 (Scoring Engine):** logic matematika kompleks + reference case harus match persis → Opus unggul di reasoning presisi.
- **Fase 3 (Quiz State):** multi-step state machine + integrasi pure function ke React side effects → Opus unggul di konteks management.
- **Fase 2.3 (Teknis Design):** kalau state management dirancang kompleks (multiple slices, shared state lintas komponen) → Opus untuk reasoning mendalam.

**Pakai Sonnet untuk:**
- **Semua tahap DISCUSS & PLAN** (tidak ada kode, cuma organize).
- **Fase 1, 4, 5, 6, 7** (styling, rendering, form logic, polish — tidak ada reasoning matematis kompleks).
- **Semua tahap VERIFY & SHIP** (QA, testing, documentation — logic straightforward).

**Rule of thumb:** kalau task terasa "butuh perhitungan/reasoning logika kompleks atau context besar", coba Opus dulu. Kalau terasa "straightforward implementation atau following a template", Sonnet cukup dan lebih cepat.

---

## Tips Eksekusi Praktis

1. **Jangan skip DISCUSS & PLAN:** Time investment kecil, prevent rework besar.
2. **Verify di ujung tiap fase, bukan di akhir:** Catch bug early, debug lebih mudah.
3. **Scoring engine = gerbang:** Jangan lanjut Fase 3 sampai unit test di Fase 2 jalan 100%.
4. **OQ-1/2/3 revisit di Verify:** Keputusan di sini menentukan handoff nanti (mock vs backend, authentic data vs placeholder).
5. **Model Claude:** Dengarkan rekomendasi model, tapi kalau anggaran/waktu terbatas, Sonnet aman untuk MVP ini (hanya Fase 2 & 3 yang benar-benar butuh Opus reasoning).
