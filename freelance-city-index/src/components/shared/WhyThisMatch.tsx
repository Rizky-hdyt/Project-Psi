import { TrendingUp, TrendingDown } from "lucide-react";
import type { RankedDistrict, IndicatorId } from "@/types/recommendation";

const LABEL: Record<IndicatorId, string> = {
  internet:    "Internet",
  cost:        "Biaya Hidup",
  community:   "Komunitas",
  environment: "Lingkungan",
};

const INDICATOR_COLOR: Record<IndicatorId, string> = {
  internet:    "#1F5C73",
  cost:        "#2F6F4E",
  community:   "#7B6040",
  environment: "#3A6E5C",
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
    <div className="space-y-4">
      {/* Kekuatan utama */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Keunggulan utama
        </p>
        <div className="flex flex-wrap gap-2">
          {[top1, top2].map(([id]) => {
            const color = INDICATOR_COLOR[id];
            const skor = Math.round(ranked.skorPerIndikator[id]);
            return (
              <div
                key={id}
                className="flex items-center gap-2 rounded-lg border px-3 py-2"
                style={{
                  borderColor: `${color}30`,
                  backgroundColor: `${color}0D`,
                }}
              >
                <TrendingUp className="h-3.5 w-3.5 shrink-0" style={{ color }} />
                <span className="text-xs font-semibold" style={{ color }}>
                  {LABEL[id]}
                </span>
                <span
                  className="rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold text-white"
                  style={{ backgroundColor: color }}
                >
                  {skor}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trade-off */}
      {weakest && (
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Trade-off
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2 w-fit">
            <TrendingDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {LABEL[weakest[0]]}
            </span>
            <span className="font-mono text-[10px] font-semibold text-muted-foreground">
              {Math.round(ranked.skorPerIndikator[weakest[0]])}/100
            </span>
          </div>
        </div>
      )}

      {/* Narasi */}
      <p className="text-sm leading-relaxed text-muted-foreground border-t border-line pt-3">{whyText}</p>
    </div>
  );
}
