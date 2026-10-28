"use client";

import { POST_HEIGHT, POST_WIDTH, TEMPLATES } from "@/templates";
import type { ElementLayout } from "@/templates/shared/movable";
import { PostCanvas } from "./post-canvas";
import type { DesignSettings, LogoOffset } from "./use-editor-state";

const THUMB_WIDTH = 104;
const THUMB_SCALE = THUMB_WIDTH / POST_WIDTH;

export function TemplateGallery({
  selectedId,
  design,
  textsFor,
  offsetFor,
  layoutFor,
  onSelect,
}: {
  selectedId: string;
  design: DesignSettings;
  textsFor: (id: string) => Record<string, string>;
  offsetFor: (id: string) => LogoOffset;
  layoutFor: (id: string) => Record<string, ElementLayout>;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {TEMPLATES.map((template) => {
        const selected = template.id === selectedId;
        return (
          <li key={template.id}>
            <button
              type="button"
              onClick={() => onSelect(template.id)}
              aria-pressed={selected}
              title={template.name}
              className="group w-full text-left"
            >
              <div
                className={`relative overflow-hidden rounded-lg ring-offset-2 transition-all ${
                  selected ? "ring-2 ring-[#7B48EA]" : "ring-1 ring-black/10 group-hover:ring-[#7B48EA]/50"
                }`}
                style={{ width: THUMB_WIDTH, height: POST_HEIGHT * THUMB_SCALE }}
              >
                <div
                  className="pointer-events-none absolute left-0 top-0 origin-top-left"
                  style={{ transform: `scale(${THUMB_SCALE})` }}
                  aria-hidden
                >
                  <PostCanvas
                    template={template}
                    texts={textsFor(template.id)}
                    design={design}
                    logoOffset={offsetFor(template.id)}
                    layout={layoutFor(template.id)}
                  />
                </div>
              </div>
              <p
                className={`mt-1.5 line-clamp-2 text-[11px] leading-tight ${
                  selected ? "font-semibold text-[#1c1530]" : "text-[#6b6480]"
                }`}
              >
                {template.name}
              </p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
