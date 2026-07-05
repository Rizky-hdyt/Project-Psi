import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { AlgorithmSection } from "@/components/landing/AlgorithmSection";
import { AmbientBackground } from "@/components/shared/AmbientBackground";

export default function AlgoritmaPage() {
  return (
    <div className="relative min-h-screen">
      <AmbientBackground />
      <Navbar />

      {/* Back button */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-[1120px] px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="-ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm text-muted-foreground transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* Algorithm content */}
      <AlgorithmSection />
    </div>
  );
}
