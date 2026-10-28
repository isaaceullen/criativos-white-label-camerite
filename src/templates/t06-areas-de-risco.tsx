import { BlackNovemberLogo } from "./shared/brand-svgs";
import { Movable, ts, tw } from "./shared/movable";
import { RichText } from "./shared/rich-text";
import type { TemplateDefinition, TemplateProps } from "./types";

const ASSETS = "/templates/06-areas-de-risco";

function AreasDeRisco({ texts, showBadge }: TemplateProps) {
  return (
    <div className="relative size-full overflow-hidden bg-secundaria-3">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <img alt="" src={`${ASSETS}/foto.png`} className="absolute size-full max-w-none object-cover" />
        <div className="absolute inset-0 bg-secundaria-3 mix-blend-color" />
      </div>
      {showBadge && (
        <BlackNovemberLogo left={80.12} top={96.44} black="var(--primaria-3)" november="var(--branco)" />
      )}

      <Movable id="box">
        <div
          className="absolute left-[80px] top-[875px] flex flex-col items-start bg-branco"
          style={{ width: tw(920), gap: ts(32), padding: ts(56), borderRadius: ts(56) }}
        >
          <p
            className="w-full whitespace-pre-line break-words font-title leading-[normal] text-primaria-1"
            style={{ fontSize: ts(40) }}
          >
            <RichText text={texts.titulo} highlightClassName="text-secundaria-3" />
          </p>
          <p
            className="max-w-full whitespace-pre-line break-words font-body leading-[normal] text-secundaria-3"
            style={{ width: tw(729.447), fontSize: ts(24) }}
          >
            <RichText text={texts.texto} />
          </p>
          <div className="flex items-center justify-center rounded-[200px] bg-primaria-1" style={{ padding: ts(24) }}>
            <p className="whitespace-nowrap font-body leading-[normal] text-branco" style={{ fontSize: ts(20) }}>
              {texts.cta}
            </p>
          </div>
        </div>
      </Movable>

      <div className="absolute left-[370.54px] top-[381px] h-[415.366px] w-[306.035px] border-4 border-solid border-primaria-1" />
      <div className="absolute left-[370.54px] top-[339px] flex items-center justify-center bg-primaria-1 p-[10px]">
        <p className="whitespace-nowrap font-ui text-[18px] font-normal leading-[normal] text-branco">Intrusão</p>
      </div>
    </div>
  );
}

export const areasDeRisco: TemplateDefinition = {
  id: "areas-de-risco",
  name: "6. Segurança em Áreas de Risco",
  figmaNodeId: "7:702",
  elements: [
    {
      id: "box",
      label: "Box (título + texto + botão)",
      resizableWidth: true,
      fields: [
        { key: "titulo", label: "Título", multiline: true },
        { key: "texto", label: "Texto", multiline: true },
        { key: "cta", label: "Texto do botão" },
      ],
    },
  ],
  defaults: {
    titulo: "Identifique situações críticas que merecem atenção.",
    texto: "Monitore áreas restritas e tenha mais visibilidade sobre possíveis situações de risco.",
    cta: "Conheça nossas soluções de monitoramento inteligente",
  },
  logo: {
    x: 999.88,
    y: 104.35,
    width: 261,
    height: 58,
    anchor: "right",
    colors: { accent: "#A785F1", ink: "#FFFFFF" },
  },
  Component: AreasDeRisco,
};
