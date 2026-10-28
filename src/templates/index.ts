import { feriasSeguras } from "./t01-ferias-seguras";
import { comercioInteligente } from "./t02-comercio-inteligente";
import { altaTemporada } from "./t03-alta-temporada";
import { acessoControlado } from "./t04-acesso-controlado";
import { recessoFimDeAno } from "./t05-recesso-fim-de-ano";
import { areasDeRisco } from "./t06-areas-de-risco";
import { academias } from "./t07-academias";
import { deteccaoDeQueda } from "./t08-deteccao-de-queda";
import type { TemplateDefinition } from "./types";

export const TEMPLATES: TemplateDefinition[] = [
  feriasSeguras,
  comercioInteligente,
  altaTemporada,
  acessoControlado,
  recessoFimDeAno,
  areasDeRisco,
  academias,
  deteccaoDeQueda,
];

export * from "./types";
