import type { PersonaId } from "./persona";
import type { QuizInput } from "./quiz";

export type IndicatorId = "internet" | "cost" | "community" | "environment";

export interface RankedDistrict {
  districtId: string;
  rank: number;
  skorTotal: number;
  skorPerIndikator: Record<IndicatorId, number>;
  kontribusi: Record<IndicatorId, number>;
  isBelowUMK: boolean;
}

export interface RecommendationResult {
  sessionId: string;
  personaId: PersonaId;
  input: QuizInput;
  adjustedWeights: Record<IndicatorId, number>;
  ranked: RankedDistrict[];
  whyText: Record<string, string>;
  createdAt: string;
}
