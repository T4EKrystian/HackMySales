import type { ReactNode } from "react";

// Otoczka sekcji: papier / papier-deep / las (+ szum na lesie, CHECKLIST #18)
export function SectionShell({
  id,
  tone = "paper",
  className = "",
  children,
}: {
  id?: string;
  tone?: "paper" | "deep" | "forest";
  className?: string;
  children: ReactNode;
}) {
  const toneCls =
    tone === "forest"
      ? "bg-forest-950 text-onforest"
      : tone === "deep"
        ? "bg-paper-deep text-ink"
        : "bg-page text-ink";
  return (
    <section id={id} className={`section-pad relative overflow-hidden ${toneCls} ${className}`}>
      {tone === "forest" && <div className="noise-forest" aria-hidden="true" />}
      <div className="relative z-[1]">{children}</div>
    </section>
  );
}

// Eyebrow / caption — sans, wersaliki, ink-mute (brief: +0.06–0.16em)
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`t-meta font-medium uppercase tracking-[0.14em] text-mute ${className}`}>
      {children}
    </p>
  );
}

// Karta na papierze — hairline + tint, radius 20, bez cienia (cień tylko dla artefaktów)
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-hairline bg-l2 ${className}`}>{children}</div>;
}

// Folio — numer sekcji w mono (podpis: liczby zawsze mono)
export function Folio({ n, className = "" }: { n: string; className?: string }) {
  return <span className={`num text-mute ${className}`}>{n}</span>;
}

// Custom check glyph (NIE ✓ emoji) — stroke = currentColor (kolor ustawia rodzic)
export function CheckGlyph({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M2.75 8.5 6 11.75 13.25 4.25"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
