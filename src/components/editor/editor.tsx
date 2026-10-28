"use client";

import { useEffect, useRef, useState } from "react";
import { loadGoogleFont } from "@/lib/fonts";
import { downloadPostPng } from "@/lib/export";
import { CameriteLogo } from "@/templates/shared/brand-svgs";
import { DEFAULT_ELEMENT_LAYOUT } from "@/templates/shared/movable";
import { ColorControls } from "./controls/color-controls";
import { FontControls } from "./controls/font-controls";
import { LogoControls } from "./controls/logo-controls";
import { TextControls } from "./controls/text-controls";
import { PostCanvas } from "./post-canvas";
import { PreviewStage } from "./preview-stage";
import { TemplateGallery } from "./template-gallery";
import { Section, TextButton } from "./ui";
import { useEditorState } from "./use-editor-state";

const NUDGE_KEYS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

export function Editor() {
  const { template, design, textsFor, offsetFor, layoutFor, state, actions } = useEditorState();
  const postRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [selection, setSelection] = useState<{ templateId: string; elementId: string } | null>(null);

  const texts = textsFor(template.id);
  const offset = offsetFor(template.id);
  const layout = layoutFor(template.id);
  const selectedElementId = selection?.templateId === template.id ? selection.elementId : null;

  function selectElement(elementId: string | null) {
    setSelection(elementId ? { templateId: template.id, elementId } : null);
  }

  // Fontes do Google salvas em uma sessão anterior precisam ser recarregadas.
  useEffect(() => {
    for (const { font } of Object.values(design.fonts)) {
      if (font.kind === "google") loadGoogleFont(font.family).catch(() => {});
    }
  }, [design.fonts]);

  useEffect(() => {
    if (!selectedElementId) return;
    const current = layout[selectedElementId] ?? DEFAULT_ELEMENT_LAYOUT;

    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof Element && e.target.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "Escape") {
        setSelection(null);
        return;
      }
      const dir = NUDGE_KEYS[e.key];
      if (!dir) return;
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      actions.setElementLayout(template.id, selectedElementId!, {
        ...current,
        dx: current.dx + dir[0] * step,
        dy: current.dy + dir[1] * step,
      });
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedElementId, layout, template.id, actions]);

  async function handleDownload() {
    if (!postRef.current) return;
    setExporting(true);
    setExportError(null);
    try {
      await Promise.all(
        Object.values(design.fonts)
          .map(({ font }) => font)
          .filter((font) => font.kind === "google")
          .map((font) => loadGoogleFont(font.family)),
      );
      // Espera o preview re-renderizar sem os controles de seleção/arraste.
      await nextFrame();
      await nextFrame();
      await downloadPostPng(postRef.current, `post-${template.id}-1080x1350.png`);
    } catch (err) {
      console.error(err);
      setExportError("Não foi possível gerar o PNG. Tente novamente.");
    } finally {
      setExporting(false);
    }
  }

  const isTemplateCustomized =
    template.id in state.texts || template.id in state.layouts || template.id in state.logoOffsets;

  return (
    <div className="flex h-full min-h-screen flex-col lg:h-screen">
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-black/[0.06] bg-white px-5">
        <div className="flex items-center gap-3">
          <CameriteLogo width={118} height={26} colors={{ accent: "#7B48EA", ink: "#1c1530" }} />
          <span className="hidden h-5 w-px bg-black/10 sm:block" />
          <p className="hidden text-sm text-[#6b6480] sm:block">Gerador de posts · White Label</p>
        </div>
        <div className="flex items-center gap-3">
          {exportError && <p className="hidden text-xs text-[#c03a3a] md:block">{exportError}</p>}
          <button
            type="button"
            onClick={handleDownload}
            disabled={exporting}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#7B48EA] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(123,72,234,0.8)] transition-colors hover:bg-[#6a37dc] disabled:cursor-wait disabled:opacity-70"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M5 19h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {exporting ? "Gerando PNG…" : "Baixar PNG"}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="shrink-0 border-b border-black/[0.06] bg-white lg:w-[264px] lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <Section title="Templates">
            <TemplateGallery
              selectedId={template.id}
              design={design}
              textsFor={textsFor}
              offsetFor={offsetFor}
              layoutFor={layoutFor}
              onSelect={actions.selectTemplate}
            />
          </Section>
        </aside>

        <main className="relative flex min-h-[70vh] min-w-0 flex-1 flex-col bg-[#eeebf4] [background-image:radial-gradient(rgba(41,24,78,0.09)_1px,transparent_1px)] [background-size:18px_18px] lg:min-h-0">
          <div className="flex items-center justify-between px-6 pt-4 text-xs text-[#6b6480]">
            <p className="font-medium text-[#1c1530]">{template.name}</p>
            <p>1080 × 1350 px</p>
          </div>
          <div className="relative min-h-0 flex-1">
            <PreviewStage>
              {(scale) => (
                <PostCanvas
                  ref={postRef}
                  template={template}
                  texts={texts}
                  design={design}
                  logoOffset={offset}
                  layout={layout}
                  interactive={
                    exporting
                      ? undefined
                      : {
                          scale,
                          onLogoMove: (next) => actions.setLogoOffset(template.id, next),
                          selectedElementId,
                          onSelectElement: selectElement,
                          onElementChange: (id, next) => actions.setElementLayout(template.id, id, next),
                        }
                  }
                />
              )}
            </PreviewStage>
          </div>
        </main>

        <aside className="shrink-0 bg-white lg:w-[340px] lg:overflow-y-auto lg:border-l lg:border-black/[0.06]">
          <Section title="Logo">
            <LogoControls
              logoSrc={design.logoSrc}
              logoScale={design.logoScale}
              showBadge={design.showBadge}
              hasOffset={template.id in state.logoOffsets}
              onLogoChange={actions.setLogoSrc}
              onScaleChange={actions.setLogoScale}
              onShowBadgeChange={actions.setShowBadge}
              onResetPosition={() => actions.resetLogoOffset(template.id)}
            />
          </Section>
          <Section title="Cores" action={<TextButton onClick={actions.resetPalette}>Restaurar padrão</TextButton>}>
            <ColorControls palette={design.palette} onChange={actions.setColor} />
          </Section>
          <Section title="Fontes" action={<TextButton onClick={actions.resetFonts}>Restaurar padrão</TextButton>}>
            <FontControls key={JSON.stringify(design.fonts)} fonts={design.fonts} onChange={actions.setFont} />
          </Section>
          <Section
            title="Textos e posição"
            action={
              <TextButton onClick={() => actions.resetTemplate(template.id)} disabled={!isTemplateCustomized}>
                Restaurar template
              </TextButton>
            }
          >
            <TextControls
              template={template}
              texts={texts}
              layout={layout}
              selectedId={selectedElementId}
              onSelect={selectElement}
              onTextChange={(key, value) => actions.setText(template.id, key, value)}
              onLayoutChange={(id, next) => actions.setElementLayout(template.id, id, next)}
              onReset={(element) =>
                actions.resetElement(
                  template.id,
                  element.id,
                  element.fields.map((f) => f.key),
                )
              }
            />
          </Section>
        </aside>
      </div>
    </div>
  );
}
