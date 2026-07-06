# Riwayat Pengerjaan — Freelance City Index: Yogyakarta Edition

> Dokumen ini merangkum semua yang sudah dikerjakan dari awal sampai selesai,
> termasuk keputusan teknis yang diambil secara proaktif (di luar perintah eksplisit).
> Tujuannya biar bisa dijelaskan ke dosen dengan jelas.

---

## Changelog — Perubahan Terbaru

> Urutan terbaru di atas.

> **Status commit:** entri 2026-07-05 (identitas "Crimson/Paper", lanjutan 4–13) sudah masuk **commit `de01985`**. Entri 2026-07-03 dan 2026-07-04 (Field Notes/biru/Terracotta/Almanac/TerraNova) masih bertanda "BELUM DI-COMMIT" tapi sebenarnya sudah tidak relevan untuk di-commit — semua sudah tertimpa oleh iterasi berikutnya di working tree sebelum sempat di-commit sendiri-sendiri, jadi kodenya sudah tidak ada lagi untuk di-commit. Entri itu dibiarkan sebagai riwayat evolusi desain saja.

---

### 2026-07-06 lanjutan 12 — Footer kecil di semua halaman publik (termasuk Result)

**Konteks:** User minta setiap halaman punya footer kecil seperti di District Detail, kecuali Landing (punya LandingFooter sendiri) dan Admin.

**Fix:** infrastrukturnya sudah ada (`ConditionalFooter` di root layout) — cukup hapus pengecualian `/result` yang dulu sengaja dibuat meniru mockup hasil-rekomendasi.html tanpa footer. Efek samping positif: Result kembali punya akses ke Admin lewat footer (catatan lanjutan 5 soal "Result kehilangan jalur ke Admin" kini tertutup).

**Verifikasi:** Playwright cek 8 halaman — footer kecil ada di quiz/result/compare/algoritma/assistant/district, tidak ada di admin, dan Landing tetap hanya 1 footer (LandingFooter, tidak dobel). tsc+eslint bersih.

---

### 2026-07-06 lanjutan 11 — Hero landing: gambar latar memenuhi layar pertama penuh (fix "terpotong atas-bawah" di laptop)

**Konteks:** User lapor gambar pemandangan hero landing terlihat terpotong bagian atas & bawah di laptop.

**Root cause:** tinggi hero fixed `min-h-[820px]` sementara lebarnya full viewport — di laptop 1920px rasio kontainer ~2.3, padahal 3 dari 5 foto hero berrasio 4:3 (1920×1440), jadi `object-cover` membuang ±40% sisi atas-bawah. Ditambah di layar tinggi, section berikutnya ikut kelihatan di bawah hero sehingga gambar tampak seperti pita terjepit.

**Fix:** di `page.tsx`, tinggi hero pada `lg+` diganti mengikuti viewport: `lg:min-h-[min(calc(100svh-76px),1000px)]` (76px = strip navbar, cap 1000px untuk monitor tinggi) + `flex flex-col justify-center` supaya konten tetap center vertikal. Mobile/tablet tidak berubah (820/760px). Sekalian: angka contoh skor Sleman di kartu hero diupdate 74.9 → 75.9 (mengikuti reference case baru lanjutan 10).

**Verifikasi:** screenshot Playwright 1366×768, 1440×900, 1920×1080 — gambar (Tugu Yogyakarta dst.) kini memenuhi seluruh layar pertama, terlihat utuh dari puncak sampai dasar, tidak ada strip section lain menjepit. `tsc` bersih.

---

### 2026-07-06 lanjutan 10 — Algoritma: pelebaran multiplier sinyal quiz supaya jawaban user benar-benar menentukan hasil

**Konteks:** User merasa hasil rekomendasi "seperti template" — persona yang dipilih seolah sudah mengunci hasil, mau internet/community priority diisi apa pun hasilnya sama. Simulasi seluruh 192 kombinasi input (4 persona × 4 internet × 3 community × 4 environment) dengan data DB aktual membuktikan keluhan itu benar: pemenang nyaris tidak pernah berubah dalam satu persona (mis. Tech Professional: 42/48 kombinasi tetap Sleman), dan **Quiet/Cafe/Coworking efeknya persis identik** karena `ENVIRONMENT_DELTA` sama semua (+0.05).

**Root cause:** (1) rentang multiplier lama (0.7–1.6) terlalu sempit — bobot persona jadi jangkar dominan, jawaban user cuma menggeser bobot beberapa persen; (2) delta Environment flat untuk 3 dari 4 opsi = sinyal mati; (3) budget memang by-design hanya tiebreaker + flag UMK (tidak diubah).

**Fix (disetujui user — struktur pertanyaan quiz TIDAK berubah, tetap sesuai PRD):**
- `normalize.ts`: Internet Low ×0.3 / Medium ×1.0 / High ×1.7 / Ultra ×2.5 (lama 0.7/1.0/1.3/1.6); Community Low ×0.3 / Medium ×1.0 / High ×1.8 (lama 0.7/1.0/1.3); Environment delta dibedakan per opsi: Quiet +0.15, Cafe +0.08, Coworking +0.04, Flexible +0 (lama flat +0.05 non-Flexible).
- Label multiplier di `InternetPrioritySelect.tsx` & `CommunityPrioritySelect.tsx` disesuaikan.
- `districts.seed.json` disinkronkan ke nilai skor DB/prisma seed (sebelumnya stale, masih berisi nilai pra-rebalance — file ini hanya dipakai landing preview, bukan scoring, tapi biar tidak menyesatkan).
- CLAUDE.md §5.3–5.4 dan Dok 1 (files/Dokumen_Pendukung_1) §6 + §9 diupdate: reference case baru Tech/High/Medium/Cafe → bobot' 0.500/0.184/0.147/0.169 → Sleman 75,9 (Best Match), Kota 74,8, Bantul 68,0.

**Hasil simulasi 192 kombinasi (data DB, multiplier baru):** pemenang tersebar Sleman 68×, Bantul 66×, Kota Yogyakarta 34×, Gunungkidul 24×; tiap persona punya 3–4 kemungkinan Best Match dan 10–11 urutan ranking unik (sebelumnya 3–7 unik dan 1–2 pemenang). Kulon Progo tetap tidak pernah menang — wajar, profilnya "berkembang" dan selalu kalah niche dari Bantul (lebih seimbang) atau Gunungkidul (lebih murah+tenang).

**Catatan:** tidak perlu re-seed DB — data skor di Neon tidak berubah, yang berubah hanya logika bobot di client.

**Verifikasi:** `tsc --noEmit` bersih; simulasi reference case match dengan angka yang ditulis ke CLAUDE.md/Dok 1.

---

### 2026-07-06 lanjutan 9 — Landing: kartu 5 distrik jadi expand penjelasan singkat, bukan navigasi

**Konteks:** User minta tombol "Lihat Detail" di section 5 distrik landing page tidak lagi pindah ke `/district/:id`, melainkan menampilkan penjelasan singkat inline.

**Fix:** di `DistrictPreviewSection.tsx`, `<Link>` "Lihat Detail" diganti `<button>` yang men-toggle panel penjelasan (`d.alasan`) yang sama dengan toggle di area judul kartu; label berubah "Lihat Detail"/"Tutup" + chevron berputar. Route `/district/:id` sendiri tetap ada (permanen §6).

**Verifikasi:** `tsc --noEmit` bersih.

---

### 2026-07-06 lanjutan 8 — Fix noda gradasi mentah di pojok kiri-atas navbar Landing/Quiz

**Konteks:** User kirim screenshot dengan lingkaran menandai pojok kiri-atas halaman Landing — ada noda warna oranye/peach mentah yang kelihatan tidak disengaja, di celah antara tepi viewport dan pill navbar.

**Root cause:** Wrapper sticky navbar (lanjutan 6/7) cuma berupa `<div>` transparan dengan padding (`px-2 top-2`) — celah di sekitar pill langsung menampakkan `AmbientBackground` yang gradasinya pekat di kiri (by design, lihat lanjutan sebelumnya soal gradasi kiri-kanan). Di Result page hal ini tidak kelihatan aneh karena pill navbar-nya duduk DI DALAM panel "page frame" yang punya backing sendiri (`bg-paper/70`) — celah di sekitar pill menampakkan backing panel yang lembut, bukan gradasi mentah. Landing/Quiz tidak punya panel pembungkus itu, jadi celahnya menampakkan gradasi vivid langsung.

**Fix:** strip pembungkus navbar dikasih backing sendiri (`bg-paper/80 backdrop-blur-xl`, full-width, `sticky top-0`), pill navbar diletakkan di dalam sub-container `max-w-[1220px]` dengan padding — jadi celah di sekitar pill sekarang menampakkan backing paper/glass yang lembut & konsisten, bukan gradasi mentah, meniru persis cara Result page menghindari masalah yang sama.

**Verifikasi:** screenshot ulang Landing (desktop & mobile) — noda gradasi di pojok sudah hilang, strip navbar terlihat rata & konsisten di seluruh lebar. `tsc`, `eslint`, `npm run build` (22 routes) bersih.

---

### 2026-07-06 lanjutan 7 — Fix PillNavbar "kepotong" di layar sempit + efek glass

**Konteks:** Setelah Landing & Quiz pindah ke `PillNavbar` (lanjutan 6), user lapor heading/header terlihat "kepotong" di layar sempit, dan minta navbar dibuat transparan seperti glass.

**Root cause "kepotong":** `PillNavbar` pakai `@container` query untuk sembunyikan teks brand (`@[420px]`) dan link navigasi (`@[560px]`) di lebar sempit — TAPI tidak ada pengganti (hamburger/menu) sama sekali. Hasilnya di mobile: cuma logo "F" di kiri dan tombol "Mulai" di kanan, dengan celah kosong besar di tengah — kelihatan seperti navbar yang rusak/terpotong, dan navigasi (Cara Kerja/Indikator/Distrik) jadi TIDAK BISA DIAKSES SAMA SEKALI di layar sempit (regresi fungsional nyata, bukan cuma kosmetik).

**Fix:**
- Tambah tombol hamburger (`@[560px]:hidden`, jadi cuma muncul saat link disembunyikan) yang membuka dropdown berisi semua nav link + CTA "Mulai" — mengembalikan akses navigasi penuh di mobile.
- Background `PillNavbar` diganti dari solid `bg-white` jadi glass: `bg-white/70 backdrop-blur-xl border border-white/50` — konten di belakangnya (foto hero, dsb) terlihat blur transparan mengikuti pola `GlassNavbar` lama.

**Verifikasi:** Playwright screenshot 3 breakpoint (desktop 1440/tablet 768/mobile 375) untuk Landing & Quiz — mobile sekarang tampil ikon hamburger (bukan celah kosong), diklik → dropdown muncul dengan 4 link + CTA, aktif-state "Beranda" ke-highlight benar. Efek glass terlihat jelas (konten di belakang pill blur transparan) di semua breakpoint. `tsc`, `eslint`, `npm run build` (22 routes) bersih.

---

### 2026-07-06 lanjutan 6 — Satukan navbar Landing & Quiz jadi PillNavbar (sama seperti Result)

**Permintaan user:** navbar di Landing dan Quiz dibuat sama seperti navbar di halaman Result.

**Perubahan:**
- `app/page.tsx` (Landing) — `GlassNavbar` (sticky full-width, glass background) diganti `PillNavbar` (dibungkus `sticky top-2 z-50 mx-auto max-w-[1220px]`, supaya melayang mirip Result tapi tetap sticky — Result sendiri tidak sticky karena scroll di dalam panel, Landing/Quiz scroll penuh halaman jadi sticky lebih masuk akal untuk UX).
- `app/quiz/page.tsx` — `Navbar showStartQuiz={false}` (dipakai 2 tempat: state `isCalculating` & state normal) diganti `PillNavbar` dengan pembungkus sticky yang sama.
- `components/shared/PillNavbar.tsx` — tambah logic sembunyikan CTA "Mulai" otomatis kalau `pathname` diawali `/quiz` (menggantikan prop `showStartQuiz={false}` yang dulu ada di `Navbar` lama — supaya tidak menawarkan "mulai quiz" saat user sudah di dalam quiz itu sendiri).
- `components/landing/GlassNavbar.tsx` **dihapus** — sudah tidak dipakai di mana pun setelah landing berpindah ke `PillNavbar`.
- `components/shared/Navbar.tsx` (lama) sengaja TIDAK dihapus — masih dipakai `/algoritma` dan halaman 404, di luar scope permintaan ini (cuma Landing & Quiz yang diminta).

**Verifikasi:** Playwright screenshot Landing (termasuk cek sticky saat di-scroll 1500px, navbar tetap di atas), Quiz Step 1 (CTA "Mulai" dicek terhitung 0 di navbar), dan Quiz state "Menghitung hasil" — ketiganya tampil pill navbar identik dengan Result. `tsc`, `eslint`, `npm run build` (22 routes) bersih.

---

### 2026-07-06 lanjutan 5 — Pindahkan link "Admin" dari navbar ke footer di semua halaman publik

**Permintaan user:** hilangkan "Admin" dari navbar di semua halaman, akses ke panel admin cukup lewat footer — meniru pola yang sudah ada di landing page (`LandingFooter.tsx` sudah punya link Admin di footer sejak awal).

**Perubahan:**
- `components/shared/Navbar.tsx` (dipakai Quiz, Algoritma, 404) — hapus entri "Admin" dari array `links` + hapus cabang `isActive` khusus admin yang jadi mati.
- `components/shared/PillNavbar.tsx` (dipakai Result, District Detail, Compare, Assistant) — hapus entri "Admin" dari `NAV_LINKS`.
- `components/shared/Footer.tsx` (dipakai lewat `ConditionalFooter` di Quiz/Algoritma/District/Compare/Assistant/404) — tambah link "Admin" di sisi kanan, sejajar dengan teks sumber data.

**Catatan jujur (bukan disembunyikan):** halaman **Result** (`/result`) sengaja tidak punya footer sama sekali sejak sesi rebuild sebelumnya (meniru persis `hasil-rekomendasi.html`). Karena PillNavbar-nya juga kehilangan link Admin di perubahan ini, **halaman Result sekarang tidak punya jalur ke Admin sama sekali** — user harus pindah ke halaman lain (Quiz/Distrik/dll) dulu untuk akses Admin. Tidak menambah footer ke Result karena itu mengubah keputusan desain yang sudah divalidasi sebelumnya; kalau user mau Result tetap punya akses admin, perlu keputusan eksplisit.

**Verifikasi:** dicek programatis (Playwright) jumlah kemunculan teks "Admin" di elemen `<nav>` dan `<footer>` di 5 halaman (quiz, algoritma, result, compare, landing) — nav 0 di semua, footer 1 di semua KECUALI result (0, sesuai catatan di atas). `tsc`, `eslint`, `npm run build` (22 routes) bersih.

---

### 2026-07-06 lanjutan 4 — FCI Assistant: 5 chip saja, jeda jawaban 2 detik, tombol pindah ke kanan + ganti ikon

**Permintaan user:** (1) chip pertanyaan template maksimal 5, (2) jawaban tidak instan — jeda 2 detik, (3) tombol trigger chat pindah ke kanan, (4) ganti ikon tombolnya.

**1. Chip dibatasi 5:** `lib/assistant/qaBank.ts` — tambah `SUGGESTED_CHIP_IDS` (5 id: why-best, how-score, persona-diff, below-umk, change-input), dipakai `AssistantChat.tsx` untuk render chip. `QA_BANK` penuh (11 entri) TETAP dipakai oleh `matchQuestion()` untuk pencocokan kata kunci teks bebas — jadi pertanyaan soal indikator spesifik/tiebreaker tetap terjawab kalau diketik manual, cuma tidak muncul sebagai chip.

**2. Jeda 2 detik + indikator "mengetik":** `AssistantChat.tsx` — `REPLY_DELAY_MS = 2000` (sebelumnya 250ms), tambah animasi 3 titik "sedang mengetik" selama jeda (supaya tidak terasa macet/diam), input & chip didisable selama jeda biar tidak dobel klik.

**3 & 4. Tombol pindah kanan + ikon baru:** `AssistantDock.tsx` — ikon `MessageCircle` → `Bot` (lucide-react), posisi `left-6` → `right-6`.

**Bug nyata ditemukan & diperbaiki saat verifikasi visual (bukan cuma baca kode):** setelah pindah ke kanan, tombolnya "hilang" — root cause: `AssistantDock` & `RelevanceSurvey` dirender di dalam panel ber-`backdrop-blur-2xl` (glass panel dari sesi sebelumnya). CSS `backdrop-filter` di ancestor manapun membuat elemen `position:fixed` di dalamnya ter-anchor ke ancestor itu, BUKAN ke viewport — jadi tombol yang seharusnya "fixed di bawah layar" malah nempel di bawah PANEL yang sangat tinggi (dibuktikan lewat `getBoundingClientRect()`: posisi asli `top:1025px` padahal viewport cuma 900px). Ini bug arsitektur nyata yang sudah ada sejak panel glass ditambahkan, baru ketahuan sekarang. **Fix:** `RelevanceSurvey` & `AssistantDock` di-portal ke `document.body` (`createPortal`, plus hook baru `useHasMounted` pakai `useSyncExternalStore` — bukan `useState`+`useEffect`, supaya tidak kena lint `react-hooks/set-state-in-effect`), melompati semua ancestor bermasalah.

**Efek samping ditemukan sekaligus:** begitu assistant pindah ke kanan, jadi tabrakan dengan `RelevanceSurvey` yang juga fixed bottom-right (posisi lama assistant sengaja kiri justru untuk menghindari ini). Diselesaikan dengan menukar posisi: `RelevanceSurvey` sekarang bottom-LEFT, `AssistantDock` bottom-RIGHT — dua widget floating tidak lagi tumpang tindih.

**Verifikasi nyata via Playwright:** `getBoundingClientRect()` tombol assistant sebelum fix (top:1025, offender: backdrop-filter blur(40px)) vs sesudah fix (top:748, offenders: kosong). Screenshot survey+assistant tampil bersamaan tanpa tumpang tindih. Klik chip → typing indicator muncul dalam 300ms → jawaban muncul di ~2.2 detik (sesuai target). `tsc`, `eslint`, `npm run build` (22 routes) bersih.

---

### 2026-07-06 lanjutan 3 — Perbaiki 3 celah PRD (403 admin, optimistic locking, back-button quiz state)

**Konteks:** Baca ulang isi asli `files/PRD_Revised_v2.1.docx` (bukan cuma ringkasan CLAUDE.md) untuk audit kepatuhan penuh. Ketemu 3 requirement di §6 (User Workflows — Decision Points & Edge Cases) yang belum terpenuhi.

**1. Halaman 403 admin** (PRD §6.2: "Apakah admin memiliki hak akses? NO → 403: 'Anda tidak memiliki izin'"):
- `src/app/admin/403/page.tsx` (baru) — halaman standalone (bypass sidebar, sama seperti login page), copy persis PRD.
- `src/lib/auth.ts` — export `COOKIE_NAME` supaya bisa dipakai ulang.
- `src/app/api/auth/session/route.ts` — dibedakan 2 alasan gagal: `no_session` (belum pernah login → tetap ke `/admin/login`) vs `invalid_session` (cookie ADA tapi token rusak/kedaluwarsa → ke `/admin/403`, requirement PRD-nya baru bisa dipenuhi kalau dibedakan dari "belum login").
- `AdminContext` — state baru `forbidden`, action `SESSION_FORBIDDEN`.
- **Verifikasi nyata:** set cookie `fci_session` isi token rusak lewat Playwright → redirect ke `/admin/403` (bukan `/admin/login`). Tanpa cookie sama sekali → tetap ke `/admin/login`. Dua jalur beda terkonfirmasi.

**2 & 3 sekaligus — Atomic transaction + Optimistic locking** (PRD §6.2 edge case "koneksi database putus saat Simpan: atomic, tidak ada data tersimpan sebagian" DAN "dua admin update distrik sama bersamaan: peringatan konflik"):
- **Root cause lama:** simpan 1 distrik = 4 `PUT /api/admin/scores` terpisah lewat `Promise.all` — kalau 1 dari 4 gagal di tengah jalan, distrik itu berakhir campuran data lama+baru (melanggar PRD).
- **Endpoint baru** `src/app/api/admin/scores/bulk/route.ts` — terima `{districtId, indicators: [{indicatorId, skor, expectedUpdatedAt}]}`, proses SEMUA di dalam satu `prisma.$transaction()` (atomic — kalau satu gagal/konflik, semuanya rollback, tidak ada partial save). Sebelum upsert tiap indikator, dicek `expectedUpdatedAt` yang dikirim client vs `updatedAt` asli di DB saat ini — kalau beda (berarti ada yang mengubah duluan), transaksi dibatalkan dan return `409` dengan pesan jelas.
- `AdminContext.updateScoresBulk()` (baru, menggantikan pola `Promise.all(updateScore(...))` di halaman Data Distrik).
- `admin/data/page.tsx` — `FieldState` sekarang menyimpan `loadedUpdatedAt` (snapshot saat form dibuka), dikirim balik sebagai `expectedUpdatedAt` saat simpan. Kalau server balas 409, tampilkan banner amber per-distrik + tombol "Muat Ulang Halaman", tombol Simpan didisable sampai reload.
- **Verifikasi nyata (bukan cuma baca kode):** simulasikan "2 admin" — buka form di satu sesi, lalu sesi LAIN (fetch langsung ke endpoint bulk) menyimpan Sleman/Internet duluan. Sesi pertama coba simpan nilai berbeda → banner konflik muncul persis ("Data Sleman sudah diubah di sesi lain..."), dan dicek ke database: nilai yang tersimpan tetap punya sesi lain (84), BUKAN nilai yang barusan dicoba disimpan (77) — membuktikan optimistic locking benar-benar mencegah overwrite diam-diam.

**4. Quiz: state tidak hilang saat browser Back** (PRD §6.1 edge case: "Back browser setelah lihat hasil: pertahankan state quiz, jangan mengulang dari awal"):
- **Root cause:** `useQuizState` cuma `useState` polos di komponen `/quiz`, dan navigasi ke `/result` pakai `router.push` tanpa pernah meng-update entri history `/quiz` itu sendiri — jadi Back selalu balik ke `/quiz` kosong.
- **Fix:** `app/quiz/page.tsx` sekarang baca state awal dari query URL (`readInitialInput`, divalidasi ketat per field) via `useSearchParams` (dibungkus `Suspense`), DAN setiap kali input berubah, `router.replace` (bukan `push` — tidak nambah history) memperbarui URL `/quiz` supaya selalu mencerminkan input terakhir. Begitu user lanjut ke `/result`, entri `/quiz` di history sudah "terisi", jadi Back mengembalikan state penuh.
- **Bug ditemukan & diperbaiki saat testing sendiri:** percobaan pertama function `readInitialInput` mengembalikan object dengan key ber-nilai `undefined` eksplisit untuk field yang tidak ada di URL — ini menimpa `DEFAULTS` lewat spread (`{...DEFAULTS, ...initial}` tetap menimpa walau valuenya `undefined`, karena key-nya ada), bikin Step 2 (Algorithm Explanation) selalu blank karena `quiz.completeInput` selalu `null`. Diperbaiki: key yang tidak valid/tidak ada di URL di-OMIT sepenuhnya dari object, bukan diisi `undefined`.
- **Verifikasi nyata:** Playwright isi persona+internet priority di quiz, lanjut sampai `/result`, tekan Back browser → kembali ke `/quiz` dengan persona/budget/prioritas semua ter-restore (dicek lewat className card "border-sawah bg-sawah/5" = state terpilih, dan screenshot visual).

**Verifikasi keseluruhan:** `tsc --noEmit` bersih, `eslint` 0 error baru (1 pre-existing di `admin/data/page.tsx` tetap ada, tidak disentuh), `npm run build` sukses 22 routes (+2 dari sebelumnya: `/admin/403`, `/api/admin/scores/bulk`).

---

### 2026-07-06 lanjutan 2 — Rebalance data skor 5 distrik: Sleman tidak lagi menang di semua persona

**Konteks:** User perhatikan hasil quiz **selalu** merekomendasikan Sleman apa pun persona yang dipilih. Diinvestigasi dulu apakah ini bug di `lib/scoring/*` — ternyata TIDAK, formula & bobot sudah benar dan deterministik (dicek ulang manual + reference case resmi cocok). Penyebabnya murni di **data skor seed**: Sleman kebetulan jadi "generalis" tanpa kelemahan mencolok di 4 indikator, sehingga menang di hampir semua kombinasi bobot persona.

**Temuan sampingan penting:** ketahuan 2 nilai skor di database live **berbeda dari `prisma/seed.ts`** — Bantul/internet seharusnya 70 (di DB jadi 55) dan Sleman/cost seharusnya 70 (di DB jadi 65). Dikonfirmasi lewat cross-check manual pakai reference case resmi CLAUDE.md §5.4 (Sleman 79.2/Kota 77.4/Bantul 72.1) — angka itu HANYA cocok kalau pakai nilai asli seed, bukan nilai yang ada di DB saat itu. Audit log tidak mencatat perubahan ini sama sekali (cuma ada 1 entri, punya sesi testing sebelumnya) — artinya drift terjadi lewat jalur di luar `PUT /api/admin/scores` (kemungkinan reset/query manual di masa lalu), bukan lewat panel admin. Tidak sempat ditelusuri lebih jauh sumbernya, tapi sekalian diperbaiki lewat rebalance ini.

**Pendekatan:** dibuat script simulasi standalone (reimplementasi persis formula `lib/scoring/normalize.ts` + `score.ts`) untuk iterasi cepat cari kombinasi skor yang: (1) tiap persona idealnya beda pemenang default-nya, (2) DALAM satu persona, pemenang bisa berubah kalau sinyal quiz lain (internet/community priority, environment preference) digeser jauh — sesuai permintaan eksplisit user, bukan cuma "beda per persona" tapi juga "beda per kombinasi jawaban".

**Skor baru** (`prisma/seed.ts` + diterapkan ke DB live lewat `PUT /api/admin/scores` berulang, supaya tercatat rapi di Audit Log — bukan lewat script SQL langsung):

| Distrik | Internet | Cost | Community | Environment |
|---|--:|--:|--:|--:|
| Kota Yogyakarta | 88 | 42 | 97 | 52 |
| Sleman | 84 | 60 | 75 | 70 |
| Bantul | 58 | 78 | 62 | 92 |
| Kulon Progo | 45 | 90 | 40 | 82 |
| Gunungkidul | 32 | 99 | 26 | 95 |

Nilai baru sengaja lebih konsisten dengan `ringkasanKarakteristik` masing-masing distrik (Kota = internet/komunitas terbaik tapi termahal, Bantul = lingkungan tenang, Gunungkidul = termurah+paling tenang tapi internet/komunitas terlemah, dst).

**Hasil default (semua sinyal Medium/Flexible) per persona** — diverifikasi nyata lewat Playwright ke `/result`, bukan cuma simulasi:
- Tech Professional → **Sleman** 74.1/100
- Creative Professional → **Bantul** 74.2/100
- Student & Fresh Graduate → **Bantul** 72.9/100 (tapi lihat di bawah)
- Digital Nomad → **Sleman** 73.0/100

**Bukti sensitivitas sinyal (bukan cuma persona)** — Student & Fresh Graduate dengan Internet Priority **Low** + Community Priority **Low** + Environment **Quiet** → pemenang berubah jadi **Gunungkidul** 77.1/100 (bukan Bantul lagi). Ini membuktikan jawaban lain di quiz, bukan cuma persona, memengaruhi hasil — sesuai yang diminta user.

**Reference case resmi CLAUDE.md §5.4 ikut diperbarui** (angka lama 79.2/77.4/72.1 dari data lama, sekarang 74.9/73.6/68.8 dari data baru — narasi tetap sama, Sleman tetap Best Match untuk Tech Professional + Internet High + Community Medium + Environment Cafe, cuma angka mentahnya berubah karena datanya berubah). File yang ikut disinkronkan: `CLAUDE.md` §5.4, `PROJECT_SUMMARY.md` §4.5, dan contoh angka hardcode di hero landing (`app/page.tsx`, "Contoh: Sleman 79.2/100" → "74.9/100"). Dokumen historis (`RIWAYAT_PENGERJAAN.md` entri lama, `GSD/`, `Tahapan/`) SENGAJA tidak diubah — itu catatan riwayat apa yang terjadi saat itu, bukan spek hidup.

**Verifikasi:** `tsc --noEmit` bersih. Playwright screenshot 6 skenario (`/result` dengan query param berbeda) mengonfirmasi pemenang sesuai simulasi persis, termasuk kasus sensitivitas sinyal Student di atas.

---

### 2026-07-06 lanjutan — Rebuild total halaman Admin mengikuti referensi `admin-dashboard.html`

**Konteks:** User minta halaman admin dibangun ulang persis seperti mockup referensi (`Referensi ui/html ui/admin-dashboard.html` + gambar ChatGPT terkait). Mockup itu ternyata punya sidebar jauh lebih luas dari fitur nyata (Persona, FAQ, Banner, Testimoni, Pengguna, Pengaturan, Riwayat Quiz, Konten Halaman — semua tidak ada implementasinya). Diklarifikasi dulu via AskUserQuestion: user pilih **visual saja untuk fitur yang sudah ada**, sisanya TIDAK ditampilkan dulu (bukan ditampilkan sebagai "segera hadir"), disimpan sebagai catatan untuk nanti kalau ditambah beneran.

**Token warna & font baru, scoped khusus admin:** `.admin-theme` di `globals.css` — token `--a-*` (bg krem `#f4f2f0`, red `#e0263c`, dst.) persis nilai hex di referensi, TIDAK bercampur dengan token publik `--sawah`/`--paper` (admin sengaja punya identitas visual "tool" sendiri, beda dari halaman publik — ini pola umum, bukan inkonsistensi). Font **Plus Jakarta Sans** (`next/font/google`) di-scope ke `.admin-theme` saja lewat `AdminLayout`, tidak mengubah Geist Sans/Mono di halaman publik.

**Sidebar & topbar dirombak** (`app/admin/layout.tsx`): nav dipangkas jadi HANYA link yang beneran ada halamannya — Dashboard, Beranda Website (`/`), Lihat Hasil Rekomendasi (`/result`), lalu section "Data & Evaluasi": Data Distrik, Log Aktivitas. Master Data/Konten/Sistem-Pengguna-Pengaturan dari mockup SENGAJA dihilangkan total (bukan disembunyikan doang, memang tidak dirender). Topbar baru: kotak cari (nyata — filter live, lihat di bawah), date pill (tanggal hari ini beneran, bukan hardcode), user dropdown (avatar+nama dari session asli, tombol Keluar = logout sungguhan). Tombol "Muat Ulang Data" di sidebar = reload halaman sungguhan (refresh data terbaru dari DB).

**Fitur baru — search real, bukan dekorasi:** `contexts/AdminSearchContext.tsx`, query dibagi lewat context (bukan URL param, supaya sederhana) — dipakai di Dashboard (filter tabel Data Distrik), `/admin/data` (filter kartu distrik yang tampil), `/admin/audit` (filter baris log by nama distrik/indikator). Ketik "sleman" beneran memfilter data asli di ketiga halaman itu.

**Dashboard (`app/admin/page.tsx`) dirombak total, SEMUA data real:**
- Hero: foto asli Kota Yogyakarta (bukan ilustrasi SVG mockup), greeting pakai `state.username` sungguhan.
- 4 stat card (mockup punya 5, "Total Quiz 1.248" DIHAPUS karena tidak ada persisted quiz history di V1 — lihat CLAUDE.md §2 efemeral): Total Distrik, Total Indikator, Rata-rata Skor (dihitung live dari semua skor), Terakhir Diperbarui (real, dari `updatedAt` terbaru).
- "Ringkasan Skor Distrik": ranking real by rata-rata skor, foto distrik asli sebagai thumbnail (bukan SVG ilustrasi), badge "TERTINGGI" (bukan "Best Match" — dihindari klaim persona-spesifik di konteks non-quiz).
- "Bobot Indikator per Persona" — mockup nunjukin 1 set bobot seolah "bobot saat ini" (padahal bobot beda per 4 persona, kalau ditampilkan rata bisa menyesatkan). Diganti jadi panel dengan **tab switcher 4 persona** (reuse `BASE_WEIGHTS` dari `lib/scoring/weights.ts`, data yang sama dipakai quiz sungguhan), jadi akurat, bukan angka fiktif.
- "Aktivitas Terbaru": 5 entri Audit Log asli (hook baru `useAuditLog`, dipakai bareng Dashboard preview & halaman Audit penuh — no duplikasi CLAUDE.md §15.10), BUKAN "Login ke sistem"/"FAQ baru" fiktif dari mockup.
- "Riwayat Quiz Terbaru" dari mockup **DIHAPUS TOTAL** — tidak ada data quiz history tersimpan di V1 (ephemeral by design, §2).
- "Data Distrik" tabel: foto asli, hanya tombol Edit (bukan Edit+Hapus — hapus distrik bukan fitur nyata, 5 distrik itu fixed).
- "Menu Cepat": cuma 4 tile yang link ke halaman sungguhan (Data Distrik, Log Aktivitas, Lihat Hasil, Beranda) — mockup punya 8 tile, setengahnya ke fitur fiktif.

**Bug nyata ditemukan & diperbaiki saat rebuild Audit Log:** `app/admin/audit/page.tsx` sebelumnya pakai field `entry.oldValue`/`entry.newValue` di interface TypeScript-nya, padahal API `/api/admin/audit` (dan schema Prisma) beneran mengembalikan `nilaiLama`/`nilaiBaru` — field yang dipakai frontend TIDAK PERNAH COCOK sejak awal, jadi kolom "Nilai Lama"/"Nilai Baru" selalu tampil `undefined` di produksi. Diperbaiki jadi baca field yang benar.

**Bug lingkungan (bukan kode) ditemukan saat testing:** setelah nambah `.admin-theme` block ke `globals.css`, dev server (yang sudah jalan dari sesi sebelumnya) tidak mem-parse ulang rule barunya — hasilnya semua `bg-[var(--a-red)]` dkk resolve ke transparent (variabel CSS kosong), bikin tombol/logo/ikon jadi putih-di-atas-putih alias "hilang". Root cause: cache Turbopack basi. Fix: hapus folder `.next` + restart dev server dari nol.

**Verifikasi:** `tsc --noEmit` bersih, `eslint` 0 error baru (1 error pre-existing di `admin/data/page.tsx` setState-in-effect tetap ada, sengaja tidak disentuh — sama seperti sesi-sesi sebelumnya). `npm run build` sukses 20 routes. Login end-to-end via Playwright (isi form sungguhan, bukan skip auth), screenshot Dashboard/Data Distrik/Log Aktivitas/Login (desktop+mobile) — semua cocok sangat dekat dengan referensi. Fitur interaktif dites nyata: search "sleman" beneran memfilter, tab persona "Creative" beneran ganti ke 20/25/25/30%, tombol Keluar beneran logout & redirect ke `/admin/login`.

---

### 2026-07-06 — Survei Relevance Score: persist ke database (sebelumnya efemeral)

**Konteks:** Sesi 2026-06-27, `RelevanceSurvey.tsx` sengaja dibuat efemeral dulu ("buat sementara dulu, nanti kalau fix baru simpan ke DB"). Sekarang dilanjutkan.

**Schema:** tambah model `Survey` di `prisma/schema.prisma` (`relevansi` & `kemudahan` Int 1–5, `komentar` & `personaId` opsional, `createdAt` default now). Migration `20260705172336_add_survey` diterapkan ke Neon via `prisma migrate dev`.

**API baru:** `POST /api/survey` (`src/app/api/survey/route.ts`) — publik tanpa auth (survei anonim), validasi `relevansi`/`kemudahan` harus integer 1–5, `personaId` divalidasi terhadap 4 id persona baku kalau diisi, `komentar` di-trim & dipotong maks 300 karakter.

**Frontend:** `persistResponse()` di `RelevanceSurvey.tsx` (sebelumnya `TODO(db)` kosong) sekarang `fetch("/api/survey", ...)` sungguhan. Kegagalan network sengaja tidak menghalangi UX "Terima kasih" tampil (survei suplemen, bukan alur inti — §2 nilai produk tetap utuh).

**Bug operasional ditemukan saat testing:** endpoint sempat 500 terus-menerus meski migration sudah sukses — root cause: dev server yang sedang jalan masih pegang instance `PrismaClient` lama (singleton di `lib/db.ts` sengaja di-cache di `globalForPrisma` untuk hindari koneksi berlebih saat Fast Refresh), jadi model `Survey` baru tidak dikenali sampai proses di-restart total (regenerate client + reload module saja tidak cukup). Pelajaran: restart dev server wajib setelah `prisma migrate` menambah model baru, tidak cukup andalkan Fast Refresh.

**Verifikasi:** `tsc`, `eslint`, `npm run build` (20 routes) bersih. Tes langsung via curl: submit valid → 201 + id tersimpan, validasi gagal (relevansi di luar 1–5) → 400. Playwright dicek popup survei muncul otomatis di `/result` tanpa console error.

---

### 2026-07-05 lanjutan 14 — Fix bug: foto hero & foto 5 distrik tidak muncul di versi live Vercel

**Konteks:** Setelah push commit `de01985`, dicek langsung di versi live (https://project-psi-gamma.vercel.app/) — foto Tugu Jogja di hero landing & foto landmark di kartu ranking distrik hilang total (cuma gradasi ambient polos), padahal di `npm run dev` lokal semuanya normal.

**Root cause:** `.gitignore` root punya aturan blanket `*.jpeg`/`*.jpg`/`*.png` (dimaksudkan untuk blokir screenshot/referensi non-kode, sesuai commit `c160267` sesi 2026-06-28). Aturan ini ternyata ikut memblokir `freelance-city-index/public/images/**` — folder aset foto SUNGGUHAN yang dipakai aplikasi (hero-yogyakarta.jpeg, 5 foto hero/{id}.jpg, 5 foto districts/{id}.jpg, total 4.1MB). Akibatnya folder ini TIDAK PERNAH ter-commit sejak awal, jadi tidak ada di GitHub → Vercel build tidak punya file-nya sama sekali. Lolos tanpa ketahuan karena dev server lokal baca langsung dari disk, tidak lewat git.

**Perbaikan:** tambah exception di `.gitignore` — `!freelance-city-index/public/images/**` setelah aturan blanket, supaya git kembali melacak folder ini tanpa perlu melonggarkan aturan blokir screenshot di tempat lain. 11 file foto (4.1MB) berhasil ditambahkan ke git untuk pertama kalinya.

**Pelajaran:** kalau ada `.gitignore` blanket by-extension, selalu cek ulang apakah ada folder aset FUNGSIONAL (bukan cuma referensi) yang kena imbas — `git ls-files public/` vs isi folder asli di disk adalah cara cepat mendeteksi ini.

---

### 2026-07-05 lanjutan 13 — Panel "page frame" jadi glass/frosted, fix section Algoritma yang solid nutup ambient — ✅ SUDAH DI-COMMIT (commit de01985, 2026-07-05)

**Konteks:** User perhatikan Result, District Detail, Compare, Assistant punya kasus yang sama seperti bug lama section "5 Distrik" di landing (lanjutan 11) — panel besar `bg-paper` solid menutup gradasi ambient sepenuhnya, cuma nyisa di margin tipis sekitar panel. Diminta ganti jadi gaya "glass"/"gelembung" (bukan cuma dihapus transparan polos, seperti fix landing dulu).

**Perbaikan panel "page frame":** `bg-paper` solid di 4 halaman (`result/page.tsx`, `district/[id]/page.tsx`, `compare/page.tsx`, `assistant/page.tsx`) diganti `bg-paper/70 backdrop-blur-2xl border border-white/50` — gradasi ambient sekarang tembus samar-samar (efek frosted glass) lewat panel utama, bukan tertutup total. Kartu-kartu di dalamnya (hero card, kartu ranking, tabel) tetap solid seperti biasa — itu bukan bug, itu kartu konten normal.

**Fix tambahan (root cause sama seperti "5 Distrik"):** `AlgorithmSection.tsx` baris 406 punya `<section className="bg-paper">` yang membungkus SELURUH isi halaman `/algoritma` di bawah header — satu-satunya pemakai komponen ini, jadi aman dihapus `bg-paper`-nya. Sebelumnya, begitu discroll melewati header, ambient langsung ketutup rata sepanjang sisa halaman (persis bug 5 Distrik). Sekarang gradasi kiri-hangat→kanan-pudar konsisten kelihatan dari atas sampai bawah `/algoritma`.

**Verifikasi:** `tsc`, `eslint`, `npm run build` (19 routes) bersih. Screenshot Playwright Result & Algoritma menunjukkan efek glass di border panel Result (halo warna tipis nyampur di sudut-sudut panel) dan gradasi utuh tanpa blok solid di Algoritma.

---

### 2026-07-05 lanjutan 12 — Ambient background jadi kiri→kanan, dipasang di SEMUA halaman publik (bukan cuma landing) — ✅ SUDAH DI-COMMIT (commit de01985, 2026-07-05)

**Konteks:** User minta arah gradasi `LandingBackground` diubah dari atas-bawah jadi kiri-ke-kanan, warna pekat di kiri memudar ke kanan tapi tetap kelihatan samar (bukan rata/flat). Setelah dicoba, muncul bug baru: warnanya cuma kelihatan di kiri lalu "hilang" mendadak sekitar tengah layar.

**Root cause bug "hilang di tengah":** warna sebelumnya dibawa mayoritas oleh `radial-gradient` yang posisinya di sekitar 1/3 atas viewport (`at 8% 30%` dst). Karena bentuknya elips, semakin jauh posisi Y dari titik pusat elipsnya, jangkauan warna ke arah X makin menyempit drastis — dan area yang paling sering kelihatan (tepi bawah viewport, karena hero photo menutupi sisanya) justru jauh dari pusat elips itu, jadi warnanya sudah menyempit habis sebelum sampai tengah. Ditambah ada `radial-gradient` putih besar di tengah-bawah yang meratakan lagi sisa warnanya.

**Perbaikan:** `linear-gradient(90deg, ...)` dijadikan pembawa warna utama (banyak color-stop dari peach hangat `#f6d3ab` di kiri sampai lavender pudar `#e6e5ef` di kanan) — linear-gradient tidak bergantung posisi Y sama sekali, jadi konsisten di ketinggian scroll berapa pun. `radial-gradient` cuma disisakan sebagai aksen tipis dekat kiri-atas, radial putih besar yang meratakan warna dihapus total.

**Refactor sekalian (permintaan user "buat untuk semua halaman kecuali admin"):** komponen dipindah dari `components/landing/LandingBackground.tsx` → `components/shared/AmbientBackground.tsx` (dipakai >1 halaman, sesuai CLAUDE.md §15.10) dan dipasang di **Landing, Quiz (2 return: calculating + normal), Result, District Detail, Compare, Assistant, Algoritma** — total 7 halaman publik. Tiap halaman yang tadinya punya background statis sendiri (`bg-paper` solid di Quiz/Algoritma, atau `linear-gradient(135deg, #ecebf4...)` hardcoded di Result/District/Compare/Assistant) diganti pakai satu `<AmbientBackground />` fixed yang sama, supaya identitasnya konsisten di seluruh app. Halaman `/admin/*` sengaja tidak disentuh (layout sidebar solid, bukan "mengambang" seperti halaman publik).

**Verifikasi:** `tsc --noEmit` bersih, `eslint` 0 error di semua file yang diubah, `npm run build` sukses 19 routes. Screenshot Playwright di Landing/Quiz/Result/Algoritma (1440px) menunjukkan gradasi kiri-hangat→kanan-pudar konsisten di semua halaman, paling jelas kelihatan di Quiz (banyak celah transparan antar-kartu) dan di border tipis "page frame" Result/District/Compare/Assistant.

---

### 2026-07-05 lanjutan 11 — Fix: section "5 Distrik" satu-satunya yang tidak nyambung dengan gradasi ambient — ✅ SUDAH DI-COMMIT (commit de01985, 2026-07-05)

**Konteks:** Lanjutan dari perbaikan `LandingBackground` sebelumnya. User perhatikan section "5 Distrik yang Dievaluasi" beda sendiri — pas discroll ke situ, gradasi ambient di baliknya langsung ilang/ketutup, padahal section lain (Why FCI, Cara Kerja, Indikator) semuanya konsisten membiarkan gradasi tetap kelihatan nyambung.

**Root cause:** `DistrictPreviewSection.tsx` baris 63, `<section>`-nya punya `bg-paper` (solid), satu-satunya section landing yang punya background sendiri — sementara semua section lain transparan sehingga `LandingBackground` (`fixed`, di belakang semua konten) tetap kelihatan menembus dengan konsisten.

**Perbaikan:** hapus `bg-paper` dari section itu (`isolate overflow-hidden` dipertahankan, tidak memengaruhi background). Setiap kartu distrik di dalamnya sudah aman (foto & overlay masing-masing sudah pakai `overflow-hidden` sendiri di level kartu), jadi tidak ada resiko foto kartu jadi bocor kemana-mana.

**Verifikasi:** `tsc`, `eslint`, `npm run build` bersih. Screenshot Playwright full-scroll (1440×3200) menunjukkan section "5 Distrik" sekarang menyatu mulus dengan gradasi lavender yang sama seperti section lainnya, tidak ada lagi blok warna solid yang terlihat beda sendiri.

---

### 2026-07-05 lanjutan 10 — LandingBackground: ganti foto redup jadi gradasi warna (hilangkan efek "bayangan gambar") — ✅ SUDAH DI-COMMIT (commit de01985, 2026-07-05)

**Konteks:** User nanya kenapa ada "bayangan dari gambar" pas scroll di landing page, khususnya di section "Mengapa Freelance City Index?" yang ditandai di screenshot. Jawabannya: section itu sendiri tidak punya background, yang bocor kelihatan adalah `LandingBackground` — komponen `fixed inset-0 -z-30` yang mount sekali di seluruh halaman, isinya foto `/images/hero-yogyakarta.jpeg` opacity 0.16 + gradient. Karena `fixed`, foto samar itu tetap kelihatan menembus di belakang section manapun yang backgroundnya tidak solid, sepanjang scroll.

User minta diganti jadi gradasi warna murni (bukan foto) meniru referensi (`Referensi ui/ui/Landing page.png`) yang punya nuansa "siluet matahari/cahaya" (langit pink-oranye hangat di atas, memudar ke lavender/putih di bawah).

**Perubahan:** `src/components/landing/LandingBackground.tsx` — hapus elemen `<Image>` (foto lanskap) sepenuhnya. Ganti jadi kombinasi CSS gradient saja: radial glow hangat oranye/peach (baru, efek "cahaya matahari") + radial glow merah brand & teal yang sudah ada (dipertahankan, ditata ulang sedikit) + radial putih di bawah untuk keterbacaan + linear-gradient dasar peach→lavender (`#fdf0e4 → #f6eef0 → var(--paper)`). Semua di satu elemen `fixed`, tidak ada lagi foto yang bisa "bocor" jadi bayangan siluet gambar di section manapun.

**Verifikasi:** `tsc`, `eslint`, `npm run build` bersih. Screenshot Playwright desktop (1440px) & mobile (390px): section "Mengapa Freelance City Index?" sekarang solid gradasi warna, tidak ada lagi jejak foto yang tembus pandang; nuansa hangat di navbar/hero atas tetap konsisten sampai ke section bawah.

---

### 2026-07-05 lanjutan 9 — Samakan lebar page-frame di layar lebar (Result/District/Compare/Assistant) — ✅ SUDAH DI-COMMIT (commit de01985, 2026-07-05)

**Konteks:** User nanya kenapa lebar halaman Result, District Detail, Compare, dan Assistant beda-beda. Jawabannya: tiap halaman direstyle dari file referensi HTML yang beda (`hasil-rekomendasi.html`=1220px, `detail-distrik.html`=1480px, `bandingkan-distrik.html`=1180px), dan Assistant dibuat baru dengan angka sendiri (820px) — jadi lebar page-frame ikut nilai `.page { max-width }` di tiap file asalnya, bukan diseragamkan. User minta disamakan: **di layar lebar (laptop/monitor) semua harus sama lebarnya**, di HP tetap seperti biasa (responsive normal).

**Perubahan:** frame luar (`rounded-[26px] bg-paper` yang membungkus `PillNavbar` + konten) disamakan ke **`max-w-[1220px]`** di 4 halaman: District Detail (`1480px` → `1220px`), Compare (`1180px` → `1220px`), Assistant (`820px` → `1220px`, tapi ditambah wrapper dalam `max-w-[640px] mx-auto` khusus di sekitar kartu chat-nya sendiri — supaya frame luarnya konsisten 1220px kayak halaman lain, tapi isi chat-nya tidak jadi lebar-lebar amat dan tetap nyaman dibaca). Result tidak berubah (memang sudah 1220px, jadi angka acuannya).

**Kenapa mobile tidak perlu diubah:** `max-w-[...]` cuma jadi batas atas — di layar HP (<768px) yang sebenarnya menentukan lebar adalah viewport + padding `p-2 sm:p-4`, bukan angka max-width, jadi tampilan di HP otomatis sudah "seperti biasa" tanpa perlu perubahan apa pun.

**Verifikasi:** `tsc`, `eslint`, `npm run build` bersih. Screenshot Playwright di 1440px lebar: District Detail, Compare, Assistant sekarang sama persis lebar frame-nya dengan Result — tidak ada konten yang jadi sempit/terpotong di District Detail meski turun dari 1480px. Dicek juga di 390px (mobile) — layout District Detail tidak berubah sama sekali.

---

### 2026-07-05 lanjutan 8 — FCI Assistant: panel docked di layar lebar (bukan cuma halaman penuh) — ✅ SUDAH DI-COMMIT (commit de01985, 2026-07-05)

**Konteks:** Revisi atas fitur FCI Assistant yang baru dibuat di entri sebelumnya. User kasih referensi gambar mockup awal (`Referensi ui/ui/ChatGPT Image 4 Jul 2026, 20.41.39.png`, gambar yang sejak awal jadi acuan rencana widget ini) yang menunjukkan chat muncul sebagai **panel di samping** halaman Result, bukan pindah halaman — tapi user juga sadar itu cuma masuk akal di layar lebar. Jadi diminta: **layar sempit (HP) tetap pindah ke halaman `/assistant`** (perilaku yang sudah ada), **layar lebar (laptop) klik tombol → muncul panel chat docked di samping kanan halaman**, tanpa reload/pindah halaman.

**Refactor:** logic chat (state pesan, tombol contoh pertanyaan, pencocokan kata kunci, input) dipindah dari `app/assistant/page.tsx` ke komponen bersama baru `components/shared/AssistantChat.tsx` — dipakai di 2 tempat sekarang (halaman penuh & panel docked), sesuai CLAUDE.md §15.10. Trigger button lama (`AssistantFab.tsx`, cuma `<Link>`) diganti `components/shared/AssistantDock.tsx`: render 2 tombol trigger yang saling exclusive lewat CSS breakpoint Tailwind (`lg:hidden` vs `hidden lg:flex`, bukan deteksi JS/matchMedia) — di bawah `lg` yang tampil adalah `<Link>` ke `/assistant`, di `lg` ke atas yang tampil `<button>` yang toggle state `open` dan merender `<AssistantChat>` di dalam panel `fixed` di sisi kanan (overlay di atas konten, BUKAN reflow grid Result page — supaya layout yang sudah dibuat semirip mungkin dengan `hasil-rekomendasi.html` tetap utuh).

**Bug nyata ditemukan & diperbaiki saat verifikasi screenshot:** tombol trigger sempat ditaruh di `bottom-24 right-6`, ternyata tertutup/tertindih oleh `RelevanceSurvey` yang juga `fixed bottom-6 right-6` dan tingginya dinamis (bisa >200px kalau kolom "+ Tambah masukan teks" dibuka) — begitu survey popup muncul otomatis (3.5 detik setelah load), tombol FCI Assistant jadi tidak keklik/keliatan. Diperbaiki dengan pindah trigger ke **`bottom-6 left-6`** (sudut berlawanan), sementara panelnya sendiri tetap docked di kanan (`top-24 right-6 bottom-6`) — jadi tombol & panel sengaja tidak di sisi yang sama.

**Verifikasi:** `tsc`, `eslint`, `npm run build` bersih. Playwright: di viewport 1440px klik tombol → panel muncul TANPA pindah URL (masih di `/result`), klik contoh pertanyaan → jawaban muncul pakai data skor Best Match yang sebenarnya, klik tutup → panel hilang & tombol muncul lagi tanpa ketutup survey. Di viewport 390px (mobile) klik tombol → benar pindah ke `/assistant?...` bawa quiz query params.

---

### 2026-07-05 lanjutan 7 — Fitur baru: FCI Assistant (chatbot rule-based, tanpa API) — ✅ SUDAH DI-COMMIT (commit de01985, 2026-07-05)

**Konteks:** User minta fitur "chatbot asisten kayak AI tapi tanpa API" — ini merujuk ke rencana yang sudah disepakati sebelumnya (lihat entri "Crimson/Paper" di bawah): widget `FCIAssistantWidget.tsx` yang waktu itu cuma dibangun sebagai UI shell statis (percakapan contoh hardcode, input disabled), lalu sempat terlepas total dari halaman manapun saat Result page dirombak ikut `hasil-rekomendasi.html`. Sekarang diaktifkan sungguhan, TETAP tanpa panggilan API/LLM apa pun (CLAUDE.md §8: AI generatif eksplisit di luar scope V1 → V3) — jadi diimplementasikan sebagai **rule-based keyword matcher**, bukan model AI.

**Klarifikasi ke user sebelum bangun (2 pertanyaan):** (1) perilaku input teks bebas — dipilih: tetap ada tombol contoh pertanyaan, TAPI input teks juga aktif dan dicocokkan ke bank jawaban selama masih dalam lingkup konteks (bukan cuma tombol saja). (2) lokasi widget — dipilih: bukan panel chat mengambang di atas Result page, tapi **tombol kecil** yang saat diklik pindah ke **halaman chat khusus**.

**Implementasi:**
- `src/lib/assistant/qaBank.ts` (pure function, tanpa React/DOM) — bank 11 pertanyaan+jawaban (kenapa direkomendasikan, cara hitung skor, arti tiap indikator, tiebreaker, UMK, beda persona, cara ulangi quiz, apa itu FCI), plus `matchQuestion()`: cocokkan teks bebas user ke entry dengan skor kata-kunci tertinggi (substring match, deterministik — kalau seri, entry yang lebih dulu didefinisikan menang, tidak ada randomness). Kalau tidak ada entry yang cocok sama sekali → `FALLBACK_ANSWER` yang jujur bilang tidak bisa jawab (§13: honest saat gagal, bukan pura-pura tahu).
- `src/components/shared/AssistantFab.tsx` — tombol bulat kecil, dipasang di `/result` pada posisi `fixed bottom-24 right-6` (bukan `bottom-6 left-6` seperti percobaan pertama — ternyata bertabrakan dengan indikator route dev bawaan Next.js yang nongkrong di pojok kiri-bawah saat `next dev`, dan juga perlu jarak dari `RelevanceSurvey` yang sudah pakai `bottom-6 right-6`). Klik → navigasi ke `/assistant` bawa quiz query params, TIDAK membuka panel overlay — supaya tampilan Result page yang sudah dibuat semirip mungkin dengan HTML tidak berubah sama sekali.
- `src/app/assistant/page.tsx` — halaman chat baru (route baru, eksplisit atas permintaan user "masuk ke halaman chat bot nya"), pola "page frame" konsisten dengan Result/Compare/District Detail (`PillNavbar` + rounded panel + gradient bg). Konteks jawaban (nama Best Match, skor, status di-bawah-UMK, label persona) dihitung ulang di client dari `rankDistricts()` + data quiz di query params — bukan hardcode — supaya jawaban "kenapa direkomendasikan X" selalu sesuai hasil aktual user, konsisten dengan prinsip Transparent & Deterministik (§2).
- **File dihapus:** `components/shared/FCIAssistantWidget.tsx` (implementasi lama, panel overlay statis, sudah tidak dipakai di manapun — digantikan arsitektur baru di atas).

**Verifikasi:** `tsc`, `eslint`, `npm run build` bersih (19 route, termasuk `/assistant` baru). Playwright: klik FAB dari Result → pindah ke `/assistant` dengan query params terbawa, klik salah satu tombol contoh pertanyaan → jawaban muncul, ketik pertanyaan dalam lingkup ("berapa biaya hidup di sana?") → cocok & terjawab, ketik pertanyaan di luar lingkup ("siapa presiden indonesia?") → fallback message muncul (bukan jawaban ngasal). Dicek juga di mobile 375px — layout & scroll rapi.

---

### 2026-07-05 lanjutan 6 — Compare page dirombak ikut `bandingkan-distrik.html` — ✅ SUDAH DI-COMMIT (commit de01985, 2026-07-05)

**Konteks:** Referensi HTML ketiga di folder yang sama, `Referensi ui/html ui/bandingkan-distrik.html`, dipakai untuk merombak `/compare`. Sama seperti Result & District Detail, restyle total ikut warna/radius/struktur HTML sambil mempertahankan data flow yang sudah berfungsi.

**Yang direplikasi persis dari HTML:** kartu "hero match" (VS) dengan badge crown "Best Match" berbingkai amber, tabel Perbandingan Indikator dengan progress bar gradient hijau untuk yang menang vs abu-abu untuk yang kalah + badge segitiga "▲" pada skor tertinggi per baris, kartu Data Mentah bergaya header+list, kartu Karakteristik & "Mengapa Cocok untuk Anda" bergaya dua kolom, warna & radius (`--green:#1A9B4B`, `--green-soft:#E3F5EA`, radius 22px/16px) yang ternyata sudah persis sama dengan token yang sudah dipasang untuk Result page sesi sebelumnya. `PillNavbar` (komponen sama dipakai Result & District Detail) dipasang di sini juga, ganti `Navbar` lama, demi satu identitas visual konsisten di seluruh app.

**Keputusan yang diambil sendiri (bukan permintaan eksplisit user):**
- HTML referensi didesain untuk membandingkan **persis 2 distrik** lewat dua `<select>` dropdown + tombol Tukar. Ini **tidak diikuti** — dropdown selector dihapus dari desain, karena app ini sudah punya jalur fungsional nyata: `CompareDialog` di `/result` yang membiarkan user pilih **2 ATAU 3** distrik lewat checkbox lalu redirect ke `/compare?districts=...`. Membangun ulang dropdown A/B di halaman ini akan mendupliksi logic pemilihan yang sudah ada dan menghilangkan dukungan 3-distrik yang sudah berfungsi. Semua elemen visual lain (kartu, tabel, warna) tetap dibuat generik untuk 2 atau 3 kolom, bukan cuma 2.
- Icon lingkaran hijau/biru di kartu hero (`hc-ic`) di HTML cuma penanda "sisi A/B" generik. Diganti pakai `DistrictSwatch` (warna aksen asli tiap distrik) di dalam kotak dengan bg soft yang di-siklus per index — supaya tetap ada identitas visual per distrik (konsisten dengan Result & District Detail), bukan sekadar warna sisi kiri/kanan.

**Bug ditemukan & diperbaiki saat verifikasi screenshot:** skor besar ("7.9/10") di kartu Best Match tumpang-tindih dengan badge "Best Match" di pojok kanan atas, karena kartu memakai `items-center` (skor vertically-centered) sementara badge `absolute` di dekat top — pada kartu pendek keduanya bertabrakan di area yang sama. Diperbaiki dengan menambah padding-top pada blok skor khusus saat kartu jadi Best Match, supaya turun di bawah badge.

**Verifikasi:** `tsc`, `eslint`, `npm run build` bersih. Screenshot Playwright dicek untuk kasus 2 distrik, 3 distrik, dan mobile (375px, layout jadi 1 kolom rapi, tabel indikator scroll horizontal seperti pola yang sama dipakai di Result page).

---

### 2026-07-05 lanjutan 5 — District Detail dirombak ikut `detail-distrik.html`, refinement Result page — ✅ SUDAH DI-COMMIT (commit de01985, 2026-07-05)

**Konteks:** Lanjutan dari referensi HTML asli — kali ini `Referensi ui/html ui/detail-distrik.html` untuk halaman District Detail, plus 2 putaran refinement kecil untuk Result page (ukuran kartu, lebar Best Match, panjang trade-off) berdasarkan screenshot beranotasi dari user.

**Result page — refinement:**
- 4 kartu statistik & kartu Best Match diperkecil bertahap (padding/font/ikon) sesuai screenshot beranotasi user, lalu lebar Best Match dikembalikan proporsional (bukan fixed 400px) setelah user minta "lebar ke samping tapi tidak terlalu tinggi".
- **Bug ditemukan:** trade-off text kepanjangan (5+ baris) karena `WhyThisMatch` pakai `generateWhyText()` yang isinya narasi gabungan + label "Trade-off:" dobel (satu dari komponen, satu baked-in di teks). Diperbaiki: `WhyThisMatch` sekarang generate kalimat pendeknya sendiri (1 kalimat, cuma indikator terlemah) dari data `ranked` langsung, tidak lagi butuh prop `whyText` — otomatis ikut memperbaiki tampilan yang sama di District Detail (component di-reuse di 2 tempat, FR-012 §6 tetap dipatuhi: 2 kontribusi tertinggi + trade-off singkat).

**District Detail — dirombak total ikut `detail-distrik.html`:**
- Layout 2-panel bersisian (`grid-cols-[1.05fr_0.95fr]`, kanan `sticky`): panel kiri (navbar + hero + Skor per Indikator + Tentang), panel kanan ("Mengapa Distrik Ini Direkomendasikan?" — breakdown kontribusi per indikator + Total Skor Akhir). Pola kontribusi ini sebelumnya sempat dibangun untuk Result page lalu dihapus lagi — sekarang ternyata memang tempatnya di District Detail sesuai referensi baru.
- Navbar pill diekstrak jadi komponen bersama `components/shared/PillNavbar.tsx` (dipakai Result & District Detail).
- Hero: breadcrumb ("‹ Hasil Rekomendasi › Nama Distrik"), badge peringkat (Crown icon), skor besar+bintang, 3 chip data (Tipe Wilayah/Internet/Coworking).
- Panel kontribusi: ikon berwarna beda per indikator (biru/amber/oranye/hijau meniru `ic-blue/ic-amber/ic-orange/ic-leaf`), deskripsi generatif dari tier+skor, progress bar gradient hijau.
- Konten di luar scope referensi (Perbandingan dengan Distrik Lain, Kafe untuk Bekerja) dipertahankan di bawah 2-panel, direstyle ikut sistem kartu baru.

**Keputusan yang diambil sendiri (bukan permintaan eksplisit user, demi konsistensi permanen produk):**
- Referensi HTML menampilkan **5 bullet "Why This Match"** (beberapa tidak berbasis data skor, mis. "Transportasi dan mobilitas mudah"). **Tidak diikuti** — tetap pakai `WhyThisMatch` versi 2-bullet+trade-off karena itu FR-012 §6 CLAUDE.md yang PERMANEN (business logic, bukan visual).
- Referensi HTML menampilkan chip **"Populasi" (±415.000 jiwa)** — data ini tidak ada di data model (`District` interface §7 PERMANEN tidak punya field populasi, dan menambah field baru = perubahan data model, bukan visual). **Diganti** dengan 3 chip data asli yang sudah ada: Tipe Wilayah, Internet (Mbps), Coworking (jumlah) — supaya tidak ada angka fiktif (melanggar prinsip "Transparent & Deterministik" §2).

**Bug ditemukan & diperbaiki saat verifikasi screenshot:** `PillNavbar` pecah 2 baris ("Freelance/City Index", "Cara/Kerja") di District Detail karena kolom kirinya lebih sempit dari frame penuh Result page. Diperbaiki pakai **CSS container query** (`@container`, Tailwind v4 native) supaya brand text & nav links menyesuaikan lebar navbar itu sendiri, bukan lebar viewport — satu komponen, otomatis pas di kedua konteks (frame lebar Result vs kolom sempit District Detail).

**Verifikasi:** `tsc`, `eslint`, `npm run build` bersih di tiap langkah. Screenshot Playwright dicek untuk Result & District Detail (cocok dekat dengan kedua file HTML referensi), plus Landing/Quiz dicek ulang tidak regresi.

**Revisi susulan (masih tanggal sama):** User minta section "Perbandingan dengan Distrik Lain" dihapus, dan panel "Mengapa Distrik Ini Direkomendasikan?" dipindah dari sidebar kanan (2 kolom) jadi section penuh di bawah — supaya urutannya sama persis di HP maupun laptop (tidak "loncat" dari samping ke bawah saat responsive). Layout District Detail jadi 1 kolom penuh untuk semua ukuran layar: Navbar → Hero/Why-This-Match → Skor per Indikator → Tentang → Mengapa Direkomendasikan → Kafe untuk Bekerja, urutan identik di semua breakpoint.

Sempat coba tambah background ambient foto di level HALAMAN, tapi user koreksi: yang dimaksud adalah foto di **kartu profil (hero card)**, bukan background halaman — background halaman dikembalikan ke gradient polos seperti semula.

**Bug nyata ditemukan & diperbaiki saat itu juga:** foto di kartu profil (hero) ternyata tidak kelihatan sama sekali meski `<Image>`-nya sudah benar (dikonfirmasi lewat inspeksi DOM: gambar termuat sempurna, opacity 1, posisi benar — tapi visualnya ketutup total oleh warna solid `bg-paper` milik div nenek-moyangnya). Penyebabnya: section hero cuma punya `relative`, bukan `relative isolate` — tanpa `isolate`, anak dengan z-index negatif (foto & gradient overlay) bocor ke stacking context di atasnya alih-alih tetap terkurung di dalam section itu sendiri (root cause yang sama seperti bug navbar dobel di sesi Playwright sebelumnya, prinsip stacking context yang sama). Ditambahkan `isolate` ke className section hero — foto langsung tampil benar di semua profil distrik.

---

### 2026-07-05 lanjutan 4 — Result page dirombak ikut `hasil-rekomendasi.html` (referensi kode asli) — ✅ SUDAH DI-COMMIT (commit de01985, 2026-07-05)

**Konteks:** User kasih referensi baru berupa file HTML/CSS asli (`Referensi ui/html ui/hasil-rekomendasi.html`), bukan gambar mockup — jauh lebih presisi karena bisa dibaca exact hex/radius/struktur-nya. Minta Result page dibuat semirip mungkin, HANYA beda di foto (real photo dipertahankan, bukan ilustrasi SVG tangan seperti di file HTML — user konfirmasi via AskUserQuestion), dan section tambahan yang sebelumnya ditambah sesuai `Result_Page_Spec.md` (Kontribusi Indikator, Penjelasan Rekomendasi, Next Action Banner, Footer kaya) **dihapus lagi** karena tidak ada di HTML ini (user pilih "match HTML persis" atas 2 pertanyaan klarifikasi).

**Token warna diganti presisi ke hex di file HTML** (dampak ke SELURUH app karena token global): `--ink:#1E2330`, `--paper:#E9E8F2`, `--line:#E8EAF0`, `--muted-foreground:#6B7280`, `--sawah/primary:#E0263C`. Skema warna skor disederhanakan dari 3 tingkat (hijau/amber/merah) jadi **2 tingkat saja** (hijau ≥80 `#1A9B4B` / oranye <80 `#F97316`) di `ScoreComparisonTable.tsx` — sesuai file HTML yang cuma punya `.bar-green`/`.bar-orange`, tidak ada tingkat ke-3.

**Bug nyata dihindari sebelum sempat merusak app:** sempat mau override token `--radius-lg` Tailwind jadi 22px biar kartu besar makin bulat sesuai referensi — ternyata `--radius-lg` sudah dipakai luas oleh shadcn Button/Input di seluruh app (Admin, RelevanceSurvey, dll), jadi kalau jadi diubah semua tombol di app ikut jadi sangat bulat tanpa disadari. Dibatalkan, radius besar dipakai sebagai `rounded-[22px]` literal cuma di elemen besar Result page.

**Struktur Result page baru:** seluruh isi (bukan cuma hero) dibungkus "page frame" bulat (`rounded-[26px]`, padding kecil) di atas background gradient lavender — meniru `.page` di HTML. Navbar diganti jadi **pill mengambang non-sticky** khusus Result (`PageNavbar`, lokal di file, bukan `Navbar` bersama) karena bentuknya beda jauh dari navbar biasa. Kartu ranking dapat border+shadow amber khusus rank 1, dan pola warna badge rank yang agak unik dari referensi (`1`=amber, `2`=gelap, `3`=**oranye**, `4`&`5`=gelap) ikut direplikasi persis walau terkesan tidak konsisten — karena itu yang ada di kode aslinya. **Result page sekarang tidak punya footer sama sekali** (persis HTML), beda dari halaman lain yang masih pakai footer.

**File dihapus** (sudah tidak dipakai): `components/result/RecommendationExplanation.tsx`, `components/result/NextActionBanner.tsx`.

**Verifikasi:** `tsc`, `eslint`, `npm run build` bersih. Screenshot Playwright dicek utuh untuk Result (cocok sangat dekat dengan HTML referensi), plus Landing/Quiz/District Detail dicek ulang untuk pastikan perubahan token warna global tidak merusak halaman lain (aman, semua masih konsisten).

---

### 2026-07-05 — Complete UI Rebuild Mode: identitas "Crimson/Paper" berbasis 2 mockup referensi — ✅ SUDAH DI-COMMIT (commit de01985, 2026-07-05)

**Konteks:** User melampirkan 2 gambar referensi (`Referensi ui/ui/*.png`, hasil generate ChatGPT) dan minta semua halaman dibangun ulang mengikuti referensi tersebut sedekat mungkin ("sama persis") — memicu Complete UI Rebuild Mode (CLAUDE.md §0.2) menimpa identitas "Almanac" (terracotta/slate) dari sesi sebelumnya. Dua klarifikasi disepakati dulu sebelum eksekusi: (1) widget "FCI Assistant" (chatbot) di mockup dibangun **UI shell saja** — percakapan contoh statis, tidak terhubung API/LLM apa pun, karena AI generatif eksplisit di luar scope V1 (CLAUDE.md §8); user minta desainnya "disimpan" untuk dipakai saat fitur AI-nya benar-benar dibangun nanti; (2) halaman Admin (tidak ada di mockup) tetap ikut didesain ulang secara ekstrapolasi supaya satu identitas visual konsisten di seluruh app.

**Constraint penting yang dipegang selama implementasi:** angka-angka di mockup (skor 91.2, bobot 44%/21%/17%/17%, dst.) adalah contoh ilustratif AI generator dan bahkan **tidak cocok** dengan reference case resmi CLAUDE.md §5.4 (Tech Professional/High/Medium/Cafe seharusnya Sleman 79.2 jadi Best Match, bukan Kota Yogyakarta 91.2 seperti di mockup) — jadi hanya layout & gaya visual yang di-clone, semua angka di UI hasil rebuild tetap dihitung live dari `lib/scoring/*` + `data/districts.seed.json`, tidak ada yang di-hardcode meniru mockup.

**Token desain baru** (`src/app/globals.css`): nama token dipertahankan (§10.2), nilai di-tune — `--paper` jadi off-white sedikit lavender (`#F6F5FA`), `--sawah`/`--primary` jadi crimson `#DC2340`, `--radius` naik ke `1rem` (kartu lebih membulat sesuai mockup). Tambah token baru **additive** `--score-high`/`--score-mid`/`--score-low` (hijau/amber/merah) khusus untuk bar traffic-light di tabel perbandingan skor — sengaja dipisah dari `--warning`/`--error` supaya makna keduanya tidak tertukar (§12.1).

**Foto distrik:** `src/data/districts.visuals.ts` — `imageUrl` diganti dari placeholder `picsum.photos` ke foto landmark asli yang **sudah ada secara lokal** di `public/images/hero/{id}.jpg` (aset ini sudah pernah diunduh di sesi TerraNova sebelumnya, sebelumnya belum "disambungkan" ke file visuals ini).

**Halaman yang dirombak (7 batch, verifikasi `tsc --noEmit` bersih di tiap batch):**
1. **Fondasi** — token + foto distrik.
2. **Navbar & Footer** — satu `Navbar` putih konsisten dipakai di SEMUA halaman publik (link baru: Beranda/Cara Kerja/Indikator/Distrik/Admin). `FloatingHeroNavbar.tsx` (pill navbar gelap khusus landing dari sesi TerraNova) dihapus karena sudah tidak dipakai di mana pun setelah konsolidasi ini.
3. **Landing** (`app/page.tsx`) — hero diubah dari full-bleed dark photo jadi split-hero (headline gelap di atas putih kiri, foto landmark berbingkai rounded + kartu mengambang "Mengapa Freelance City Index?" di kanan), mengikuti persis panel hero di mockup gambar 2. Section Cara Kerja/Indikator/CTA penutup di-retint dari cream `#F3EEE3` ke token baru.
4. **Quiz Step 1 & 2** (`app/quiz/page.tsx`) — ganti `FloatingHeroNavbar` → `Navbar`, background cream → `bg-paper`, step indicator jadi 2 lingkaran bernomor center-aligned ("Profil Anda" / "Penjelasan Algoritma") meniru mockup. Sub-komponen quiz (`PersonaCardSelector`, `BudgetSlider`, dst.) tidak perlu diubah — sudah 100% token-driven dari sesi sebelumnya.
5. **Result** (`app/result/page.tsx`) — perbaikan penting: skor sebelumnya ditampilkan dibagi 10 tanpa unit (`(skorTotal/10).toFixed(1)` tanpa label) di beberapa tempat, sekarang konsisten skala asli 0–100 dengan label "/100" (match mockup "91.2 /100"). Tambah `Crown` icon di badge Best Match, foto asli (bukan swatch warna flat) di kartu Best Match & baris ranking, komponen baru `components/result/ScoreComparisonTable.tsx` (tabel semua distrik dengan bar traffic-light per indikator, meniru "Perbandingan Skor per Indikator" di mockup), `WhyRecommendedPanel` menggantikan `TopRecommendationCard` (breakdown kontribusi % per indikator + bobot, meniru "Mengapa Distrik Ini Direkomendasikan?"), dan komponen baru `components/shared/FCIAssistantWidget.tsx` (floating chat shell, tertutup by default, 3 pertanyaan contoh dengan jawaban statis hardcoded, input bebas sengaja `disabled` dengan placeholder "segera hadir" — tidak ada koneksi AI sungguhan).
6. **District Detail** (`app/district/[id]/page.tsx`) — header ganti dari swatch warna flat ke foto landmark asli, tambah kartu "Skor per Indikator" (4 kartu terpisah, sebelumnya cuma baris di Snapshot), tambah galeri foto kecil, reuse `ScoreComparisonTable` untuk section baru "Perbandingan dengan Distrik Lain", skor dibetulkan ke skala /100.
7. **Admin** (`layout.tsx`, `login/page.tsx`, dashboard, `data/page.tsx`, `audit/page.tsx`) — ternyata sudah 100% token-driven dari sesi sebelumnya (tidak ada hex hardcode), otomatis ikut ganti ke palet crimson/paper baru tanpa perlu ubah kode; hanya logo login diganti dari kotak `bg-ink` ke lingkaran `bg-sawah` biar konsisten dengan wordmark Navbar.

**Verifikasi:** `tsc --noEmit` bersih di tiap batch, `npm run build` sukses (18 route ter-generate, 0 error), `npm run lint` hanya menyisakan 1 error + 2 warning **pre-existing** yang tidak disentuh sesi ini (`admin/data/page.tsx` setState-in-effect, unused var di `RelevanceSurvey.tsx` & `useDistricts.ts`). Dev server dites via `curl` ke semua route utama (`/`, `/quiz`, `/result`, `/district/sleman`, `/admin/login`, `/algoritma`) — semua HTTP 200, tidak ada error di log server. **Catatan jujur:** tidak ada tool browser headless (chromium-cli/playwright) tersedia di environment ini, jadi verifikasi visual di browser sungguhan belum dilakukan otomatis oleh asisten — disarankan user cek langsung via `npm run dev` sebelum commit.

**Di luar scope batch ini (sengaja tidak disentuh):** halaman `/algoritma` (standalone route legacy, sudah tidak ditaut dari Navbar manapun sejak konsolidasi nav, digantikan fungsinya oleh Quiz Step 2) — komponennya (`AlgorithmSection.tsx`) masih pakai skema warna persona sendiri (biru/coklat/hijau/olive) yang independen dari token `--sawah`, tapi tetap konsisten & tidak "rusak" secara visual, hanya belum di-refresh mengikuti palet baru. Fitur Compare (`app/compare/page.tsx`, di luar scope V1 menurut CLAUDE.md §8 tapi sudah ada di kode sejak sebelum sesi ini) tidak disentuh sama sekali — bukan bagian dari redesign ini.

---

### 2026-07-04 — Landing Page: rebuild ulang khusus (ui-ux-pro-max), pola one-page anchor-nav ala TerraNova — BELUM DI-COMMIT

**Konteks:** Task terpisah dari rebuild "Almanac" (entry di atas). User minta landing page (`src/app/page.tsx`) dirombak ulang total memakai HANYA skill `ui-ux-pro-max` (skill lain diabaikan untuk task ini), lalu diiterasi berkali-kali mengikuti referensi visual baru yang ditambahkan user ke `Referensi ui/` (situs contoh "TerraNova" — agri-tech, floating pill navbar + hero foto full-bleed + kartu glass transparan konsisten di semua "halaman"-nya).

**File utama yang diubah:** `src/app/page.tsx`, `src/components/landing/DistrictPreviewSection.tsx`, `src/components/landing/CapabilityShowcase.tsx` (tambah prop `variant="dark"`), `src/app/globals.css` (tambah `scroll-behavior: smooth` + guard `prefers-reduced-motion`).

**File baru:**
- `src/components/landing/FloatingHeroNavbar.tsx` — navbar khusus landing, `position: fixed` (bukan bagian dari `Navbar.tsx` bersama), scroll-spy aktif (IntersectionObserver) untuk highlight section yang sedang dilihat, link berbasis `#anchor` (bukan route terpisah).
- `src/components/landing/HeroBackgroundSlideshow.tsx` — slideshow background hero, ganti foto tiap 7 detik (crossfade opacity), auto-stop kalau `prefers-reduced-motion: reduce`.
- `src/components/landing/ScrollReveal.tsx` — reveal-on-scroll generik (IntersectionObserver + stagger-in), dipakai di hampir semua section landing.

**Struktur akhir landing (single scrolling page, 5 section berlabel via `id`):**
1. **Hero** (`#beranda`) — slideshow 5 foto pemandangan asli DIY (bukan stok generik), headline + CTA ganda + trust chip + 3 badge nilai (Transparan/Deterministik/Tanpa Akun).
2. **Cara Kerja** (`#cara-kerja`) — gaya "About" TerraNova: badge + headline + 3 stat block asli (5 Distrik/4 Indikator/4 Profil, BUKAN angka fiktif) di kiri, 3 kartu glass (mirror step quiz) di kanan.
3. **Indikator** (`#indikator`) — gaya "Solutions": grid `CapabilityShowcase` varian gelap + contoh hasil ranking.
4. **5 Distrik** (`#distrik`) — kartu grid, tiap kartu pakai **foto asli tiap wilayah** (bukan warna solid lagi) dengan overlay gradient gelap transparan.
5. **Final CTA** — bookend nada gelap yang sama dengan hero.

Navbar (`FloatingHeroNavbar`) tetap terlihat sepanjang scroll dan link-nya (`Beranda/Cara Kerja/Indikator/Distrik/Admin`) langsung scroll ke section terkait di halaman yang sama — TIDAK pindah ke `/district/:id` atau `/result` (sempat salah arah sebentar, sudah dikoreksi user: klik kartu distrik cuma expand penjelasan singkat inline, tidak navigasi).

**Aset gambar baru (real photos, bukan placeholder):** diunduh dari Wikimedia Commons (lisensi Creative Commons, aman dipakai) via API resmi mereka, disimpan di:
- `public/images/hero/` — 5 foto resolusi HD (1920px) untuk slideshow hero: Tugu Yogyakarta, Gunung Merapi (Sleman), Pantai Parangtritis (Bantul), Pantai Baron (Gunungkidul), Kalibiru/Menoreh (Kulon Progo).
- `public/images/districts/` — versi 1200px dari 5 foto yang sama, dipakai sebagai background kartu di section 5 Distrik.

**Catatan:** folder `public/images/` masuk `.gitignore` (`*.jpg` di-exclude sejak commit "hapus aset non-kode"), jadi file foto ini TIDAK ikut ter-track git meski ada secara lokal — perlu strategi hosting terpisah (mis. Vercel Blob/CDN) kalau mau ikut ke-deploy nanti.

**Bug nyata yang ditemukan & diperbaiki di tengah iterasi:**
- **Navbar "fixed" ternyata ke-clip.** `FloatingHeroNavbar` awalnya dirender sebagai child di dalam section hero yang punya `overflow-hidden` — akibatnya elemen `position: fixed` ikut ter-clip ke kotak section itu (gotcha CSS yang sering tidak disadari: `overflow-hidden` pada ancestor bisa memotong descendant `fixed` meski secara spesifikasi seharusnya relatif ke viewport). Fix: pindahkan `<FloatingHeroNavbar />` ke level teratas `<main>`, di luar section manapun yang overflow-hidden.
- Sempat salah menghapus foto dari section yang salah (revert & perbaiki sesuai koreksi user: foto tetap di hero, section Cara Kerja/Indikator pakai gradient gelap tanpa foto).
- Tombol CTA hero sempat `w-full` di mobile (melebar penuh, terlihat kurang menarik + stack vertikal) — diperbaiki jadi auto-width, sejajar 2 kolom (flex-row + flex-wrap), ukuran & tinggi tombol disesuaikan supaya tetap ≥44px (NFR02) walau lebih ramping.
- Beberapa touch-target & ukuran elemen mobile (navbar pill height, badge "Menganalisis 5 distrik", 3 badge nilai) diperkecil bertahap mengikuti feedback visual (termasuk dari screenshot yang user lampirkan di `Referensi ui/perubahan/`).

**Verifikasi:** `tsc --noEmit` + `eslint` bersih di setiap iterasi, dicek render via `curl` ke dev server (`localhost:3000`) setiap perubahan. Semua 10 foto (5 hero + 5 district card) dikonfirmasi serve HTTP 200.

---

### 2026-07-04 — Complete UI Rebuild Mode: Desain "Almanac" — implementasi penuh, 8 halaman — BELUM DI-COMMIT

**Konteks:** Setelah CLAUDE.md direfactor dengan Operating Modes (sesi sebelumnya), user resmi mengaktifkan **Complete UI Rebuild Mode** dan meminta strategi 5-fase (audit → studi referensi → design system → strategi per halaman → daftar kompleksitas) sebelum implementasi. Strategi disetujui, lalu dikerjakan incremental, satu halaman/fitur per commit-mental dengan review 4 aspek (visual consistency, accessibility, responsiveness, component reusability) di tiap tahap sebelum lanjut ke halaman berikutnya.

**Audit temuan utama (Fase 1):** card-in-card bertumpuk di mana-mana, gradient blob dekoratif + emoji sebagai icon distrik, badge/chip berlebihan, skor (produk inti) kalah visual dari dekorasi, Compare page = spreadsheet hand-coded, type scale tidak sistematis, motion tidak konsisten.

**Design system baru — "Almanac":** near-monochrome (ink `#0B0C0E` / paper `#FAFAFA`), **satu signal accent** crimson `#B91C3C` (dipakai HANYA untuk aksi utama/Best Match/status, bukan dekorasi), 5 warna identitas distrik flat quiet (bukan gradient), font **Geist Sans + Geist Mono** (paket npm `geist`, bukan Google Fonts link — perlu `npm install geist`). Filosofi "rows over cards": data homogen (ranking, tabel compare, tabel admin) jadi baris bukan kartu berulang; kartu disisakan untuk SATU elemen hero per halaman (mis. Best Match).

**8 tugas diselesaikan berurutan** (foundation dulu karena semua halaman bergantung padanya):
1. **Foundation** — token warna & radius di `globals.css`, font Geist di `layout.tsx`, Navbar & Footer dirombak (wordmark persegi, nav underline bukan pill, CTA tanpa shadow-glow).
2. **Landing** — hero editorial, `DistrictPreviewSection` dirombak total dari grid-gradient-emoji jadi row-accordion (fix radikal untuk 3 audit finding sekaligus).
3. **Quiz** — 5 kartu terpisah jadi satu form surface dengan divider; 5 komponen input disatukan ke satu bahasa visual (signal accent = terpilih, bukan warna beda tiap komponen); weight chart di Step 2 dipromosikan jadi elemen utama (bukan cuma dekorasi kecil).
4. **Result** — rank list jadi rows, hanya rank 1 dapat kartu (BestMatchCard elevated + WhyThisMatch inline); sidebar cuma sisakan Top Recommendation, hapus chart duplikat.
5. **District Detail** — hapus hero foto stock (Sleman sempat render foto hutan pinus generik, tidak representatif), ganti header flat-color; snapshot 6-kartu jadi rows; `SuggestedPlaces` dirombak dari card-grid+emoji jadi row-list.
6. **Compare** — hand-coded spreadsheet div jadi tabel data asli dengan swatch flat, warna signal cuma untuk sel pemenang.
7. **Admin** — shell sidebar sudah ada sebelumnya (audit awal salah duga "tidak ada shell"), jadi cuma polish token + fix 6+ touch-target <44px + 2 anti-pattern React nyata (`setState` dalam effect, komponen dibuat saat render — diperbaiki karena low-risk & murni UI, BUKAN business logic).
8. **Shared components** — `EmptyState`/`RelevanceSurvey` token+touch-target fix; **ekstraksi `DistrictSwatch`** jadi komponen shared asli (dipakai Result+District+Compare, sebelumnya 3x didefinisikan lokal beda-beda); ketemu & perbaiki BUG warna: `WhyThisMatch` masih pakai hex dari palet lama, dan `/algoritma` (halaman FR-007 yang sempat tidak ke-notice) masih penuh warna Terracotta-lama, termasuk bug nyata Creative & Student ke-assign warna identik akibat sed sweep yang kurang presisi.

**Bug/temuan nyata yang diperbaiki sepanjang proses (bukan cuma kosmetik):**
- Data seed sempat basi (>7 hari, aturan §12.1 CLAUDE.md) di tengah sesi karena waktu nyata berjalan, re-seed untuk lanjut testing (bukan bug kode).
- Fokus keyboard nyaris tidak kelihatan di tombol solid signal-red (outline warna sama dengan fill) — ditemukan lewat Playwright dengan keyboard Tab asli, bukan `.focus()` (yang memberi hasil palsu). Pola perbaikan: `focus-visible:outline-2 focus-visible:outline-offset-2` dengan warna kontras, diterapkan di semua CTA solid.
- 10+ touch target <44px (NFR02) di berbagai halaman: hamburger menu, tombol back link, ikon eksternal-link Maps, input & tombol admin, tombol survey popup — sebagian diperbaiki dengan memperbesar visual, sebagian dengan teknik "invisible hit-area" (`after:absolute after:-inset-*`) agar area sentuh membesar tanpa mengubah tampilan visual.
- `AlgorithmSection` punya prop `standalone` yang salah satu cabangnya (`!standalone`) sudah jadi dead code sejak Landing tidak lagi memanggilnya — dihapus.

**Verifikasi:** `tsc --noEmit` dan `eslint` bersih di seluruh `src/` (kecuali 1 error pre-existing di form-state hydration `admin/data/page.tsx` yang sengaja tidak disentuh karena itu business logic, bukan visual — plus 2 warning placeholder yang memang sengaja unused). Setiap halaman diverifikasi visual via Playwright headless (desktop 1440px + mobile 375px) sebelum lanjut ke halaman berikutnya, termasuk login admin end-to-end dengan kredensial asli (dibaca dari `.env` tanpa pernah dicetak ke output).

**MASIH BELUM DI-COMMIT** — bisa dibandingkan dengan versi sebelumnya (terracotta+slate) atau versi live Vercel kapan pun. Revert: `git checkout -- freelance-city-index/src/`.

---

### 2026-07-03 (sesi lanjutan 4) — Refactor CLAUDE.md: Operating Modes (Normal vs Complete UI Rebuild)

**Konteks:** Setelah 3 kali iterasi redesign di sesi yang sama, user sadar akar masalahnya: CLAUDE.md lama menulis semua keputusan visual (palet, font, layout) sebagai "wajib"/"tidak boleh diubah", sehingga permintaan "redesign total" pun cuma menghasilkan ganti warna/font di atas struktur lama, bukan desain ulang sungguhan dari nol.

**Perubahan:** CLAUDE.md ditulis ulang total (bukan disederhanakan — semua pengetahuan project tetap ada, direstrukturisasi) dengan label eksplisit di tiap section:
- **[PERMANEN]** — business logic, algoritma scoring (§5, paling kritis), FR, routing/IA, data model, arsitektur folder, aturan coding. Tidak boleh berubah oleh redesign visual apa pun.
- **[DEFAULT — Normal Mode]** — palet warna, tipografi, layout, komponen visual. Berlaku sebagai default saat perbaikan kecil, tapi **diabaikan sepenuhnya** saat Complete UI Rebuild Mode aktif.
- **[CAMPURAN]** — section yang dipecah eksplisit jadi kolom "yang harus ada" (fungsional, permanen) vs "tampilan saat ini" (visual, default) — dipakai di §11 (layout per halaman) dan §12 (UI states & error handling).

**Section baru ditambahkan:**
- §0 Operating Modes: Normal Development Mode (default) vs Complete UI Rebuild Mode (trigger: "redesign total", "rebuild UI", dst).
- §0.3 User Intent Priority: instruksi eksplisit user > operating mode > arsitektur > business logic > skill terinstall > keputusan visual sebelumnya.
- §1 Skill priority: skill inti (dipakai kedua mode) vs skill desain (full power hanya saat Rebuild Mode) — mencakup 5 skill baru (design-taste-frontend, image-to-code, impeccable, redesign-existing-projects, ui-ux-pro-max) + frontend-design + tailwind-v4-shadcn + vercel-react-best-practices + prisma-database-setup.
- §10.1 riwayat identitas visual (3 iterasi hari ini: Field Notes → Data-Dense Dashboard → Terracotta+Slate) dicatat sebagai histori, bukan acuan wajib — instruksi eksplisit: cek `globals.css` langsung untuk tahu token aktif, jangan percaya daftar ini begitu saja.
- §16 checklist sebelum build komponen dipecah dua versi (Normal Mode vs Rebuild Mode).

**Efek untuk sesi berikutnya:** kalau user bilang "redesign total"/"rebuild UI dari awal", Claude wajib treat itu sebagai Complete UI Rebuild Mode — hanya pertahankan fungsi, bukan visual sebelumnya sama sekali (kecuali diminta eksplisit).

---

### 2026-07-03 (sesi lanjutan 3) — Redesign "Terracotta + Slate" pakai 5 skill sekaligus — BELUM DI-COMMIT

**Konteks:** User minta desain ulang lagi (beda dari tema biru) pakai 5 skill: `design-taste-frontend`, `image-to-code`, `impeccable`, `redesign-existing-projects`, `ui-ux-pro-max`. Aturan CLAUDE.md dilepas sementara; fitur tetap utuh.

**Arah desain (design read):** "Terracotta + Slate", aksen bata bakar `#C2410C` (atap Yogyakarta) di atas netral slate; keluarga palet yang direkomendasikan design-taste-frontend §4.2 sebagai alternatif anti-default. Font: **Space Grotesk + Space Mono** (menggantikan Fira). Warna kategorikal distrik/persona: terracotta, berry `#9F1239`, cyan `#0E7490`, moss `#4D7C0F`, slate `#475569`.

**De-slop besar-besaran (temuan audit gabungan 5 skill):**
- Hapus SEMUA em-dash (—) dari copy di 15 file (banned total, design-taste §9.G).
- Hapus eyebrow uppercase-tracking dari hampir semua section (budget: maks 1 per 3 section); label "Pertanyaan N" quiz jadi "Pertanyaan N dari 5" sentence-case (penomoran urutan asli boleh).
- Hapus **stat strip** 4 angka di landing ("hero-metric template" = klise SaaS terlarang).
- Hapus tagline kecil di bawah CTA hero (hero stack max 4 elemen).
- Hapus semua dekorasi dot-grid & diagonal hatch ("decorative grid backgrounds" = Codex tell).
- Panel CTA penutup jadi permukaan terracotta penuh (strategi warna "committed"), radius turun 24px→16px.
- Perbaiki pola "ghost-card" (border + shadow lebar ≥16px) di 5 komponen.
- Satukan intent CTA: "Mulai Quiz" untuk semua tombol quiz, "Lihat Cara Kerja" untuk semua tombol algoritma (No Duplicate CTA Intent).

**File utama:** `globals.css` (token), `layout.tsx` (font), `page.tsx` (landing), `quiz/page.tsx`, `result/page.tsx`, `district/[id]/page.tsx`, `WhyThisMatch.tsx`, `SuggestedPlaces.tsx`, + sweep sed di seluruh `src/`.

**Verifikasi:** tsc bersih; Playwright: landing/quiz/result/district render kohesif tanpa console error.

**Revert semua UI hari ini:** `git checkout -- freelance-city-index/src/` + hapus `CapabilityShowcase.tsx`.

---

### 2026-07-03 (sesi lanjutan 2) — REBRAND TOTAL ikut saran skill `ui-ux-pro-max` — BELUM DI-COMMIT

**Konteks:** User eksplisit minta LEPAS aturan desain CLAUDE.md (kecuali aturan pakai skill) dan ikuti penuh rekomendasi skill: tampilan boleh berubah total asal fitur tetap sama.

**Design system baru (output `ui-ux-pro-max --design-system` untuk produk DSS/data tool):**
- Style: **"Data-Dense Dashboard"** — biru data + aksen amber.
- Palet: primary `#1E40AF`, secondary/data `#0284C7`, accent `#D97706`, bg `#F8FAFC`, fg `#0F172A`, border `#E2E8F0`.
- Tipografi: **Fira Sans** (display+body) / **Fira Code** (angka/mono) — menggantikan Fraunces/Inter/JetBrains Mono.

**Cara implementasi (fitur 100% utuh):**
- `globals.css`: nilai semua CSS variable di-remap ke palet baru (nama token lama `--sawah`/`--pesisir`/dll. dipertahankan → seluruh komponen ikut berubah otomatis). Dark mode vars ikut diperbarui.
- `layout.tsx`: ganti Google Fonts ke Fira Sans + Fira Code (variable `--font-fira-sans`/`--font-fira-code`).
- Sapu `sed` di seluruh `src/` untuk ±30 hex hardcoded: hijau sawah→biru `#1E40AF`, pesisir→sky `#0284C7`, genteng→amber `#D97706`, coklat nomad→violet `#7C3AED`, kulon progo→teal `#0D9488`, ink→slate-900, paper→`#F8FAFC`, line→slate-200, plus semua tint/gradient/rgba shadow.
- Warna 5 distrik tetap distinct: Sleman biru, Kota Yogyakarta amber, Bantul sky, Gunungkidul violet, Kulon Progo teal.

**Verifikasi:** tsc bersih; Playwright: landing, quiz, result, district — semua render kohesif dengan tema baru, tanpa console error.

**Revert:** `git checkout -- freelance-city-index/src/` (semua perubahan UI hari ini masih uncommitted, termasuk redesign landing & polish halaman).

---

### 2026-07-03 (sesi lanjutan) — Redesign Semua Halaman pakai skill `ui-ux-pro-max` — BELUM DI-COMMIT

**Konteks:** User minta semua halaman dipoles pakai skill `ui-ux-pro-max` yang baru diinstall, tanpa mengubah fitur. Saran palet/font dari skill (biru + Fira) DITOLAK sesuai aturan konflik CLAUDE.md §0 — token Field Notes §9 tetap dipakai; yang diambil hanya guideline UX & struktur.

**Perubahan per halaman:**
- `/quiz` (`src/app/quiz/page.tsx`): form flat dengan separator → 5 kartu pertanyaan bernomor ("Pertanyaan 1 · Profil" dst., urutan = FR-001–005), header lebih ringan, hint langkah berikutnya di bawah CTA. Komponen input tidak diubah.
- `/result` (`src/app/result/page.tsx`): background off-token `#F8F9FA` → `bg-paper`; eyebrow "Hasil Rekomendasi"; semua copy Inggris → Indonesia sesuai §12 ("Your District Ranking"→"Peringkat Distrik Anda", "Score Comparison"→"Perbandingan Skor", "Top Recommendation"→"Rekomendasi Teratas", "Match Score"→"Skor Kecocokan", "Retake Quiz"→"Ulangi Quiz", "View District Details"→"Lihat Detail Distrik", "Explore"→"Jelajahi").
- `/district/:id`: skeleton loading `#F8F9FA` → `bg-paper`.
- `/algoritma`: tidak diubah (reuse AlgorithmSection yang sudah bagus).
- `/admin/login`: pesan error jadi kotak `--color-error-bg` (bukan teks polos).
- `/admin` dashboard & `/admin/audit`: tabel `overflow-hidden` → `overflow-x-auto` (mobile), row hover state; audit log nilai turun `text-error` → `text-pesisir` (merah hanya untuk error sesungguhnya, §11).
- `/admin/data`: shadow off-token slate → ink.

**Verifikasi:** `tsc --noEmit` bersih; Playwright headless: /quiz (step 1+2), /result, /district/sleman, /admin/login — desktop 1440px + mobile 360px, tanpa console error.

**Revert semua (landing + halaman lain):** `git checkout -- freelance-city-index/src/` lalu `rm src/components/landing/CapabilityShowcase.tsx`.

---

### 2026-07-03 — Redesign Landing Page (ala referensi) + Skill UI/UX Baru — BELUM DI-COMMIT

**Konteks:** User minta tampilan landing page diubah mengikuti pola visual screenshot referensi di `Referensi ui/ui landing page/` (landing page SaaS "Lynqet"), tapi konten tetap sesuai fitur produk. **Sengaja tidak di-commit dulu** agar bisa dibandingkan/dikembalikan.

**1. Redesign `src/app/page.tsx`**
- Hero: dari gradasi hijau gelap penuh → latar terang (paper) dengan eyebrow pill hijau, headline gelap, dual CTA (Mulai Sekarang + Lihat Cara Kerja), dot-grid halus di sudut.
- Stat strip baru: 5 Distrik · 4 Indikator · 16 Kombinasi bobot · <60s, dengan pembatas garis vertikal.
- Section transparansi: gabungan teaser algoritma + 3 keunggulan jadi pola checklist icon-circle (kanan) + visual bobot (kiri).
- Section Cara Kerja: ditambah aksen garis diagonal (hatch) tipis kiri-kanan.
- CTA penutup: dari banner hijau gelap → kartu rounded gradasi teal muda, teks gelap, dot-grid pattern.
- Fix bonus: footer inline duplikat dihapus (sebelumnya landing render 2 footer bertumpuk).

**2. Komponen baru `src/components/landing/CapabilityShowcase.tsx`**
- 4 kartu indikator interaktif: kartu aktif berubah gelap (ink) + terangkat, bar detail bobot di bawah update sesuai kartu, dot pagination. Meniru pola carousel kapabilitas di referensi.

**3. Verifikasi**
- `tsc --noEmit` bersih; dites via Playwright headless: desktop 1440px, mobile 360px, interaksi klik kartu — semua render benar tanpa console error.

**4. Cara kembali ke versi lama (kalau hasil kurang bagus):**
```
git checkout -- src/app/page.tsx
rm src/components/landing/CapabilityShowcase.tsx
```

**5. Skill UI/UX baru diinstall user:** `ui-ux-pro-max`, `impeccable`, `design-taste-frontend`, `redesign-existing-projects`, `image-to-code`. `CLAUDE.md` §0 diperbarui: tabel skill dipecah "inti" vs "desain tambahan" + aturan konflik (token desain §9 selalu menang atas saran skill).

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
