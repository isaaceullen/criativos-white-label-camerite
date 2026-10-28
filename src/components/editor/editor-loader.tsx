"use client";

import dynamic from "next/dynamic";

// O editor lê o localStorage e mede a tela, então roda apenas no navegador.
export const EditorLoader = dynamic(() => import("./editor").then((m) => m.Editor), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center text-sm text-[#6b6480]">Carregando editor…</div>
  ),
});
