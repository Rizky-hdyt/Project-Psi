"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wifi, Home, Wallet, Users, Award, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { WhyThisMatch } from "@/components/shared/WhyThisMatch";
import { rankDistricts } from "@/lib/scoring/rank";
import { generateWhyText } from "@/lib/scoring/whyThisMatch";
import seedData from "@/data/districts.seed.json";
import type { QuizInput } from "@/types/quiz";
import type { District, DistrictScore } from "@/types/district";
import type { IndicatorId } from "@/types/recommendation";

const PERSONA_LABEL: Record<string, string> = {
  "tech-professional":      "Tech Professional",
  "creative-professional":  "Creative Professional",
  "student-fresh-graduate": "Student & Fresh Graduate",
  "digital-nomad":          "Digital Nomad",
};

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function getBestPersonaForDistrict(
  districtId: string,
  districts: District[],
  scores: DistrictScore[]
): string {
  const personaIds: QuizInput["personaId"][] = [
    "tech-professional",
    "creative-professional",
    "student-fresh-graduate",
    "digital-nomad",
  ];

  let bestPersona = personaIds[0];
  let bestSkor = -1;

  for (const personaId of personaIds) {
    const input: QuizInput = {
      personaId,
      budget: 4_000_000,
      internetPriority: "medium",
      communityPriority: "medium",
      environmentPreference: "flexible",
    };
    const ranked = rankDistricts(input, districts, scores);
    const entry = ranked.find((r) => r.districtId === districtId);
    if (entry && entry.skorTotal > bestSkor) {
      bestSkor = entry.skorTotal;
      bestPersona = personaId;
    }
  }
  return bestPersona;
}

export default function DistrictDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const params = useSearchParams();

  const districts = seedData.districts as District[];
  const scores    = seedData.scores as DistrictScore[];
  const district  = districts.find((d) => d.id === id);

  if (!district) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Distrik tidak ditemukan.</p>
        <Link href="/result"><Button variant="outline">Kembali ke Hasil</Button></Link>
      </div>
    );
  }

  // Rebuild quiz input from URL params (if coming from /result)
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
  const bestPersona = getBestPersonaForDistrict(id, districts, scores);

  const districtScores = Object.fromEntries(
    scores
      .filter((s) => s.districtId === id)
      .map((s) => [s.indicatorId, s.skor])
  ) as Record<IndicatorId, number>;

  const resultUrl = `/result?persona=${input.personaId}&budget=${input.budget}&internet=${input.internetPriority}&community=${input.communityPriority}&environment=${input.environmentPreference}`;

  const SNAPSHOT = [
    {
      icon: Wifi,
      label: "Internet Quality",
      value: `${districtScores.internet ?? "–"}/100`,
      sub: `~${district.internetMbps} Mbps`,
    },
    {
      icon: Home,
      label: "Rentang Biaya Kost",
      value: `${formatRupiah(district.kostMin)} – ${formatRupiah(district.kostMax)}`,
      sub: "per bulan",
    },
    {
      icon: Wallet,
      label: "Estimasi Biaya Hidup",
      value: formatRupiah(district.estimasiBiayaHidup),
      sub: `UMK ${formatRupiah(district.umk)}/bln`,
    },
    {
      icon: Users,
      label: "Aktivitas Komunitas",
      value: `${districtScores.community ?? "–"}/100`,
      sub: `${district.coworkingCount} coworking spaces`,
    },
    {
      icon: Award,
      label: "Best For Persona",
      value: PERSONA_LABEL[bestPersona],
      sub: "berdasarkan bobot default",
    },
    {
      icon: Info,
      label: "Ringkasan",
      value: "",
      sub: district.ringkasanKarakteristik,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      <div className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 sm:py-10">
        {/* Back button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(resultUrl)}
            className="gap-1.5 text-muted-foreground hover:text-ink -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke hasil
          </Button>
        </div>

        {/* Title */}
        <div className="mb-8">
          <p className="mb-1 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {district.tipe}
          </p>
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            {district.nama}
          </h1>
          {rankedEntry && (
            <p className="mt-2 font-mono text-sm text-muted-foreground">
              Skor Anda:{" "}
              <span className="font-bold text-ink">{rankedEntry.skorTotal}</span>
              {" · "}Rank #{rankedEntry.rank} dari 5 distrik
            </p>
          )}
        </div>

        {/* District Snapshot */}
        <section className="mb-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            District Snapshot
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SNAPSHOT.map(({ icon: Icon, label, value, sub }) => (
              <div
                key={label}
                className="flex gap-3 rounded-xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(28,37,33,0.06)]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line">
                  <Icon className="h-4 w-4 text-pesisir" />
                </div>
                <div className="min-w-0">
                  <p className="mb-0.5 text-xs font-medium text-muted-foreground">{label}</p>
                  {value && (
                    <p className="font-mono text-sm font-bold text-ink truncate">{value}</p>
                  )}
                  <p className="text-xs text-muted-foreground leading-relaxed">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why This Match (reuse) */}
        {rankedEntry && (
          <section className="rounded-xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(28,37,33,0.06)]">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Why This Match — untuk profil Anda
            </p>
            <WhyThisMatch
              ranked={rankedEntry}
              districtNama={district.nama}
              whyText={generateWhyText(rankedEntry, district.nama)}
            />
          </section>
        )}

      </div>
    </div>
  );
}
