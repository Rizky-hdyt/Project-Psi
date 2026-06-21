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
