import Link from "next/link";
import { MapPin, Zap, Shield, User, ArrowRight, Wifi, Wallet, Users, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";

const SAMPLE_RESULTS = [
  { nama: "Sleman", skor: 79.2, bar: 79 },
  { nama: "Kota Yogyakarta", skor: 77.4, bar: 77 },
  { nama: "Bantul", skor: 72.1, bar: 72 },
  { nama: "Kulon Progo", skor: 61.3, bar: 61 },
  { nama: "Gunungkidul", skor: 54.8, bar: 55 },
];

const INDICATORS = [
  { icon: Wifi,   label: "Internet",    color: "bg-pesisir" },
  { icon: Wallet, label: "Biaya Hidup", color: "bg-sawah" },
  { icon: Users,  label: "Komunitas",   color: "bg-genteng" },
  { icon: Leaf,   label: "Lingkungan",  color: "bg-pesisir" },
];

const STEPS = [
  {
    num: "01",
    judul: "Pilih profil freelancer Anda",
    deskripsi:
      "Tech Professional, Creative, Student, atau Digital Nomad — bobot indikator menyesuaikan profil Anda secara otomatis.",
  },
  {
    num: "02",
    judul: "Lihat algoritma bekerja",
    deskripsi:
      "Sebelum hasil muncul, kami tunjukkan bobot dan formula yang digunakan — bukan kotak hitam.",
  },
  {
    num: "03",
    judul: "Dapatkan ranking beralasan",
    deskripsi:
      "5 distrik diurutkan berdasarkan skor, lengkap dengan penjelasan mengapa distrik teratas cocok untuk Anda.",
  },
];

const KEUNGGULAN = [
  {
    icon: Shield,
    judul: "Transparan",
    deskripsi:
      "Setiap rekomendasi menampilkan bobot indikator dan kontribusi masing-masing — Anda tahu persis alasannya.",
  },
  {
    icon: Zap,
    judul: "Deterministik",
    deskripsi:
      "Input sama selalu menghasilkan output sama. Bukan AI yang bisa berubah jawaban tiap sesi.",
  },
  {
    icon: User,
    judul: "Personal",
    deskripsi:
      "Bobot disesuaikan profil dan 4 preferensi Anda — bukan peringkat generik untuk semua orang.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex-1">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1120px] px-4 pb-16 pt-12 sm:px-6 sm:pt-20 lg:grid lg:grid-cols-2 lg:gap-16 lg:pt-24">
        {/* Copy & CTA */}
        <div className="flex flex-col justify-center">
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-widest text-pesisir">
            Decision Support System · DIY Yogyakarta
          </p>
          <h1 className="mb-5 font-display text-4xl font-bold leading-[1.1] text-ink sm:text-5xl lg:text-[3.25rem]">
            Distrik mana di Yogyakarta paling cocok untuk kerjamu?
          </h1>
          <p className="mb-8 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Temukan distrik terbaik untuk kerja freelance &amp; remote
            berdasarkan data — bukan asumsi. Transparan, deterministik, dan
            personal.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/quiz">
              <Button
                size="lg"
                className="min-h-[44px] gap-2 bg-sawah px-6 text-paper hover:bg-sawah/90"
              >
                Mulai
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="font-mono text-xs text-muted-foreground">
              &lt; 60 detik · 5 distrik · 4 indikator
            </p>
          </div>

          {/* Indicator chips */}
          <div className="mt-10 flex flex-wrap gap-2">
            {INDICATORS.map(({ icon: Icon, label, color }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-xs text-ink"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
                <Icon className="h-3 w-3 text-muted-foreground" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Sample result preview — signature element */}
        <div className="mt-12 lg:mt-0">
          <div className="rounded-xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(28,37,33,0.06),0_1px_3px_rgba(28,37,33,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                Contoh hasil · Tech Professional · Internet High
              </p>
              <span className="rounded-full bg-sawah/10 px-2 py-0.5 font-mono text-xs font-semibold text-sawah">
                Preview
              </span>
            </div>

            <div className="space-y-3">
              {SAMPLE_RESULTS.map((d, i) => (
                <div key={d.nama} className="flex items-center gap-3">
                  <span
                    className={`w-5 shrink-0 text-right font-mono text-xs font-semibold ${
                      i === 0 ? "text-sawah" : "text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span
                        className={`truncate text-sm ${
                          i === 0 ? "font-semibold text-ink" : "text-ink/80"
                        }`}
                      >
                        {d.nama}
                      </span>
                      <span className="shrink-0 font-mono text-xs font-semibold text-ink">
                        {d.skor}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                      <div
                        className={`h-full rounded-full ${
                          i === 0 ? "bg-sawah" : "bg-pesisir/40"
                        }`}
                        style={{ width: `${d.bar}%` }}
                      />
                    </div>
                  </div>
                  {i === 0 && (
                    <span className="shrink-0 rounded-full bg-sawah px-2 py-0.5 text-[10px] font-semibold text-white">
                      Best Match
                    </span>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-4 border-t border-line pt-3 text-xs text-muted-foreground">
              Sleman unggul karena internet kuat (85/100) dan biaya terjangkau
              (70/100). Ubah profil → ranking berubah seketika.
            </p>
          </div>
        </div>
      </section>

      {/* ── Keunggulan ──────────────────────────────────────────── */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:py-16">
          <p className="mb-10 text-center font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Mengapa bukan Google atau ChatGPT
          </p>
          <div className="grid gap-8 sm:grid-cols-3">
            {KEUNGGULAN.map(({ icon: Icon, judul, deskripsi }) => (
              <div key={judul} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line">
                  <Icon className="h-4 w-4 text-sawah" />
                </div>
                <div>
                  <h3 className="mb-1.5 font-semibold text-ink">{judul}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {deskripsi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cara kerja ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:py-20">
        <p className="mb-3 text-center font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Cara kerja
        </p>
        <h2 className="mb-12 text-center font-display text-2xl font-bold text-ink sm:text-3xl">
          Tiga langkah ke rekomendasi terbaik
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {STEPS.map(({ num, judul, deskripsi }) => (
            <div key={num}>
              <p className="mb-3 font-mono text-3xl font-bold text-line">
                {num}
              </p>
              <h3 className="mb-2 font-semibold text-ink">{judul}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {deskripsi}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────── */}
      <section className="border-t border-line bg-ink">
        <div className="mx-auto max-w-[1120px] px-4 py-14 text-center sm:px-6 lg:py-16">
          <h2 className="mb-3 font-display text-2xl font-bold text-paper sm:text-3xl">
            Siap menemukan distrik terbaikmu?
          </h2>
          <p className="mb-8 text-sm text-paper/60">
            Gratis, tanpa akun, selesai dalam kurang dari 60 detik.
          </p>
          <Link href="/quiz">
            <Button
              size="lg"
              className="min-h-[44px] gap-2 bg-sawah px-8 text-white hover:bg-sawah/90"
            >
              Mulai Sekarang
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-line bg-paper">
        <div className="mx-auto max-w-[1120px] px-4 py-6 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-sawah" />
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
