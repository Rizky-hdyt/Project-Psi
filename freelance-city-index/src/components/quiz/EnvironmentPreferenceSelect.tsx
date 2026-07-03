"use client";

import { Volume1, Coffee, Building2, Shuffle } from "lucide-react";
import type { QuizInput } from "@/types/quiz";
import { cn } from "@/lib/utils";

const OPTIONS: {
  value: QuizInput["environmentPreference"];
  label: string;
  sub: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}[] = [
  { value: "quiet",     label: "Quiet",     sub: "Tenang & fokus",       icon: Volume1,   color: "#C2410C", bg: "#FFEDD5" },
  { value: "cafe",      label: "Cafe",      sub: "Suasana cafe hangat",  icon: Coffee,    color: "#9F1239", bg: "#FFE4E6" },
  { value: "coworking", label: "Coworking", sub: "Ruang kerja kolaboratif", icon: Building2, color: "#0E7490", bg: "#CFFAFE" },
  { value: "flexible",  label: "Flexible",  sub: "Semua cocok",          icon: Shuffle,   color: "#4D7C0F", bg: "#ECFCCB" },
];

interface Props {
  value: QuizInput["environmentPreference"];
  onChange: (v: QuizInput["environmentPreference"]) => void;
}

export function EnvironmentPreferenceSelect({ value, onChange }: Props) {
  return (
    <div>
      <label className="mb-3 block text-sm font-semibold text-ink">
        Lingkungan kerja seperti apa yang Anda sukai?
      </label>
      <div className="grid grid-cols-2 gap-2.5">
        {OPTIONS.map(({ value: val, label, sub, icon: Icon, color, bg }) => {
          const isActive = value === val;
          return (
            <button
              key={val}
              type="button"
              onClick={() => onChange(val)}
              aria-pressed={isActive}
              style={isActive ? {
                borderColor: color,
                backgroundColor: bg,
                boxShadow: `0 0 0 1px ${color}, 0 4px 12px ${color}25`,
              } : undefined}
              className={cn(
                "flex min-h-[60px] flex-col items-start gap-2 rounded-xl border p-3.5 text-left transition-all duration-200",
                isActive
                  ? "border-transparent"
                  : "border-line bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)] hover:shadow-[0_4px_10px_rgba(15,23,42,0.09)] hover:-translate-y-0.5"
              )}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
                style={{
                  backgroundColor: isActive ? color : bg,
                }}
              >
                <Icon
                  className="h-4 w-4"
                  style={{ color: isActive ? "#fff" : color }}
                />
              </div>
              <div>
                <p
                  className="text-xs font-semibold"
                  style={{ color: isActive ? color : "#0F172A" }}
                >
                  {label}
                </p>
                <p className="text-[10px] leading-tight text-muted-foreground">{sub}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
