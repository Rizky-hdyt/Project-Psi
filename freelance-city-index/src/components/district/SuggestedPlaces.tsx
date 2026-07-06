"use client";

import { useState } from "react";
import { Star, MapPin, Wifi, ChevronDown, ChevronUp, ExternalLink, Coffee, Building2, TreePine, BookOpen } from "lucide-react";
import {
  getRecommendedPlaces,
  CATEGORY_LABEL,
  type SuggestedPlace,
  type EnvironmentPreference,
  type PersonaId,
  type PlaceCategory,
} from "@/data/places.seed";
import type { SubDistrict } from "@/types/district";

const CATEGORY_ICON: Record<PlaceCategory, React.ElementType> = {
  cafe: Coffee,
  coworking: Building2,
  quiet: TreePine,
  library: BookOpen,
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
  return (
    <div className="flex items-center gap-1">
      <Star className="h-3 w-3 fill-current text-warning" strokeWidth={0} />
      <span className="font-mono text-xs font-semibold tabular-nums text-ink">{rating.toFixed(1)}</span>
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

function PlaceRow({ place, isInTarget, subDistrictNama }: { place: SuggestedPlace; isInTarget: boolean; subDistrictNama: string | null }) {
  const Icon = CATEGORY_ICON[place.kategori];
  const hasWifi = place.tags.some((t) => t.toLowerCase().includes("wifi"));
  const mapsUrl = place.gmapsSlug
    ? `https://maps.google.com/?q=${place.gmapsSlug}`
    : `https://maps.google.com/?q=${encodeURIComponent(place.nama + " " + place.alamat)}`;

  return (
    <div className="flex items-start gap-3 py-3.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-medium text-ink">{place.nama}</span>
          <span className="text-xs text-muted-foreground">{CATEGORY_LABEL[place.kategori]}</span>
          <PriceRange level={place.priceRange} />
          {hasWifi && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Wifi className="h-3 w-3" />
              WiFi
            </span>
          )}
          {subDistrictNama && (
            <span
              className={
                isInTarget
                  ? "rounded-full bg-sawah/10 px-2 py-0.5 text-[10px] font-medium text-sawah"
                  : "rounded-full bg-paper px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              }
            >
              {isInTarget ? `Di ${subDistrictNama}` : `Sekitar · ${subDistrictNama}`}
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-start gap-1.5">
          <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-snug text-muted-foreground">{place.alamat}</p>
        </div>
        {place.tags.length > 0 && (
          <p className="mt-1 text-xs text-muted-foreground/80">{place.tags.join(" · ")}</p>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <StarRating rating={place.rating} />
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Buka ${place.nama} di Google Maps`}
          className="relative rounded-[var(--radius-sm)] p-1 text-muted-foreground transition-colors after:absolute after:-inset-3 after:content-[''] hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

interface Props {
  districtId: string;
  districtNama: string;
  targetSubDistrictId: string | null;
  subDistricts: SubDistrict[];
  environmentPreference: EnvironmentPreference;
  personaId: PersonaId;
}

export function SuggestedPlaces({
  districtId,
  districtNama,
  targetSubDistrictId,
  subDistricts,
  environmentPreference,
  personaId,
}: Props) {
  const [showAll, setShowAll] = useState(false);

  const places = getRecommendedPlaces(districtId, targetSubDistrictId, environmentPreference, personaId);
  if (places.length === 0) return null;

  const displayed = showAll ? places : places.slice(0, 4);

  const subDistrictNamaById = new Map(subDistricts.map((sd) => [sd.id, sd.nama]));
  const targetNama = targetSubDistrictId ? subDistrictNamaById.get(targetSubDistrictId) ?? null : null;

  const sectionTitle = ENV_LABEL[environmentPreference];
  const subtitle = targetNama
    ? `Rekomendasi untuk ${PERSONA_LABEL[personaId]} di sekitar ${targetNama}, ${districtNama}`
    : `Rekomendasi untuk ${PERSONA_LABEL[personaId]} di ${districtNama}`;

  return (
    <section>
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-ink">{sectionTitle}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">
          Diurutkan berdasarkan rating, {places.length} tempat ditemukan
        </p>
      </div>

      {/* List */}
      <div className="divide-y divide-line border-y border-line">
        {displayed.map((place) => (
          <PlaceRow
            key={place.nama}
            place={place}
            isInTarget={place.subDistrictId === targetSubDistrictId}
            subDistrictNama={subDistrictNamaById.get(place.subDistrictId) ?? null}
          />
        ))}
      </div>

      {/* Show more / less */}
      {places.length > 4 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-dashed border-line py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-solid hover:text-ink"
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
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Data berdasarkan kurasi tim. Rating bersifat indikatif. Cek Google Maps untuk info terkini.
      </p>
    </section>
  );
}
