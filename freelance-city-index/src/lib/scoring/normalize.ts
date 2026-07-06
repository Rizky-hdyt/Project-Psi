import type { QuizInput } from "@/types/quiz";
import type { IndicatorId } from "@/types/recommendation";
import type { PersonaWeight } from "./weights";
import { BASE_WEIGHTS } from "./weights";

// Rentang multiplier sengaja lebar (rebalance 2026-07-06): dengan rentang lama
// (0.7–1.6) bobot persona terlalu dominan sehingga 188/192 kombinasi input
// menghasilkan Best Match yang sama — jawaban user nyaris tidak berpengaruh.
const INTERNET_MULTIPLIER: Record<QuizInput["internetPriority"], number> = {
  low:    0.3,
  medium: 1.0,
  high:   1.7,
  ultra:  2.5,
};

const COMMUNITY_MULTIPLIER: Record<QuizInput["communityPriority"], number> = {
  low:    0.3,
  medium: 1.0,
  high:   1.8,
};

// Delta dalam satuan yang sama dengan base weights (desimal, bukan persen).
// Tiap preferensi punya delta berbeda sesuai seberapa sensitif user terhadap
// suasana lingkungan: Quiet paling sensitif, Coworking paling tidak (mereka
// membawa lingkungannya sendiri). Delta hanya ke Environment, tidak ke
// Community, untuk menghindari double counting dengan Community Priority.
const ENVIRONMENT_DELTA: Record<QuizInput["environmentPreference"], number> = {
  quiet:      0.15,
  cafe:       0.08,
  coworking:  0.04,
  flexible:   0.00,
};

export function computeAdjustedWeights(input: QuizInput): Record<IndicatorId, number> {
  const base = BASE_WEIGHTS[input.personaId];

  const raw: Record<IndicatorId, number> = {
    internet:    base.internet    * INTERNET_MULTIPLIER[input.internetPriority],
    cost:        base.cost,
    community:   base.community   * COMMUNITY_MULTIPLIER[input.communityPriority],
    environment: base.environment + ENVIRONMENT_DELTA[input.environmentPreference],
  };

  const total = raw.internet + raw.cost + raw.community + raw.environment;

  return {
    internet:    raw.internet    / total,
    cost:        raw.cost        / total,
    community:   raw.community   / total,
    environment: raw.environment / total,
  };
}

export type { PersonaWeight };
