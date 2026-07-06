"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  SlidersHorizontal,
  TrendingUp,
  Calendar,
  Wifi,
  DollarSign,
  Users,
  Leaf,
  Database,
  Clock,
  FileBarChart,
  Globe,
  Pencil,
  ArrowRight,
  TriangleAlert,
  CheckCircle2,
} from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useAdminSearch } from "@/contexts/AdminSearchContext";
import { useDistricts } from "@/hooks/useDistricts";
import { useAuditLog } from "@/hooks/useAuditLog";
import { BASE_WEIGHTS } from "@/lib/scoring/weights";
import { getDistrictVisual } from "@/data/districts.visuals";
import { cn } from "@/lib/utils";
import type { PersonaId } from "@/types/persona";
import type { IndicatorId } from "@/types/recommendation";

const INDICATOR_META: Array<{
  id: IndicatorId;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: "blue" | "amber" | "purple" | "green";
}> = [
  { id: "internet", label: "Internet", desc: "Kualitas dan kecepatan internet", icon: Wifi, color: "blue" },
  { id: "cost", label: "Biaya Hidup", desc: "Biaya hidup dan keterjangkauan", icon: DollarSign, color: "amber" },
  { id: "community", label: "Komunitas", desc: "Komunitas dan networking ekosistem", icon: Users, color: "purple" },
  { id: "environment", label: "Lingkungan", desc: "Lingkungan, kenyamanan, dan keamanan", icon: Leaf, color: "green" },
];

const PERSONA_TABS: Array<{ id: PersonaId; label: string }> = [
  { id: "tech-professional", label: "Tech" },
  { id: "creative-professional", label: "Creative" },
  { id: "student-fresh-graduate", label: "Student" },
  { id: "digital-nomad", label: "Nomad" },
];

const COLOR_MAP: Record<string, { soft: string; solid: string }> = {
  blue: { soft: "var(--a-blue-soft)", solid: "var(--a-blue)" },
  amber: { soft: "var(--a-amber-soft)", solid: "var(--a-amber)" },
  purple: { soft: "var(--a-purple-soft)", solid: "var(--a-purple)" },
  green: { soft: "var(--a-green-soft)", solid: "var(--a-green)" },
};

const INDICATOR_LABELS: Record<string, string> = {
  internet: "Internet",
  cost: "Biaya Hidup",
  community: "Komunitas",
  environment: "Lingkungan",
};

function isStale(updatedAt: string): boolean {
  return Date.now() - new Date(updatedAt).getTime() > 7 * 24 * 60 * 60 * 1000;
}

function formatDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    time: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
  };
}

function timeAgo(iso: string): string {
  const { date, time } = formatDateTime(iso);
  return `${date} · ${time}`;
}

export default function AdminDashboardPage() {
  const { state } = useAdmin();
  const { query } = useAdminSearch();
  const { districts, scores, loading, error } = useDistricts();
  const { logs, loading: logsLoading } = useAuditLog();
  const [persona, setPersona] = useState<PersonaId>("tech-professional");

  const scoreMap = useMemo(() => {
    const map: Record<string, Record<string, { skor: number; updatedAt: string }>> = {};
    for (const s of scores) {
      if (!map[s.districtId]) map[s.districtId] = {};
      map[s.districtId][s.indicatorId] = { skor: s.skor, updatedAt: s.updatedAt };
    }
    return map;
  }, [scores]);

  const avgScore = (districtId: string): number | null => {
    const entries = Object.values(scoreMap[districtId] ?? {});
    if (entries.length === 0) return null;
    return entries.reduce((sum, e) => sum + e.skor, 0) / entries.length;
  };

  const ranked = useMemo(() => {
    return [...districts]
      .map((d) => ({ district: d, avg: avgScore(d.id) }))
      .filter((r) => r.avg !== null)
      .sort((a, b) => (b.avg as number) - (a.avg as number));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districts, scoreMap]);

  const overallAvg =
    scores.length > 0 ? scores.reduce((sum, s) => sum + s.skor, 0) / scores.length : null;

  const latestUpdate = useMemo(() => {
    if (scores.length === 0) return null;
    return scores.reduce((latest, s) => (s.updatedAt > latest ? s.updatedAt : latest), scores[0].updatedAt);
  }, [scores]);

  const staleCount = useMemo(() => scores.filter((s) => isStale(s.updatedAt)).length, [scores]);

  const filteredDistricts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return districts;
    return districts.filter(
      (d) => d.nama.toLowerCase().includes(q) || d.ringkasanKarakteristik.toLowerCase().includes(q)
    );
  }, [districts, query]);

  if (!state.isAuthenticated) return null;

  return (
    <div className="pb-6">
      {/* Hero */}
      <div className="relative mb-3.5 overflow-hidden rounded-[18px] border border-[var(--a-line-2)] bg-white">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/kota-yogyakarta.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg,#fff 0%,#fff 38%,rgba(255,255,255,.8) 56%,rgba(255,255,255,.1) 84%)",
            }}
          />
        </div>
        <div className="relative z-[1] px-6 py-6 sm:px-7 sm:py-7">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[11.5px] font-bold"
            style={{ background: "var(--a-red-soft)", borderColor: "var(--a-red-border)", color: "var(--a-red)" }}
          >
            👋 Halo, {state.username || "Administrator"}!
          </span>
          <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-[var(--a-ink)] sm:text-[26px]">
            Selamat datang di panel admin
          </h1>
          <p className="mt-2 max-w-[440px] text-[12.5px] leading-relaxed text-[var(--a-muted)]">
            Kelola data distrik dan skor indikator Freelance City Index — DIY Edition dari satu tempat.
          </p>
        </div>
      </div>

      {/* Stale warning — FR-A tetap wajib, cuma restyle */}
      {staleCount > 0 && (
        <div
          className="mb-3.5 flex items-start gap-2.5 rounded-[12px] border px-4 py-3"
          style={{ borderColor: "var(--a-amber)", background: "var(--a-amber-soft)" }}
        >
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--a-amber)" }} />
          <p className="text-[12.5px] font-medium text-[var(--a-ink-2)]">
            <b>{staleCount} data indikator</b> belum diperbarui lebih dari 7 hari. Segera perbarui di
            Data Distrik agar skor tetap akurat.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-3.5 rounded-[12px] border border-[var(--a-red-border)] bg-[var(--a-red-soft)] px-4 py-3 text-[12.5px] font-medium text-[var(--a-red)]">
          Koneksi terputus. Coba muat ulang halaman.
        </div>
      )}

      {/* Stat cards */}
      <div className="mb-3.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={MapPin} color="red" title="Total Distrik" value={String(districts.length || 5)} sub="Distrik di DIY" />
        <StatCard icon={SlidersHorizontal} color="amber" title="Total Indikator" value="4" sub="Indikator Evaluasi" />
        <StatCard
          icon={TrendingUp}
          color="green"
          title="Rata-rata Skor"
          value={overallAvg !== null ? overallAvg.toFixed(1) : "–"}
          sub="Dari Semua Distrik"
        />
        <StatCard
          icon={Calendar}
          color="blue"
          title="Terakhir Diperbarui"
          value={latestUpdate ? formatDateTime(latestUpdate).date : "–"}
          sub={latestUpdate ? formatDateTime(latestUpdate).time : ""}
          small
        />
      </div>

      {loading ? (
        <div className="grid gap-3 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-[18px] bg-white" />
          ))}
        </div>
      ) : (
        <>
          {/* Row 2 */}
          <div className="mb-3 grid gap-3 lg:grid-cols-3">
            {/* Ringkasan Skor Distrik */}
            <Panel
              title="Ringkasan Skor Distrik"
              sub="Peringkat berdasarkan rata-rata skor"
              action={
                <Link
                  href="/admin/data"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-[8px] border border-[var(--a-line-2)] bg-white px-2.5 py-1.5 text-[11px] font-bold text-[var(--a-ink-2)] transition-colors hover:border-[#f2aab5] hover:text-[var(--a-red)]"
                >
                  Lihat Detail <ArrowRight className="h-3 w-3" />
                </Link>
              }
            >
              <div className="flex flex-col">
                {ranked.map(({ district, avg }, i) => (
                  <div
                    key={district.id}
                    className="flex items-center gap-2.5 border-b border-[#f4f5f8] py-2.5 last:border-b-0"
                  >
                    <span
                      className={cn(
                        "grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[7px] font-mono text-[10.5px] font-extrabold",
                        i === 0 ? "text-[#7a5408]" : "bg-[#f2f3f6] text-[var(--a-ink-2)]"
                      )}
                      style={i === 0 ? { background: "linear-gradient(135deg,#fbe3a2,#f2b93b)" } : undefined}
                    >
                      {i + 1}
                    </span>
                    <div className="h-[27px] w-9 shrink-0 overflow-hidden rounded-[7px] border border-[var(--a-line)]">
                      <Image
                        src={getDistrictVisual(district.id).imageUrl}
                        alt=""
                        width={36}
                        height={27}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 truncate text-[12.5px] font-bold text-[var(--a-ink)]">
                        {district.nama}
                        {i === 0 && (
                          <span className="rounded-[5px] border border-[#f3ddaa] bg-[var(--a-amber-soft)] px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wide text-[#a4720a]">
                            Tertinggi
                          </span>
                        )}
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#f0f1f5]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${avg}%`,
                            background:
                              (avg as number) >= 80
                                ? "linear-gradient(90deg,var(--a-red-dark),#f0637a)"
                                : "linear-gradient(90deg,#f2884f,#f7bd93)",
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-10 shrink-0 text-right font-mono text-[12.5px] font-extrabold text-[var(--a-ink)]">
                      {(avg as number).toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Bobot Indikator */}
            <Panel
              title="Bobot Indikator per Persona"
              sub="Dasar perhitungan rekomendasi"
              action={
                <span
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10.5px] font-extrabold"
                  style={{ background: "var(--a-green-soft)", borderColor: "#c8ead4", color: "var(--a-green)" }}
                >
                  <CheckCircle2 className="h-[11px] w-[11px]" /> Total 100%
                </span>
              }
            >
              <div className="mb-3 flex gap-1 rounded-[10px] bg-[#f2f1ee] p-1">
                {PERSONA_TABS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPersona(p.id)}
                    className={cn(
                      "flex-1 rounded-[8px] py-1.5 text-[11px] font-bold transition-colors",
                      persona === p.id ? "bg-white text-[var(--a-ink)] shadow-sm" : "text-[var(--a-muted)]"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col">
                {INDICATOR_META.map((ind) => {
                  const w = Math.round(BASE_WEIGHTS[persona][ind.id] * 100);
                  const c = COLOR_MAP[ind.color];
                  return (
                    <div key={ind.id} className="flex items-center gap-2.5 border-b border-[#f4f5f8] py-2.5 last:border-b-0">
                      <span
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-[8px]"
                        style={{ background: c.soft, color: c.solid }}
                      >
                        <ind.icon className="h-[13px] w-[13px]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[11.5px] font-bold text-[var(--a-ink)]">{ind.label}</div>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#f0f1f5]">
                          <div className="h-full rounded-full bg-[var(--a-ink-2)]" style={{ width: `${w}%` }} />
                        </div>
                      </div>
                      <div className="w-9 shrink-0 text-right font-mono text-[12.5px] font-extrabold text-[var(--a-ink)]">
                        {w}%
                      </div>
                    </div>
                  );
                })}
              </div>

              <PanelFoot href="/algoritma" label="Lihat Detail Algoritma" />
            </Panel>

            {/* Aktivitas Terbaru */}
            <Panel title="Aktivitas Terbaru" sub="5 perubahan skor terakhir">
              {logsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 animate-pulse rounded-lg bg-[#f4f5f8]" />
                  ))}
                </div>
              ) : logs.length === 0 ? (
                <p className="py-6 text-center text-[12px] text-[var(--a-muted)]">
                  Belum ada perubahan data yang tercatat.
                </p>
              ) : (
                <div className="flex flex-col">
                  {logs.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-start gap-2.5 border-b border-[#f4f5f8] py-2.5 last:border-b-0">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[8px]" style={{ background: "var(--a-red-soft)", color: "var(--a-red)" }}>
                        <SlidersHorizontal className="h-[13px] w-[13px]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-semibold leading-snug text-[var(--a-ink-2)]">
                          Mengubah skor <b>{INDICATOR_LABELS[entry.indicatorId] ?? entry.indicatorId}</b>{" "}
                          {entry.subDistrictNama ? "kecamatan" : "distrik"}{" "}
                          <b>
                            {entry.subDistrictNama
                              ? `${entry.subDistrictNama} (${entry.district?.nama ?? entry.districtId})`
                              : (entry.district?.nama ?? entry.districtId)}
                          </b>{" "}
                          ({entry.nilaiLama}→{entry.nilaiBaru})
                        </p>
                        <p className="mt-0.5 font-mono text-[10.5px] font-semibold text-[var(--a-faint)]">
                          {timeAgo(entry.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <PanelFoot href="/admin/audit" label="Buka Log Aktivitas" />
            </Panel>
          </div>

          {/* Row 3 */}
          <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
            {/* Data Distrik */}
            <Panel
              title="Data Distrik"
              sub={`${filteredDistricts.length} distrik terdaftar`}
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--a-line)] text-[10px] font-bold uppercase tracking-wide text-[var(--a-faint)]">
                      <th className="w-8 pb-2 font-bold">No</th>
                      <th className="pb-2 font-bold">Nama Distrik</th>
                      <th className="pb-2 font-bold">Deskripsi Singkat</th>
                      <th className="w-14 pb-2 text-right font-bold">Skor</th>
                      <th className="w-12 pb-2 text-right font-bold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDistricts.map((d, i) => {
                      const avg = avgScore(d.id);
                      return (
                        <tr key={d.id} className="border-b border-[#f4f5f8] text-[12px] last:border-b-0">
                          <td className="py-2.5 font-mono text-[var(--a-faint)]">{i + 1}</td>
                          <td className="py-2.5 font-bold text-[var(--a-ink)]">{d.nama}</td>
                          <td className="py-2.5 pr-3 text-[11px] font-medium leading-relaxed text-[var(--a-muted)]">
                            {d.ringkasanKarakteristik}
                          </td>
                          <td className="py-2.5 text-right">
                            {avg !== null ? (
                              <span
                                className="inline-block rounded-[7px] px-2 py-0.5 font-mono text-[11.5px] font-extrabold"
                                style={
                                  avg >= 80
                                    ? { background: "var(--a-green-soft)", color: "var(--a-green)" }
                                    : { background: "var(--a-orange-soft)", color: "var(--a-orange)" }
                                }
                              >
                                {avg.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-[var(--a-faint)]">–</span>
                            )}
                          </td>
                          <td className="py-2.5 text-right">
                            <Link
                              href="/admin/data"
                              aria-label={`Edit skor ${d.nama}`}
                              className="ml-auto grid h-[26px] w-[26px] place-items-center rounded-[8px] border border-[var(--a-line-2)] text-[var(--a-muted)] transition-colors hover:border-[#f2aab5] hover:bg-[var(--a-red-soft)] hover:text-[var(--a-red)]"
                            >
                              <Pencil className="h-3 w-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <PanelFoot href="/admin/data" label="Kelola Semua Distrik" />
            </Panel>

            {/* Menu Cepat */}
            <Panel title="Menu Cepat" sub="Akses fitur yang sering digunakan">
              <div className="grid grid-cols-2 gap-2.5">
                <QuickTile href="/admin/data" icon={Database} title="Data Distrik" sub="Ubah skor tiap distrik" />
                <QuickTile href="/admin/audit" icon={Clock} title="Log Aktivitas" sub="Riwayat perubahan skor" />
                <QuickTile href="/result" icon={FileBarChart} title="Lihat Hasil" sub="Preview rekomendasi" />
                <QuickTile href="/" icon={Globe} title="Beranda Website" sub="Buka situs publik" />
              </div>
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  color,
  title,
  value,
  sub,
  small,
}: {
  icon: React.ElementType;
  color: "red" | "amber" | "green" | "blue";
  title: string;
  value: string;
  sub: string;
  small?: boolean;
}) {
  const colors: Record<string, { soft: string; solid: string }> = {
    red: { soft: "var(--a-red-soft)", solid: "var(--a-red)" },
    amber: { soft: "var(--a-amber-soft)", solid: "var(--a-amber)" },
    green: { soft: "var(--a-green-soft)", solid: "var(--a-green)" },
    blue: { soft: "var(--a-blue-soft)", solid: "var(--a-blue)" },
  };
  const c = colors[color];
  return (
    <div className="rounded-[12px] border border-[var(--a-line-2)] bg-white p-4 shadow-[0_1px_2px_rgba(25,29,39,.04)] transition-transform hover:-translate-y-0.5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-bold text-[var(--a-muted)]">{title}</span>
        <span className="grid h-[34px] w-[34px] place-items-center rounded-[9px]" style={{ background: c.soft, color: c.solid }}>
          <Icon className="h-[15px] w-[15px]" />
        </span>
      </div>
      <div className={cn("font-mono font-extrabold tracking-tight text-[var(--a-ink)]", small ? "text-base" : "text-[22px]")}>
        {value}
      </div>
      <div className="mt-0.5 text-[10.5px] font-semibold text-[var(--a-faint)]">{sub}</div>
    </div>
  );
}

function Panel({
  title,
  sub,
  action,
  children,
}: {
  title: string;
  sub: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col rounded-[18px] border border-[var(--a-line-2)] bg-white p-4 shadow-[0_1px_2px_rgba(25,29,39,.04)] sm:p-5">
      <div className="mb-3.5 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-[13.5px] font-extrabold tracking-tight text-[var(--a-ink)]">{title}</h2>
          <p className="mt-0.5 text-[10.5px] font-semibold text-[var(--a-faint)]">{sub}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function PanelFoot({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-auto pt-3.5">
      <Link
        href={href}
        className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-[var(--a-line-2)] bg-[#fbfaf9] py-2.5 text-[11.5px] font-bold text-[var(--a-ink-2)] transition-colors hover:border-[#f2aab5] hover:bg-white hover:text-[var(--a-red)]"
      >
        {label} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function QuickTile({
  href,
  icon: Icon,
  title,
  sub,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[12px] border border-[var(--a-line-2)] bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:border-[#f2aab5] hover:shadow-[0_8px_20px_rgba(224,38,60,.08)]"
    >
      <div className="mb-2.5 grid h-[30px] w-[30px] place-items-center rounded-[9px]" style={{ background: "var(--a-red-soft)", color: "var(--a-red)" }}>
        <Icon className="h-[14px] w-[14px]" />
      </div>
      <div className="text-[11.5px] font-extrabold tracking-tight text-[var(--a-ink)]">{title}</div>
      <div className="mt-0.5 text-[10px] font-semibold leading-tight text-[var(--a-muted)]">{sub}</div>
    </Link>
  );
}

