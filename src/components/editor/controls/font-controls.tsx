"use client";

import { useId, useState } from "react";
import {
  BRAND_FONTS,
  GOOGLE_FONT_SUGGESTIONS,
  WEIGHT_NAMES,
  availableWeights,
  fontChoiceToCss,
  loadGoogleFont,
  nearestWeight,
  type FontChoice,
  type FontSettings,
  type FontSlot,
  type FontSlotSettings,
} from "@/lib/fonts";

const SLOTS: { slot: FontSlot; label: string }[] = [
  { slot: "title", label: "Títulos" },
  { slot: "body", label: "Textos" },
];

export function FontControls({
  fonts,
  onChange,
}: {
  fonts: FontSettings;
  onChange: (slot: FontSlot, settings: FontSlotSettings) => void;
}) {
  return (
    <div className="space-y-6">
      {SLOTS.map(({ slot, label }) => (
        <FontSlotControl key={slot} label={label} value={fonts[slot]} onChange={(s) => onChange(slot, s)} />
      ))}
    </div>
  );
}

type Status = { state: "idle" } | { state: "loading" } | { state: "error"; message: string };

function FontSlotControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: FontSlotSettings;
  onChange: (settings: FontSlotSettings) => void;
}) {
  const listId = useId();
  const { font, weight } = value;
  const [googleMode, setGoogleMode] = useState(font.kind === "google");
  const [query, setQuery] = useState(font.kind === "google" ? font.family : "");
  const [status, setStatus] = useState<Status>({ state: "idle" });

  function selectFont(next: FontChoice) {
    onChange({ font: next, weight: nearestWeight(availableWeights(next), weight) });
  }

  async function applyGoogleFont() {
    const typed = query.trim();
    if (!typed) return;
    const family = GOOGLE_FONT_SUGGESTIONS.find((f) => f.toLowerCase() === typed.toLowerCase()) ?? typed;
    setStatus({ state: "loading" });
    try {
      const weights = await loadGoogleFont(family);
      setQuery(family);
      selectFont({ kind: "google", family, weights });
      setStatus({ state: "idle" });
    } catch (err) {
      setStatus({
        state: "error",
        message: err instanceof Error ? err.message : "Não foi possível carregar a fonte.",
      });
    }
  }

  const options = [...BRAND_FONTS.map((f) => ({ id: f.id, label: f.label })), { id: "google", label: "Google Fonts" }];
  const selectedId = googleMode ? "google" : font.kind === "brand" ? font.id : "google";
  const weights = availableWeights(font);

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-[#1c1530]">{label}</p>
        <p
          className="min-w-0 truncate text-lg leading-none text-[#1c1530]"
          style={{ fontFamily: fontChoiceToCss(font), fontWeight: weight }}
        >
          Aa Bb 123
        </p>
      </div>

      <div className="grid grid-cols-3 gap-1 rounded-lg bg-black/[0.04] p-1">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => {
              if (opt.id === "google") {
                setGoogleMode(true);
              } else {
                setGoogleMode(false);
                setStatus({ state: "idle" });
                selectFont({ kind: "brand", id: opt.id as "specify" | "univers" });
              }
            }}
            className={`h-8 rounded-md text-xs font-medium transition-colors ${
              selectedId === opt.id ? "bg-white text-[#1c1530] shadow-sm" : "text-[#6b6480] hover:text-[#1c1530]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {googleMode && (
        <form
          className="mt-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            applyGoogleFont();
          }}
        >
          <div className="flex gap-2">
            <input
              list={listId}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex.: Montserrat"
              className="h-9 min-w-0 flex-1 rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#7B48EA]"
            />
            <button
              type="submit"
              disabled={!query.trim() || status.state === "loading"}
              className="h-9 rounded-lg bg-[#1c1530] px-3 text-xs font-semibold text-white transition-opacity disabled:opacity-40"
            >
              {status.state === "loading" ? "Carregando…" : "Aplicar"}
            </button>
          </div>
          <datalist id={listId}>
            {GOOGLE_FONT_SUGGESTIONS.map((f) => (
              <option key={f} value={f} />
            ))}
          </datalist>
          {status.state === "error" ? (
            <p className="mt-1.5 text-[11px] text-[#c03a3a]">{status.message}</p>
          ) : (
            <p className="mt-1.5 text-[11px] text-[#8a83a0]">
              Digite o nome exatamente como aparece em fonts.google.com.
            </p>
          )}
        </form>
      )}

      <div className="mt-2.5 flex flex-wrap gap-1.5" role="radiogroup" aria-label={`Peso — ${label}`}>
        {weights.map((w) => (
          <button
            key={w}
            type="button"
            role="radio"
            aria-checked={w === weight}
            onClick={() => onChange({ font, weight: w })}
            className={`h-7 rounded-full border px-2.5 text-[11px] transition-colors ${
              w === weight
                ? "border-[#7B48EA] bg-[#7B48EA] text-white"
                : "border-black/10 bg-white text-[#1c1530] hover:border-[#7B48EA]/50"
            }`}
            style={{ fontFamily: fontChoiceToCss(font), fontWeight: w }}
          >
            {WEIGHT_NAMES[w] ?? w}
          </button>
        ))}
      </div>
    </div>
  );
}
