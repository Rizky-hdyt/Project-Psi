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
  { icon: Users, label: "Komunitas", desc: "Aktivitas coworking & jaringan profesional di sekitar.", weight: "Bobot merata di semua persona (20–25%)" },
  { icon: Leaf, label: "Lingkungan", desc: "Kebisingan & kenyamanan suasana kerja sehari-hari.", weight: "Bobot tertinggi untuk Creative Professional (30%)" },
];

export function CapabilityShowcase() {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CAPABILITIES.map(({ icon: Icon, label, desc, weight }, i) => {
          const isActive = i === active;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={isActive}
              className={cn(
                "flex flex-col items-start rounded-2xl border p-5 text-left transition-all duration-300",
                isActive
                  ? "bg-ink shadow-[0_8px_24px_rgba(15,23,42,0.25)] sm:-translate-y-1"
                  : "border-line bg-white hover:border-sawah/30 hover:shadow-[0_2px_10px_rgba(15,23,42,0.06)]"
              )}
            >
              <div
                className={cn(
                  "mb-4 flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  isActive ? "bg-white/10" : "bg-sawah/10"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-[#FDBA74]" : "text-sawah")} />
              </div>
              <p className={cn("mb-1.5 font-semibold", isActive ? "text-white" : "text-ink")}>
                {label}
              </p>
              <p className={cn("text-sm leading-relaxed", isActive ? "text-white/65" : "text-muted-foreground")}>
                {desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Detail bar untuk kapabilitas aktif */}
      <div className="mt-6 flex items-center justify-center gap-3 rounded-xl border border-line bg-paper px-4 py-3">
        <span className="font-mono text-xs text-muted-foreground">
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
              i === active ? "w-6 bg-sawah" : "w-1.5 bg-line hover:bg-sawah/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
