import { BlackNovemberLogo } from "./shared/brand-svgs";
import { Movable, ts, tw } from "./shared/movable";
import { RichText } from "./shared/rich-text";
import type { TemplateDefinition, TemplateProps } from "./types";

const ASSETS = "/templates/03-alta-temporada";

function AltaTemporada({ texts, showBadge }: TemplateProps) {
  return (
    <div className="relative size-full overflow-hidden bg-secundaria-3">
      <img
        alt=""
        src={`${ASSETS}/foto.png`}
        className="absolute left-0 top-0 h-[718px] w-[1080px] max-w-none object-cover"
      />
      <Movable id="titulo">
        <p
          className="absolute left-[66.2px] top-[935px] whitespace-pre-line break-words font-title leading-[normal] text-branco"
          style={{ width: tw(902.641), fontSize: ts(48) }}
        >
          <RichText text={texts.titulo} />
        </p>
      </Movable>
      <Movable id="card">
        <div
          className="absolute left-[540px] top-[642px] flex flex-col items-start justify-center bg-primaria-1"
          style={{ gap: ts(24), padding: `${ts(40)} ${ts(32)}`, borderRadius: ts(32) }}
        >
          <p
            className="whitespace-pre-line break-words font-body leading-[normal] text-branco"
            style={{ width: tw(413.669), fontSize: ts(28) }}
          >
            <RichText text={texts.texto} highlightClassName="text-secundaria-3" />
          </p>
          <div
            className="flex items-center justify-center rounded-[200px] bg-branco"
            style={{ padding: `${ts(12)} ${ts(24)}` }}
          >
            <p
              className="whitespace-nowrap text-center font-body leading-[normal] text-secundaria-3"
              style={{ fontSize: ts(20) }}
            >
              {texts.cta}
            </p>
          </div>
        </div>
      </Movable>
      {showBadge && (
        <BlackNovemberLogo left={668.45} top={1203} black="var(--primaria-1)" november="var(--branco)" />
      )}
    </div>
  );
}

export const altaTemporada: TemplateDefinition = {
  id: "alta-temporada",
  name: "3. Operação Pronta para a Alta Temporada",
  figmaNodeId: "2:271",
  elements: [
    { id: "titulo", label: "Título", resizableWidth: true, fields: [{ key: "titulo", label: "Título", multiline: true }] },
    {
      id: "card",
      label: "Card (texto + botão)",
      resizableWidth: true,
      fields: [
        { key: "texto", label: "Texto do card", multiline: true },
        { key: "cta", label: "Texto do botão" },
      ],
    },
  ],
  defaults: {
    titulo: "O fim de ano\nacelera a operação. Seu monitoramento precisa acompanhar.",
    texto: "Mais visibilidade para veículos, acessos e áreas operacionais durante a alta temporada.",
    cta: "Prepare sua operação.",
  },
  logo: {
    x: 66.2,
    y: 795.35,
    width: 263.496,
    height: 58.649,
    anchor: "left",
    colors: { accent: "#A785F1", ink: "#FFFFFF" },
  },
  Component: AltaTemporada,
};
