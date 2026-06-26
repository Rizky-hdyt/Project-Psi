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
  await prisma.districtScore.createMany({
    data: [
      { districtId: "kota-yogyakarta", indicatorId: "internet",     skor: 90 },
      { districtId: "kota-yogyakarta", indicatorId: "cost",         skor: 55 },
      { districtId: "kota-yogyakarta", indicatorId: "community",    skor: 90 },
      { districtId: "kota-yogyakarta", indicatorId: "environment",  skor: 60 },

      { districtId: "sleman",          indicatorId: "internet",     skor: 85 },
      { districtId: "sleman",          indicatorId: "cost",         skor: 70 },
      { districtId: "sleman",          indicatorId: "community",    skor: 80 },
      { districtId: "sleman",          indicatorId: "environment",  skor: 75 },

      { districtId: "bantul",          indicatorId: "internet",     skor: 70 },
      { districtId: "bantul",          indicatorId: "cost",         skor: 80 },
      { districtId: "bantul",          indicatorId: "community",    skor: 60 },
      { districtId: "bantul",          indicatorId: "environment",  skor: 80 },

      { districtId: "gunungkidul",     indicatorId: "internet",     skor: 40 },
      { districtId: "gunungkidul",     indicatorId: "cost",         skor: 95 },
      { districtId: "gunungkidul",     indicatorId: "community",    skor: 30 },
      { districtId: "gunungkidul",     indicatorId: "environment",  skor: 85 },

      { districtId: "kulon-progo",     indicatorId: "internet",     skor: 50 },
      { districtId: "kulon-progo",     indicatorId: "cost",         skor: 88 },
      { districtId: "kulon-progo",     indicatorId: "community",    skor: 40 },
      { districtId: "kulon-progo",     indicatorId: "environment",  skor: 78 },
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
