import { NextResponse } from "next/server";
import { askGemini, GeminiError, type ChatTurn } from "@/lib/assistant/geminiClient";
import type { AssistantContext } from "@/lib/assistant/qaBank";

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_TURNS = 6;
const MAX_HISTORY_TEXT_LENGTH = 300;

function isValidCtx(value: unknown): value is AssistantContext {
  if (!value || typeof value !== "object") return false;
  const ctx = value as Record<string, unknown>;
  return (
    typeof ctx.personaLabel === "string" &&
    ctx.personaLabel.trim().length > 0 &&
    typeof ctx.bestName === "string" &&
    ctx.bestName.trim().length > 0 &&
    typeof ctx.bestScore === "number" &&
    Number.isFinite(ctx.bestScore) &&
    typeof ctx.isBelowUMK === "boolean"
  );
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
    if (!isValidCtx(ctx)) {
      return NextResponse.json({ error: "Konteks sesi tidak valid" }, { status: 400 });
    }

    const answer = await askGemini(message.trim(), ctx, sanitizeHistory(history));
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
