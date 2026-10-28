"use client";

import type { CSSProperties, KeyboardEvent, Ref } from "react";
import { fontChoiceToCss } from "@/lib/fonts";
import { paletteToCssVars } from "@/lib/palette";
import { usePointerDrag } from "@/lib/use-pointer-drag";
import { CameriteLogo } from "@/templates/shared/brand-svgs";
import { PostLayoutContext, type ElementLayout } from "@/templates/shared/movable";
import { POST_HEIGHT, POST_WIDTH, type LogoSlot, type TemplateDefinition } from "@/templates";
import type { DesignSettings, LogoOffset } from "./use-editor-state";

type Interactive = {
  /** Escala atual do preview, para converter o movimento do mouse em px do post. */
  scale: number;
  onLogoMove: (offset: LogoOffset) => void;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onElementChange: (id: string, layout: ElementLayout) => void;
};

type PostCanvasProps = {
  template: TemplateDefinition;
  texts: Record<string, string>;
  design: DesignSettings;
  logoOffset: LogoOffset;
  layout: Record<string, ElementLayout>;
  interactive?: Interactive;
  ref?: Ref<HTMLDivElement>;
};

/** O post em tamanho real (1080 × 1350). É este nó que vira PNG. */
export function PostCanvas({ template, texts, design, logoOffset, layout, interactive, ref }: PostCanvasProps) {
  const { Component } = template;
  const style = {
    ...paletteToCssVars(design.palette),
    "--post-font-title": fontChoiceToCss(design.fonts.title.font),
    "--post-font-body": fontChoiceToCss(design.fonts.body.font),
    "--post-weight-title": design.fonts.title.weight,
    "--post-weight-body": design.fonts.body.weight,
    ...(interactive ? { "--ui-outline": `${Math.max(2, 2 / interactive.scale)}px` } : {}),
    width: POST_WIDTH,
    height: POST_HEIGHT,
  } as CSSProperties;

  const layoutContext = {
    layout,
    interactive: interactive && {
      scale: interactive.scale,
      selectedId: interactive.selectedElementId,
      onSelect: interactive.onSelectElement,
      onChange: interactive.onElementChange,
    },
  };

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={style}
      onPointerDown={interactive ? () => interactive.onSelectElement(null) : undefined}
    >
      <PostLayoutContext.Provider value={layoutContext}>
        <Component texts={texts} showBadge={design.showBadge} />
      </PostLayoutContext.Provider>
      <LogoLayer
        slot={template.logo}
        src={design.logoSrc}
        scale={design.logoScale}
        offset={logoOffset}
        interactive={interactive}
      />
    </div>
  );
}

const ANCHOR_SHIFT: Record<LogoSlot["anchor"], string> = {
  left: "0%",
  center: "-50%",
  right: "-100%",
};

const NUDGE_KEYS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

function clampOffset(slot: LogoSlot, offset: LogoOffset): LogoOffset {
  return {
    dx: Math.min(Math.max(offset.dx, -slot.x), POST_WIDTH - slot.x),
    dy: Math.min(Math.max(offset.dy, -slot.y), POST_HEIGHT - slot.y),
  };
}

function LogoLayer({
  slot,
  src,
  scale,
  offset,
  interactive,
}: {
  slot: LogoSlot;
  src: string | null;
  scale: number;
  offset: LogoOffset;
  interactive?: Interactive;
}) {
  const { active, handlers } = usePointerDrag({
    scale: interactive?.scale ?? 1,
    offset,
    onStart: () => interactive?.onSelectElement(null),
    onMove: (next) => interactive?.onLogoMove(clampOffset(slot, next)),
  });
  const height = slot.height * scale;

  const content = src ? (
    <img alt="Logo" src={src} draggable={false} className="block max-w-none" style={{ height, width: "auto" }} />
  ) : (
    <CameriteLogo width={slot.width * scale} height={height} colors={slot.colors} />
  );

  const style: CSSProperties = {
    left: slot.x + offset.dx,
    top: slot.y + offset.dy,
    transform: `translateX(${ANCHOR_SHIFT[slot.anchor]})`,
  };

  if (!interactive) {
    return (
      <div className="absolute z-20" style={style}>
        {content}
      </div>
    );
  }

  const outline = Math.max(2, 2 / interactive.scale);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const dir = NUDGE_KEYS[e.key];
    if (!dir || !interactive) return;
    e.preventDefault();
    const step = e.shiftKey ? 10 : 1;
    interactive.onLogoMove(clampOffset(slot, { dx: offset.dx + dir[0] * step, dy: offset.dy + dir[1] * step }));
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Logo — arraste para mover"
      className="group absolute z-20 cursor-grab touch-none select-none active:cursor-grabbing"
      style={style}
      onKeyDown={onKeyDown}
      {...handlers}
    >
      {content}
      <span
        aria-hidden
        data-ui-only
        className={`pointer-events-none absolute rounded-[6px] border-dashed border-[#7B48EA] transition-opacity ${
          active ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
        }`}
        style={{ inset: -outline * 4, borderWidth: outline }}
      />
    </div>
  );
}
