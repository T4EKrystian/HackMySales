type LogoProps = {
  withWord?: boolean;
  markSize?: number;
  className?: string;
  /** Mikro-kropka statusu online (hms-design-dna „Znak") — używać TYLKO w nav. */
  status?: boolean;
  /** Wariant na ciemne pasma (granat): biel + blue-300 (kontrast AA na --forest-950). */
  onDark?: boolean;
};

/** Logo renderowane komponentem (nie obrazkiem): SVG mark + wordmark w HTML —
 *  ostre na retinie, dziedziczy tokeny. Znak wg makiety właściciela (E7b):
 *  outlined dymek czatu (ogonek lewy-dolny) + 3 rosnące słupki wzrostu;
 *  wordmark dwukolorowy „Hack·My·Sales" (My w firmowym niebieskim). */
export function Logo({
  withWord = true,
  markSize = 32,
  className = "",
  status = false,
  onDark = false,
}: LogoProps) {
  const accent = onDark ? "text-blue-soft" : "text-blue";
  const ink = onDark ? "text-onforest" : "text-ink";

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
          className={accent}
        >
          {/* Dymek (obrys, ogonek w lewym dolnym rogu) — korpus wyrównany do wersalika */}
          <path
            d="M17 7 H47 A11 11 0 0 1 58 18 V32 A11 11 0 0 1 47 43 H29 L14 53.5 L17 43 A11 11 0 0 1 6 32 V18 A11 11 0 0 1 17 7 Z"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          {/* Słupki wzrostu (rozmowa → sprzedaż), zaokrąglone końce */}
          <g stroke="currentColor" strokeWidth="5" strokeLinecap="round">
            <line x1="23.5" y1="34" x2="23.5" y2="25" />
            <line x1="32" y1="34" x2="32" y2="20" />
            <line x1="40.5" y1="34" x2="40.5" y2="15" />
          </g>
        </svg>
        {status && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-blue"
          />
        )}
      </span>
      {withWord && (
        <span
          className={`font-display text-[1.2rem] font-semibold leading-none tracking-tight ${ink}`}
        >
          Hack
          <span className={accent}>My</span>
          Sales
        </span>
      )}
    </span>
  );
}
