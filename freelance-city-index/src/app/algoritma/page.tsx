import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { AlgorithmSection } from "@/components/landing/AlgorithmSection";

export default function AlgoritmaPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      {/* Back button */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-[1120px] px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-paper hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* Algorithm content */}
      <AlgorithmSection standalone />
    </div>
  );
}
