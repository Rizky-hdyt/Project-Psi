"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#beranda", label: "Beranda" },
  { href: "#cara-kerja", label: "Cara Kerja" },
  { href: "#indikator", label: "Indikator" },
  { href: "#distrik", label: "Distrik" },
  { href: "#tentang", label: "Tentang" },
];

// Navbar khusus Landing Page (Landing_Page_Spec.md §Section 1) — glass
// background, bukan solid putih seperti Navbar bersama di halaman lain.
export function GlassNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="#beranda" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sawah font-mono text-xs font-bold text-white">
            F
          </span>
          <span className="text-sm font-semibold text-ink">Freelance City Index</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Navigasi utama">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="group relative px-3.5 py-2 text-sm text-ink/70 transition-colors duration-[180ms] hover:text-ink"
            >
              {label}
              <span className="absolute inset-x-3 -bottom-[1px] h-[2px] scale-x-0 rounded-full bg-sawah transition-transform duration-[180ms] group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/quiz"
            className="hidden min-h-10 items-center gap-1.5 rounded-full bg-gradient-to-r from-sawah to-[#F0384F] px-5 text-sm font-medium text-white shadow-[0_8px_20px_rgba(220,35,64,0.3)] transition-transform duration-[180ms] hover:-translate-y-0.5 sm:flex"
          >
            Mulai Rekomendasi
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <button
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink/70 hover:bg-white/50 sm:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Tutup menu" : "Buka menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className={cn(
            "border-t border-white/40 bg-white/80 px-4 pb-3 pt-2 backdrop-blur-xl sm:hidden"
          )}
          aria-label="Navigasi mobile"
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-lg px-2 text-sm text-ink/70 hover:text-ink"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/quiz"
            onClick={() => setOpen(false)}
            className="mt-2 flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-sawah to-[#F0384F] px-4 text-sm font-medium text-white"
          >
            Mulai Rekomendasi
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </nav>
      )}
    </header>
  );
}
