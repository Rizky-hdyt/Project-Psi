"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AdminSearchContextValue {
  query: string;
  setQuery: (q: string) => void;
}

const AdminSearchContext = createContext<AdminSearchContextValue | null>(null);

// Query pencarian topbar admin dibagi lewat context (bukan URL param) supaya
// tiap halaman admin (Dashboard/Data Distrik/Audit) bisa filter listing
// masing-masing dari satu kotak cari yang sama di layout — nyata memfilter
// data asli, bukan sekadar dekorasi visual (CLAUDE.md §0.2: fitur di mockup
// yang belum ada logikanya tidak boleh ditampilkan seolah berfungsi).
export function AdminSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  return (
    <AdminSearchContext.Provider value={{ query, setQuery }}>
      {children}
    </AdminSearchContext.Provider>
  );
}

export function useAdminSearch() {
  const ctx = useContext(AdminSearchContext);
  if (!ctx) throw new Error("useAdminSearch must be used within AdminSearchProvider");
  return ctx;
}
