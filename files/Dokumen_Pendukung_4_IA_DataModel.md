# Dokumen Pendukung 4
# Information Architecture & Data Model Preparation
**Produk:** Freelance City Index: Yogyakarta Edition · **Versi:** Final
**Tujuan:** Menjembatani PRD ke tahap Sitemap, User Flow, Wireframe, ERD, dan Database Design.

> Unit analisis = **Kabupaten/Kota DIY** (Kota Yogyakarta, Sleman, Bantul, Gunungkidul, Kulon Progo).

---

## 1. Sitemap

```
USER SIDE
  Landing Page
    +-- Persona Quiz (Step 1: persona + budget + internet + community + environment)
          +-- Algorithm Explanation (Step 2: bobot per indikator + contoh formula)
                +-- Recommendation Result (Step 3: ranking 5 wilayah + Best Match)
                      +-- Why This Match            [blok pada kartu/hasil, bukan route terpisah]
                      +-- District Detail (+ District Snapshot)

ADMIN SIDE  (di belakang Admin Login)
  Admin Login
    +-- Dashboard            (ringkasan 5 wilayah, timestamp, peringatan > 7 hari)
          +-- Data Management (form input/validasi 4 indikator skala 0-100)
          +-- Audit Log       (riwayat perubahan: tanggal, field, nilai lama/baru, admin)
```

**Catatan IA:**
- **Algorithm Explanation** & **Why This Match** adalah **langkah/komponen**, bukan halaman berdiri sendiri (Algorithm = Step 2; Why This Match = blok pada Result/Detail).
- Admin dipecah jadi **3 layar**: Dashboard, Data Management, Audit Log.

---

## 2. Page / Route Inventory (untuk Frontend)

| # | Route | Tipe | Akses |
|---|-------|------|-------|
| 1 | `/` Landing | Page | Publik |
| 2 | `/quiz` Persona Quiz (mencakup Step 1 Input & Step 2 Algorithm Explanation sebagai state internal) | Page (multi-step state) | Publik |
| - | Algorithm Explanation | State internal pada `/quiz` (Step 2) — **bukan route URL terpisah, tidak deep-link-able** | Publik |
| 3 | `/result` Recommendation Result | Page | Publik |
| - | Why This Match | Komponen pada `/result` & `/district/:id` | Publik |
| 4 | `/district/:id` District Detail + Snapshot | Page | Publik |
| 5 | `/admin/login` Admin Login | Page | Admin |
| 6 | `/admin` Dashboard | Page | Admin |
| 7 | `/admin/data` Data Management | Page | Admin |
| 8 | `/admin/audit` Audit Log | Page | Admin |

> **Keputusan arsitektur:** route `/algorithm` sengaja **tidak** dibuat sebagai URL mandiri di React Router. Algorithm Explanation adalah Step 2 di dalam state machine `/quiz` (Step 1 Input → Step 2 Algorithm → navigasi ke `/result`). Ini konsisten dengan Catatan IA di atas yang sejak awal menyebutnya "langkah/komponen, bukan halaman berdiri sendiri" — penomoran route disesuaikan agar tidak kontradiktif dengan catatan tersebut.

---

## 3. User Flow (Landing -> Result)

```
[Landing] --klik "Mulai"--> [Quiz Step 1]
   |  isi: persona, budget, internet, community, environment
   v
[Validasi input] --persona belum dipilih?--> inline error, tahan
   | valid
   v
[Find My Best Region] --> [Algorithm Step 2: tampil bobot + formula]
   |
   v
[See Results] --> hitung weighted score 5 wilayah
   |
   +-- semua wilayah valid? --tidak--> kecualikan wilayah; jika semua gugur -> [Empty State]
   | ya
   v
[Result Step 3: ranking + Best Match + Why This Match]
   |
   +--klik wilayah--> [District Detail + Snapshot] --kembali--> [Result]
   |
   +--"Try Again"--> reset ke [Quiz Step 1] (tanpa reload)
```

---

## 4. Data Flow

```
Quiz Input (persona, budget, internet_pri, community_pri, environment_pref)
   |
   v
Weighting  : base weight persona -> penyesuaian preferensi -> normalisasi (Dok.1 Bagian 6)
   |
   v
Weighted Scoring : Skor_wilayah = SIGMA(nilai_indikator x bobot') ; ambil DistrictIndicatorScore (0-100)
   |
   v
Ranking : urut skor desc -> tiebreaker UMK terendah -> tandai Best Match ; kecualikan data invalid
   |
   v
Recommendation Result (efemeral/sesi) : daftar wilayah + skor total + skor per indikator
   |
   +--> Why This Match : kontribusi_i = nilai x bobot' -> ambil 2 tertinggi -> generate teks
   |
   +--> District Detail : gabungkan skor + nilai mentah (umk, coworking, internet_mbps) -> District Snapshot
```

---

## 5. Entity Preparation (konseptual -> dasar ERD)

| Entitas | Atribut inti | Keterangan |
|---------|--------------|------------|
| **District** | id, nama, tipe (Kota/Kabupaten), umk, coworking_count, internet_mbps, ringkasan_karakteristik | Nilai mentah untuk tampilan Snapshot/Result |
| **Indicator** | id, nama (Internet/Cost/Community/Environment), arah | Master 4 indikator |
| **DistrictScore** | id, district_id (FK), indicator_id (FK), skor (0-100), updated_at | Skor untuk engine; 1 baris per (wilayah x indikator) |
| **Persona** | id, nama (4 persona baku) | Master persona |
| **Weight** | id, persona_id (FK), indicator_id (FK), base_weight | Bobot dasar; **wajib lengkap untuk Digital Nomad** |
| **RecommendationResult** | session_id, persona_id, input (budget, prioritas), ranked[] (district_id, skor_total, skor_per_indikator), why_text, created_at | **Efemeral di V1** (in-memory/sesi); dipersistensi di V2 (Save Result) |
| **Admin** | id, nama, password_hash, role | Autentikasi internal single-role |
| **AuditLog** | id, admin_id (FK), district_id (FK), field, old_value, new_value, created_at | Jejak perubahan data |

### Relasi konseptual
- **District 1..N DistrictScore** ; **Indicator 1..N DistrictScore** -> `DistrictScore` adalah tabel asosiatif (wilayah x indikator).
- **Persona 1..N Weight** ; **Indicator 1..N Weight** -> `Weight` adalah tabel asosiatif (persona x indikator). 4 persona x 4 indikator = 16 baris bobot.
- **Admin 1..N AuditLog** ; **District 1..N AuditLog**.
- **RecommendationResult N..1 Persona** (mereferensi persona terpilih); tidak menyimpan data pengguna pribadi.

```
Persona --< Weight >-- Indicator
District --< DistrictScore >-- Indicator
Admin --< AuditLog >-- District
Persona --< RecommendationResult   (efemeral V1)
```

---

## 6. District Snapshot (perjelasan kebutuhan District Detail)

Halaman District Detail menampilkan **District Snapshot** -- ringkasan padat per wilayah:

| Elemen Snapshot | Sumber data | Bentuk tampilan |
|-----------------|-------------|-----------------|
| Internet Quality | DistrictScore.Internet + District.internet_mbps | Skor 0-100 + label (mis. "Baik, ~85 Mbps") |
| Estimasi Rentang Biaya Kost | District (survei kost) | Rentang Rp (mis. "Rp 800rb - 1,8 jt/bln") |
| Estimasi Biaya Hidup | District (kost+makan+transport) / UMK | Estimasi Rp total/bln + acuan UMK |
| Aktivitas Komunitas | DistrictScore.Community + coworking_count | Skor + jumlah coworking/komunitas/event |
| Best For Persona | Persona dengan skor tertinggi pada wilayah ini | Badge (mis. "Best for: Tech Professional") |
| Ringkasan Karakteristik Wilayah | District.ringkasan_karakteristik | 1-2 kalimat naratif |

> Snapshot menggabungkan **skor 0-100** (untuk perbandingan) dan **nilai mentah** (untuk konteks nyata) -- karena itu District menyimpan keduanya (lihat Bagian 5).

---

## 7. Component Inventory per Halaman (acuan struktur React)

Pemetaan dari route (§2) ke komponen UI yang dibutuhkan — disusun agar tim frontend dapat langsung menurunkan struktur folder/komponen tanpa menebak ulang dari user flow.

| Route | Komponen utama | Sub-komponen |
|---|---|---|
| `/` Landing | `LandingPage` | `HeroSection`, `ValueProposition`, `CtaButton` ("Mulai") |
| `/quiz` Step 1 | `QuizStep1Input` | `PersonaCardSelector` (4 kartu), `BudgetSlider`, `InternetPrioritySelect`, `CommunityPrioritySelect`, `EnvironmentPreferenceSelect`, `InlineValidationError` |
| `/quiz` Step 2 | `QuizStep2Algorithm` | `WeightBarChart` (4 bar indikator), `FormulaExample` |
| `/result` | `ResultPage` | `DistrictRankCard` x5, `BestMatchBadge`, `WhyThisMatch`, `EmptyState`, `UMKBelowBudgetLabel` |
| `/district/:id` | `DistrictDetailPage` | `DistrictSnapshot`, `WhyThisMatch` (reuse dari Result), `BackToResultButton` |
| `/admin/login` | `AdminLoginPage` | `LoginForm`, `AuthErrorMessage` |
| `/admin` | `AdminDashboardPage` | `DistrictSummaryTable`, `StaleDataWarningBadge` |
| `/admin/data` | `DataManagementPage` | `IndicatorInputForm` (4 field 0-100), `InlineFieldValidation`, `SaveConfirmationToast` |
| `/admin/audit` | `AuditLogPage` | `AuditLogTable` (tanggal, field, nilai lama/baru, admin) |

**Komponen lintas-halaman (reusable, taruh di `components/` bersama, bukan di `routes/`):** `WhyThisMatch` dipakai di `/result` dan `/district/:id` — implementasikan sebagai satu komponen dengan props berbeda, jangan diduplikasi. `EmptyState` dan badge kuning/merah (lihat Dok. Pendukung 2 §8 UI States) juga sebaiknya jadi komponen generik yang dipakai ulang di user side maupun admin side.
