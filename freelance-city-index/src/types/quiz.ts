import type { PersonaId } from "./persona";

export type InternetPriority = "low" | "medium" | "high" | "ultra";
export type CommunityPriority = "low" | "medium" | "high";
export type EnvironmentPreference = "quiet" | "cafe" | "coworking" | "flexible";

export interface QuizInput {
  personaId: PersonaId;
  budget: number;
  internetPriority: InternetPriority;
  communityPriority: CommunityPriority;
  environmentPreference: EnvironmentPreference;
}
