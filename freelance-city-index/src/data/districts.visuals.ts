export interface DistrictVisual {
  gradientFrom: string;
  gradientTo: string;
  accentHex: string;
  imageUrl: string;
  tagline: string;
  emoji: string;
}

export const DISTRICT_VISUALS: Record<string, DistrictVisual> = {
  "kota-yogyakarta": {
    gradientFrom: "#9F1239",
    gradientTo: "#881337",
    accentHex: "#9F1239",
    imageUrl: "https://picsum.photos/seed/yogyakarta-kraton/900/500",
    tagline: "Jantung kota, koneksi terkuat",
    emoji: "🏛️",
  },
  "sleman": {
    gradientFrom: "#C2410C",
    gradientTo: "#7C2D12",
    accentHex: "#C2410C",
    imageUrl: "https://picsum.photos/seed/sleman-merapi-green/900/500",
    tagline: "Keseimbangan sempurna antara alam & produktivitas",
    emoji: "🌋",
  },
  "bantul": {
    gradientFrom: "#0E7490",
    gradientTo: "#155E75",
    accentHex: "#0E7490",
    imageUrl: "https://picsum.photos/seed/bantul-parangtritis/900/500",
    tagline: "Tenang, kreatif, dan terjangkau",
    emoji: "🌊",
  },
  "gunungkidul": {
    gradientFrom: "#4D7C0F",
    gradientTo: "#365314",
    accentHex: "#4D7C0F",
    imageUrl: "https://picsum.photos/seed/gunungkidul-karst/900/500",
    tagline: "Paling hemat, paling tenang di DIY",
    emoji: "⛰️",
  },
  "kulon-progo": {
    gradientFrom: "#475569",
    gradientTo: "#1E293B",
    accentHex: "#475569",
    imageUrl: "https://picsum.photos/seed/kulonprogo-menoreh/900/500",
    tagline: "Potensi besar, biaya rendah, sedang berkembang",
    emoji: "✈️",
  },
};

export function getDistrictVisual(districtId: string): DistrictVisual {
  return (
    DISTRICT_VISUALS[districtId] ?? {
      gradientFrom: "#C2410C",
      gradientTo: "#7C2D12",
      accentHex: "#C2410C",
      imageUrl: `https://picsum.photos/seed/${districtId}/900/500`,
      tagline: "",
      emoji: "📍",
    }
  );
}
