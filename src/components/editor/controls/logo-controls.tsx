"use client";

import { useRef, useState } from "react";
import { CameriteLogo } from "@/templates/shared/brand-svgs";
import { SecondaryButton, Switch, TextButton } from "../ui";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function LogoControls({
  logoSrc,
  logoScale,
  showBadge,
  hasOffset,
  onLogoChange,
  onScaleChange,
  onShowBadgeChange,
  onResetPosition,
}: {
  logoSrc: string | null;
  logoScale: number;
  showBadge: boolean;
  hasOffset: boolean;
  onLogoChange: (src: string | null) => void;
  onScaleChange: (scale: number) => void;
  onShowBadgeChange: (value: boolean) => void;
  onResetPosition: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Envie um arquivo de imagem (PNG, SVG, JPG ou WebP).");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("A imagem deve ter no máximo 5 MB.");
      return;
    }
    setError(null);
    onLogoChange(await readAsDataUrl(file));
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        className={`flex items-center gap-3 rounded-xl border border-dashed p-3 transition-colors ${
          dragOver ? "border-[#7B48EA] bg-[#f6f2fe]" : "border-black/15"
        }`}
      >
        <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded-lg bg-[#29184E] p-2 [background-image:linear-gradient(45deg,rgba(255,255,255,.06)_25%,transparent_25%,transparent_75%,rgba(255,255,255,.06)_75%),linear-gradient(45deg,rgba(255,255,255,.06)_25%,transparent_25%,transparent_75%,rgba(255,255,255,.06)_75%)] [background-position:0_0,6px_6px] [background-size:12px_12px]">
          {logoSrc ? (
            <img alt="Sua logo" src={logoSrc} className="max-h-full max-w-full object-contain" />
          ) : (
            <CameriteLogo width={80} height={18} colors={{ accent: "#A785F1", ink: "#FFFFFF" }} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#1c1530]">{logoSrc ? "Sua logo" : "Logo Camerite"}</p>
          <p className="text-[11px] leading-snug text-[#8a83a0]">
            Arraste uma imagem aqui ou clique para enviar. PNG/SVG com fundo transparente funcionam melhor.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <SecondaryButton className="flex-1" onClick={() => inputRef.current?.click()}>
          {logoSrc ? "Trocar logo" : "Enviar minha logo"}
        </SecondaryButton>
        {logoSrc && <SecondaryButton onClick={() => onLogoChange(null)}>Usar Camerite</SecondaryButton>}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/svg+xml,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="text-[11px] text-[#c03a3a]">{error}</p>}

      <div>
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <label htmlFor="logo-scale" className="text-[#1c1530]">
            Tamanho
          </label>
          <span className="font-mono text-xs text-[#6b6480]">{Math.round(logoScale * 100)}%</span>
        </div>
        <input
          id="logo-scale"
          type="range"
          min={0.3}
          max={3}
          step={0.05}
          value={logoScale}
          onChange={(e) => onScaleChange(Number(e.target.value))}
          className="w-full accent-[#7B48EA]"
        />
      </div>

      <div className="flex items-center justify-between rounded-lg bg-[#f6f2fe] px-3 py-2.5">
        <p className="text-[11px] leading-snug text-[#52309C]">
          Arraste a logo no preview para movê-la. Use as setas do teclado para ajuste fino.
        </p>
        <TextButton onClick={onResetPosition} disabled={!hasOffset} className="ml-3 shrink-0">
          Resetar posição
        </TextButton>
      </div>

      <Switch label="Mostrar selo Black November" checked={showBadge} onChange={onShowBadgeChange} />
    </div>
  );
}
