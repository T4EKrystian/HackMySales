type LogoProps = {
  withWord?: boolean;
  markSize?: number;
  className?: string;
  /** Mikro-kropka statusu online (hms-design-dna „Znak") — używać TYLKO w nav. */
  status?: boolean;
};

/** Logo renderowane komponentem (nie obrazkiem): SVG mark + wordmark w HTML —
 *  ostre na retinie, dziedziczy tokeny. Konstrukcja: design/brand.md §1.
 *  Redesign: dymek w atramencie, strzałka wzrostu w kwasie (rozmowa → sprzedaż). */
export function Logo({ withWord = true, markSize = 30, className = "", status = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative inline-flex shrink-0">
        <svg
          viewBox="0 0 64 64"
          width={markSize}
          height={markSize}
          aria-hidden="true"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dymek (rozmowa) + strzałka wzrostu w kontrze (rozmowa → sprzedaż) — bake-off winner */}
          <path
            d="M22 8 H42 A14 14 0 0 1 56 22 V34 A14 14 0 0 1 42 48 H26 L13.2 58.6 C11.2 60.2 8 58.9 8 56.3 V22 A14 14 0 0 1 22 8 Z"
            fill="var(--ink)"
          />
          <g stroke="var(--acid)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 35L42 20" />
            <path d="M34 20H42V28" />
          </g>
        </svg>
        {status && (
          <span
            aria-hidden="true"
            className="logo-pulse absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-acid"
          />
        )}
      </span>
      {withWord && (
        <span className="font-display text-[1.2rem] font-semibold leading-none tracking-tight text-ink">
          HackMySales
        </span>
      )}
    </span>
  );
}
