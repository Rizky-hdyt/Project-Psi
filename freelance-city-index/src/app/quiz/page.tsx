"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/shared/Navbar";
import { useQuizState } from "@/hooks/useQuizState";
import { useDistricts } from "@/hooks/useDistricts";
import { computeAdjustedWeights } from "@/lib/scoring/normalize";
import { PersonaCardSelector } from "@/components/quiz/PersonaCardSelector";
import { BudgetSlider } from "@/components/quiz/BudgetSlider";
import { InternetPrioritySelect } from "@/components/quiz/InternetPrioritySelect";
import { CommunityPrioritySelect } from "@/components/quiz/CommunityPrioritySelect";
import { EnvironmentPreferenceSelect } from "@/components/quiz/EnvironmentPreferenceSelect";
import { WeightBarChart } from "@/components/quiz/WeightBarChart";
import { FormulaExample } from "@/components/quiz/FormulaExample";
import type { IndicatorId } from "@/types/recommendation";

const PERSONA_NAMES: Record<string, string> = {
  "tech-professional": "Tech Professional",
  "creative-professional": "Creative Professional",
  "student-fresh-graduate": "Student & Fresh Graduate",
  "digital-nomad": "Digital Nomad",
};

export default function QuizPage() {
  const router = useRouter();
  const quiz = useQuizState();
  const { scores: allScores } = useDistricts();
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcStep, setCalcStep] = useState(0);

  const adjustedWeights =
    quiz.completeInput
      ? computeAdjustedWeights(quiz.completeInput)
      : null;

  // Skor Sleman dari DB untuk dipakai sebagai contoh di FormulaExample
  const slemanScores = useMemo(() => {
    const sleman = allScores.filter((s) => s.districtId === "sleman");
    if (sleman.length === 0) return undefined;
    return Object.fromEntries(
      sleman.map((s) => [s.indicatorId, s.skor])
    ) as Partial<Record<IndicatorId, number>>;
  }, [allScores]);

  function handleFindBestRegion() {
    quiz.goToStep2();
  }

  function handleSeeResults() {
    if (!quiz.completeInput) return;

    setIsCalculating(true);
    setCalcStep(1);

    const stepDelays = [600, 1200, 1800];
    stepDelays.forEach((delay, i) => {
      setTimeout(() => setCalcStep(i + 2), delay);
    });

    setTimeout(() => {
      const p = new URLSearchParams({
        persona:     quiz.completeInput!.personaId,
        budget:      String(quiz.completeInput!.budget),
        internet:    quiz.completeInput!.internetPriority,
        community:   quiz.completeInput!.communityPriority,
        environment: quiz.completeInput!.environmentPreference,
      });
      router.push(`/result?${p.toString()}`);
    }, 2500);
  }

  const personaName = quiz.input.personaId
    ? (PERSONA_NAMES[quiz.input.personaId] ?? "Anda")
    : "Anda";

  const calcSteps = [
    "Menganalisis preferensi Anda...",
    `Menerapkan bobot ${personaName}...`,
    "Menghitung skor 5 distrik DIY...",
    "Merangking berdasarkan skor akhir...",
  ];

  if (isCalculating) {
    return (
      <div className="flex min-h-screen flex-col bg-paper">
        <Navbar showStartQuiz={false} />
        <div className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="w-full max-w-[360px]">
            {/* Spinner icon */}
            <div className="mb-8 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sawah shadow-[0_8px_24px_rgba(47,111,78,0.35)]">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            </div>

            <h2 className="mb-7 text-center font-display text-xl font-bold text-ink">
              Menghitung hasil Anda...
            </h2>

            {/* Steps */}
            <div className="mb-7 space-y-4">
              {calcSteps.map((step, i) => {
                const stepNum = i + 1;
                const isDone = calcStep > stepNum;
                const isCurrent = calcStep === stepNum;
                const isVisible = calcStep >= stepNum;

                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 transition-all duration-500"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? "translateY(0)" : "translateY(6px)",
                    }}
                  >
                    <div
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: isDone
                          ? "#2F6F4E"
                          : isCurrent
                          ? "transparent"
                          : "#D8D3C4",
                        border: isCurrent ? "2px solid #2F6F4E" : "none",
                      }}
                    >
                      {isDone && <Check className="h-3.5 w-3.5 text-white" />}
                      {isCurrent && (
                        <Loader2 className="h-3 w-3 animate-spin text-sawah" />
                      )}
                    </div>
                    <span
                      className="text-sm transition-all duration-300"
                      style={{
                        color: isDone
                          ? "#6B7570"
                          : isCurrent
                          ? "#1C2521"
                          : "#D8D3C4",
                        fontWeight: isCurrent ? 600 : 400,
                      }}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-sawah transition-all duration-500 ease-out"
                style={{ width: `${((calcStep - 1) / 4) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-right font-mono text-xs text-muted-foreground">
              {Math.round(((calcStep - 1) / 4) * 100)}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar showStartQuiz={false} />

      {/* Step progress bar */}
      <div className="border-b border-line bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[680px] items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-1.5">
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px] font-bold transition-all"
              style={{
                backgroundColor: quiz.step >= 1 ? "#2F6F4E" : "#D8D3C4",
                color: "#fff",
              }}
            >
              {quiz.step > 1 ? "✓" : "1"}
            </div>
            <span className={`font-mono text-xs ${quiz.step === 1 ? "font-bold text-sawah" : "text-muted-foreground"}`}>
              Input
            </span>
          </div>
          <div className="flex-1 h-0.5 rounded-full bg-line overflow-hidden">
            <div
              className="h-full bg-sawah transition-all duration-500 ease-out"
              style={{ width: quiz.step === 2 ? "100%" : "0%" }}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px] font-bold transition-all"
              style={{
                backgroundColor: quiz.step === 2 ? "#2F6F4E" : "#D8D3C4",
                color: "#fff",
              }}
            >
              2
            </div>
            <span className={`font-mono text-xs ${quiz.step === 2 ? "font-bold text-sawah" : "text-muted-foreground"}`}>
              Algoritma
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[680px] px-4 py-8 sm:px-6 sm:py-12">
        {/* ── STEP 1: Input ──────────────────────────────────── */}
        {quiz.step === 1 && (
          <div className="space-y-8">
            {/* Header */}
            <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_2px_12px_rgba(28,37,33,0.07)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sawah shadow-[0_4px_12px_rgba(47,111,78,0.30)]">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="mb-1 font-mono text-xs font-medium uppercase tracking-widest text-sawah">
                    Langkah 1 dari 2
                  </p>
                  <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                    Ceritakan profil Anda
                  </h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Jawaban Anda menentukan bobot tiap indikator — hasilnya personal, bukan generik.
                  </p>
                </div>
              </div>
            </div>

            {/* Form sections */}
            <div className="space-y-8">
              <PersonaCardSelector
                selected={quiz.input.personaId}
                onSelect={quiz.setPersona}
                showError={quiz.showPersonaError}
              />

              <Separator className="bg-line" />

              <BudgetSlider
                value={quiz.input.budget ?? 4_000_000}
                onChange={quiz.setBudget}
              />

              <Separator className="bg-line" />

              <InternetPrioritySelect
                value={quiz.input.internetPriority ?? "medium"}
                onChange={quiz.setInternetPriority}
              />

              <CommunityPrioritySelect
                value={quiz.input.communityPriority ?? "medium"}
                onChange={quiz.setCommunityPriority}
              />

              <EnvironmentPreferenceSelect
                value={quiz.input.environmentPreference ?? "flexible"}
                onChange={quiz.setEnvironmentPreference}
              />
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Button
                size="lg"
                onClick={handleFindBestRegion}
                className="w-full min-h-[52px] gap-2 bg-sawah text-white shadow-[0_4px_14px_rgba(47,111,78,0.35)] hover:bg-sawah/90 hover:shadow-[0_6px_20px_rgba(47,111,78,0.45)] transition-all sm:w-auto text-base"
              >
                Cari Distrik Terbaik
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Algorithm Explanation ──────────────────── */}
        {quiz.step === 2 && adjustedWeights && (
          <div className="space-y-8">
            {/* Header */}
            <div className="rounded-2xl border border-sawah/20 bg-gradient-to-br from-sawah/5 to-pesisir/5 p-6 shadow-[0_2px_12px_rgba(28,37,33,0.07)]">
              <p className="mb-1 font-mono text-xs font-medium uppercase tracking-widest text-sawah">
                Langkah 2 dari 2 · Transparan
              </p>
              <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                Ini cara kami menghitung
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Bobot berikut diturunkan dari profil dan preferensi Anda — bukan angka tetap.
              </p>
            </div>

            {/* Weight bars — signature element */}
            <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_2px_12px_rgba(28,37,33,0.07)]">
              <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Bobot indikator (disesuaikan input Anda)
              </p>
              <WeightBarChart weights={adjustedWeights} />
            </div>

            {/* Formula */}
            <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_2px_12px_rgba(28,37,33,0.07)]">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Formula yang digunakan
              </p>
              <div className="mb-4 rounded-lg border border-sawah/20 bg-sawah/5 p-3 font-mono text-xs text-ink">
                <span className="text-muted-foreground">Skor_distrik</span>
                {" = "}
                <span className="font-bold text-sawah">Σ</span>
                {" (skor_indikator × bobot)"}
              </div>
              <FormulaExample
                weights={adjustedWeights}
                exampleScores={slemanScores}
                exampleDistrictName="Sleman"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
              <Button
                size="lg"
                onClick={handleSeeResults}
                className="min-h-[52px] gap-2 bg-sawah text-white shadow-[0_4px_14px_rgba(47,111,78,0.35)] hover:bg-sawah/90 hover:shadow-[0_6px_20px_rgba(47,111,78,0.45)] transition-all sm:flex-1 text-base"
              >
                Lihat Hasil
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={quiz.goToStep1}
                className="min-h-[52px] gap-2 border-line bg-white hover:bg-paper sm:flex-none"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
