"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Wifi } from "lucide-react";
import { DISTRICT_VISUALS } from "@/data/districts.visuals";
import districtsData from "@/data/districts.seed.json";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { cn } from "@/lib/utils";

const DISTRICTS = [
  {
    id: "kota-yogyakarta",
    nama: "Kota Yogyakarta",
    tipe: "Kota",
    sub: "Internet & komunitas terbaik",
    alasan: "Ekosistem kerja paling lengkap di DIY, tapi dengan biaya hidup tertinggi.",
    foto: "/images/districts/kota-yogyakarta.jpg",
  },
  {
    id: "sleman",
    nama: "Sleman",
    tipe: "Kabupaten",
    sub: "Paling seimbang",
    alasan: "Kombinasi internet kencang, biaya terjangkau, dan komunitas aktif menjadikannya paling seimbang.",
    foto: "/images/districts/sleman.jpg",
  },
  {
    id: "bantul",
    nama: "Bantul",
    tipe: "Kabupaten",
    sub: "Terbaik untuk kreatif",
    alasan: "Suasana tenang dekat pantai, favorit pekerja kreatif dengan biaya hidup terjangkau.",
    foto: "/images/districts/bantul.jpg",
  },
  {
    id: "gunungkidul",
    nama: "Gunungkidul",
    tipe: "Kabupaten",
    sub: "Biaya hidup terendah",
    alasan: "Biaya hidup termurah di DIY dan paling tenang untuk deep work tanpa gangguan.",
    foto: "/images/districts/gunungkidul.jpg",
  },
  {
    id: "kulon-progo",
    nama: "Kulon Progo",
    tipe: "Kabupaten",
    sub: "Potensi terbesar",
    alasan: "Sedang berkembang pesat sejak YIA beroperasi, biaya rendah dengan potensi jangka panjang.",
    foto: "/images/districts/kulon-progo.jpg",
  },
];

const internetByDistrict = new Map(
  districtsData.districts.map((d) => [d.id, d.internetMbps])
);

export function DistrictPreviewSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="relative isolate scroll-mt-24 overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
      <div className="relative mx-auto max-w-[1240px]">
        <ScrollReveal className="mx-auto mb-12 max-w-xl text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            5 distrik yang dievaluasi
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Setiap distrik punya karakter kerja sendiri. Klik untuk lihat penjelasan singkatnya.
          </p>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DISTRICTS.map((d, i) => {
            const visual = DISTRICT_VISUALS[d.id];
            const mbps = internetByDistrict.get(d.id);
            const isOpen = expandedId === d.id;
            return (
              <ScrollReveal key={d.id} delay={i * 60}>
                <div className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/15 text-white transition-transform duration-[180ms] hover:-translate-y-1">
                  <Image
                    src={d.foto}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="-z-20 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/25"
                    aria-hidden="true"
                  />

                  <button
                    type="button"
                    onClick={() => setExpandedId((prev) => (prev === d.id ? null : d.id))}
                    aria-expanded={isOpen}
                    aria-controls={`district-detail-${d.id}`}
                    className="p-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:p-6"
                  >
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium backdrop-blur-md"
                      style={{ backgroundColor: `${visual?.accentHex}CC` }}
                    >
                      {d.tipe}
                    </span>
                    <h3 className="mt-4 text-xl font-bold tracking-tight">{d.nama}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/80">
                      {visual?.tagline ?? d.sub}
                    </p>

                    <div
                      id={`district-detail-${d.id}`}
                      className="grid transition-[grid-template-rows] duration-300 ease-[var(--ease-entrance)]"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="mt-3 text-sm leading-relaxed text-white/90">{d.alasan}</p>
                      </div>
                    </div>

                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium">
                      {isOpen ? "Tutup" : "Penjelasan singkat"}
                      <ChevronDown
                        className={cn("h-3.5 w-3.5 transition-transform duration-[180ms]", isOpen && "rotate-180")}
                      />
                    </span>
                  </button>

                  <div className="flex items-center justify-between gap-2 border-t border-white/20 px-5 pb-5 pt-4 sm:px-6">
                    <span className="inline-flex items-center gap-1.5 text-xs text-white/80">
                      <Wifi className="h-3.5 w-3.5" />
                      {mbps ? `${mbps} Mbps` : "—"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedId((prev) => (prev === d.id ? null : d.id))}
                      aria-expanded={isOpen}
                      aria-controls={`district-detail-${d.id}`}
                      className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      {isOpen ? "Tutup" : "Lihat Detail"}
                      <ChevronDown
                        className={cn("h-3 w-3 transition-transform duration-[180ms]", isOpen && "rotate-180")}
                      />
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
