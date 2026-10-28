import type { CSSProperties } from "react";
import { BLACK_NOVEMBER, CAMERITE_SYMBOL, CAMERITE_WORDMARK, ICONS } from "./svg-data";

const BN_WIDTH = 349.215;
const BN_HEIGHT = 73.818;

type BlackNovemberProps = {
  left: number;
  top: number;
  /** Cor da palavra "BLACK". */
  black: string;
  /** Cor de "NOVEMBER" e da seta. */
  november: string;
};

export function BlackNovemberLogo({ left, top, black, november }: BlackNovemberProps) {
  return (
    <svg
      className="absolute block"
      style={{ left, top }}
      width={BN_WIDTH}
      height={BN_HEIGHT}
      viewBox={BLACK_NOVEMBER.viewBox}
      preserveAspectRatio="none"
      fill="none"
      aria-label="Black November"
    >
      {BLACK_NOVEMBER.black.map((d) => (
        <path key={d} d={d} style={{ fill: black }} />
      ))}
      {BLACK_NOVEMBER.november.map((d) => (
        <path key={d} d={d} style={{ fill: november }} />
      ))}
    </svg>
  );
}

export type CameriteColors = {
  /** Ponto e cantos do símbolo. */
  accent: string;
  /** "C" do símbolo e o nome "Camerite". */
  ink: string;
};

// Proporções do componente "Camerite Horizontal" no Figma (200 × 44.69).
const LOGO_W = 200;
const LOGO_H = 44.69;
const WORDMARK_X = LOGO_W * 0.3128;
const WORDMARK_Y = LOGO_H * 0.3001;

export function CameriteLogo({
  width,
  height,
  colors,
  style,
}: {
  width: number;
  height: number;
  colors: CameriteColors;
  style?: CSSProperties;
}) {
  return (
    <svg
      className="block"
      style={style}
      width={width}
      height={height}
      viewBox={`0 0 ${LOGO_W} ${LOGO_H}`}
      preserveAspectRatio="none"
      fill="none"
      aria-label="Camerite"
    >
      {CAMERITE_SYMBOL.accent.map((d) => (
        <path key={d} d={d} style={{ fill: colors.accent }} />
      ))}
      {CAMERITE_SYMBOL.ink.map((d) => (
        <path key={d} d={d} style={{ fill: colors.ink }} />
      ))}
      <g transform={`translate(${WORDMARK_X} ${WORDMARK_Y})`}>
        {CAMERITE_WORDMARK.paths.map((d) => (
          <path key={d} d={d} style={{ fill: colors.ink }} />
        ))}
      </g>
    </svg>
  );
}

export type IconName = keyof typeof ICONS;

/** Ícones de produto (traço). A cor vem de `color` / `currentColor`. */
export function Icon({ name, className, style }: { name: IconName; className?: string; style?: CSSProperties }) {
  const icon = ICONS[name];
  return (
    <svg
      className={className}
      style={style}
      width={icon.width}
      height={icon.height}
      viewBox={icon.viewBox}
      fill="none"
      overflow="visible"
      aria-hidden
    >
      {icon.paths.map((p) => (
        <path
          key={p.d}
          d={p.d}
          stroke="currentColor"
          strokeWidth={p.strokeWidth}
          strokeLinecap={"strokeLinecap" in p ? p.strokeLinecap : undefined}
          strokeLinejoin={"strokeLinejoin" in p ? p.strokeLinejoin : undefined}
        />
      ))}
    </svg>
  );
}
