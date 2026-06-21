# Dokumen Pendukung 2
# Product Validation & Risk Analysis
**Produk:** Freelance City Index: Yogyakarta Edition · **Versi:** Final

---

## 1. Non-Functional Requirements (NFR)

| ID | Kategori | Requirement | Cara verifikasi |
|----|----------|-------------|-----------------|
| NFR01 | Performance | Halaman hasil tampil < 2 detik; total Time-to-Result < 60 detik | Pengukuran timestamp + DevTools |
| NFR02 | Usability | Mobile-responsive; area sentuh tombol/slider >= 44px; single-column < 360px | Uji perangkat + Lighthouse |
| NFR03 | Accessibility | Kontras memadai, label form jelas, navigasi keyboard dasar | Lighthouse / WAVE |
| NFR04 | Reliability | Wilayah dengan data tidak valid dikecualikan tanpa membuat aplikasi gagal; empty state saat semua dikecualikan | Uji injeksi data 0/null |
| NFR05 | Security | Login admin: password di-hash, rate-limit percobaan, validasi input 0-100, audit log | Code review + uji input |
| NFR06 | Maintainability | Update data mingguan tanpa deploy ulang | Uji alur admin |
| NFR07 | Compatibility | Chrome/Firefox/Safari terbaru, web mobile tanpa instalasi | Cross-browser test |
| NFR08 | Transparency | Setiap rekomendasi dapat dijelaskan (Why This Match) & bobot terlihat (Algorithm) | Uji fungsional FR-007/FR-012 |
| NFR09 | Scalability | 5 wilayah, konkurensi rendah (skala akademik) | Dicatat sebagai batasan; *peningkatan skala dialokasikan ke V2/V3 — lihat Dok. Pendukung 3 Roadmap, bukan batasan permanen produk* |

---

## 2. Assumptions

- Data BPS, APJII, direktori coworking tersedia publik & dapat diakses mingguan.
- Pengguna memiliki perangkat + koneksi internet.
- UMK DIY 2026 valid selama periode pengembangan (dicocokkan dengan Pergub terbaru).
- Nilai Community & Environment dapat dikonversi adil ke 0-100 via rubrik + inter-rater.
- Pengguna bersedia menjawab quiz singkat & survei 1-pertanyaan pasca-hasil.

---

## 3. Limitations

- Hanya **5 wilayah (Kabupaten/Kota) DIY**; tidak menggeneralisasi ke wilayah lain.
- Indikator Community & Environment **sebagian subjektif**; bukan sensor real-time.
- Data internet per Kabupaten/Kota mengandalkan **sampling tim**, bukan sumber resmi granular.
- **Tanpa akun pengguna**: personalisasi terbatas pada persona + 4 input; tidak ada Save/History di V1.
- **Bobot belum dioptimasi empiris** pada rilis awal.
- Sampel validasi kecil (akademik) -> indikatif, bukan generalisasi statistik.
- Data periodik (mingguan), bukan live.

---

## 4. Risk Assessment & Mitigasi

| ID | Risiko | Likelihood | Impact | Mitigasi |
|----|--------|:----------:|:------:|----------|
| R1 | Data Community/Environment subjektif -> bias | Tinggi | Sedang | Rubrik konversi + min. 2 penilai (inter-rater) |
| R2 | Data internet per Kabupaten/Kota tidak tersedia granular | Tinggi | Sedang | Sampling tim terdokumentasi + tanggal ambil |
| R3 | Statistik/UMK tanpa sitasi dipertanyakan penguji | Sedang | Tinggi | Tambahkan sumber & verifikasi sebelum sidang |
| R4 | Bobot persona belum teruji empiris | Tinggi | Sedang | Validasi user testing (relevance >= 70%) + iterasi |
| R5 | Data tidak diperbarui tepat waktu (SLA 7 hari) | Sedang | Sedang | Reminder timestamp (FR-A03) + pembagian tugas |
| R6 | Kapasitas tim 4 part-time -> scope tertunda | Sedang | Tinggi | Fokus jalur Must; UI minimal untuk halaman sekunder |
| R7 | Ketergantungan data publik berubah/akses ditutup | Rendah | Sedang | Cache snapshot + dokumentasi tanggal ambil |
| R8 | Scope creep (fitur out-of-scope menyelinap) | Sedang | Sedang | Roadmap V2/V3 mengunci batas (Dok. 3) |

---

## 5. Recommendation Relevance Score -- Rencana Pengukuran

- **Instrumen:** survei 1-pertanyaan pasca-hasil, skala 1-5.
- **Pertanyaan:** "Apakah rekomendasi yang diberikan sesuai dengan kebutuhan Anda?"
- **Target:** **>= 70% responden memberi nilai 4 atau 5.**
- **Sampel:** minimal **n = 30**, terdistribusi ke 4 persona.
- **Pengumpulan:** komponen rating muncul otomatis di halaman hasil; jawaban anonim.
- **Analisis:** % (nilai 4-5) dari total; dipantau per persona untuk mendeteksi bobot yang perlu kalibrasi.

---

## 6. User Testing Plan

| Aspek | Rencana |
|-------|---------|
| Tujuan | Validasi usability + relevansi rekomendasi sebelum finalisasi |
| Peserta | 8-12 orang, mewakili **4 persona** (Tech / Creative / Student & Fresh Graduate / Digital Nomad) |
| Metode | Moderated usability test + think-aloud + survei relevance |
| Tugas | (1) selesaikan quiz; (2) interpretasi hasil & Why This Match; (3) buka District Detail |
| Metrik | Quiz Completion Rate, Time-to-Result, Relevance Score, error/kebingungan, (opsional) SUS |
| Kriteria lulus | Completion >= 70%, Time-to-Result < 60 dtk, Relevance >= 70% (4-5) |
| Jadwal | 1 ronde pra-finalisasi; perbaikan; (opsional) 1 ronde verifikasi |

---

## 7. Acceptance Criteria (per fitur MVP)

| Fitur | Acceptance Criteria (Given / When / Then) |
|-------|--------------------------------------------|
| Landing Page (FR-000) | **Given** pengguna membuka domain, **when** halaman dimuat, **then** value proposition + tombol "Mulai" tampil; klik membuka quiz. |
| Persona Quiz (FR-001..FR-005) | **Given** halaman quiz, **when** pengguna memilih **1 dari 4 persona** (FR-001) + budget (FR-002) + internet priority (FR-003) + **community priority (FR-004)** + environment preference (FR-005), **then** nilai update real-time & input tervalidasi sebelum "Find My Best Region" dapat ditekan. |
| Scoring Engine (FR-006, FR-010) | **Given** input lengkap, **when** "Find My Best Region" ditekan, **then** skor 5 wilayah dihitung dengan bobot persona disesuaikan preferensi (FR-006); jika pengguna kembali ke Step 1 dan mengubah input setelah hasil tampil, skor diperbarui tanpa reload (FR-010). |
| Algorithm Explanation (FR-007) | **Given** skor terhitung, **when** Step 2 dibuka, **then** bar bobot per indikator (Internet/Cost/Community/Environment) + contoh formula sesuai persona ditampilkan secara visual (bukan hanya angka). |
| Result Page (FR-008, FR-009) | **Given** perhitungan selesai, **when** hasil dirender, **then** 5 wilayah terurut skor tertinggi-terendah; tiap kartu tampilkan skor total + 4 skor indikator + UMK/coworking/internet (FR-008); rank 1 berbadge "Best Match" dengan visual berbeda (FR-009). |
| Why This Match (FR-012) | **Given** Best Match/wilayah dipilih, **when** blok dirender pada `/result` atau `/district/:id`, **then** 2 indikator kontribusi tertinggi + kaitan preferensi + trade-off ditampilkan dalam bahasa naratif singkat. |
| District Detail + Snapshot (FR-011) | **Given** pengguna klik wilayah, **when** halaman dibuka, **then** District Snapshot tampil: Internet Quality, estimasi rentang biaya kost, estimasi biaya hidup, aktivitas komunitas, Best For Persona, ringkasan karakteristik. |
| Admin Update (FR-A01..A05) | **Given** admin terautentikasi, **when** menyimpan 4 indikator (0-100), **then** validasi lolos, data atomic, timestamp & audit log terbarui; nilai di luar 0-100 ditolak dengan pesan error inline per-field. |
| Edge: data kedaluwarsa | **Given** data wilayah > 7 hari/tidak valid, **when** ranking dihitung, **then** wilayah diberi badge kuning atau dikecualikan dengan catatan; jika semua dikecualikan tampil empty state informatif (bukan halaman kosong). |
| Edge: tidak ada kecocokan 100% | **Given** tidak ada wilayah yang memenuhi seluruh preferensi sempurna, **when** ranking ditampilkan, **then** sistem tetap tampilkan ranking best-effort dengan label "Tidak ada yang cocok 100% — berikut yang terdekat"; Why This Match menjelaskan trade-off secara eksplisit. |

---

## 8. UI States & Error Handling (acuan komponen frontend)

Ringkasan seluruh state non-happy-path yang harus diimplementasikan UI, dikumpulkan dari NFR, Acceptance Criteria di atas, dan Edge Cases PRD §6.1/§6.2 — supaya tidak ada state yang terlewat saat membangun komponen.

| State | Trigger | Tampilan yang diharapkan | Warna/treatment |
|---|---|---|---|
| Loading hasil | Antara "See Results" ditekan dan render Step 3 | Skeleton loading (bukan spinner kosong) | Netral |
| Error koneksi | Gagal load hasil | "Koneksi terputus. Coba lagi?" + tombol retry | Merah (error sesungguhnya) |
| Distrik data invalid/0 | Indikator belum diisi admin | Dikecualikan dari ranking + catatan "[Nama Distrik] data sedang diperbarui" | Netral/abu-abu |
| Semua distrik dikecualikan | Semua data invalid/>7 hari | Empty state: "Data semua wilayah sedang diperbarui — silakan coba lagi nanti" | Netral, bukan halaman kosong polos |
| Budget di bawah UMK semua distrik | Hasil scoring | Label "Budget di bawah UMK" pada tiap kartu | **Kuning** (peringatan informatif, bukan error) |
| Data > 7 hari (admin dashboard) | Timestamp distrik kedaluwarsa | Label peringatan pada tabel ringkasan | **Kuning** |
| Skor seri (tie) | 2+ distrik skor identik | Tiebreaker UMK terendah otomatis; hanya 1 badge "Best Match" | — |
| Validasi gagal (quiz) | Persona belum dipilih saat submit | Error inline: "Pilih dulu profil freelancer Anda"; tombol non-aktif | Merah, inline dekat elemen terkait |
| Validasi gagal (admin form) | Input bukan angka 0–100 | Error merah per field real-time: "Masukkan angka antara 0 hingga 100" | Merah, inline per-field |
| Admin akses ditolak | Role bukan admin | Halaman 403: "Anda tidak memiliki izin" | — |
| Admin konflik simpan bersamaan | 2 admin update distrik sama | Peringatan konflik, minta refresh sebelum simpan ulang (optimistic locking) | Kuning/peringatan |
| Layar mobile < 360px | Breakpoint sempit | Layout single-column; touch target ≥ 44px | — |

**Prinsip warna:** kuning = peringatan informatif (data lampau, budget rendah, konflik edit), merah = error sesungguhnya yang menghentikan alur (koneksi putus, validasi gagal, akses ditolak). Jangan menukar keduanya — ini menjaga prinsip *Transparent Recommendation* (NFR08) supaya peringatan tidak terasa seperti kegagalan sistem.
