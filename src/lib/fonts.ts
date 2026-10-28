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

export type GoogleFontResponse = { family: string; weights: number[]; css: string } | { error: string };

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

const loadedFamilies = new Map<string, Promise<number[]>>();

/**
 * Carrega uma família do Google Fonts sob demanda e resolve com os pesos disponíveis.
 * Os pesos e o CSS vêm de `/api/google-font`. O CSS é injetado como <style> inline
 * (e não <link>) para que o html-to-image consiga ler as regras @font-face e embutir
 * a fonte no PNG exportado.
 */
export function loadGoogleFont(family: string): Promise<number[]> {
  const key = family.trim().toLowerCase();
  const cached = loadedFamilies.get(key);
  if (cached) return cached;

  const promise = (async () => {
    let res: Response;
    try {
      res = await fetch(`/api/google-font?family=${encodeURIComponent(family.trim())}`);
    } catch {
      throw new Error("Sem conexão. Verifique a internet e tente novamente.");
    }
    const data = (await res.json().catch(() => null)) as GoogleFontResponse | null;
    if (!res.ok || !data || "error" in data) {
      throw new Error(data && "error" in data ? data.error : "Não foi possível carregar a fonte.");
    }
    const { weights, css } = data;

    const style = document.createElement("style");
    style.dataset.googleFont = family;
    style.textContent = css;
    document.head.appendChild(style);

    await Promise.all(weights.map((w) => document.fonts.load(`${w} 32px "${family}"`, "Áa")));
    return weights;
  })();

  loadedFamilies.set(key, promise);
  promise.catch(() => loadedFamilies.delete(key));
  return promise;
}
