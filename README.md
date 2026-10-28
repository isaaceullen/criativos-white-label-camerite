# Camerite · Gerador de Posts White Label

Gerador de posts de Instagram (1080 × 1350 px) da campanha **Black November** para parceiros Camerite.
Cada cliente escolhe um template, aplica as cores, fontes e logo da própria marca, edita os textos e baixa o PNG final.

Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · `html-to-image`.

## Rodando localmente

Pré-requisito: Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Outros comandos:

| Comando         | O que faz                         |
| --------------- | --------------------------------- |
| `npm run build` | Build de produção                 |
| `npm run start` | Serve o build de produção         |
| `npm run lint`  | ESLint                            |

## Publicando no Vercel

1. Suba o projeto para um repositório Git (GitHub, GitLab, Bitbucket).
2. No Vercel, clique em **Add New → Project** e importe o repositório.
3. Mantenha as configurações padrão (o Vercel detecta Next.js automaticamente) e clique em **Deploy**.

Não há variáveis de ambiente. A página é estática e toda a geração do PNG acontece no navegador.

## Como funciona

- **Galeria de templates** (coluna esquerda): os 8 frames do Figma, com miniaturas ao vivo.
- **Preview** (centro): o post em tamanho real (1080 × 1350), escalado para caber na tela.
- **Controles** (coluna direita):
  - **Logo**: envie a logo do cliente (PNG/SVG/JPG/WebP, até 5 MB). Ela substitui a logo Camerite em todos os templates. Arraste a logo no preview para movê-la (setas do teclado = 1 px, Shift + setas = 10 px), ajuste o tamanho e mostre ou oculte o selo Black November.
  - **Cores**: as 7 cores do Figma (Primária 1–3, Secundária 2–3, Branco, Preto).
  - **Fontes**: Specify e Univers (oficiais) ou qualquer família do Google Fonts, separadamente para títulos e textos, com escolha do peso (Regular, Medium, Bold… conforme o que a família oferece).
  - **Textos e posição**: cada bloco do template (título, texto, botão, ou o box inteiro quando o texto fica dentro de um card) tem seu card com os textos, um controle de **tamanho do texto** e, quando faz sentido, de **largura**. O box atrás do texto cresce e encolhe junto (padding, cantos e espaçamentos). Arraste o bloco direto no preview para movê-lo (setas = 1 px, Shift + setas = 10 px, Esc tira a seleção). "Resetar" volta o bloco ao padrão do Figma; "Restaurar template" volta textos, posições e logo.
  - Trechos entre `*asteriscos*` recebem a cor de destaque.
- **Baixar PNG**: gera o arquivo em exatamente 1080 × 1350 px.

As escolhas ficam salvas no `localStorage` do navegador, então o cliente não perde a personalização ao recarregar a página.

## Fontes Specify e Univers

As fontes oficiais são carregadas com `next/font/local` em [`src/fonts/index.ts`](src/fonts/index.ts):

```
src/fonts/
├── index.ts
├── specify/
│   ├── Specify-ExpandedThin.ttf     (peso 100)
│   ├── Specify-ExpandedLight.ttf    (peso 300)
│   ├── Specify-ExpandedMedium.ttf   (peso 500)
│   ├── Specify-ExpandedBold.ttf     (peso 700)
│   └── Specify-ExpandedBlack.ttf    (peso 900 — usado nos títulos)
└── univers/
    ├── UniversLTStd-Ex.otf          (peso 400 — "53 Extended", usado nos textos)
    ├── UniversLTStd-BoldEx.otf      (peso 700 — "63 Bold Extended")
    └── UniversLTStd-BlackEx.otf     (peso 900)
```

Os arquivos atuais foram copiados das fontes instaladas no Windows. Para trocar ou adicionar arquivos (por exemplo, versões `.woff2`, que são mais leves):

1. Coloque os arquivos em `src/fonts/specify/` ou `src/fonts/univers/`.
2. Atualize os `path` em `src/fonts/index.ts`. Cada entrada tem `path`, `weight` e `style`:

   ```ts
   export const specify = localFont({
     src: [
       { path: "./specify/Specify-ExpandedBlack.woff2", weight: "900", style: "normal" },
       // ...
     ],
     variable: "--font-specify",
   });
   ```

3. Reinicie o `npm run dev`.

> O `next/font/local` exige que todos os arquivos listados existam no momento do build. Se remover um arquivo, remova também a linha correspondente.

Os pesos que aparecem no editor vêm de `BRAND_FONTS` em [`src/lib/fonts.ts`](src/lib/fonts.ts). Ao adicionar ou remover um arquivo, atualize a lista `weights` da fonte ali também.

> **Licença:** Specify e Univers são fontes comerciais. Ao publicar o site, os arquivos ficam acessíveis no navegador do visitante, então confirme se a licença da Camerite cobre uso web (webfont).

## Google Fonts

O carregamento é dinâmico, feito em [`src/lib/fonts.ts`](src/lib/fonts.ts) pela função `loadGoogleFont`:

- O CSS é buscado em `fonts.googleapis.com` só quando o cliente escolhe a fonte, e é injetado como `<style>` inline para que o `html-to-image` consiga embutir a fonte no PNG.
- Os pesos de 100 a 900 são testados um a um pela rota [`/api/google-font`](src/app/api/google-font/route.ts), no servidor. Só os que a família realmente tem aparecem como opção no editor. O teste não pode ser feito direto no navegador porque o Google responde sem cabeçalho CORS para pesos inexistentes, o que gera "Failed to fetch". O resultado fica em cache por alguns dias.
- Apenas os subsets `latin` e `latin-ext` são mantidos (cobrem português).
- Para mudar a lista de sugestões, edite `GOOGLE_FONT_SUGGESTIONS`. Qualquer outra família pode ser digitada no campo.

## Cores (CSS variables)

As cores são CSS variables definidas em [`src/app/globals.css`](src/app/globals.css) e mapeadas para utilitários do Tailwind (`bg-primaria-1`, `text-secundaria-3`, etc.):

| Variable         | Padrão    | Nome no Figma |
| ---------------- | --------- | ------------- |
| `--primaria-1`   | `#7B48EA` | Primária 1    |
| `--primaria-2`   | `#A785F1` | Primária 2    |
| `--primaria-3`   | `#D3C2F8` | Primária 3    |
| `--secundaria-2` | `#3E2475` | Secundária 2  |
| `--secundaria-3` | `#29184E` | Secundária 3  |
| `--branco`       | `#FFFFFF` | Branco        |
| `--preto`        | `#000000` | Preto         |

O editor sobrescreve essas variables inline na raiz de cada post. O selo Black November e os ícones são SVG inline que também usam as variables, então acompanham a paleta. A logo Camerite tem cores fixas (as do Figma, definidas em `logo.colors` de cada template) e não muda com a paleta.

A fonte e o peso de títulos e textos também são variables (`--post-font-title`, `--post-weight-title`, `--post-font-body`, `--post-weight-body`), aplicadas pelos utilitários `font-title` e `font-body`.

Para mudar os padrões, altere `src/lib/palette.ts` e `src/app/globals.css`.

## Estrutura

```
public/templates/<nn-nome>/     Fotos (PNG) e SVGs exportados de cada frame do Figma
src/
├── app/                        layout, página e CSS global (tokens)
├── fonts/                      next/font/local (Specify, Univers) + Inter
├── lib/
│   ├── palette.ts              definição das cores
│   ├── fonts.ts                opções de fonte + loader do Google Fonts
│   └── export.ts               geração do PNG (html-to-image)
├── templates/
│   ├── t01-…t08-*.tsx          um arquivo por template (layout + textos padrão + posição da logo)
│   ├── shared/brand-svgs.tsx   logo Camerite, selo Black November e ícones
│   ├── shared/movable.tsx      blocos de texto móveis/redimensionáveis
│   ├── shared/svg-data.ts      paths extraídos dos SVGs do Figma
│   └── index.ts                registro dos templates
└── components/editor/          interface do editor
```

### Adicionando um novo template

1. Exporte as imagens do frame para `public/templates/09-nome/`.
2. Crie `src/templates/t09-nome.tsx` seguindo um dos templates existentes: o componente recebe `texts` e `showBadge`, e a definição informa `elements` (blocos editáveis e seus campos de texto), `defaults` e `logo` (posição padrão, âncora e cores fixas da logo Camerite).
3. Registre o template em `src/templates/index.ts`.

Use as classes de cor (`bg-primaria-1`, `text-branco`...) e de fonte (`font-title`, `font-body`) para que o template responda aos controles do editor.

Para que um bloco possa ser movido e redimensionado, envolva-o em `<Movable id="...">` (o `id` deve existir em `elements`) e escreva tamanhos de fonte, larguras e paddings com os helpers de [`src/templates/shared/movable.tsx`](src/templates/shared/movable.tsx): `ts(40)` escala com o controle de tamanho do texto e `tw(920)` com o de largura.

## Frames de origem (Figma)

Arquivo: [Parceiros — Black November](https://www.figma.com/design/HoJaLiqLFb5oWMAtQpknPv/Parceiros---Black-November)

| Template                                | Node    |
| --------------------------------------- | ------- |
| 1. Férias Seguras                       | `7:220`  |
| 2. Comércio Mais Inteligente            | `7:343`  |
| 3. Operação Pronta para a Alta Temporada | `2:271`  |
| 4. Acesso Mais Controlado               | `7:570`  |
| 5. Recesso de Fim de Ano                | `7:1045` |
| 6. Segurança em Áreas de Risco          | `7:702`  |
| 7. Academias que Entendem Seu Movimento | `7:867`  |
| 8. Mais Atenção a Situações de Queda    | `7:1151` |
