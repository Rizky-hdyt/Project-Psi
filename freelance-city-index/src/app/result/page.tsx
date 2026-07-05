"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  RefreshCw,
  Users,
  Star,
  Activity,
  CalendarDays,
  ArrowRight,
  MapPin,
  BarChart3,
  Crown,
} from "lucide-react";
import { getDistrictVisual } from "@/data/districts.visuals";
import { ScoreComparisonTable, scoreColor } from "@/components/result/ScoreComparisonTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { PillNavbar } from "@/components/shared/PillNavbar";
import { AssistantDock } from "@/components/shared/AssistantDock";
import type { AssistantContext } from "@/lib/assistant/qaBank";
import { EmptyState } from "@/components/shared/EmptyState";
import { RelevanceSurvey } from "@/components/shared/RelevanceSurvey";
import { WhyThisMatch } from "@/components/shared/WhyThisMatch";
import { rankDistricts } from "@/lib/scoring/rank";
import { useDistricts } from "@/hooks/useDistricts";
import { DistrictSwatch } from "@/components/shared/DistrictSwatch";
import { AmbientBackground } from "@/components/shared/AmbientBackground";
import { cn } from "@/lib/utils";
import type { QuizInput } from "@/types/quiz";
import type { District, DistrictScore } from "@/types/district";
import type { RankedDistrict } from "@/types/recommendation";

const PERSONA_NAMES: Record<string, string> = {
  "tech-professional": "Tech Professional",
  "creative-professional": "Creative Professional",
  "student-fresh-graduate": "Student & Fresh Graduate",
  "digital-nomad": "Digital Nomad",
};

function formatDateID(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
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

  function closeAndReset() {
    setSelected([]);
    onClose();
  }

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
    closeAndReset();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) closeAndReset(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-ink">
            <BarChart3 className="h-4 w-4 text-sawah" />
            Bandingkan Distrik
          </DialogTitle>
          <DialogDescription>
            Pilih 2 sampai 3 distrik untuk dibandingkan secara detail. Skor berdasarkan preferensi quiz Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1 py-2">
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
                  "flex w-full items-center gap-3 rounded-[var(--radius-sm)] border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-sawah bg-sawah/5"
                    : isDisabled
                      ? "cursor-not-allowed border-line opacity-40"
                      : "border-line hover:border-ink/30"
                )}
              >
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border-2 transition-colors",
                    isSelected ? "border-sawah bg-sawah text-white" : "border-line bg-white"
                  )}
                >
                  {isSelected && (
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                <DistrictSwatch districtId={r.districtId} size="sm" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink">{d.nama}</span>
                    {r.rank === 1 && (
                      <span className="text-[10px] font-medium text-sawah">Best</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">Rank #{r.rank}</span>
                </div>

                <span className="font-mono text-lg font-bold tabular-nums text-ink">
                  {r.skorTotal.toFixed(1)}
                </span>
              </button>
            );
          })}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={closeAndReset} className="border-line">
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

// ── Hero: foto distrik terbaik + headline + stat row + kartu Best Match ──────
function ResultHero({
  personaLabel,
  ranked,
  districts,
  scores,
  resultUrl,
  onCompare,
  onRetakeQuiz,
}: {
  personaLabel: string;
  ranked: RankedDistrict[];
  districts: District[];
  scores: DistrictScore[];
  resultUrl: string;
  onCompare: () => void;
  onRetakeQuiz: () => void;
}) {
  const districtMap = Object.fromEntries(districts.map((d) => [d.id, d]));
  const best = ranked[0];
  const bestDistrict = districtMap[best.districtId];
  const heroPhoto = getDistrictVisual(best.districtId).imageUrl;
  const avgScore = ranked.reduce((sum, r) => sum + r.skorTotal, 0) / ranked.length;
  const latestUpdate = scores.reduce(
    (latest, s) => (s.updatedAt > latest ? s.updatedAt : latest),
    scores[0]?.updatedAt ?? new Date().toISOString()
  );

  // Semua ikon stat pakai satu warna hijau (bukan per-kartu custom),
  // sesuai .stat .ic di hasil-rekomendasi.html
  const STATS = [
    { icon: Users, value: String(ranked.length), label: "Distrik Dievaluasi di DIY" },
    { icon: Star, value: best.skorTotal.toFixed(1), label: `Skor Tertinggi ${bestDistrict.nama}` },
    { icon: Activity, value: avgScore.toFixed(1), label: "Skor Rata-rata dari 5 distrik" },
    { icon: CalendarDays, value: formatDateID(latestUpdate), label: "Terakhir Diperbarui" },
  ];

  return (
    <section className="relative isolate mt-3.5 overflow-hidden rounded-[22px]">
      <div className="relative px-4 pb-6 pt-6 sm:px-7 sm:pb-7 sm:pt-7">
        <Image src={heroPhoto} alt="" fill sizes="100vw" className="-z-20 object-cover" priority />
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(115deg, rgba(246,245,250,0.94) 0%, rgba(246,245,250,0.6) 45%, rgba(246,245,250,0.25) 75%, rgba(246,245,250,0.5) 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative">
          {/* Utility row — Bandingkan/Ulangi, tidak ada di referensi tapi fitur tetap dipertahankan */}
          <div className="mb-4 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCompare}
              className="gap-1.5 border-line bg-white text-muted-foreground hover:text-ink"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Bandingkan
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRetakeQuiz}
              className="gap-1.5 border-line bg-white text-muted-foreground hover:text-ink"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Ulangi Quiz
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            {/* Kolom kiri: headline + stat row */}
            <div>
              <p className="text-xs font-semibold text-sawah">Hasil Rekomendasi</p>
              <h1 className="mt-1.5 max-w-md text-3xl font-bold leading-[1.15] tracking-tight text-ink sm:text-4xl">
                Distrik Terbaik untuk Anda
              </h1>
              <p className="mt-3 text-sm text-ink/70">Berdasarkan profil Anda sebagai</p>
              <span className="mt-2 inline-flex rounded-full border border-sawah/25 bg-sawah/10 px-3 py-1 text-xs font-medium text-sawah">
                {personaLabel}
              </span>

              <div className="mt-10 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {STATS.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="rounded-lg border border-line bg-white/90 p-1.5">
                    <span className="mb-1 flex h-4 w-4 items-center justify-center rounded bg-positive-bg">
                      <Icon className="h-2 w-2 text-positive" />
                    </span>
                    <p className="font-mono text-[11px] font-bold text-ink">{value}</p>
                    <p className="mt-0.5 text-[8px] leading-snug text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Kolom kanan: kartu Best Match */}
            <div className="rounded-2xl border border-line bg-white/95 p-4 shadow-[0_10px_26px_rgba(30,35,48,0.10)] sm:p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-amber-600">
                    <Crown className="h-3 w-3" />
                    Best Match
                  </span>
                  <h2 className="mt-1.5 text-lg font-bold tracking-tight text-ink">{bestDistrict.nama}</h2>
                  <p className="mt-2 text-[11px] text-muted-foreground">Skor Keseluruhan</p>
                  <p className="font-mono text-2xl font-bold text-positive">
                    {best.skorTotal.toFixed(1)}
                    <span className="ml-0.5 text-xs font-normal text-muted-foreground">/100</span>
                  </p>
                  <div className="mt-1.5 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-1 text-[11px] text-muted-foreground">Best Match</span>
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 text-xs font-semibold text-ink">Why This Match?</p>
                  <WhyThisMatch ranked={best} districtNama={bestDistrict.nama} />
                </div>
              </div>

              <Link href={`/district/${bestDistrict.id}?${resultUrl.split("?")[1] ?? ""}`}>
                <Button className="mt-4 w-full gap-1.5 bg-sawah text-white hover:bg-sawah/90 min-h-10 text-xs" size="sm">
                  <MapPin className="h-3.5 w-3.5" />
                  Lihat Detail Distrik
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Rank #1 = amber, rank #3 = orange, sisanya ink — pola persis di
// hasil-rekomendasi.html (.rank-card.first, :nth-child(3) .rank-num)
function rankBadgeColor(rank: number) {
  if (rank === 1) return "#F59E0B";
  if (rank === 3) return "#F97316";
  return "var(--ink)";
}

// ── Ranking grid — 5 kartu foto, semua rank ──────────────────────────────────
function RankingGrid({
  ranked,
  districts,
  resultUrl,
}: {
  ranked: RankedDistrict[];
  districts: District[];
  resultUrl: string;
}) {
  const districtMap = Object.fromEntries(districts.map((d) => [d.id, d]));
  const qs = resultUrl.split("?")[1] ?? "";

  return (
    <section className="mt-3.5 rounded-[22px] bg-white p-4 shadow-[0_4px_14px_rgba(30,35,48,0.04)] sm:p-5">
      <p className="mb-3.5 text-sm font-extrabold text-ink">Ranking 5 Distrik di DIY</p>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
        {ranked.map((r) => {
          const d = districtMap[r.districtId];
          if (!d) return null;
          const photo = getDistrictVisual(d.id).imageUrl;
          const isFirst = r.rank === 1;
          return (
            <Link
              key={r.districtId}
              href={`/district/${d.id}?${qs}`}
              className={cn(
                "group overflow-hidden rounded-2xl border bg-white transition-all duration-[180ms] hover:-translate-y-1 hover:shadow-[0_12px_26px_rgba(30,35,48,0.12)]",
                isFirst ? "border-2 border-amber-500 shadow-[0_8px_22px_rgba(245,158,11,0.22)]" : "border-line"
              )}
            >
              <div className="relative aspect-[11/6]">
                <Image
                  src={photo}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className="absolute left-2.5 top-2.5 flex h-[26px] w-[26px] items-center justify-center rounded-full text-xs font-extrabold text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                  style={{ backgroundColor: rankBadgeColor(r.rank) }}
                >
                  {r.rank}
                </span>
              </div>
              <div className="p-3.5">
                <p className="truncate text-[15px] font-extrabold tracking-tight text-ink">{d.nama}</p>
                <p className="mt-0.5 text-[10.5px] font-semibold text-muted-foreground">Skor Keseluruhan</p>
                <p className="mt-1.5 font-mono text-xl font-extrabold" style={{ color: scoreColor(r.skorTotal) }}>
                  {r.skorTotal.toFixed(1)}
                  <span className="ml-0.5 text-xs font-semibold text-muted-foreground">/100</span>
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
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
      <div className="p-4">
        <div className="h-72 animate-pulse rounded-2xl bg-muted" />
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

  const resultUrl = `/result?persona=${personaId}&budget=${budget}&internet=${internet}&community=${community}&environment=${environment}`;
  const quizParams = `persona=${personaId}&budget=${budget}&internet=${internet}&community=${community}&environment=${environment}`;
  const personaLabel = PERSONA_NAMES[personaId] ?? personaId;

  const bestDistrict = districts.find((d) => d.id === ranked[0]?.districtId);
  const assistantCtx: AssistantContext | null = bestDistrict
    ? {
        personaLabel,
        bestName: bestDistrict.nama,
        bestScore: ranked[0].skorTotal,
        isBelowUMK: !!ranked[0].isBelowUMK,
      }
    : null;

  return (
    <>
      <ResultHero
        personaLabel={personaLabel}
        ranked={ranked}
        districts={districts}
        scores={scores}
        resultUrl={resultUrl}
        onCompare={() => setCompareOpen(true)}
        onRetakeQuiz={() => router.push("/quiz")}
      />

      <RankingGrid ranked={ranked} districts={districts} resultUrl={resultUrl} />

      <div className="mt-3.5 rounded-[22px] bg-white p-4 shadow-[0_4px_14px_rgba(30,35,48,0.04)] sm:p-5">
        <ScoreComparisonTable ranked={ranked} districts={districts} />
      </div>

      {/* Survey popup, fixed bottom-left, muncul otomatis setelah 3.5 detik —
          sengaja di kiri supaya tidak numpuk dengan tombol FCI Assistant di
          kanan-bawah. */}
      <RelevanceSurvey personaId={personaId} />

      {/* FCI Assistant — di layar sempit tombol navigasi ke /assistant, di
          layar lebar (lg:+) tombol membuka panel docked di kanan halaman
          (overlay, bukan reflow) supaya layout Result page yang sudah dibuat
          semirip mungkin dengan HTML tetap utuh. Tombol trigger di
          kanan-bawah (bottom-6 right-6). */}
      <AssistantDock href={`/assistant?${quizParams}`} ctx={assistantCtx} />

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
// Struktur "page frame" bulat (rounded-[26px], padding kecil) berisi navbar
// pill + hero + ranking + tabel — meniru persis .page di hasil-rekomendasi.html.
export default function ResultPage() {
  return (
    <div className="min-h-screen p-2 sm:p-4">
      <AmbientBackground />
      <div className="mx-auto max-w-[1220px] rounded-[26px] border border-white/50 bg-paper/70 p-2.5 shadow-xl backdrop-blur-2xl sm:p-3.5">
        <PillNavbar />
        <Suspense
          fallback={
            <div className="p-4">
              <div className="h-72 animate-pulse rounded-2xl bg-muted" />
            </div>
          }
        >
          <ResultContent />
        </Suspense>
      </div>
    </div>
  );
}
