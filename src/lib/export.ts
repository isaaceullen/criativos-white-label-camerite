import { toPng } from "html-to-image";
import { POST_HEIGHT, POST_WIDTH } from "@/templates/types";

/** Gera e baixa o PNG do post exatamente em 1080 × 1350. */
export async function downloadPostPng(node: HTMLElement, filename: string) {
  await document.fonts.ready;

  const dataUrl = await toPng(node, {
    width: POST_WIDTH,
    height: POST_HEIGHT,
    pixelRatio: 1,
    // Elementos só de interface (ex.: contorno de arraste da logo) ficam fora do PNG.
    filter: (el) => !(el instanceof HTMLElement && el.dataset.uiOnly !== undefined),
  });

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
