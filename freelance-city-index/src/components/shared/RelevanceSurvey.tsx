"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useHasMounted } from "@/hooks/useHasMounted";
import type { QuizInput } from "@/types/quiz";

export interface SurveyResponse {
  relevansi: number; // 1–5
  kemudahan: number; // 1–5
  komentar: string;
  personaId: QuizInput["personaId"] | null;
  createdAt: string; // ISO
}

async function persistResponse(r: SurveyResponse): Promise<void> {
  try {
    await fetch("/api/survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        relevansi: r.relevansi,
        kemudahan: r.kemudahan,
        komentar: r.komentar,
        personaId: r.personaId,
      }),
    });
  } catch {
    // Gagal simpan tidak menghalangi UX "terima kasih" — survei ini
    // suplemen pengukuran, bukan alur inti (§2 nilai produk tetap utuh
    // walau submit gagal karena jaringan).
  }
}

function RatingRow({
  value,
  onChange,
  ariaLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = value >= n;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`Nilai ${n} dari 5`}
            onClick={() => onChange(n)}
            className={cn(
              "rounded p-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              active ? "text-sawah" : "text-line hover:text-sawah/40"
            )}
          >
            <Star
              className="h-5 w-5"
              fill={active ? "currentColor" : "none"}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}

// Popup survei cuma boleh muncul SEKALI (permintaan user 2026-07-11), dan
// tidak boleh muncul lagi setelah ditangani (diisi/dilewati/ditutup) meski
// halaman di-refresh — sebelumnya flag ini cuma in-memory sehingga refresh
// mereset dan popup nanya ulang walau user sudah submit (bug dilaporkan
// 2026-07-13). §15.3 CLAUDE.md soal larangan localStorage berlaku untuk
// state quiz & hasil, bukan preferensi popup feedback seperti ini, jadi
// dipersist ke localStorage supaya tidak nagging ulang tiap reload.
const SURVEY_STORAGE_KEY = "fci-survey-handled";
let surveyShownThisSession = false;

function hasSurveyBeenHandled(): boolean {
  if (surveyShownThisSession) return true;
  try {
    return localStorage.getItem(SURVEY_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markSurveyHandled(): void {
  surveyShownThisSession = true;
  try {
    localStorage.setItem(SURVEY_STORAGE_KEY, "1");
  } catch {
    // localStorage tidak tersedia (mis. private mode) — degradasi ke
    // flag in-memory saja, popup tetap tidak muncul ulang di sesi ini.
  }
}

// Kalau didiamkan tanpa interaksi apa pun, tutup sendiri setelah durasi ini.
const AUTO_DISMISS_MS = 15_000;

export function RelevanceSurvey({
  personaId = null,
}: {
  personaId?: QuizInput["personaId"] | null;
}) {
  const [visible, setVisible] = useState(false);
  const [relevansi, setRelevansi] = useState(0);
  const [kemudahan, setKemudahan] = useState(0);
  const [komentar, setKomentar] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showKomentar, setShowKomentar] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const mounted = useHasMounted();

  // Muncul otomatis setelah 3.5 detik (user sudah sempat melihat hasil) —
  // kecuali sudah pernah tampil di sesi ini.
  useEffect(() => {
    if (hasSurveyBeenHandled()) return;
    const t = setTimeout(() => {
      setVisible(true);
    }, 3500);
    return () => clearTimeout(t);
  }, []);

  // Auto-tutup kalau tidak disentuh sama sekali; batal begitu user mulai
  // berinteraksi (memberi bintang / membuka kolom masukan).
  useEffect(() => {
    if (!visible || submitted || interacted) return;
    const t = setTimeout(() => setVisible(false), AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [visible, submitted, interacted]);

  // Setelah submit, tutup otomatis setelah 2.5 detik
  useEffect(() => {
    if (submitted) {
      const t = setTimeout(() => setVisible(false), 2500);
      return () => clearTimeout(t);
    }
  }, [submitted]);

  const canSubmit = relevansi > 0 && kemudahan > 0 && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    await persistResponse({
      relevansi,
      kemudahan,
      komentar: komentar.trim(),
      personaId,
      createdAt: new Date().toISOString(),
    });
    setSubmitting(false);
    setSubmitted(true);
    markSurveyHandled();
  }

  if (!mounted || !visible) return null;

  // Portal ke document.body: komponen ini dirender bertingkat-tingkat di
  // dalam panel "glass" (backdrop-blur) di Result page. backdrop-filter di
  // ancestor manapun membuat elemen `position:fixed` di dalamnya jadi
  // ter-anchor ke ancestor itu (bukan viewport) — bug nyata yang bikin
  // popup ini "fixed" ke bagian bawah PANEL, bukan bagian bawah LAYAR.
  // Portal melompati semua ancestor itu sepenuhnya.

  return createPortal(
    <div
      className={cn(
        "fixed bottom-6 left-6 z-50 w-72 rounded-xl bg-white shadow-[0_4px_16px_rgba(15,23,42,0.12)]",
        "animate-in slide-in-from-bottom-4 fade-in duration-300"
      )}
      role="dialog"
      aria-label="Survei kepuasan"
      aria-modal="false"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <Star className="h-3.5 w-3.5 fill-sawah text-sawah" />
          <span className="text-xs font-semibold text-ink">Bantu kami menilai</span>
        </div>
        <button
          type="button"
          onClick={() => {
            markSurveyHandled();
            setVisible(false);
          }}
          aria-label="Tutup survei"
          className="relative rounded p-0.5 text-muted-foreground after:absolute after:-inset-2.5 after:content-[''] hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {submitted ? (
        /* Success state */
        <div className="flex flex-col items-center gap-2 px-4 py-5 text-center">
          <CheckCircle2 className="h-7 w-7 text-sawah" />
          <p className="text-sm font-semibold text-ink">Terima kasih!</p>
          <p className="text-xs text-muted-foreground">
            Masukan Anda membantu kami meningkatkan kualitas rekomendasi.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5 px-4 py-3.5">
          {/* Q1 */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-ink">
              Seberapa sesuai rekomendasinya?
            </p>
            <RatingRow
              value={relevansi}
              onChange={(v) => {
                setInteracted(true);
                setRelevansi(v);
              }}
              ariaLabel="Kesesuaian rekomendasi distrik, 1 sampai 5"
            />
          </div>

          {/* Q2 */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-ink">
              Seberapa mudah aplikasinya digunakan?
            </p>
            <RatingRow
              value={kemudahan}
              onChange={(v) => {
                setInteracted(true);
                setKemudahan(v);
              }}
              ariaLabel="Kemudahan penggunaan aplikasi, 1 sampai 5"
            />
          </div>

          {/* Komentar opsional, toggle */}
          {showKomentar ? (
            <textarea
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              rows={2}
              maxLength={300}
              placeholder="Masukan tambahan (opsional)"
              autoFocus
              className="w-full resize-none rounded-lg border border-line bg-white px-2.5 py-2 text-xs text-ink placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setInteracted(true);
                setShowKomentar(true);
              }}
              className="text-xs text-muted-foreground underline-offset-2 hover:text-ink hover:underline focus-visible:outline-none"
            >
              + Tambah masukan teks
            </button>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-0.5">
            <button
              type="button"
              onClick={() => {
                markSurveyHandled();
                setVisible(false);
              }}
              className="min-h-11 rounded px-1 text-xs text-muted-foreground hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Lewati
            </button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="min-h-11 bg-sawah px-3 text-xs text-white hover:bg-sawah/90 disabled:opacity-40"
            >
              {submitting ? "..." : "Kirim"}
            </Button>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
