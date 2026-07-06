"use client";

import { useState, useEffect, ChangeEvent, useMemo } from "react";
import Image from "next/image";
import { Save, CheckCircle2, TriangleAlert, RefreshCw } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useAdminSearch } from "@/contexts/AdminSearchContext";
import { useDistricts } from "@/hooks/useDistricts";
import { getDistrictVisual } from "@/data/districts.visuals";
import { validateIndicatorScore } from "@/lib/validation/adminInput";
import { cn } from "@/lib/utils";

const INDICATORS = [
  { id: "internet", label: "Internet Quality", desc: "Kualitas & kecepatan internet (0–100)" },
  { id: "cost", label: "Biaya Hidup", desc: "Keterjangkauan (0 = mahal, 100 = sangat murah)" },
  { id: "community", label: "Komunitas", desc: "Keaktifan komunitas freelancer/remote (0–100)" },
  { id: "environment", label: "Lingkungan", desc: "Kenyamanan lingkungan kerja (0–100)" },
] as const;

type IndicatorId = (typeof INDICATORS)[number]["id"];

interface FieldState {
  value: string;
  error: string | null;
  saved: boolean;
  // Snapshot updatedAt saat form dibuka — dikirim balik sebagai
  // "expectedUpdatedAt" ke server untuk optimistic locking (PRD §6.2:
  // dua admin edit distrik sama bersamaan harus terdeteksi konflik).
  loadedUpdatedAt: string | null;
}

type DistrictForm = Record<IndicatorId, FieldState>;

function initForm(
  districtId: string,
  scores: { districtId: string; indicatorId: string; skor: number; updatedAt: string }[]
): DistrictForm {
  const form = {} as DistrictForm;
  for (const ind of INDICATORS) {
    const found = scores.find(
      (s) => s.districtId === districtId && s.indicatorId === ind.id
    );
    form[ind.id] = {
      value: found ? String(found.skor) : "",
      error: null,
      saved: false,
      loadedUpdatedAt: found?.updatedAt ?? null,
    };
  }
  return form;
}

export default function DataManagementPage() {
  const { updateScoresBulk } = useAdmin();
  const { query } = useAdminSearch();
  const { districts, scores, loading, error } = useDistricts();

  const [forms, setForms] = useState<Record<string, DistrictForm>>({});
  const [savedDistrict, setSavedDistrict] = useState<string | null>(null);
  const [savingDistrict, setSavingDistrict] = useState<string | null>(null);
  const [conflictDistrict, setConflictDistrict] = useState<string | null>(null);

  // Initialize forms once data is loaded from API — dilakukan saat render
  // (pola "adjust state when props change"), bukan di dalam effect, supaya
  // tidak memicu cascading render setelah commit
  const [formsInitialized, setFormsInitialized] = useState(false);
  if (!loading && districts.length > 0 && !formsInitialized) {
    const init: Record<string, DistrictForm> = {};
    for (const d of districts) {
      init[d.id] = initForm(d.id, scores);
    }
    setForms(init);
    setFormsInitialized(true);
  }

  useEffect(() => {
    if (savedDistrict) {
      const t = setTimeout(() => setSavedDistrict(null), 3000);
      return () => clearTimeout(t);
    }
  }, [savedDistrict]);

  function handleChange(districtId: string, indicatorId: IndicatorId, e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    const err = val === "" ? null : validateIndicatorScore(val);
    setForms((prev) => ({
      ...prev,
      [districtId]: {
        ...prev[districtId],
        [indicatorId]: { ...prev[districtId][indicatorId], value: val, error: err, saved: false },
      },
    }));
  }

  async function handleSave(districtId: string) {
    const form = forms[districtId];
    let hasError = false;
    const updated = { ...form } as DistrictForm;

    for (const ind of INDICATORS) {
      const { value } = form[ind.id];
      if (value === "") {
        updated[ind.id] = { ...form[ind.id], error: "Wajib diisi" };
        hasError = true;
        continue;
      }
      const err = validateIndicatorScore(value);
      if (err) {
        updated[ind.id] = { ...form[ind.id], error: err };
        hasError = true;
      }
    }

    if (hasError) {
      setForms((prev) => ({ ...prev, [districtId]: updated }));
      return;
    }

    setConflictDistrict(null);
    setSavingDistrict(districtId);
    const result = await updateScoresBulk(
      districtId,
      INDICATORS.map((ind) => ({
        indicatorId: ind.id,
        skor: Number(form[ind.id].value),
        expectedUpdatedAt: form[ind.id].loadedUpdatedAt,
      }))
    );
    setSavingDistrict(null);

    if (result.conflict) {
      setConflictDistrict(districtId);
      return;
    }

    if (result.ok) {
      const saved = { ...form } as DistrictForm;
      for (const ind of INDICATORS) {
        saved[ind.id] = { ...updated[ind.id], saved: true };
      }
      setForms((prev) => ({ ...prev, [districtId]: saved }));
      setSavedDistrict(districtId);
    }
  }

  function isFormDirty(districtId: string): boolean {
    const form = forms[districtId];
    if (!form) return false;
    return INDICATORS.some((ind) => {
      const original = scores.find(
        (s) => s.districtId === districtId && s.indicatorId === ind.id
      );
      return form[ind.id].value !== String(original?.skor ?? "");
    });
  }

  function hasFormError(districtId: string): boolean {
    if (!forms[districtId]) return false;
    return INDICATORS.some((ind) => !!forms[districtId][ind.id].error);
  }

  const districtName = (id: string) =>
    districts.find((d) => d.id === id)?.nama ?? id;

  const filteredDistricts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return districts;
    return districts.filter((d) => d.nama.toLowerCase().includes(q));
  }, [districts, query]);

  return (
    <div className="pb-6">
      <div className="mb-4">
        <h1 className="text-[19px] font-extrabold tracking-tight text-[var(--a-ink)]">Data Distrik</h1>
        <p className="mt-1 text-[12.5px] font-medium text-[var(--a-muted)]">
          Perbarui skor indikator (0–100) per distrik. Perubahan berlaku langsung &amp; tercatat di
          Log Aktivitas.
        </p>
      </div>

      {loading && (
        <div className="grid max-w-[720px] gap-3.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 animate-pulse rounded-[16px] bg-white" />
          ))}
        </div>
      )}

      {error && (
        <div className="max-w-[720px] rounded-[12px] border border-[var(--a-red-border)] bg-[var(--a-red-soft)] px-4 py-3 text-[12.5px] font-medium text-[var(--a-red)]">
          Koneksi terputus. Coba muat ulang halaman.
        </div>
      )}

      {!loading && !error && (
        <div className="grid max-w-[720px] gap-3.5">
          {filteredDistricts.length === 0 && (
            <p className="text-[12.5px] text-[var(--a-muted)]">
              Tidak ada distrik yang cocok dengan pencarian &quot;{query}&quot;.
            </p>
          )}
          {filteredDistricts.map((district) => {
            const form = forms[district.id];
            if (!form) return null;
            const isSaved = savedDistrict === district.id;
            const isSaving = savingDistrict === district.id;
            const hasConflict = conflictDistrict === district.id;
            const dirty = isFormDirty(district.id);
            const hasErr = hasFormError(district.id);
            const visual = getDistrictVisual(district.id);

            return (
              <div
                key={district.id}
                className="rounded-[16px] border border-[var(--a-line-2)] bg-white p-5 shadow-[0_1px_2px_rgba(25,29,39,.04)]"
              >
                {hasConflict && (
                  <div
                    className="mb-4 flex items-start gap-2.5 rounded-[10px] border px-3.5 py-3"
                    style={{ borderColor: "var(--a-amber)", background: "var(--a-amber-soft)" }}
                    role="alert"
                  >
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--a-amber)" }} />
                    <div className="flex-1">
                      <p className="text-[12.5px] font-semibold text-[var(--a-ink-2)]">
                        Data {district.nama} sudah diubah di sesi lain sejak halaman ini dibuka. Muat
                        ulang dulu sebelum menyimpan lagi, supaya perubahan Anda tidak menimpa punya
                        orang lain.
                      </p>
                      <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--a-red)] hover:underline"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Muat Ulang Halaman
                      </button>
                    </div>
                  </div>
                )}

                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-14 shrink-0 overflow-hidden rounded-[9px] border border-[var(--a-line)]">
                      <Image
                        src={visual.imageUrl}
                        alt=""
                        width={56}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-[var(--a-ink)]">{district.nama}</h2>
                      <p className="text-[11px] font-semibold text-[var(--a-faint)]">{district.tipe}</p>
                    </div>
                  </div>
                  {isSaved && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--a-red)]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Tersimpan
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {INDICATORS.map((ind) => {
                    const field = form[ind.id];
                    return (
                      <div key={ind.id} className="space-y-1">
                        <label
                          htmlFor={`${district.id}-${ind.id}`}
                          className="text-xs font-bold text-[var(--a-ink-2)]"
                        >
                          {ind.label}
                        </label>
                        <input
                          id={`${district.id}-${ind.id}`}
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          value={field.value}
                          onChange={(e) => handleChange(district.id, ind.id, e)}
                          aria-invalid={!!field.error}
                          aria-describedby={
                            field.error ? `${district.id}-${ind.id}-err` : undefined
                          }
                          className={cn(
                            "min-h-11 w-full rounded-[10px] border bg-white px-3 font-mono text-sm text-[var(--a-ink)] outline-none transition-colors",
                            field.error
                              ? "border-[var(--a-red)]"
                              : "border-[var(--a-line-2)] focus:border-[#f2aab5] focus:shadow-[0_0_0_3px_rgba(224,38,60,.07)]"
                          )}
                        />
                        {field.error ? (
                          <p
                            id={`${district.id}-${ind.id}-err`}
                            className="text-xs font-semibold text-[var(--a-red)]"
                            role="alert"
                          >
                            {field.error}
                          </p>
                        ) : (
                          <p className="text-[11px] font-medium text-[var(--a-faint)]">{ind.desc}</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={!dirty || hasErr || isSaving || hasConflict}
                    onClick={() => handleSave(district.id)}
                    className="flex min-h-11 items-center gap-1.5 rounded-[10px] bg-[var(--a-red)] px-4 text-[12.5px] font-bold text-white shadow-[0_2px_6px_rgba(224,38,60,.25)] transition-colors hover:bg-[var(--a-red-dark)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Save className="h-3.5 w-3.5" />
                    {isSaving ? "Menyimpan..." : `Simpan ${districtName(district.id)}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
