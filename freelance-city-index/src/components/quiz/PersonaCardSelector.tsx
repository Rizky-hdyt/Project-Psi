"use client";

import { Laptop, Palette, GraduationCap, Globe, Check } from "lucide-react";
import type { PersonaId } from "@/types/persona";
import { cn } from "@/lib/utils";

interface PersonaCard {
  id: PersonaId;
  nama: string;
  icon: React.ElementType;
}

const PERSONAS: PersonaCard[] = [
  { id: "tech-professional", nama: "Tech Professional", icon: Laptop },
  { id: "creative-professional", nama: "Creative Professional", icon: Palette },
  { id: "student-fresh-graduate", nama: "Student & Fresh Graduate", icon: GraduationCap },
  { id: "digital-nomad", nama: "Digital Nomad", icon: Globe },
];

interface Props {
  selected: PersonaId | undefined;
  onSelect: (id: PersonaId) => void;
  showError: boolean;
}

export function PersonaCardSelector({ selected, onSelect, showError }: Props) {
  return (
    <div>
      {/* Animasi #6: grid ikut shake halus saat submit tanpa persona */}
      <div className={cn("grid grid-cols-2 gap-2.5 sm:grid-cols-4", showError && "anim-shake")}>
        {PERSONAS.map(({ id, nama, icon: Icon }) => {
          const isActive = selected === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              aria-pressed={isActive}
              aria-label={`Pilih persona ${nama}`}
              className={cn(
                "relative flex min-h-[72px] flex-col items-center justify-center gap-2 rounded-xl border px-2 py-3.5 text-center transition-colors duration-[180ms] active:scale-[0.98]",
                isActive
                  ? "border-sawah bg-sawah/5"
                  : "border-line bg-white [@media(hover:hover)]:hover:border-ink/30"
              )}
            >
              {/* Animasi #4: check pop saat kartu dipilih */}
              {isActive && (
                <span className="anim-pop absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-sawah">
                  <Check className="h-2.5 w-2.5 text-white" />
                </span>
              )}
              <Icon className={cn("h-4 w-4", isActive ? "text-sawah" : "text-muted-foreground")} />
              <p className={cn("text-xs font-medium leading-tight", isActive ? "text-sawah" : "text-ink")}>
                {nama}
              </p>
            </button>
          );
        })}
      </div>

      {showError && (
        <p role="alert" className="stagger-in mt-2 text-xs font-medium text-error">
          Pilih dulu profil freelancer Anda
        </p>
      )}
    </div>
  );
}
