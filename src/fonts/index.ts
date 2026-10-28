import localFont from "next/font/local";
import { Inter } from "next/font/google";

// Fontes oficiais Camerite. Para trocar os arquivos, substitua-os nas pastas
// `specify/` e `univers/` (aceita .woff2, .woff, .ttf ou .otf) e ajuste os paths abaixo.

export const specify = localFont({
  src: [
    { path: "./specify/Specify-ExpandedThin.ttf", weight: "100", style: "normal" },
    { path: "./specify/Specify-ExpandedLight.ttf", weight: "300", style: "normal" },
    { path: "./specify/Specify-ExpandedMedium.ttf", weight: "500", style: "normal" },
    { path: "./specify/Specify-ExpandedBold.ttf", weight: "700", style: "normal" },
    { path: "./specify/Specify-ExpandedBlack.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-specify",
  display: "swap",
  fallback: ["Arial Black", "sans-serif"],
});

export const univers = localFont({
  src: [
    { path: "./univers/UniversLTStd-Ex.otf", weight: "400", style: "normal" },
    { path: "./univers/UniversLTStd-BoldEx.otf", weight: "700", style: "normal" },
    { path: "./univers/UniversLTStd-BlackEx.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-univers",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

// Usada na interface do editor e nos mockups de produto dentro dos posts.
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
