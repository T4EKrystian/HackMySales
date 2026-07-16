"use client";

import { pl } from "@/content/pl";
import { PlatformLogo } from "@/components/ui/PlatformLogo";
import { useReveal } from "@/lib/motion";

/** Proof ticker (features §L16, copy §1b): feed nocy jako marquee + scalona linia
 *  zaufania z platformami. Jeden pas pod hero zamiast dwóch. Reduced-motion:
 *  statyczna lista pierwszych wpisów (CSS w globals). */
export function ProofTicker() {
  const ref = useReveal<HTMLDivElement>(0.06, { y: 12 });
  const t = pl.proofTicker;
  const trust = pl.trustBar;

  return (
    <div ref={ref} className="border-y border-hairline">
      {/* Feed nocy — bg-page */}
      <div className="ticker js-reveal border-b border-hairline bg-page py-3.5" aria-label={t.caption}>
        <div className="ticker-track">
          {[false, true].map((clone) => (
            <ul key={String(clone)} aria-hidden={clone} className="flex shrink-0 items-center gap-10">
              {t.items.map((item, i) => (
                <li key={i} className="ledger flex items-center gap-3 whitespace-nowrap text-sub">
                  <span className="inline-block h-1 w-1 rounded-full bg-strongline" aria-hidden="true" />
                  {item}
                </li>
              ))}
              <li className="label whitespace-nowrap">{t.caption}</li>
            </ul>
          ))}
        </div>
      </div>

      {/* Linia zaufania (dawny TrustBar) — oddzielona tonalnie (paper-deep) od marquee */}
      <div className="bg-paper-deep">
        <div className="container-hms flex flex-col items-center gap-5 py-5 md:flex-row md:justify-between">
          <p className="js-reveal max-w-[40ch] text-sm text-mute md:max-w-none">{trust.line}</p>
          {/* realne monochromatyczne loga (nominative use) — siatka zbalansowana 3×2 / 6×1, bez samotnego logo */}
          <ul className="grid grid-cols-3 place-items-center gap-x-6 gap-y-3 sm:grid-cols-6 md:gap-x-7">
            {trust.platforms.map((p) => (
              <li
                key={p}
                className="js-reveal t-meta text-sub opacity-55 transition-opacity duration-200 hover:opacity-100"
              >
                <PlatformLogo name={p} iconSize={15} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
