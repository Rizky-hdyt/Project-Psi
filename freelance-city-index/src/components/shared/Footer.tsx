import Link from "next/link";
import { MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-[1120px] px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sawah">
              <MapPin className="h-3 w-3 text-white" />
            </div>
            <span className="text-xs font-semibold text-ink">Freelance City Index</span>
            <span className="font-mono text-[10px] text-muted-foreground/60">· Yogyakarta Edition · 2026</span>
          </Link>

          {/* Right side: sumber data + tech */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[10px] text-muted-foreground/60">Data: BPS DIY · Diskominfo · UMK 2025</span>
            <span className="hidden sm:inline text-muted-foreground/30">·</span>
            {["Next.js 15", "Tailwind v4", "Neon"].map((t) => (
              <span
                key={t}
                className="font-mono text-[10px] text-muted-foreground/50"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
