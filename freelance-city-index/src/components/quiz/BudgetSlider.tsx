"use client";

import { Slider } from "@/components/ui/slider";

const MIN = 2_000_000;
const MAX = 6_500_000;

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
  return (
    <div>
      <div className="mb-3 flex items-end justify-between">
        <label className="text-sm font-semibold text-ink">
          Berapa budget bulanan Anda?
        </label>
        <span className="font-mono text-lg font-bold text-ink">
          {formatRupiah(value)}
        </span>
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

      <div className="mt-2 flex justify-between font-mono text-xs text-muted-foreground">
        <span>{formatRupiah(MIN)}</span>
        <span>{formatRupiah(MAX)}</span>
      </div>
    </div>
  );
}
