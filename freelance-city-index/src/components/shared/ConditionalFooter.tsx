"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  // Admin punya layout full-screen sendiri, footer tidak boleh ikut di sana.
  // Landing punya LandingFooter sendiri (lebih kaya, lihat Landing_Page_Spec.md),
  // jadi Footer bersama ini di-skip di sana supaya tidak dobel.
  if (pathname?.startsWith("/admin")) return null;
  if (pathname === "/") return null;
  return <Footer />;
}
