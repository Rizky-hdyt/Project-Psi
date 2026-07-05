import Link from "next/link";
import {
  ArrowRight, CheckCircle2, ChevronDown, Wifi, Wallet, Users, Leaf, Quote,
  Target, BarChart3, Compass, ClipboardEdit, Calculator, ListOrdered, Eye,
} from "lucide-react";
import { GlassNavbar } from "@/components/landing/GlassNavbar";
import { AmbientBackground } from "@/components/shared/AmbientBackground";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { HeroBackgroundSlideshow } from "@/components/landing/HeroBackgroundSlideshow";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { DistrictPreviewSection } from "@/components/landing/DistrictPreviewSection";
import { CapabilityShowcase } from "@/components/landing/CapabilityShowcase";

const FEATURE_BADGES = [
  { icon: Wifi, label: "Internet" },
  { icon: Wallet, label: "Cost of Living" },
  { icon: Users, label: "Community" },
  { icon: Leaf, label: "Environment" },
];

const STATS = [
  { value: "5", label: "Distrik" },
  { value: "4", label: "Indikator" },
  { value: "1", label: "Metode Perhitungan Berbobot" },
  { value: "100%", label: "Rekomendasi Transparan" },
];

const CHECKLIST = [
  "Rekomendasi personal",
  "Perhitungan transparan",
  "Mudah dibandingkan",
  "Fokus khusus DIY",
];

const WHY_CARDS = [
  {
    icon: Target,
    title: "Rekomendasi Objektif",
    desc: "Ranking dihasilkan dari perhitungan skor, bukan opini atau iklan berbayar.",
  },
  {
    icon: BarChart3,
    title: "Skor Transparan",
    desc: "Setiap komponen skor dan bobotnya ditampilkan terbuka, bisa dicek ulang kapan saja.",
  },
  {
    icon: Compass,
    title: "Fokus DIY",
    desc: "Dirancang khusus untuk 5 wilayah di Daerah Istimewa Yogyakarta, bukan rekomendasi nasional yang generik.",
  },
];

const HOW_STEPS = [
  { icon: ClipboardEdit, num: "1", title: "Isi Preferensi", desc: "Pilih persona kerja dan 4 sinyal preferensi Anda." },
  { icon: Calculator, num: "2", title: "Hitung Skor Berbobot", desc: "Sistem menghitung skor tiap distrik dengan metode weighted scoring." },
  { icon: ListOrdered, num: "3", title: "Ranking Distrik", desc: "5 distrik diurutkan berdasarkan skor kecocokan Anda." },
  { icon: Eye, num: "4", title: "Lihat Hasil", desc: "Lihat rekomendasi terbaik lengkap dengan alasannya." },
];

export default function LandingPage() {
  return (
    <main className="relative flex-1">
      <AmbientBackground />
      <GlassNavbar />

      {/* ── SECTION 2: Hero ──────────────────────────────────────────── */}
      <section id="beranda" className="relative isolate overflow-hidden">
        <div className="relative min-h-[820px] px-4 pb-16 pt-8 sm:min-h-[760px] sm:px-6 sm:pt-10 lg:px-10">
          <HeroBackgroundSlideshow />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, rgba(246,245,250,0.92) 0%, rgba(246,245,250,0.55) 42%, rgba(246,245,250,0.15) 68%, rgba(246,245,250,0.4) 100%)",
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[55fr_45fr] lg:items-center">
            {/* Hero Left */}
            <div className="stagger-in pt-4">
              <h1 className="max-w-lg text-3xl font-bold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-[2.6rem]">
                Temukan distrik terbaik di Daerah Istimewa Yogyakarta{" "}
                <span className="text-sawah">untuk gaya kerja Anda</span>
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/70 sm:text-base">
                Sistem rekomendasi berbasis data yang membandingkan 5 distrik di DIY lewat
                4 indikator utama, dengan perhitungan yang sepenuhnya transparan.
              </p>

              {/* Feature Badges — 4 pill terpisah */}
              <div className="mt-6 flex flex-wrap gap-2">
                {FEATURE_BADGES.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-2 text-xs font-medium text-ink"
                  >
                    <Icon className="h-3.5 w-3.5 text-sawah" />
                    {label}
                  </span>
                ))}
              </div>

              {/* CTA Group */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/quiz"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sawah to-[#F0384F] px-6 text-sm font-medium text-white shadow-[0_10px_25px_rgba(220,35,64,0.3)] transition-transform duration-[180ms] hover:-translate-y-0.5 active:scale-[0.98] sm:min-h-13"
                >
                  Mulai Rekomendasi
                  <ArrowRight className="h-4 w-4 transition-transform duration-[180ms] group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="#cara-kerja"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-white px-6 text-sm font-medium text-ink transition-colors duration-[180ms] hover:border-ink/30 active:scale-[0.98] sm:min-h-13"
                >
                  Pelajari Cara Kerja
                </Link>
              </div>

              {/* Statistics Cards — 4, ukuran identik, hover lift */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {STATS.map(({ value, label }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-line bg-white p-3.5 transition-transform duration-[180ms] hover:-translate-y-1 hover:shadow-md"
                  >
                    <p className="font-mono text-xl font-bold text-ink sm:text-2xl">{value}</p>
                    <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Right — Floating Recommendation Card */}
            <div className="relative lg:justify-self-end">
              {/* Floating decorative shapes */}
              <div className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-sawah/20 blur-2xl motion-safe:animate-[float_7s_ease-in-out_infinite]" />
              <div className="pointer-events-none absolute -bottom-10 -right-6 h-32 w-32 rounded-full bg-positive/20 blur-3xl motion-safe:animate-[float_9s_ease-in-out_infinite_reverse]" />

              <div className="relative w-full max-w-[340px] rounded-2xl border border-line bg-white p-5 shadow-[0_20px_50px_rgba(23,21,26,0.14)]">
                <p className="text-sm font-semibold text-ink">Rekomendasi personal untuk Anda</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Sekali isi preferensi, sistem menunjukkan distrik paling cocok lengkap dengan alasannya.
                </p>

                <ul className="mt-4 space-y-2.5">
                  {CHECKLIST.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-xs leading-snug text-ink/75">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-positive-bg">
                        <CheckCircle2 className="h-3 w-3 text-positive" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>

                {/* Information Card */}
                <div className="mt-4 rounded-xl border border-line bg-secondary p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Quote className="h-3.5 w-3.5 shrink-0 text-sawah" />
                      <span className="text-xs font-medium text-ink">Contoh: Sleman</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-positive">74.9<span className="text-[10px] font-normal text-muted-foreground">/100</span></span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-positive" style={{ width: "75%" }} />
                  </div>
                  <Link
                    href="/quiz"
                    className="mt-3 flex min-h-9 w-full items-center justify-center gap-1.5 rounded-full bg-sawah text-xs font-medium text-white transition-colors hover:bg-sawah/90"
                  >
                    Mulai Sekarang
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-1.5">
            <span className="text-xs text-ink/50">Scroll untuk lanjut</span>
            <ChevronDown className="h-4 w-4 text-ink/40" />
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Why Freelance City Index ─────────────────────── */}
      <section id="tentang" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24 lg:py-28 lg:px-10">
        <div className="mx-auto max-w-[1280px]">
          <ScrollReveal className="mx-auto mb-12 max-w-xl text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Mengapa Freelance City Index?
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Dibangun untuk membantu Anda memutuskan, bukan sekadar menampilkan data mentah.
            </p>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-3">
            {WHY_CARDS.map(({ icon: Icon, title, desc }, i) => (
              <ScrollReveal
                key={title}
                delay={i * 80}
                className="rounded-2xl border border-white/60 bg-white/70 p-6 backdrop-blur-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sawah/10">
                  <Icon className="h-5 w-5 text-sawah" />
                </div>
                <h3 className="mb-1.5 font-semibold text-ink">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: How It Works ──────────────────────────────────── */}
      <section id="cara-kerja" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24 lg:py-28 lg:px-10">
        <div className="mx-auto max-w-[1280px]">
          <ScrollReveal className="mx-auto mb-14 max-w-xl text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Cara Kerja
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Empat langkah sederhana dari preferensi Anda sampai rekomendasi distrik.
            </p>
          </ScrollReveal>

          <div className="relative grid gap-6 sm:grid-cols-4">
            {/* Connector line, desktop only */}
            <div className="pointer-events-none absolute left-0 right-0 top-[22px] hidden h-px bg-line sm:block" aria-hidden="true" />

            {HOW_STEPS.map(({ icon: Icon, num, title, desc }, i) => (
              <ScrollReveal key={num} delay={i * 80} className="relative text-center">
                <div className="relative z-10 mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-sawah font-mono text-sm font-bold text-white shadow-[0_8px_20px_rgba(220,35,64,0.3)]">
                  {num}
                </div>
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white">
                  <Icon className="h-4 w-4 text-sawah" />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-ink">{title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Indicators ────────────────────────────────────── */}
      <section id="indikator" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24 lg:py-28 lg:px-10">
        <div className="mx-auto max-w-[1280px]">
          <ScrollReveal className="mx-auto mb-12 max-w-xl text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              4 indikator yang benar-benar menentukan
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Internet, biaya hidup, komunitas, dan lingkungan kerja — klik salah satu
              untuk lihat bagaimana bobotnya bergeser antar profil freelancer.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <CapabilityShowcase />
          </ScrollReveal>
        </div>
      </section>

      {/* ── SECTION 6: Supported Districts ───────────────────────────── */}
      <div id="distrik" className="scroll-mt-24">
        <DistrictPreviewSection />
      </div>

      {/* ── SECTION 7: Final CTA ─────────────────────────────────────── */}
      <section className="px-4 py-14 sm:px-6 sm:py-24 lg:py-28 lg:px-10">
        <ScrollReveal
          className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:py-20"
          style={{
            background: "linear-gradient(135deg, #DC2340 0%, #F0384F 55%, #FB7B5B 100%)",
          }}
        >
          <h2 className="mx-auto mb-4 max-w-2xl text-2xl font-bold leading-[1.15] tracking-tight text-white sm:mb-5 sm:text-5xl sm:leading-[1.05]">
            Mulai temukan distrik terbaik untuk gaya kerja Anda.
          </h2>
          <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-white/80 sm:mb-10 sm:text-base">
            Tanpa akun, tanpa biaya — hasilnya langsung terlihat begitu kuis selesai.
          </p>
          <Link
            href="/quiz"
            className="group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-white py-1 pl-6 pr-1 text-sm font-medium text-sawah transition-all duration-[180ms] hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98] sm:min-h-14 sm:gap-3 sm:py-1.5 sm:pl-7 sm:pr-1.5 sm:text-base"
          >
            Mulai Sekarang
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sawah/10 transition-transform duration-[180ms] group-hover:translate-x-0.5 sm:h-11 sm:w-11">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </ScrollReveal>
      </section>

      {/* ── SECTION 8: Footer ────────────────────────────────────────── */}
      <LandingFooter />
    </main>
  );
}
