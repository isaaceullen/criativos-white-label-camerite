"use client";

import { useEffect, useRef } from "react";
import type { TemplateDefinition, TemplateElement } from "@/templates";
import { DEFAULT_ELEMENT_LAYOUT, type ElementLayout } from "@/templates/shared/movable";
import { TextButton } from "../ui";

export function TextControls({
  template,
  texts,
  layout,
  selectedId,
  onSelect,
  onTextChange,
  onLayoutChange,
  onReset,
}: {
  template: TemplateDefinition;
  texts: Record<string, string>;
  layout: Record<string, ElementLayout>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onTextChange: (key: string, value: string) => void;
  onLayoutChange: (id: string, layout: ElementLayout) => void;
  onReset: (element: TemplateElement) => void;
}) {
  return (
    <div className="space-y-3">
      {template.elements.map((element) => (
        <ElementCard
          key={`${template.id}-${element.id}`}
          templateId={template.id}
          element={element}
          texts={texts}
          layout={layout[element.id] ?? DEFAULT_ELEMENT_LAYOUT}
          isCustomized={element.id in layout || element.fields.some((f) => texts[f.key] !== template.defaults[f.key])}
          selected={selectedId === element.id}
          onSelect={() => onSelect(element.id)}
          onTextChange={onTextChange}
          onLayoutChange={(next) => onLayoutChange(element.id, next)}
          onReset={() => onReset(element)}
        />
      ))}
      <p className="text-[11px] leading-snug text-[#8a83a0]">
        Arraste os textos direto no preview para movê-los (setas do teclado = ajuste fino). Coloque um trecho entre
        asteriscos (<code className="font-mono">*assim*</code>) para destacá-lo com a cor do template.
      </p>
    </div>
  );
}

function ElementCard({
  templateId,
  element,
  texts,
  layout,
  isCustomized,
  selected,
  onSelect,
  onTextChange,
  onLayoutChange,
  onReset,
}: {
  templateId: string;
  element: TemplateElement;
  texts: Record<string, string>;
  layout: ElementLayout;
  isCustomized: boolean;
  selected: boolean;
  onSelect: () => void;
  onTextChange: (key: string, value: string) => void;
  onLayoutChange: (layout: ElementLayout) => void;
  onReset: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected && !ref.current?.contains(document.activeElement)) {
      ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selected]);

  return (
    <div
      ref={ref}
      onFocusCapture={onSelect}
      className={`rounded-xl border p-3 transition-colors ${
        selected ? "border-[#7B48EA] bg-[#faf8ff] shadow-[0_0_0_3px_rgba(123,72,234,0.12)]" : "border-black/[0.08]"
      }`}
    >
      <div className="mb-2.5 flex items-center justify-between">
        <button type="button" onClick={onSelect} className="text-sm font-semibold text-[#1c1530]">
          {element.label}
        </button>
        <TextButton onClick={onReset} disabled={!isCustomized}>
          Resetar
        </TextButton>
      </div>

      <div className="space-y-2.5">
        {element.fields.map((field) => {
          const id = `${templateId}-${field.key}`;
          const className =
            "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1c1530] outline-none transition-colors focus:border-[#7B48EA]";
          return (
            <div key={field.key}>
              {element.fields.length > 1 && (
                <label htmlFor={id} className="mb-1 block text-xs font-medium text-[#6b6480]">
                  {field.label}
                </label>
              )}
              {field.multiline ? (
                <textarea
                  id={id}
                  aria-label={field.label}
                  rows={3}
                  value={texts[field.key] ?? ""}
                  onChange={(e) => onTextChange(field.key, e.target.value)}
                  className={`${className} resize-y`}
                />
              ) : (
                <input
                  id={id}
                  aria-label={field.label}
                  value={texts[field.key] ?? ""}
                  onChange={(e) => onTextChange(field.key, e.target.value)}
                  className={className}
                />
              )}
            </div>
          );
        })}

        <Slider
          label="Tamanho do texto"
          value={layout.size}
          min={0.5}
          max={1.6}
          onChange={(size) => onLayoutChange({ ...layout, size })}
        />
        {element.resizableWidth && (
          <Slider
            label="Largura"
            value={layout.width}
            min={0.5}
            max={1.6}
            onChange={(width) => onLayoutChange({ ...layout, width })}
          />
        )}
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-xs text-[#6b6480]">
        <span>{label}</span>
        <span className="font-mono">{Math.round(value * 100)}%</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onDoubleClick={() => onChange(1)}
        className="w-full accent-[#7B48EA]"
      />
    </label>
  );
}
