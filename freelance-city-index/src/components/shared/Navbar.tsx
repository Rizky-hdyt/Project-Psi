"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  showStartQuiz?: boolean;
}

const links = [
  { href: "/", label: "Beranda" },
  { href: "/result", label: "Distrik" },
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
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sawah">
            <span className="font-mono text-sm font-bold text-white">F</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-ink">Freelance City Index</p>
            <p className="font-mono text-[10px] text-muted-foreground">Yogyakarta</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 sm:flex" aria-label="Navigasi utama">
          {links.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm transition-colors hover:text-ink",
                  active ? "font-semibold text-ink" : "text-muted-foreground"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: CTA + mobile hamburger */}
        <div className="flex items-center gap-2">
          {showStartQuiz && (
            <Link href="/quiz">
              <Button
                size="sm"
                className="min-h-[36px] gap-1.5 bg-sawah text-white hover:bg-sawah/90"
              >
                Start Quiz
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:hidden"
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
          className="border-t border-line bg-white px-4 pb-3 pt-2 sm:hidden"
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
                  "flex items-center py-2.5 text-sm transition-colors",
                  active ? "font-semibold text-ink" : "text-muted-foreground hover:text-ink"
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
