import { Wifi, Wallet, Users, Leaf } from "lucide-react";
import { DistrictSwatch } from "@/components/shared/DistrictSwatch";
import type { District } from "@/types/district";
import type { IndicatorId, RankedDistrict } from "@/types/recommendation";

const INDICATORS: { id: IndicatorId; label: string; icon: React.ElementType }[] = [
  { id: "internet", label: "Internet", icon: Wifi },
  { id: "cost", label: "Cost of Living", icon: Wallet },
  { id: "community", label: "Community", icon: Users },
  { id: "environment", label: "Environment", icon: Leaf },
];

// 2 tingkat saja (hijau/oranye), sesuai hasil-rekomendasi.html — bukan 3 tingkat.
export function scoreColor(skor: number) {
  return skor >= 80 ? "var(--score-high)" : "var(--score-mid)";
}

interface Props {
  ranked: RankedDistrict[];
  districts: District[];
}

export function ScoreComparisonTable({ ranked, districts }: Props) {
  const districtMap = Object.fromEntries(districts.map((d) => [d.id, d]));

  return (
    <div className="mb-6 overflow-hidden rounded-[var(--radius-md)] border border-line bg-white">
      <p className="border-b border-line px-4 py-3 text-sm font-semibold text-ink sm:px-5">
        Perbandingan Skor per Indikator
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-muted-foreground">
              <th className="w-8 px-4 py-2.5 font-medium sm:px-5">#</th>
              <th className="px-2 py-2.5 font-medium">Distrik</th>
              {INDICATORS.map(({ id, label, icon: Icon }) => (
                <th key={id} className="px-3 py-2.5 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </span>
                </th>
              ))}
              <th className="px-3 py-2.5 pr-4 text-right font-medium sm:pr-5">Total Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {ranked.map((r) => {
              const d = districtMap[r.districtId];
              if (!d) return null;
              return (
                <tr key={r.districtId}>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground sm:px-5">{r.rank}</td>
                  <td className="px-2 py-3">
                    <span className="flex items-center gap-2 font-medium text-ink">
                      <DistrictSwatch districtId={r.districtId} size="sm" />
                      {d.nama}
                    </span>
                  </td>
                  {INDICATORS.map(({ id }) => {
                    const skor = Math.round(r.skorPerIndikator[id]);
                    const color = scoreColor(skor);
                    return (
                      <td key={id} className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 shrink-0 font-mono text-xs font-semibold tabular-nums text-ink">
                            {skor}
                          </span>
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-line">
                            {/* Animasi #10: bar tumbuh dari kiri saat pertama muncul */}
                            <div
                              className="anim-bar h-full rounded-full"
                              style={{ width: `${skor}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      </td>
                    );
                  })}
                  <td
                    className="px-3 py-3 pr-4 text-right font-mono text-sm font-bold tabular-nums sm:pr-5"
                    style={{ color: scoreColor(r.skorTotal) }}
                  >
                    {r.skorTotal.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
