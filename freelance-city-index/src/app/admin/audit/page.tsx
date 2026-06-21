"use client";

import { useMemo } from "react";
import { ClipboardList } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import districtsData from "@/data/districts.seed.json";

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
  const { state } = useAdmin();

  const districtName = useMemo(() => {
    const map: Record<string, string> = {};
    for (const d of districtsData.districts) map[d.id] = d.nama;
    return map;
  }, []);

  const isEmpty = state.auditLog.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink">Audit Log</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Riwayat perubahan data indikator dalam sesi ini.
        </p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line bg-white py-16 text-center">
          <ClipboardList className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Belum ada perubahan data dalam sesi ini.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-white">
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
              {state.auditLog.map((entry) => {
                const changed = entry.newValue !== entry.oldValue;
                const increased = entry.newValue > entry.oldValue;
                return (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(entry.timestamp)}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-ink">
                      {districtName[entry.districtId] ?? entry.districtId}
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
                            : "text-error"
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
      )}

      {!isEmpty && (
        <p className="text-xs text-muted-foreground">
          {state.auditLog.length} perubahan dalam sesi ini. Log direset saat halaman di-refresh.
        </p>
      )}
    </div>
  );
}
