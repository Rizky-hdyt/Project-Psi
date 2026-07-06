export type PlaceCategory = "cafe" | "coworking" | "quiet" | "library";

export interface SuggestedPlace {
  nama: string;
  kategori: PlaceCategory;
  rating: number;       // 3.5 – 5.0
  alamat: string;
  priceRange: 1 | 2 | 3; // 1 = murah, 2 = sedang, 3 = mahal
  tags: string[];
  subDistrictId: string; // id kecamatan asli, cocok dengan SubDistrict.id
  gmapsSlug?: string;   // suffix untuk link maps.google.com/?q=...
}

export const PLACES_BY_DISTRICT: Record<string, SuggestedPlace[]> = {
  "kota-yogyakarta": [
    {
      nama: "Klinik Kopi",
      kategori: "cafe",
      rating: 4.7,
      alamat: "Jl. Yos Sudarso, Kotabaru, Gondokusuman, Kota Yogyakarta",
      priceRange: 2,
      tags: ["WiFi Kencang", "AC", "Cozy", "Instagramable"],
      subDistrictId: "kota-yogyakarta-gondokusuman",
      gmapsSlug: "Klinik+Kopi+Yogyakarta",
    },
    {
      nama: "Filosofi Kopi Jogja",
      kategori: "cafe",
      rating: 4.6,
      alamat: "Jl. Poncowinatan No.6, Jetis, Kota Yogyakarta",
      priceRange: 2,
      tags: ["Nuansa Klasik", "Kopi Specialty", "WiFi", "Nyaman"],
      subDistrictId: "kota-yogyakarta-jetis",
      gmapsSlug: "Filosofi+Kopi+Yogyakarta",
    },
    {
      nama: "Yellow Truck Coffee",
      kategori: "cafe",
      rating: 4.5,
      alamat: "Jl. Mangunsarkoro, Gondokusuman, Kota Yogyakarta",
      priceRange: 2,
      tags: ["Single Origin", "Tenang", "Meja Luas", "WiFi"],
      subDistrictId: "kota-yogyakarta-gondokusuman",
      gmapsSlug: "Yellow+Truck+Coffee+Yogyakarta",
    },
    {
      nama: "GoWork Yogyakarta",
      kategori: "coworking",
      rating: 4.6,
      alamat: "Jl. Magelang KM 4, Jetis, Kota Yogyakarta",
      priceRange: 3,
      tags: ["Hot Desk", "Meeting Room", "WiFi 100Mbps", "Printer"],
      subDistrictId: "kota-yogyakarta-jetis",
      gmapsSlug: "GoWork+Yogyakarta",
    },
    {
      nama: "Kolega.id Yogyakarta",
      kategori: "coworking",
      rating: 4.5,
      alamat: "Jl. Mayjen Sutoyo No.5, Gondomanan, Kota Yogyakarta",
      priceRange: 2,
      tags: ["Komunitas Aktif", "Event Rutin", "Locker", "Dapur"],
      subDistrictId: "kota-yogyakarta-gondomanan",
      gmapsSlug: "Kolega+Yogyakarta",
    },
    {
      nama: "Perpustakaan Kota Yogyakarta",
      kategori: "library",
      rating: 4.3,
      alamat: "Jl. Suroto No.9, Kotabaru, Gondokusuman, Kota Yogyakarta",
      priceRange: 1,
      tags: ["Gratis", "AC", "Sangat Tenang", "Koleksi Lengkap"],
      subDistrictId: "kota-yogyakarta-gondokusuman",
      gmapsSlug: "Perpustakaan+Kota+Yogyakarta",
    },
    {
      nama: "Taman Pintar Yogyakarta",
      kategori: "quiet",
      rating: 4.4,
      alamat: "Jl. Panembahan Senopati, Gondomanan, Kota Yogyakarta",
      priceRange: 1,
      tags: ["Outdoor Area", "Tenang Pagi Hari", "Terjangkau"],
      subDistrictId: "kota-yogyakarta-gondomanan",
      gmapsSlug: "Taman+Pintar+Yogyakarta",
    },
    {
      nama: "Kopitiam Oey Yogyakarta",
      kategori: "cafe",
      rating: 4.4,
      alamat: "Jl. Ketandan Wetan, Gondomanan, Kota Yogyakarta",
      priceRange: 2,
      tags: ["Nuansa Retro", "Santai", "WiFi", "Menu Lengkap"],
      subDistrictId: "kota-yogyakarta-gondomanan",
      gmapsSlug: "Kopitiam+Oey+Yogyakarta",
    },
    {
      nama: "Ruang Rupa Coworking",
      kategori: "coworking",
      rating: 4.4,
      alamat: "Jl. Prawirotaman No.14, Mantrijeron, Kota Yogyakarta",
      priceRange: 2,
      tags: ["Kreatif", "Galeri Seni", "Komunitas", "Tenang"],
      subDistrictId: "kota-yogyakarta-mantrijeron",
      gmapsSlug: "Ruang+Rupa+Yogyakarta",
    },
    {
      nama: "Alun-Alun Kidul",
      kategori: "quiet",
      rating: 4.2,
      alamat: "Jl. Alun-Alun Kidul, Mantrijeron, Kota Yogyakarta",
      priceRange: 1,
      tags: ["Outdoor", "Sore Hari", "Gratis", "Suasana Unik"],
      subDistrictId: "kota-yogyakarta-mantrijeron",
      gmapsSlug: "Alun+Alun+Kidul+Yogyakarta",
    },
    {
      nama: "Legend Coffee Umbulharjo",
      kategori: "cafe",
      rating: 4.4,
      alamat: "Jl. Veteran, Umbulharjo, Kota Yogyakarta",
      priceRange: 1,
      tags: ["WiFi Kencang", "Ramai Mahasiswa", "Murah", "24 Jam"],
      subDistrictId: "kota-yogyakarta-umbulharjo",
      gmapsSlug: "Legend+Coffee+Umbulharjo+Yogyakarta",
    },
    {
      nama: "UAD Creative Coworking",
      kategori: "coworking",
      rating: 4.3,
      alamat: "Jl. Kapas, Umbulharjo, Kota Yogyakarta",
      priceRange: 2,
      tags: ["Dekat Kampus", "Meeting Room", "WiFi Fiber", "Printer"],
      subDistrictId: "kota-yogyakarta-umbulharjo",
      gmapsSlug: "UAD+Creative+Coworking+Yogyakarta",
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
      subDistrictId: "sleman-depok",
      gmapsSlug: "Goeboex+Coffee+Seturan+Sleman",
    },
    {
      nama: "Hyppe Coffee",
      kategori: "cafe",
      rating: 4.5,
      alamat: "Jl. Colombo No.22, Caturtunggal, Depok, Sleman",
      priceRange: 2,
      tags: ["Specialty Coffee", "Modern", "WiFi", "AC"],
      subDistrictId: "sleman-depok",
      gmapsSlug: "Hyppe+Coffee+Sleman",
    },
    {
      nama: "Nakula Coworking Space",
      kategori: "coworking",
      rating: 4.6,
      alamat: "Jl. Nakula No.9, Condongcatur, Depok, Sleman",
      priceRange: 2,
      tags: ["Meeting Room", "WiFi Fiber", "24 Jam", "Printer"],
      subDistrictId: "sleman-depok",
      gmapsSlug: "Nakula+Coworking+Sleman",
    },
    {
      nama: "Ruang Tunggu Coffee & Work",
      kategori: "coworking",
      rating: 4.5,
      alamat: "Jl. Kaliurang KM 8, Ngaglik, Sleman",
      priceRange: 2,
      tags: ["Meja Lebar", "Stop Kontak Banyak", "Kopi Enak", "Tenang"],
      subDistrictId: "sleman-ngaglik",
      gmapsSlug: "Ruang+Tunggu+Coffee+Sleman",
    },
    {
      nama: "Perpustakaan UGM",
      kategori: "library",
      rating: 4.7,
      alamat: "Jl. Bulaksumur, Depok, Sleman",
      priceRange: 1,
      tags: ["Gratis (tamu)", "WiFi Kampus", "Sangat Tenang", "AC"],
      subDistrictId: "sleman-depok",
      gmapsSlug: "Perpustakaan+UGM+Yogyakarta",
    },
    {
      nama: "VW Cafe",
      kategori: "cafe",
      rating: 4.4,
      alamat: "Jl. Selokan Mataram, Mlati, Sleman",
      priceRange: 2,
      tags: ["Unik", "Outdoor Area", "WiFi", "Santai"],
      subDistrictId: "sleman-mlati",
      gmapsSlug: "VW+Cafe+Sleman",
    },
    {
      nama: "Taman Denggung Sleman",
      kategori: "quiet",
      rating: 4.3,
      alamat: "Jl. Dr. Rajiman, Mlati, Sleman",
      priceRange: 1,
      tags: ["Gratis", "Pagi Hari", "Taman Kota", "Tenang"],
      subDistrictId: "sleman-mlati",
      gmapsSlug: "Taman+Denggung+Sleman",
    },
    {
      nama: "Sleman City Hall Area",
      kategori: "quiet",
      rating: 4.2,
      alamat: "Jl. Sri Rejeki, Gamping, Sleman",
      priceRange: 1,
      tags: ["Ruang Terbuka", "Sejuk", "Bersih"],
      subDistrictId: "sleman-gamping",
      gmapsSlug: "Sleman+City+Hall",
    },
    {
      nama: "Gamping Hub Coworking",
      kategori: "coworking",
      rating: 4.3,
      alamat: "Jl. Wates KM 5, Gamping, Sleman",
      priceRange: 2,
      tags: ["Dekat RS", "WiFi", "Meeting Room", "Parkir Luas"],
      subDistrictId: "sleman-gamping",
      gmapsSlug: "Gamping+Hub+Coworking+Sleman",
    },
    {
      nama: "Kopi Kaliurang Ngaglik",
      kategori: "cafe",
      rating: 4.4,
      alamat: "Jl. Palagan Tentara Pelajar, Ngaglik, Sleman",
      priceRange: 2,
      tags: ["Sejuk", "WiFi Kencang", "View Gunung", "Nyaman"],
      subDistrictId: "sleman-ngaglik",
      gmapsSlug: "Kopi+Palagan+Ngaglik+Sleman",
    },
    {
      nama: "Kopi Kalasan Heritage",
      kategori: "cafe",
      rating: 4.5,
      alamat: "Jl. Solo KM 13, Kalasan, Sleman",
      priceRange: 1,
      tags: ["View Candi Prambanan", "Kopi Lokal", "WiFi", "Santai"],
      subDistrictId: "sleman-kalasan",
      gmapsSlug: "Kopi+Kalasan+Heritage+Sleman",
    },
    {
      nama: "Kalasan Creative Space",
      kategori: "coworking",
      rating: 4.2,
      alamat: "Jl. Candi Sambisari, Kalasan, Sleman",
      priceRange: 2,
      tags: ["Komunitas Kecil", "WiFi Fiber", "Tenang", "Parkir Luas"],
      subDistrictId: "sleman-kalasan",
      gmapsSlug: "Kalasan+Creative+Space+Sleman",
    },
  ],

  "bantul": [
    {
      nama: "Kafe Klotok",
      kategori: "cafe",
      rating: 4.7,
      alamat: "Jl. Imogiri Timur KM 14, Imogiri, Bantul",
      priceRange: 1,
      tags: ["View Sawah", "Tenang", "Nuansa Jawa", "Kopi Lokal"],
      subDistrictId: "bantul-imogiri",
      gmapsSlug: "Kafe+Klotok+Bantul",
    },
    {
      nama: "Kopi Susu Tetangga",
      kategori: "cafe",
      rating: 4.5,
      alamat: "Jl. Parangtritis KM 3, Sewon, Bantul",
      priceRange: 1,
      tags: ["Murah", "WiFi", "Santai", "Ramah"],
      subDistrictId: "bantul-sewon",
      gmapsSlug: "Kopi+Susu+Tetangga+Bantul",
    },
    {
      nama: "Dwarapala Coffee",
      kategori: "cafe",
      rating: 4.4,
      alamat: "Jl. Imogiri Timur, Banguntapan, Bantul",
      priceRange: 2,
      tags: ["Specialty", "Tempatnya Nyaman", "WiFi", "AC"],
      subDistrictId: "bantul-banguntapan",
      gmapsSlug: "Dwarapala+Coffee+Bantul",
    },
    {
      nama: "Hutan Pinus Mangunan",
      kategori: "quiet",
      rating: 4.8,
      alamat: "Mangunan, Imogiri, Bantul",
      priceRange: 1,
      tags: ["Alam", "Sejuk", "Foto Cantik", "Inspiratif"],
      subDistrictId: "bantul-imogiri",
      gmapsSlug: "Hutan+Pinus+Mangunan+Bantul",
    },
    {
      nama: "Kebun Buah Mangunan",
      kategori: "quiet",
      rating: 4.5,
      alamat: "Mangunan, Imogiri, Bantul",
      priceRange: 1,
      tags: ["View Bagus", "Pagi Hari", "Tenang", "Udara Segar"],
      subDistrictId: "bantul-imogiri",
      gmapsSlug: "Kebun+Buah+Mangunan+Bantul",
    },
    {
      nama: "Bantul Creative Hub",
      kategori: "coworking",
      rating: 4.3,
      alamat: "Jl. Jend. Sudirman, Jetis, Bantul",
      priceRange: 1,
      tags: ["Komunitas Kreatif", "Workshop Rutin", "Terjangkau"],
      subDistrictId: "bantul-jetis",
      gmapsSlug: "Bantul+Creative+Hub",
    },
    {
      nama: "Perpustakaan Daerah Bantul",
      kategori: "library",
      rating: 4.2,
      alamat: "Jl. Jend. Sudirman No.4, Jetis, Bantul",
      priceRange: 1,
      tags: ["Gratis", "AC", "Tenang", "Koleksi Lokal"],
      subDistrictId: "bantul-jetis",
      gmapsSlug: "Perpustakaan+Bantul",
    },
    {
      nama: "Warung Bu Ageng",
      kategori: "cafe",
      rating: 4.3,
      alamat: "Jl. Sugeng Jeroni, Kasihan, Bantul",
      priceRange: 1,
      tags: ["Autentik", "Murah", "Kopi Hitam", "Ramai Seniman"],
      subDistrictId: "bantul-kasihan",
      gmapsSlug: "Warung+Bu+Ageng+Bantul",
    },
    {
      nama: "Sewon Artspace Cafe",
      kategori: "cafe",
      rating: 4.3,
      alamat: "Jl. Bantul KM 6, Sewon, Bantul",
      priceRange: 1,
      tags: ["Dekat Kampus ISI", "Kreatif", "WiFi", "Murah"],
      subDistrictId: "bantul-sewon",
      gmapsSlug: "Sewon+Artspace+Cafe+Bantul",
    },
    {
      nama: "Banguntapan Work Corner",
      kategori: "coworking",
      rating: 4.2,
      alamat: "Jl. Wonocatur, Banguntapan, Bantul",
      priceRange: 2,
      tags: ["Dekat Kota Yogya", "WiFi Fiber", "Meeting Room", "Parkir"],
      subDistrictId: "bantul-banguntapan",
      gmapsSlug: "Banguntapan+Work+Corner+Bantul",
    },
    {
      nama: "Kasihan Seni Kopi",
      kategori: "cafe",
      rating: 4.4,
      alamat: "Jl. PKU Muhammadiyah, Kasihan, Bantul",
      priceRange: 1,
      tags: ["Komunitas Seni", "Kopi Lokal", "WiFi", "Santai"],
      subDistrictId: "bantul-kasihan",
      gmapsSlug: "Kasihan+Seni+Kopi+Bantul",
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
      subDistrictId: "gunungkidul-patuk",
      gmapsSlug: "Bukit+Bintang+Patuk+Gunungkidul",
    },
    {
      nama: "Cafe Bukit Bintang",
      kategori: "cafe",
      rating: 4.6,
      alamat: "Jl. Jogja-Wonosari KM 17, Patuk, Gunungkidul",
      priceRange: 1,
      tags: ["View Lembah", "Sunset", "Harga Terjangkau", "WiFi"],
      subDistrictId: "gunungkidul-patuk",
      gmapsSlug: "Cafe+Bukit+Bintang+Gunungkidul",
    },
    {
      nama: "Kedai Kopi Wonosari",
      kategori: "cafe",
      rating: 4.4,
      alamat: "Jl. KH. Agus Salim, Wonosari, Gunungkidul",
      priceRange: 1,
      tags: ["Lokal", "Murah Banget", "WiFi", "Cozy"],
      subDistrictId: "gunungkidul-wonosari",
      gmapsSlug: "Kedai+Kopi+Wonosari",
    },
    {
      nama: "Perpustakaan Daerah Gunungkidul",
      kategori: "library",
      rating: 4.2,
      alamat: "Jl. Brigjen Katamso, Wonosari, Gunungkidul",
      priceRange: 1,
      tags: ["Gratis", "Tenang", "AC", "Koleksi Lokal"],
      subDistrictId: "gunungkidul-wonosari",
      gmapsSlug: "Perpustakaan+Gunungkidul",
    },
    {
      nama: "Pantai Indrayanti",
      kategori: "quiet",
      rating: 4.7,
      alamat: "Playen, Gunungkidul",
      priceRange: 1,
      tags: ["Pantai Bersih", "Tenang", "Inspiratif", "Sunset Indah"],
      subDistrictId: "gunungkidul-playen",
      gmapsSlug: "Pantai+Indrayanti+Gunungkidul",
    },
    {
      nama: "Pantai Baron",
      kategori: "quiet",
      rating: 4.5,
      alamat: "Playen, Gunungkidul",
      priceRange: 1,
      tags: ["Alam", "Terjangkau", "Sepi Hari Kerja", "Segar"],
      subDistrictId: "gunungkidul-playen",
      gmapsSlug: "Pantai+Baron+Gunungkidul",
    },
    {
      nama: "Kafe Pinggir Sawah GK",
      kategori: "cafe",
      rating: 4.3,
      alamat: "Ponjong, Karangmojo, Gunungkidul",
      priceRange: 1,
      tags: ["View Sawah", "Tenang", "WiFi", "Murah"],
      subDistrictId: "gunungkidul-karangmojo",
      gmapsSlug: "Kafe+Pinggir+Sawah+Gunungkidul",
    },
    {
      nama: "Karangmojo Sawah View",
      kategori: "quiet",
      rating: 4.3,
      alamat: "Jl. Wonosari-Karangmojo, Karangmojo, Gunungkidul",
      priceRange: 1,
      tags: ["View Sawah", "Tenang", "Udara Segar", "Gratis"],
      subDistrictId: "gunungkidul-karangmojo",
      gmapsSlug: "Karangmojo+Sawah+View+Gunungkidul",
    },
    {
      nama: "Kedai Kopi Semin",
      kategori: "cafe",
      rating: 4.2,
      alamat: "Jl. Semin-Karangmojo, Semin, Gunungkidul",
      priceRange: 1,
      tags: ["Murah", "Lokal", "WiFi", "Tenang"],
      subDistrictId: "gunungkidul-semin",
      gmapsSlug: "Kedai+Kopi+Semin+Gunungkidul",
    },
    {
      nama: "Semin Community Space",
      kategori: "coworking",
      rating: 4.0,
      alamat: "Jl. Baron KM 2, Semin, Gunungkidul",
      priceRange: 1,
      tags: ["Komunitas Baru", "WiFi", "Terjangkau", "Ruang Terbuka"],
      subDistrictId: "gunungkidul-semin",
      gmapsSlug: "Semin+Community+Space+Gunungkidul",
    },
  ],

  "kulon-progo": [
    {
      nama: "Puncak Suroloyo",
      kategori: "quiet",
      rating: 4.8,
      alamat: "Jl. Suroloyo, Pengasih, Kulon Progo",
      priceRange: 1,
      tags: ["View 360°", "Pegunungan", "Sejuk", "Sunrise Spektakuler"],
      subDistrictId: "kulon-progo-pengasih",
      gmapsSlug: "Puncak+Suroloyo+Kulonprogo",
    },
    {
      nama: "Kafe Menoreh",
      kategori: "cafe",
      rating: 4.5,
      alamat: "Jl. Menoreh, Sentolo, Kulon Progo",
      priceRange: 1,
      tags: ["View Perbukitan", "Kopi Lokal", "WiFi", "Murah"],
      subDistrictId: "kulon-progo-sentolo",
      gmapsSlug: "Kafe+Menoreh+Kulonprogo",
    },
    {
      nama: "Waduk Sermo",
      kategori: "quiet",
      rating: 4.6,
      alamat: "Jl. Waduk Sermo, Pengasih, Kulon Progo",
      priceRange: 1,
      tags: ["Danau Buatan", "Sepi", "Alam", "Foto Bagus"],
      subDistrictId: "kulon-progo-pengasih",
      gmapsSlug: "Waduk+Sermo+Kulonprogo",
    },
    {
      nama: "Co-Space YIA Area",
      kategori: "coworking",
      rating: 4.4,
      alamat: "Jl. Wates KM 5, Temon, Kulon Progo",
      priceRange: 2,
      tags: ["Dekat Bandara", "WiFi Cepat", "Strategis", "AC"],
      subDistrictId: "kulon-progo-temon",
      gmapsSlug: "Coworking+YIA+Kulonprogo",
    },
    {
      nama: "Perpustakaan Kulon Progo",
      kategori: "library",
      rating: 4.1,
      alamat: "Jl. KH. Wahid Hasyim, Wates, Kulon Progo",
      priceRange: 1,
      tags: ["Gratis", "Tenang", "AC", "Koleksi Lokal"],
      subDistrictId: "kulon-progo-wates",
      gmapsSlug: "Perpustakaan+Kulonprogo",
    },
    {
      nama: "Kedai Mbak Sri",
      kategori: "cafe",
      rating: 4.3,
      alamat: "Jl. Sugiman, Wates, Kulon Progo",
      priceRange: 1,
      tags: ["Murah Banget", "Lokal", "Kopi Tradisional", "Ramai Pagi"],
      subDistrictId: "kulon-progo-wates",
      gmapsSlug: "Kedai+Mbak+Sri+Kulonprogo",
    },
    {
      nama: "Pantai Glagah",
      kategori: "quiet",
      rating: 4.5,
      alamat: "Jl. Pantai Glagah, Temon, Kulon Progo",
      priceRange: 1,
      tags: ["Pantai Barat DIY", "Laguna", "Sepi", "Alam"],
      subDistrictId: "kulon-progo-temon",
      gmapsSlug: "Pantai+Glagah+Kulonprogo",
    },
    {
      nama: "Kebun Teh Nglinggo",
      kategori: "quiet",
      rating: 4.7,
      alamat: "Nglinggo, Sentolo, Kulon Progo",
      priceRange: 1,
      tags: ["View Teh Hijau", "Sejuk", "Tenang", "Inspiratif"],
      subDistrictId: "kulon-progo-sentolo",
      gmapsSlug: "Kebun+Teh+Nglinggo+Kulonprogo",
    },
    {
      nama: "Panjatan Pantai Cafe",
      kategori: "cafe",
      rating: 4.3,
      alamat: "Jl. Pantai Trisik, Panjatan, Kulon Progo",
      priceRange: 1,
      tags: ["View Pantai", "Tenang", "Kopi Lokal", "WiFi"],
      subDistrictId: "kulon-progo-panjatan",
      gmapsSlug: "Panjatan+Pantai+Cafe+Kulonprogo",
    },
    {
      nama: "Panjatan Reading Corner",
      kategori: "library",
      rating: 4.0,
      alamat: "Jl. Bugel, Panjatan, Kulon Progo",
      priceRange: 1,
      tags: ["Gratis", "Tenang", "Koleksi Lokal", "AC"],
      subDistrictId: "kulon-progo-panjatan",
      gmapsSlug: "Panjatan+Reading+Corner+Kulonprogo",
    },
  ],
};

export type EnvironmentPreference = "cafe" | "quiet" | "coworking" | "flexible";
export type PersonaId = "tech-professional" | "creative-professional" | "student-fresh-graduate" | "digital-nomad";

function pickByCategory(
  places: SuggestedPlace[],
  primaryCategory: PlaceCategory,
  secondaryCategory: PlaceCategory | null
): SuggestedPlace[] {
  const primary = places
    .filter((p) => p.kategori === primaryCategory)
    .sort((a, b) => b.rating - a.rating);

  const secondary = secondaryCategory
    ? places
        .filter((p) => p.kategori === secondaryCategory)
        .sort((a, b) => b.rating - a.rating)
    : [];

  return [...primary, ...secondary];
}

export function getRecommendedPlaces(
  districtId: string,
  targetSubDistrictId: string | null,
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

  const inTarget = targetSubDistrictId
    ? all.filter((p) => p.subDistrictId === targetSubDistrictId)
    : all;
  const nearby = targetSubDistrictId
    ? all.filter((p) => p.subDistrictId !== targetSubDistrictId)
    : [];

  const combined = [
    ...pickByCategory(inTarget, primaryCategory, secondaryCategory),
    ...pickByCategory(nearby, primaryCategory, secondaryCategory),
  ].slice(0, 8);

  // Kalau kurang dari 4, tambah sisanya semua kategori (target dulu, baru sekitar)
  if (combined.length < 4) {
    const used = new Set(combined.map((p) => p.nama));
    const restTarget = inTarget
      .filter((p) => !used.has(p.nama))
      .sort((a, b) => b.rating - a.rating);
    const restNearby = nearby
      .filter((p) => !used.has(p.nama))
      .sort((a, b) => b.rating - a.rating);
    return [...combined, ...restTarget, ...restNearby].slice(0, 8);
  }

  return combined;
}

export const CATEGORY_LABEL: Record<PlaceCategory, string> = {
  cafe: "Kafe",
  coworking: "Coworking",
  quiet: "Tempat Tenang",
  library: "Perpustakaan",
};
