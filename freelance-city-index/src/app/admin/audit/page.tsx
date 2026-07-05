"use client";

import { useMemo } from "react";
import { ClipboardList, SlidersHorizontal } from "lucide-react";
import { useAdminSearch } from "@/contexts/AdminSearchContext";
import { useAuditLog } from "@/hooks/useAuditLog";

const INDICATOR_LABELS: Record<string, string> = {
  internet: "Internet",
  cost: "Biaya Hidup",
  community: "Komunitas",
  environment: "Lingkungan",
};

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export default function AuditLogPage() {
  const { query } = useAdminSearch();
  const { logs, loading, error } = useAuditLog();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter(
      (l) =>
        (l.district?.nama ?? l.districtId).toLowerCase().includes(q) ||
        (INDICATOR_LABELS[l.indicatorId] ?? l.indicatorId).toLowerCase().includes(q)
    );
  }, [logs, query]);

  const isEmpty = !loading && !error && filtered.length === 0;

  return (
    <div className="pb-6">
      <div className="mb-4">
        <h1 className="text-[19px] font-extrabold tracking-tight text-[var(--a-ink)]">Log Aktivitas</h1>
        <p className="mt-1 text-[12.5px] font-medium text-[var(--a-muted)]">
          Riwayat 100 perubahan skor indikator terakhir.
        </p>
      </div>

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-[12px] bg-white" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-[12px] border border-[var(--a-red-border)] bg-[var(--a-red-soft)] px-4 py-3 text-[12.5px] font-medium text-[var(--a-red)]">
          Koneksi terputus. Coba muat ulang halaman.
        </div>
      )}

      {isEmpty && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-[16px] border border-dashed border-[var(--a-line-2)] bg-white py-16 text-center">
          <ClipboardList className="h-8 w-8 text-[var(--a-faint)]" />
          <p className="text-[12.5px] font-medium text-[var(--a-muted)]">
            {query
              ? `Tidak ada aktivitas yang cocok dengan "${query}".`
              : "Belum ada perubahan data yang tercatat."}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-[16px] border border-[var(--a-line-2)] bg-white shadow-[0_1px_2px_rgba(25,29,39,.04)]">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--a-line)] bg-[#fafafb] text-[10px] font-bold uppercase tracking-wide text-[var(--a-faint)]">
                  <th className="px-4 py-3 font-bold">Waktu</th>
                  <th className="px-4 py-3 font-bold">Distrik</th>
                  <th className="px-4 py-3 font-bold">Indikator</th>
                  <th className="px-4 py-3 text-center font-bold">Nilai Lama</th>
                  <th className="px-4 py-3 text-center font-bold">Nilai Baru</th>
                  <th className="px-4 py-3 font-bold">Operator</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => {
                  const changed = entry.nilaiBaru !== entry.nilaiLama;
                  const increased = entry.nilaiBaru > entry.nilaiLama;
                  return (
                    <tr key={entry.id} className="border-b border-[#f4f5f8] text-[12px] last:border-b-0 hover:bg-[#fafafb]">
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-[var(--a-faint)]">
                        {formatTimestamp(entry.createdAt)}
                      </td>
                      <td className="px-4 py-3 font-bold text-[var(--a-ink)]">
                        <span className="flex items-center gap-2">
                          <span
                            className="grid h-6 w-6 shrink-0 place-items-center rounded-[7px]"
                            style={{ background: "var(--a-red-soft)", color: "var(--a-red)" }}
                          >
                            <SlidersHorizontal className="h-3 w-3" />
                          </span>
                          {entry.district?.nama ?? entry.districtId}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-[var(--a-muted)]">
                        {INDICATOR_LABELS[entry.indicatorId] ?? entry.indicatorId}
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-[var(--a-muted)]">
                        {entry.nilaiLama}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className="font-mono font-extrabold"
                          style={{
                            color: !changed
                              ? "var(--a-muted)"
                              : increased
                                ? "var(--a-green)"
                                : "var(--a-orange)",
                          }}
                        >
                          {entry.nilaiBaru}
                          {changed && (
                            <span className="ml-1 text-[10px] font-semibold">
                              ({increased ? "+" : ""}
                              {entry.nilaiBaru - entry.nilaiLama})
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-[var(--a-muted)]">{entry.operator}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-2.5 text-[11px] font-semibold text-[var(--a-faint)]">
            Menampilkan {filtered.length} dari {logs.length} entri.
          </p>
        </>
      )}
    </div>
  );
}
