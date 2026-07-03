"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Wifi,
  Wallet,
  Users,
  Leaf,
  Star,
  MapPin,
  RefreshCw,
  Home,
  Building2,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/shared/Navbar";
import { rankDistricts } from "@/lib/scoring/rank";
import { generateWhyText } from "@/lib/scoring/whyThisMatch";
import { useDistricts } from "@/hooks/useDistricts";
import { getDistrictVisual } from "@/data/districts.visuals";
import { cn } from "@/lib/utils";
import type { QuizInput } from "@/types/quiz";
import type { IndicatorId, RankedDistrict } from "@/types/recommendation";
import type { District } from "@/types/district";

// ── Constants ────────────────────────────────────────────────────────────────
const INDICATORS: {
  id: IndicatorId;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  { id: "internet", label: "Internet", icon: Wifi, description: "Kecepatan & keandalan koneksi" },
  { id: "cost", label: "Biaya Hidup", icon: Wallet, description: "Keterjangkauan vs rata-rata DIY" },
  { id: "community", label: "Komunitas", icon: Users, description: "Ekosistem freelancer & networking" },
  { id: "environment", label: "Lingkungan Kerja", icon: Leaf, description: "Ketersediaan ruang & suasana" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

function shortName(nama: string) {
  return nama.replace("Kabupaten ", "").replace("Kota ", "");
}

function colClass(count: number) {
  return count === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3";
}

// ── District Header Cards ─────────────────────────────────────────────────────
function DistrictHeaderCards({
  selectedDistricts,
  selectedRanked,
  bestId,
}: {
  selectedDistricts: District[];
  selectedRanked: RankedDistrict[];
  bestId: string;
}) {
  return (
    <div className={cn("grid gap-4", colClass(selectedDistricts.length))}>
      {selectedDistricts.map((d, i) => {
        const r = selectedRanked[i];
        const visual = getDistrictVisual(d.id);
        const isBest = d.id === bestId;
        if (!r) return null;
        return (
          <div
            key={d.id}
            className={cn(
              "relative overflow-hidden rounded-2xl p-5 sm:p-6 text-white",
              isBest ? "ring-2 ring-offset-2 ring-sawah" : ""
            )}
            style={{
              background: `linear-gradient(135deg, ${visual.gradientFrom} 0%, ${visual.gradientTo} 100%)`,
            }}
          >
            {/* Decorative circle */}
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-6 -left-4 h-24 w-24 rounded-full bg-black/10"
              aria-hidden="true"
            />

            {isBest && (
              <Badge className="absolute right-4 top-4 gap-1 bg-white/25 text-[10px] text-white backdrop-blur-sm hover:bg-white/25">
                <Star className="h-2.5 w-2.5" />
                Best Match
              </Badge>
            )}

            <div className="relative">
              {/* District identity */}
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-xl"
                  aria-hidden="true"
                >
                  {visual.emoji}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest opacity-70">
                    Rank #{r.rank}
                  </p>
                  <p className="truncate text-base font-semibold sm:text-lg">{d.nama}</p>
                </div>
              </div>

              {/* Score */}
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-5xl font-bold tracking-tight">
                  {(r.skorTotal / 10).toFixed(1)}
                </span>
                <span className="mb-1 text-sm opacity-60">/10</span>
              </div>
              <p className="text-xs opacity-60">Match Score</p>

              {/* UMK below budget chip */}
              {r.isBelowUMK && (
                <div className="mt-3 inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-medium backdrop-blur-sm">
                  Budget di bawah UMK
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Indicator Comparison Table (compact, organized by district column) ────────
function IndicatorComparisonTable({
  selectedDistricts,
  selectedRanked,
}: {
  selectedDistricts: District[];
  selectedRanked: RankedDistrict[];
}) {
  const n = selectedDistricts.length;

  return (
    <div>
      <SectionLabel icon={BarChart3} label="Perbandingan Indikator" />
      {/* overflow-x-auto so mobile can scroll if 3 districts */}
      <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
        <div style={{ minWidth: n === 3 ? "520px" : "360px" }}>

          {/* Header row: district names as columns */}
          <div
            className="grid border-b border-line bg-muted/30"
            style={{ gridTemplateColumns: `110px repeat(${n}, 1fr)` }}
          >
            <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Indikator
            </div>
            {selectedDistricts.map((d) => {
              const visual = getDistrictVisual(d.id);
              return (
                <div key={d.id} className="flex items-center gap-2 border-l border-line px-4 py-3">
                  <span className="text-base shrink-0" aria-hidden="true">{visual.emoji}</span>
                  <span className="truncate text-xs font-semibold text-ink">{shortName(d.nama)}</span>
                </div>
              );
            })}
          </div>

          {/* Indicator rows */}
          {INDICATORS.map(({ id, label, icon: Icon }, rowIdx) => {
            const scores = selectedRanked.map((r) => r?.skorPerIndikator[id] ?? 0);
            const maxScore = Math.max(...scores);
            return (
              <div
                key={id}
                className={cn(
                  "grid",
                  rowIdx < INDICATORS.length - 1 ? "border-b border-line" : ""
                )}
                style={{ gridTemplateColumns: `110px repeat(${n}, 1fr)` }}
              >
                {/* Row label */}
                <div className="flex items-center gap-2 px-4 py-3.5">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="text-xs font-medium text-ink">{label}</span>
                </div>

                {/* Score cells per district */}
                {selectedRanked.map((r, i) => {
                  const score = r?.skorPerIndikator[id] ?? 0;
                  const displayVal = Math.round(score / 10);
                  const isBest = score === maxScore;
                  return (
                    <div
                      key={selectedDistricts[i]?.id ?? i}
                      className={cn(
                        "flex flex-col justify-center gap-1.5 border-l border-line px-4 py-3",
                        isBest ? "bg-sawah/[0.04]" : ""
                      )}
                    >
                      <div className="h-2 w-full overflow-hidden rounded-full bg-line">
                        <div
                          className={cn(
                            "h-full rounded-full motion-safe:transition-all motion-safe:duration-500",
                            isBest ? "bg-sawah" : "bg-pesisir/50"
                          )}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "font-mono text-sm font-bold tabular-nums",
                            isBest ? "text-sawah" : "text-ink"
                          )}
                        >
                          {displayVal}/10
                        </span>
                        {isBest && (
                          <span className="rounded-full bg-sawah/10 px-1.5 py-px text-[9px] font-semibold text-sawah">
                            ▲
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Data Snapshot Grid ────────────────────────────────────────────────────────
function DataSnapshotGrid({ selectedDistricts }: { selectedDistricts: District[] }) {
  const facts: {
    icon: React.ElementType;
    label: string;
    getValue: (d: District) => string;
  }[] = [
    { icon: Wallet, label: "UMK / Upah Minimum", getValue: (d) => `${formatRupiah(d.umk)}/bln` },
    { icon: Building2, label: "Coworking Spaces", getValue: (d) => `${d.coworkingCount} lokasi` },
    { icon: Wifi, label: "Kecepatan Internet", getValue: (d) => `~${d.internetMbps} Mbps` },
    { icon: Home, label: "Tipe Wilayah", getValue: (d) => d.tipe },
  ];

  return (
    <div>
      <SectionLabel icon={Wallet} label="Data Mentah" />
      <div className={cn("grid gap-4", colClass(selectedDistricts.length))}>
        {selectedDistricts.map((d) => {
          const visual = getDistrictVisual(d.id);
          return (
            <div
              key={d.id}
              className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)]"
            >
              {/* Mini header */}
              <div
                className="flex items-center gap-2.5 px-4 py-3"
                style={{
                  background: `linear-gradient(90deg, ${visual.gradientFrom}22, transparent)`,
                  borderBottom: `2px solid ${visual.gradientFrom}33`,
                }}
              >
                <span className="text-xl" aria-hidden="true">
                  {visual.emoji}
                </span>
                <span className="text-sm font-semibold text-ink">{shortName(d.nama)}</span>
              </div>

              {/* Facts */}
              <div className="divide-y divide-line">
                {facts.map(({ icon: FactIcon, label, getValue }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FactIcon className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-xs">{label}</span>
                    </div>
                    <span className="font-mono text-sm font-semibold text-ink">
                      {getValue(d)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Karakteristik Section ─────────────────────────────────────────────────────
function KarakteristikSection({ selectedDistricts }: { selectedDistricts: District[] }) {
  return (
    <div>
      <SectionLabel icon={MapPin} label="Karakteristik Distrik" />
      <div className={cn("grid gap-4", colClass(selectedDistricts.length))}>
        {selectedDistricts.map((d) => {
          const visual = getDistrictVisual(d.id);
          return (
            <div
              key={d.id}
              className="rounded-xl border border-line bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]"
            >
              <div className="mb-2.5 flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">
                  {visual.emoji}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {shortName(d.nama)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {d.ringkasanKarakteristik}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Why This Match Section ────────────────────────────────────────────────────
function WhySection({
  selectedDistricts,
  selectedRanked,
}: {
  selectedDistricts: District[];
  selectedRanked: RankedDistrict[];
}) {
  return (
    <div>
      <SectionLabel icon={Star} label="Mengapa Cocok untuk Anda" color="sawah" />
      <div className={cn("grid gap-4", colClass(selectedDistricts.length))}>
        {selectedDistricts.map((d, i) => {
          const r = selectedRanked[i];
          if (!r) return null;
          const visual = getDistrictVisual(d.id);
          return (
            <div
              key={d.id}
              className="rounded-xl border border-sawah/25 bg-sawah/[0.04] p-5"
            >
              <div className="mb-2.5 flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">
                  {visual.emoji}
                </span>
                <span className="text-xs font-semibold text-sawah">{shortName(d.nama)}</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {generateWhyText(r, d.nama)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Section Label Helper ──────────────────────────────────────────────────────
function SectionLabel({
  icon: Icon,
  label,
  color = "pesisir",
}: {
  icon: React.ElementType;
  label: string;
  color?: "pesisir" | "sawah";
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon
        className={cn(
          "h-4 w-4",
          color === "sawah" ? "text-sawah" : "text-pesisir"
        )}
      />
      <h2 className="text-sm font-semibold text-ink">{label}</h2>
    </div>
  );
}

// ── Main Compare Content ──────────────────────────────────────────────────────
function CompareContent() {
  const params = useSearchParams();
  const router = useRouter();

  const districtParam = params.get("districts") ?? "";
  const selectedIds = districtParam
    .split(",")
    .filter(Boolean)
    .slice(0, 3);

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
  const backHref = hasQuizContext
    ? `/result${quizQuery}`
    : "/result";

  const { districts, scores, loading, error } = useDistricts();

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className={cn("grid gap-4", colClass(selectedIds.length || 2))}>
          {(selectedIds.length ? selectedIds : ["a", "b"]).map((id) => (
            <div key={id} className="h-44 animate-pulse rounded-2xl bg-line" />
          ))}
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-xl border border-line bg-white" />
        ))}
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="mb-4 text-error">Koneksi terputus. Coba lagi?</p>
        <Button
          className="gap-2 bg-sawah text-white hover:bg-sawah/90"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4" />
          Coba Lagi
        </Button>
      </div>
    );
  }

  // ── Guard: need at least 2 districts ──────────────────────────────────────
  if (selectedIds.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="mb-4 text-muted-foreground">
          Minimal 2 distrik harus dipilih untuk perbandingan.
        </p>
        <Link href={backHref}>
          <Button className="gap-2 bg-sawah text-white hover:bg-sawah/90">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Hasil
          </Button>
        </Link>
      </div>
    );
  }

  // ── Build data ─────────────────────────────────────────────────────────────
  const input: QuizInput | null = hasQuizContext
    ? {
        personaId,
        budget,
        internetPriority: internet,
        communityPriority: community,
        environmentPreference: environment,
      }
    : null;

  const allRanked = input ? rankDistricts(input, districts, scores) : [];
  const rankedMap = Object.fromEntries(allRanked.map((r) => [r.districtId, r]));
  const districtMap = Object.fromEntries(districts.map((d) => [d.id, d]));

  const selectedDistricts = selectedIds
    .map((id) => districtMap[id])
    .filter((d): d is District => !!d);

  const selectedRanked = selectedIds
    .map((id) => rankedMap[id])
    .filter((r): r is RankedDistrict => !!r);

  if (selectedDistricts.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="mb-4 text-muted-foreground">Data distrik tidak ditemukan.</p>
        <Link href={backHref}>
          <Button className="gap-2 bg-sawah text-white hover:bg-sawah/90">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Hasil
          </Button>
        </Link>
      </div>
    );
  }

  const bestId = allRanked[0]?.districtId ?? "";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* 1. District header cards */}
      <DistrictHeaderCards
        selectedDistricts={selectedDistricts}
        selectedRanked={selectedRanked}
        bestId={bestId}
      />

      {/* 2. Indicator comparison, compact table, columns = districts */}
      <IndicatorComparisonTable
        selectedDistricts={selectedDistricts}
        selectedRanked={selectedRanked}
      />

      {/* 3. Raw data snapshot */}
      <DataSnapshotGrid selectedDistricts={selectedDistricts} />

      {/* 4. Karakteristik */}
      <KarakteristikSection selectedDistricts={selectedDistricts} />

      {/* 5. Why This Match (only if quiz context available) */}
      {hasQuizContext && selectedRanked.length === selectedDistricts.length && (
        <WhySection
          selectedDistricts={selectedDistricts}
          selectedRanked={selectedRanked}
        />
      )}

      {/* 6. Action buttons */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Pelajari Lebih Lanjut
        </p>
        <div
          className={cn(
            "grid gap-3",
            selectedDistricts.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-3"
          )}
        >
          {selectedDistricts.map((d) => (
            <Link key={d.id} href={`/district/${d.id}${quizQuery}`}>
              <Button className="w-full gap-2 bg-sawah text-white hover:bg-sawah/90 min-h-[44px]">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">Detail {shortName(d.nama)}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* 7. Back button */}
      <div className="flex justify-center pb-4">
        <Link href={backHref}>
          <Button
            variant="outline"
            className="gap-2 border-line text-muted-foreground hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Hasil
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ComparePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 sm:py-10">
        {/* Page header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Perbandingan Distrik
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Analisis side-by-side untuk membantu keputusan akhir Anda
          </p>
        </div>

        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-44 animate-pulse rounded-2xl bg-line" />
                <div className="h-44 animate-pulse rounded-2xl bg-line" />
              </div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-xl border border-line bg-white" />
              ))}
            </div>
          }
        >
          <CompareContent />
        </Suspense>
      </div>
    </div>
  );
}
