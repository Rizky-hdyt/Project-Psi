"use client";

import { useState, useEffect } from "react";
import { ClipboardList } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const INDICATOR_LABELS: Record<string, string> = {
  internet: "Internet",
  cost: "Biaya Hidup",
  community: "Komunitas",
  environment: "Lingkungan",
};

interface AuditEntry {
  id: string;
  districtId: string;
  indicatorId: string;
  oldValue: number;
  newValue: number;
  operator: string;
  createdAt: string;
  district?: { nama: string };
}

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

  const isEmpty = !loading && !error && logs.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink">Audit Log</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Riwayat 100 perubahan data indikator terakhir.
        </p>
      </div>

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-error/30 bg-error-bg px-4 py-3">
          <p className="text-sm text-error">Koneksi terputus. Coba muat ulang halaman.</p>
        </div>
      )}

      {isEmpty && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line bg-white py-16 text-center">
          <ClipboardList className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Belum ada perubahan data yang tercatat.
          </p>
        </div>
      )}

      {!loading && !error && logs.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-line bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="font-semibold text-ink">Waktu</TableHead>
                  <TableHead className="font-semibold text-ink">Distrik</TableHead>
                  <TableHead className="font-semibold text-ink">Indikator</TableHead>
                  <TableHead className="text-center font-semibold text-ink">Nilai Lama</TableHead>
                  <TableHead className="text-center font-semibold text-ink">Nilai Baru</TableHead>
                  <TableHead className="font-semibold text-ink">Operator</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((entry) => {
                  const changed = entry.newValue !== entry.oldValue;
                  const increased = entry.newValue > entry.oldValue;
                  return (
                    <TableRow key={entry.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimestamp(entry.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-ink">
                        {entry.district?.nama ?? entry.districtId}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {INDICATOR_LABELS[entry.indicatorId] ?? entry.indicatorId}
                      </TableCell>
                      <TableCell className="text-center font-mono text-sm text-muted-foreground">
                        {entry.oldValue}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`font-mono text-sm font-semibold ${
                            !changed
                              ? "text-muted-foreground"
                              : increased
                              ? "text-sawah"
                              : "text-pesisir"
                          }`}
                        >
                          {entry.newValue}
                          {changed && (
                            <span className="ml-1 text-xs font-normal">
                              ({increased ? "+" : ""}{entry.newValue - entry.oldValue})
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {entry.operator}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <p className="text-xs text-muted-foreground">
            Menampilkan {logs.length} entri terakhir.
          </p>
        </>
      )}
    </div>
  );
}
