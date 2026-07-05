import type { IndicatorId } from "@/types/recommendation";

const LABEL: Record<IndicatorId, string> = {
  internet:    "Internet",
  cost:        "Cost of Living",
  community:   "Community",
  environment: "Environment",
};

const INDICATORS: IndicatorId[] = ["internet", "cost", "community", "environment"];

interface Props {
  weights: Record<IndicatorId, number>;
}

export function FormulaExample({ weights }: Props) {
  return (
    <div className="h-full rounded-2xl bg-ink p-5 text-white sm:p-6">
      <p className="mb-1 text-sm font-semibold text-white">Formula Perhitungan</p>
      <p className="mb-4 text-xs text-white/50">
        Setiap distrik dihitung menggunakan formula berikut:
      </p>

      <div className="font-mono text-sm leading-relaxed text-white/90">
        {INDICATORS.map((id, i) => (
          <p key={id} className={i === 0 ? undefined : "pl-[3.3ch]"}>
            {i === 0 && <span className="text-white/60">Score = </span>}(
            {LABEL[id]}
            {" × "}
            <span className="font-semibold text-positive">
              {(Math.round(weights[id] * 1000) / 1000).toFixed(2)}
            </span>
            ){i < INDICATORS.length - 1 && " +"}
          </p>
        ))}
      </div>

      <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/50">
        Semua nilai dinormalisasi dalam skala 0-100. Semakin tinggi skor, semakin cocok untuk Anda.
      </p>
    </div>
  );
}
