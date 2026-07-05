"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/#cara-kerja", label: "Cara Kerja" },
  { href: "/#indikator", label: "Indikator" },
  { href: "/result", label: "Distrik" },
];

// Navbar pill mengambang — dipakai di Result & District Detail. Lebar yang
// tersedia beda-beda (Result dapat frame penuh, District Detail cuma dapat
// kolom kiri yang lebih sempit), jadi pakai @container supaya brand text &
// nav links menyesuaikan LEBAR NAVBAR SENDIRI, bukan lebar viewport — supaya
// tidak wrap ke 2 baris di konteks yang lebih sempit.
export function PillNavbar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/result") {
      return pathname === "/result" || pathname?.startsWith("/district");
    }
    if (href.startsWith("/#")) return false;
    return pathname === href;
  }

  return (
    <nav className="@container flex items-center gap-2 rounded-full bg-white px-3.5 py-2.5 shadow-[0_4px_14px_rgba(30,35,48,0.05)]">
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
      <Link
        href="/quiz"
        className="ml-auto flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-sawah px-4 py-2 text-[12px] font-bold text-white transition-[filter] hover:brightness-110 @[560px]:ml-0"
      >
        Mulai <ArrowRight className="h-3 w-3" />
      </Link>
    </nav>
  );
}
