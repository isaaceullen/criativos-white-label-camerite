import { cacheLife } from "next/cache";
import type { GoogleFontResponse } from "@/lib/fonts";

const ALL_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const KEPT_SUBSETS = new Set(["latin", "latin-ext"]);
// O Google só serve woff2 para navegadores modernos; sem isso o CSS aponta para TTF.
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

/**
 * O Google Fonts responde 400 sem cabeçalho CORS para pesos que a família não tem,
 * o que o navegador transforma em "Failed to fetch". Por isso a consulta é feita aqui.
 */
export async function GET(request: Request) {
  const family = new URL(request.url).searchParams.get("family")?.trim();
  if (!family) {
    return Response.json({ error: "Informe o nome da fonte." } satisfies GoogleFontResponse, { status: 400 });
  }

  try {
    const result = await fetchGoogleFont(family);
    if (!result) {
      return Response.json(
        { error: `A fonte "${family}" não foi encontrada no Google Fonts.` } satisfies GoogleFontResponse,
        { status: 404 },
      );
    }
    return Response.json({ family, ...result } satisfies GoogleFontResponse);
  } catch {
    return Response.json(
      { error: "Não foi possível acessar o Google Fonts. Tente novamente." } satisfies GoogleFontResponse,
      { status: 502 },
    );
  }
}

async function fetchGoogleFont(family: string): Promise<{ weights: number[]; css: string } | null> {
  "use cache";
  cacheLife("days");

  const base = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}`;
  const get = (url: string) => fetch(url, { headers: { "User-Agent": BROWSER_UA } });

  const probes = await Promise.all(
    ALL_WEIGHTS.map(async (w) => ((await get(`${base}:wght@${w}&display=swap`)).ok ? w : null)),
  );
  let weights = probes.filter((w): w is number => w !== null);
  let url = `${base}:wght@${weights.join(";")}&display=swap`;
  if (weights.length === 0) {
    weights = [400];
    url = `${base}&display=swap`;
  }

  const res = await get(url);
  // 400 = família inexistente; outros erros não devem ficar em cache.
  if (res.status === 400) return null;
  if (!res.ok) throw new Error(`Google Fonts respondeu ${res.status}`);
  return { weights, css: keepLatinSubsets(await res.text()) };
}

function keepLatinSubsets(css: string): string {
  const blocks = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)];
  if (blocks.length === 0) return css;
  const kept = blocks.filter((b) => KEPT_SUBSETS.has(b[1])).map((b) => b[2]);
  return kept.length > 0 ? kept.join("\n") : css;
}
