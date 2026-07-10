"use client";

import { useEffect, useRef, useState } from "react";
import { useCountUp } from "@/hooks/useCountUp";

/**
 * Angka statistik landing yang count-up saat pertama terlihat di viewport
 * (animasi #3 — lihat RIWAYAT_PENGERJAAN.md). Menerima string seperti "5"
 * atau "100%" — bagian angka dianimasikan, suffix non-angka ikut apa adanya.
 */
export function StatCountUp({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : null;
  const suffix = match ? match[2] : "";

  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || target === null) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  const animated = useCountUp(inView && target !== null ? target : 0, 800);

  if (target === null) return <span>{value}</span>;
  return (
    <span ref={ref}>
      {Math.round(animated)}
      {suffix}
    </span>
  );
}
