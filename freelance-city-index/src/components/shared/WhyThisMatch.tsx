import { CheckCircle2 } from "lucide-react";
import type { RankedDistrict, IndicatorId } from "@/types/recommendation";

export const INDICATOR_DISPLAY_LABEL: Record<IndicatorId, string> = {
  internet:    "Internet",
  cost:        "Biaya hidup",
  community:   "Komunitas",
  environment: "Lingkungan",
};
const LABEL = INDICATOR_DISPLAY_LABEL;

export function tier(skor: number): string {
  if (skor >= 85) return "sangat tinggi";
  if (skor >= 70) return "tinggi";
  if (skor >= 50) return "cukup baik";
  return "perlu diperhatikan";
}

interface Props {
  ranked: RankedDistrict;
  districtNama: string;
}

// Trade-off dibuat singkat (1 kalimat, cuma indikator terlemah) supaya kartu
// tidak tinggi ke bawah — bukan pakai generateWhyText yang isinya narasi
// panjang (dan bikin "Trade-off:" muncul dobel).
export function WhyThisMatch({ ranked }: Props) {
  const entries = (Object.entries(ranked.kontribusi) as [IndicatorId, number][])
    .sort(([, a], [, b]) => b - a);
  const [top1, top2, , weakest] = entries;
  const weakestSkor = Math.round(ranked.skorPerIndikator[weakest[0]]);

  return (
    <div className="space-y-3">
      {/* 2 kontribusi tertinggi */}
      <ul className="space-y-2">
        {[top1, top2].map(([id]) => {
          const skor = Math.round(ranked.skorPerIndikator[id]);
          return (
            <li key={id} className="flex items-start gap-2 text-sm leading-snug text-ink/80">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-positive" />
              {LABEL[id]} {tier(skor)} ({skor}/100)
            </li>
          );
        })}
      </ul>

      {/* Trade-off — 1 kalimat pendek saja */}
      <div>
        <p className="mb-1 text-xs font-semibold text-muted-foreground">Trade-off:</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {LABEL[weakest[0]]} relatif {tier(weakestSkor)} ({weakestSkor}/100) dibanding distrik lain.
        </p>
      </div>
    </div>
  );
}
