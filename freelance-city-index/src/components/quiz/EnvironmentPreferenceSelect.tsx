"use client";

import { Volume1, Coffee, Building2, Shuffle, CheckSquare2 } from "lucide-react";
import type { QuizInput } from "@/types/quiz";
import { cn } from "@/lib/utils";

const OPTIONS: {
  value: QuizInput["environmentPreference"];
  label: string;
  sub: string;
  icon: React.ElementType;
}[] = [
  { value: "quiet",     label: "Quiet",     sub: "Tenang & fokus",          icon: Volume1 },
  { value: "cafe",      label: "Cafe",      sub: "Suasana cafe hangat",     icon: Coffee },
  { value: "coworking", label: "Coworking", sub: "Ruang kerja kolaboratif", icon: Building2 },
  { value: "flexible",  label: "Flexible",  sub: "Semua cocok",             icon: Shuffle },
];

interface Props {
  value: QuizInput["environmentPreference"];
  onChange: (v: QuizInput["environmentPreference"]) => void;
}

export function EnvironmentPreferenceSelect({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {OPTIONS.map(({ value: val, label, icon: Icon }) => {
        const isActive = value === val;
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            aria-pressed={isActive}
            className={cn(
              "flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 transition-colors duration-[180ms]",
              isActive
                ? "border-sawah bg-sawah/5"
                : "border-line bg-white hover:border-ink/30"
            )}
          >
            {isActive ? (
              <CheckSquare2 className="h-3.5 w-3.5 text-sawah" />
            ) : (
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span className={cn("text-xs font-medium", isActive ? "text-sawah" : "text-ink")}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
