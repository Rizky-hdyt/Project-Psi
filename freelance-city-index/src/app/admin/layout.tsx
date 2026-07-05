"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Database, ClipboardList, LogOut, Menu, X } from "lucide-react";
import { AdminProvider, useAdmin } from "@/contexts/AdminContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/data", label: "Data Indikator", icon: Database, exact: false },
  { href: "/admin/audit", label: "Audit Log", icon: ClipboardList, exact: false },
];

function SidebarContent({
  pathname,
  onNavigate,
  onLogout,
}: {
  pathname: string | null;
  onNavigate: () => void;
  onLogout: () => void;
}) {
  return (
    <>
      <div className="border-b border-line px-4 py-4">
        <p className="text-sm font-semibold text-ink">Freelance City Index</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Admin Panel</p>
      </div>

      <nav className="flex flex-col gap-0.5 p-3" aria-label="Navigasi admin">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm transition-colors min-h-[44px]",
                isActive
                  ? "bg-sawah/10 font-medium text-sawah"
                  : "text-muted-foreground hover:bg-muted hover:text-ink"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-line p-3">
        <Button
          variant="ghost"
          size="sm"
          className="min-h-[44px] w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>
    </>
  );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { state, logout } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Tunggu session check selesai dulu (!state.checking) sebelum redirect
  // Tanpa ini, redirect tembak saat isAuthenticated masih false sementara (checking)
  // yang menyebabkan gerak bolak-balik login ↔ admin
  useEffect(() => {
    if (!state.checking && !state.isAuthenticated && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [state.checking, state.isAuthenticated, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;
  if (state.checking) return null;
  if (!state.isAuthenticated) return null;

  function handleLogout() {
    setSidebarOpen(false);
    logout();
    router.push("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-line bg-white md:flex">
        <SidebarContent pathname={pathname} onNavigate={() => {}} onLogout={handleLogout} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-white transition-transform md:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Menu admin"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <p className="text-sm font-semibold text-ink">Admin Panel</p>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded p-1 text-muted-foreground hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarContent pathname={pathname} onNavigate={() => setSidebarOpen(false)} onLogout={handleLogout} />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="flex items-center gap-3 border-b border-line bg-white px-4 py-3 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Buka menu navigasi"
            aria-expanded={sidebarOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="text-sm font-semibold text-ink">Admin Panel</p>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProvider>
  );
}
