"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Bot } from "lucide-react";
import { AssistantChat } from "./AssistantChat";
import { cn } from "@/lib/utils";
import { useHasMounted } from "@/hooks/useHasMounted";
import type { AssistantContext } from "@/lib/assistant/qaBank";

interface Props {
  href: string;
  ctx: AssistantContext | null;
}

// Trigger FCI Assistant: di layar sempit (<lg) tombol ini navigasi ke halaman
// /assistant penuh; di layar lebar (lg: ke atas) tombol membuka panel chat
// docked di samping kanan halaman — meniru referensi mockup awal (widget FCI
// Assistant di sisi Result page), tanpa mengubah layout Result page yang sudah
// dibuat semirip mungkin dengan hasil-rekomendasi.html (panel ini overlay,
// bukan reflow grid halaman).
// Posisi tombol trigger di kanan-bawah (bottom-6 right-6). RelevanceSurvey
// yang juga fixed di Result page sengaja ditaruh di KIRI-bawah (bukan kanan)
// supaya dua widget floating ini tidak numpuk — lihat komentar di
// RelevanceSurvey.tsx.
export function AssistantDock({ href, ctx }: Props) {
  const [open, setOpen] = useState(false);

  // Portal ke document.body — komponen ini dirender di dalam panel "glass"
  // (backdrop-blur) di Result page, dan backdrop-filter di ancestor manapun
  // membuat `position:fixed` di dalamnya ter-anchor ke ancestor itu (bukan
  // viewport). Tanpa portal, tombol ini "fixed" ke bawah PANEL yang sangat
  // tinggi, bukan ke bawah LAYAR — jadi kelihatan hilang saat halaman belum
  // di-scroll sejauh itu.
  const mounted = useHasMounted();
  if (!mounted) return null;

  return createPortal(
    <>
      <Link
        href={href}
        aria-label="Buka FCI Assistant"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sawah text-white shadow-[0_10px_30px_rgba(224,38,60,0.35)] transition-transform duration-[180ms] hover:scale-105 active:scale-95 lg:hidden"
      >
        <Bot className="h-5 w-5" />
      </Link>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buka FCI Assistant"
        className={cn(
          "fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-sawah text-white shadow-[0_10px_30px_rgba(224,38,60,0.35)] transition-transform duration-[180ms] hover:scale-105 active:scale-95 lg:flex",
          open && "lg:hidden"
        )}
      >
        <Bot className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed bottom-6 right-6 top-24 z-50 hidden w-full max-w-[360px] lg:flex">
          <AssistantChat ctx={ctx} onClose={() => setOpen(false)} className="w-full" />
        </div>
      )}
    </>,
    document.body
  );
}
