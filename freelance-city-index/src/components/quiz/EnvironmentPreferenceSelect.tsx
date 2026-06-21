"use client";

import { Volume1, Coffee, Building2, Shuffle } from "lucide-react";
import type { QuizInput } from "@/types/quiz";
import { cn } from "@/lib/utils";

const OPTIONS: {
  value: QuizInput["environmentPreference"];
  label: string;
  sub: string;
  icon: React.ElementType;
}[] = [
  { value: "quiet",     label: "Quiet",     sub: "Tenang & fokus",    icon: Volume1   },
  { value: "cafe",      label: "Cafe",      sub: "Suasana cafe",      icon: Coffee    },
  { value: "coworking", label: "Coworking", sub: "Ruang kerja ramai", icon: Building2 },
  { value: "flexible",  label: "Flexible",  sub: "Tidak ada preferensi", icon: Shuffle  },
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
      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map(({ value: val, label, sub, icon: Icon }) => {
          const isActive = value === val;
          return (
            <button
              key={val}
              type="button"
              onClick={() => onChange(val)}
              aria-pressed={isActive}
              className={cn(
                "flex min-h-[44px] items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all",
                isActive
                  ? "border-sawah bg-sawah/8 ring-1 ring-sawah"
                  : "border-line bg-white hover:border-sawah/50"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-sawah" : "text-muted-foreground"
                )}
              />
              <div>
                <p className={cn("text-xs font-semibold", isActive ? "text-sawah" : "text-ink")}>
                  {label}
                </p>
                <p className="text-[10px] text-muted-foreground">{sub}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
