import type { RankedDistrict, IndicatorId } from "@/types/recommendation";

const LABEL: Record<IndicatorId, string> = {
  internet:    "Internet",
  cost:        "Biaya Hidup",
  community:   "Komunitas",
  environment: "Lingkungan",
};

interface Props {
  ranked: RankedDistrict;
  districtNama: string;
  whyText: string;
}

export function WhyThisMatch({ ranked, whyText }: Props) {
  const entries = (Object.entries(ranked.kontribusi) as [IndicatorId, number][])
    .sort(([, a], [, b]) => b - a);
  const [top1, top2, , weakest] = entries;

  return (
    <div className="space-y-3">
      {/* Top 2 kontribusi */}
      <div className="flex flex-wrap gap-2">
        {[top1, top2].map(([id]) => (
          <div
            key={id}
            className="flex items-center gap-2 rounded-full border border-sawah/30 bg-sawah/8 px-3 py-1"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-sawah" />
            <span className="text-xs font-semibold text-sawah">{LABEL[id]}</span>
            <span className="font-mono text-xs text-sawah">
              {Math.round(ranked.skorPerIndikator[id])}/100
            </span>
          </div>
        ))}
        {/* Trade-off */}
        {weakest && (
          <div className="flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1">
            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Trade-off: {LABEL[weakest[0]]}
            </span>
          </div>
        )}
      </div>

      {/* Narasi */}
      <p className="text-sm leading-relaxed text-muted-foreground">{whyText}</p>
    </div>
  );
}
