export interface DistrictVisual {
  gradientFrom: string;
  gradientTo: string;
  accentHex: string;
  imageUrl: string;
  tagline: string;
  emoji: string;
}

// Identitas distrik — foto landmark asli di public/images/hero/{id}.jpg
// (dipakai untuk kartu besar/hero) dan public/images/districts/{id}.jpg
// (dipakai untuk thumbnail/galeri kecil). accentHex dipakai untuk swatch
// warna & badge identitas ringan, bukan lagi gradient dekoratif.
export const DISTRICT_VISUALS: Record<string, DistrictVisual> = {
  "kota-yogyakarta": {
    gradientFrom: "#946638",
    gradientTo: "#946638",
    accentHex: "#946638",
    imageUrl: "/images/hero/kota-yogyakarta.jpg",
    tagline: "Jantung kota, koneksi terkuat",
    emoji: "🏛️",
  },
  "sleman": {
    gradientFrom: "#3B5BA5",
    gradientTo: "#3B5BA5",
    accentHex: "#3B5BA5",
    imageUrl: "/images/hero/sleman.jpg",
    tagline: "Keseimbangan sempurna antara alam & produktivitas",
    emoji: "🌋",
  },
  "bantul": {
    gradientFrom: "#2F7A6E",
    gradientTo: "#2F7A6E",
    accentHex: "#2F7A6E",
    imageUrl: "/images/hero/bantul.jpg",
    tagline: "Tenang, kreatif, dan terjangkau",
    emoji: "🌊",
  },
  "gunungkidul": {
    gradientFrom: "#6B5A3F",
    gradientTo: "#6B5A3F",
    accentHex: "#6B5A3F",
    imageUrl: "/images/hero/gunungkidul.jpg",
    tagline: "Paling hemat, paling tenang di DIY",
    emoji: "⛰️",
  },
  "kulon-progo": {
    gradientFrom: "#5C6B47",
    gradientTo: "#5C6B47",
    accentHex: "#5C6B47",
    imageUrl: "/images/hero/kulon-progo.jpg",
    tagline: "Potensi besar, biaya rendah, sedang berkembang",
    emoji: "✈️",
  },
};

export function getDistrictVisual(districtId: string): DistrictVisual {
  return (
    DISTRICT_VISUALS[districtId] ?? {
      gradientFrom: "#4B5966",
      gradientTo: "#4B5966",
      accentHex: "#4B5966",
      imageUrl: "/images/hero-yogyakarta.jpeg",
      tagline: "",
      emoji: "📍",
    }
  );
}
