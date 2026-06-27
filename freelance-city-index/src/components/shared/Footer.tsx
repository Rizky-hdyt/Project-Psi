import Link from "next/link";
import { MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-2.5">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sawah shadow-[0_2px_6px_rgba(47,111,78,0.30)]">
                <MapPin className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-ink">Freelance City Index</span>
            </Link>
            <p className="text-xs leading-relaxed text-muted-foreground max-w-[200px]">
              DSS untuk freelancer & remote worker memilih distrik terbaik di DIY.
            </p>
            <p className="font-mono text-[10px] text-muted-foreground/50">
              Yogyakarta Edition · V1 · 2026
            </p>
          </div>

          {/* Sumber Data */}
          <div className="flex flex-col gap-2">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
              Sumber Data
            </p>
            {[
              "BPS Provinsi DIY",
              "Diskominfo DIY",
              "Data UMK 2025",
              "Survei komunitas freelancer",
              "OpenStreetMap DIY",
            ].map((s) => (
              <span key={s} className="text-xs text-muted-foreground">
                {s}
              </span>
            ))}
          </div>

          {/* Tech Stack */}
          <div className="flex flex-col gap-2">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
              Dibangun dengan
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Next.js 15", "Tailwind v4", "shadcn/ui", "Prisma 7", "Neon DB"].map((tech) => (
                <span
                  key={tech}
                  className="rounded border border-line px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-1.5 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © 2026 Freelance City Index · Yogyakarta Edition
          </p>
          <p className="font-mono text-[10px] text-muted-foreground/40">
            Proyek akademik · Data diperbarui berkala oleh admin
          </p>
        </div>
      </div>
    </footer>
  );
}
