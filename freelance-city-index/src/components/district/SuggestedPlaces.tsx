"use client";

import { useState } from "react";
import { Star, MapPin, Wifi, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import {
  getRecommendedPlaces,
  CATEGORY_LABEL,
  CATEGORY_COLOR,
  type SuggestedPlace,
  type EnvironmentPreference,
  type PersonaId,
  type PlaceCategory,
} from "@/data/places.seed";

const CATEGORY_ICON: Record<PlaceCategory, string> = {
  cafe: "☕",
  coworking: "💻",
  quiet: "🌿",
  library: "📚",
};

const ENV_LABEL: Record<EnvironmentPreference, string> = {
  cafe: "Kafe untuk Bekerja",
  coworking: "Ruang Coworking",
  quiet: "Tempat Tenang & Alam",
  flexible: "Tempat Terbaik",
};

const PERSONA_LABEL: Record<PersonaId, string> = {
  "tech-professional": "Tech Professional",
  "creative-professional": "Creative Professional",
  "student-fresh-graduate": "Student & Fresh Graduate",
  "digital-nomad": "Digital Nomad",
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="h-3 w-3"
            fill={i < full ? "#F59E0B" : i === full && half ? "url(#half)" : "none"}
            stroke={i < full || (i === full && half) ? "#F59E0B" : "#D1D5DB"}
            strokeWidth={1.5}
          />
        ))}
      </div>
      <span className="font-mono text-xs font-semibold text-ink">{rating.toFixed(1)}</span>
    </div>
  );
}

function PriceRange({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="font-mono text-xs text-muted-foreground">
      {"Rp".repeat(level)}
      <span className="opacity-30">{"Rp".repeat(3 - level)}</span>
    </span>
  );
}

function PlaceCard({ place, accentColor }: { place: SuggestedPlace; accentColor: string }) {
  const cat = CATEGORY_COLOR[place.kategori];
  const mapsUrl = place.gmapsSlug
    ? `https://maps.google.com/?q=${place.gmapsSlug}`
    : `https://maps.google.com/?q=${encodeURIComponent(place.nama + " " + place.alamat)}`;

  return (
    <div className="flex flex-col rounded-xl border border-line bg-white p-4 shadow-[0_1px_4px_rgba(28,37,33,0.06)] transition-all duration-200 hover:shadow-[0_4px_14px_rgba(28,37,33,0.12)] hover:-translate-y-0.5">
      {/* Header: ikon kategori + nama + badge */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 text-xl leading-none">{CATEGORY_ICON[place.kategori]}</span>
          <div>
            <p className="text-sm font-semibold leading-tight text-ink">{place.nama}</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                style={{ backgroundColor: cat.bg, color: cat.text, borderColor: cat.border }}
              >
                {CATEGORY_LABEL[place.kategori]}
              </span>
              <PriceRange level={place.priceRange} />
            </div>
          </div>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Buka ${place.nama} di Google Maps`}
          className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-paper hover:text-ink"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Rating */}
      <StarRating rating={place.rating} />

      {/* Alamat */}
      <div className="mt-2.5 flex items-start gap-1.5">
        <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
        <p className="text-[11px] leading-snug text-muted-foreground">{place.alamat}</p>
      </div>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1">
        {place.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* WiFi indicator */}
      {place.tags.some((t) => t.toLowerCase().includes("wifi")) && (
        <div className="mt-2.5 flex items-center gap-1 border-t border-line pt-2.5">
          <Wifi className="h-3 w-3 text-pesisir" />
          <span className="text-[10px] font-medium text-pesisir">WiFi tersedia</span>
        </div>
      )}
    </div>
  );
}

interface Props {
  districtId: string;
  districtNama: string;
  environmentPreference: EnvironmentPreference;
  personaId: PersonaId;
  accentColor: string;
}

export function SuggestedPlaces({ districtId, districtNama, environmentPreference, personaId, accentColor }: Props) {
  const [showAll, setShowAll] = useState(false);

  const places = getRecommendedPlaces(districtId, environmentPreference, personaId);
  if (places.length === 0) return null;

  const displayed = showAll ? places : places.slice(0, 4);

  const sectionTitle = ENV_LABEL[environmentPreference];
  const subtitle = `Rekomendasi untuk ${PERSONA_LABEL[personaId]} di ${districtNama}`;

  return (
    <section className="rounded-2xl border border-line bg-white p-6 shadow-[0_2px_12px_rgba(28,37,33,0.07)]">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg text-sm"
            style={{ backgroundColor: `${accentColor}18` }}
          >
            {CATEGORY_ICON[environmentPreference === "quiet" ? "quiet" : environmentPreference === "coworking" ? "coworking" : environmentPreference === "cafe" ? "cafe" : "coworking"]}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tempat yang Disarankan
            </p>
            <h2 className="text-base font-bold text-ink">{sectionTitle}</h2>
          </div>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">{subtitle}</p>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
          Diurutkan berdasarkan rating · {places.length} tempat ditemukan
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {displayed.map((place) => (
          <PlaceCard key={place.nama} place={place} accentColor={accentColor} />
        ))}
      </div>

      {/* Show more / less */}
      {places.length > 4 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-line py-2.5 text-xs font-medium text-muted-foreground transition-all hover:border-solid hover:text-ink"
        >
          {showAll ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              Tampilkan lebih sedikit
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              Lihat {places.length - 4} tempat lainnya
            </>
          )}
        </button>
      )}

      {/* Disclaimer */}
      <p className="mt-3 text-center font-mono text-[9px] text-muted-foreground">
        Data berdasarkan kurasi tim · Rating bersifat indikatif · Cek Google Maps untuk info terkini
      </p>
    </section>
  );
}
