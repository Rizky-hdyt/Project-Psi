"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  showStartQuiz?: boolean;
}

const links = [
  { href: "/", label: "Beranda" },
  { href: "/result", label: "Hasil & Distrik" },
  { href: "/admin/login", label: "Admin" },
];

export function Navbar({ showStartQuiz = true }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/result") {
      return pathname?.startsWith("/result") || pathname?.startsWith("/district");
    }
    if (href === "/admin/login") {
      return pathname?.startsWith("/admin");
    }
    return pathname === href;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sawah shadow-[0_2px_6px_rgba(47,111,78,0.35)] transition-all group-hover:shadow-[0_4px_10px_rgba(47,111,78,0.45)]">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-ink">Freelance City Index</p>
            <p className="font-mono text-[10px] text-muted-foreground">Yogyakarta · DIY</p>
          </div>
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
                  "rounded-lg px-3 py-1.5 text-sm transition-all hover:text-ink",
                  active
                    ? "bg-sawah/8 font-semibold text-sawah"
                    : "text-muted-foreground hover:bg-paper"
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
            <Link href="/quiz">
              <Button
                size="sm"
                className="min-h-[36px] gap-1.5 bg-sawah text-white shadow-[0_2px_6px_rgba(47,111,78,0.30)] hover:bg-sawah/90 hover:shadow-[0_4px_10px_rgba(47,111,78,0.40)] transition-all"
              >
                Mulai Quiz
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:hidden"
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
          className="border-t border-line/60 bg-white/95 backdrop-blur-md px-4 pb-3 pt-2 sm:hidden"
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
                  "flex items-center rounded-lg px-2 py-2.5 text-sm transition-colors",
                  active ? "font-semibold text-sawah bg-sawah/5" : "text-muted-foreground hover:text-ink hover:bg-paper"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
