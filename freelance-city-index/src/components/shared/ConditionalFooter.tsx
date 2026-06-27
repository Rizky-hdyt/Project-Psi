"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  // Admin punya layout full-screen sendiri — footer tidak boleh ikut di sana
  if (pathname?.startsWith("/admin")) return null;
  return <Footer />;
}
