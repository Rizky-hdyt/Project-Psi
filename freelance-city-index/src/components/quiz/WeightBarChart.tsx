"use client";

import { Wifi, Wallet, Users, TreePine } from "lucide-react";
import type { IndicatorId } from "@/types/recommendation";

const INDICATOR_META: Record<IndicatorId, {
  label: string;
  icon: React.ElementType;
  color: string;
  gradientId: string;
}> = {
  internet:    { label: "Internet",     icon: Wifi,     color: "#0E7490", gradientId: "g-internet"    },
  cost:        { label: "Biaya Hidup",  icon: Wallet,   color: "#C2410C", gradientId: "g-cost"        },
  community:   { label: "Komunitas",    icon: Users,    color: "#4D7C0F", gradientId: "g-community"   },
  environment: { label: "Lingkungan",   icon: TreePine, color: "#475569", gradientId: "g-environment" },
};

interface Props {
  weights: Record<IndicatorId, number>;
}

export function WeightBarChart({ weights }: Props) {
  const indicators: IndicatorId[] = ["internet", "cost", "community", "environment"];

  return (
    <div className="space-y-4" aria-label="Bobot indikator">
      {/* SVG gradient defs (zero-size, just registers the gradients) */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          {indicators.map((id) => {
            const { color, gradientId } = INDICATOR_META[id];
            return (
              <linearGradient key={id} id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={color} stopOpacity="1" />
                <stop offset="100%" stopColor={color} stopOpacity="0.6" />
              </linearGradient>
            );
          })}
        </defs>
      </svg>

      {indicators.map((id) => {
        const pct = Math.round(weights[id] * 100);
        const { label, icon: Icon, color, gradientId } = INDICATOR_META[id];
        return (
          <div key={id}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon className="h-3.5 w-3.5" style={{ color }} />
                </div>
                <span className="text-sm font-medium text-ink">{label}</span>
              </div>
              <span className="font-mono text-sm font-bold" style={{ color }}>
                {pct}%
              </span>
            </div>
            <div
              className="h-2.5 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: "#E2E8F0" }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${label}: ${pct}%`}
            >
              <div
                className="h-full rounded-full motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out"
                style={{
                  width: `${pct}%`,
                  background: `url(#${gradientId})`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
