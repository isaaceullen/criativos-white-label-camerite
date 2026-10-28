"use client";

import { useRef, useState, type DragEvent, type PointerEvent } from "react";

export type Offset = { dx: number; dy: number };

/**
 * Arraste em coordenadas do post: o deslocamento do mouse é dividido pela
 * escala do preview, então o offset resultante já está em px de 1080 × 1350.
 */
export function usePointerDrag({
  scale,
  offset,
  onMove,
  onStart,
}: {
  scale: number;
  offset: Offset;
  onMove: (offset: Offset) => void;
  onStart?: () => void;
}) {
  const drag = useRef<{ x: number; y: number; start: Offset } | null>(null);
  const [active, setActive] = useState(false);

  function end() {
    drag.current = null;
    setActive(false);
  }

  return {
    active,
    handlers: {
      onPointerDown(e: PointerEvent<HTMLElement>) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { x: e.clientX, y: e.clientY, start: offset };
        setActive(true);
        onStart?.();
      },
      onPointerMove(e: PointerEvent<HTMLElement>) {
        if (!drag.current) return;
        const { x, y, start } = drag.current;
        onMove({
          dx: Math.round(start.dx + (e.clientX - x) / scale),
          dy: Math.round(start.dy + (e.clientY - y) / scale),
        });
      },
      onPointerUp: end,
      onPointerCancel: end,
      onDragStart(e: DragEvent<HTMLElement>) {
        e.preventDefault();
      },
    },
  };
}
