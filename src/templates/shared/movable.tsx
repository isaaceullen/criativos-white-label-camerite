"use client";

import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import { usePointerDrag, type Offset } from "@/lib/use-pointer-drag";

export type ElementLayout = Offset & {
  /** Multiplicador do tamanho do texto (e do padding/raio do box). */
  size: number;
  /** Multiplicador da largura do bloco de texto. */
  width: number;
};

export const DEFAULT_ELEMENT_LAYOUT: ElementLayout = { dx: 0, dy: 0, size: 1, width: 1 };

type LayoutContextValue = {
  layout: Record<string, ElementLayout>;
  interactive?: {
    scale: number;
    selectedId: string | null;
    onSelect: (id: string) => void;
    onChange: (id: string, layout: ElementLayout) => void;
  };
};

export const PostLayoutContext = createContext<LayoutContextValue>({ layout: {} });

/** Valor em px multiplicado pelo tamanho do texto do elemento (`--ts`). */
export const ts = (px: number) => `calc(${px}px * var(--ts, 1))`;
/** Valor em px multiplicado pela largura do elemento (`--tw`). */
export const tw = (px: number) => `calc(${px}px * var(--tw, 1))`;

const LIMIT_X = 1080;
const LIMIT_Y = 1350;

/**
 * Bloco editável do post (texto + box que estiver atrás dele).
 * O filho deve ser um único elemento com posicionamento absoluto, como no Figma;
 * este wrapper cobre o post inteiro e só aplica o deslocamento e as escalas.
 * Fica acima das decorações do template para não ser coberto ao ser arrastado.
 */
export function Movable({ id, children }: { id: string; children: ReactNode }) {
  const { layout, interactive } = useContext(PostLayoutContext);
  const current = layout[id] ?? DEFAULT_ELEMENT_LAYOUT;

  const style = {
    transform: `translate(${current.dx}px, ${current.dy}px)`,
    "--ts": current.size,
    "--tw": current.width,
  } as CSSProperties;

  if (!interactive) {
    return (
      <div className="pointer-events-none absolute inset-0 z-10" style={style}>
        {children}
      </div>
    );
  }

  return (
    <InteractiveMovable id={id} current={current} style={style} interactive={interactive}>
      {children}
    </InteractiveMovable>
  );
}

function InteractiveMovable({
  id,
  current,
  style,
  interactive,
  children,
}: {
  id: string;
  current: ElementLayout;
  style: CSSProperties;
  interactive: NonNullable<LayoutContextValue["interactive"]>;
  children: ReactNode;
}) {
  const { handlers } = usePointerDrag({
    scale: interactive.scale,
    offset: current,
    onStart: () => interactive.onSelect(id),
    onMove: ({ dx, dy }) =>
      interactive.onChange(id, {
        ...current,
        dx: Math.min(Math.max(dx, -LIMIT_X), LIMIT_X),
        dy: Math.min(Math.max(dy, -LIMIT_Y), LIMIT_Y),
      }),
  });

  return (
    <div
      className="movable pointer-events-none absolute inset-0 z-10 select-none"
      data-selected={interactive.selectedId === id ? "" : undefined}
      style={style}
      {...handlers}
    >
      {children}
    </div>
  );
}
