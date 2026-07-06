import type { IndicatorId, RankedSubDistrict } from "@/types/recommendation";
import type { SubDistrict, SubDistrictScore } from "@/types/district";
import type { QuizInput } from "@/types/quiz";
import { computeAdjustedWeights } from "./normalize";
import { computeDistrictScore, computeKontribusi } from "./score";

const STALE_THRESHOLD_DAYS = 7;

function isScoreValid(skor: number): boolean {
  return skor > 0 && skor <= 100;
}

function isScoreStale(updatedAt: string): boolean {
  const updated = new Date(updatedAt).getTime();
  const now = Date.now();
  const diffDays = (now - updated) / (1000 * 60 * 60 * 24);
  return diffDays > STALE_THRESHOLD_DAYS;
}

// Ranking level kedua: kecamatan di dalam SATU distrik. Formula sama persis
// dengan rankDistricts (computeAdjustedWeights + computeDistrictScore), supaya
// "ranking 2 kali" konsisten. Tiebreaker beda: kecamatan berbagi UMK yang sama
// dengan distrik induknya (UMK di Indonesia ditetapkan per Kabupaten/Kota, bukan
// per kecamatan), jadi skor seri dipecah pakai skor internet tertinggi.
export function rankSubDistricts(
  input: QuizInput,
  subDistricts: SubDistrict[],
  allScores: SubDistrictScore[]
): RankedSubDistrict[] {
  const weights = computeAdjustedWeights(input);
  const indicators: IndicatorId[] = ["internet", "cost", "community", "environment"];

  const results: RankedSubDistrict[] = [];

  for (const subDistrict of subDistricts) {
    const subDistrictScores = allScores.filter((s) => s.subDistrictId === subDistrict.id);

    const indicatorMap: Partial<Record<IndicatorId, number>> = {};
    let isValid = true;

    for (const id of indicators) {
      const scoreEntry = subDistrictScores.find((s) => s.indicatorId === id);
      if (!scoreEntry || !isScoreValid(scoreEntry.skor) || isScoreStale(scoreEntry.updatedAt)) {
        isValid = false;
        break;
      }
      indicatorMap[id] = scoreEntry.skor;
    }

    if (!isValid) continue;

    const scores = indicatorMap as Record<IndicatorId, number>;
    const skorTotal = computeDistrictScore(scores, weights);
    const kontribusi = computeKontribusi(scores, weights);

    results.push({
      subDistrictId: subDistrict.id,
      districtId: subDistrict.districtId,
      rank: 0,
      skorTotal: Math.round(skorTotal * 10) / 10,
      skorPerIndikator: scores,
      kontribusi,
    });
  }

  results.sort((a, b) => {
    if (b.skorTotal !== a.skorTotal) return b.skorTotal - a.skorTotal;
    return b.skorPerIndikator.internet - a.skorPerIndikator.internet;
  });

  results.forEach((r, i) => {
    r.rank = i + 1;
  });

  return results;
}
