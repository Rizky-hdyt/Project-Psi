"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  showStartQuiz?: boolean;
}

const links = [
  { href: "/", label: "Beranda" },
  { href: "/#cara-kerja", label: "Cara Kerja" },
  { href: "/#indikator", label: "Indikator" },
  { href: "/result", label: "Distrik" },
  { href: "/admin/login", label: "Admin" },
];

export function Navbar({ showStartQuiz = true }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href.startsWith("/#")) {
      return false;
    }
    if (href === "/result") {
      return pathname?.startsWith("/result") || pathname?.startsWith("/district");
    }
    if (href === "/admin/login") {
      return pathname?.startsWith("/admin");
    }
    return pathname === href;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sawah font-mono text-xs font-bold text-white">
            F
          </span>
          <span className="text-sm font-semibold text-ink">Freelance City Index</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Navigasi utama">
          {links.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm transition-colors duration-[180ms]",
                  active ? "bg-secondary font-medium text-ink" : "text-muted-foreground hover:text-ink"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right: CTA + mobile hamburger */}
        <div className="flex items-center gap-2">
          {showStartQuiz && (
            <Link
              href="/quiz"
              className="hidden min-h-10 items-center gap-1.5 rounded-full bg-sawah px-5 text-sm font-medium text-white transition-colors duration-[180ms] hover:bg-sawah/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:flex"
            >
              Mulai
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}

          {/* Mobile hamburger — 44px touch target (NFR02) */}
          <button
            className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav
          className="border-t border-line bg-paper px-4 pb-3 pt-2 sm:hidden"
          aria-label="Navigasi mobile"
        >
          {links.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex min-h-11 items-center rounded-[var(--radius-sm)] px-2 text-sm transition-colors",
                  active ? "font-medium text-sawah" : "text-muted-foreground hover:text-ink"
                )}
              >
                {label}
              </Link>
            );
          })}
          {showStartQuiz && (
            <Link
              href="/quiz"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex min-h-11 items-center justify-center rounded-[var(--radius-sm)] bg-sawah px-4 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Mulai Quiz
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
