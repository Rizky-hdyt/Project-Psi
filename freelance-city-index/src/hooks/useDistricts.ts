"use client";

import { useState, useEffect } from "react";
import type { District, DistrictScore } from "@/types/district";

interface ApiDistrict extends Omit<District, never> {
  scores: Array<{ id: string; districtId: string; indicatorId: string; skor: number; updatedAt: string }>;
}

interface UseDistrictsResult {
  districts: District[];
  scores: DistrictScore[];
  loading: boolean;
  error: string | null;
}

export function useDistricts(): UseDistrictsResult {
  const [districts, setDistricts] = useState<District[]>([]);
  const [scores, setScores] = useState<DistrictScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/districts")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data distrik");
        return res.json() as Promise<ApiDistrict[]>;
      })
      .then((data) => {
        setDistricts(
          data.map(({ scores, ...d }) => {
            void scores; // dibuang — scores dipisah ke state sendiri di bawah
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
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return { districts, scores, loading, error };
}
