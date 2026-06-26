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
    gradientFrom: "#B5562F",
    gradientTo: "#7A3320",
    accentHex: "#B5562F",
    imageUrl: "https://picsum.photos/seed/yogyakarta-kraton/900/500",
    tagline: "Jantung kota, koneksi terkuat",
    emoji: "🏛️",
  },
  "sleman": {
    gradientFrom: "#2F6F4E",
    gradientTo: "#1A4530",
    accentHex: "#2F6F4E",
    imageUrl: "https://picsum.photos/seed/sleman-merapi-green/900/500",
    tagline: "Keseimbangan sempurna antara alam & produktivitas",
    emoji: "🌋",
  },
  "bantul": {
    gradientFrom: "#1F5C73",
    gradientTo: "#0F3A4F",
    accentHex: "#1F5C73",
    imageUrl: "https://picsum.photos/seed/bantul-parangtritis/900/500",
    tagline: "Tenang, kreatif, dan terjangkau",
    emoji: "🌊",
  },
  "gunungkidul": {
    gradientFrom: "#7B6040",
    gradientTo: "#4E3C28",
    accentHex: "#7B6040",
    imageUrl: "https://picsum.photos/seed/gunungkidul-karst/900/500",
    tagline: "Paling hemat, paling tenang di DIY",
    emoji: "⛰️",
  },
  "kulon-progo": {
    gradientFrom: "#3A6E5C",
    gradientTo: "#214535",
    accentHex: "#3A6E5C",
    imageUrl: "https://picsum.photos/seed/kulonprogo-menoreh/900/500",
    tagline: "Potensi besar, biaya rendah, sedang berkembang",
    emoji: "✈️",
  },
};

export function getDistrictVisual(districtId: string): DistrictVisual {
  return (
    DISTRICT_VISUALS[districtId] ?? {
      gradientFrom: "#2F6F4E",
      gradientTo: "#1A4530",
      accentHex: "#2F6F4E",
      imageUrl: `https://picsum.photos/seed/${districtId}/900/500`,
      tagline: "",
      emoji: "📍",
    }
  );
}
