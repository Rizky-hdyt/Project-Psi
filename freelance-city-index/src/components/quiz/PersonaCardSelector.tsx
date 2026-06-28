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
    deskripsi: "Developer, DevOps, Data — prioritas internet kencang & stabil.",
    icon: Laptop,
    iconBg: "#EEF4F8",
    iconColor: "#1F5C73",
    activeBorder: "#1F5C73",
    activeBg: "#F0F6FA",
    activeRing: "#1F5C7340",
    tag: "Koneksi · Data",
  },
  {
    id: "creative-professional",
    nama: "Creative Professional",
    deskripsi: "Desainer, videografer, penulis — butuh inspirasi & komunitas kreatif.",
    icon: Palette,
    iconBg: "#FAF0EA",
    iconColor: "#B5562F",
    activeBorder: "#B5562F",
    activeBg: "#FDF5F0",
    activeRing: "#B5562F40",
    tag: "Kreatif · Komunitas",
  },
  {
    id: "student-fresh-graduate",
    nama: "Student & Fresh Graduate",
    deskripsi: "Mahasiswa & fresh grad — biaya hidup terjangkau adalah prioritas utama.",
    icon: GraduationCap,
    iconBg: "#EDF5F1",
    iconColor: "#2F6F4E",
    activeBorder: "#2F6F4E",
    activeBg: "#EFF7F3",
    activeRing: "#2F6F4E40",
    tag: "Budget · Aksesibilitas",
  },
  {
    id: "digital-nomad",
    nama: "Digital Nomad",
    deskripsi: "Remote worker yang berpindah — profil paling seimbang antar indikator.",
    icon: Globe,
    iconBg: "#F5F0E8",
    iconColor: "#7B6040",
    activeBorder: "#7B6040",
    activeBg: "#F7F2EA",
    activeRing: "#7B604040",
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
                  : "border-line bg-white shadow-[0_1px_2px_rgba(28,37,33,0.05)] [@media(hover:hover)]:hover:shadow-[0_4px_12px_rgba(28,37,33,0.10)] [@media(hover:hover)]:hover:border-line/80 [@media(hover:hover)]:hover:-translate-y-0.5 active:scale-[0.98]"
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
                    style={{ color: isActive ? activeBorder : "#1C2521" }}
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
                  style={{ color: isActive ? `${activeBorder}99` : "#9CA8A5" }}
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
