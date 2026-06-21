"use client";

import type { IndicatorId } from "@/types/recommendation";

const LABEL: Record<IndicatorId, string> = {
  internet:    "Internet",
  cost:        "Biaya Hidup",
  community:   "Komunitas",
  environment: "Lingkungan",
};

interface Props {
  weights: Record<IndicatorId, number>;
}

export function WeightBarChart({ weights }: Props) {
  const indicators: IndicatorId[] = ["internet", "cost", "community", "environment"];

  return (
    <div className="space-y-3" aria-label="Bobot indikator">
      {indicators.map((id) => {
        const pct = Math.round(weights[id] * 100);
        return (
          <div key={id}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-ink">{LABEL[id]}</span>
              <span className="font-mono text-xs font-semibold text-ink">
                {pct}%
              </span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${LABEL[id]}: ${pct}%`}
            >
              <div
                className="h-full rounded-full bg-sawah motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
