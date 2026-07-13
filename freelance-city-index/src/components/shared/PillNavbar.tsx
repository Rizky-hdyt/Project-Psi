"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/#cara-kerja", label: "Cara Kerja" },
  { href: "/#indikator", label: "Indikator" },
  { href: "/result", label: "Distrik" },
];

// Navbar pill mengambang — satu-satunya navbar dipakai di SEMUA halaman
// publik (Landing, Quiz, Result, District Detail, Compare, Assistant).
// Lebar yang tersedia beda-beda di tiap konteks, jadi pakai @container
// supaya brand text & nav links menyesuaikan LEBAR NAVBAR SENDIRI, bukan
// lebar viewport — supaya tidak wrap ke 2 baris di konteks yang lebih sempit.
// Background glass (semi-transparan + blur) meniru GlassNavbar lama yang
// dipakai landing sebelum disatukan ke komponen ini.
export function PillNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  // Sembunyikan CTA "Mulai" kalau sudah di halaman quiz — tidak masuk akal
  // menawarkan "mulai quiz" saat user sedang mengisi quiz itu sendiri.
  const hideCta = pathname?.startsWith("/quiz");

  function isActive(href: string) {
    if (href === "/result") {
      return pathname === "/result" || pathname?.startsWith("/district");
    }
    if (href.startsWith("/#")) return false;
    return pathname === href;
  }

  return (
    <nav className="@container relative z-30 flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-3.5 py-2.5 shadow-[0_4px_14px_rgba(30,35,48,0.06)] backdrop-blur-xl">
      <Link href="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[13px] font-extrabold text-ink">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sawah text-sm font-extrabold text-white">
          F
        </span>
        <span className="hidden @[420px]:inline">Freelance City Index</span>
      </Link>
      <div className="mx-auto hidden items-center gap-0.5 @[560px]:flex">
        {NAV_LINKS.map(({ href, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12px] font-semibold transition-colors",
                active ? "border border-sawah text-sawah" : "text-ink hover:bg-secondary"
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>
      {!hideCta && (
        <Link
          href="/quiz"
          className="ml-auto hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-sawah px-4 py-2 text-[12px] font-bold text-white transition-[filter] hover:brightness-110 @[560px]:flex"
        >
          Mulai <ArrowRight className="h-3 w-3" />
        </Link>
      )}

      {/* Hamburger — cuma tampil kalau lebar navbar < 560px (container query),
          menggantikan link & CTA yang disembunyikan di atas supaya navigasi
          tidak hilang total di konteks sempit (mobile). */}
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        aria-expanded={mobileOpen}
        aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
        className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-secondary @[560px]:hidden"
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {mobileOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 flex flex-col gap-1 rounded-2xl border border-white/50 bg-white/90 p-2 shadow-[0_10px_30px_rgba(30,35,48,0.12)] backdrop-blur-xl @[560px]:hidden">
          {NAV_LINKS.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex min-h-11 items-center whitespace-nowrap rounded-xl px-3 text-sm font-semibold transition-colors",
                  active ? "bg-secondary text-sawah" : "text-ink hover:bg-secondary"
                )}
              >
                {label}
              </Link>
            );
          })}
          {!hideCta && (
            <Link
              href="/quiz"
              onClick={() => setMobileOpen(false)}
              className="mt-1 flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-sawah px-3 text-sm font-bold text-white"
            >
              Mulai <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
