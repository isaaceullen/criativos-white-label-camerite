import { Fragment } from "react";

/**
 * Renderiza texto editável. Trechos entre asteriscos (`*assim*`) ganham a
 * classe de destaque; quebras de linha são preservadas.
 */
export function RichText({
  text,
  highlightClassName = "text-primaria-1",
}: {
  text: string;
  highlightClassName?: string;
}) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
          <span key={i} className={highlightClassName}>
            {part.slice(1, -1)}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
