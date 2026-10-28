import { BlackNovemberLogo, Icon } from "./shared/brand-svgs";
import { Movable, ts, tw } from "./shared/movable";
import { RichText } from "./shared/rich-text";
import type { TemplateDefinition, TemplateProps } from "./types";

const ASSETS = "/templates/02-comercio-inteligente";

const DETECTION_BOXES = [
  { left: 86.14, top: 365.18, width: 82.05, height: 136.261 },
  { left: 225.94, top: 324.1, width: 82.05, height: 136.261 },
  { left: 563.93, top: 121.75, width: 157.381, height: 169.544 },
  { left: 407.47, top: 304.65, width: 313.841, height: 205.906 },
];

function ComercioInteligente({ texts, showBadge }: TemplateProps) {
  return (
    <div className="relative size-full overflow-hidden bg-branco">
      <div className="absolute left-0 top-0 h-[687px] w-[1080px] overflow-hidden">
        <img alt="" src={`${ASSETS}/foto.png`} className="absolute inset-0 size-full max-w-none object-cover" />
        {showBadge && (
          <BlackNovemberLogo left={80.12} top={96.44} black="var(--primaria-1)" november="var(--branco)" />
        )}
        {DETECTION_BOXES.map((box) => (
          <div key={`${box.left}-${box.top}`} className="absolute border-2 border-solid border-branco" style={box} />
        ))}
      </div>

      <div className="absolute left-[641px] top-[564px] flex w-[389px] flex-col items-start gap-[17.706px] rounded-[23.608px] bg-secundaria-3 p-[17.706px] font-ui text-branco">
        <p className="whitespace-nowrap text-[18px] font-normal leading-[normal]">Fluxo no período</p>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-[17.706px]">
            <Icon name="aglomeracao" className="size-[30px]" />
            <p className="whitespace-nowrap text-[24px] font-semibold leading-[normal]">Aglomeração</p>
          </div>
          <div className="relative h-[5.902px] w-[104.024px] overflow-hidden rounded-[147.552px] bg-branco">
            <div className="absolute left-[-3.49px] top-1/2 h-[5.902px] w-[93.695px] -translate-y-1/2 rounded-[147.552px] bg-primaria-1" />
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-[17.706px]">
            <div className="flex size-[30px] items-center justify-center">
              <Icon name="carro" />
            </div>
            <p className="whitespace-nowrap text-[24px] font-semibold leading-[normal]">Carros</p>
          </div>
          <div className="relative h-[5.902px] w-[104.762px] overflow-hidden rounded-[147.552px] bg-branco">
            <div className="absolute left-[-3.49px] top-[calc(50%-0.37px)] h-[9.591px] w-[30.986px] -translate-y-1/2 rounded-[147.552px] bg-primaria-1" />
          </div>
        </div>
      </div>

      <Movable id="titulo">
        <p
          className="absolute left-[88.85px] top-[755px] whitespace-pre-line break-words font-title leading-[normal] text-primaria-1"
          style={{ width: tw(795.171), fontSize: ts(48) }}
        >
          <RichText text={texts.titulo} highlightClassName="text-secundaria-3" />
        </p>
      </Movable>
      <Movable id="texto">
        <p
          className="absolute left-[88.85px] top-[1012px] whitespace-pre-line break-words font-body leading-[normal] text-secundaria-3"
          style={{ width: tw(729.447), fontSize: ts(28) }}
        >
          <RichText text={texts.texto} />
        </p>
      </Movable>
      <Movable id="cta">
        <div
          className="absolute left-[88.85px] top-[1170px] flex items-center justify-center rounded-[200px] bg-primaria-1"
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

export const comercioInteligente: TemplateDefinition = {
  id: "comercio-inteligente",
  name: "2. Comércio Mais Inteligente",
  figmaNodeId: "7:343",
  elements: [
    { id: "titulo", label: "Título", resizableWidth: true, fields: [{ key: "titulo", label: "Título", multiline: true }] },
    { id: "texto", label: "Texto", resizableWidth: true, fields: [{ key: "texto", label: "Texto", multiline: true }] },
    { id: "cta", label: "Botão (CTA)", resizableWidth: false, fields: [{ key: "cta", label: "Texto do botão" }] },
  ],
  defaults: {
    titulo: "Mais movimento nas vendas. Mais informação para sua operação.",
    texto: "Prepare seu comércio para a Black Friday e o Natal com dados sobre o fluxo de pessoas e veículos.",
    cta: "Conheça as possibilidades para o seu negócio",
  },
  logo: {
    x: 999.88,
    y: 104.35,
    width: 261,
    height: 58,
    anchor: "right",
    colors: { accent: "#7B48EA", ink: "#FFFFFF" },
  },
  Component: ComercioInteligente,
};
