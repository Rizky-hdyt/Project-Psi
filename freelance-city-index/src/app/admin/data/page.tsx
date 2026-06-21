"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { validateIndicatorScore } from "@/lib/validation/adminInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import districtsData from "@/data/districts.seed.json";

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
}

type DistrictForm = Record<IndicatorId, FieldState>;

function initForm(
  districtId: string,
  scores: { districtId: string; indicatorId: string; skor: number }[]
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
    };
  }
  return form;
}

export default function DataManagementPage() {
  const { state, updateScore } = useAdmin();
  const districts = districtsData.districts;

  const [forms, setForms] = useState<Record<string, DistrictForm>>(() => {
    const init: Record<string, DistrictForm> = {};
    for (const d of districts) {
      init[d.id] = initForm(d.id, state.scores);
    }
    return init;
  });

  const [savedDistrict, setSavedDistrict] = useState<string | null>(null);

  useEffect(() => {
    if (savedDistrict) {
      const t = setTimeout(() => setSavedDistrict(null), 3000);
      return () => clearTimeout(t);
    }
  }, [savedDistrict]);

  function handleChange(districtId: string, indicatorId: IndicatorId, e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    const error = val === "" ? null : validateIndicatorScore(val);
    setForms((prev) => ({
      ...prev,
      [districtId]: {
        ...prev[districtId],
        [indicatorId]: { value: val, error, saved: false },
      },
    }));
  }

  function handleSave(districtId: string) {
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

    for (const ind of INDICATORS) {
      updateScore(districtId, ind.id, Number(form[ind.id].value));
      updated[ind.id] = { ...updated[ind.id], saved: true };
    }

    setForms((prev) => ({ ...prev, [districtId]: updated }));
    setSavedDistrict(districtId);
  }

  function isFormDirty(districtId: string): boolean {
    const form = forms[districtId];
    return INDICATORS.some((ind) => {
      const original = state.scores.find(
        (s) => s.districtId === districtId && s.indicatorId === ind.id
      );
      return form[ind.id].value !== String(original?.skor ?? "");
    });
  }

  function hasFormError(districtId: string): boolean {
    return INDICATORS.some((ind) => !!forms[districtId][ind.id].error);
  }

  const districtName = (id: string) =>
    districts.find((d) => d.id === id)?.nama ?? id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink">Data Indikator</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Perbarui skor indikator (0–100) per distrik. Perubahan berlaku langsung.
        </p>
      </div>

      <div className="grid gap-4 max-w-[680px]">
        {districts.map((district) => {
          const form = forms[district.id];
          const isSaved = savedDistrict === district.id;
          const dirty = isFormDirty(district.id);
          const hasErr = hasFormError(district.id);

          return (
            <div
              key={district.id}
              className="rounded-lg border border-line bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-ink">{district.nama}</h2>
                  <p className="text-xs text-muted-foreground">{district.tipe}</p>
                </div>
                {isSaved && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-sawah">
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
                      <Label
                        htmlFor={`${district.id}-${ind.id}`}
                        className="text-xs font-medium text-ink"
                      >
                        {ind.label}
                      </Label>
                      <Input
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
                        className="h-9 font-mono"
                      />
                      {field.error ? (
                        <p
                          id={`${district.id}-${ind.id}-err`}
                          className="text-xs text-error"
                          role="alert"
                        >
                          {field.error}
                        </p>
                      ) : (
                        <p className="text-[11px] text-muted-foreground">{ind.desc}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  size="sm"
                  disabled={!dirty || hasErr}
                  onClick={() => handleSave(district.id)}
                  className="gap-1.5 bg-sawah text-white hover:bg-sawah/90 disabled:opacity-40"
                >
                  <Save className="h-3.5 w-3.5" />
                  Simpan {districtName(district.id)}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
