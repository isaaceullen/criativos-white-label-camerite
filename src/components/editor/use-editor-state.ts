"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_FONTS, type FontSettings, type FontSlot, type FontSlotSettings } from "@/lib/fonts";
import { DEFAULT_PALETTE, type ColorKey, type Palette } from "@/lib/palette";
import type { Offset } from "@/lib/use-pointer-drag";
import { TEMPLATES } from "@/templates";
import type { ElementLayout } from "@/templates/shared/movable";

export type LogoOffset = Offset;

export type DesignSettings = {
  palette: Palette;
  fonts: FontSettings;
  /** Logo do cliente (data URL). `null` usa a logo Camerite. */
  logoSrc: string | null;
  logoScale: number;
  showBadge: boolean;
};

type EditorState = {
  templateId: string;
  design: DesignSettings;
  texts: Record<string, Record<string, string>>;
  logoOffsets: Record<string, LogoOffset>;
  /** Posição/tamanho dos blocos de texto, por template e por elemento. */
  layouts: Record<string, Record<string, ElementLayout>>;
};

const STORAGE_KEY = "camerite-post-generator:v2";
const NO_OFFSET: LogoOffset = { dx: 0, dy: 0 };
const NO_LAYOUT: Record<string, ElementLayout> = {};

function initialState(): EditorState {
  return {
    templateId: TEMPLATES[0].id,
    design: {
      palette: DEFAULT_PALETTE,
      fonts: DEFAULT_FONTS,
      logoSrc: null,
      logoScale: 1,
      showBadge: true,
    },
    texts: {},
    logoOffsets: {},
    layouts: {},
  };
}

function loadState(): EditorState {
  const base = initialState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw) as Partial<EditorState>;
    return {
      templateId: TEMPLATES.some((t) => t.id === saved.templateId) ? saved.templateId! : base.templateId,
      design: {
        ...base.design,
        ...saved.design,
        palette: { ...base.design.palette, ...saved.design?.palette },
        fonts: { ...base.design.fonts, ...saved.design?.fonts },
      },
      texts: saved.texts ?? {},
      logoOffsets: saved.logoOffsets ?? {},
      layouts: saved.layouts ?? {},
    };
  } catch {
    return base;
  }
}

function omit<T>(record: Record<string, T>, key: string): Record<string, T> {
  const rest = { ...record };
  delete rest[key];
  return rest;
}

export function useEditorState() {
  const [state, setState] = useState<EditorState>(loadState);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Logos muito grandes podem estourar a cota do localStorage; o editor segue funcionando.
      }
    }, 300);
    return () => window.clearTimeout(id);
  }, [state]);

  const template = useMemo(
    () => TEMPLATES.find((t) => t.id === state.templateId) ?? TEMPLATES[0],
    [state.templateId],
  );

  const updateDesign = useCallback((patch: Partial<DesignSettings>) => {
    setState((s) => ({ ...s, design: { ...s.design, ...patch } }));
  }, []);

  const actions = useMemo(
    () => ({
      selectTemplate: (templateId: string) => setState((s) => ({ ...s, templateId })),
      setColor: (key: ColorKey, value: string) =>
        setState((s) => ({ ...s, design: { ...s.design, palette: { ...s.design.palette, [key]: value } } })),
      resetPalette: () => updateDesign({ palette: DEFAULT_PALETTE }),
      setFont: (slot: FontSlot, settings: FontSlotSettings) =>
        setState((s) => ({ ...s, design: { ...s.design, fonts: { ...s.design.fonts, [slot]: settings } } })),
      resetFonts: () => updateDesign({ fonts: DEFAULT_FONTS }),
      setLogoSrc: (logoSrc: string | null) => updateDesign({ logoSrc }),
      setLogoScale: (logoScale: number) => updateDesign({ logoScale }),
      setShowBadge: (showBadge: boolean) => updateDesign({ showBadge }),
      setLogoOffset: (templateId: string, offset: LogoOffset) =>
        setState((s) => ({ ...s, logoOffsets: { ...s.logoOffsets, [templateId]: offset } })),
      resetLogoOffset: (templateId: string) =>
        setState((s) => ({ ...s, logoOffsets: omit(s.logoOffsets, templateId) })),
      setText: (templateId: string, key: string, value: string) =>
        setState((s) => ({
          ...s,
          texts: { ...s.texts, [templateId]: { ...s.texts[templateId], [key]: value } },
        })),
      setElementLayout: (templateId: string, elementId: string, layout: ElementLayout) =>
        setState((s) => ({
          ...s,
          layouts: { ...s.layouts, [templateId]: { ...s.layouts[templateId], [elementId]: layout } },
        })),
      resetElement: (templateId: string, elementId: string, fieldKeys: string[]) =>
        setState((s) => {
          const texts = { ...s.texts[templateId] };
          for (const key of fieldKeys) delete texts[key];
          return {
            ...s,
            texts: { ...s.texts, [templateId]: texts },
            layouts: { ...s.layouts, [templateId]: omit(s.layouts[templateId] ?? {}, elementId) },
          };
        }),
      resetTemplate: (templateId: string) =>
        setState((s) => ({
          ...s,
          texts: omit(s.texts, templateId),
          layouts: omit(s.layouts, templateId),
          logoOffsets: omit(s.logoOffsets, templateId),
        })),
    }),
    [updateDesign],
  );

  const textsFor = useCallback(
    (templateId: string) => {
      const def = TEMPLATES.find((t) => t.id === templateId)!;
      return { ...def.defaults, ...state.texts[templateId] };
    },
    [state.texts],
  );

  const offsetFor = useCallback(
    (templateId: string) => state.logoOffsets[templateId] ?? NO_OFFSET,
    [state.logoOffsets],
  );

  const layoutFor = useCallback(
    (templateId: string) => state.layouts[templateId] ?? NO_LAYOUT,
    [state.layouts],
  );

  return { state, template, design: state.design, textsFor, offsetFor, layoutFor, actions };
}
