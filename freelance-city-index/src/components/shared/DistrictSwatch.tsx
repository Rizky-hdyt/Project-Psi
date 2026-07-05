import { getDistrictVisual } from "@/data/districts.visuals";

interface Props {
  districtId: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASS: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-11 w-11",
};

// Swatch warna identitas distrik, flat (bukan gradient/emoji) — dipakai di
// Result, District Detail, dan Compare (CLAUDE.md §10.4, §11).
export function DistrictSwatch({ districtId, size = "md" }: Props) {
  const visual = getDistrictVisual(districtId);
  return (
    <span
      className={`${SIZE_CLASS[size]} shrink-0 rounded-[var(--radius-sm)]`}
      style={{ backgroundColor: visual.accentHex }}
      aria-hidden="true"
    />
  );
}
