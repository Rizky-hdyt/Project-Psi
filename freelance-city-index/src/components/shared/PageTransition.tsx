"use client";

import { usePathname } from "next/navigation";

export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  // Admin pages punya layout sendiri (sidebar + min-h-screen)
  // jangan tambah animasi agar tidak konflik saat redirect login → /admin
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <div
      key={pathname}
      className={`${isAdmin ? "" : "page-fade-in"} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
