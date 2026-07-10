"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PillNavbar } from "@/components/shared/PillNavbar";
import { AmbientBackground } from "@/components/shared/AmbientBackground";
import { AssistantChat } from "@/components/shared/AssistantChat";
import { rankDistricts } from "@/lib/scoring/rank";
import { rankSubDistricts } from "@/lib/scoring/rankSubDistricts";
import { computeAdjustedWeights } from "@/lib/scoring/normalize";
import { useDistricts } from "@/hooks/useDistricts";
import type { AssistantContext } from "@/lib/assistant/qaBank";
import type { QuizInput } from "@/types/quiz";

const PERSONA_NAMES: Record<string, string> = {
  "tech-professional": "Tech Professional",
  "creative-professional": "Creative Professional",
  "student-fresh-graduate": "Student & Fresh Graduate",
  "digital-nomad": "Digital Nomad",
};

// Halaman chat penuh — dipakai di layar sempit (mobile/tablet). Di layar lebar
// (`lg:` ke atas), FCI Assistant dibuka sebagai panel docked di Result page
// (lihat `AssistantDock` di app/result/page.tsx), bukan pindah ke halaman ini.
function AssistantContent() {
  const params = useSearchParams();
  const personaId = params.get("persona") as QuizInput["personaId"] | null;
  const budget = Number(params.get("budget") ?? 4_000_000);
  const internet = (params.get("internet") ?? "medium") as QuizInput["internetPriority"];
  const community = (params.get("community") ?? "medium") as QuizInput["communityPriority"];
  const environment =
    (params.get("environment") ?? "flexible") as QuizInput["environmentPreference"];

  const hasQuizContext = !!personaId;
  const quizQuery = hasQuizContext
    ? `?persona=${personaId}&budget=${budget}&internet=${internet}&community=${community}&environment=${environment}`
    : "";
  const backHref = hasQuizContext ? `/result${quizQuery}` : "/result";

  const { districts, scores, subDistricts, subDistrictScores, loading } = useDistricts();

  if (loading) {
    return (
      <div className="space-y-3.5 px-2 pb-2 pt-4 sm:px-3">
        <div className="h-[60vh] animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  let ctx: AssistantContext | null = null;
  if (hasQuizContext && districts.length > 0) {
    const input: QuizInput = {
      personaId,
      budget,
      internetPriority: internet,
      communityPriority: community,
      environmentPreference: environment,
    };
    const ranked = rankDistricts(input, districts, scores);
    const bestDistrict = districts.find((d) => d.id === ranked[0]?.districtId);
    if (ranked[0] && bestDistrict) {
      // Grounding lengkap yang sama dengan Result page (lihat komentar di sana):
      // ranking distrik + kecamatan terbaik per distrik + bobot' + ranking
      // kecamatan Best Match, supaya Gemini bisa jawab seluruh lingkup sesi.
      const bestSubHere = subDistricts.filter((sd) => sd.districtId === ranked[0].districtId);
      const bestSubRanked = rankSubDistricts(input, bestSubHere, subDistrictScores);
      const topKecamatan = (districtId: string): string | undefined => {
        const subHere = subDistricts.filter((sd) => sd.districtId === districtId);
        const rankedSub = rankSubDistricts(input, subHere, subDistrictScores);
        return subHere.find((sd) => sd.id === rankedSub[0]?.subDistrictId)?.nama;
      };
      ctx = {
        personaLabel: PERSONA_NAMES[personaId] ?? personaId,
        bestName: bestDistrict.nama,
        bestScore: ranked[0].skorTotal,
        isBelowUMK: !!ranked[0].isBelowUMK,
        budget,
        weights: computeAdjustedWeights(input),
        ranking: ranked.map((r) => ({
          rank: r.rank,
          nama: districts.find((d) => d.id === r.districtId)?.nama ?? r.districtId,
          skorTotal: r.skorTotal,
          skorPerIndikator: r.skorPerIndikator,
          topKecamatan: topKecamatan(r.districtId),
        })),
        bestKecamatan: bestSubRanked.map((k) => ({
          rank: k.rank,
          nama: bestSubHere.find((s) => s.id === k.subDistrictId)?.nama ?? k.subDistrictId,
          skorTotal: k.skorTotal,
        })),
      };
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-140px)] min-h-[520px] w-full max-w-[640px] flex-col px-2 pb-2 pt-4 sm:px-3">
      <Link
        href={backHref}
        className="mb-3 inline-flex w-fit items-center gap-1.5 text-[11.5px] font-semibold text-muted-foreground hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Kembali ke Hasil
      </Link>

      <AssistantChat ctx={ctx} />
    </div>
  );
}

export default function AssistantPage() {
  return (
    <div className="min-h-screen p-2 sm:p-4">
      <AmbientBackground />
      {/* Frame luar 1220px, sama dengan Result/District Detail/Compare (satu
          identitas visual & lebar konsisten di layar lebar) — konten chat di
          dalamnya dibatasi lebih sempit (640px) lewat AssistantContent supaya
          bubble chat tidak jadi lebar-lebar amat. */}
      <div className="mx-auto max-w-[1220px] rounded-[26px] border border-white/50 bg-paper/70 p-2.5 shadow-xl backdrop-blur-2xl sm:p-3.5">
        <PillNavbar />
        <Suspense
          fallback={
            <div className="px-2 pb-2 pt-4 sm:px-3">
              <div className="h-[60vh] animate-pulse rounded-2xl bg-muted" />
            </div>
          }
        >
          <AssistantContent />
        </Suspense>
      </div>
    </div>
  );
}
