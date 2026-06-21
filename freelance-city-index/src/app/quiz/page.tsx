"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/shared/Navbar";
import { useQuizState } from "@/hooks/useQuizState";
import { computeAdjustedWeights } from "@/lib/scoring/normalize";
import { PersonaCardSelector } from "@/components/quiz/PersonaCardSelector";
import { BudgetSlider } from "@/components/quiz/BudgetSlider";
import { InternetPrioritySelect } from "@/components/quiz/InternetPrioritySelect";
import { CommunityPrioritySelect } from "@/components/quiz/CommunityPrioritySelect";
import { EnvironmentPreferenceSelect } from "@/components/quiz/EnvironmentPreferenceSelect";
import { WeightBarChart } from "@/components/quiz/WeightBarChart";
import { FormulaExample } from "@/components/quiz/FormulaExample";

export default function QuizPage() {
  const router = useRouter();
  const quiz = useQuizState();

  const adjustedWeights =
    quiz.completeInput
      ? computeAdjustedWeights(quiz.completeInput)
      : null;

  function handleFindBestRegion() {
    quiz.goToStep2();
  }

  function handleSeeResults() {
    if (!quiz.completeInput) return;
    const p = new URLSearchParams({
      persona:     quiz.completeInput.personaId,
      budget:      String(quiz.completeInput.budget),
      internet:    quiz.completeInput.internetPriority,
      community:   quiz.completeInput.communityPriority,
      environment: quiz.completeInput.environmentPreference,
    });
    router.push(`/result?${p.toString()}`);
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar showStartQuiz={false} />

      {/* Step progress bar */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[680px] items-center gap-2 px-4 py-2.5 sm:px-6">
          <span className={`font-mono text-xs ${quiz.step === 1 ? "font-bold text-sawah" : "text-muted-foreground"}`}>
            01 Input
          </span>
          <div className="flex-1 h-0.5 rounded-full bg-line overflow-hidden">
            <div
              className="h-full bg-sawah transition-all duration-300"
              style={{ width: quiz.step === 2 ? "100%" : "50%" }}
            />
          </div>
          <span className={`font-mono text-xs ${quiz.step === 2 ? "font-bold text-sawah" : "text-muted-foreground"}`}>
            02 Algoritma
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[680px] px-4 py-8 sm:px-6 sm:py-12">
        {/* ── STEP 1: Input ──────────────────────────────────── */}
        {quiz.step === 1 && (
          <div className="space-y-8">
            <div>
              <p className="mb-1 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Langkah 1 dari 2
              </p>
              <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                Ceritakan profil Anda
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Jawaban Anda menentukan bobot tiap indikator — hasilnya personal, bukan generik.
              </p>
            </div>

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

            <div className="pt-2">
              <Button
                size="lg"
                onClick={handleFindBestRegion}
                className="w-full min-h-[44px] gap-2 bg-sawah text-white hover:bg-sawah/90 sm:w-auto"
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
            <div>
              <p className="mb-1 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Langkah 2 dari 2
              </p>
              <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                Ini cara kami menghitung
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Bobot berikut diturunkan dari profil dan preferensi Anda — bukan angka tetap.
              </p>
            </div>

            {/* Weight bars — signature element */}
            <div className="rounded-xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(28,37,33,0.06)]">
              <p className="mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Bobot indikator (disesuaikan input Anda)
              </p>
              <WeightBarChart weights={adjustedWeights} />
            </div>

            {/* Formula example */}
            <div>
              <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Formula yang digunakan
              </p>
              <div className="mb-3 rounded-lg border border-line bg-white p-3 font-mono text-xs text-ink">
                <span className="text-muted-foreground">Skor_distrik</span>
                {" = "}
                <span className="text-sawah">Σ</span>
                {" (skor_indikator × bobot)"}
              </div>
              <FormulaExample weights={adjustedWeights} />
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
              <Button
                size="lg"
                onClick={handleSeeResults}
                className="min-h-[44px] gap-2 bg-sawah text-white hover:bg-sawah/90 sm:flex-1"
              >
                Lihat Hasil
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={quiz.goToStep1}
                className="min-h-[44px] gap-2 border-line sm:flex-none"
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
