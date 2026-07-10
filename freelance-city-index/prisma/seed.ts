import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { neonConfig } from "@neondatabase/serverless";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Hapus data lama dulu (urutan penting karena ada relasi)
  await prisma.auditLog.deleteMany();
  await prisma.subDistrictScore.deleteMany();
  await prisma.subDistrict.deleteMany();
  await prisma.districtScore.deleteMany();
  await prisma.district.deleteMany();

  // Seed 5 distrik
  await prisma.district.createMany({
    data: [
      {
        id: "kota-yogyakarta",
        nama: "Kota Yogyakarta",
        tipe: "Kota",
        umk: 2830000,
        coworkingCount: 12,
        internetMbps: 90,
        kostMin: 900000,
        kostMax: 2000000,
        estimasiBiayaHidup: 3200000,
        ringkasanKarakteristik:
          "Pusat kota dengan akses internet terbaik, coworking terbanyak, dan komunitas profesional paling aktif. Biaya hidup tertinggi di DIY, tapi ekosistem kerja paling lengkap.",
      },
      {
        id: "sleman",
        nama: "Sleman",
        tipe: "Kabupaten",
        umk: 2690000,
        coworkingCount: 9,
        internetMbps: 85,
        kostMin: 700000,
        kostMax: 1600000,
        estimasiBiayaHidup: 2800000,
        ringkasanKarakteristik:
          "Kawasan paling seimbang di DIY: internet kencang, banyak coworking di area Depok & Mlati, dan biaya hidup lebih terjangkau dari kota. Favorit tech worker dan mahasiswa S2.",
      },
      {
        id: "bantul",
        nama: "Bantul",
        tipe: "Kabupaten",
        umk: 2490000,
        coworkingCount: 5,
        internetMbps: 70,
        kostMin: 500000,
        kostMax: 1200000,
        estimasiBiayaHidup: 2300000,
        ringkasanKarakteristik:
          "Pilihan hemat dengan lingkungan tenang, banyak ruang publik, dan suasana yang cocok untuk pekerja kreatif yang butuh ketenangan. Komunitas berkembang tapi belum sepadat Sleman/Kota.",
      },
      {
        id: "gunungkidul",
        nama: "Gunungkidul",
        tipe: "Kabupaten",
        umk: 2330000,
        coworkingCount: 2,
        internetMbps: 45,
        kostMin: 350000,
        kostMax: 800000,
        estimasiBiayaHidup: 1900000,
        ringkasanKarakteristik:
          "Biaya hidup terendah di DIY dengan lingkungan paling tenang. Internet masih berkembang, cocok untuk kerja yang tidak butuh bandwidth tinggi. Pilihan bagi yang prioritaskan pengeluaran rendah dan ketenangan.",
      },
      {
        id: "kulon-progo",
        nama: "Kulon Progo",
        tipe: "Kabupaten",
        umk: 2490000,
        coworkingCount: 3,
        internetMbps: 55,
        kostMin: 400000,
        kostMax: 900000,
        estimasiBiayaHidup: 2100000,
        ringkasanKarakteristik:
          "Berkembang pesat dengan adanya Bandara YIA. Biaya hidup rendah dan lingkungan hijau yang nyaman. Infrastruktur internet dan komunitas masih tumbuh, tapi potensi besar untuk jangka panjang.",
      },
    ],
  });

  // Seed skor indikator
  // Rebalance 2026-07-06: nilai lama bikin Sleman menang di HAMPIR SEMUA
  // kombinasi persona+sinyal (generalis tanpa kelemahan) sehingga
  // rekomendasi terasa monoton. Nilai baru dirancang supaya tiap distrik
  // punya identitas skor yang lebih tajam sesuai ringkasanKarakteristik-nya
  // masing-masing, dan tetap bisa berubah pemenang dalam SATU persona kalau
  // sinyal quiz (internet/community priority, environment preference)
  // digeser ke arah lain — lihat catatan simulasi di RIWAYAT_PENGERJAAN.md.
  await prisma.districtScore.createMany({
    data: [
      { districtId: "kota-yogyakarta", indicatorId: "internet",     skor: 88 },
      { districtId: "kota-yogyakarta", indicatorId: "cost",         skor: 42 },
      { districtId: "kota-yogyakarta", indicatorId: "community",    skor: 97 },
      { districtId: "kota-yogyakarta", indicatorId: "environment",  skor: 52 },

      { districtId: "sleman",          indicatorId: "internet",     skor: 84 },
      { districtId: "sleman",          indicatorId: "cost",         skor: 60 },
      { districtId: "sleman",          indicatorId: "community",    skor: 75 },
      { districtId: "sleman",          indicatorId: "environment",  skor: 70 },

      { districtId: "bantul",          indicatorId: "internet",     skor: 58 },
      { districtId: "bantul",          indicatorId: "cost",         skor: 78 },
      { districtId: "bantul",          indicatorId: "community",    skor: 62 },
      { districtId: "bantul",          indicatorId: "environment",  skor: 92 },

      { districtId: "gunungkidul",     indicatorId: "internet",     skor: 32 },
      { districtId: "gunungkidul",     indicatorId: "cost",         skor: 99 },
      { districtId: "gunungkidul",     indicatorId: "community",    skor: 26 },
      { districtId: "gunungkidul",     indicatorId: "environment",  skor: 95 },

      { districtId: "kulon-progo",     indicatorId: "internet",     skor: 45 },
      { districtId: "kulon-progo",     indicatorId: "cost",         skor: 90 },
      { districtId: "kulon-progo",     indicatorId: "community",    skor: 40 },
      { districtId: "kulon-progo",     indicatorId: "environment",  skor: 82 },
    ],
  });

  // Seed 25 kecamatan (5 per distrik) — ranking level kedua ("Kecamatan Terbaik
  // di {distrik}"), sumber: files/Dataset_25_Kecamatan_FCI_Yogyakarta.xlsx
  // (dataset dari dosen pembimbing). Skor 4 indikator dikali 10 dari skala asli
  // 0-10 ke 0-100 supaya konsisten dengan DistrictScore. tourismScore TETAP
  // skala asli 0-10 (bukan bagian formula, cuma tampil sebagai info tambahan —
  // lihat catatan "kenapa tidak nambah indikator ke-5" di RIWAYAT_PENGERJAAN.md).
  const subDistricts = [
    // Kota Yogyakarta
    { id: "kota-yogyakarta-gondokusuman", districtId: "kota-yogyakarta", nama: "Gondokusuman",
      latitude: -7.782, longitude: 110.376, estimasiBiayaHidup: 3200000, coworkingCount: 8, cafeCount: 120, universityCount: 3, tourismScore: 8.5,
      ringkasanKarakteristik: "Jantung akademik dekat UGM dan Kotabaru, coworking dan kafe terpadat di Kota Yogyakarta. Internet kencang dan komunitas profesional sangat aktif, favorit tech professional, tapi biaya sewa termasuk tinggi.",
      skor: { internet: 94, cost: 75, community: 94, environment: 85 } },
    { id: "kota-yogyakarta-umbulharjo", districtId: "kota-yogyakarta", nama: "Umbulharjo",
      latitude: -7.816, longitude: 110.390, estimasiBiayaHidup: 2800000, coworkingCount: 4, cafeCount: 90, universityCount: 2, tourismScore: 7.8,
      ringkasanKarakteristik: "Kawasan mahasiswa yang terus berkembang, dekat kampus UAD dan Amikom. Biaya hidup lebih terjangkau dari pusat kota dengan komunitas kerja yang cukup ramai.",
      skor: { internet: 88, cost: 86, community: 87, environment: 83 } },
    { id: "kota-yogyakarta-jetis", districtId: "kota-yogyakarta", nama: "Jetis",
      latitude: -7.783, longitude: 110.367, estimasiBiayaHidup: 2900000, coworkingCount: 3, cafeCount: 70, universityCount: 1, tourismScore: 8.0,
      ringkasanKarakteristik: "Persis di pusat Kota Yogyakarta, akses ke mana-mana mudah. Suasana kota yang padat membuat lingkungan kerja standar, cocok yang mengutamakan lokasi sentral.",
      skor: { internet: 87, cost: 81, community: 84, environment: 84 } },
    { id: "kota-yogyakarta-mantrijeron", districtId: "kota-yogyakarta", nama: "Mantrijeron",
      latitude: -7.812, longitude: 110.359, estimasiBiayaHidup: 3100000, coworkingCount: 5, cafeCount: 95, universityCount: 0, tourismScore: 9.2,
      ringkasanKarakteristik: "Rumah bagi kawasan Prawirotaman yang penuh kafe dan galeri seni, favorit pekerja kreatif. Lingkungan nyaman dan komunitas seni aktif, meski internet sedikit di bawah Gondokusuman.",
      skor: { internet: 89, cost: 79, community: 92, environment: 90 } },
    { id: "kota-yogyakarta-gondomanan", districtId: "kota-yogyakarta", nama: "Gondomanan",
      latitude: -7.801, longitude: 110.369, estimasiBiayaHidup: 3000000, coworkingCount: 2, cafeCount: 60, universityCount: 0, tourismScore: 9.0,
      ringkasanKarakteristik: "Area Malioboro yang ikonik, ramai wisatawan sekaligus pelaku kreatif. Lingkungan menarik untuk yang suka suasana ramai, tapi coworking masih terbatas.",
      skor: { internet: 85, cost: 78, community: 85, environment: 88 } },

    // Sleman
    { id: "sleman-depok", districtId: "sleman", nama: "Depok",
      latitude: -7.758, longitude: 110.401, estimasiBiayaHidup: 3300000, coworkingCount: 15, cafeCount: 180, universityCount: 5, tourismScore: 8.7,
      ringkasanKarakteristik: "Pusat gravitasi freelancer & mahasiswa S2 di Sleman: dekat UGM, coworking dan kafe terbanyak se-DIY. Internet dan komunitas paling kuat, ideal untuk tech professional dan digital nomad.",
      skor: { internet: 98, cost: 77, community: 98, environment: 86 } },
    { id: "sleman-mlati", districtId: "sleman", nama: "Mlati",
      latitude: -7.747, longitude: 110.362, estimasiBiayaHidup: 2800000, coworkingCount: 5, cafeCount: 80, universityCount: 2, tourismScore: 7.8,
      ringkasanKarakteristik: "Kawasan residensial yang tenang dengan akses mudah ke pusat kota. Internet kencang dan biaya hidup lebih ramah kantong dibanding Depok.",
      skor: { internet: 91, cost: 82, community: 88, environment: 85 } },
    { id: "sleman-ngaglik", districtId: "sleman", nama: "Ngaglik",
      latitude: -7.709, longitude: 110.390, estimasiBiayaHidup: 2700000, coworkingCount: 4, cafeCount: 75, universityCount: 1, tourismScore: 8.2,
      ringkasanKarakteristik: "Suburb yang terus tumbuh ke arah Kaliurang, lingkungan paling sejuk di Sleman. Cocok untuk yang memprioritaskan environment tanpa mengorbankan banyak internet.",
      skor: { internet: 88, cost: 85, community: 84, environment: 91 } },
    { id: "sleman-gamping", districtId: "sleman", nama: "Gamping",
      latitude: -7.798, longitude: 110.333, estimasiBiayaHidup: 2600000, coworkingCount: 4, cafeCount: 70, universityCount: 2, tourismScore: 7.9,
      ringkasanKarakteristik: "Dekat kawasan rumah sakit dan gerbang barat Sleman, seimbang antara biaya, komunitas, dan lingkungan kerja.",
      skor: { internet: 89, cost: 84, community: 85, environment: 84 } },
    { id: "sleman-kalasan", districtId: "sleman", nama: "Kalasan",
      latitude: -7.761, longitude: 110.472, estimasiBiayaHidup: 2500000, coworkingCount: 2, cafeCount: 40, universityCount: 1, tourismScore: 9.1,
      ringkasanKarakteristik: "Pintu masuk ke kawasan Prambanan, lebih tenang dan terjangkau. Community sedikit lebih rendah, tapi lingkungan dan biaya hidup jadi nilai jualnya.",
      skor: { internet: 85, cost: 88, community: 80, environment: 89 } },

    // Bantul
    { id: "bantul-sewon", districtId: "bantul", nama: "Sewon",
      latitude: -7.840, longitude: 110.352, estimasiBiayaHidup: 2400000, coworkingCount: 3, cafeCount: 65, universityCount: 2, tourismScore: 8.0,
      ringkasanKarakteristik: "Kawasan kampus selatan Bantul (dekat ISI), komunitas kreatif cukup aktif dengan biaya hidup lebih hemat dari Kota Yogyakarta.",
      skor: { internet: 87, cost: 89, community: 86, environment: 85 } },
    { id: "bantul-kasihan", districtId: "bantul", nama: "Kasihan",
      latitude: -7.828, longitude: 110.329, estimasiBiayaHidup: 2500000, coworkingCount: 4, cafeCount: 70, universityCount: 2, tourismScore: 8.2,
      ringkasanKarakteristik: "Jantung kawasan seni ISI Yogyakarta, komunitas kreatif kuat dan lingkungan mendukung kerja santai. Pilihan solid untuk creative professional.",
      skor: { internet: 88, cost: 87, community: 87, environment: 86 } },
    { id: "bantul-banguntapan", districtId: "bantul", nama: "Banguntapan",
      latitude: -7.817, longitude: 110.430, estimasiBiayaHidup: 2600000, coworkingCount: 3, cafeCount: 75, universityCount: 1, tourismScore: 7.9,
      ringkasanKarakteristik: "Pinggiran urban yang berbatasan langsung dengan Kota Yogyakarta, praktis untuk akses kota tanpa biaya hidup kota.",
      skor: { internet: 89, cost: 85, community: 88, environment: 83 } },
    { id: "bantul-jetis", districtId: "bantul", nama: "Jetis",
      latitude: -7.889, longitude: 110.361, estimasiBiayaHidup: 2100000, coworkingCount: 1, cafeCount: 25, universityCount: 0, tourismScore: 7.5,
      ringkasanKarakteristik: "Kawasan Bantul yang lebih hemat biaya, cocok untuk yang budget-nya ketat. Internet dan komunitas standar, tapi environment tetap nyaman.",
      skor: { internet: 81, cost: 92, community: 79, environment: 88 } },
    { id: "bantul-imogiri", districtId: "bantul", nama: "Imogiri",
      latitude: -7.919, longitude: 110.400, estimasiBiayaHidup: 2000000, coworkingCount: 1, cafeCount: 20, universityCount: 0, tourismScore: 9.0,
      ringkasanKarakteristik: "Kawasan wisata alam dan heritage, lingkungan paling tenang di Bantul dengan biaya hidup termurah, tapi internet dan komunitas kerja masih terbatas.",
      skor: { internet: 78, cost: 94, community: 76, environment: 93 } },

    // Kulon Progo
    { id: "kulon-progo-wates", districtId: "kulon-progo", nama: "Wates",
      latitude: -7.863, longitude: 110.160, estimasiBiayaHidup: 2200000, coworkingCount: 2, cafeCount: 35, universityCount: 1, tourismScore: 8.0,
      ringkasanKarakteristik: "Ibu kota Kulon Progo, pusat aktivitas dengan biaya hidup rendah. Infrastruktur digital berkembang seiring pertumbuhan wilayah.",
      skor: { internet: 84, cost: 90, community: 80, environment: 86 } },
    { id: "kulon-progo-temon", districtId: "kulon-progo", nama: "Temon",
      latitude: -7.905, longitude: 110.057, estimasiBiayaHidup: 2300000, coworkingCount: 2, cafeCount: 30, universityCount: 0, tourismScore: 8.7,
      ringkasanKarakteristik: "Berkembang pesat berkat Bandara YIA, strategis untuk mobilitas tinggi dengan internet yang mulai membaik.",
      skor: { internet: 86, cost: 88, community: 81, environment: 88 } },
    { id: "kulon-progo-pengasih", districtId: "kulon-progo", nama: "Pengasih",
      latitude: -7.859, longitude: 110.140, estimasiBiayaHidup: 2100000, coworkingCount: 1, cafeCount: 20, universityCount: 1, tourismScore: 7.8,
      ringkasanKarakteristik: "Kawasan residensial tenang dekat Wates, biaya hidup rendah dengan komunitas kerja yang masih tumbuh.",
      skor: { internet: 82, cost: 91, community: 78, environment: 85 } },
    { id: "kulon-progo-sentolo", districtId: "kulon-progo", nama: "Sentolo",
      latitude: -7.829, longitude: 110.218, estimasiBiayaHidup: 2050000, coworkingCount: 1, cafeCount: 18, universityCount: 0, tourismScore: 7.6,
      ringkasanKarakteristik: "Titik transit menuju Kulon Progo dari arah kota, biaya sangat terjangkau tapi fasilitas kerja masih minim.",
      skor: { internet: 81, cost: 92, community: 77, environment: 84 } },
    { id: "kulon-progo-panjatan", districtId: "kulon-progo", nama: "Panjatan",
      latitude: -7.913, longitude: 110.167, estimasiBiayaHidup: 2000000, coworkingCount: 1, cafeCount: 15, universityCount: 0, tourismScore: 8.4,
      ringkasanKarakteristik: "Dekat akses pantai selatan, lingkungan tenang dan biaya hidup rendah. Pilihan untuk yang mengutamakan suasana santai.",
      skor: { internet: 79, cost: 93, community: 75, environment: 89 } },

    // Gunungkidul
    { id: "gunungkidul-wonosari", districtId: "gunungkidul", nama: "Wonosari",
      latitude: -7.965, longitude: 110.602, estimasiBiayaHidup: 2200000, coworkingCount: 2, cafeCount: 40, universityCount: 1, tourismScore: 8.4,
      ringkasanKarakteristik: "Ibu kota Gunungkidul, pusat aktivitas dengan biaya hidup paling rendah di DIY. Infrastruktur dan komunitas kerja terus berkembang.",
      skor: { internet: 83, cost: 90, community: 80, environment: 87 } },
    { id: "gunungkidul-playen", districtId: "gunungkidul", nama: "Playen",
      latitude: -7.914, longitude: 110.558, estimasiBiayaHidup: 2100000, coworkingCount: 1, cafeCount: 20, universityCount: 0, tourismScore: 8.0,
      ringkasanKarakteristik: "Kawasan berkembang di sekitar Wonosari, biaya hidup sangat rendah namun fasilitas kerja masih terbatas.",
      skor: { internet: 80, cost: 92, community: 78, environment: 86 } },
    { id: "gunungkidul-patuk", districtId: "gunungkidul", nama: "Patuk",
      latitude: -7.827, longitude: 110.490, estimasiBiayaHidup: 2150000, coworkingCount: 1, cafeCount: 25, universityCount: 0, tourismScore: 9.3,
      ringkasanKarakteristik: "Terkenal lewat Bukit Bintang dengan pemandangan Kota Yogyakarta dari ketinggian. Environment terbaik di Gunungkidul, favorit yang cari suasana inspiratif.",
      skor: { internet: 82, cost: 91, community: 79, environment: 94 } },
    { id: "gunungkidul-karangmojo", districtId: "gunungkidul", nama: "Karangmojo",
      latitude: -7.835, longitude: 110.672, estimasiBiayaHidup: 2000000, coworkingCount: 1, cafeCount: 18, universityCount: 0, tourismScore: 8.1,
      ringkasanKarakteristik: "Kawasan residensial tenang, biaya hidup sangat terjangkau dengan komunitas kerja yang masih kecil.",
      skor: { internet: 78, cost: 93, community: 76, environment: 88 } },
    { id: "gunungkidul-semin", districtId: "gunungkidul", nama: "Semin",
      latitude: -7.746, longitude: 110.782, estimasiBiayaHidup: 1900000, coworkingCount: 0, cafeCount: 10, universityCount: 0, tourismScore: 7.7,
      ringkasanKarakteristik: "Wilayah paling rural di Gunungkidul, biaya hidup terendah se-DIY. Internet dan komunitas paling minim, cocok hanya untuk kerja yang tak butuh koneksi berat.",
      skor: { internet: 76, cost: 95, community: 74, environment: 87 } },
  ];

  await prisma.subDistrict.createMany({
    data: subDistricts.map(({ skor, ...s }) => {
      void skor; // dibuang — skor disimpan terpisah ke subDistrictScore di bawah
      return s;
    }),
  });

  await prisma.subDistrictScore.createMany({
    data: subDistricts.flatMap((s) => [
      { subDistrictId: s.id, indicatorId: "internet", skor: s.skor.internet },
      { subDistrictId: s.id, indicatorId: "cost", skor: s.skor.cost },
      { subDistrictId: s.id, indicatorId: "community", skor: s.skor.community },
      { subDistrictId: s.id, indicatorId: "environment", skor: s.skor.environment },
    ]),
  });

  console.log("✅ Seed berhasil — 5 distrik + 20 skor indikator + 25 kecamatan + 100 skor kecamatan tersimpan ke Neon");
}

main()
  .catch((e) => {
    console.error("❌ Seed gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
