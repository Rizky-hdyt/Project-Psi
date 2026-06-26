"use client";

import { Users } from "lucide-react";
import type { QuizInput } from "@/types/quiz";
import { cn } from "@/lib/utils";

const OPTIONS: { value: QuizInput["communityPriority"]; label: string; sub: string; dots: number }[] = [
  { value: "low",    label: "Low",    sub: "×0.7 bobot", dots: 1 },
  { value: "medium", label: "Medium", sub: "×1.0 bobot", dots: 2 },
  { value: "high",   label: "High",   sub: "×1.3 bobot", dots: 3 },
];

function ActivityDots({ count, active }: { count: number; active: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((dot) => (
        <div
          key={dot}
          className={cn("rounded-full transition-all", dot <= count ? "h-2 w-2" : "h-1.5 w-1.5")}
          style={{
            backgroundColor: dot <= count
              ? (active ? "#fff" : "#7B6040")
              : (active ? "rgba(255,255,255,0.3)" : "#D8D3C4"),
          }}
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
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Users className="h-4 w-4" style={{ color: "#7B6040" }} />
        <label className="text-sm font-semibold text-ink">
          Seberapa penting komunitas &amp; coworking aktif?
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
                backgroundColor: "#7B6040",
                borderColor: "#7B6040",
                boxShadow: "0 2px 8px rgba(123,96,64,0.35)",
              } : undefined}
              className={cn(
                "flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 transition-all duration-200",
                isActive
                  ? "border-transparent text-white"
                  : "border-line bg-white text-ink hover:border-[#7B6040]/40 hover:shadow-sm"
              )}
            >
              <ActivityDots count={opt.dots} active={isActive} />
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
