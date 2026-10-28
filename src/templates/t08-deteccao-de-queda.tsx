import { BlackNovemberLogo, Icon } from "./shared/brand-svgs";
import { Movable, ts, tw } from "./shared/movable";
import { RichText } from "./shared/rich-text";
import type { TemplateDefinition, TemplateProps } from "./types";

const ASSETS = "/templates/08-deteccao-de-queda";

function DeteccaoDeQueda({ texts, showBadge }: TemplateProps) {
  return (
    <div className="relative size-full overflow-hidden bg-branco">
      <div className="absolute left-[71px] top-[600px] h-[571px] w-[938px] overflow-hidden rounded-[56px]">
        <img alt="" src={`${ASSETS}/foto.png`} className="absolute inset-0 size-full max-w-none object-cover" />
        <div className="absolute left-[260.81px] top-[140.85px] h-[279.597px] w-[503.113px] border-4 border-solid border-primaria-1" />
        <div className="absolute left-[260.81px] top-[98.85px] flex items-center justify-center bg-primaria-1 p-[10px]">
          <p className="whitespace-nowrap font-ui text-[18px] font-normal leading-[normal] text-branco">Detecção de Queda</p>
        </div>
      </div>
      {showBadge && (
        <BlackNovemberLogo left={70.55} top={59} black="var(--primaria-1)" november="var(--preto)" />
      )}

      <Movable id="titulo">
        <p
          className="absolute left-1/2 top-[213.02px] -translate-x-1/2 whitespace-pre-line break-words text-center font-title leading-[normal] text-primaria-1"
          style={{ width: tw(690.353), fontSize: ts(48) }}
        >
          <RichText text={texts.titulo} highlightClassName="text-secundaria-3" />
        </p>
      </Movable>
      <Movable id="texto">
        <p
          className="absolute left-1/2 top-[451.79px] -translate-x-1/2 whitespace-pre-line break-words text-center font-body leading-[normal] text-secundaria-3"
          style={{ width: tw(821.466), fontSize: ts(28) }}
        >
          <RichText text={texts.texto} />
        </p>
      </Movable>

      <div className="absolute left-[25.94px] top-[880.65px] flex items-center gap-[17.706px] rounded-[23.608px] bg-secundaria-3 p-[17.706px] font-ui text-branco">
        <div className="flex items-center rounded-[8px] bg-primaria-1 p-[8px]">
          <Icon name="queda" className="size-[30px]" />
        </div>
        <div className="flex flex-col items-start gap-[4px] whitespace-nowrap leading-[normal]">
          <p className="text-[18px] font-normal">Notificação</p>
          <p className="text-[24px] font-semibold">Detecção de Queda</p>
        </div>
      </div>

      <div className="absolute left-[611px] top-[577px] flex items-center gap-[17.706px] rounded-[23.608px] bg-primaria-1 p-[17.706px] font-ui text-branco">
        <div className="flex size-[30px] items-center justify-center">
          <Icon name="notificacao" />
        </div>
        <p className="whitespace-nowrap text-[24px] font-semibold leading-[normal]">Alertas de Queda</p>
        <div className="flex h-[21px] w-[35px] flex-col items-end justify-center rounded-[30px] bg-secundaria-3 pr-[3.5px]">
          <div className="size-[14px] rounded-[7px] bg-branco" />
        </div>
      </div>

      <Movable id="cta">
        <div
          className="absolute left-1/2 top-[1221px] flex -translate-x-1/2 items-center justify-center rounded-[200px] bg-primaria-1"
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

export const deteccaoDeQueda: TemplateDefinition = {
  id: "deteccao-de-queda",
  name: "8. Mais Atenção a Situações de Queda",
  figmaNodeId: "7:1151",
  elements: [
    { id: "titulo", label: "Título", resizableWidth: true, fields: [{ key: "titulo", label: "Título", multiline: true }] },
    { id: "texto", label: "Texto", resizableWidth: true, fields: [{ key: "texto", label: "Texto", multiline: true }] },
    { id: "cta", label: "Botão (CTA)", resizableWidth: false, fields: [{ key: "cta", label: "Texto do botão" }] },
  ],
  defaults: {
    titulo: "Mais apoio para identificar situações que exigem atenção.",
    texto: "A detecção de queda pode ajudar a sinalizar possíveis ocorrências em ambientes monitorados.",
    cta: "Conheça nossas soluções de monitoramento inteligente",
  },
  logo: {
    x: 1018,
    y: 66.91,
    width: 261,
    height: 58,
    anchor: "right",
    colors: { accent: "#7B48EA", ink: "#000000" },
  },
  Component: DeteccaoDeQueda,
};
