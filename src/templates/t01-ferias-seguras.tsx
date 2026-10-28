import { BlackNovemberLogo } from "./shared/brand-svgs";
import { Movable, ts, tw } from "./shared/movable";
import { RichText } from "./shared/rich-text";
import type { TemplateDefinition, TemplateProps } from "./types";

const ASSETS = "/templates/01-ferias-seguras";

function FeriasSeguras({ texts, showBadge }: TemplateProps) {
  return (
    <div className="relative size-full overflow-hidden bg-primaria-1">
      <img
        alt=""
        src={`${ASSETS}/foto.png`}
        className="absolute left-0 top-[554px] h-[796px] w-[1080px] max-w-none object-cover"
      />
      <Movable id="titulo">
        <div
          className="absolute left-[55.24px] top-[295px] flex items-center justify-center bg-secundaria-2"
          style={{ padding: ts(48), borderRadius: ts(48) }}
        >
          <p
            className="whitespace-pre-line break-words font-title leading-[normal] text-branco"
            style={{ width: tw(376.726), fontSize: ts(40) }}
          >
            <RichText text={texts.titulo} />
          </p>
        </div>
      </Movable>
      <Movable id="texto">
        <p
          className="absolute left-[594.7px] top-[373px] whitespace-pre-line break-words font-body leading-[normal] text-branco"
          style={{ width: tw(415.494), fontSize: ts(28) }}
        >
          <RichText text={texts.texto} />
        </p>
      </Movable>
      <Movable id="cta">
        <div
          className="absolute left-1/2 top-[1201px] flex -translate-x-1/2 items-center justify-center rounded-[200px] bg-primaria-1"
          style={{ width: tw(704), padding: ts(24) }}
        >
          <p className="flex-1 break-words text-center font-body leading-[normal] text-branco" style={{ fontSize: ts(20) }}>
            {texts.cta}
          </p>
        </div>
      </Movable>
      {showBadge && (
        <BlackNovemberLogo left={669.99} top={92.06} black="var(--secundaria-3)" november="var(--branco)" />
      )}
    </div>
  );
}

export const feriasSeguras: TemplateDefinition = {
  id: "ferias-seguras",
  name: "1. Férias Seguras",
  figmaNodeId: "7:220",
  elements: [
    { id: "titulo", label: "Título", resizableWidth: true, fields: [{ key: "titulo", label: "Título", multiline: true }] },
    { id: "texto", label: "Texto", resizableWidth: true, fields: [{ key: "texto", label: "Texto", multiline: true }] },
    { id: "cta", label: "Botão (CTA)", resizableWidth: true, fields: [{ key: "cta", label: "Texto do botão" }] },
  ],
  defaults: {
    titulo: "Você aproveita as férias. A tecnologia ajuda a cuidar do que fica.",
    texto: "Monitore acessos e áreas estratégicas do seu imóvel, mesmo quando você estiver longe.",
    cta: "Consulte as condições especiais de Black November.",
  },
  logo: {
    x: 65.24,
    y: 98,
    width: 261,
    height: 58,
    anchor: "left",
    colors: { accent: "#3E2475", ink: "#FFFFFF" },
  },
  Component: FeriasSeguras,
};
