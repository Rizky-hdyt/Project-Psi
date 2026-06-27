import Link from "next/link";
import { MapPinOff, Home, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
        {/* Icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-line bg-white shadow-[0_4px_16px_rgba(28,37,33,0.08)]">
          <MapPinOff className="h-9 w-9 text-muted-foreground" />
        </div>

        {/* Status code */}
        <p className="mb-2 font-mono text-5xl font-bold text-line">404</p>

        <h1 className="mb-3 font-display text-2xl font-bold text-ink">
          Halaman tidak ditemukan
        </h1>
        <p className="mb-8 max-w-[320px] text-sm leading-relaxed text-muted-foreground">
          Halaman yang Anda cari tidak ada atau sudah dipindahkan. Coba kembali
          ke beranda atau mulai quiz.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/">
            <Button className="min-h-[44px] gap-2 bg-sawah text-white hover:bg-sawah/90 shadow-[0_4px_12px_rgba(47,111,78,0.30)]">
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </Link>
          <Link href="/quiz">
            <Button
              variant="outline"
              className="min-h-[44px] gap-2 border-line hover:bg-paper"
            >
              Mulai Quiz
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Hint */}
        <p className="mt-10 font-mono text-xs text-muted-foreground/50">
          Freelance City Index · Yogyakarta Edition
        </p>
      </div>
    </div>
  );
}
