"use client";

import { CheckSquare2 } from "lucide-react";
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
          className={cn(
            "w-1 rounded-sm transition-colors duration-[180ms]",
            bar <= count ? (active ? "bg-white" : "bg-ink") : (active ? "bg-white/30" : "bg-line")
          )}
          style={{ height: `${bar * 25}%` }}
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
    <div className="grid grid-cols-4 gap-2">
      {OPTIONS.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={isActive}
            className={cn(
              "flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 transition-colors duration-[180ms]",
              isActive
                ? "border-sawah bg-sawah/5"
                : "border-line bg-white text-ink hover:border-ink/30"
            )}
          >
            {isActive ? (
              <CheckSquare2 className="h-3.5 w-3.5 text-sawah" />
            ) : (
              <SignalBars count={opt.bars} active={isActive} />
            )}
            <span className={cn("text-xs font-medium", isActive ? "text-sawah" : "text-ink")}>{opt.label}</span>
            <span className={cn("font-mono text-[10px]", isActive ? "text-sawah/70" : "text-muted-foreground")}>
              {opt.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}
