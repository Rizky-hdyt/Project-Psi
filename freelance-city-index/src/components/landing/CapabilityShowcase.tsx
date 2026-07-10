"use client";

import { useState } from "react";
import { Wifi, Wallet, Users, Leaf, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Capability {
  icon: LucideIcon;
  label: string;
  desc: string;
  weight: string;
}

const CAPABILITIES: Capability[] = [
  { icon: Wifi, label: "Internet", desc: "Kualitas & kecepatan koneksi, syarat mutlak kerja remote.", weight: "Bobot tertinggi untuk Tech Professional (40%)" },
  { icon: Wallet, label: "Biaya Hidup", desc: "Keterjangkauan kost & kebutuhan harian, dibalik skornya.", weight: "Bobot tertinggi untuk Student & Fresh Graduate (45%)" },
  { icon: Users, label: "Komunitas", desc: "Aktivitas coworking & jaringan profesional di sekitar.", weight: "Bobot merata di semua persona (20-25%)" },
  { icon: Leaf, label: "Lingkungan", desc: "Kebisingan & kenyamanan suasana kerja sehari-hari.", weight: "Bobot tertinggi untuk Creative Professional (30%)" },
];

interface CapabilityShowcaseProps {
  variant?: "light" | "dark";
}

export function CapabilityShowcase({ variant = "light" }: CapabilityShowcaseProps) {
  const [active, setActive] = useState(0);
  const isDark = variant === "dark";

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CAPABILITIES.map(({ icon: Icon, label, desc }, i) => {
          const isActive = i === active;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={isActive}
              className={cn(
                "flex flex-col items-start rounded-[var(--radius-md)] border p-5 text-left transition-colors duration-[180ms]",
                isDark
                  ? isActive
                    ? "border-sawah/60 bg-white/[0.1] backdrop-blur-md"
                    : "border-white/10 bg-white/[0.06] backdrop-blur-md hover:border-white/25"
                  : isActive
                    ? "border-ink bg-ink"
                    : "border-line bg-white hover:border-ink/30"
              )}
            >
              <div
                className={cn(
                  "mb-4 flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] transition-colors",
                  isDark ? "bg-white/10" : isActive ? "bg-white/10" : "bg-sawah/10"
                )}
              >
                <Icon className={cn("h-4 w-4", isDark || isActive ? "text-white" : "text-sawah")} />
              </div>
              <p className={cn("mb-1.5 font-semibold", isDark ? "text-white" : isActive ? "text-white" : "text-ink")}>
                {label}
              </p>
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  isDark ? "text-white/65" : isActive ? "text-white/65" : "text-muted-foreground"
                )}
              >
                {desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Detail bar untuk kapabilitas aktif */}
      <div className={cn("mt-6 border-t pt-4 text-center", isDark ? "border-white/10" : "border-line")}>
        <span className={cn("font-mono text-xs", isDark ? "text-white/60" : "text-muted-foreground")}>
          {CAPABILITIES[active].weight}
        </span>
      </div>

      {/* Dot pagination */}
      <div className="mt-5 flex items-center justify-center gap-1.5">
        {CAPABILITIES.map((c, i) => (
          <button
            key={c.label}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Lihat indikator ${c.label}`}
            aria-current={i === active}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === active
                ? "w-6 bg-sawah"
                : isDark
                  ? "w-1.5 bg-white/20 hover:bg-sawah/50"
                  : "w-1.5 bg-line hover:bg-sawah/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
