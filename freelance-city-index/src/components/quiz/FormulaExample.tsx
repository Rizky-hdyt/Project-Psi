import type { IndicatorId } from "@/types/recommendation";

const EXAMPLE_SCORES: Record<IndicatorId, number> = {
  internet:    85,
  cost:        70,
  community:   80,
  environment: 75,
};

const LABEL: Record<IndicatorId, string> = {
  internet:    "Internet",
  cost:        "Biaya",
  community:   "Komunitas",
  environment: "Lingkungan",
};

interface Props {
  weights: Record<IndicatorId, number>;
}

export function FormulaExample({ weights }: Props) {
  const indicators: IndicatorId[] = ["internet", "cost", "community", "environment"];
  const total = indicators.reduce(
    (sum, id) => sum + EXAMPLE_SCORES[id] * weights[id],
    0
  );

  return (
    <div className="rounded-lg border border-line bg-paper p-4">
      <p className="mb-3 text-xs font-medium text-muted-foreground">
        Contoh formula · distrik Sleman (skor aktual)
      </p>
      <div className="space-y-1">
        {indicators.map((id, i) => (
          <div key={id} className="flex items-center gap-1 font-mono text-xs text-ink">
            <span className="text-muted-foreground">{i === 0 ? " " : "+"}</span>
            <span className="w-24 shrink-0 text-pesisir">{LABEL[id]}</span>
            <span className="text-muted-foreground">{EXAMPLE_SCORES[id]}</span>
            <span className="text-muted-foreground mx-1">×</span>
            <span className="text-sawah font-bold">
              {Math.round(weights[id] * 1000) / 1000}
            </span>
            <span className="ml-auto text-muted-foreground">
              = {(EXAMPLE_SCORES[id] * weights[id]).toFixed(1)}
            </span>
          </div>
        ))}
        <div className="mt-2 flex items-center justify-between border-t border-line pt-2">
          <span className="font-mono text-xs text-muted-foreground">Skor Total</span>
          <span className="font-mono text-sm font-bold text-sawah">
            {total.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
