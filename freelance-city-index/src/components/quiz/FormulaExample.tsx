import type { IndicatorId } from "@/types/recommendation";

const LABEL: Record<IndicatorId, string> = {
  internet:    "Internet",
  cost:        "Biaya",
  community:   "Komunitas",
  environment: "Lingkungan",
};

const INDICATORS: IndicatorId[] = ["internet", "cost", "community", "environment"];

interface Props {
  weights: Record<IndicatorId, number>;
  exampleScores?: Partial<Record<IndicatorId, number>>;
  exampleDistrictName?: string;
}

// Fallback jika data belum tersedia (tidak ditampilkan sebagai angka "benar")
const FALLBACK_SCORES: Record<IndicatorId, number> = {
  internet:    85,
  cost:        70,
  community:   80,
  environment: 75,
};

export function FormulaExample({ weights, exampleScores, exampleDistrictName }: Props) {
  const scores = exampleScores
    ? ({ ...FALLBACK_SCORES, ...exampleScores } as Record<IndicatorId, number>)
    : FALLBACK_SCORES;

  const isRealData = !!exampleScores;
  const districtLabel = exampleDistrictName ?? "Sleman";

  const total = INDICATORS.reduce(
    (sum, id) => sum + scores[id] * weights[id],
    0
  );

  return (
    <div className="rounded-lg border border-line bg-paper p-4">
      <p className="mb-3 text-xs font-medium text-muted-foreground">
        Contoh formula · {districtLabel}{" "}
        {isRealData ? (
          <span className="text-sawah">(skor aktual dari database)</span>
        ) : (
          <span className="text-warning">(skor ilustratif)</span>
        )}
      </p>
      <div className="space-y-1">
        {INDICATORS.map((id, i) => (
          <div key={id} className="flex items-center gap-1 font-mono text-xs text-ink">
            <span className="text-muted-foreground">{i === 0 ? " " : "+"}</span>
            <span className="w-24 shrink-0 text-pesisir">{LABEL[id]}</span>
            <span className="text-muted-foreground">{scores[id]}</span>
            <span className="text-muted-foreground mx-1">×</span>
            <span className="text-sawah font-bold">
              {Math.round(weights[id] * 1000) / 1000}
            </span>
            <span className="ml-auto text-muted-foreground">
              = {(scores[id] * weights[id]).toFixed(1)}
            </span>
          </div>
        ))}
        <div className="mt-2 flex items-center justify-between border-t border-line pt-2">
          <span className="font-mono text-xs text-muted-foreground">Skor Total Sleman</span>
          <span className="font-mono text-sm font-bold text-sawah">
            {total.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
