import type { PersonaId } from "@/types/persona";
import type { IndicatorId } from "@/types/recommendation";

export type PersonaWeight = Record<IndicatorId, number>;

export const BASE_WEIGHTS: Record<PersonaId, PersonaWeight> = {
  "tech-professional": {
    internet: 0.40,
    cost:     0.25,
    community: 0.20,
    environment: 0.15,
  },
  "creative-professional": {
    internet: 0.20,
    cost:     0.25,
    community: 0.25,
    environment: 0.30,
  },
  "student-fresh-graduate": {
    internet: 0.20,
    cost:     0.45,
    community: 0.20,
    environment: 0.15,
  },
  "digital-nomad": {
    internet: 0.30,
    cost:     0.25,
    community: 0.25,
    environment: 0.20,
  },
};
