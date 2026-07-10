import { NextResponse } from "next/server";
import { askGemini, GeminiError, type ChatTurn } from "@/lib/assistant/geminiClient";
import type { AssistantContext } from "@/lib/assistant/qaBank";

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_TURNS = 6;
const MAX_HISTORY_TEXT_LENGTH = 300;

const MAX_NAME_LENGTH = 60;
const MAX_RANKING_ITEMS = 5;
const INDICATOR_IDS = ["internet", "cost", "community", "environment"] as const;

function finiteNum(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function sanitizeIndicatorScores(v: unknown): AssistantContext["weights"] | null {
  if (!v || typeof v !== "object") return null;
  const raw = v as Record<string, unknown>;
  const out = {} as NonNullable<AssistantContext["weights"]>;
  for (const id of INDICATOR_IDS) {
    if (!finiteNum(raw[id])) return null;
    out[id] = raw[id];
  }
  return out;
}

// Server tidak percaya bentuk ctx dari client — 4 field inti wajib valid,
// field grounding opsional di-whitelist per-field dengan cap panjang array &
// string (payload aneh dibuang diam-diam, bukan bikin request gagal).
function sanitizeCtx(value: unknown): AssistantContext | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const coreValid =
    typeof raw.personaLabel === "string" &&
    raw.personaLabel.trim().length > 0 &&
    typeof raw.bestName === "string" &&
    raw.bestName.trim().length > 0 &&
    finiteNum(raw.bestScore) &&
    typeof raw.isBelowUMK === "boolean";
  if (!coreValid) return null;

  const ctx: AssistantContext = {
    personaLabel: (raw.personaLabel as string).slice(0, MAX_NAME_LENGTH),
    bestName: (raw.bestName as string).slice(0, MAX_NAME_LENGTH),
    bestScore: raw.bestScore as number,
    isBelowUMK: raw.isBelowUMK as boolean,
  };

  if (finiteNum(raw.budget)) ctx.budget = raw.budget;

  const weights = sanitizeIndicatorScores(raw.weights);
  if (weights) ctx.weights = weights;

  if (Array.isArray(raw.ranking)) {
    const ranking: NonNullable<AssistantContext["ranking"]> = [];
    for (const item of raw.ranking.slice(0, MAX_RANKING_ITEMS)) {
      if (!item || typeof item !== "object") continue;
      const r = item as Record<string, unknown>;
      const skorPerIndikator = sanitizeIndicatorScores(r.skorPerIndikator);
      if (!finiteNum(r.rank) || typeof r.nama !== "string" || !finiteNum(r.skorTotal) || !skorPerIndikator) continue;
      ranking.push({
        rank: r.rank,
        nama: r.nama.slice(0, MAX_NAME_LENGTH),
        skorTotal: r.skorTotal,
        skorPerIndikator,
        topKecamatan: typeof r.topKecamatan === "string" ? r.topKecamatan.slice(0, MAX_NAME_LENGTH) : undefined,
      });
    }
    if (ranking.length > 0) ctx.ranking = ranking;
  }

  if (Array.isArray(raw.bestKecamatan)) {
    const list: NonNullable<AssistantContext["bestKecamatan"]> = [];
    for (const item of raw.bestKecamatan.slice(0, MAX_RANKING_ITEMS)) {
      if (!item || typeof item !== "object") continue;
      const k = item as Record<string, unknown>;
      if (!finiteNum(k.rank) || typeof k.nama !== "string" || !finiteNum(k.skorTotal)) continue;
      list.push({ rank: k.rank, nama: k.nama.slice(0, MAX_NAME_LENGTH), skorTotal: k.skorTotal });
    }
    if (list.length > 0) ctx.bestKecamatan = list;
  }

  return ctx;
}

// Server tidak percaya cap/panjang yang dikirim client — re-cap di sini supaya
// jadi pengaman biaya/abuse yang sebenarnya (defense in depth), bukan cuma UX.
function sanitizeHistory(value: unknown): ChatTurn[] {
  if (!Array.isArray(value)) return [];
  const valid = value.filter(
    (item): item is ChatTurn =>
      !!item &&
      typeof item === "object" &&
      (item.role === "user" || item.role === "assistant") &&
      typeof item.text === "string"
  );
  return valid.slice(-MAX_HISTORY_TURNS).map((turn) => ({
    role: turn.role,
    text: turn.text.slice(0, MAX_HISTORY_TEXT_LENGTH),
  }));
}

export async function POST(req: Request) {
  try {
    const { message, ctx, history } = await req.json();

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: "Pesan terlalu panjang" }, { status: 400 });
    }
    const cleanCtx = sanitizeCtx(ctx);
    if (!cleanCtx) {
      return NextResponse.json({ error: "Konteks sesi tidak valid" }, { status: 400 });
    }

    const answer = await askGemini(message.trim(), cleanCtx, sanitizeHistory(history));
    return NextResponse.json({ answer }, { status: 200 });
  } catch (err) {
    if (err instanceof GeminiError) {
      console.error(`[api/chat] GeminiError(${err.kind}):`, err.message);
    } else {
      console.error("[api/chat] Unexpected error:", err);
    }
    return NextResponse.json(
      { error: "Asisten AI sedang tidak bisa dihubungi" },
      { status: 500 }
    );
  }
}
