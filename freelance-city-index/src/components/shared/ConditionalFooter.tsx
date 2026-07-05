"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  // Admin punya layout full-screen sendiri, footer tidak boleh ikut di sana.
  // Landing pakai LandingFooter sendiri (lihat Landing_Page_Spec.md).
  // Result tidak ada footer sama sekali — meniru persis hasil-rekomendasi.html
  // yang berhenti di tabel perbandingan, tanpa footer.
  if (pathname?.startsWith("/admin")) return null;
  if (pathname === "/" || pathname === "/result") return null;
  return <Footer />;
}
