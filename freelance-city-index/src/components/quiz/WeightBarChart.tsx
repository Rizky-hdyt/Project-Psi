"use client";

import { Wifi, Wallet, Users, TreePine } from "lucide-react";
import type { IndicatorId } from "@/types/recommendation";

const INDICATOR_META: Record<IndicatorId, { label: string; icon: React.ElementType }> = {
  internet:    { label: "Internet",     icon: Wifi },
  cost:        { label: "Cost of Living", icon: Wallet },
  community:   { label: "Community",    icon: Users },
  environment: { label: "Environment",  icon: TreePine },
};

interface Props {
  weights: Record<IndicatorId, number>;
}

export function WeightBarChart({ weights }: Props) {
  const indicators: IndicatorId[] = ["internet", "cost", "community", "environment"];

  return (
    <div className="space-y-4" aria-label="Bobot indikator">
      {indicators.map((id) => {
        const pct = Math.round(weights[id] * 100);
        const { label, icon: Icon } = INDICATOR_META[id];
        return (
          <div key={id}>
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-ink">{label}</span>
              </div>
              <span className="font-mono text-sm font-bold tabular-nums text-positive">
                {pct}%
              </span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${label}: ${pct}%`}
            >
              <div
                className="h-full rounded-full bg-positive motion-safe:transition-all motion-safe:duration-[400ms] motion-safe:ease-[var(--ease-entrance)]"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
