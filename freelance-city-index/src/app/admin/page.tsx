"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Database, ClipboardList, TriangleAlert } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useDistricts } from "@/hooks/useDistricts";
import { Button } from "@/components/ui/button";
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

const INDICATORS = ["internet", "cost", "community", "environment"] as const;

function isStale(updatedAt: string): boolean {
  const diff = Date.now() - new Date(updatedAt).getTime();
  return diff > 7 * 24 * 60 * 60 * 1000;
}

export default function AdminDashboardPage() {
  const { state } = useAdmin();
  const { districts, scores, loading, error } = useDistricts();

  const scoreMap = useMemo(() => {
    const map: Record<string, Record<string, { skor: number; updatedAt: string }>> = {};
    for (const s of scores) {
      if (!map[s.districtId]) map[s.districtId] = {};
      map[s.districtId][s.indicatorId] = { skor: s.skor, updatedAt: s.updatedAt };
    }
    return map;
  }, [scores]);

  const staleCount = useMemo(
    () => scores.filter((s) => isStale(s.updatedAt)).length,
    [scores]
  );

  if (!state.isAuthenticated) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Ringkasan skor indikator 5 distrik DIY
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/data">
            <Button size="sm" className="gap-1.5 bg-sawah text-white hover:bg-sawah/90">
              <Database className="h-3.5 w-3.5" />
              Update Data
            </Button>
          </Link>
          <Link href="/admin/audit">
            <Button size="sm" variant="outline" className="gap-1.5">
              <ClipboardList className="h-3.5 w-3.5" />
              Audit Log
            </Button>
          </Link>
        </div>
      </div>

      {/* Stale warning */}
      {staleCount > 0 && (
        <div className="flex items-start gap-2.5 rounded-lg border border-warning/30 bg-warning-bg px-4 py-3">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <p className="text-sm text-warning">
            <span className="font-medium">{staleCount} data indikator</span> belum diperbarui lebih
            dari 7 hari. Segera perbarui agar skor tetap akurat.
          </p>
        </div>
      )}

      {/* Loading / error states */}
      {loading && (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-error/30 bg-error-bg px-4 py-3">
          <p className="text-sm text-error">Koneksi terputus. Coba muat ulang halaman.</p>
        </div>
      )}

      {/* Scores table */}
      {!loading && !error && (
        <div className="overflow-hidden rounded-lg border border-line bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-40 font-semibold text-ink">Distrik</TableHead>
                {INDICATORS.map((id) => (
                  <TableHead key={id} className="text-center font-semibold text-ink">
                    {INDICATOR_LABELS[id]}
                  </TableHead>
                ))}
                <TableHead className="text-center font-semibold text-ink">UMK</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {districts.map((district) => {
                const districtScores = scoreMap[district.id] ?? {};
                const hasStale = INDICATORS.some(
                  (ind) => districtScores[ind] && isStale(districtScores[ind].updatedAt)
                );
                return (
                  <TableRow
                    key={district.id}
                    className={hasStale ? "bg-warning-bg" : ""}
                  >
                    <TableCell className="font-medium text-ink">
                      <div className="flex flex-col">
                        <span>{district.nama}</span>
                        {hasStale && (
                          <span className="text-xs text-warning">Data &gt;7 hari lalu</span>
                        )}
                      </div>
                    </TableCell>
                    {INDICATORS.map((ind) => {
                      const entry = districtScores[ind];
                      const stale = entry ? isStale(entry.updatedAt) : false;
                      return (
                        <TableCell key={ind} className="text-center">
                          {entry ? (
                            <span
                              className={`font-mono text-sm font-semibold ${
                                stale ? "text-warning" : "text-ink"
                              }`}
                            >
                              {entry.skor}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center font-mono text-sm text-muted-foreground">
                      {(district.umk / 1_000_000).toFixed(2)}jt
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Semua skor skala 0–100. Baris kuning = ada indikator yang belum diperbarui lebih dari 7
        hari.
      </p>
    </div>
  );
}
