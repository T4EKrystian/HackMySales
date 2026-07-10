type LogoProps = {
  withWord?: boolean;
  markSize?: number;
  className?: string;
  /** Mikro-kropka statusu online (hms-design-dna „Znak") — używać TYLKO w nav. */
  status?: boolean;
};

/** Logo renderowane komponentem (nie obrazkiem): SVG mark + wordmark w HTML —
 *  ostre na retinie, dziedziczy tokeny. Konstrukcja: design/brand.md §1. */
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
          <path
            d="M22 8 H42 A14 14 0 0 1 56 22 V34 A14 14 0 0 1 42 48 H26 L13.2 58.6 C11.2 60.2 8 58.9 8 56.3 V22 A14 14 0 0 1 22 8 Z"
            stroke="var(--blue-500)"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          <rect x="18.5" y="30" width="6" height="10" rx="3" fill="var(--blue-500)" />
          <rect x="29" y="23" width="6" height="17" rx="3" fill="var(--blue-500)" />
          <rect x="39.5" y="16" width="6" height="24" rx="3" fill="var(--blue-500)" />
        </svg>
        {status && (
          <span
            aria-hidden="true"
            className="logo-pulse absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-ok"
          />
        )}
      </span>
      {withWord && (
        <span className="font-display text-[1.2rem] font-bold leading-none tracking-tight text-ink">
          Hack
          <span className="text-blue">My</span>
          Sales
        </span>
      )}
    </span>
  );
}
