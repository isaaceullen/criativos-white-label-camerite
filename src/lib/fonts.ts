export type BrandFontId = "specify" | "univers";

export type FontChoice =
  | { kind: "brand"; id: BrandFontId }
  | { kind: "google"; family: string; weights: number[] };

export type FontSlot = "title" | "body";
export type FontSlotSettings = { font: FontChoice; weight: number };
export type FontSettings = Record<FontSlot, FontSlotSettings>;

export const WEIGHT_NAMES: Record<number, string> = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
  900: "Black",
};

const ALL_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

// Os pesos precisam bater com os arquivos declarados em `src/fonts/index.ts`.
export const BRAND_FONTS: { id: BrandFontId; label: string; cssVar: string; weights: number[] }[] = [
  { id: "specify", label: "Specify", cssVar: "--font-specify", weights: [100, 300, 500, 700, 900] },
  { id: "univers", label: "Univers", cssVar: "--font-univers", weights: [400, 700, 900] },
];

export const DEFAULT_FONTS: FontSettings = {
  title: { font: { kind: "brand", id: "specify" }, weight: 900 },
  body: { font: { kind: "brand", id: "univers" }, weight: 400 },
};

// Sugestões rápidas. Qualquer outra família do Google Fonts pode ser digitada no campo.
export const GOOGLE_FONT_SUGGESTIONS = [
  "Inter",
  "Montserrat",
  "Poppins",
  "Roboto",
  "Open Sans",
  "Lato",
  "Raleway",
  "Nunito",
  "Work Sans",
  "DM Sans",
  "Manrope",
  "Plus Jakarta Sans",
  "Outfit",
  "Sora",
  "Space Grotesk",
  "Archivo",
  "Archivo Black",
  "Unbounded",
  "Syne",
  "Lexend",
  "Rubik",
  "Urbanist",
  "Figtree",
  "Bricolage Grotesque",
  "Oswald",
  "Bebas Neue",
  "Anton",
  "Barlow",
  "Barlow Condensed",
  "Kanit",
  "Exo 2",
  "Titillium Web",
  "Playfair Display",
  "Merriweather",
  "Lora",
  "Libre Baskerville",
  "Fraunces",
  "DM Serif Display",
  "Source Sans 3",
  "IBM Plex Sans",
];

export function fontChoiceToCss(choice: FontChoice): string {
  if (choice.kind === "brand") {
    const font = BRAND_FONTS.find((f) => f.id === choice.id)!;
    return `var(${font.cssVar}), sans-serif`;
  }
  return `"${choice.family}", sans-serif`;
}

export function availableWeights(choice: FontChoice): number[] {
  if (choice.kind === "brand") return BRAND_FONTS.find((f) => f.id === choice.id)!.weights;
  return choice.weights.length > 0 ? choice.weights : [400];
}

export function nearestWeight(weights: number[], target: number): number {
  return weights.reduce((best, w) => (Math.abs(w - target) < Math.abs(best - target) ? w : best), weights[0]);
}

const KEPT_SUBSETS = new Set(["latin", "latin-ext"]);
const loadedFamilies = new Map<string, Promise<number[]>>();

function googleCssBase(family: string): string {
  const name = encodeURIComponent(family.trim()).replace(/%20/g, "+");
  return `https://fonts.googleapis.com/css2?family=${name}`;
}

function keepLatinSubsets(css: string): string {
  const blocks = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)];
  if (blocks.length === 0) return css;
  const kept = blocks.filter((b) => KEPT_SUBSETS.has(b[1])).map((b) => b[2]);
  return kept.length > 0 ? kept.join("\n") : css;
}

/**
 * Carrega uma família do Google Fonts sob demanda e resolve com os pesos disponíveis.
 * O CSS é injetado como <style> inline (e não <link>) para que o html-to-image
 * consiga ler as regras @font-face e embutir a fonte no PNG exportado.
 */
export function loadGoogleFont(family: string): Promise<number[]> {
  const key = family.trim().toLowerCase();
  const cached = loadedFamilies.get(key);
  if (cached) return cached;

  const promise = (async () => {
    const base = googleCssBase(family);
    // A API responde 400 para pesos que a família não tem, então testamos cada um.
    const probes = await Promise.all(
      ALL_WEIGHTS.map(async (w) => ((await fetch(`${base}:wght@${w}&display=swap`)).ok ? w : null)),
    );
    let weights = probes.filter((w): w is number => w !== null);
    let url = `${base}:wght@${weights.join(";")}&display=swap`;
    if (weights.length === 0) {
      weights = [400];
      url = `${base}&display=swap`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`A fonte "${family}" não foi encontrada no Google Fonts.`);

    const style = document.createElement("style");
    style.dataset.googleFont = family;
    style.textContent = keepLatinSubsets(await res.text());
    document.head.appendChild(style);

    await Promise.all(weights.map((w) => document.fonts.load(`${w} 32px "${family}"`, "Áa")));
    return weights;
  })();

  loadedFamilies.set(key, promise);
  promise.catch(() => loadedFamilies.delete(key));
  return promise;
}
