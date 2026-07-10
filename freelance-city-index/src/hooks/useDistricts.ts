"use client";

import { useState, useEffect } from "react";
import type { District, DistrictScore, SubDistrict, SubDistrictScore } from "@/types/district";

interface ApiSubDistrict extends Omit<SubDistrict, never> {
  scores: Array<{ id: string; subDistrictId: string; indicatorId: string; skor: number; updatedAt: string }>;
}

interface ApiDistrict extends Omit<District, never> {
  scores: Array<{ id: string; districtId: string; indicatorId: string; skor: number; updatedAt: string }>;
  subDistricts: ApiSubDistrict[];
}

interface UseDistrictsResult {
  districts: District[];
  scores: DistrictScore[];
  subDistricts: SubDistrict[];
  subDistrictScores: SubDistrictScore[];
  loading: boolean;
  error: string | null;
}

// Cache in-memory per sesi (module-level, BUKAN localStorage — tetap efemeral
// sesuai aturan §15.3). Data distrik hampir statis (cuma berubah kalau admin
// edit), jadi cukup satu roundtrip ke Neon per sesi; navigasi antar halaman
// (result → district → balik) tidak perlu menunggu fetch ulang. Promise
// di-share supaya beberapa halaman yang mount bersamaan ikut satu request.
let districtsCache: Promise<ApiDistrict[]> | null = null;

function fetchDistricts(): Promise<ApiDistrict[]> {
  if (!districtsCache) {
    districtsCache = fetch("/api/districts").then((res) => {
      if (!res.ok) throw new Error("Gagal memuat data distrik");
      return res.json() as Promise<ApiDistrict[]>;
    });
    // Kalau gagal, kosongkan cache supaya percobaan berikutnya (tombol
    // "Coba Lagi" / reload) benar-benar fetch ulang, bukan replay error.
    districtsCache.catch(() => {
      districtsCache = null;
    });
  }
  return districtsCache;
}

// Dipanggil AdminContext setelah admin berhasil mengubah skor, supaya halaman
// publik berikutnya membaca data segar, bukan cache lama.
export function invalidateDistrictsCache() {
  districtsCache = null;
}

export function useDistricts(): UseDistrictsResult {
  const [districts, setDistricts] = useState<District[]>([]);
  const [scores, setScores] = useState<DistrictScore[]>([]);
  const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]);
  const [subDistrictScores, setSubDistrictScores] = useState<SubDistrictScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDistricts()
      .then((data) => {
        setDistricts(
          data.map(({ scores, subDistricts, ...d }) => {
            void scores; // dibuang — scores dipisah ke state sendiri di bawah
            void subDistricts;
            return d as District;
          })
        );
        setScores(
          data.flatMap((d) =>
            d.scores.map((s) => ({
              districtId: s.districtId,
              indicatorId: s.indicatorId as DistrictScore["indicatorId"],
              skor: s.skor,
              updatedAt: s.updatedAt,
            }))
          )
        );
        setSubDistricts(
          data.flatMap((d) =>
            d.subDistricts.map(({ scores: subScores, ...sd }) => {
              void subScores;
              return sd as SubDistrict;
            })
          )
        );
        setSubDistrictScores(
          data.flatMap((d) =>
            d.subDistricts.flatMap((sd) =>
              sd.scores.map((s) => ({
                subDistrictId: s.subDistrictId,
                indicatorId: s.indicatorId as SubDistrictScore["indicatorId"],
                skor: s.skor,
                updatedAt: s.updatedAt,
              }))
            )
          )
        );
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return { districts, scores, subDistricts, subDistrictScores, loading, error };
}
