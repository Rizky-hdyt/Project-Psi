"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Laptop, Palette, GraduationCap, Globe,
  Wifi, Wallet, Users, TreePine,
  ArrowRight, Database, RefreshCw, Shield, Sigma,
} from "lucide-react";

// ─── Tipe & data ────────────────────────────────────────────────

type TabId = "cara-kerja" | "bobot" | "formula" | "data";
type PersonaId = "tech" | "creative" | "student" | "nomad";

const TABS: { id: TabId; label: string }[] = [
  { id: "cara-kerja", label: "Cara Kerja" },
  { id: "bobot",      label: "Bobot Kriteria" },
  { id: "formula",    label: "Formula Scoring" },
  { id: "data",       label: "Sumber Data" },
];

const PERSONAS: {
  id: PersonaId;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  weights: { internet: number; cost: number; community: number; environment: number };
  tagline: string;
}[] = [
  {
    id: "tech",
    label: "Tech Professional",
    shortLabel: "Tech",
    icon: Laptop,
    color: "#3B5BA5",
    bg: "#E8ECF7",
    weights: { internet: 40, cost: 25, community: 20, environment: 15 },
    tagline: "Internet jadi prioritas utama, koneksi stabil adalah syarat kerja.",
  },
  {
    id: "creative",
    label: "Creative Professional",
    shortLabel: "Creative",
    icon: Palette,
    color: "#946638",
    bg: "#F3EAE0",
    weights: { internet: 20, cost: 25, community: 25, environment: 30 },
    tagline: "Lingkungan & komunitas sama pentingnya, inspirasi datang dari suasana.",
  },
  {
    id: "student",
    label: "Student & Fresh Grad",
    shortLabel: "Student",
    icon: GraduationCap,
    color: "#2F7A6E",
    bg: "#E7F3F1",
    weights: { internet: 20, cost: 45, community: 20, environment: 15 },
    tagline: "Biaya hidup adalah penentu utama, efisiensi anggaran nomor satu.",
  },
  {
    id: "nomad",
    label: "Digital Nomad",
    shortLabel: "Nomad",
    icon: Globe,
    color: "#6B5A3F",
    bg: "#F0EBE3",
    weights: { internet: 30, cost: 25, community: 25, environment: 20 },
    tagline: "Profil paling seimbang, semua indikator relevan, tidak ada yang diabaikan.",
  },
];

const INDICATORS: {
  key: keyof typeof PERSONAS[0]["weights"];
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  { key: "internet",    label: "Internet",    icon: Wifi,     color: "#3B5BA5" },
  { key: "cost",        label: "Biaya Hidup", icon: Wallet,   color: "#946638" },
  { key: "community",   label: "Komunitas",   icon: Users,    color: "#2F7A6E" },
  { key: "environment", label: "Lingkungan",  icon: TreePine, color: "#6B5A3F" },
];

const DATA_SOURCES = [
  { nama: "Speedtest Global Index", keterangan: "Kualitas & kecepatan internet", frekuensi: "Triwulanan", icon: Wifi },
  { nama: "BPS & Survei Biaya Hidup", keterangan: "UMK & estimasi pengeluaran", frekuensi: "Tahunan", icon: Wallet },
  { nama: "Survei Komunitas Lokal", keterangan: "Coworking & jaringan profesional", frekuensi: "Semesteran", icon: Users },
  { nama: "Penilaian Lingkungan Kerja", keterangan: "Kebisingan & kenyamanan", frekuensi: "Semesteran", icon: TreePine },
  { nama: "Wawancara Freelancer DIY", keterangan: "Validasi kualitatif lapangan", frekuensi: "Tahunan", icon: Database },
];

// ─── Sub-komponen ────────────────────────────────────────────────

function TabCaraKerja() {
  return (
    <div className="space-y-6">
      {/* 3 metric boxes */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { val: "4", label: "Indikator Penilaian", color: "#3B5BA5", bg: "#E8ECF7" },
          { val: "4", label: "Profil Pengguna", color: "#946638", bg: "#F3EAE0" },
          { val: "100", label: "Skor Maksimum", color: "#2F7A6E", bg: "#E7F3F1" },
        ].map(({ val, label, color, bg }) => (
          <div key={label} className="rounded-xl border border-line p-4 text-center" style={{ backgroundColor: bg }}>
            <p className="font-mono text-2xl font-bold sm:text-3xl" style={{ color }}>{val}</p>
            <p className="mt-1 text-[11px] font-medium text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* 4 keunggulan */}
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { icon: Shield,     judul: "Deterministik",   desc: "Input yang sama selalu menghasilkan output yang sama. Bukan AI yang hasilnya bisa berubah." },
          { icon: Users,      judul: "Personalisasi",   desc: "Bobot indikator disesuaikan otomatis berdasarkan profil dan 4 preferensi masing-masing pengguna." },
          { icon: Sigma,      judul: "Transparan",       desc: "Setiap komponen skor ditampilkan terbuka, Anda tahu persis mengapa suatu distrik direkomendasikan." },
          { icon: RefreshCw,  judul: "Validasi Rutin",  desc: "Data distrik diperbarui secara berkala dari survei lapangan dan sumber data resmi." },
        ].map(({ icon: Icon, judul, desc }) => (
          <div key={judul} className="flex gap-3 rounded-xl border border-line bg-paper p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sawah/10">
              <Icon className="h-4 w-4 text-sawah" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{judul}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabBobot() {
  const [activePersona, setActivePersona] = useState<PersonaId>("tech");
  const persona = PERSONAS.find((p) => p.id === activePersona)!;

  return (
    <div className="space-y-5">
      {/* Kalimat kunci */}
      <div className="rounded-xl border border-sawah/20 bg-sawah/5 px-4 py-3">
        <p className="text-sm font-medium text-ink">
          Bobot kriteria <span className="font-bold text-sawah">tidak bisa sama untuk semua orang</span>, karena setiap freelancer punya prioritas yang berbeda.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Klik persona di bawah untuk melihat bagaimana bobot berubah secara otomatis.
        </p>
      </div>

      {/* Persona switcher */}
      <div className="flex flex-wrap gap-2">
        {PERSONAS.map((p) => {
          const isActive = activePersona === p.id;
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePersona(p.id)}
              className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200"
              style={isActive ? {
                borderColor: p.color,
                backgroundColor: p.bg,
                color: p.color,
                boxShadow: `0 2px 8px ${p.color}30`,
              } : {
                borderColor: "#E2E8F0",
                backgroundColor: "#fff",
                color: "#6B6E76",
              }}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{p.shortLabel}</span>
              <span className="sm:hidden">{p.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Tagline persona aktif */}
      <p className="text-sm italic text-muted-foreground">{persona.tagline}</p>

      {/* Animated weight bars */}
      <div className="space-y-4">
        {INDICATORS.map(({ key, label, icon: Icon, color }) => {
          const pct = persona.weights[key];
          return (
            <div key={key}>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-md"
                    style={{ backgroundColor: `${color}18` }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color }} />
                  </div>
                  <span className="text-sm font-medium text-ink">{label}</span>
                </div>
                <span className="font-mono text-sm font-bold" style={{ color }}>{pct}%</span>
              </div>
              <div
                className="h-3 overflow-hidden rounded-full"
                style={{ backgroundColor: "#E2E8F0" }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabel perbandingan semua persona */}
      <details className="group">
        <summary className="cursor-pointer list-none rounded-lg border border-dashed border-line px-4 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-ink">
          <span className="group-open:hidden">▶ Bandingkan semua persona sekaligus</span>
          <span className="hidden group-open:inline">▼ Sembunyikan perbandingan</span>
        </summary>
        <div className="mt-3 overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-line bg-paper">
                <th className="py-2.5 pl-4 text-left font-semibold text-muted-foreground">Indikator</th>
                {PERSONAS.map((p) => (
                  <th key={p.id} className="px-3 py-2.5 text-center font-semibold" style={{ color: p.color }}>
                    {p.shortLabel}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INDICATORS.map(({ key, label }) => (
                <tr key={key} className="border-b border-line last:border-0">
                  <td className="py-2.5 pl-4 text-muted-foreground">{label}</td>
                  {PERSONAS.map((p) => {
                    const pct = p.weights[key];
                    const isHighest = PERSONAS.every((q) => q.id === p.id || q.weights[key] <= pct);
                    return (
                      <td key={p.id} className="px-3 py-2.5 text-center">
                        <span
                          className="inline-block rounded-md px-2 py-0.5 font-mono font-bold"
                          style={isHighest
                            ? { backgroundColor: p.bg, color: p.color }
                            : { color: "#6B6E76" }}
                        >
                          {pct}%
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <p className="text-center font-mono text-[10px] text-muted-foreground">
        Bobot di atas adalah nilai dasar · Preferensi internet/komunitas/lingkungan dari quiz akan menyesuaikannya lebih lanjut
      </p>
    </div>
  );
}

function TabFormula() {
  const [activePersona, setActivePersona] = useState<PersonaId>("tech");
  const persona = PERSONAS.find((p) => p.id === activePersona)!;

  // Contoh skor Sleman dari reference case CLAUDE.md §4.4
  const SLEMAN_SCORES = { internet: 85, cost: 70, community: 80, environment: 75 };

  const components = INDICATORS.map(({ key, label, color }) => ({
    label,
    color,
    skor: SLEMAN_SCORES[key],
    bobot: persona.weights[key],
    kontribusi: (SLEMAN_SCORES[key] * persona.weights[key]) / 100,
  }));

  const totalSkor = components.reduce((sum, c) => sum + c.kontribusi, 0);

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-ink p-5 font-mono text-sm">
        <p className="mb-3 text-xs text-white/50">Formula Weighted Scoring</p>
        <p className="text-paper">
          Skor_distrik{" "}
          <span className="text-white/60">=</span>
          {" Σ (skor_indikator × bobot_persona)"}
        </p>
        <div className="mt-4 border-t border-white/10 pt-4 text-xs text-white/50">
          setelah sinyal input user diterapkan → bobot direnormalisasi (Σ bobot = 100%)
        </div>
      </div>

      {/* Persona switcher kecil */}
      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">Coba dengan persona:</p>
        <div className="flex flex-wrap gap-2">
          {PERSONAS.map((p) => {
            const Icon = p.icon;
            const isActive = activePersona === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePersona(p.id)}
                className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all"
                style={isActive ? { borderColor: p.color, backgroundColor: p.bg, color: p.color }
                  : { borderColor: "#E2E8F0", color: "#6B6E76" }}
              >
                <Icon className="h-3 w-3" />
                {p.shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contoh kalkulasi Sleman */}
      <div className="rounded-xl border border-line overflow-hidden">
        <div className="bg-paper px-4 py-3 border-b border-line">
          <p className="text-xs font-semibold text-ink">Contoh: Sleman · {persona.label}</p>
        </div>
        <div className="divide-y divide-line">
          {components.map(({ label, color, skor, bobot, kontribusi }) => (
            <div key={label} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-ink">{label}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <span className="rounded bg-paper px-1.5 py-0.5 text-ink">{skor}</span>
                <span>×</span>
                <span className="rounded px-1.5 py-0.5" style={{ backgroundColor: `${color}18`, color }}>
                  {bobot}%
                </span>
                <span>=</span>
                <span className="font-semibold text-ink">{kontribusi.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
        <div
          className="flex items-center justify-between px-4 py-3 border-t-2"
          style={{ borderColor: persona.color, backgroundColor: `${persona.color}08` }}
        >
          <span className="text-sm font-bold text-ink">Total Skor Sleman</span>
          <span className="font-mono text-xl font-bold" style={{ color: persona.color }}>
            {totalSkor.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

function TabData() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Data tiap indikator berasal dari sumber terverifikasi dan diperbarui secara berkala oleh tim kurator.
      </p>
      <div className="divide-y divide-line rounded-xl border border-line overflow-hidden">
        {DATA_SOURCES.map(({ nama, keterangan, frekuensi, icon: Icon }) => (
          <div key={nama} className="flex items-center justify-between gap-3 bg-white px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sawah/8">
                <Icon className="h-4 w-4 text-sawah" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{nama}</p>
                <p className="text-[11px] text-muted-foreground">{keterangan}</p>
              </div>
            </div>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {frekuensi}
            </span>
          </div>
        ))}
      </div>
      <p className="text-center font-mono text-[10px] text-muted-foreground">
        Data distrik yang kedaluwarsa (&gt;7 hari) ditandai kuning di Admin Panel · V1 MVP
      </p>
    </div>
  );
}

// ─── Komponen utama ──────────────────────────────────────────────
// Dipakai hanya di /algoritma (standalone). Landing punya section
// transparansi sendiri, jangan reuse komponen ini di sana (CLAUDE.md §6).

export function AlgorithmSection() {
  const [activeTab, setActiveTab] = useState<TabId>("bobot");

  return (
    <section>
      <div className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6 sm:py-14">
        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Cara Kerja Algoritma
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Sistem ini tidak punya satu bobot tunggal yang berlaku untuk semua orang.
            Setiap persona mendapat bobot yang berbeda, karena kebutuhan freelancer memang tidak sama.
          </p>
        </div>

        {/* Tab bar */}
        <div className="mb-8 flex gap-1 overflow-x-auto rounded-xl border border-line bg-muted p-1">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-[180ms] ${
                activeTab === id ? "bg-white font-semibold text-ink shadow-sm" : "text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="min-h-[320px]">
          {activeTab === "cara-kerja" && <TabCaraKerja />}
          {activeTab === "bobot"      && <TabBobot />}
          {activeTab === "formula"    && <TabFormula />}
          {activeTab === "data"       && <TabData />}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-line pt-8">
          <p className="text-sm text-muted-foreground">
            Ingin tahu bobot Anda sendiri berdasarkan profil dan preferensi yang Anda isi?
          </p>
          <Link
            href="/quiz"
            className="flex items-center gap-1.5 rounded-xl bg-sawah px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(194,65,12,0.30)] transition-all hover:bg-sawah/90 hover:shadow-[0_6px_16px_rgba(194,65,12,0.40)]"
          >
            Hitung bobot saya
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
