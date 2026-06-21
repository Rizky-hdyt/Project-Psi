"use client";

import { useState, useCallback } from "react";
import type { QuizInput } from "@/types/quiz";
import type { PersonaId } from "@/types/persona";

type PartialQuizInput = Partial<QuizInput>;

const DEFAULTS: PartialQuizInput = {
  budget: 4_000_000,
  internetPriority: "medium",
  communityPriority: "medium",
  environmentPreference: "flexible",
};

export type QuizStep = 1 | 2;

export interface QuizState {
  step: QuizStep;
  input: PartialQuizInput;
  showPersonaError: boolean;
}

export function useQuizState(initial?: PartialQuizInput) {
  const [step, setStep] = useState<QuizStep>(1);
  const [input, setInput] = useState<PartialQuizInput>({ ...DEFAULTS, ...initial });
  const [showPersonaError, setShowPersonaError] = useState(false);

  const setPersona = useCallback((personaId: PersonaId) => {
    setInput((prev) => ({ ...prev, personaId }));
    setShowPersonaError(false);
  }, []);

  const setBudget = useCallback((budget: number) => {
    setInput((prev) => ({ ...prev, budget }));
  }, []);

  const setInternetPriority = useCallback(
    (internetPriority: QuizInput["internetPriority"]) => {
      setInput((prev) => ({ ...prev, internetPriority }));
    },
    []
  );

  const setCommunityPriority = useCallback(
    (communityPriority: QuizInput["communityPriority"]) => {
      setInput((prev) => ({ ...prev, communityPriority }));
    },
    []
  );

  const setEnvironmentPreference = useCallback(
    (environmentPreference: QuizInput["environmentPreference"]) => {
      setInput((prev) => ({ ...prev, environmentPreference }));
    },
    []
  );

  const goToStep2 = useCallback(() => {
    if (!input.personaId) {
      setShowPersonaError(true);
      return false;
    }
    setStep(2);
    return true;
  }, [input.personaId]);

  const goToStep1 = useCallback(() => {
    setStep(1);
  }, []);

  const reset = useCallback(() => {
    setInput({ ...DEFAULTS });
    setStep(1);
    setShowPersonaError(false);
  }, []);

  const isComplete = (i: PartialQuizInput): i is QuizInput =>
    !!i.personaId &&
    i.budget !== undefined &&
    !!i.internetPriority &&
    !!i.communityPriority &&
    !!i.environmentPreference;

  return {
    step,
    input,
    showPersonaError,
    isComplete: isComplete(input),
    completeInput: isComplete(input) ? (input as QuizInput) : null,
    setPersona,
    setBudget,
    setInternetPriority,
    setCommunityPriority,
    setEnvironmentPreference,
    goToStep2,
    goToStep1,
    reset,
  };
}
