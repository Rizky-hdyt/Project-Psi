"use client";

import { Wifi, Wallet, Users, TreePine } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
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

// Animasi #7 (lihat RIWAYAT_PENGERJAAN.md): angka % count-up sinkron dengan
// bar yang tumbuh — dipisah per baris supaya tiap baris punya hook sendiri.
function WeightRow({ id, pct, delayMs }: { id: IndicatorId; pct: number; delayMs: number }) {
  const { label, icon: Icon } = INDICATOR_META[id];
  const animatedPct = useCountUp(pct, 600);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm text-ink">{label}</span>
        </div>
        <span className="font-mono text-sm font-bold tabular-nums text-positive">
          {Math.round(animatedPct)}%
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
        {/* Animasi #7: bar tumbuh dari kiri saat pertama muncul (anim-bar,
            stagger per indikator); transition width tetap ada untuk update
            nilai berikutnya tanpa remount. */}
        <div
          className="anim-bar h-full rounded-full bg-positive motion-safe:transition-all motion-safe:duration-[400ms] motion-safe:ease-[var(--ease-entrance)]"
          style={{ width: `${pct}%`, animationDelay: `${delayMs}ms` }}
        />
      </div>
    </div>
  );
}

export function WeightBarChart({ weights }: Props) {
  const indicators: IndicatorId[] = ["internet", "cost", "community", "environment"];

  return (
    <div className="space-y-4" aria-label="Bobot indikator">
      {indicators.map((id, i) => (
        <WeightRow key={id} id={id} pct={Math.round(weights[id] * 100)} delayMs={i * 90} />
      ))}
    </div>
  );
}
