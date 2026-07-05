"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

// PRD §6.2 decision point "Apakah admin memiliki hak akses?" → NO path:
// "Tolak akses, tampilkan halaman 403: 'Anda tidak memiliki izin'". Dipakai
// saat sesi ADA tapi sudah tidak valid (kedaluwarsa/dirusak) — beda dari
// "belum pernah login" yang tetap ke /admin/login (lihat AdminContext).
export default function Forbidden403Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--a-bg)] px-4">
      <div className="w-full max-w-sm rounded-[18px] border border-[var(--a-line-2)] bg-white p-7 text-center shadow-[0_2px_4px_rgba(25,29,39,.03),0_8px_24px_rgba(25,29,39,.05)]">
        <div
          className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full"
          style={{ background: "var(--a-red-soft)", color: "var(--a-red)" }}
        >
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="text-lg font-extrabold tracking-tight text-[var(--a-ink)]">403 — Akses Ditolak</h1>
        <p className="mt-2 text-sm font-medium text-[var(--a-muted)]">
          Anda tidak memiliki izin untuk mengakses halaman ini. Sesi Anda mungkin sudah kedaluwarsa.
        </p>
        <Link
          href="/admin/login"
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-[10px] bg-[var(--a-red)] px-4 text-sm font-bold text-white transition-colors hover:bg-[var(--a-red-dark)]"
        >
          Masuk Lagi
        </Link>
      </div>
    </div>
  );
}
