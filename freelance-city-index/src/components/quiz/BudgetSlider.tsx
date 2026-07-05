"use client";

import { Slider } from "@/components/ui/slider";

const MIN = 2_000_000;
const MAX = 6_500_000;
const UMK_KOTA_YOGYA = 2_421_963;

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export function BudgetSlider({ value, onChange }: Props) {
  const belowUMK = value < UMK_KOTA_YOGYA;
  const percent = ((value - MIN) / (MAX - MIN)) * 100;

  return (
    <div>
      {belowUMK && (
        <span
          className="mb-3 inline-flex rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide"
          style={{ backgroundColor: "var(--warning-bg)", color: "var(--warning)" }}
        >
          Di bawah UMK
        </span>
      )}

      {/* Tooltip mengambang mengikuti posisi thumb */}
      <div className="relative mt-8 mb-2">
        <div
          className="absolute -top-8 -translate-x-1/2 whitespace-nowrap rounded-full bg-sawah px-3 py-1 font-mono text-xs font-semibold text-white shadow-sm"
          style={{ left: `${percent}%` }}
        >
          {formatRupiah(value)}
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
        />
      </div>

      <div className="mt-3 flex justify-between font-mono text-xs text-muted-foreground">
        <span>{formatRupiah(MIN)}</span>
        <span>{formatRupiah(MAX)}</span>
      </div>
    </div>
  );
}
