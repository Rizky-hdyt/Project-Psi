export interface District {
  id: string;
  nama: string;
  tipe: "Kota" | "Kabupaten";
  umk: number;
  coworkingCount: number;
  internetMbps: number;
  ringkasanKarakteristik: string;
  kostMin: number;
  kostMax: number;
  estimasiBiayaHidup: number;
}

export interface DistrictScore {
  districtId: string;
  indicatorId: "internet" | "cost" | "community" | "environment";
  skor: number;
  updatedAt: string;
}

// Kecamatan — ranking level kedua di dalam satu distrik (lihat rankSubDistricts).
// Tidak ada field umk: di Indonesia UMK ditetapkan per Kabupaten/Kota, semua
// kecamatan dalam satu distrik berbagi umk induknya (District.umk).
export interface SubDistrict {
  id: string;
  districtId: string;
  nama: string;
  latitude: number | null;
  longitude: number | null;
  estimasiBiayaHidup: number;
  coworkingCount: number;
  cafeCount: number;
  universityCount: number;
  tourismScore: number; // skala asli 0-10, cuma display — bukan bagian formula scoring
  ringkasanKarakteristik: string;
}

export interface SubDistrictScore {
  subDistrictId: string;
  indicatorId: "internet" | "cost" | "community" | "environment";
  skor: number;
  updatedAt: string;
}
