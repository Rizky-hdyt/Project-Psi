"use client";

import { Laptop, Palette, GraduationCap, Globe } from "lucide-react";
import type { PersonaId } from "@/types/persona";
import { cn } from "@/lib/utils";

interface PersonaCard {
  id: PersonaId;
  nama: string;
  deskripsi: string;
  icon: React.ElementType;
}

const PERSONAS: PersonaCard[] = [
  {
    id: "tech-professional",
    nama: "Tech Professional",
    deskripsi: "Developer, DevOps, Data — prioritas internet kencang & stabil.",
    icon: Laptop,
  },
  {
    id: "creative-professional",
    nama: "Creative Professional",
    deskripsi: "Desainer, videografer, penulis — butuh inspirasi & komunitas kreatif.",
    icon: Palette,
  },
  {
    id: "student-fresh-graduate",
    nama: "Student & Fresh Graduate",
    deskripsi: "Mahasiswa & fresh grad — biaya hidup terjangkau adalah prioritas utama.",
    icon: GraduationCap,
  },
  {
    id: "digital-nomad",
    nama: "Digital Nomad",
    deskripsi: "Remote worker yang berpindah — profil paling seimbang antar indikator.",
    icon: Globe,
  },
];

interface Props {
  selected: PersonaId | undefined;
  onSelect: (id: PersonaId) => void;
  showError: boolean;
}

export function PersonaCardSelector({ selected, onSelect, showError }: Props) {
  return (
    <div>
      <label className="mb-3 block text-sm font-semibold text-ink">
        Pilih profil freelancer Anda <span className="text-error">*</span>
      </label>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PERSONAS.map(({ id, nama, deskripsi, icon: Icon }) => {
          const isActive = selected === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              aria-pressed={isActive}
              aria-label={`Pilih persona ${nama}`}
              className={cn(
                "flex min-h-[44px] items-start gap-3 rounded-lg border p-4 text-left transition-all",
                isActive
                  ? "border-sawah bg-sawah/8 ring-1 ring-sawah"
                  : "border-line bg-white hover:border-sawah/50 hover:bg-sawah/4"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                  isActive ? "bg-sawah text-white" : "bg-paper text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    isActive ? "text-sawah" : "text-ink"
                  )}
                >
                  {nama}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {deskripsi}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {showError && (
        <p role="alert" className="mt-2 text-xs font-medium text-error">
          Pilih dulu profil freelancer Anda
        </p>
      )}
    </div>
  );
}
