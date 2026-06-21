import type { IndicatorId } from "@/types/recommendation";

export function computeDistrictScore(
  indicatorScores: Record<IndicatorId, number>,
  weights: Record<IndicatorId, number>
): number {
  const indicators: IndicatorId[] = ["internet", "cost", "community", "environment"];
  return indicators.reduce(
    (sum, id) => sum + indicatorScores[id] * weights[id],
    0
  );
}

export function computeKontribusi(
  indicatorScores: Record<IndicatorId, number>,
  weights: Record<IndicatorId, number>
): Record<IndicatorId, number> {
  const indicators: IndicatorId[] = ["internet", "cost", "community", "environment"];
  return Object.fromEntries(
    indicators.map((id) => [id, indicatorScores[id] * weights[id]])
  ) as Record<IndicatorId, number>;
}
