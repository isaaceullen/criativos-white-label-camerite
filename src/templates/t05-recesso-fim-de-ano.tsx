import { BlackNovemberLogo } from "./shared/brand-svgs";
import { Movable, ts, tw } from "./shared/movable";
import { RichText } from "./shared/rich-text";
import type { TemplateDefinition, TemplateProps } from "./types";

const ASSETS = "/templates/05-recesso-fim-de-ano";

function RecessoFimDeAno({ texts, showBadge }: TemplateProps) {
  return (
    <div className="relative size-full overflow-hidden bg-secundaria-3">
      <Movable id="titulo">
        <p
          className="absolute left-[540px] top-[178.41px] -translate-x-1/2 whitespace-pre-line break-words text-center font-title uppercase leading-[normal] text-branco"
          style={{ width: tw(914.871), fontSize: ts(48) }}
        >
          <RichText text={texts.titulo} />
        </p>
      </Movable>

      <div className="absolute left-[65px] top-[291px] h-[603px] w-[451px] overflow-hidden rounded-[48px]">
        <img
          alt=""
          src={`${ASSETS}/foto.png`}
          className="absolute left-0 top-[-9.23%] h-[118.45%] w-[212.05%] max-w-none"
        />
      </div>
      <div className="absolute left-[564px] top-[291px] h-[603px] w-[451px] overflow-hidden rounded-[48px]">
        <img
          alt=""
          src={`${ASSETS}/foto.png`}
          className="absolute left-[-110.74%] top-[-8.86%] h-[117.72%] w-[210.74%] max-w-none"
        />
      </div>

      {showBadge && (
        <BlackNovemberLogo left={365.39} top={59} black="var(--primaria-1)" november="var(--branco)" />
      )}

      <Movable id="subtitulo">
        <p
          className="absolute left-[65px] top-[939.59px] whitespace-pre-line break-words font-title uppercase leading-[normal] text-branco"
          style={{ width: tw(547.355), fontSize: ts(48) }}
        >
          <RichText text={texts.subtitulo} />
        </p>
      </Movable>
      <Movable id="texto">
        <p
          className="absolute left-[680.09px] top-[982.09px] whitespace-pre-line break-words font-body leading-[normal] text-branco"
          style={{ width: tw(327.38), fontSize: ts(24) }}
        >
          <RichText text={texts.texto} />
        </p>
      </Movable>
      <Movable id="cta">
        <div
          className="absolute left-[65px] top-[1201px] flex items-center justify-center rounded-[200px] bg-primaria-1"
          style={{ padding: ts(24) }}
        >
          <p className="whitespace-nowrap font-body leading-[normal] text-branco" style={{ fontSize: ts(20) }}>
            {texts.cta}
          </p>
        </div>
      </Movable>
    </div>
  );
}

export const recessoFimDeAno: TemplateDefinition = {
  id: "recesso-fim-de-ano",
  name: "5. Recesso de Fim de Ano",
  figmaNodeId: "7:1045",
  elements: [
    { id: "titulo", label: "Título (topo)", resizableWidth: true, fields: [{ key: "titulo", label: "Título (topo)" }] },
    {
      id: "subtitulo",
      label: "Título (base)",
      resizableWidth: true,
      fields: [{ key: "subtitulo", label: "Título (base) — use *texto* para destacar", multiline: true }],
    },
    { id: "texto", label: "Texto", resizableWidth: true, fields: [{ key: "texto", label: "Texto", multiline: true }] },
    { id: "cta", label: "Botão (CTA)", resizableWidth: false, fields: [{ key: "cta", label: "Texto do botão" }] },
  ],
  defaults: {
    titulo: "O expediente pode parar.",
    subtitulo: "O cuidado com sua operação, *não.*",
    texto: "Monitore perímetros, áreas restritas e acessos durante o recesso de fim de ano.",
    cta: "Prepare sua empresa para o período de pausa",
  },
  logo: {
    x: 1015,
    y: 1207.68,
    width: 263.496,
    height: 58.649,
    anchor: "right",
    colors: { accent: "#A785F1", ink: "#FFFFFF" },
  },
  Component: RecessoFimDeAno,
};
