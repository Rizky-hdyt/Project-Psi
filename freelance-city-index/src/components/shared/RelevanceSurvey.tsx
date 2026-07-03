"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuizInput } from "@/types/quiz";

export interface SurveyResponse {
  relevansi: number; // 1–5
  kemudahan: number; // 1–5
  komentar: string;
  personaId: QuizInput["personaId"] | null;
  createdAt: string; // ISO
}

// TODO(db): ganti dengan `await fetch("/api/survey", { method: "POST", body: JSON.stringify(r) })`
async function persistResponse(_r: SurveyResponse): Promise<void> {
  // Sengaja kosong di V1, jawaban tidak disimpan.
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
              "transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded",
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

  // Muncul otomatis setelah 3.5 detik, user sudah sempat melihat hasil
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3500);
    return () => clearTimeout(t);
  }, []);

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
  }

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 w-72 rounded-xl border border-line bg-white shadow-[0_2px_8px_rgba(15,23,42,0.10)]",
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
          onClick={() => setVisible(false)}
          aria-label="Tutup survei"
          className="rounded p-0.5 text-muted-foreground hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
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
              onChange={setRelevansi}
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
              onChange={setKemudahan}
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
              onClick={() => setShowKomentar(true)}
              className="text-xs text-muted-foreground underline-offset-2 hover:text-ink hover:underline focus-visible:outline-none"
            >
              + Tambah masukan teks
            </button>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-0.5">
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="text-xs text-muted-foreground hover:text-ink focus-visible:outline-none"
            >
              Lewati
            </button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="h-7 bg-sawah px-3 text-xs text-white hover:bg-sawah/90 disabled:opacity-40"
            >
              {submitting ? "..." : "Kirim"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
