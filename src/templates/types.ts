import type { ComponentType } from "react";
import type { CameriteColors } from "./shared/brand-svgs";

export const POST_WIDTH = 1080;
export const POST_HEIGHT = 1350;

export type TemplateField = {
  key: string;
  label: string;
  multiline?: boolean;
};

/**
 * Bloco móvel do template (ver `<Movable id>`). Agrupa os campos de texto que
 * ficam juntos no mesmo box, que se move e redimensiona como uma unidade.
 */
export type TemplateElement = {
  id: string;
  label: string;
  fields: TemplateField[];
  /** O bloco tem largura fixa (texto quebra em linhas) e aceita ajuste de largura. */
  resizableWidth: boolean;
};

export type TemplateProps = {
  texts: Record<string, string>;
  showBadge: boolean;
};

/**
 * Posição padrão da logo (Camerite ou do cliente) em coordenadas do post.
 * `anchor` define para qual lado a logo cresce quando ela é trocada:
 * `x` é a borda esquerda (left), o centro (center) ou a borda direita (right).
 */
export type LogoSlot = {
  x: number;
  y: number;
  width: number;
  height: number;
  anchor: "left" | "center" | "right";
  colors: CameriteColors;
};

export type TemplateDefinition = {
  id: string;
  name: string;
  figmaNodeId: string;
  elements: TemplateElement[];
  defaults: Record<string, string>;
  logo: LogoSlot;
  Component: ComponentType<TemplateProps>;
};
