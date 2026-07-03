"use client";

import { Laptop, Palette, GraduationCap, Globe } from "lucide-react";
import type { PersonaId } from "@/types/persona";
import { cn } from "@/lib/utils";

interface PersonaCard {
  id: PersonaId;
  nama: string;
  deskripsi: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  activeBorder: string;
  activeBg: string;
  activeRing: string;
  tag: string;
}

const PERSONAS: PersonaCard[] = [
  {
    id: "tech-professional",
    nama: "Tech Professional",
    deskripsi: "Developer, DevOps, Data, prioritas internet kencang & stabil.",
    icon: Laptop,
    iconBg: "#CFFAFE",
    iconColor: "#0E7490",
    activeBorder: "#0E7490",
    activeBg: "#ECFEFF",
    activeRing: "#0E749040",
    tag: "Koneksi · Data",
  },
  {
    id: "creative-professional",
    nama: "Creative Professional",
    deskripsi: "Desainer, videografer, penulis, butuh inspirasi & komunitas kreatif.",
    icon: Palette,
    iconBg: "#FFE4E6",
    iconColor: "#9F1239",
    activeBorder: "#9F1239",
    activeBg: "#FFF1F2",
    activeRing: "#9F123940",
    tag: "Kreatif · Komunitas",
  },
  {
    id: "student-fresh-graduate",
    nama: "Student & Fresh Graduate",
    deskripsi: "Mahasiswa & fresh grad, biaya hidup terjangkau adalah prioritas utama.",
    icon: GraduationCap,
    iconBg: "#FFEDD5",
    iconColor: "#C2410C",
    activeBorder: "#C2410C",
    activeBg: "#FFF7ED",
    activeRing: "#C2410C40",
    tag: "Budget · Aksesibilitas",
  },
  {
    id: "digital-nomad",
    nama: "Digital Nomad",
    deskripsi: "Remote worker yang berpindah, profil paling seimbang antar indikator.",
    icon: Globe,
    iconBg: "#ECFCCB",
    iconColor: "#4D7C0F",
    activeBorder: "#4D7C0F",
    activeBg: "#F7FEE7",
    activeRing: "#4D7C0F40",
    tag: "Fleksibel · Seimbang",
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
        {PERSONAS.map(({ id, nama, deskripsi, icon: Icon, iconBg, iconColor, activeBorder, activeBg, activeRing, tag }) => {
          const isActive = selected === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              aria-pressed={isActive}
              aria-label={`Pilih persona ${nama}`}
              style={isActive ? {
                borderColor: activeBorder,
                backgroundColor: activeBg,
                boxShadow: `0 0 0 1px ${activeBorder}, 0 4px 12px ${activeRing}`,
              } : undefined}
              className={cn(
                "group flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200",
                isActive
                  ? "border-transparent"
                  : "border-line bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)] [@media(hover:hover)]:hover:shadow-[0_4px_12px_rgba(15,23,42,0.10)] [@media(hover:hover)]:hover:border-line/80 [@media(hover:hover)]:hover:-translate-y-0.5 active:scale-[0.98]"
              )}
            >
              <div
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: isActive ? iconColor : iconBg,
                }}
              >
                <Icon
                  className="h-5 w-5"
                  style={{ color: isActive ? "#fff" : iconColor }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className="text-sm font-semibold leading-tight"
                    style={{ color: isActive ? activeBorder : "#0F172A" }}
                  >
                    {nama}
                  </p>
                  {isActive && (
                    <div
                      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: activeBorder }}
                    >
                      <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 6l2.5 2.5 4.5-4.5" />
                      </svg>
                    </div>
                  )}
                </div>
                <p
                  className="mt-0.5 font-mono text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: isActive ? `${activeBorder}99` : "#94A3B8" }}
                >
                  {tag}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
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
