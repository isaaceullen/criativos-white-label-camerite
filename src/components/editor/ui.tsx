import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-black/[0.06] px-5 py-5 last:border-b-0">
      <div className="mb-3.5 flex items-center justify-between gap-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b6480]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function TextButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`text-xs font-medium text-[#7B48EA] transition-colors hover:text-[#52309C] disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...props}
    />
  );
}

export function SecondaryButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-black/10 bg-white px-3 text-sm font-medium text-[#1c1530] transition-colors hover:border-[#7B48EA]/50 hover:bg-[#f6f2fe] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-[#1c1530]">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-[#7B48EA]" : "bg-black/15"}`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}
