"use client";

import { pl } from "@/content/pl";
import { useReveal } from "@/lib/motion";

/** Pasek zaufania — statyczny, typograficzny (dojrzalej niż marquee przy 6 nazwach).
 *  [PLACEHOLDER] logotypy klientów — sekcja na nie zostaje ukryta, dopóki ich nie ma. */
export function TrustBar() {
  const ref = useReveal<HTMLDivElement>(0.06);
  const t = pl.trustBar;

  return (
    <div ref={ref} className="border-y border-hairline bg-surface">
      <div className="container-hms flex flex-col items-center gap-5 py-10 md:flex-row md:justify-between">
        <p className="js-reveal text-sm text-mute">{t.line}</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {t.platforms.map((p) => (
            <li key={p} className="js-reveal num text-sm tracking-wide text-sub">
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
