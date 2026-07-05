"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, ArrowRight, Loader2, Check, Users, Wallet, Wifi, Handshake, Leaf,
  Laptop, Palette, GraduationCap, Globe,
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { AmbientBackground } from "@/components/shared/AmbientBackground";
import { useQuizState } from "@/hooks/useQuizState";
import { computeAdjustedWeights } from "@/lib/scoring/normalize";
import { PersonaCardSelector } from "@/components/quiz/PersonaCardSelector";
import { BudgetSlider } from "@/components/quiz/BudgetSlider";
import { InternetPrioritySelect } from "@/components/quiz/InternetPrioritySelect";
import { CommunityPrioritySelect } from "@/components/quiz/CommunityPrioritySelect";
import { EnvironmentPreferenceSelect } from "@/components/quiz/EnvironmentPreferenceSelect";
import { WeightBarChart } from "@/components/quiz/WeightBarChart";
import { FormulaExample } from "@/components/quiz/FormulaExample";
import { cn } from "@/lib/utils";
import type { QuizInput } from "@/types/quiz";
import type { PersonaId } from "@/types/persona";

const VALID_PERSONAS: PersonaId[] = [
  "tech-professional", "creative-professional", "student-fresh-graduate", "digital-nomad",
];
const VALID_INTERNET: QuizInput["internetPriority"][] = ["low", "medium", "high", "ultra"];
const VALID_COMMUNITY: QuizInput["communityPriority"][] = ["low", "medium", "high"];
const VALID_ENVIRONMENT: QuizInput["environmentPreference"][] = ["quiet", "cafe", "coworking", "flexible"];

// Baca state quiz dari query URL (kalau ada) — dipasangkan dengan efek
// router.replace di bawah supaya URL /quiz SELALU mencerminkan input
// terakhir. Tanpa ini, pencet Back dari /result balik ke /quiz kosong
// (Step 1, persona belum dipilih) — melanggar PRD §6.1 edge case "Back
// browser setelah lihat hasil: pertahankan state quiz, jangan mengulang
// dari awal".
function readInitialInput(params: URLSearchParams): Partial<QuizInput> {
  // PENTING: jangan pernah masukkan key dengan value `undefined` ke object
  // ini. useQuizState menggabungkannya lewat `{ ...DEFAULTS, ...initial }` —
  // kalau key-nya ADA (walau valuenya undefined), spread tetap menimpa
  // DEFAULTS jadi undefined juga, bikin quiz.completeInput selalu null.
  const result: Partial<QuizInput> = {};

  const persona = params.get("persona");
  if (VALID_PERSONAS.includes(persona as PersonaId)) {
    result.personaId = persona as PersonaId;
  }

  const budgetRaw = params.get("budget");
  const budget = budgetRaw ? Number(budgetRaw) : NaN;
  if (Number.isFinite(budget) && budget >= 2_000_000 && budget <= 6_500_000) {
    result.budget = budget;
  }

  const internet = params.get("internet");
  if (VALID_INTERNET.includes(internet as QuizInput["internetPriority"])) {
    result.internetPriority = internet as QuizInput["internetPriority"];
  }

  const community = params.get("community");
  if (VALID_COMMUNITY.includes(community as QuizInput["communityPriority"])) {
    result.communityPriority = community as QuizInput["communityPriority"];
  }

  const environment = params.get("environment");
  if (VALID_ENVIRONMENT.includes(environment as QuizInput["environmentPreference"])) {
    result.environmentPreference = environment as QuizInput["environmentPreference"];
  }

  return result;
}

const PERSONA_NAMES: Record<string, string> = {
  "tech-professional": "Tech Professional",
  "creative-professional": "Creative Professional",
  "student-fresh-graduate": "Student & Fresh Graduate",
  "digital-nomad": "Digital Nomad",
};

const PERSONA_ICONS: Record<string, React.ElementType> = {
  "tech-professional": Laptop,
  "creative-professional": Palette,
  "student-fresh-graduate": GraduationCap,
  "digital-nomad": Globe,
};

const PRIORITY_LABELS: Record<string, string> = {
  low: "Low", medium: "Medium", high: "High", ultra: "Ultra",
};

const ENVIRONMENT_LABELS: Record<string, string> = {
  quiet: "Quiet", cafe: "Cafe", coworking: "Coworking", flexible: "Flexible",
};

function formatRupiahCompact(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

function QuestionCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-start gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="h-4 w-4" style={{ color: iconColor }} />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quiz = useQuizState(readInitialInput(searchParams));
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcStep, setCalcStep] = useState(0);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cleanup semua timeout saat komponen unmount (cegah memory leak)
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  // Cerminkan input quiz saat ini ke URL /quiz lewat router.replace (BUKAN
  // push — tidak menambah entri history baru). Begini, saat "Find My Best
  // Region" nanti push ke /result, entri /quiz di history sudah membawa
  // input terakhir user, jadi tombol Back browser balik ke Step 1 yang
  // TERISI, bukan kosong (PRD §6.1 edge case).
  useEffect(() => {
    const p = new URLSearchParams();
    if (quiz.input.personaId) p.set("persona", quiz.input.personaId);
    if (quiz.input.budget !== undefined) p.set("budget", String(quiz.input.budget));
    if (quiz.input.internetPriority) p.set("internet", quiz.input.internetPriority);
    if (quiz.input.communityPriority) p.set("community", quiz.input.communityPriority);
    if (quiz.input.environmentPreference) p.set("environment", quiz.input.environmentPreference);
    const qs = p.toString();
    router.replace(qs ? `/quiz?${qs}` : "/quiz", { scroll: false });
  }, [
    quiz.input.personaId,
    quiz.input.budget,
    quiz.input.internetPriority,
    quiz.input.communityPriority,
    quiz.input.environmentPreference,
    router,
  ]);

  const adjustedWeights =
    quiz.completeInput
      ? computeAdjustedWeights(quiz.completeInput)
      : null;

  function handleFindBestRegion() {
    quiz.goToStep2();
  }

  function handleSeeResults() {
    // Capture input sekarang, jangan pakai quiz.completeInput di dalam setTimeout
    // karena closure bisa stale jika state berubah sebelum timeout fire
    const input = quiz.completeInput;
    if (!input) return;

    setIsCalculating(true);
    setCalcStep(1);

    const t1 = setTimeout(() => setCalcStep(2), 600);
    const t2 = setTimeout(() => setCalcStep(3), 1200);
    const t3 = setTimeout(() => setCalcStep(4), 1800);
    const t4 = setTimeout(() => {
      const p = new URLSearchParams({
        persona:     input.personaId,
        budget:      String(input.budget),
        internet:    input.internetPriority,
        community:   input.communityPriority,
        environment: input.environmentPreference,
      });
      router.push(`/result?${p.toString()}`);
    }, 2500);

    timeoutRefs.current = [t1, t2, t3, t4];
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
      <div className="relative isolate flex min-h-screen flex-col overflow-hidden">
        <AmbientBackground />
        <Navbar showStartQuiz={false} />
        <div className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="w-full max-w-[360px]">
            {/* Spinner icon */}
            <div className="mb-8 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-md)] bg-ink">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            </div>

            <h2 className="mb-7 text-center text-xl font-bold tracking-tight text-ink">
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
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                        isDone ? "bg-sawah" : isCurrent ? "border-2 border-sawah bg-transparent" : "bg-line"
                      )}
                    >
                      {isDone && <Check className="h-3.5 w-3.5 text-white" />}
                      {isCurrent && <Loader2 className="h-3 w-3 animate-spin text-sawah" />}
                    </div>
                    <span
                      className={cn(
                        "text-sm transition-colors duration-300",
                        isDone ? "text-muted-foreground" : isCurrent ? "font-semibold text-ink" : "text-line"
                      )}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-sawah transition-all duration-500 ease-out"
                style={{ width: `${(calcStep / 4) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-right font-mono text-xs text-muted-foreground">
              {Math.round((calcStep / 4) * 100)}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <AmbientBackground />
      <Navbar showStartQuiz={false} />

      {/* Step progress bar — dua lingkaran bernomor, terpusat */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[680px] items-center justify-center gap-4 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-bold transition-colors",
                quiz.step === 1
                  ? "bg-sawah text-white"
                  : quiz.step > 1
                    ? "bg-ink text-white"
                    : "border border-line bg-white text-muted-foreground"
              )}
            >
              {quiz.step > 1 ? <Check className="h-4 w-4" /> : "1"}
            </div>
            <span className={cn("text-xs", quiz.step === 1 ? "font-semibold text-sawah" : "text-muted-foreground")}>
              Profil Anda
            </span>
          </div>
          <div className="h-px w-10 bg-line sm:w-16">
            <div
              className="h-px bg-sawah transition-all duration-500 ease-out"
              style={{ width: quiz.step === 2 ? "100%" : "0%" }}
            />
          </div>
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-bold transition-colors",
                quiz.step === 2 ? "bg-sawah text-white" : "border border-line bg-white text-muted-foreground"
              )}
            >
              2
            </div>
            <span className={cn("text-xs", quiz.step === 2 ? "font-semibold text-sawah" : "text-muted-foreground")}>
              Penjelasan Algoritma
            </span>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "relative mx-auto px-4 py-8 sm:px-6 sm:py-12",
          quiz.step === 2 ? "max-w-[1040px]" : "max-w-[680px]"
        )}
      >
        {/* ── STEP 1: Input ──────────────────────────────────── */}
        {quiz.step === 1 && (
          <div>
            {/* Header, center-aligned meniru referensi */}
            <div className="mb-6 text-center">
              <p className="mb-1.5 font-mono text-xs font-semibold text-sawah">Langkah 1 dari 2</p>
              <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Ceritakan Preferensi Anda
              </h1>
              <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
                Jawab beberapa pertanyaan singkat untuk menemukan distrik yang paling cocok untuk Anda.
              </p>
            </div>

            {/* 5 kartu pertanyaan terpisah, tiap kartu punya header ikon+judul+subjudul sendiri */}
            <div className="space-y-4">
              <QuestionCard icon={Users} iconBg="#FCE7F3" iconColor="#DB2777" title="Persona Anda" subtitle="Pilih yang paling sesuai">
                <PersonaCardSelector
                  selected={quiz.input.personaId}
                  onSelect={quiz.setPersona}
                  showError={quiz.showPersonaError}
                />
              </QuestionCard>

              <QuestionCard icon={Wallet} iconBg="#DBEAFE" iconColor="#2563EB" title="Budget Bulanan" subtitle="Estimasi total pengeluaran bulanan Anda">
                <BudgetSlider
                  value={quiz.input.budget ?? 4_000_000}
                  onChange={quiz.setBudget}
                />
              </QuestionCard>

              <QuestionCard icon={Wifi} iconBg="#FFEDD5" iconColor="#EA580C" title="Prioritas Internet" subtitle="Seberapa penting kecepatan & stabilitas internet?">
                <InternetPrioritySelect
                  value={quiz.input.internetPriority ?? "medium"}
                  onChange={quiz.setInternetPriority}
                />
              </QuestionCard>

              <QuestionCard icon={Handshake} iconBg="#FEF3C7" iconColor="#D97706" title="Prioritas Komunitas" subtitle="Seberapa penting komunitas & networking?">
                <CommunityPrioritySelect
                  value={quiz.input.communityPriority ?? "medium"}
                  onChange={quiz.setCommunityPriority}
                />
              </QuestionCard>

              <QuestionCard icon={Leaf} iconBg="var(--positive-bg)" iconColor="var(--positive)" title="Lingkungan Kerja yang Disukai" subtitle="Pilih suasana kerja yang paling Anda nyaman">
                <EnvironmentPreferenceSelect
                  value={quiz.input.environmentPreference ?? "flexible"}
                  onChange={quiz.setEnvironmentPreference}
                />
              </QuestionCard>
            </div>

            {/* CTA */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleFindBestRegion}
                className="inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-full bg-sawah text-base font-medium text-white transition-colors duration-[180ms] hover:bg-sawah/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:w-auto sm:px-10"
              >
                Lanjutkan ke Langkah 2
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-xs text-muted-foreground">
                Langkah berikutnya: lihat bobot &amp; formula yang dipakai, sebelum hasil muncul.
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 2: Algorithm Explanation ──────────────────── */}
        {quiz.step === 2 && adjustedWeights && (
          <div>
            {/* Header, center-aligned meniru referensi */}
            <div className="mb-8 text-center">
              <p className="mb-1.5 font-mono text-xs font-semibold text-sawah">Langkah 2 dari 2</p>
              <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Bagaimana Sistem Menghitung?
              </h1>
              <p className="mx-auto mt-1.5 max-w-lg text-sm text-muted-foreground">
                Sistem kami menggunakan metode multi-criteria decision making untuk memberikan rekomendasi yang paling sesuai.
              </p>
            </div>

            {/* 3 kolom: Profil Anda / Bobot Indikator / Formula Perhitungan */}
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Profil Anda */}
              <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
                <p className="mb-4 text-sm font-semibold text-ink">Profil Anda</p>
                {quiz.input.personaId && (
                  <div className="mb-4 inline-flex items-center gap-2 rounded-xl border border-sawah/20 bg-sawah/5 px-3 py-2">
                    {(() => {
                      const PersonaIcon = PERSONA_ICONS[quiz.input.personaId];
                      return <PersonaIcon className="h-4 w-4 text-sawah" />;
                    })()}
                    <span className="text-sm font-medium text-sawah">
                      {PERSONA_NAMES[quiz.input.personaId]}
                    </span>
                  </div>
                )}
                <dl className="space-y-3">
                  {[
                    ["Budget", `${formatRupiahCompact(quiz.input.budget ?? 4_000_000)} /bulan`],
                    ["Internet Priority", PRIORITY_LABELS[quiz.input.internetPriority ?? "medium"]],
                    ["Community Priority", PRIORITY_LABELS[quiz.input.communityPriority ?? "medium"]],
                    ["Environment", ENVIRONMENT_LABELS[quiz.input.environmentPreference ?? "flexible"]],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <dt className="text-xs text-muted-foreground">{label}</dt>
                      <dd className="text-sm font-semibold text-ink">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Bobot Indikator */}
              <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
                <p className="mb-5 text-sm font-semibold text-ink">Bobot Indikator (Setelah Penyesuaian)</p>
                <WeightBarChart weights={adjustedWeights} />
              </div>

              {/* Formula Perhitungan */}
              <FormulaExample weights={adjustedWeights} />
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={quiz.goToStep1}
                className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-line bg-white px-6 text-sm font-medium text-ink transition-colors duration-[180ms] hover:border-ink/30"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </button>
              <button
                type="button"
                onClick={handleSeeResults}
                className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-sawah px-8 text-sm font-medium text-white transition-colors duration-[180ms] hover:bg-sawah/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Lihat Hasil Rekomendasi
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={null}>
      <QuizContent />
    </Suspense>
  );
}
