// Mesin tanya-jawab FCI Assistant — murni rule-based (pencocokan kata kunci),
// TIDAK ada panggilan API/LLM apa pun (CLAUDE.md §8: AI generatif di luar scope
// V1). Deterministik: input+konteks yang sama selalu menghasilkan jawaban yang
// sama, sejalan dengan prinsip §2 "Deterministik".

// Skor 4 indikator, skala 0-100
export interface AssistantIndicatorScores {
  internet: number;
  cost: number;
  community: number;
  environment: number;
}

export interface AssistantRankedDistrict {
  rank: number;
  nama: string;
  skorTotal: number;
  skorPerIndikator: AssistantIndicatorScores;
  topKecamatan?: string; // nama kecamatan rank 1 di distrik ini
}

export interface AssistantContext {
  personaLabel: string;
  bestName: string;
  bestScore: number; // skala 0-100
  isBelowUMK: boolean;
  // Grounding tambahan untuk Gemini (2026-07-11) — opsional supaya jalur
  // rule-based lama & payload lama tetap valid. Jawaban qaBank tidak
  // memakainya; hanya dipakai buildSystemInstruction di geminiClient.
  budget?: number; // Rupiah
  weights?: AssistantIndicatorScores; // bobot' ternormalisasi 0-1 per indikator
  ranking?: AssistantRankedDistrict[]; // 5 distrik terurut rank
  bestKecamatan?: { rank: number; nama: string; skorTotal: number }[]; // 5 kecamatan di distrik Best Match
}

export interface QAEntry {
  id: string;
  chipLabel: string; // teks tombol saran
  keywords: string[];
  answer: (ctx: AssistantContext) => string;
}

export const QA_BANK: QAEntry[] = [
  {
    id: "why-best",
    chipLabel: "Kenapa distrik ini direkomendasikan?",
    keywords: ["kenapa", "direkomendasikan", "best match", "alasan", "rekomendasi", "cocok"],
    answer: (ctx) =>
      `${ctx.bestName} jadi Best Match karena skor totalnya ${Math.round(ctx.bestScore)}/100, tertinggi berdasarkan bobot yang sudah disesuaikan untuk profil ${ctx.personaLabel} dan preferensi yang Anda isi di quiz, bukan cuma unggul di satu indikator saja.`,
  },
  {
    id: "how-score",
    chipLabel: "Bagaimana skor ini dihitung?",
    keywords: ["hitung", "skor", "formula", "rumus", "cara kerja", "algoritma", "metodologi"],
    answer: (ctx) =>
      `Skor tiap distrik = jumlah skor 4 indikator (Internet, Biaya Hidup, Komunitas, Lingkungan) dikali bobotnya masing-masing. Bobotnya sendiri sudah disesuaikan dari profil ${ctx.personaLabel} dan preferensi yang Anda isi di quiz, lalu dinormalisasi supaya totalnya 100%.`,
  },
  {
    id: "indicator-internet",
    chipLabel: "Apa arti indikator Internet?",
    keywords: ["internet", "wifi", "kecepatan", "koneksi", "mbps"],
    answer: () =>
      "Indikator Internet menilai kecepatan & kestabilan koneksi rata-rata di distrik tersebut. Makin tinggi Mbps-nya, makin tinggi skornya.",
  },
  {
    id: "indicator-cost",
    chipLabel: "Apa arti indikator Biaya Hidup?",
    keywords: ["biaya", "cost", "harga", "mahal", "murah", "hidup"],
    answer: () =>
      "Indikator Biaya Hidup arahnya dibalik: makin rendah biaya hidup di distrik itu, makin tinggi skornya. Nilai 100 berarti paling terjangkau.",
  },
  {
    id: "indicator-community",
    chipLabel: "Apa arti indikator Komunitas?",
    keywords: ["komunitas", "community", "networking", "meetup", "coworking"],
    answer: () =>
      "Indikator Komunitas menilai seberapa aktif ekosistem coworking, event, dan networking freelancer/tech di distrik itu.",
  },
  {
    id: "indicator-environment",
    chipLabel: "Apa arti indikator Lingkungan?",
    keywords: ["lingkungan", "environment", "suasana", "kebisingan", "nyaman", "cafe"],
    answer: () =>
      "Indikator Lingkungan menilai kenyamanan tempat kerja (cafe, coworking, ketenangan) sesuai preferensi Anda. Makin tenang dan mendukung, makin tinggi skornya.",
  },
  {
    id: "tiebreaker",
    chipLabel: "Bagaimana kalau skornya seri?",
    keywords: ["seri", "sama", "tiebreaker", "seimbang", "imbang"],
    answer: () =>
      "Kalau ada 2 distrik dengan skor total sama persis, sistem otomatis memenangkan yang UMK-nya lebih rendah, supaya tetap ada satu Best Match yang jelas.",
  },
  {
    id: "below-umk",
    chipLabel: "Apa itu penanda 'Di bawah UMK'?",
    keywords: ["umk", "gaji", "upah", "minimum"],
    answer: (ctx) =>
      ctx.isBelowUMK
        ? `Budget yang Anda masukkan ada di bawah UMK ${ctx.bestName}. Ini bukan berarti tidak layak huni, tapi biaya hidup di sana relatif lebih tinggi dari budget Anda. Pertimbangkan lagi kalau ini penting.`
        : "UMK (Upah Minimum Kabupaten/Kota) dipakai sebagai penanda afordabilitas dan tiebreaker skor. Kalau budget Anda di bawah UMK sebuah distrik, akan muncul penanda khusus di kartunya.",
  },
  {
    id: "persona-diff",
    chipLabel: "Apa beda tiap profil (persona)?",
    keywords: ["persona", "profil", "beda profil", "tech professional", "creative", "student", "nomad"],
    answer: (ctx) =>
      `Ada 4 profil: Tech Professional (bobot Internet paling besar), Creative Professional (Lingkungan & Komunitas diutamakan), Student & Fresh Graduate (Biaya Hidup paling diutamakan), dan Digital Nomad (Internet & Komunitas seimbang). Anda memilih ${ctx.personaLabel}.`,
  },
  {
    id: "change-input",
    chipLabel: "Bagaimana cara ubah jawaban quiz?",
    keywords: ["ulang", "ganti", "ubah", "quiz lagi", "restart", "ulangi"],
    answer: () =>
      'Klik "Coba Lagi" di halaman Result untuk mengubah persona, budget, atau preferensi. Skor akan otomatis dihitung ulang tanpa reload halaman.',
  },
  {
    id: "what-is-fci",
    chipLabel: "Apa itu Freelance City Index?",
    keywords: ["apa itu", "fci", "freelance city index", "siapa kamu", "kamu siapa"],
    answer: () =>
      "Freelance City Index adalah sistem pendukung keputusan (DSS) untuk membantu freelancer memilih distrik kerja terbaik di Yogyakarta, berdasarkan skor 4 indikator yang dibobot sesuai profil Anda. Rekomendasinya selalu dihitung oleh mesin skor yang sama, bukan opini AI.",
  },
];

// Chip saran cuma tampilkan 5 pertanyaan paling umum (biar tidak penuh),
// tapi mesin pencocokan kata kunci (matchQuestion) tetap jalan untuk SEMUA
// entri QA_BANK kalau user ketik bebas — jadi pertanyaan soal indikator
// spesifik atau tiebreaker tetap terjawab walau tidak muncul sebagai chip.
export const SUGGESTED_CHIP_IDS = [
  "why-best",
  "how-score",
  "persona-diff",
  "below-umk",
  "change-input",
];

export const FALLBACK_ANSWER =
  "Maaf, saya belum bisa jawab itu. Saat ini saya cuma bisa bantu jelaskan seputar rekomendasi, skor, indikator, dan algoritma FCI. Coba tanya pakai kata kunci lain, atau pilih salah satu contoh pertanyaan di atas.";

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

// Pencocokan sederhana: hitung berapa banyak kata kunci tiap entry yang muncul
// sebagai substring di pertanyaan user. Entry dengan skor tertinggi menang;
// kalau seri, entry yang lebih dulu didefinisikan di QA_BANK yang menang
// (deterministik, tidak ada randomness).
export function matchQuestion(input: string): QAEntry | null {
  const normalized = normalize(input);
  if (!normalized) return null;

  let best: QAEntry | null = null;
  let bestScore = 0;

  for (const entry of QA_BANK) {
    const score = entry.keywords.reduce(
      (acc, kw) => (normalized.includes(normalize(kw)) ? acc + 1 : acc),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return best;
}
