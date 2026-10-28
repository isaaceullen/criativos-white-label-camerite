// Cores do projeto no Figma (estilos "Primária" / "Secundária" / "Branco" / "Preto").
// Cada token vira uma CSS variable (`--primaria-1`, ...) aplicada na raiz do post.
export const PALETTE = [
  { key: "primaria-1", label: "Primária 1", hint: "Destaques, CTAs e títulos", default: "#7B48EA" },
  { key: "primaria-2", label: "Primária 2", hint: "Símbolo da logo em fundos escuros", default: "#A785F1" },
  { key: "primaria-3", label: "Primária 3", hint: "Barras do gráfico e detalhes claros", default: "#D3C2F8" },
  { key: "secundaria-2", label: "Secundária 2", hint: "Caixas de título", default: "#3E2475" },
  { key: "secundaria-3", label: "Secundária 3", hint: "Fundos escuros e textos", default: "#29184E" },
  { key: "branco", label: "Branco", hint: "Fundos claros e textos sobre escuro", default: "#FFFFFF" },
  { key: "preto", label: "Preto", hint: "Logos sobre fundo claro", default: "#000000" },
] as const;

export type ColorKey = (typeof PALETTE)[number]["key"];
export type Palette = Record<ColorKey, string>;

export const DEFAULT_PALETTE = Object.fromEntries(
  PALETTE.map((c) => [c.key, c.default]),
) as Palette;

export function paletteToCssVars(palette: Palette): Record<string, string> {
  return Object.fromEntries(PALETTE.map((c) => [`--${c.key}`, palette[c.key]]));
}
