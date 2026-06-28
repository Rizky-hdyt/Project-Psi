"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import {
  ChevronUp,
  ChevronDown,
  Star,
  RefreshCw,
  Wifi,
  Wallet,
  Users,
  Leaf,
  ArrowRight,
  MapPin,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Navbar } from "@/components/shared/Navbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { RelevanceSurvey } from "@/components/shared/RelevanceSurvey";
import { rankDistricts } from "@/lib/scoring/rank";
import { generateWhyText } from "@/lib/scoring/whyThisMatch";
import { useDistricts } from "@/hooks/useDistricts";
import { getDistrictVisual } from "@/data/districts.visuals";
import { cn } from "@/lib/utils";
import type { QuizInput } from "@/types/quiz";
import type { District } from "@/types/district";
import type { IndicatorId, RankedDistrict } from "@/types/recommendation";

// ── District metadata ────────────────────────────────────────────────────────
const DISTRICT_SECONDARY_BADGE: Record<string, string> = {
  "kota-yogyakarta": "Best Connectivity",
  sleman: "Best Balance",
  bantul: "Best for Creators",
  "kulon-progo": "Most Potential",
  gunungkidul: "Lowest Cost",
};

const INDICATORS: { id: IndicatorId; label: string; shortLabel: string; icon: React.ElementType }[] = [
  { id: "internet", label: "Internet", shortLabel: "Internet", icon: Wifi },
  { id: "cost", label: "Biaya Hidup", shortLabel: "Biaya", icon: Wallet },
  { id: "community", label: "Komunitas", shortLabel: "Komunitas", icon: Users },
  { id: "environment", label: "Lingkungan", shortLabel: "Lingkungan", icon: Leaf },
];

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

// ── District Avatar ──────────────────────────────────────────────────────────
function DistrictAvatar({
  districtId,
  size = "md",
}: {
  districtId: string;
  size?: "sm" | "md";
}) {
  const visual = getDistrictVisual(districtId);
  const cls =
    size === "sm"
      ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold text-white"
      : "flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold text-white";
  return (
    <div
      className={cls}
      style={{ background: `linear-gradient(135deg, ${visual.gradientFrom}, ${visual.gradientTo})` }}
      aria-hidden="true"
    >
      {visual.emoji}
    </div>
  );
}

// ── Score Comparison Sidebar ─────────────────────────────────────────────────
function ScoreComparisonChart({ ranked, districts }: { ranked: RankedDistrict[]; districts: District[] }) {
  const districtMap = Object.fromEntries(districts.map((d) => [d.id, d]));
  const maxScore = ranked[0]?.skorTotal ?? 100;

  return (
    <div className="rounded-xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(28,37,33,0.06)]">
      <p className="mb-0.5 text-sm font-semibold text-ink">Score Comparison</p>
      <p className="mb-4 text-xs text-muted-foreground">All {ranked.length} districts ranked</p>
      <div className="space-y-2.5">
        {ranked.map((r) => {
          const d = districtMap[r.districtId];
          const visual = getDistrictVisual(r.districtId);
          const pct = Math.round((r.skorTotal / maxScore) * 100);
          return (
            <div key={r.districtId} className="flex items-center gap-2">
              <span className="w-20 shrink-0 truncate text-xs text-muted-foreground">
                {d?.nama.replace("Kabupaten ", "").replace("Kota ", "") ?? r.districtId}
              </span>
              <div className="flex-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full motion-safe:transition-all motion-safe:duration-500"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${visual.gradientFrom}, ${visual.gradientTo})`,
                    }}
                  />
                </div>
              </div>
              <span className="w-8 text-right font-mono text-xs font-semibold text-ink">
                {(r.skorTotal / 10).toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Top Recommendation Sidebar Card ─────────────────────────────────────────
function TopRecommendationCard({
  ranked,
  districts,
  resultUrl,
}: {
  ranked: RankedDistrict[];
  districts: District[];
  resultUrl: string;
}) {
  if (ranked.length === 0) return null;
  const top = ranked[0];
  const d = districts.find((x) => x.id === top.districtId);
  if (!d) return null;

  const topVisual = getDistrictVisual(top.districtId);
  return (
    <div
      className="rounded-xl p-5 text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
      style={{
        background: `linear-gradient(135deg, ${topVisual.gradientFrom} 0%, ${topVisual.gradientTo} 100%)`,
      }}
    >
      <div className="mb-3 flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5 opacity-80" />
        <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
          Top Recommendation
        </span>
      </div>
      <div className="mb-1 flex items-center gap-2">
        <span className="text-2xl">{getDistrictVisual(top.districtId).emoji}</span>
        <h3 className="font-display text-xl font-bold">{d.nama}</h3>
      </div>
      <p className="mb-4 text-sm opacity-75 leading-relaxed line-clamp-2">
        {d.ringkasanKarakteristik}
      </p>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-white/15 p-3">
          <p className="font-mono text-2xl font-bold">{(top.skorTotal / 10).toFixed(1)}</p>
          <p className="text-xs opacity-75">Match Score</p>
        </div>
        <div className="rounded-lg bg-white/15 p-3">
          <p className="font-mono text-2xl font-bold">{d.coworkingCount}</p>
          <p className="text-xs opacity-75">Coworking Spaces</p>
        </div>
      </div>

      <Link href={`/district/${d.id}?${resultUrl.split("?")[1] ?? ""}`}>
        <Button
          className="w-full gap-1.5 bg-white text-sawah hover:bg-white/90 font-semibold"
          size="sm"
        >
          Explore {d.nama}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </Link>
    </div>
  );
}

// ── Compare Dialog ────────────────────────────────────────────────────────────
function CompareDialog({
  open,
  onClose,
  ranked,
  districts,
  quizParams,
}: {
  open: boolean;
  onClose: () => void;
  ranked: RankedDistrict[];
  districts: District[];
  quizParams: string;
}) {
  const router = useRouter();
  const districtMap = Object.fromEntries(districts.map((d) => [d.id, d]));
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!open) setSelected([]);
  }, [open]);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  function handleCompare() {
    if (selected.length < 2) return;
    router.push(`/compare?districts=${selected.join(",")}&${quizParams}`);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-ink">
            <BarChart3 className="h-4 w-4 text-sawah" />
            Bandingkan Distrik
          </DialogTitle>
          <DialogDescription>
            Pilih 2–3 distrik untuk dibandingkan secara detail. Skor berdasarkan preferensi quiz Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          {ranked.map((r) => {
            const d = districtMap[r.districtId];
            if (!d) return null;
            const isSelected = selected.includes(r.districtId);
            const isDisabled = !isSelected && selected.length >= 3;
            return (
              <button
                key={r.districtId}
                onClick={() => toggle(r.districtId)}
                disabled={isDisabled}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-sawah bg-sawah/6 shadow-sm"
                    : isDisabled
                      ? "cursor-not-allowed border-line opacity-40"
                      : "border-line hover:border-sawah/40 hover:bg-muted/50"
                )}
              >
                {/* Checkbox visual */}
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                    isSelected
                      ? "border-sawah bg-sawah text-white"
                      : "border-line bg-white"
                  )}
                >
                  {isSelected && (
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                <DistrictAvatar districtId={r.districtId} size="sm" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-sm font-semibold", isSelected ? "text-ink" : "text-ink/80")}>
                      {d.nama}
                    </span>
                    {r.rank === 1 && (
                      <Badge className="gap-1 bg-sawah px-1.5 py-0 text-[9px] text-white hover:bg-sawah">
                        <Star className="h-2 w-2" />
                        Best
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">Rank #{r.rank}</span>
                </div>

                <span className="font-mono text-lg font-bold text-ink">
                  {(r.skorTotal / 10).toFixed(1)}
                </span>
              </button>
            );
          })}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose} className="border-line">
            Batalkan
          </Button>
          <Button
            disabled={selected.length < 2}
            onClick={handleCompare}
            className="gap-2 bg-sawah text-white hover:bg-sawah/90 disabled:opacity-40"
          >
            <BarChart3 className="h-4 w-4" />
            Bandingkan{selected.length >= 2 ? ` (${selected.length})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── District Rank Card ────────────────────────────────────────────────────────
function DistrictRankCard({
  ranked,
  district,
  isBest,
  isOpen,
  onToggle,
  whyText,
  resultUrl,
}: {
  ranked: RankedDistrict;
  district: District;
  isBest: boolean;
  isOpen: boolean;
  onToggle: () => void;
  whyText: string;
  resultUrl: string;
}) {
  const displayScore = (ranked.skorTotal / 10).toFixed(1);
  const secondaryBadge = DISTRICT_SECONDARY_BADGE[district.id];
  const scoreBar = Math.round(ranked.skorTotal);
  const visual = getDistrictVisual(district.id);

  return (
    <div
      className={
        isBest
          ? "rounded-xl border-2 border-sawah bg-white shadow-[0_4px_16px_rgba(47,111,78,0.15)] overflow-hidden"
          : "rounded-xl border border-line bg-white shadow-[0_1px_3px_rgba(28,37,33,0.06)] overflow-hidden"
      }
    >
      {/* Gradient strip */}
      <div
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(90deg, ${visual.gradientFrom}, ${visual.gradientTo})` }}
      />

      {/* Card header */}
      <button
        className="flex w-full items-start gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-t-xl"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label={`${isOpen ? "Tutup" : "Buka"} detail ${district.nama}`}
      >
        <span
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
            isBest ? "bg-sawah text-white" : "bg-line text-muted-foreground"
          }`}
        >
          #{ranked.rank}
        </span>

        <DistrictAvatar districtId={district.id} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-ink">{district.nama}</span>
            {isBest && (
              <Badge className="gap-1 bg-sawah text-white hover:bg-sawah px-2 py-0.5 text-[10px]">
                <Star className="h-2.5 w-2.5" />
                Best Match
              </Badge>
            )}
            {secondaryBadge && (
              <Badge variant="outline" className="border-line text-muted-foreground px-2 py-0.5 text-[10px]">
                {secondaryBadge}
              </Badge>
            )}
          </div>
          {ranked.isBelowUMK && (
            <span className="mt-1 inline-block rounded-full bg-warning-bg px-2 py-0.5 font-mono text-[10px] text-warning border border-warning/30">
              Budget di bawah UMK
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="font-mono text-2xl font-bold text-ink">{displayScore}</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Score bar */}
      <div className="mx-4 mb-3 h-1.5 w-[calc(100%-2rem)] overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full motion-safe:transition-all motion-safe:duration-500 ${isBest ? "bg-sawah" : "bg-pesisir/50"}`}
          style={{ width: `${scoreBar}%` }}
        />
      </div>

      {/* Mini stats */}
      <div className="mx-4 mb-3 flex flex-wrap gap-x-4 gap-y-1">
        {INDICATORS.map(({ id, shortLabel, icon: Icon }) => (
          <span key={id} className="flex items-center gap-1 text-xs text-muted-foreground">
            <Icon className="h-3 w-3" />
            {shortLabel}:{" "}
            <span className="font-mono font-semibold text-ink ml-0.5">
              {Math.round(ranked.skorPerIndikator[id] / 10)}
            </span>
          </span>
        ))}
      </div>

      {/* Expandable */}
      {isOpen && (
        <div className="border-t border-line px-4 pb-4 pt-4">
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            {district.ringkasanKarakteristik}
          </p>

          <div className="mb-4 space-y-2.5">
            {INDICATORS.map(({ id, label }) => {
              const rawSkor = ranked.skorPerIndikator[id];
              const displayVal = Math.round(rawSkor / 10);
              return (
                <div key={id} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-xs text-muted-foreground">{label}</span>
                  <div className="flex-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-pesisir motion-safe:transition-all motion-safe:duration-300"
                        style={{ width: `${rawSkor}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-8 text-right font-mono text-xs font-semibold text-ink">
                    {displayVal}/10
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mb-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded border border-line px-2 py-1 font-mono text-muted-foreground">
              UMK {formatRupiah(district.umk)}/bln
            </span>
            <span className="rounded border border-line px-2 py-1 font-mono text-muted-foreground">
              {district.coworkingCount} coworking spaces
            </span>
            <span className="rounded border border-line px-2 py-1 font-mono text-muted-foreground">
              ~{district.internetMbps} Mbps
            </span>
          </div>

          <div className="mb-4 rounded-lg bg-sawah/6 p-3">
            <p className="mb-1.5 text-xs font-semibold text-sawah">Mengapa cocok untuk Anda</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{whyText}</p>
          </div>

          <Link href={`/district/${district.id}?${resultUrl.split("?")[1] ?? ""}`}>
            <Button className="w-full gap-1.5 bg-sawah text-white hover:bg-sawah/90 min-h-[40px]" size="sm">
              <MapPin className="h-3.5 w-3.5" />
              View District Details
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

// ── Main Result Content ───────────────────────────────────────────────────────
function ResultContent() {
  const params = useSearchParams();
  const router = useRouter();

  const personaId = params.get("persona") as QuizInput["personaId"] | null;
  const budget = Number(params.get("budget") ?? 4_000_000);
  const internet = (params.get("internet") ?? "medium") as QuizInput["internetPriority"];
  const community = (params.get("community") ?? "medium") as QuizInput["communityPriority"];
  const environment = (params.get("environment") ?? "flexible") as QuizInput["environmentPreference"];

  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  const { districts, scores, loading: distLoading, error: distError } = useDistricts();

  if (!personaId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="mb-4 text-muted-foreground">Input tidak lengkap. Mulai quiz terlebih dahulu.</p>
        <Link href="/quiz">
          <Button className="gap-2 bg-sawah text-white hover:bg-sawah/90">
            Mulai Quiz
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  if (distLoading) {
    return (
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl border border-line bg-white" />
          ))}
        </div>
        <div className="w-full space-y-4 lg:w-[300px]">
          <div className="h-48 animate-pulse rounded-xl border border-line bg-white" />
          <div className="h-52 animate-pulse rounded-xl bg-pesisir/30" />
        </div>
      </div>
    );
  }

  if (distError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="mb-4 text-error">Koneksi terputus. Coba lagi?</p>
        <Button className="gap-2 bg-sawah text-white hover:bg-sawah/90" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4" />
          Coba Lagi
        </Button>
      </div>
    );
  }

  const input: QuizInput = {
    personaId,
    budget,
    internetPriority: internet,
    communityPriority: community,
    environmentPreference: environment,
  };

  const ranked = rankDistricts(input, districts, scores);

  if (ranked.length === 0) {
    return <EmptyState onRetry={() => router.push("/quiz")} />;
  }

  const districtMap = Object.fromEntries(districts.map((d) => [d.id, d]));
  const resultUrl = `/result?persona=${personaId}&budget=${budget}&internet=${internet}&community=${community}&environment=${environment}`;
  const quizParams = `persona=${personaId}&budget=${budget}&internet=${internet}&community=${community}&environment=${environment}`;

  const effectiveOpenId = hasInteracted ? openCardId : ranked[0]?.districtId;

  return (
    <>
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Your District Ranking
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on your preferences — personalized match scores below
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCompareOpen(true)}
            className="gap-1.5 border-line text-muted-foreground hover:border-sawah hover:text-sawah"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Bandingkan
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/quiz")}
            className="gap-1.5 border-line text-muted-foreground hover:text-ink"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retake Quiz
          </Button>
        </div>
      </div>

      {/* Cards + sidebar */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-3">
          {ranked.map((r) => {
            const d = districtMap[r.districtId];
            const isOpen = effectiveOpenId === r.districtId;
            return (
              <DistrictRankCard
                key={r.districtId}
                ranked={r}
                district={d}
                isBest={r.rank === 1}
                isOpen={isOpen}
                onToggle={() => {
                  setHasInteracted(true);
                  setOpenCardId(isOpen ? null : r.districtId);
                }}
                whyText={generateWhyText(r, d.nama)}
                resultUrl={resultUrl}
              />
            );
          })}
        </div>

        <div className="w-full space-y-4 lg:w-[300px] lg:shrink-0 lg:sticky lg:top-[64px]">
          <ScoreComparisonChart ranked={ranked} districts={districts} />
          <TopRecommendationCard ranked={ranked} districts={districts} resultUrl={resultUrl} />
        </div>
      </div>

      {/* Survey popup — fixed bottom-right, muncul otomatis setelah 3.5 detik */}
      <RelevanceSurvey personaId={personaId} />

      {/* Compare dialog */}
      <CompareDialog
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        ranked={ranked}
        districts={districts}
        quizParams={quizParams}
      />
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ResultPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />
      <div className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 sm:py-10">
        <Suspense
          fallback={
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex-1 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-xl border border-line bg-white" />
                ))}
              </div>
              <div className="w-full space-y-4 lg:w-[300px]">
                <div className="h-48 animate-pulse rounded-xl border border-line bg-white" />
                <div className="h-52 animate-pulse rounded-xl bg-pesisir/30" />
              </div>
            </div>
          }
        >
          <ResultContent />
        </Suspense>
      </div>
    </div>
  );
}
