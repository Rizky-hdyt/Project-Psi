"use client";

import { useState } from "react";
import Link from "next/link";
import { X, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DISTRICT_VISUALS } from "@/data/districts.visuals";

interface District {
  id: string;
  nama: string;
  tipe: string;
  sub: string;
  deskripsi: string;
}

const DISTRICTS: District[] = [
  {
    id: "kota-yogyakarta",
    nama: "Kota Yogyakarta",
    tipe: "Kota",
    sub: "Internet & Komunitas terbaik",
    deskripsi:
      "Jantung budaya dan komersial DIY. Pusat perkantoran, kampus besar, dan infrastruktur terlengkap. Koneksi internet fiber tersedia luas, komunitas profesional dan startup paling aktif di DIY. Biaya hidup lebih tinggi dibanding kabupaten lain, tapi diimbangi dengan akses ke berbagai fasilitas dan jaringan profesional yang tidak tertandingi di wilayah lain.",
  },
  {
    id: "sleman",
    nama: "Sleman",
    tipe: "Kabupaten",
    sub: "Paling seimbang",
    deskripsi:
      "Wilayah paling seimbang di DIY, menggabungkan koneksi internet kencang, biaya hidup terjangkau, dan komunitas yang aktif. Kawasan Seturan, Condongcatur, dan Depok menjadi pusat co-working dan kafe kerja. Berbatasan langsung dengan Kota Yogyakarta di selatan dan Gunung Merapi di utara, menjadikannya pilihan populer bagi tech professional dan digital nomad.",
  },
  {
    id: "bantul",
    nama: "Bantul",
    tipe: "Kabupaten",
    sub: "Terbaik untuk kreatif",
    deskripsi:
      "Sisi selatan DIY yang berbatasan dengan Pantai Parangtritis. Suasana lebih tenang dan kreatif, banyak seniman, desainer, dan pekerja kreatif memilih Bantul karena biaya hidup terjangkau dan suasana yang menginspirasi. Infrastruktur internet berkembang pesat beberapa tahun terakhir. Cocok untuk creative professional yang ingin produktif jauh dari hiruk-pikuk kota.",
  },
  {
    id: "gunungkidul",
    nama: "Gunungkidul",
    tipe: "Kabupaten",
    sub: "Biaya hidup terendah",
    deskripsi:
      "Kabupaten paling timur DIY dengan lanskap karst yang ikonik. Biaya hidup terendah di DIY, kost dan kebutuhan harian jauh lebih murah dibanding wilayah lain. Suasana sangat tenang, cocok untuk deep work tanpa gangguan. Internet sudah tersedia di ibu kota kabupaten (Wonosari), pilihan ideal bagi freelancer yang mengutamakan efisiensi pengeluaran bulanan.",
  },
  {
    id: "kulon-progo",
    nama: "Kulon Progo",
    tipe: "Kabupaten",
    sub: "Potensi terbesar",
    deskripsi:
      "Wilayah barat DIY yang sedang berkembang pesat sejak Bandara Yogyakarta International Airport (YIA) beroperasi. Biaya hidup masih sangat terjangkau, komunitas profesional mulai tumbuh, dan koneksi internet terus meningkat seiring pembangunan infrastruktur baru. Pilihan strategis bagi digital nomad yang ingin jadi bagian dari wilayah yang sedang bertransformasi.",
  },
];

export function DistrictPreviewSection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = DISTRICTS.find((d) => d.id === selectedId) ?? null;
  const visual = selectedId ? DISTRICT_VISUALS[selectedId] : null;

  function toggle(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6">
        <p className="mb-2 text-center font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
          5 Distrik yang Dievaluasi
        </p>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Klik salah satu distrik untuk melihat penjelasannya
        </p>

        {/* Grid tiles */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {DISTRICTS.map((d) => {
            const v = DISTRICT_VISUALS[d.id];
            const isActive = selectedId === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => toggle(d.id)}
                aria-pressed={isActive}
                aria-label={`Lihat detail ${d.nama}`}
                className="group relative overflow-hidden rounded-xl border text-left transition-all duration-200"
                style={isActive ? {
                  borderColor: v.gradientFrom,
                  boxShadow: `0 0 0 2px ${v.gradientFrom}, 0 4px 16px ${v.gradientFrom}30`,
                  transform: "translateY(-2px)",
                } : {
                  borderColor: "#E2E8F0",
                  opacity: selectedId && !isActive ? 0.65 : 1,
                }}
              >
                {/* Gradient header */}
                <div
                  className="h-20 w-full transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${v.gradientFrom} 0%, ${v.gradientTo} 100%)`,
                  }}
                >
                  <div className="flex h-full items-center justify-center">
                    <span
                      className="text-3xl transition-transform duration-200 group-hover:scale-110"
                      style={isActive ? { transform: "scale(1.15)" } : undefined}
                    >
                      {v.emoji}
                    </span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-3">
                  <p className="text-xs font-semibold text-ink">{d.nama}</p>
                  <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{d.sub}</p>
                  {/* Active indicator */}
                  {isActive && (
                    <div
                      className="mt-1.5 h-0.5 rounded-full"
                      style={{ backgroundColor: v.gradientFrom }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Expand panel, smooth height transition via CSS grid trick */}
        <div
          className="grid transition-all duration-400 ease-in-out"
          style={{ gridTemplateRows: selected ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            {selected && visual && (
              <div className="mt-4 overflow-hidden rounded-2xl shadow-[0_4px_24px_rgba(15,23,42,0.15)]">
                {/* Photo + gradient hero */}
                <div className="relative h-52 sm:h-64 overflow-hidden">
                  {/* Background image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-700"
                    style={{ backgroundImage: `url(${visual.imageUrl})` }}
                  />
                  {/* Dark gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to bottom, ${visual.gradientFrom}99 0%, ${visual.gradientTo}EE 100%)`,
                    }}
                  />
                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    aria-label="Tutup detail distrik"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/30"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {/* District identity on hero */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <div className="flex items-end gap-3">
                      <span className="text-4xl sm:text-5xl">{visual.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-white/70" />
                          <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-white/70">
                            {selected.tipe} · DIY Yogyakarta
                          </p>
                        </div>
                        <h3 className="font-display text-2xl font-bold text-white sm:text-3xl drop-shadow-sm">
                          {selected.nama}
                        </h3>
                        <p className="mt-0.5 font-mono text-xs text-white/70 italic">
                          {visual.tagline}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description panel */}
                <div className="bg-white px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {selected.deskripsi}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link href="/quiz">
                      <Button
                        size="sm"
                        className="gap-1.5 text-white transition-all"
                        style={{
                          backgroundColor: visual.gradientFrom,
                          boxShadow: `0 4px 12px ${visual.gradientFrom}40`,
                        }}
                      >
                        Cari tahu cocok untuk Anda?
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <span className="font-mono text-xs text-muted-foreground">
                      Mulai quiz untuk lihat ranking personal
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
