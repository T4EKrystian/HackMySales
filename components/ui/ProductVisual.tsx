/** ProductVisual (hms-design-dna „Wizualizacje produktów"): generatywna mini-scena
 *  zamiast pustego kafla — gradient w tincie + szum + sylwetka 1–2 kształtów +
 *  światło z góry + winieta. Kadr 1:1, wewnętrzny radius, art-directed still.
 *
 *  Architektura: sylwetki i gradienty siedzą RAZ w <ProductVisualDefs> (ukryty svg
 *  w page.tsx), instancje referują przez <use>. Szum to klasa .pv-noise z data-URI
 *  (feTurbulence per element NIE jest cache'owane — filtr per instancja to marnotrawstwo).
 *  Zasada one-accent: max 1–2 niebieskie kafle na viewport — reszta grafit. */

export type ProductKind = "but" | "kurtka" | "kask" | "odziez" | "plytka";

const KIND_TINT: Record<ProductKind, "blue" | "graphite"> = {
  but: "blue",
  kurtka: "blue",
  kask: "graphite",
  odziez: "graphite",
  plytka: "graphite",
};

/** Wspólne defs — renderować RAZ na stronę (server component, zero JS). */
export function ProductVisualDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        {/* cień ku dołowi — „gradient bazowy" bez id per instancja */}
        <linearGradient id="pv-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.35" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.38" />
        </linearGradient>
        {/* światło z góry */}
        <radialGradient id="pv-light" cx="0.5" cy="0.06" r="0.75">
          <stop offset="0" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        {/* winieta */}
        <radialGradient id="pv-vig" cx="0.5" cy="0.5" r="0.72">
          <stop offset="0.62" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </radialGradient>

        {/* Sylwetki — 64×64, ~60% kadru, lekko w dół */}
        <symbol id="pv-but" viewBox="0 0 64 64">
          <path d="M10 44.5 C15 41 20.5 43 27 43.6 C36 44.4 42.5 41.8 48 38.2 C51.8 35.8 55.4 37.6 54.8 41.6 C54.2 46.4 50.4 48.8 44.6 48.8 L15.4 48.8 C11.4 48.8 9.4 47.2 10 44.5 Z" />
          <path d="M14 43.5 C14 34 18 27.4 24.6 24.8 C29.4 23 33.2 24.6 36.4 29 C39.6 33.4 43.6 35.6 49 37.2" />
          <path d="M25.5 31.5 L31 29.4 M27.5 36.2 L33.2 34" />
        </symbol>
        <symbol id="pv-kurtka" viewBox="0 0 64 64">
          <path d="M32 12.5 C27 12.5 24 15 23 19 L14.5 23.8 L17.6 31 L21.5 28.4 L21.5 49.5 L42.5 49.5 L42.5 28.4 L46.4 31 L49.5 23.8 L41 19 C40 15 37 12.5 32 12.5 Z" />
          <path d="M32 20 L32 49.5" />
          <path d="M26.5 18.6 C27.5 15.4 36.5 15.4 37.5 18.6" />
        </symbol>
        <symbol id="pv-kask" viewBox="0 0 64 64">
          <path d="M11.5 37 C11.5 24 21 15.5 32.5 15.5 C44 15.5 52.5 24 52.5 33.5 C52.5 36.5 50.8 38 47.8 38.2 L15.8 40 C13 40.2 11.5 39.2 11.5 37 Z" />
          <path d="M24.4 19.6 C22.4 23.8 21.4 28.6 21.4 33.6 M33.4 17.4 C31.4 22.2 30.4 27.4 30.4 33" />
          <path d="M20.5 40.6 L24 46.5" />
        </symbol>
        <symbol id="pv-odziez" viewBox="0 0 64 64">
          <path d="M15 30 L49 30 L49 45 C49 48 47 50 44 50 L20 50 C17 50 15 48 15 45 Z" />
          <path d="M17.5 30 C17.5 25 19.6 22 24.4 22 L39.6 22 C44.4 22 46.5 25 46.5 30" />
          <path d="M15 38 L49 38 M40.5 22 L46.5 30" />
        </symbol>
        <symbol id="pv-plytka" viewBox="0 0 64 64">
          <path d="M12.5 40 L28.5 23 L52 23 L36 40 Z" />
          <path d="M12.5 40 L12.5 44.5 L36 44.5 L36 40 M36 44.5 L52 27.5 L52 23" />
        </symbol>
      </defs>
    </svg>
  );
}

export function ProductVisual({
  kind,
  tint,
  size = 44,
  className = "",
}: {
  kind: ProductKind;
  tint?: "blue" | "graphite";
  size?: number;
  className?: string;
}) {
  const t = tint ?? KIND_TINT[kind];
  const base =
    t === "blue" ? "color-mix(in srgb, var(--blue-500) 18%, var(--bg-card))" : "var(--bg-elevated)";
  const stroke = t === "blue" ? "var(--blue-300)" : "var(--text-secondary)";

  return (
    <span
      aria-hidden="true"
      className={`relative block shrink-0 select-none overflow-hidden rounded-[10px] ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" className="block h-full w-full">
        <rect width="64" height="64" fill={base} />
        <rect width="64" height="64" fill="url(#pv-shade)" />
        <use
          href={`#pv-${kind}`}
          fill="none"
          stroke={stroke}
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.92"
        />
        <rect width="64" height="64" fill="url(#pv-light)" />
        <rect width="64" height="64" fill="url(#pv-vig)" />
      </svg>
      <span className="pv-noise absolute inset-0" />
    </span>
  );
}
