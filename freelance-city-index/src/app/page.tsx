import Link from "next/link";
import { MapPin, Zap, Shield, User, ArrowRight, Sigma } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { DISTRICT_VISUALS } from "@/data/districts.visuals";
import { DistrictPreviewSection } from "@/components/landing/DistrictPreviewSection";
import { CapabilityShowcase } from "@/components/landing/CapabilityShowcase";

// Mini preview bobot tiap persona, data statis untuk teaser
const PERSONA_WEIGHTS = [
  { label: "Tech", color: "#0E7490", internet: 40, cost: 25, community: 20, environment: 15 },
  { label: "Creative", color: "#9F1239", internet: 20, cost: 25, community: 25, environment: 30 },
  { label: "Student", color: "#C2410C", internet: 20, cost: 45, community: 20, environment: 15 },
  { label: "Nomad", color: "#4D7C0F", internet: 30, cost: 25, community: 25, environment: 20 },
];

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
    deskripsi: "Setiap rekomendasi menampilkan bobot indikator dan kontribusi masing-masing, Anda tahu persis alasannya.",
  },
  {
    icon: Zap,
    judul: "Deterministik",
    deskripsi: "Input sama selalu menghasilkan output sama. Bukan AI yang bisa berubah jawaban tiap sesi.",
  },
  {
    icon: User,
    judul: "Personal",
    deskripsi: "Bobot disesuaikan profil dan 4 preferensi Anda, bukan peringkat generik untuk semua orang.",
  },
];

const STEPS = [
  {
    num: "01",
    judul: "Pilih profil freelancer Anda",
    deskripsi: "Tech Professional, Creative, Student, atau Digital Nomad, bobot indikator menyesuaikan profil Anda secara otomatis.",
  },
  {
    num: "02",
    judul: "Lihat algoritma bekerja",
    deskripsi: "Sebelum hasil muncul, kami tunjukkan bobot dan formula yang digunakan, bukan kotak hitam.",
  },
  {
    num: "03",
    judul: "Dapatkan ranking beralasan",
    deskripsi: "5 distrik diurutkan berdasarkan skor, lengkap dengan penjelasan mengapa distrik teratas cocok untuk Anda.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex-1">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-paper">
        <div className="relative mx-auto max-w-[1120px] px-4 pb-14 pt-14 sm:px-6 sm:pb-16 sm:pt-20 lg:grid lg:grid-cols-[1fr_440px] lg:items-center lg:gap-14 lg:pb-24 lg:pt-24">
          {/* Copy & CTA */}
          <div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-sawah/25 bg-sawah/8 px-3 py-1">
              <MapPin className="h-3 w-3 text-sawah" />
              <span className="font-mono text-xs font-medium uppercase tracking-wide text-sawah">
                Decision Support System · DIY
              </span>
            </span>

            <h1 className="mb-5 mt-5 font-display text-4xl font-bold leading-[1.1] text-ink sm:text-5xl lg:text-[3.4rem]">
              Distrik mana di <span className="text-sawah">Yogyakarta</span>{" "}
              paling cocok untuk kerjamu?
            </h1>

            <p className="mb-8 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Temukan distrik terbaik untuk kerja freelance &amp; remote berdasarkan
              data, bukan asumsi. Transparan, deterministik, dan personal untuk profil Anda.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/quiz"
                className="flex min-h-[48px] items-center gap-2 rounded-xl bg-sawah px-7 text-sm font-semibold text-white transition-all hover:bg-sawah/90 active:translate-y-px"
              >
                Mulai Quiz
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/algoritma"
                className="flex min-h-[48px] items-center gap-2 rounded-xl border border-line bg-white px-6 text-sm font-medium text-ink transition-all hover:border-sawah/40 hover:bg-paper active:translate-y-px"
              >
                Lihat Cara Kerja
              </Link>
            </div>
          </div>

          {/* Sample result preview */}
          <div className="mt-12 lg:mt-0">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">
                  Contoh hasil · Tech Professional
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
                                : "#E2E8F0",
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
      </section>

      {/* ── 5 Distrik Preview ─────────────────────────────────────── */}
      <DistrictPreviewSection />

      {/* ── Transparansi: visual bobot + checklist keunggulan ───────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[420px_1fr] lg:items-center">
            {/* Kiri, mini visualisasi perbedaan bobot */}
            <div className="order-2 rounded-2xl border border-line bg-paper p-5 shadow-[0_2px_12px_rgba(15,23,42,0.07)] lg:order-1">
              <p className="mb-4 text-sm font-semibold text-ink">
                Contoh perbedaan bobot: Internet vs Biaya Hidup
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
                      <div
                        className="h-full transition-all"
                        style={{ width: `${internet}%`, backgroundColor: color }}
                      />
                      <div
                        className="h-full transition-all"
                        style={{ width: `${cost}%`, backgroundColor: `${color}60` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 border-t border-line pt-3 font-mono text-[10px] text-muted-foreground">
                Student prioritaskan Biaya (45%) · Tech prioritaskan Internet (40%)
              </p>
            </div>

            {/* Kanan, headline + checklist */}
            <div className="order-1 lg:order-2">
              <h2 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
                Mengapa rekomendasi Anda berbeda dari orang lain?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Sistem ini tidak punya satu bobot tunggal yang berlaku untuk semua orang.
                Setiap profil freelancer mendapat komposisi bobot yang berbeda, karena
                kebutuhan tiap orang memang tidak bisa disamakan.
              </p>

              <div className="mt-6 space-y-3">
                {KEUNGGULAN.map(({ icon: Icon, judul, deskripsi }) => (
                  <div
                    key={judul}
                    className="flex items-start gap-3 rounded-xl border border-line bg-white px-4 py-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sawah/10">
                      <Icon className="h-4 w-4 text-sawah" />
                    </div>
                    <div>
                      <p className="font-semibold text-ink">{judul}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{deskripsi}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/algoritma"
                  className="flex items-center gap-2 rounded-xl border-2 border-sawah bg-sawah px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(194,65,12,0.30)] transition-all hover:bg-sawah/90"
                >
                  <Sigma className="h-4 w-4" />
                  Lihat Cara Kerja
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 Indikator, kapabilitas ─────────────────────────────── */}
      <section className="border-y border-line bg-paper">
        <div className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:py-16">
          <h2 className="mb-3 text-center font-display text-2xl font-bold text-ink sm:text-3xl">
            4 indikator yang menentukan rekomendasi Anda
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
            Klik salah satu indikator untuk melihat bagaimana bobotnya berbeda antar profil freelancer.
          </p>
          <CapabilityShowcase />
        </div>
      </section>

      {/* ── Cara kerja ──────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:py-20">
          <h2 className="mb-12 text-center font-display text-2xl font-bold text-ink sm:text-3xl">
            Tiga langkah ke rekomendasi terbaik
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map(({ num, judul, deskripsi }, i) => (
              <div key={num} className="relative">
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
        </div>
      </section>

      {/* ── Final CTA, permukaan aksen penuh ───────────────────────── */}
      <section className="bg-paper px-4 pb-16 pt-4 sm:px-6 lg:pb-20">
        <div className="mx-auto max-w-[1120px]">
          <div className="rounded-2xl bg-sawah px-6 py-14 text-center sm:px-10 lg:py-16">
            <h2 className="mb-4 font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              Siap menemukan distrik terbaikmu?
            </h2>
            <p className="mx-auto mb-8 max-w-md text-sm text-white/80 sm:text-base">
              Jawab 5 pertanyaan, lihat algoritma bekerja, dan dapatkan rekomendasi
              personal. Gratis, tanpa akun.
            </p>
            <Link
              href="/quiz"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-white px-8 text-sm font-semibold text-sawah transition-all hover:bg-white/90 active:translate-y-px"
            >
              Mulai Quiz
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
