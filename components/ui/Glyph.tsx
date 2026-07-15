/** Mikro-glify HMS (hms-design-dna „Ikony i ornament"): zero bibliotecznych ikon —
 *  własne pathy 24×24, stroke 1.5, round caps. Rysunek prostszy niż biblioteczny
 *  (mniej węzłów, jedna myśl na glif). aria-hidden zawsze — glify są dekoracyjne,
 *  sens niesie tekst obok. */

export type GlyphName =
  | "arrow-right"
  | "check"
  | "chevron-down"
  | "lock"
  | "menu"
  | "minus"
  | "moon"
  | "radar"
  | "replay"
  | "search"
  | "x"
  | "www"
  | "messenger"
  | "instagram"
  | "mail"
  | "camera"
  | "plus"
  | "chevron-left"
  | "more"
  | "smiley"
  | "mic"
  | "send";

const PATHS: Record<GlyphName, React.ReactNode> = {
  "arrow-right": <path d="M4.5 12h14.5M13.5 6.5 19 12l-5.5 5.5" />,
  check: <path d="m5 12.5 4.8 4.8L19 7.5" />,
  "chevron-down": <path d="m6 9.5 6 6 6-6" />,
  lock: (
    <>
      <rect x="6.5" y="11" width="11" height="8.5" rx="2" />
      <path d="M9.25 11V8.25a2.75 2.75 0 0 1 5.5 0V11" />
    </>
  ),
  menu: <path d="M4.5 7.5h15M4.5 12h15M4.5 16.5h15" />,
  minus: <path d="M5.5 12h13" />,
  moon: <path d="M19.5 13.8A8 8 0 1 1 10.2 4.5 6.4 6.4 0 0 0 19.5 13.8Z" />,
  radar: (
    <>
      <circle cx="12" cy="12" r="7.75" />
      <path d="M12 12l5.2-5.2" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  replay: (
    <>
      <path d="M5 4.75V9.5h4.75" />
      <path d="M5.4 9.5a7.25 7.25 0 1 1-1.15 4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.25" />
      <path d="m15.6 15.6 4.4 4.4" />
    </>
  ),
  x: <path d="m6.5 6.5 11 11m0-11-11 11" />,
  www: (
    <>
      <circle cx="12" cy="12" r="7.75" />
      <ellipse cx="12" cy="12" rx="3.4" ry="7.75" />
      <path d="M4.6 12h14.8" />
    </>
  ),
  messenger: (
    <>
      <path d="M12 4.5c-4.4 0-8 3.1-8 7.2 0 2.3 1.1 4.3 2.9 5.6V20l2.7-1.5c.8.2 1.6.3 2.4.3 4.4 0 8-3.1 8-7.1s-3.6-7.2-8-7.2Z" />
      <path d="m8.4 13.4 2.6-2.8 2 1.9 2.6-2.8" />
    </>
  ),
  instagram: (
    <>
      <rect x="4.5" y="4.5" width="15" height="15" rx="4.5" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  mail: (
    <>
      <rect x="4" y="6" width="16" height="12.5" rx="2" />
      <path d="m4.75 7.5 7.25 5.5 7.25-5.5" />
    </>
  ),
  camera: (
    <>
      <path d="M4.5 8.5A1.75 1.75 0 0 1 6.25 6.75h2L9.6 5h4.8l1.35 1.75h2A1.75 1.75 0 0 1 19.5 8.5v8A1.75 1.75 0 0 1 17.75 18.25H6.25A1.75 1.75 0 0 1 4.5 16.5Z" />
      <circle cx="12" cy="12.25" r="3.1" />
    </>
  ),
  plus: <path d="M12 5.5v13M5.5 12h13" />,
  "chevron-left": <path d="m14.5 6-6 6 6 6" />,
  more: (
    <>
      <circle cx="5.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  smiley: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M8.5 14a4.2 4.2 0 0 0 7 0" />
      <circle cx="9.2" cy="10" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="10" r="0.95" fill="currentColor" stroke="none" />
    </>
  ),
  mic: (
    <>
      <rect x="9.25" y="3.5" width="5.5" height="10.5" rx="2.75" />
      <path d="M6.5 11.5a5.5 5.5 0 0 0 11 0" />
      <path d="M12 17v3.5" />
    </>
  ),
  send: (
    <>
      <path d="M20.5 3.5 3.5 10.9l6.6 2.4 2.4 6.6 8-16.4Z" />
      <path d="m20.5 3.5-10.4 9.8" />
    </>
  ),
};

export function Glyph({
  name,
  size = 16,
  className = "",
}: {
  name: GlyphName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
    >
      {PATHS[name]}
    </svg>
  );
}
