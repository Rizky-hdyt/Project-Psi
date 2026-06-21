import type { QuizInput } from "@/types/quiz";
import type { IndicatorId } from "@/types/recommendation";
import type { PersonaWeight } from "./weights";
import { BASE_WEIGHTS } from "./weights";

const INTERNET_MULTIPLIER: Record<QuizInput["internetPriority"], number> = {
  low:    0.7,
  medium: 1.0,
  high:   1.3,
  ultra:  1.6,
};

const COMMUNITY_MULTIPLIER: Record<QuizInput["communityPriority"], number> = {
  low:    0.7,
  medium: 1.0,
  high:   1.3,
};

// Delta dalam satuan yang sama dengan base weights (desimal, bukan persen)
// +5 percentage points = +0.05. Dok 1 §6 reference case: Cafe → Environment 15%+5% = 20%
const ENVIRONMENT_DELTA: Record<QuizInput["environmentPreference"], number> = {
  quiet:      0.05,
  cafe:       0.05,
  coworking:  0.05,
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
