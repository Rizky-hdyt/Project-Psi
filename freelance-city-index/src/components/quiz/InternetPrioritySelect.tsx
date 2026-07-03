"use client";

import { Wifi } from "lucide-react";
import type { QuizInput } from "@/types/quiz";
import { cn } from "@/lib/utils";

const OPTIONS: { value: QuizInput["internetPriority"]; label: string; sub: string; bars: number }[] = [
  { value: "low",    label: "Low",    sub: "×0.7 bobot", bars: 1 },
  { value: "medium", label: "Medium", sub: "×1.0 bobot", bars: 2 },
  { value: "high",   label: "High",   sub: "×1.3 bobot", bars: 3 },
  { value: "ultra",  label: "Ultra",  sub: "×1.6 bobot", bars: 4 },
];

function SignalBars({ count, active }: { count: number; active: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-3.5">
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className="w-1 rounded-sm transition-all"
          style={{
            height: `${bar * 25}%`,
            backgroundColor: bar <= count
              ? (active ? "#fff" : "#0E7490")
              : (active ? "rgba(255,255,255,0.3)" : "#E2E8F0"),
          }}
        />
      ))}
    </div>
  );
}

interface Props {
  value: QuizInput["internetPriority"];
  onChange: (v: QuizInput["internetPriority"]) => void;
}

export function InternetPrioritySelect({ value, onChange }: Props) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Wifi className="h-4 w-4 text-pesisir" />
        <label className="text-sm font-semibold text-ink">
          Seberapa penting internet cepat?
        </label>
      </div>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={isActive}
              style={isActive ? {
                backgroundColor: "#0E7490",
                borderColor: "#0E7490",
                boxShadow: "0 2px 8px rgba(14,116,144,0.35)",
              } : undefined}
              className={cn(
                "flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 transition-all duration-200",
                isActive
                  ? "border-transparent text-white"
                  : "border-line bg-white text-ink hover:border-pesisir/40 hover:shadow-sm"
              )}
            >
              <SignalBars count={opt.bars} active={isActive} />
              <span className="text-xs font-semibold">{opt.label}</span>
              <span className={cn("font-mono text-[9px]", isActive ? "text-white/70" : "text-muted-foreground")}>
                {opt.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
