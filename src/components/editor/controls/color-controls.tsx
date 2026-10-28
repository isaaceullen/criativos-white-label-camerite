"use client";

import { PALETTE, type ColorKey, type Palette } from "@/lib/palette";

const HEX = /^#?([0-9a-f]{6})$/i;

export function ColorControls({
  palette,
  onChange,
}: {
  palette: Palette;
  onChange: (key: ColorKey, value: string) => void;
}) {
  return (
    <ul className="space-y-2.5">
      {PALETTE.map((token) => {
        const value = palette[token.key];
        return (
          <li key={token.key} className="flex items-center gap-3">
            <label
              className="relative size-9 shrink-0 cursor-pointer overflow-hidden rounded-lg ring-1 ring-black/10"
              style={{ background: value }}
              title={`Escolher ${token.label}`}
            >
              <input
                type="color"
                value={value.toLowerCase()}
                onChange={(e) => onChange(token.key, e.target.value.toUpperCase())}
                className="absolute inset-0 size-full cursor-pointer opacity-0"
              />
            </label>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-tight text-[#1c1530]">{token.label}</p>
              <p className="truncate text-[11px] leading-tight text-[#8a83a0]">{token.hint}</p>
            </div>
            <input
              key={value}
              defaultValue={value.toUpperCase()}
              spellCheck={false}
              aria-label={`Hex ${token.label}`}
              className="h-8 w-[84px] rounded-md border border-black/10 bg-white px-2 font-mono text-xs uppercase text-[#1c1530] outline-none focus:border-[#7B48EA]"
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
              onBlur={(e) => {
                const match = e.currentTarget.value.trim().match(HEX);
                if (match) onChange(token.key, `#${match[1].toUpperCase()}`);
                else e.currentTarget.value = value.toUpperCase();
              }}
            />
          </li>
        );
      })}
    </ul>
  );
}
