import Link from "next/link";
import { MapPin, Zap, Shield, User, ArrowRight, Wifi, Wallet, Users, Leaf, Sigma, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { DISTRICT_VISUALS } from "@/data/districts.visuals";
import { DistrictPreviewSection } from "@/components/landing/DistrictPreviewSection";

// Mini preview bobot tiap persona — data statis untuk teaser
const PERSONA_WEIGHTS = [
  { label: "Tech", color: "#1F5C73", internet: 40, cost: 25, community: 20, environment: 15 },
  { label: "Creative", color: "#B5562F", internet: 20, cost: 25, community: 25, environment: 30 },
  { label: "Student", color: "#2F6F4E", internet: 20, cost: 45, community: 20, environment: 15 },
  { label: "Nomad", color: "#7B6040", internet: 30, cost: 25, community: 25, environment: 20 },
];

function AlgorithmTeaser() {
  return (
    <section className="border-y border-line bg-white">
      <div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          {/* Kiri — teks */}
          <div>
            <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-sawah">
              Transparansi · Cara Kerja
            </p>
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Mengapa rekomendasi Anda <br className="hidden sm:block" />
              berbeda dari orang lain?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Sistem ini tidak punya satu bobot tunggal yang berlaku untuk semua orang.
              Setiap profil freelancer mendapat komposisi bobot yang berbeda — karena
              kebutuhan tiap orang memang tidak bisa disamakan.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Pelajari formula scoring, tabel bobot per persona, sumber data, dan validasinya
              di halaman Cara Kerja Algoritma.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/algoritma"
                className="flex items-center gap-2 rounded-xl border-2 border-sawah bg-sawah px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(47,111,78,0.30)] transition-all hover:bg-sawah/90"
              >
                <Sigma className="h-4 w-4" />
                Pelajari Cara Kerja
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/quiz"
                className="flex items-center gap-2 rounded-xl border border-line px-5 py-2.5 text-sm font-medium text-ink transition-all hover:bg-paper hover:border-sawah/40"
              >
                Langsung Coba Quiz
              </Link>
            </div>
          </div>

          {/* Kanan — mini visualisasi perbedaan bobot */}
          <div className="rounded-2xl border border-line bg-paper p-5 shadow-[0_2px_12px_rgba(28,37,33,0.07)]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contoh perbedaan bobot · Internet vs Biaya Hidup
            </p>
            <div className="space-y-4">
              {PERSONA_WEIGHTS.map(({ label, color, internet, cost }) => (
                <div key={label}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-ink">{label}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      Internet {internet}% · Biaya {cost}%
                    </span>
                  </div>
                  <div className="flex h-2.5 overflow-hidden rounded-full bg-line">
                    {/* Internet bar */}
                    <div
                      className="h-full transition-all"
                      style={{ width: `${internet}%`, backgroundColor: color }}
                    />
                    {/* Cost bar (different opacity) */}
                    <div
                      className="h-full transition-all"
                      style={{ width: `${cost}%`, backgroundColor: `${color}60` }}
                    />
                  </div>
                  <div className="mt-1 flex gap-3">
                    <span className="flex items-center gap-1 font-mono text-[9px] text-muted-foreground">
                      <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: color }} />
                      Internet
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[9px] text-muted-foreground">
                      <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: `${color}60` }} />
                      Biaya Hidup
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 border-t border-line pt-3 font-mono text-[10px] text-muted-foreground">
              Student prioritaskan Biaya (45%) · Tech prioritaskan Internet (40%)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const SAMPLE_RESULTS = [
  { id: "sleman",           nama: "Sleman",           skor: 79.2, bar: 79 },
  { id: "kota-yogyakarta",  nama: "Kota Yogyakarta",  skor: 77.4, bar: 77 },
  { id: "bantul",           nama: "Bantul",            skor: 72.1, bar: 72 },
  { id: "kulon-progo",      nama: "Kulon Progo",       skor: 61.3, bar: 61 },
  { id: "gunungkidul",      nama: "Gunungkidul",       skor: 54.8, bar: 55 },
];


const KEUNGGULAN = [
  {
    icon: Shield,
    judul: "Transparan",
    deskripsi: "Setiap rekomendasi menampilkan bobot indikator dan kontribusi masing-masing — Anda tahu persis alasannya.",
  },
  {
    icon: Zap,
    judul: "Deterministik",
    deskripsi: "Input sama selalu menghasilkan output sama. Bukan AI yang bisa berubah jawaban tiap sesi.",
  },
  {
    icon: User,
    judul: "Personal",
    deskripsi: "Bobot disesuaikan profil dan 4 preferensi Anda — bukan peringkat generik untuk semua orang.",
  },
];

const STEPS = [
  {
    num: "01",
    judul: "Pilih profil freelancer Anda",
    deskripsi: "Tech Professional, Creative, Student, atau Digital Nomad — bobot indikator menyesuaikan profil Anda secara otomatis.",
  },
  {
    num: "02",
    judul: "Lihat algoritma bekerja",
    deskripsi: "Sebelum hasil muncul, kami tunjukkan bobot dan formula yang digunakan — bukan kotak hitam.",
  },
  {
    num: "03",
    judul: "Dapatkan ranking beralasan",
    deskripsi: "5 distrik diurutkan berdasarkan skor, lengkap dengan penjelasan mengapa distrik teratas cocok untuk Anda.",
  },
];

const INDICATORS = [
  { icon: Wifi,   label: "Internet",    desc: "Kualitas & kecepatan koneksi" },
  { icon: Wallet, label: "Biaya Hidup", desc: "Keterjangkauan kost & kebutuhan" },
  { icon: Users,  label: "Komunitas",   desc: "Coworking & jaringan profesional" },
  { icon: Leaf,   label: "Lingkungan",  desc: "Kenyamanan suasana kerja" },
];

export default function LandingPage() {
  return (
    <main className="flex-1">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "linear-gradient(135deg, #1C2521 0%, #2F6F4E 50%, #1F5C73 100%)",
          }}
        />
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="mx-auto max-w-[1120px] px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:grid lg:grid-cols-[1fr_420px] lg:gap-14 lg:pt-24 lg:pb-24">
          {/* Copy & CTA */}
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-sm">
              <MapPin className="h-3 w-3 text-white/70" />
              <span className="font-mono text-xs text-white/70">
                Decision Support System · DIY Yogyakarta
              </span>
            </div>

            <h1 className="mb-5 font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-[3.4rem]">
              Distrik mana di{" "}
              <span className="text-[#7EC8A0]">Yogyakarta</span>{" "}
              paling cocok untuk kerjamu?
            </h1>

            <p className="mb-8 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
              Temukan distrik terbaik untuk kerja freelance &amp; remote berdasarkan
              data — bukan asumsi. Transparan, deterministik, dan personal.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/quiz">
                <Button
                  size="lg"
                  className="min-h-[48px] gap-2 bg-white px-7 text-[#1C2521] font-semibold hover:bg-white/90 shadow-lg shadow-black/20"
                >
                  Mulai Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <p className="font-mono text-xs text-white/50">
                &lt; 60 detik · 5 distrik · 4 indikator
              </p>
            </div>

            {/* 4 indicator chips */}
            <div className="mt-10 flex flex-wrap gap-2">
              {INDICATORS.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/70 backdrop-blur-sm"
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Sample result preview */}
          <div className="mt-12 lg:mt-0">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-1 backdrop-blur-md shadow-2xl shadow-black/30">
              <div className="rounded-xl bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">
                    Contoh hasil · Tech Professional · Internet High
                  </p>
                  <span className="rounded-full bg-sawah/10 px-2 py-0.5 font-mono text-xs font-semibold text-sawah">
                    Preview
                  </span>
                </div>

                <div className="space-y-3">
                  {SAMPLE_RESULTS.map((d, i) => {
                    const visual = DISTRICT_VISUALS[d.id];
                    return (
                      <div key={d.nama} className="flex items-center gap-3">
                        <span
                          className={`w-5 shrink-0 text-right font-mono text-xs font-semibold ${
                            i === 0 ? "text-sawah" : "text-muted-foreground"
                          }`}
                        >
                          {i + 1}
                        </span>
                        {/* District color dot */}
                        <div
                          className="h-5 w-5 shrink-0 rounded-full"
                          style={{ background: `linear-gradient(135deg, ${visual?.gradientFrom}, ${visual?.gradientTo})` }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <span className={`truncate text-sm ${i === 0 ? "font-semibold text-ink" : "text-ink/80"}`}>
                              {d.nama}
                            </span>
                            <span className="shrink-0 font-mono text-xs font-semibold text-ink">
                              {d.skor}
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${d.bar}%`,
                                background: i === 0
                                  ? `linear-gradient(90deg, ${visual?.gradientFrom}, ${visual?.gradientTo})`
                                  : "#D8D3C4",
                              }}
                            />
                          </div>
                        </div>
                        {i === 0 && (
                          <span className="shrink-0 rounded-full bg-sawah px-2 py-0.5 text-[10px] font-semibold text-white">
                            Best Match
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <p className="mt-4 border-t border-line pt-3 text-xs text-muted-foreground">
                  Sleman unggul karena internet kuat (85/100) dan biaya terjangkau (70/100).
                  Ubah profil → ranking berubah seketika.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5 Distrik Preview ─────────────────────────────────────── */}
      <DistrictPreviewSection />

      {/* ── Teaser Cara Kerja Algoritma ──────────────────────────── */}
      <AlgorithmTeaser />

      {/* ── 4 Indikator ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:py-16">
        <p className="mb-3 text-center font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
          4 Indikator Kunci
        </p>
        <h2 className="mb-10 text-center font-display text-2xl font-bold text-ink sm:text-3xl">
          Data yang menentukan rekomendasi Anda
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INDICATORS.map(({ icon: Icon, label, desc }, i) => {
            const colors = ["#2F6F4E", "#1F5C73", "#B5562F", "#7B6040"];
            const bgs = ["#EDF5F0", "#E8F1F5", "#F8EDE8", "#F3EFE8"];
            return (
              <div key={label} className="rounded-xl border border-line bg-white p-5 shadow-[0_1px_3px_rgba(28,37,33,0.06)]">
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: bgs[i] }}
                >
                  <Icon className="h-5 w-5" style={{ color: colors[i] }} />
                </div>
                <p className="mb-1 font-semibold text-ink">{label}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Keunggulan ──────────────────────────────────────────────── */}
      <section className="border-y border-line bg-[#F0EDE5]">
        <div className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:py-16">
          <p className="mb-10 text-center font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Mengapa bukan Google atau ChatGPT
          </p>
          <div className="grid gap-8 sm:grid-cols-3">
            {KEUNGGULAN.map(({ icon: Icon, judul, deskripsi }) => (
              <div key={judul} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sawah/10 border border-sawah/20">
                  <Icon className="h-4 w-4 text-sawah" />
                </div>
                <div>
                  <h3 className="mb-1.5 font-semibold text-ink">{judul}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cara kerja ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:py-20">
        <p className="mb-3 text-center font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Cara kerja
        </p>
        <h2 className="mb-12 text-center font-display text-2xl font-bold text-ink sm:text-3xl">
          Tiga langkah ke rekomendasi terbaik
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {STEPS.map(({ num, judul, deskripsi }, i) => (
            <div key={num} className="relative">
              {/* Connector line (desktop) */}
              {i < STEPS.length - 1 && (
                <div className="absolute left-[calc(100%+1rem)] top-4 hidden h-px w-8 bg-line lg:block" />
              )}
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-sawah text-white">
                <span className="font-mono text-sm font-bold">{num}</span>
              </div>
              <h3 className="mb-2 font-semibold text-ink">{judul}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{deskripsi}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1C2521 0%, #2F6F4E 100%)",
        }}
      >
        <div className="mx-auto max-w-[1120px] px-4 py-16 text-center sm:px-6 lg:py-20">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-white/50">
            Gratis · Tanpa akun · &lt; 60 detik
          </p>
          <h2 className="mb-4 font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Siap menemukan distrik terbaikmu?
          </h2>
          <p className="mb-8 text-sm text-white/60">
            Jawab 5 pertanyaan, lihat algoritma bekerja, dan dapatkan rekomendasi personal.
          </p>
          <Link href="/quiz">
            <Button
              size="lg"
              className="min-h-[48px] gap-2 bg-white px-8 text-ink font-semibold hover:bg-white/90 shadow-lg shadow-black/20"
            >
              Mulai Sekarang
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-line bg-paper">
        <div className="mx-auto max-w-[1120px] px-4 py-6 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sawah">
                <span className="font-mono text-[10px] font-bold text-white">F</span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                Freelance City Index · Yogyakarta Edition
              </span>
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              Data diperbarui mingguan · V1 MVP
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
