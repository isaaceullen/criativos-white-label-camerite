"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { POST_HEIGHT, POST_WIDTH } from "@/templates";

const PADDING = 32;

/** Encaixa o post 1080 × 1350 no espaço disponível e informa a escala usada. */
export function PreviewStage({ children }: { children: (scale: number) => ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const next = Math.min((width - PADDING * 2) / POST_WIDTH, (height - PADDING * 2) / POST_HEIGHT);
      setScale(Math.max(0.15, Math.min(next, 1)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        className="relative shrink-0 overflow-hidden rounded-md shadow-[0_24px_60px_-20px_rgba(41,24,78,0.45)]"
        style={{ width: POST_WIDTH * scale, height: POST_HEIGHT * scale }}
      >
        <div className="absolute left-0 top-0 origin-top-left" style={{ transform: `scale(${scale})` }}>
          {children(scale)}
        </div>
      </div>
    </div>
  );
}
