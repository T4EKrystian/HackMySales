import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`container-hms ${className}`}>{children}</div>;
}

export function SectionLabel({
  children,
  num,
  className = "",
}: {
  children: ReactNode;
  num?: string;
  className?: string;
}) {
  return (
    <p className={`label js-reveal flex items-center gap-3 ${className}`}>
      {num && (
        <>
          <span className="text-blue-soft">{num}</span>
          <span aria-hidden="true" className="inline-block h-px w-8 bg-strongline" />
        </>
      )}
      {children}
    </p>
  );
}

/** Linia księgowa (sygnatura redesignu): pełna linia 1px z trzema mono tab-stopami —
 *  folio · eyebrow · prawy datum (prawdziwa liczba z truth-table). Datum znika <sm.
 *  `inverted` = pasmo granatowe (Crescendo/FinalCta): hairline i tekst na ciemnym. */
export function LedgerRule({
  folio,
  eyebrow,
  datum,
  inverted = false,
  className = "",
}: {
  folio?: string;
  eyebrow: ReactNode;
  datum?: ReactNode;
  inverted?: boolean;
  className?: string;
}) {
  const muted = inverted ? "text-onforest/55" : "text-mute";
  return (
    <div
      className={`js-reveal flex items-baseline gap-3 border-t pt-6 ${
        inverted ? "border-line-dark" : "border-hairline"
      } ${className}`}
    >
      {folio && <span className={`ledger ${muted}`}>{folio}</span>}
      <span className={`ledger uppercase tracking-[0.1em] ${inverted ? "text-onforest/75" : "text-mute"}`}>
        {eyebrow}
      </span>
      {datum && <span className={`ledger ml-auto hidden sm:inline ${muted}`}>{datum}</span>}
    </div>
  );
}

export function SectionH2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`t-h2 js-reveal mt-4 font-display font-semibold text-ink ${className}`}
    >
      {children}
    </h2>
  );
}
