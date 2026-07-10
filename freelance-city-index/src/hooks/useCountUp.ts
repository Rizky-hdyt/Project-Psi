"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animasi angka count-up (animasi #3, #7, #11 — lihat RIWAYAT_PENGERJAAN.md).
 * - Mount pertama: hitung dari 0 ke target.
 * - Target berubah (mis. recompute FR-010): hitung dari nilai sebelumnya ke
 *   target baru — perubahan skor jadi terlihat, bukan ganti diam-diam.
 * - prefers-reduced-motion: langsung tampil nilai akhir tanpa animasi.
 */
export function useCountUp(target: number, durationMs = 600): number {
  const [value, setValue] = useState(target);
  const prevTarget = useRef<number | null>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = prevTarget.current ?? 0;
    prevTarget.current = target;

    // Semua setValue dijadwalkan lewat rAF (bukan sinkron di body effect)
    // supaya tidak memicu cascading render (aturan react-hooks/set-state-in-effect).
    if (reduceMotion || from === target) {
      raf.current = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(raf.current);
    }

    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out-cubic
      setValue(from + (target - from) * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, durationMs]);

  return value;
}
