"use client";

import { CheckSquare2 } from "lucide-react";
import type { QuizInput } from "@/types/quiz";
import { cn } from "@/lib/utils";

const OPTIONS: { value: QuizInput["communityPriority"]; label: string; sub: string; dots: number }[] = [
  { value: "low",    label: "Low",    sub: "×0.3 bobot", dots: 1 },
  { value: "medium", label: "Medium", sub: "×1.0 bobot", dots: 2 },
  { value: "high",   label: "High",   sub: "×1.8 bobot", dots: 3 },
];

function ActivityDots({ count, active }: { count: number; active: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((dot) => (
        <div
          key={dot}
          className={cn(
            "rounded-full transition-colors duration-[180ms]",
            dot <= count ? "h-2 w-2" : "h-1.5 w-1.5",
            dot <= count ? (active ? "bg-white" : "bg-ink") : (active ? "bg-white/30" : "bg-line")
          )}
        />
      ))}
    </div>
  );
}

interface Props {
  value: QuizInput["communityPriority"];
  onChange: (v: QuizInput["communityPriority"]) => void;
}

export function CommunityPrioritySelect({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
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
              <ActivityDots count={opt.dots} active={isActive} />
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
