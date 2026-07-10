"use client";

import { useCountUp } from "@/hooks/useCountUp";

/**
 * Angka skor yang count-up saat muncul & bertransisi saat nilainya berubah
 * (animasi #11 — recompute FR-010 jadi terlihat). Dipakai di Result page;
 * styling diserahkan ke parent lewat className pembungkus.
 */
export function AnimatedNumber({
  value,
  decimals = 1,
  durationMs = 600,
}: {
  value: number;
  decimals?: number;
  durationMs?: number;
}) {
  const animated = useCountUp(value, durationMs);
  return <>{animated.toFixed(decimals)}</>;
}
