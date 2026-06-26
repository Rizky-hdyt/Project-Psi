"use client";

import { Wallet } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const MIN = 2_000_000;
const MAX = 6_500_000;
const UMK_KOTA_YOGYA = 2_421_963;

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export function BudgetSlider({ value, onChange }: Props) {
  const belowUMK = value < UMK_KOTA_YOGYA;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Wallet className="h-4 w-4 text-sawah" />
        <label className="text-sm font-semibold text-ink">
          Berapa budget bulanan Anda?
        </label>
      </div>

      {/* Value display */}
      <div className="mb-4 flex items-end justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold text-ink">
            {formatRupiah(value)}
          </span>
          <span className="font-mono text-xs text-muted-foreground">/bulan</span>
        </div>
        {belowUMK && (
          <span
            className="rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide"
            style={{ backgroundColor: "#FBF3DA", color: "#B8860B" }}
          >
            Di bawah UMK
          </span>
        )}
      </div>

      <Slider
        min={MIN}
        max={MAX}
        step={100_000}
        value={[value]}
        onValueChange={(v) => {
          const num = Array.isArray(v) ? v[0] : (v as number);
          onChange(num);
        }}
        aria-label="Budget bulanan"
        className="mt-1"
      />

      <div className="mt-3 flex justify-between font-mono text-xs text-muted-foreground">
        <span>{formatRupiah(MIN)}</span>
        <span className="hidden text-center text-[10px] sm:block">
          UMK ≈ {formatRupiah(UMK_KOTA_YOGYA)}
        </span>
        <span>{formatRupiah(MAX)}</span>
      </div>
    </div>
  );
}
