"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Wifi, Wallet, Users, Leaf, Crown, Star, Building2, ChevronRight,
  MapPin, ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillNavbar } from "@/components/shared/PillNavbar";
import { WhyThisMatch } from "@/components/shared/WhyThisMatch";
import { SuggestedPlaces } from "@/components/district/SuggestedPlaces";
import { rankDistricts } from "@/lib/scoring/rank";
import { rankSubDistricts } from "@/lib/scoring/rankSubDistricts";
import { computeAdjustedWeights } from "@/lib/scoring/normalize";
import { useDistricts } from "@/hooks/useDistricts";
import { getDistrictVisual } from "@/data/districts.visuals";
import { AmbientBackground } from "@/components/shared/AmbientBackground";
import type { QuizInput } from "@/types/quiz";
import type { IndicatorId } from "@/types/recommendation";

const INDICATOR_CARDS: { id: IndicatorId; label: string; icon: React.ElementType }[] = [
  { id: "internet", label: "Internet", icon: Wifi },
  { id: "cost", label: "Cost of Living", icon: Wallet },
  { id: "community", label: "Community", icon: Users },
  { id: "environment", label: "Environment", icon: Leaf },
];

// Ikon & warna per indikator di panel kontribusi — meniru ic-blue/ic-amber/
// ic-orange/ic-leaf di detail-distrik.html
const CONTRIB_STYLE: Record<IndicatorId, { icon: React.ElementType; bg: string; color: string }> = {
  internet:    { icon: Wifi,   bg: "#E3EFFF", color: "#3B82F6" },
  cost:        { icon: Wallet, bg: "#FDEED3", color: "#F59E0B" },
  community:   { icon: Users,  bg: "#FFE9DB", color: "#F97316" },
  environment: { icon: Leaf,   bg: "#E3F5EA", color: "#1A9B4B" },
};

const CONTRIB_DESC = [
  "memberikan kontribusi terbesar",
  "memberikan kontribusi yang signifikan",
  "turut mendukung skor akhir",
  "melengkapi keseluruhan penilaian",
];

export default function DistrictDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const params = useSearchParams();
  const { districts, scores, subDistricts, subDistrictScores, loading, error } = useDistricts();
  const [expandedSubDistrict, setExpandedSubDistrict] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper p-4">
        <div className="mx-auto max-w-[1220px] space-y-4">
          <div className="h-14 w-full animate-pulse rounded-full bg-muted" />
          <div className="h-80 w-full animate-pulse rounded-[22px] bg-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-error">Koneksi terputus. Coba muat ulang halaman.</p>
        <Button onClick={() => window.location.reload()} className="gap-2 bg-sawah text-white hover:bg-sawah/90">
          Coba Lagi
        </Button>
      </div>
    );
  }

  const district = districts.find((d) => d.id === id);

  if (!district) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Distrik tidak ditemukan.</p>
        <Link href="/result"><Button variant="outline">Kembali ke Hasil</Button></Link>
      </div>
    );
  }

  const personaId = (params.get("persona") ?? "tech-professional") as QuizInput["personaId"];
  const input: QuizInput = {
    personaId,
    budget:                Number(params.get("budget") ?? 4_000_000),
    internetPriority:      (params.get("internet") ?? "medium") as QuizInput["internetPriority"],
    communityPriority:     (params.get("community") ?? "medium") as QuizInput["communityPriority"],
    environmentPreference: (params.get("environment") ?? "flexible") as QuizInput["environmentPreference"],
  };

  const ranked      = rankDistricts(input, districts, scores);
  const rankedEntry = ranked.find((r) => r.districtId === id);
  const weights     = computeAdjustedWeights(input);

  const subDistrictsHere = subDistricts.filter((sd) => sd.districtId === id);
  const rankedSub = rankSubDistricts(input, subDistrictsHere, subDistrictScores);

  const districtScores = Object.fromEntries(
    scores
      .filter((s) => s.districtId === id)
      .map((s) => [s.indicatorId, s.skor])
  ) as Record<IndicatorId, number>;

  const resultUrl = `/result?persona=${input.personaId}&budget=${input.budget}&internet=${input.internetPriority}&community=${input.communityPriority}&environment=${input.environmentPreference}`;
  const heroPhoto = getDistrictVisual(district.id).imageUrl;

  const contribEntries = rankedEntry
    ? (Object.entries(rankedEntry.kontribusi) as [IndicatorId, number][]).sort(([, a], [, b]) => b - a)
    : [];

  return (
    <div className="min-h-screen p-2 sm:p-4">
      <AmbientBackground />
      <div className="mx-auto max-w-[1220px]">
        {/* Panel utama — satu kolom di semua ukuran layar, supaya posisi
            section tidak berubah antara mobile & desktop */}
        <div className="rounded-[26px] border border-white/50 bg-paper/70 p-2.5 shadow-xl backdrop-blur-2xl sm:p-3.5">
          <PillNavbar />

          {/* Hero card */}
          <section className="relative isolate mt-3.5 overflow-hidden rounded-[22px]">
            <div className="relative px-5 pb-6 pt-5 sm:px-6 sm:pt-6">
              <Image src={heroPhoto} alt="" fill sizes="100vw" className="-z-20 object-cover" priority />
              <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                  background:
                    "linear-gradient(110deg, rgba(246,245,250,0.95) 0%, rgba(246,245,250,0.62) 45%, rgba(246,245,250,0.3) 70%, rgba(246,245,250,0.55) 100%)",
                }}
                aria-hidden="true"
              />

              <div className="relative grid gap-4 lg:grid-cols-[1.25fr_0.9fr]">
                <div>
                  {/* Breadcrumb */}
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <button
                      onClick={() => router.push(resultUrl)}
                      aria-label="Kembali ke hasil"
                      className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-white hover:text-ink"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <Link href={resultUrl} className="hover:text-ink">Hasil Rekomendasi</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="rounded-full border border-line bg-white px-3 py-1 font-bold text-ink">
                      {district.nama}
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{district.nama}</h1>

                  {rankedEntry && (
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                      <Crown className="h-3.5 w-3.5" />
                      Peringkat {rankedEntry.rank}
                    </span>
                  )}

                  <p className="mt-4 text-xs font-semibold text-muted-foreground">Skor Keseluruhan</p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-4xl font-bold text-positive">
                      {(rankedEntry?.skorTotal ?? 0).toFixed(1)}
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">/100</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-semibold text-positive">Best Match</span>
                  </div>

                  {/* Chips — data asli, bukan populasi fiktif */}
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {[
                      { icon: Building2, label: "Tipe Wilayah", value: district.tipe },
                      { icon: Wifi, label: "Internet", value: `${district.internetMbps} Mbps` },
                      { icon: Users, label: "Coworking", value: `${district.coworkingCount} tempat` },
                    ].map(({ icon: Icon, label, value }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2.5 rounded-xl border border-white/70 bg-white/85 px-3.5 py-2.5"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-secondary">
                          <Icon className="h-3.5 w-3.5 text-ink" />
                        </span>
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground">{label}</p>
                          <p className="text-xs font-bold text-ink">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why This Match */}
                {rankedEntry && (
                  <div className="self-start rounded-2xl border border-white/70 bg-white/85 p-4 lg:mt-8">
                    <p className="mb-2.5 text-sm font-bold text-ink">Why This Match?</p>
                    <WhyThisMatch ranked={rankedEntry} districtNama={district.nama} />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Skor per Indikator */}
          <section className="mt-3.5 rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(30,35,48,0.04)] sm:p-5">
            <h2 className="mb-3.5 text-sm font-extrabold text-ink">Skor per Indikator</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {INDICATOR_CARDS.map(({ id: indId, label, icon: Icon }) => (
                <div key={indId} className="rounded-2xl border border-line bg-white p-3.5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-positive-bg">
                      <Icon className="h-3.5 w-3.5 text-positive" />
                    </span>
                    <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
                  </div>
                  <p className="font-mono text-xl font-extrabold text-positive">
                    {Math.round(districtScores[indId] ?? 0)}
                    <span className="text-[11px] font-semibold text-muted-foreground">/100</span>
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Kecamatan Terbaik — ranking level kedua di dalam distrik ini, pakai
              formula scoring yang sama persis dengan level distrik (lihat
              rankSubDistricts), supaya user tahu titik spesifik di dalam
              distrik yang luas ini, bukan cuma nama kabupaten/kota. */}
          {rankedSub.length > 0 && (
            <section className="mt-3.5 rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(30,35,48,0.04)] sm:p-5">
              <h2 className="text-sm font-extrabold text-ink">Kecamatan Terbaik di {district.nama}</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                Diranking pakai bobot &amp; preferensi yang sama dengan hasil quiz Anda.
              </p>

              <div className="mt-4 divide-y divide-line rounded-2xl border border-line">
                {rankedSub.map((r) => {
                  const sd = subDistrictsHere.find((s) => s.id === r.subDistrictId)!;
                  const isFirst = r.rank === 1;
                  const isExpanded = expandedSubDistrict === r.subDistrictId;
                  return (
                    <div key={r.subDistrictId} className="px-4 py-3.5 sm:px-5">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSubDistrict((prev) => (prev === r.subDistrictId ? null : r.subDistrictId))
                        }
                        className="flex w-full items-center gap-3.5 text-left"
                      >
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                          style={{ backgroundColor: isFirst ? "#F59E0B" : "var(--ink)" }}
                        >
                          {r.rank}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-1.5 text-sm font-extrabold text-ink">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            {sd.nama}
                            {isFirst && (
                              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                                Terbaik
                              </span>
                            )}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {sd.ringkasanKarakteristik}
                          </p>
                        </div>
                        <span className="shrink-0 text-right">
                          <span className="font-mono text-lg font-extrabold text-positive">
                            {r.skorTotal.toFixed(1)}
                          </span>
                          <span className="ml-0.5 text-[11px] font-semibold text-muted-foreground">/100</span>
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="ml-11 mt-3 rounded-xl bg-paper/60 p-3.5">
                          <WhyThisMatch ranked={r} districtNama={sd.nama} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Tentang */}
          <section className="mt-3.5 rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(30,35,48,0.04)] sm:p-5">
            <h2 className="mb-2.5 text-sm font-extrabold text-ink">Tentang {district.nama}</h2>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              {district.ringkasanKarakteristik}
            </p>
          </section>

          {/* Mengapa Distrik Ini Direkomendasikan — full-width di bawah,
              posisinya sama persis di mobile maupun desktop (tidak pindah
              dari samping ke bawah). Menggantikan section "Perbandingan
              dengan Distrik Lain" yang dihapus. */}
          {rankedEntry && (
            <section className="mt-3.5 rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(30,35,48,0.04)] sm:p-6">
              <h2 className="text-lg font-extrabold tracking-tight text-ink sm:text-xl">
                Mengapa Distrik Ini Direkomendasikan?
              </h2>
              <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
                Rekomendasi ini dihasilkan berdasarkan kontribusi setiap indikator terhadap skor akhir Anda.
              </p>

              <div className="mt-5 divide-y divide-line rounded-2xl border border-line px-4 sm:px-5">
                {contribEntries.map(([indId], i) => {
                  const { icon: Icon, bg, color } = CONTRIB_STYLE[indId];
                  const bobotPct = Math.round(weights[indId] * 100);
                  const skor = Math.round(rankedEntry.skorPerIndikator[indId]);
                  const kontribusiPct = rankedEntry.skorTotal > 0
                    ? (rankedEntry.kontribusi[indId] / rankedEntry.skorTotal) * 100
                    : 0;
                  return (
                    <div key={indId} className="py-4">
                      <div className="flex items-center gap-3.5">
                        <span
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                          style={{ backgroundColor: bg }}
                        >
                          <Icon className="h-[18px] w-[18px]" style={{ color }} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-extrabold text-ink">
                            {INDICATOR_CARDS.find((c) => c.id === indId)?.label} ({bobotPct}%)
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            Skor {skor}/100 {CONTRIB_DESC[i] ?? CONTRIB_DESC[CONTRIB_DESC.length - 1]}
                          </p>
                        </div>
                        <span className="shrink-0 text-[17px] font-extrabold text-ink">
                          {kontribusiPct.toFixed(1)}%
                        </span>
                      </div>
                      <div className="mt-2.5 h-[7px] w-full overflow-hidden rounded-full bg-line">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, kontribusiPct)}%`,
                            background: "linear-gradient(90deg,#0f6f3c,#7cc244)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 grid grid-cols-1 items-center gap-4 rounded-2xl border border-line p-5 sm:grid-cols-[auto_1fr] sm:gap-6">
                <div>
                  <h3 className="text-sm font-extrabold text-ink">Total Skor Akhir</h3>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-mono text-3xl font-extrabold text-positive">
                      {rankedEntry.skorTotal.toFixed(1)}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">/100</span>
                  </div>
                </div>
                <p className="text-[13px] leading-relaxed text-muted-foreground sm:border-l sm:border-line sm:pl-5">
                  {district.nama} adalah pilihan {rankedEntry.rank === 1 ? "terbaik" : `peringkat ${rankedEntry.rank}`} dengan
                  keseimbangan skor sesuai preferensi Anda.
                </p>
              </div>
            </section>
          )}

          {/* Tempat kerja rekomendasi */}
          <section className="mt-3.5 rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(30,35,48,0.04)] sm:p-5">
            <SuggestedPlaces
              districtId={district.id}
              districtNama={district.nama}
              targetSubDistrictId={rankedSub[0]?.subDistrictId ?? null}
              subDistricts={subDistrictsHere}
              environmentPreference={input.environmentPreference as "cafe" | "quiet" | "coworking" | "flexible"}
              personaId={input.personaId as "tech-professional" | "creative-professional" | "student-fresh-graduate" | "digital-nomad"}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
