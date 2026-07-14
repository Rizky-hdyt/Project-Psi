import type { IndicatorId, RankedDistrict } from "@/types/recommendation";
import type { District, DistrictScore } from "@/types/district";
import type { QuizInput } from "@/types/quiz";
import { computeAdjustedWeights } from "./normalize";
import { computeDistrictScore, computeKontribusi } from "./score";

function isScoreValid(skor: number): boolean {
  return skor > 0 && skor <= 100;
}

export function rankDistricts(
  input: QuizInput,
  districts: District[],
  allScores: DistrictScore[]
): RankedDistrict[] {
  const weights = computeAdjustedWeights(input);
  const indicators: IndicatorId[] = ["internet", "cost", "community", "environment"];

  const results: RankedDistrict[] = [];

  for (const district of districts) {
    const districtScores = allScores.filter((s) => s.districtId === district.id);

    const indicatorMap: Partial<Record<IndicatorId, number>> = {};
    let isValid = true;

    for (const id of indicators) {
      const scoreEntry = districtScores.find((s) => s.indicatorId === id);
      if (!scoreEntry || !isScoreValid(scoreEntry.skor)) {
        isValid = false;
        break;
      }
      indicatorMap[id] = scoreEntry.skor;
    }

    if (!isValid) continue;

    const scores = indicatorMap as Record<IndicatorId, number>;
    const skorTotal = computeDistrictScore(scores, weights);
    const kontribusi = computeKontribusi(scores, weights);
    const isBelowUMK = input.budget < district.umk;

    results.push({
      districtId: district.id,
      rank: 0,
      skorTotal: Math.round(skorTotal * 10) / 10,
      skorPerIndikator: scores,
      kontribusi,
      isBelowUMK,
    });
  }

  results.sort((a, b) => {
    if (b.skorTotal !== a.skorTotal) return b.skorTotal - a.skorTotal;
    const distA = districts.find((d) => d.id === a.districtId)!;
    const distB = districts.find((d) => d.id === b.districtId)!;
    return distA.umk - distB.umk;
  });

  results.forEach((r, i) => {
    r.rank = i + 1;
  });

  return results;
}
