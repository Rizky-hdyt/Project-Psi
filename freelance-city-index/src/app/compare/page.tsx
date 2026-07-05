"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Wifi,
  Wallet,
  Users,
  Leaf,
  Crown,
  MapPin,
  RefreshCw,
  Building2,
  Home,
  ClipboardList,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillNavbar } from "@/components/shared/PillNavbar";
import { DistrictSwatch } from "@/components/shared/DistrictSwatch";
import { rankDistricts } from "@/lib/scoring/rank";
import { generateWhyText } from "@/lib/scoring/whyThisMatch";
import { useDistricts } from "@/hooks/useDistricts";
import { AmbientBackground } from "@/components/shared/AmbientBackground";
import { cn } from "@/lib/utils";
import type { QuizInput } from "@/types/quiz";
import type { IndicatorId, RankedDistrict } from "@/types/recommendation";
import type { District } from "@/types/district";

// ── Constants ────────────────────────────────────────────────────────────────
// Warna soft ikon "sisi" kartu — mengikuti pola side-a (hijau)/side-b (biru)
// di bandingkan-distrik.html, di-siklus kalau ada 3 distrik dibandingkan.
const SIDE_ICON_BG = ["#E3F5EA", "#E3EFFF", "#FDECE1"];

const INDICATORS: {
  id: IndicatorId;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "internet", label: "Internet", icon: Wifi },
  { id: "cost", label: "Biaya Hidup", icon: Wallet },
  { id: "community", label: "Komunitas", icon: Users },
  { id: "environment", label: "Lingkungan Kerja", icon: Leaf },
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

// ── Hero match cards (mengikuti .hero-card di bandingkan-distrik.html) ───────
function HeroMatchCards({
  selectedDistricts,
  selectedRanked,
  bestId,
}: {
  selectedDistricts: District[];
  selectedRanked: RankedDistrict[];
  bestId: string;
}) {
  return (
    <div className={cn("grid gap-3.5", colClass(selectedDistricts.length))}>
      {selectedDistricts.map((d, i) => {
        const r = selectedRanked[i];
        const isBest = d.id === bestId;
        if (!r) return null;
        return (
          <div
            key={d.id}
            className={cn(
              "relative flex items-center gap-4 rounded-[22px] border-2 bg-white p-4 shadow-[0_4px_14px_rgba(30,35,48,0.04)] sm:p-5",
              isBest ? "border-[#F59E0B] shadow-[0_8px_24px_rgba(245,158,11,0.18)]" : "border-transparent"
            )}
          >
            {isBest && (
              <span className="absolute right-3.5 top-3.5 inline-flex items-center gap-1 rounded-full border border-[#F4E2AC] bg-[#FFF7E0] px-3 py-1 text-[10.5px] font-extrabold text-[#B07C14]">
                <Crown className="h-3 w-3" /> Best Match
              </span>
            )}

            <div
              className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[15px]"
              style={{ backgroundColor: SIDE_ICON_BG[i % SIDE_ICON_BG.length] }}
            >
              <DistrictSwatch districtId={d.id} size="md" />
            </div>

            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
                Rank #{r.rank}
              </span>
              <p className="truncate text-lg font-extrabold tracking-tight text-ink">{d.nama}</p>
            </div>

            <div className={cn("ml-auto shrink-0 pr-1 text-right", isBest && "pt-6")}>
              <div className="flex items-baseline justify-end gap-1">
                <span className="font-mono text-3xl font-extrabold tracking-tight tabular-nums text-ink sm:text-[36px]">
                  {(r.skorTotal / 10).toFixed(1)}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">/10</span>
              </div>
              <p className="mt-0.5 text-[10.5px] font-semibold text-muted-foreground">Match Score</p>
              {r.isBelowUMK && (
                <p className="mt-1 text-[10.5px] font-semibold text-warning">Di bawah UMK</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Section card wrapper (mengikuti .section-card) ───────────────────────────
function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3.5 rounded-[22px] bg-white p-4 shadow-[0_4px_14px_rgba(30,35,48,0.04)] sm:p-5">
      <h2 className="mb-3.5 flex items-center gap-2 text-sm font-extrabold text-ink">
        <span className="grid h-[26px] w-[26px] place-items-center rounded-lg bg-[#E3F5EA] text-[#1A9B4B]">
          <Icon className="h-3.5 w-3.5" />
        </span>
        {title}
      </h2>
      {children}
    </div>
  );
}

// ── Indicator Comparison Table ────────────────────────────────────────────────
function IndicatorComparisonTable({
  selectedDistricts,
  selectedRanked,
}: {
  selectedDistricts: District[];
  selectedRanked: RankedDistrict[];
}) {
  const n = selectedDistricts.length;

  return (
    <SectionCard icon={BarChart3} title="Perbandingan Indikator">
      <div className="overflow-x-auto">
        <div style={{ minWidth: n === 3 ? "560px" : "380px" }}>
          <div
            className="grid border-b border-line pb-3"
            style={{ gridTemplateColumns: `130px repeat(${n}, 1fr)`, columnGap: "14px" }}
          >
            <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-muted-foreground">
              Indikator
            </div>
            {selectedDistricts.map((d) => (
              <div key={d.id} className="flex items-center gap-2 text-[13px] font-extrabold text-ink">
                <DistrictSwatch districtId={d.id} size="sm" />
                <span className="truncate">{shortName(d.nama)}</span>
              </div>
            ))}
          </div>

          {INDICATORS.map(({ id, label, icon: Icon }, rowIdx) => {
            const scores = selectedRanked.map((r) => r?.skorPerIndikator[id] ?? 0);
            const maxScore = Math.max(...scores);
            return (
              <div
                key={id}
                className={cn(
                  "grid items-center py-3",
                  rowIdx < INDICATORS.length - 1 ? "border-b border-[#f2f3f7]" : ""
                )}
                style={{ gridTemplateColumns: `130px repeat(${n}, 1fr)`, columnGap: "14px" }}
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[9px] bg-[#f4f5f9]">
                    <Icon className="h-3.5 w-3.5 text-ink" />
                  </span>
                  <span className="text-[12.5px] font-bold leading-tight text-ink">{label}</span>
                </div>

                {selectedRanked.map((r, i) => {
                  const score = r?.skorPerIndikator[id] ?? 0;
                  const displayVal = Math.round(score / 10);
                  const isBest = score === maxScore;
                  return (
                    <div key={selectedDistricts[i]?.id ?? i} className="flex flex-col gap-1.5">
                      <div className="h-[7px] w-full overflow-hidden rounded-full bg-[#eceef3]">
                        <div
                          className="h-full rounded-full transition-[width] duration-700"
                          style={{
                            width: `${score}%`,
                            background: isBest ? "linear-gradient(90deg,#0f6f3c,#7cc244)" : "#c3c9d2",
                          }}
                        />
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 font-mono text-xs font-extrabold tabular-nums",
                          isBest ? "text-[#1A9B4B]" : "text-muted-foreground"
                        )}
                      >
                        {displayVal}/10
                        {isBest && (
                          <span className="rounded-[5px] bg-[#E3F5EA] px-1.5 py-0.5 text-[9px] text-[#1A9B4B]">
                            &#9650;
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
    </SectionCard>
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
    <SectionCard icon={ClipboardList} title="Data Mentah">
      <div className={cn("grid gap-3.5", colClass(selectedDistricts.length))}>
        {selectedDistricts.map((d) => (
          <div key={d.id} className="overflow-hidden rounded-2xl border border-line">
            <div className="flex items-center gap-2.5 border-b border-line bg-[#fafafc] px-4 py-3 text-[13px] font-extrabold text-ink">
              <DistrictSwatch districtId={d.id} size="sm" />
              {d.nama}
            </div>
            {facts.map(({ icon: FactIcon, label, getValue }, idx) => (
              <div
                key={label}
                className={cn(
                  "flex items-center justify-between gap-3 px-4 py-3",
                  idx < facts.length - 1 ? "border-b border-[#f2f3f7]" : ""
                )}
              >
                <div className="flex items-center gap-2.5 text-[11.5px] font-semibold text-muted-foreground">
                  <span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-lg bg-[#f4f5f9]">
                    <FactIcon className="h-3 w-3 text-ink" />
                  </span>
                  {label}
                </div>
                <span className="whitespace-nowrap font-mono text-[12.5px] font-extrabold tabular-nums text-ink">
                  {getValue(d)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ── Text card grid (Karakteristik & Why) ─────────────────────────────────────
function TextCardGrid({
  icon,
  title,
  selectedDistricts,
  texts,
}: {
  icon: React.ElementType;
  title: string;
  selectedDistricts: District[];
  texts: string[];
}) {
  return (
    <SectionCard icon={icon} title={title}>
      <div className={cn("grid gap-3.5", colClass(selectedDistricts.length))}>
        {selectedDistricts.map((d, i) => (
          <div key={d.id} className="rounded-2xl border border-line bg-white p-3.5 sm:p-4">
            <div className="mb-2 flex items-center gap-2.5 text-[13px] font-extrabold text-ink">
              <DistrictSwatch districtId={d.id} size="sm" />
              {d.nama}
            </div>
            <p className="text-[12.5px] leading-[1.7] text-[#4a5060]">{texts[i]}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ── Main Compare Content ──────────────────────────────────────────────────────
function CompareContent() {
  const params = useSearchParams();

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
  const backHref = hasQuizContext ? `/result${quizQuery}` : "/result";

  const { districts, scores, loading, error } = useDistricts();

  const header = (
    <div className="px-2 pb-1 pt-4 sm:px-3">
      <Link
        href={backHref}
        className="mb-3 inline-flex items-center gap-2 text-[11.5px] font-semibold text-muted-foreground hover:text-ink"
      >
        Hasil Rekomendasi
        <span className="text-[#a8adb8]">&rsaquo;</span>
        <span className="rounded-full border border-line bg-white px-3 py-1 font-bold text-ink">
          Bandingkan Distrik
        </span>
      </Link>
      <h1 className="text-[26px] font-extrabold tracking-tight text-ink sm:text-[28px]">Bandingkan Distrik</h1>
      <p className="mt-1.5 max-w-[500px] text-[13px] leading-[1.6] text-muted-foreground">
        Lihat perbedaan skor, data, dan karakter dua atau tiga distrik sekaligus untuk membantu keputusan akhir Anda.
      </p>
    </div>
  );

  if (loading) {
    return (
      <>
        {header}
        <div className="space-y-3.5 px-2 pb-2 sm:px-3">
          <div className={cn("grid gap-3.5", colClass(selectedIds.length || 2))}>
            {(selectedIds.length ? selectedIds : ["a", "b"]).map((id) => (
              <div key={id} className="h-28 animate-pulse rounded-[22px] bg-muted" />
            ))}
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-[22px] bg-muted" />
          ))}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {header}
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-4 text-error">Koneksi terputus. Coba lagi?</p>
          <Button className="gap-2 rounded-full bg-sawah text-white hover:bg-sawah/90" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </Button>
        </div>
      </>
    );
  }

  if (selectedIds.length < 2) {
    return (
      <>
        {header}
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-4 text-muted-foreground">Minimal 2 distrik harus dipilih untuk perbandingan.</p>
          <Link href={backHref}>
            <Button className="gap-2 rounded-full bg-sawah text-white hover:bg-sawah/90">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Hasil
            </Button>
          </Link>
        </div>
      </>
    );
  }

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
      <>
        {header}
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-4 text-muted-foreground">Data distrik tidak ditemukan.</p>
          <Link href={backHref}>
            <Button className="gap-2 rounded-full bg-sawah text-white hover:bg-sawah/90">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Hasil
            </Button>
          </Link>
        </div>
      </>
    );
  }

  const bestId = allRanked[0]?.districtId ?? "";

  return (
    <>
      {header}
      <div className="px-2 pb-2 sm:px-3">
      <HeroMatchCards selectedDistricts={selectedDistricts} selectedRanked={selectedRanked} bestId={bestId} />

      <IndicatorComparisonTable selectedDistricts={selectedDistricts} selectedRanked={selectedRanked} />

      <DataSnapshotGrid selectedDistricts={selectedDistricts} />

      <TextCardGrid
        icon={MapPin}
        title="Karakteristik Distrik"
        selectedDistricts={selectedDistricts}
        texts={selectedDistricts.map((d) => d.ringkasanKarakteristik)}
      />

      {hasQuizContext && selectedRanked.length === selectedDistricts.length && (
        <TextCardGrid
          icon={Sparkles}
          title="Mengapa Cocok untuk Anda"
          selectedDistricts={selectedDistricts}
          texts={selectedDistricts.map((d, i) => generateWhyText(selectedRanked[i], d.nama))}
        />
      )}

      <div className="mt-3.5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {selectedDistricts.map((d) => (
          <Link key={d.id} href={`/district/${d.id}${quizQuery}`} className="w-full sm:w-auto">
            <Button className="min-h-11 w-full gap-2 rounded-full bg-sawah text-white hover:bg-sawah/90 sm:w-auto">
              <MapPin className="h-4 w-4 shrink-0" />
              Detail {shortName(d.nama)}
            </Button>
          </Link>
        ))}
        <Link href={backHref} className="w-full sm:w-auto">
          <Button variant="outline" className="min-h-11 w-full gap-2 rounded-full border-line text-muted-foreground hover:text-ink sm:w-auto">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Hasil
          </Button>
        </Link>
      </div>
      </div>
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
// Struktur "page frame" bulat meniru .page di bandingkan-distrik.html — konsisten
// dengan Result & District Detail (§0.2: satu identitas visual di seluruh app).
// Selector dropdown A/B/swap dari HTML TIDAK dipakai: pemilihan distrik sudah
// terjadi di CompareDialog pada /result (mendukung 2-3 distrik), jadi breadcrumb
// + judul mengikuti gaya HTML sementara data mengalir dari query param.
export default function ComparePage() {
  return (
    <div className="min-h-screen p-2 sm:p-4">
      <AmbientBackground />
      <div className="mx-auto max-w-[1220px] rounded-[26px] border border-white/50 bg-paper/70 p-2.5 shadow-xl backdrop-blur-2xl sm:p-3.5">
        <PillNavbar />

        <Suspense
          fallback={
            <div className="space-y-3.5 px-2 pb-2 pt-4 sm:px-3">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="h-28 animate-pulse rounded-[22px] bg-muted" />
                <div className="h-28 animate-pulse rounded-[22px] bg-muted" />
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-[22px] bg-muted" />
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
