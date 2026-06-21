import type { IndicatorId, RankedDistrict } from "@/types/recommendation";

const INDICATOR_LABEL: Record<IndicatorId, string> = {
  internet:    "internet",
  cost:        "biaya hidup terjangkau",
  community:   "komunitas aktif",
  environment: "lingkungan kerja",
};

export function generateWhyText(ranked: RankedDistrict, districtNama: string): string {
  const entries = Object.entries(ranked.kontribusi) as [IndicatorId, number][];
  entries.sort(([, a], [, b]) => b - a);

  const [first, second, , last] = entries;

  const skorFirst = Math.round(ranked.skorPerIndikator[first[0]]);
  const skorSecond = Math.round(ranked.skorPerIndikator[second[0]]);

  return (
    `${districtNama} direkomendasikan karena ${INDICATOR_LABEL[first[0]]} kuat ` +
    `(skor ${skorFirst}/100) sesuai prioritas Anda, dan ${INDICATOR_LABEL[second[0]]} ` +
    `mendukung (skor ${skorSecond}/100). ` +
    `Trade-off: ${INDICATOR_LABEL[last[0]]} relatif lebih rendah dibanding distrik lain.`
  );
}

export function getTopTwoContributions(ranked: RankedDistrict): [IndicatorId, IndicatorId] {
  const entries = Object.entries(ranked.kontribusi) as [IndicatorId, number][];
  entries.sort(([, a], [, b]) => b - a);
  return [entries[0][0], entries[1][0]];
}
