"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  LayoutDashboard,
  Globe,
  FileBarChart,
  Database,
  Clock,
  RefreshCw,
  Search,
  Calendar,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { AdminProvider, useAdmin } from "@/contexts/AdminContext";
import { AdminSearchProvider, useAdminSearch } from "@/contexts/AdminSearchContext";
import { cn } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-admin",
});

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/", label: "Beranda Website", icon: Globe, exact: true },
  { href: "/result", label: "Lihat Hasil Rekomendasi", icon: FileBarChart, exact: false },
];

const dataNavItems = [
  { href: "/admin/data", label: "Data Distrik", icon: Database, exact: false },
  { href: "/admin/audit", label: "Log Aktivitas", icon: Clock, exact: false },
];

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string | null;
  onNavigate: () => void;
}) {
  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname?.startsWith(href);
  }

  function renderLink({
    href,
    label,
    icon: Icon,
    exact,
  }: {
    href: string;
    label: string;
    icon: React.ElementType;
    exact: boolean;
  }) {
    const active = isActive(href, exact);
    return (
      <Link
        key={href}
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative mb-0.5 flex min-h-11 items-center gap-2.5 rounded-[10px] px-3 py-2 text-[12.5px] font-semibold transition-colors",
          active
            ? "bg-[var(--a-red-soft)] text-[var(--a-red)]"
            : "text-[var(--a-ink-2)] hover:bg-[#f4f1ee]"
        )}
      >
        <Icon className={cn("h-[15px] w-[15px] shrink-0", active ? "text-[var(--a-red)]" : "text-[var(--a-faint)]")} />
        {label}
        {active && (
          <span className="absolute -left-3.5 top-2 bottom-2 w-[3px] rounded-r-[3px] bg-[var(--a-red)]" />
        )}
      </Link>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2.5 px-2 pb-4 pt-0.5">
        <div
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-base font-extrabold text-white"
          style={{
            background: "linear-gradient(135deg,#f04156,var(--a-red-dark))",
            boxShadow: "0 4px 10px rgba(224,38,60,.28)",
          }}
        >
          F
        </div>
        <div>
          <div className="text-[13.5px] font-extrabold leading-tight tracking-tight text-[var(--a-ink)]">
            Freelance City Index
          </div>
          <div className="mt-px text-[10.5px] font-semibold text-[var(--a-muted)]">DIY Edition</div>
        </div>
      </div>

      <nav className="flex flex-col" aria-label="Navigasi admin">
        {navItems.map(renderLink)}

        <div className="px-3 pb-1.5 pt-4 text-[10px] font-bold uppercase tracking-[.1em] text-[var(--a-faint)]">
          Data &amp; Evaluasi
        </div>
        {dataNavItems.map(renderLink)}
      </nav>

      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-auto flex items-center gap-3 rounded-[12px] border p-3.5 text-left transition-shadow hover:shadow-[0_6px_16px_rgba(224,38,60,.12)]"
        style={{
          background: "linear-gradient(160deg,#fff5f6,var(--a-red-soft))",
          borderColor: "var(--a-red-border)",
        }}
      >
        <span
          className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[10px] border bg-white text-[var(--a-red)]"
          style={{ borderColor: "var(--a-red-border)" }}
        >
          <RefreshCw className="h-4 w-4" />
        </span>
        <span>
          <span className="block text-xs font-extrabold text-[var(--a-red)]">Muat Ulang Data</span>
          <span className="mt-0.5 block text-[10px] font-semibold leading-tight text-[#c46a78]">
            Sinkronisasi data distrik &amp; skor
          </span>
        </span>
      </button>
    </>
  );
}

function Topbar() {
  const { state, logout } = useAdmin();
  const { query, setQuery } = useAdminSearch();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    router.push("/admin/login");
  }

  return (
    <div className="mb-5 flex items-center gap-3.5 border-b border-[var(--a-line-2)] py-4">
      <label className="flex max-w-[340px] flex-1 items-center gap-2 rounded-[10px] border border-[var(--a-line-2)] bg-[var(--a-card)] px-3 py-2 transition-shadow focus-within:shadow-[0_0_0_3px_rgba(224,38,60,.07)]">
        <Search className="h-4 w-4 shrink-0 text-[var(--a-faint)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari distrik atau indikator…"
          className="w-full bg-transparent text-[12.5px] font-medium text-[var(--a-ink)] outline-none placeholder:text-[var(--a-faint)]"
        />
      </label>

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2 whitespace-nowrap rounded-[10px] border border-[var(--a-line-2)] bg-[var(--a-card)] px-3 py-2 text-xs font-bold text-[var(--a-ink-2)]">
          <Calendar className="h-3.5 w-3.5 text-[var(--a-muted)]" />
          {today}
        </div>

        <div className="h-6 w-px bg-[var(--a-line-2)]" />

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2.5 rounded-[10px] px-1.5 py-1 transition-colors hover:bg-[#efedeb]"
          >
            <div
              className="grid h-[34px] w-[34px] place-items-center rounded-[10px] text-xs font-extrabold text-white"
              style={{ background: "linear-gradient(135deg,#e5d8ca,#b7a89a)" }}
            >
              {(state.username || "A").slice(0, 1).toUpperCase()}
            </div>
            <div className="hidden text-left sm:block">
              <div className="text-xs font-extrabold leading-tight text-[var(--a-ink)]">
                {state.username || "Administrator"}
              </div>
              <div className="text-[10px] font-semibold text-[var(--a-muted)]">Admin</div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[var(--a-faint)]" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+8px)] z-20 w-44 overflow-hidden rounded-[12px] border border-[var(--a-line-2)] bg-[var(--a-card)] py-1.5 shadow-[0_8px_24px_rgba(25,29,39,.12)]"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[12.5px] font-semibold text-[var(--a-ink-2)] transition-colors hover:bg-[var(--a-red-soft)] hover:text-[var(--a-red)]"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { state } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const isForbiddenPage = pathname === "/admin/403";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Tunggu session check selesai dulu (!state.checking) sebelum redirect
  // Tanpa ini, redirect tembak saat isAuthenticated masih false sementara (checking)
  // yang menyebabkan gerak bolak-balik login ↔ admin. Sesi "forbidden" (ada
  // cookie tapi sudah tidak valid) diarahkan ke /admin/403, bukan /admin/login
  // langsung — beda pesan untuk "belum pernah login" vs "akses ditolak".
  useEffect(() => {
    if (state.checking || isLoginPage || isForbiddenPage) return;
    if (state.forbidden) {
      router.replace("/admin/403");
    } else if (!state.isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [state.checking, state.isAuthenticated, state.forbidden, isLoginPage, isForbiddenPage, router]);

  if (isLoginPage || isForbiddenPage) return <>{children}</>;
  if (state.checking) return null;
  if (!state.isAuthenticated) return null;

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[248px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col overflow-y-auto border-r border-[var(--a-line-2)] bg-[#fdfcfb] px-3.5 py-5 md:flex">
        <SidebarContent pathname={pathname} onNavigate={() => {}} />
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
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto border-r border-[var(--a-line-2)] bg-[#fdfcfb] px-3.5 py-5 transition-transform md:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Menu admin"
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="mb-2 ml-auto rounded p-1 text-[var(--a-muted)] hover:text-[var(--a-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Tutup menu"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarContent pathname={pathname} onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="min-w-0">
        {/* Mobile topbar */}
        <header className="flex items-center gap-3 border-b border-[var(--a-line-2)] bg-[var(--a-card)] px-4 py-3 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded p-1.5 text-[var(--a-muted)] hover:bg-[#f4f1ee] hover:text-[var(--a-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Buka menu navigasi"
            aria-expanded={sidebarOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="text-sm font-bold text-[var(--a-ink)]">Admin Panel</p>
        </header>

        <main className="px-4 pb-6 sm:px-6 lg:px-7">
          <div className="hidden md:block">
            <Topbar />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn(jakarta.variable, "admin-theme min-h-screen bg-[var(--a-bg)] font-[family-name:var(--font-admin)] text-[13px] text-[var(--a-ink)]")}>
      <AdminProvider>
        <AdminSearchProvider>
          <AdminLayoutInner>{children}</AdminLayoutInner>
        </AdminSearchProvider>
      </AdminProvider>
    </div>
  );
}
