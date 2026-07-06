# Dokumen Pendukung 1
# DSS Methodology & Recommendation Design
**Produk:** Freelance City Index: Yogyakarta Edition · **Versi:** Final
**Tujuan dokumen:** Menjelaskan metodologi DSS secara reproducible sebagai dasar database, ERD, dan implementasi backend.

> **Catatan unit analisis:** Unit analisis menggunakan tingkat **Kabupaten/Kota di DIY** (1 Kota + 4 Kabupaten): Kota Yogyakarta, Sleman, Bantul, Gunungkidul, Kulon Progo. Istilah "wilayah" pada dokumen merujuk pada unit Kabupaten/Kota ini.

> **Catatan istilah UI:** Dokumen teknis ini memakai "wilayah/Kabupaten-Kota" secara konsisten untuk presisi akademik. **Di UI/copy produk dan kode (nama komponen, variabel, route), gunakan istilah "distrik"** — sesuai PRD §4 dan §5 — karena itulah istilah yang dilihat pengguna akhir. Kedua istilah merujuk entitas data yang identik (`District` di data model, lihat §10).

---

## 1. Tujuan DSS

Membantu freelancer, remote worker, mahasiswa, fresh graduate, dan digital nomad **memilih wilayah terbaik di DIY** secara **cepat, personal, dan transparan** melalui satu perhitungan **weighted scoring** yang dapat dijelaskan, menggantikan riset manual lintas sumber. DSS ini **bukan** chatbot, direktori, atau platform booking — keluarannya adalah *ranking wilayah beralasan*, bukan transaksi.

---

## 2. Definisi Indikator

Empat indikator, masing-masing dinilai pada **skala 0-100** (semakin tinggi semakin baik bagi pengguna). Skor 0-100 inilah yang diinput admin (FR-A01); konversi dari data mentah ke 0-100 memakai rubrik di Bagian 4.

| Indikator | Sub-komponen | Arah | Definisi operasional |
|-----------|--------------|------|----------------------|
| **Internet** | Kecepatan (Mbps); Stabilitas koneksi | Tinggi = baik | Kelayakan konektivitas untuk kerja remote (video call, deploy, sinkron). |
| **Cost of Living** *(skor = keterjangkauan)* | Biaya kost; Biaya makan; Biaya transportasi | **Biaya rendah = skor tinggi** | Total estimasi biaya hidup bulanan; **dibalik** saat normalisasi. |
| **Community** | Jumlah coworking; Komunitas profesional aktif; Event komunitas | Tinggi = baik | Kepadatan ekosistem kerja & jejaring profesional/kreatif. |
| **Environment** | Kenyamanan; Kebisingan; Ketersediaan ruang publik | Tinggi = baik *(kebisingan dibalik)* | Kelayakan & kenyamanan lingkungan untuk fokus kerja. |

---

## 3. Sumber Data

| Indikator | Sumber utama | Sifat | Update |
|-----------|--------------|-------|--------|
| Internet | APJII; sampling uji kecepatan tim per Kabupaten/Kota (mis. Ookla/nperf) | Objektif + sampling | Mingguan |
| Cost of Living | BPS DIY; UMK 2026 (Pergub DIY); survei harga kost/makan/transport tim | Objektif + observasi | Mingguan |
| Community | Direktori Coworking DIY; data komunitas publik; observasi event | Objektif + observasi | Mingguan |
| Environment | Observasi & survei tim; data ruang publik pemerintah | **Observasional** | Mingguan |

> **Validitas:** Internet tingkat Kabupaten/Kota umumnya tidak tersedia publik sehingga wajib sampling tim terdokumentasi. Community & Environment sebagian observasional sehingga konversi 0-100 dilakukan **minimal 2 penilai** (inter-rater) memakai rubrik Bagian 4. Seluruh statistik wajib bersitasi sebelum sidang.

---

## 4. Metodologi Scoring & Normalisasi

### 4.1 Normalisasi data mentah ke 0-100 (min-max lintas 5 wilayah)
```
Indikator "tinggi = baik" :  skor = ((x - min) / (max - min)) x 100
Indikator/sub yang dibalik (biaya, kebisingan) : skor = ((max - x) / (max - min)) x 100
```
Skor indikator komposit = rata-rata skor sub-komponennya, lalu disimpan admin per wilayah (FR-A01).

**Anchor rubrik (contoh, wajib difinalkan tim):**

| Indikator | Skor 0 | Skor 100 |
|-----------|--------|----------|
| Internet | <= 10 Mbps | >= 100 Mbps |
| Cost (keterjangkauan) | biaya hidup tertinggi antar-wilayah | terendah antar-wilayah |
| Community | 0 coworking/komunitas | terbanyak antar-wilayah |
| Environment | sangat bising / minim ruang publik | tenang + ruang publik melimpah |

### 4.2 Rumus skor akhir
```
Skor_wilayah = SIGMA ( nilai_indikator_i x bobot_i' ),  SIGMA bobot_i' = 1 (100%)
```
`bobot_i'` = bobot persona (Bagian 5) disesuaikan preferensi pengguna (Bagian 6) lalu dinormalisasi.

---

## 5. Bobot Persona & Justifikasi (4 persona)

| Indikator | Tech Professional | Creative Professional | Student & Fresh Graduate | Digital Nomad |
|-----------|:----------------:|:--------------------:|:------------------------:|:-------------:|
| Internet | **40%** | 20% | 20% | 30% |
| Cost of Living | 25% | 25% | **45%** | 25% |
| Community | 20% | 25% | 20% | 25% |
| Environment | 15% | **30%** | 15% | 20% |

**Justifikasi:**
- **Tech Professional - Internet 40%:** kerja IT/remote paling bergantung bandwidth & stabilitas; konektivitas konsisten adalah prioritas utama remote worker (lit. remote-work/Nomad List). Environment terendah karena banyak bekerja dari kost/rumah.
- **Creative Professional - Environment 30% & Community 25%:** kerja kreatif menuntut inspirasi (cafe/ruang publik) dan jejaring (komunitas seni, kolaborator). Selaras User Objective: "lingkungan inspiratif tanpa mengorbankan konektivitas."
- **Student & Fresh Graduate - Cost 45%:** anggaran adalah *binding constraint* (target total < Rp 3 jt/bln, hindari burnout finansial). Indikator lain ditekan agar afordabilitas dominan.
- **Digital Nomad - profil paling seimbang (30/25/25/20):** stay jangka menengah butuh **internet andal** (kerja; di bawah Tech karena tak semua nomad IT), **komunitas aktif** (pendatang sangat bergantung jejaring/integrasi sosial, setara Creative), **biaya kompetitif** (tinggal lebih lama), dan **lingkungan layak**. Mencerminkan kebutuhan campuran lintas-profesi.

> Bobot berbasis literatur + karakteristik persona, **akan dikalibrasi** lewat user testing (target relevance >= 70%, Dok. 2).

---

## 6. Penyesuaian Preferensi Pengguna (input ke bobot)

Pengguna menginput **4 sinyal** pada Quiz Step 1, dalam urutan tampil berikut (selaras PRD §5.1 FR-002 s/d FR-005):

| Urutan tampil | Sinyal | FR terkait | Tipe kontrol UI |
|:---:|---|:---:|---|
| 1 | Budget | FR-002 | Slider Rp 2.000.000–Rp 6.500.000 |
| 2 | Internet Priority | FR-003 | Tombol single-select: Low / Medium / High / Ultra |
| 3 | **Community Priority** | **FR-004** | Tombol single-select: Low / Medium / High |
| 4 | Environment Preference | FR-005 | Tombol single-select: Quiet / Cafe / Coworking / Flexible |

Tiga indikator kualitas (Internet/Community/Environment) kini punya selektor eksplisit; Cost ditangani via budget (bukan selektor bobot langsung).

```
1. Internet   : bobot_internet  x {Low 0.3 | Medium 1.0 | High 1.7 | Ultra 2.5}
2. Community  : bobot_community x {Low 0.3 | Medium 1.0 | High 1.8}
3. Environment: delta pada bobot Environment {Quiet +15 | Cafe +8 | Coworking +4 | Flexible +0}
                (TIDAK lagi menambah Community -- menghindari double counting;
                Quiet paling sensitif terhadap suasana, Coworking paling tidak)
4. Cost       : budget = sinyal afordabilitas (flag "di bawah UMK") + tiebreaker (UMK terendah)
5. Normalisasi: bobot_i' = bobot_i / SIGMA bobot -> SIGMA = 100%
```

> **Mengapa Community Priority (FR-004) ditambahkan:** sebelumnya Community ikut dibobot tetapi tidak punya input langsung (asimetri vs Internet & Environment). Menambah Community Priority membuat ketiga indikator kualitas simetris, menutup celah logika, dan memperkuat transparansi & justifikasi algoritma.

### 6.1 Spesifikasi UI per sinyal (acuan komponen Quiz Step 1)

| Sinyal | Default value | Label UI (Bahasa Indonesia) | Catatan UX |
|---|---|---|---|
| Budget | Rp 4.000.000 (tengah rentang) | "Berapa budget bulanan Anda?" | Tampilkan nilai terpilih real-time di atas slider (FR-002); format Rupiah dengan pemisah ribuan |
| Internet Priority | Medium | "Seberapa penting internet cepat?" | 4 tombol sejajar/grid; tombol terpilih diberi state visual aktif (border/fill berbeda) |
| Community Priority | Medium | "Seberapa penting komunitas & coworking aktif?" | 3 tombol sejajar/grid; sama persis pola visual dengan Internet Priority agar simetri terlihat di UI (bukan cuma di logika) |
| Environment Preference | Flexible | "Lingkungan kerja seperti apa yang Anda sukai?" | 4 tombol grid 2x2 di mobile; ikon pendukung opsional (mis. cangkir kopi untuk Cafe, gedung untuk Coworking) |

Semua kontrol harus memenuhi target sentuh minimum 44px (NFR02, Dok. Pendukung 2) dan merespons real-time tanpa delay terasa (FR-002 s/d FR-005).

---

## 7. Recommendation Logic

Dipicu oleh FR-006 (scoring) dan ditampilkan bertahap lewat FR-007 (Algorithm Explanation) dan FR-008 (Result ranking):

```
INPUT : persona, budget, internet_priority, community_priority, environment_pref
DATA  : skor 4 indikator (0-100) tiap wilayah valid
1. Ambil base weight persona (Bagian 5)        (4 persona termasuk Digital Nomad)
2. Terapkan penyesuaian preferensi (Bagian 6) -> re-normalisasi -> bobot_i'
3. Skor_wilayah = SIGMA (nilai_indikator_i x bobot_i') untuk tiap wilayah valid
4. Kecualikan wilayah data tidak valid/0 (tandai "data diperbarui")
5. Urutkan skor tertinggi -> rank
6. TIEBREAKER skor seri: UMK terendah -> rank lebih tinggi
7. Rank 1 = "Best Match"
8. Hasilkan "Why This Match" (Bagian 8, FR-012)
EDGE: tak ada wilayah cocok 100% -> best-effort + jelaskan trade-off
      semua wilayah dikecualikan -> empty state
```

---

## 8. "Why This Match" Logic
```
kontribusi_i = nilai_indikator_i x bobot_i'
```
Ambil **2 indikator kontribusi tertinggi**, susun penjelasan + kaitkan preferensi. Template:
> "**[Wilayah]** direkomendasikan karena **[indikator-1]** kuat (skor [x]/100) sesuai prioritas Anda, dan **[indikator-2]** mendukung (skor [y]/100). Trade-off: [indikator terlemah] relatif lebih rendah."

Memenuhi **FR-012** & nilai inti *Transparent Recommendation*.

### 8.1 Spesifikasi komponen UI "Why This Match"

Komponen ini dirender di dua tempat: di kartu Best Match pada Result Page (`/result`), dan di halaman `/district/:id` saat user membuka detail wilayah mana pun (bukan hanya Best Match). Elemen visual yang disarankan:

| Elemen | Sumber data | Catatan tampilan |
|---|---|---|
| 2 indikator kontribusi tertinggi | `kontribusi_i` terbesar | Tampilkan sebagai mini progress-bar atau chip dengan skor, bukan teks polos |
| Kalimat penjelasan | Template §8 | Bahasa Indonesia, satu paragraf pendek |
| Trade-off | Indikator dengan kontribusi terlemah | Beri visual treatment berbeda (warna lebih netral/muted) dari 2 indikator kuat di atas, agar terlihat sebagai catatan jujur, bukan ditonjolkan |

---

## 9. Contoh Perhitungan (4 input, persona baku)

**Skenario:** Persona = **Tech Professional**; Internet = **High (x1.7)**; Community = **Medium (x1.0)**; Environment = **Cafe (+8)**.

**Bobot:** Base Tech 40/25/20/15 -> Internet 40x1.7 = 68; Community 20; Environment 15+8 = 23; Cost 25. SIGMA = 136 ->

| Indikator | bobot' |
|-----------|:------:|
| Internet | 68/136 = **0,500** |
| Cost | 25/136 = **0,184** |
| Community | 20/136 = **0,147** |
| Environment | 23/136 = **0,169** |

**Data indikator (seed rebalance 2026-07-06):**

| Wilayah | Internet | Cost | Community | Environment |
|---------|:--------:|:----:|:---------:|:-----------:|
| Sleman | 84 | 60 | 75 | 70 |
| Kota Yogyakarta | 88 | 42 | 97 | 52 |
| Bantul | 58 | 78 | 62 | 92 |

**Skor:**
```
Sleman = 84x0,500 + 60x0,184 + 75x0,147 + 70x0,169 = 42,0 + 11,0 + 11,0 + 11,8 = 75,9
Kota   = 88x0,500 + 42x0,184 + 97x0,147 + 52x0,169 = 44,0 + 7,7 + 14,3 + 8,8 = 74,8
Bantul = 58x0,500 + 78x0,184 + 62x0,147 + 92x0,169 = 29,0 + 14,3 + 9,1 + 15,6 = 68,0
```
**Ranking:** Sleman (75,9) -> Kota (74,8) -> Bantul (68,0). **Best Match: Sleman.**

**Why This Match (Sleman):** kontribusi tertinggi = Internet (42,0) & Environment (11,8) ->
*"Sleman direkomendasikan karena internet kuat (84/100) sesuai prioritas tinggi Anda, dan lingkungan kerjanya nyaman (70/100). Trade-off: biaya hidup sedikit di atas wilayah termurah."*

> **Catatan revisi 2026-07-06:** rentang multiplier diperlebar (sebelumnya Internet 0.7–1.6, Community 0.7–1.3, Environment flat +-5). Dengan rentang lama, bobot dasar persona terlalu dominan: simulasi seluruh 192 kombinasi input menunjukkan Best Match nyaris tidak berubah apa pun jawaban user (188/192 kombinasi menghasilkan pemenang yang sama). Rentang baru + rebalance data seed membuat jawaban user benar-benar menentukan hasil: 4 distrik berbeda kini bisa menjadi Best Match.

---

## 10. Implikasi Database (ringkas -- detail di Dok. Pendukung 4)

Entitas persisten: **District** (incl. nilai mentah tampilan: umk, coworking_count, internet_mbps), **Indicator**, **DistrictIndicatorScore** (0-100), **Persona**, **PersonaWeight** (wajib termasuk baris **Digital Nomad**), **AdminUser**, **AuditLog**. Input pengguna & **RecommendationResult** bersifat **efemeral/sesi** di V1 (tanpa akun) -- dipersistensi baru di V2 (Save Result).

## 11. Acuan Visual untuk Algorithm Explanation (FR-007) & Result Page (FR-008)

Bagian ini menerjemahkan logika §4–§9 menjadi acuan langsung bagi desain UI, agar transparansi algoritma (NFR08) benar-benar terlihat, bukan hanya benar secara matematis.

### 11.1 Algorithm Explanation (Step 2, FR-007)
- Tampilkan **4 bar bobot horizontal** (satu per indikator: Internet, Cost, Community, Environment) dengan panjang proporsional terhadap `bobot_i'` hasil persona + adjustment user — bukan bobot dasar persona saja, agar user melihat efek pilihannya secara langsung.
- Sertakan **contoh formula** dengan angka asli dari sesi user (bukan placeholder statis), idealnya memakai distrik yang sama dipakai sebagai contoh tetap di dokumentasi (Sleman) sebagai referensi jika data user belum lengkap.
- Tampilkan ringkas urutan kalkulasi: base weight → adjustment → normalisasi → skor, agar user paham *kenapa* angkanya begitu (selaras §4.2 dan §6).

### 11.2 Result Page (Step 3, FR-008)
- 5 kartu distrik diurutkan skor tertinggi ke terendah.
- Tiap kartu menampilkan: skor total, 4 skor indikator (mini bar/chip), serta nilai mentah UMK/coworking/internet (sesuai FR-008).
- Kartu rank 1 mendapat badge **"Best Match"** dengan visual treatment berbeda (border git lebih tebal/warna aksen) — **hanya satu** kartu boleh memegang badge ini per hasil (lihat Edge Case "skor sama persis" di PRD §6.1, tiebreaker UMK terendah).
- Label kuning "Budget di bawah UMK" muncul di kartu yang relevan, **bukan** warna merah (merah direservasi untuk error state sesungguhnya).
