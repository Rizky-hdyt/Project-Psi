"use client";

import type { QuizInput } from "@/types/quiz";
import { cn } from "@/lib/utils";

const OPTIONS: { value: QuizInput["communityPriority"]; label: string; sub: string }[] = [
  { value: "low",    label: "Low",    sub: "×0.7" },
  { value: "medium", label: "Medium", sub: "×1.0" },
  { value: "high",   label: "High",   sub: "×1.3" },
];

interface Props {
  value: QuizInput["communityPriority"];
  onChange: (v: QuizInput["communityPriority"]) => void;
}

export function CommunityPrioritySelect({ value, onChange }: Props) {
  return (
    <div>
      <label className="mb-3 block text-sm font-semibold text-ink">
        Seberapa penting komunitas &amp; coworking aktif?
      </label>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={isActive}
              className={cn(
                "flex min-h-[44px] flex-1 flex-col items-center justify-center rounded-full border px-2 py-2 transition-all",
                isActive
                  ? "border-pesisir bg-pesisir text-white"
                  : "border-line bg-white text-ink hover:border-pesisir/50"
              )}
            >
              <span className="text-xs font-semibold">{opt.label}</span>
              <span className={cn("font-mono text-[10px]", isActive ? "text-white/70" : "text-muted-foreground")}>
                {opt.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
