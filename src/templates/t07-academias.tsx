import { BlackNovemberLogo } from "./shared/brand-svgs";
import { Movable, ts, tw } from "./shared/movable";
import { RichText } from "./shared/rich-text";
import type { TemplateDefinition, TemplateProps } from "./types";

const ASSETS = "/templates/07-academias";

const BARS = [
  { label: "6h", height: 148 },
  { label: "8h", height: 103 },
  { label: "10h", height: 78 },
  { label: "12h", height: 116 },
  { label: "14h", height: 69 },
  { label: "16h", height: 107 },
  { label: "18h", height: 184, peak: true },
  { label: "20h", height: 177, peak: true },
  { label: "22h", height: 90 },
];

function Academias({ texts, showBadge }: TemplateProps) {
  return (
    <div className="relative size-full overflow-hidden bg-secundaria-3">
      <img
        alt=""
        src={`${ASSETS}/foto.png`}
        className="absolute left-[61px] top-[432px] h-[469px] w-[958px] max-w-none rounded-[48px] object-cover"
      />
      {showBadge && (
        <BlackNovemberLogo left={61} top={59} black="var(--primaria-1)" november="var(--branco)" />
      )}
      <Movable id="titulo">
        <p
          className="absolute left-1/2 top-[232.41px] -translate-x-1/2 whitespace-pre-line break-words text-center font-title leading-[normal] text-branco"
          style={{ width: tw(836), fontSize: ts(36) }}
        >
          <RichText text={texts.titulo} />
        </p>
      </Movable>

      <div className="absolute left-1/2 top-[790.26px] h-[294px] w-[836px] -translate-x-1/2 rounded-[32px] bg-branco">
        <div className="absolute left-[558px] top-[46px] flex items-center justify-center rounded-[8px] bg-secundaria-3 p-[10px]">
          <p
            className="whitespace-nowrap text-center font-body text-[20px] leading-[normal] text-branco [text-box:trim-both_cap_alphabetic]"
            style={{ fontWeight: 700 }}
          >
            Pico
          </p>
        </div>
        <p className="absolute left-[40.55px] top-[32px] whitespace-nowrap font-body text-[20px] leading-[normal] text-secundaria-3 [text-box:trim-both_cap_alphabetic]">
          Fluxo de Pessoas
        </p>
        <div className="absolute left-[38px] top-[91px] flex items-end gap-[14px]">
          {BARS.map((bar) => (
            <div key={bar.label} className="flex w-[72px] flex-col items-center gap-[12px]" style={{ height: bar.height }}>
              <div
                className={`min-h-px w-full flex-1 rounded-t-[12px] ${bar.peak ? "bg-primaria-1" : "bg-primaria-3"}`}
              />
              <p className="w-full text-center font-body text-[20px] leading-[normal] text-secundaria-3">{bar.label}</p>
            </div>
          ))}
        </div>
      </div>

      <Movable id="texto">
        <p
          className="absolute left-1/2 top-[1123.63px] -translate-x-1/2 whitespace-pre-line break-words text-center font-body leading-[normal] text-branco"
          style={{ width: tw(643.586), fontSize: ts(24) }}
        >
          <RichText text={texts.texto} />
        </p>
      </Movable>
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

export const academias: TemplateDefinition = {
  id: "academias",
  name: "7. Academias que Entendem Seu Movimento",
  figmaNodeId: "7:867",
  elements: [
    {
      id: "titulo",
      label: "Título",
      resizableWidth: true,
      fields: [{ key: "titulo", label: "Título — use *texto* para destacar", multiline: true }],
    },
    { id: "texto", label: "Texto", resizableWidth: true, fields: [{ key: "texto", label: "Texto", multiline: true }] },
    { id: "cta", label: "Botão (CTA)", resizableWidth: false, fields: [{ key: "cta", label: "Texto do botão" }] },
  ],
  defaults: {
    titulo: "Descubra os horários em que sua *academia* realmente movimenta.",
    texto: "Entenda o fluxo de pessoas e planeje melhor a rotina da sua academia.",
    cta: "Conheça nossas soluções de análise de fluxo",
  },
  logo: {
    x: 1019,
    y: 66.91,
    width: 261,
    height: 58,
    anchor: "right",
    colors: { accent: "#A785F1", ink: "#FFFFFF" },
  },
  Component: Academias,
};
