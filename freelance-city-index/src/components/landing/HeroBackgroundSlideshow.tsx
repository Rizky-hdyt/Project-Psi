"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const HERO_IMAGES = [
  "/images/hero/kota-yogyakarta.jpg",
  "/images/hero/sleman.jpg",
  "/images/hero/bantul.jpg",
  "/images/hero/gunungkidul.jpg",
  "/images/hero/kulon-progo.jpg",
];

const ROTATE_MS = 7000;

export function HeroBackgroundSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 -z-20" aria-hidden="true">
      {HERO_IMAGES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? "anim-hero-zoom opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
