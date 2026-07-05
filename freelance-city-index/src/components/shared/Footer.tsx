import Link from "next/link";

// Satu-satunya akses ke panel admin dari halaman publik (quiz/algoritma/
// district/compare/assistant) — sengaja dipindah dari navbar ke footer,
// meniru pola LandingFooter (CLAUDE.md: navbar untuk navigasi pengguna,
// admin bukan bagian dari alur freelancer).
export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="w-fit text-xs text-muted-foreground transition-colors hover:text-ink">
          Freelance City Index <span className="text-muted-foreground/50">/ Yogyakarta Edition</span>
        </Link>
        <div className="flex items-center gap-4">
          <p className="font-mono text-[11px] text-muted-foreground/60">
            Data: BPS DIY, Diskominfo, UMK 2025
          </p>
          <Link
            href="/admin/login"
            className="text-xs text-muted-foreground transition-colors hover:text-ink"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
