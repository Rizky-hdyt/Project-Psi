"use client";

import { useState, useEffect } from "react";

export interface AuditEntry {
  id: string;
  districtId: string;
  indicatorId: string;
  nilaiLama: number;
  nilaiBaru: number;
  operator: string;
  createdAt: string;
  district?: { nama: string };
}

interface UseAuditLogResult {
  logs: AuditEntry[];
  loading: boolean;
  error: string | null;
}

// Dipakai di Dashboard (preview 5 entri) dan halaman Log Aktivitas penuh —
// satu sumber fetch, jangan duplikasi (CLAUDE.md §15.10).
export function useAuditLog(): UseAuditLogResult {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/audit")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat audit log");
        return res.json() as Promise<AuditEntry[]>;
      })
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return { logs, loading, error };
}
