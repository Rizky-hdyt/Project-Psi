"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, X } from "lucide-react";
import { QA_BANK, matchQuestion, FALLBACK_ANSWER, type AssistantContext } from "@/lib/assistant/qaBank";
import { cn } from "@/lib/utils";

interface Message {
  role: "assistant" | "user";
  text: string;
}

interface Props {
  ctx: AssistantContext | null;
  onClose?: () => void;
  className?: string;
}

// Isi chat FCI Assistant, dipakai di 2 tempat (CLAUDE.md §15.10): halaman penuh
// `/assistant` (mobile/layar sempit) dan panel docked di Result page (layar
// lebar, `lg:` ke atas) — satu implementasi, beda pembungkus saja.
export function AssistantChat({ ctx, onClose, className }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Halo! Saya FCI Assistant. Saya bisa bantu jelaskan seputar rekomendasi, skor, dan algoritma di balik hasil Anda — coba pilih salah satu pertanyaan di bawah, atau ketik sendiri.",
    },
  ]);
  const [input, setInput] = useState("");
  const [askedIds, setAskedIds] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function respond(question: string) {
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    const matched = ctx ? matchQuestion(question) : null;
    const answerText = matched ? matched.answer(ctx!) : FALLBACK_ANSWER;
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: answerText }]);
    }, 250);
  }

  function askChip(id: string, chipLabel: string) {
    setAskedIds((prev) => new Set(prev).add(id));
    respond(chipLabel);
  }

  function submitFreeText() {
    const trimmed = input.trim();
    if (!trimmed) return;
    respond(trimmed);
    setInput("");
  }

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden rounded-[22px] border border-line bg-white shadow-[0_4px_14px_rgba(30,35,48,0.04)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-line bg-ink px-4 py-3.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sawah">
          <Sparkles className="h-4 w-4 text-white" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">FCI Assistant</p>
          <p className="truncate text-[11px] text-white/60">
            Jawaban berbasis aturan, tanpa AI/API eksternal
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup FCI Assistant"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
              m.role === "assistant" ? "bg-secondary text-ink" : "ml-auto bg-sawah text-white"
            )}
          >
            {m.text}
          </div>
        ))}

        {ctx &&
          QA_BANK.map((entry) =>
            askedIds.has(entry.id) ? null : (
              <button
                key={entry.id}
                type="button"
                onClick={() => askChip(entry.id, entry.chipLabel)}
                className="block w-full rounded-full border border-sawah/30 bg-white px-3.5 py-2 text-left text-xs font-medium text-sawah transition-colors hover:bg-sawah/5"
              >
                {entry.chipLabel}
              </button>
            )
          )}

        {!ctx && (
          <p className="text-xs text-muted-foreground">
            Isi quiz dulu supaya jawaban bisa disesuaikan dengan hasil rekomendasi Anda.
          </p>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-line px-3 py-2.5">
        <div className="flex items-center gap-2 rounded-full border border-line bg-secondary px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitFreeText();
            }}
            placeholder="Ketik pertanyaan Anda..."
            aria-label="Ketik pertanyaan untuk FCI Assistant"
            className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={submitFreeText}
            aria-label="Kirim pertanyaan"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sawah text-white transition-colors hover:bg-sawah/90"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
