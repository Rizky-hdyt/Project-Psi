"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  // Admin punya layout full-screen sendiri, footer tidak boleh ikut di sana.
  // Landing pakai LandingFooter sendiri (lihat Landing_Page_Spec.md).
  // Semua halaman publik lain (termasuk /result) pakai footer kecil ini —
  // sekaligus mengembalikan akses Admin dari Result yang sempat hilang
  // saat link Admin dipindah dari navbar ke footer.
  if (pathname?.startsWith("/admin")) return null;
  if (pathname === "/") return null;
  return <Footer />;
}
