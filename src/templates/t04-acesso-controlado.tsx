import { BlackNovemberLogo, Icon } from "./shared/brand-svgs";
import { Movable, ts, tw } from "./shared/movable";
import { RichText } from "./shared/rich-text";
import type { TemplateDefinition, TemplateProps } from "./types";

const ASSETS = "/templates/04-acesso-controlado";

function AcessoControlado({ texts, showBadge }: TemplateProps) {
  return (
    <div className="relative size-full overflow-hidden bg-secundaria-3">
      <div className="absolute left-[522px] top-0 h-[1350px] w-[558px] overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 overflow-hidden">
            <img
              alt=""
              src={`${ASSETS}/foto.png`}
              className="absolute left-[-47.21%] top-[-23.27%] h-[150.69%] w-[206.12%] max-w-none"
            />
          </div>
          <div className="absolute inset-0 bg-secundaria-3 mix-blend-color" />
        </div>
        <div className="absolute left-[76.97px] top-[451px] h-[55.444px] w-[77.835px] border-2 border-solid border-primaria-1" />
        <div className="absolute left-[58px] top-[409px] flex items-center justify-center bg-primaria-1 p-[10px]">
          <p className="whitespace-nowrap font-ui text-[18px] font-normal leading-[normal] text-branco">Facial</p>
        </div>
      </div>

      <Movable id="titulo">
        <p
          className="absolute left-[64px] top-[249.41px] whitespace-pre-line break-words font-title leading-[normal] text-branco"
          style={{ width: tw(413.777), fontSize: ts(48) }}
        >
          <RichText text={texts.titulo} />
        </p>
      </Movable>
      {showBadge && (
        <BlackNovemberLogo left={64} top={111.59} black="var(--primaria-1)" november="var(--branco)" />
      )}
      <Movable id="texto">
        <p
          className="absolute left-[64px] top-[648.41px] whitespace-pre-line break-words font-body leading-[normal] text-branco"
          style={{ width: tw(384.328), fontSize: ts(28) }}
        >
          <RichText text={texts.texto} />
        </p>
      </Movable>
      <Movable id="cta">
        <div
          className="absolute left-[64px] top-[1149px] flex items-center justify-center rounded-[200px] bg-branco"
          style={{ width: tw(379), padding: `${ts(24)} ${ts(36)}` }}
        >
          <p
            className="min-w-px flex-1 break-words font-body leading-[normal] text-secundaria-3"
            style={{ fontSize: ts(20) }}
          >
            {texts.cta}
          </p>
        </div>
      </Movable>

      <div className="absolute left-[370.11px] top-[827px] flex flex-col items-end gap-[19.272px] rounded-[38.544px] bg-branco p-[19.272px]">
        <div className="flex w-full items-center gap-[28.436px] text-primaria-1">
          <Icon name="reconhecimentoFacial" className="size-[48.18px] shrink-0" />
          <p className="whitespace-nowrap font-ui text-[38.544px] font-semibold leading-[normal]">Detecção Facial</p>
        </div>
        <img
          alt=""
          src={`${ASSETS}/foto-rosto.png`}
          className="h-[181.258px] w-[373.617px] max-w-none rounded-[25.696px] object-cover"
        />
      </div>
    </div>
  );
}

export const acessoControlado: TemplateDefinition = {
  id: "acesso-controlado",
  name: "4. Acesso Mais Controlado",
  figmaNodeId: "7:570",
  elements: [
    { id: "titulo", label: "Título", resizableWidth: true, fields: [{ key: "titulo", label: "Título", multiline: true }] },
    { id: "texto", label: "Texto", resizableWidth: true, fields: [{ key: "texto", label: "Texto", multiline: true }] },
    {
      id: "cta",
      label: "Botão (CTA)",
      resizableWidth: true,
      fields: [{ key: "cta", label: "Texto do botão", multiline: true }],
    },
  ],
  defaults: {
    titulo: "Mais informação para apoiar o controle de acesso.",
    texto: "Identificação de placas e reconhecimento facial para ampliar a visibilidade nos pontos monitorados.",
    cta: "Conheça as possibilidades para sua empresa ou condomínio",
  },
  logo: {
    x: 801,
    y: 106,
    width: 261,
    height: 58,
    anchor: "center",
    colors: { accent: "#3E2475", ink: "#FFFFFF" },
  },
  Component: AcessoControlado,
};
