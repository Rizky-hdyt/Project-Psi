import Link from "next/link";
import { Globe, MessageCircle, Mail } from "lucide-react";

const NAV_LINKS = [
  { href: "#beranda", label: "Beranda" },
  { href: "#cara-kerja", label: "Cara Kerja" },
  { href: "#indikator", label: "Indikator" },
  { href: "#distrik", label: "Distrik" },
  { href: "/admin/login", label: "Admin" },
];

const SOCIAL_LINKS = [
  { href: "#", label: "Website", icon: Globe },
  { href: "#", label: "Kontak", icon: MessageCircle },
  { href: "#", label: "Email", icon: Mail },
];

// Footer khusus Landing Page (Landing_Page_Spec.md §Section 8) — lebih kaya
// dari Footer bersama di halaman lain (quiz/result/admin tetap pakai Footer.tsx).
export function LandingFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-8 sm:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Link href="#beranda" className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sawah font-mono text-xs font-bold text-white">
                F
              </span>
              <span className="text-sm font-semibold text-ink">Freelance City Index</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Sistem rekomendasi distrik kerja berbasis data, khusus untuk Daerah Istimewa Yogyakarta.
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Navigasi</p>
            <ul className="space-y-2">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-muted-foreground transition-colors hover:text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Terhubung</p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted-foreground transition-colors hover:border-ink/30 hover:text-ink"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Freelance City Index. Yogyakarta Edition.
          </p>
          <p className="font-mono text-[11px] text-muted-foreground/60">
            Data: BPS DIY, Diskominfo, UMK 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
