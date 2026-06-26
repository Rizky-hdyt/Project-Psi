export type PlaceCategory = "cafe" | "coworking" | "quiet" | "library";

export interface SuggestedPlace {
  nama: string;
  kategori: PlaceCategory;
  rating: number;       // 3.5 – 5.0
  alamat: string;
  priceRange: 1 | 2 | 3; // 1 = murah, 2 = sedang, 3 = mahal
  tags: string[];
  gmapsSlug?: string;   // suffix untuk link maps.google.com/?q=...
}

export const PLACES_BY_DISTRICT: Record<string, SuggestedPlace[]> = {
  "kota-yogyakarta": [
    {
      nama: "Klinik Kopi",
      kategori: "cafe",
      rating: 4.7,
      alamat: "Jl. Nologaten, Kota Yogyakarta",
      priceRange: 2,
      tags: ["WiFi Kencang", "AC", "Cozy", "Instagramable"],
      gmapsSlug: "Klinik+Kopi+Yogyakarta",
    },
    {
      nama: "Filosofi Kopi Jogja",
      kategori: "cafe",
      rating: 4.6,
      alamat: "Jl. Poncowinatan No.6, Kota Yogyakarta",
      priceRange: 2,
      tags: ["Nuansa Klasik", "Kopi Specialty", "WiFi", "Nyaman"],
      gmapsSlug: "Filosofi+Kopi+Yogyakarta",
    },
    {
      nama: "Yellow Truck Coffee",
      kategori: "cafe",
      rating: 4.5,
      alamat: "Jl. Mangunsarkoro, Kota Yogyakarta",
      priceRange: 2,
      tags: ["Single Origin", "Tenang", "Meja Luas", "WiFi"],
      gmapsSlug: "Yellow+Truck+Coffee+Yogyakarta",
    },
    {
      nama: "GoWork Yogyakarta",
      kategori: "coworking",
      rating: 4.6,
      alamat: "Jl. Magelang KM 6, Kota Yogyakarta",
      priceRange: 3,
      tags: ["Hot Desk", "Meeting Room", "WiFi 100Mbps", "Printer"],
      gmapsSlug: "GoWork+Yogyakarta",
    },
    {
      nama: "Kolega.id Yogyakarta",
      kategori: "coworking",
      rating: 4.5,
      alamat: "Jl. Mayjen Sutoyo No.5, Kota Yogyakarta",
      priceRange: 2,
      tags: ["Komunitas Aktif", "Event Rutin", "Locker", "Dapur"],
      gmapsSlug: "Kolega+Yogyakarta",
    },
    {
      nama: "Perpustakaan Kota Yogyakarta",
      kategori: "library",
      rating: 4.3,
      alamat: "Jl. Suroto No.9, Kota Yogyakarta",
      priceRange: 1,
      tags: ["Gratis", "AC", "Sangat Tenang", "Koleksi Lengkap"],
      gmapsSlug: "Perpustakaan+Kota+Yogyakarta",
    },
    {
      nama: "Taman Pintar Yogyakarta",
      kategori: "quiet",
      rating: 4.4,
      alamat: "Jl. Panembahan Senopati, Kota Yogyakarta",
      priceRange: 1,
      tags: ["Outdoor Area", "Tenang Pagi Hari", "Terjangkau"],
      gmapsSlug: "Taman+Pintar+Yogyakarta",
    },
    {
      nama: "Kopitiam Oey Yogyakarta",
      kategori: "cafe",
      rating: 4.4,
      alamat: "Jl. Ketandan Wetan, Kota Yogyakarta",
      priceRange: 2,
      tags: ["Nuansa Retro", "Santai", "WiFi", "Menu Lengkap"],
      gmapsSlug: "Kopitiam+Oey+Yogyakarta",
    },
    {
      nama: "Ruang Rupa Coworking",
      kategori: "coworking",
      rating: 4.4,
      alamat: "Jl. Prawirotaman No.14, Kota Yogyakarta",
      priceRange: 2,
      tags: ["Kreatif", "Galeri Seni", "Komunitas", "Tenang"],
      gmapsSlug: "Ruang+Rupa+Yogyakarta",
    },
    {
      nama: "Alun-Alun Kidul",
      kategori: "quiet",
      rating: 4.2,
      alamat: "Jl. Alun-Alun Kidul, Kota Yogyakarta",
      priceRange: 1,
      tags: ["Outdoor", "Sore Hari", "Gratis", "Suasana Unik"],
      gmapsSlug: "Alun+Alun+Kidul+Yogyakarta",
    },
  ],

  "sleman": [
    {
      nama: "Goeboex Coffee Seturan",
      kategori: "cafe",
      rating: 4.6,
      alamat: "Jl. Seturan Raya, Depok, Sleman",
      priceRange: 1,
      tags: ["WiFi Kencang", "24 Jam", "Murah", "Ramai Mahasiswa"],
      gmapsSlug: "Goeboex+Coffee+Seturan+Sleman",
    },
    {
      nama: "Hyppe Coffee",
      kategori: "cafe",
      rating: 4.5,
      alamat: "Jl. Colombo No.22, Sleman",
      priceRange: 2,
      tags: ["Specialty Coffee", "Modern", "WiFi", "AC"],
      gmapsSlug: "Hyppe+Coffee+Sleman",
    },
    {
      nama: "Nakula Coworking Space",
      kategori: "coworking",
      rating: 4.6,
      alamat: "Jl. Nakula No.9, Condongcatur, Sleman",
      priceRange: 2,
      tags: ["Meeting Room", "WiFi Fiber", "24 Jam", "Printer"],
      gmapsSlug: "Nakula+Coworking+Sleman",
    },
    {
      nama: "Ruang Tunggu Coffee & Work",
      kategori: "coworking",
      rating: 4.5,
      alamat: "Jl. Kaliurang KM 8, Sleman",
      priceRange: 2,
      tags: ["Meja Lebar", "Stop Kontak Banyak", "Kopi Enak", "Tenang"],
      gmapsSlug: "Ruang+Tunggu+Coffee+Sleman",
    },
    {
      nama: "Perpustakaan UGM",
      kategori: "library",
      rating: 4.7,
      alamat: "Jl. Bulaksumur, Sleman",
      priceRange: 1,
      tags: ["Gratis (tamu)", "WiFi Kampus", "Sangat Tenang", "AC"],
      gmapsSlug: "Perpustakaan+UGM+Yogyakarta",
    },
    {
      nama: "VW Cafe",
      kategori: "cafe",
      rating: 4.4,
      alamat: "Jl. Selokan Mataram, Sleman",
      priceRange: 2,
      tags: ["Unik", "Outdoor Area", "WiFi", "Santai"],
      gmapsSlug: "VW+Cafe+Sleman",
    },
    {
      nama: "Taman Denggung Sleman",
      kategori: "quiet",
      rating: 4.3,
      alamat: "Jl. Dr. Rajiman, Sleman",
      priceRange: 1,
      tags: ["Gratis", "Pagi Hari", "Taman Kota", "Tenang"],
      gmapsSlug: "Taman+Denggung+Sleman",
    },
    {
      nama: "Sleman City Hall Area",
      kategori: "quiet",
      rating: 4.2,
      alamat: "Jl. Sri Rejeki, Godean, Sleman",
      priceRange: 1,
      tags: ["Ruang Terbuka", "Sejuk", "Bersih"],
      gmapsSlug: "Sleman+City+Hall",
    },
  ],

  "bantul": [
    {
      nama: "Kafe Klotok",
      kategori: "cafe",
      rating: 4.7,
      alamat: "Jl. Kaliurang KM 16, Pakem, Bantul",
      priceRange: 1,
      tags: ["View Sawah", "Tenang", "Nuansa Jawa", "Kopi Lokal"],
      gmapsSlug: "Kafe+Klotok+Bantul",
    },
    {
      nama: "Kopi Susu Tetangga",
      kategori: "cafe",
      rating: 4.5,
      alamat: "Jl. Parangtritis KM 3, Bantul",
      priceRange: 1,
      tags: ["Murah", "WiFi", "Santai", "Ramah"],
      gmapsSlug: "Kopi+Susu+Tetangga+Bantul",
    },
    {
      nama: "Dwarapala Coffee",
      kategori: "cafe",
      rating: 4.4,
      alamat: "Jl. Imogiri Timur, Bantul",
      priceRange: 2,
      tags: ["Specialty", "Tempatnya Nyaman", "WiFi", "AC"],
      gmapsSlug: "Dwarapala+Coffee+Bantul",
    },
    {
      nama: "Hutan Pinus Mangunan",
      kategori: "quiet",
      rating: 4.8,
      alamat: "Dlingo, Bantul",
      priceRange: 1,
      tags: ["Alam", "Sejuk", "Foto Cantik", "Inspiratif"],
      gmapsSlug: "Hutan+Pinus+Mangunan+Bantul",
    },
    {
      nama: "Kebun Buah Mangunan",
      kategori: "quiet",
      rating: 4.5,
      alamat: "Dlingo, Bantul",
      priceRange: 1,
      tags: ["View Bagus", "Pagi Hari", "Tenang", "Udara Segar"],
      gmapsSlug: "Kebun+Buah+Mangunan+Bantul",
    },
    {
      nama: "Bantul Creative Hub",
      kategori: "coworking",
      rating: 4.3,
      alamat: "Jl. Jend. Sudirman, Bantul Kota",
      priceRange: 1,
      tags: ["Komunitas Kreatif", "Workshop Rutin", "Terjangkau"],
      gmapsSlug: "Bantul+Creative+Hub",
    },
    {
      nama: "Perpustakaan Daerah Bantul",
      kategori: "library",
      rating: 4.2,
      alamat: "Jl. Jend. Sudirman No.4, Bantul",
      priceRange: 1,
      tags: ["Gratis", "AC", "Tenang", "Koleksi Lokal"],
      gmapsSlug: "Perpustakaan+Bantul",
    },
    {
      nama: "Warung Bu Ageng",
      kategori: "cafe",
      rating: 4.3,
      alamat: "Jl. Prawirotaman II, Bantul",
      priceRange: 1,
      tags: ["Autentik", "Murah", "Kopi Hitam", "Ramai Seniman"],
      gmapsSlug: "Warung+Bu+Ageng+Bantul",
    },
  ],

  "gunungkidul": [
    {
      nama: "Bukit Bintang Patuk",
      kategori: "quiet",
      rating: 4.8,
      alamat: "Patuk, Gunungkidul",
      priceRange: 1,
      tags: ["View Kota Jogja", "Malam/Sore", "Fotogenik", "Angin Sejuk"],
      gmapsSlug: "Bukit+Bintang+Patuk+Gunungkidul",
    },
    {
      nama: "Cafe Bukit Bintang",
      kategori: "cafe",
      rating: 4.6,
      alamat: "Jl. Jogja-Wonosari KM 17, Patuk",
      priceRange: 1,
      tags: ["View Lembah", "Sunset", "Harga Terjangkau", "WiFi"],
      gmapsSlug: "Cafe+Bukit+Bintang+Gunungkidul",
    },
    {
      nama: "Kedai Kopi Wonosari",
      kategori: "cafe",
      rating: 4.4,
      alamat: "Jl. KH. Agus Salim, Wonosari, Gunungkidul",
      priceRange: 1,
      tags: ["Lokal", "Murah Banget", "WiFi", "Cozy"],
      gmapsSlug: "Kedai+Kopi+Wonosari",
    },
    {
      nama: "Perpustakaan Daerah Gunungkidul",
      kategori: "library",
      rating: 4.2,
      alamat: "Jl. Brigjen Katamso, Wonosari",
      priceRange: 1,
      tags: ["Gratis", "Tenang", "AC", "Koleksi Lokal"],
      gmapsSlug: "Perpustakaan+Gunungkidul",
    },
    {
      nama: "Pantai Indrayanti",
      kategori: "quiet",
      rating: 4.7,
      alamat: "Tepus, Gunungkidul",
      priceRange: 1,
      tags: ["Pantai Bersih", "Tenang", "Inspiratif", "Sunset Indah"],
      gmapsSlug: "Pantai+Indrayanti+Gunungkidul",
    },
    {
      nama: "Pantai Baron",
      kategori: "quiet",
      rating: 4.5,
      alamat: "Tanjungsari, Gunungkidul",
      priceRange: 1,
      tags: ["Alam", "Terjangkau", "Sepi Hari Kerja", "Segar"],
      gmapsSlug: "Pantai+Baron+Gunungkidul",
    },
    {
      nama: "Kafe Pinggir Sawah GK",
      kategori: "cafe",
      rating: 4.3,
      alamat: "Ponjong, Gunungkidul",
      priceRange: 1,
      tags: ["View Sawah", "Tenang", "WiFi", "Murah"],
      gmapsSlug: "Kafe+Pinggir+Sawah+Gunungkidul",
    },
  ],

  "kulon-progo": [
    {
      nama: "Puncak Suroloyo",
      kategori: "quiet",
      rating: 4.8,
      alamat: "Menoreh, Kulon Progo",
      priceRange: 1,
      tags: ["View 360°", "Pegunungan", "Sejuk", "Sunrise Spektakuler"],
      gmapsSlug: "Puncak+Suroloyo+Kulonprogo",
    },
    {
      nama: "Kafe Menoreh",
      kategori: "cafe",
      rating: 4.5,
      alamat: "Jl. Menoreh, Samigaluh, Kulon Progo",
      priceRange: 1,
      tags: ["View Perbukitan", "Kopi Lokal", "WiFi", "Murah"],
      gmapsSlug: "Kafe+Menoreh+Kulonprogo",
    },
    {
      nama: "Waduk Sermo",
      kategori: "quiet",
      rating: 4.6,
      alamat: "Kokap, Kulon Progo",
      priceRange: 1,
      tags: ["Danau Buatan", "Sepi", "Alam", "Foto Bagus"],
      gmapsSlug: "Waduk+Sermo+Kulonprogo",
    },
    {
      nama: "Co-Space YIA Area",
      kategori: "coworking",
      rating: 4.4,
      alamat: "Jl. Wates KM 5, Kulon Progo",
      priceRange: 2,
      tags: ["Dekat Bandara", "WiFi Cepat", "Strategis", "AC"],
      gmapsSlug: "Coworking+YIA+Kulonprogo",
    },
    {
      nama: "Perpustakaan Kulon Progo",
      kategori: "library",
      rating: 4.1,
      alamat: "Jl. KH. Wahid Hasyim, Wates, Kulon Progo",
      priceRange: 1,
      tags: ["Gratis", "Tenang", "AC", "Koleksi Lokal"],
      gmapsSlug: "Perpustakaan+Kulonprogo",
    },
    {
      nama: "Kedai Mbak Sri",
      kategori: "cafe",
      rating: 4.3,
      alamat: "Jl. Sugiman, Wates, Kulon Progo",
      priceRange: 1,
      tags: ["Murah Banget", "Lokal", "Kopi Tradisional", "Ramai Pagi"],
      gmapsSlug: "Kedai+Mbak+Sri+Kulonprogo",
    },
    {
      nama: "Pantai Glagah",
      kategori: "quiet",
      rating: 4.5,
      alamat: "Temon, Kulon Progo",
      priceRange: 1,
      tags: ["Pantai Barat DIY", "Laguna", "Sepi", "Alam"],
      gmapsSlug: "Pantai+Glagah+Kulonprogo",
    },
    {
      nama: "Kebun Teh Nglinggo",
      kategori: "quiet",
      rating: 4.7,
      alamat: "Samigaluh, Kulon Progo",
      priceRange: 1,
      tags: ["View Teh Hijau", "Sejuk", "Tenang", "Inspiratif"],
      gmapsSlug: "Kebun+Teh+Nglinggo+Kulonprogo",
    },
  ],
};

export type EnvironmentPreference = "cafe" | "quiet" | "coworking" | "flexible";
export type PersonaId = "tech-professional" | "creative-professional" | "student-fresh-graduate" | "digital-nomad";

export function getRecommendedPlaces(
  districtId: string,
  environmentPreference: EnvironmentPreference,
  personaId: PersonaId
): SuggestedPlace[] {
  const all = PLACES_BY_DISTRICT[districtId] ?? [];
  if (all.length === 0) return [];

  // Tentukan kategori prioritas berdasarkan preferensi environment
  let primaryCategory: PlaceCategory;
  let secondaryCategory: PlaceCategory | null = null;

  switch (environmentPreference) {
    case "cafe":
      primaryCategory = "cafe";
      secondaryCategory = personaId === "tech-professional" || personaId === "digital-nomad"
        ? "coworking"
        : null;
      break;
    case "coworking":
      primaryCategory = "coworking";
      secondaryCategory = "cafe";
      break;
    case "quiet":
      primaryCategory = "quiet";
      secondaryCategory = "library";
      break;
    case "flexible":
    default:
      // Flexible: mix berdasarkan persona
      switch (personaId) {
        case "tech-professional":
          primaryCategory = "coworking";
          secondaryCategory = "cafe";
          break;
        case "creative-professional":
          primaryCategory = "cafe";
          secondaryCategory = "quiet";
          break;
        case "student-fresh-graduate":
          primaryCategory = "library";
          secondaryCategory = "cafe";
          break;
        case "digital-nomad":
        default:
          primaryCategory = "coworking";
          secondaryCategory = "quiet";
      }
  }

  // Ambil primary + secondary, urutkan berdasarkan rating desc
  const primary = all
    .filter((p) => p.kategori === primaryCategory)
    .sort((a, b) => b.rating - a.rating);

  const secondary = secondaryCategory
    ? all
        .filter((p) => p.kategori === secondaryCategory)
        .sort((a, b) => b.rating - a.rating)
    : [];

  // Gabung: primary dulu, sisanya secondary, max 8
  const combined = [...primary, ...secondary].slice(0, 8);

  // Kalau kurang dari 4, tambah sisanya semua kategori
  if (combined.length < 4) {
    const used = new Set(combined.map((p) => p.nama));
    const rest = all
      .filter((p) => !used.has(p.nama))
      .sort((a, b) => b.rating - a.rating);
    return [...combined, ...rest].slice(0, 8);
  }

  return combined;
}

export const CATEGORY_LABEL: Record<PlaceCategory, string> = {
  cafe: "Kafe",
  coworking: "Coworking",
  quiet: "Tempat Tenang",
  library: "Perpustakaan",
};

export const CATEGORY_COLOR: Record<PlaceCategory, { bg: string; text: string; border: string }> = {
  cafe:      { bg: "#FAF0EA", text: "#B5562F", border: "#B5562F30" },
  coworking: { bg: "#EEF4F8", text: "#1F5C73", border: "#1F5C7330" },
  quiet:     { bg: "#EDF5F1", text: "#2F6F4E", border: "#2F6F4E30" },
  library:   { bg: "#F5F0E8", text: "#7B6040", border: "#7B604030" },
};
