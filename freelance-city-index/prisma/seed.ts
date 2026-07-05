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
          "Kawasan paling seimbang di DIY — internet kencang, banyak coworking di area Depok & Mlati, dan biaya hidup lebih terjangkau dari kota. Favorit tech worker dan mahasiswa S2.",
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
          "Biaya hidup terendah di DIY dengan lingkungan paling tenang. Internet masih berkembang — cocok untuk kerja yang tidak butuh bandwidth tinggi. Pilihan bagi yang prioritaskan pengeluaran rendah dan ketenangan.",
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

  console.log("✅ Seed berhasil — 5 distrik + 20 skor indikator tersimpan ke Neon");
}

main()
  .catch((e) => {
    console.error("❌ Seed gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
