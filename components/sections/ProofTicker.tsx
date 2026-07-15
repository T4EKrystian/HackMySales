"use client";

import { pl } from "@/content/pl";
import { PlatformLogo } from "@/components/ui/PlatformLogo";
import { useReveal } from "@/lib/motion";

/** Proof ticker (features §L16, copy §1b): feed nocy jako marquee + scalona linia
 *  zaufania z platformami. Jeden pas pod hero zamiast dwóch. Reduced-motion:
 *  statyczna lista pierwszych wpisów (CSS w globals). */
export function ProofTicker() {
  const ref = useReveal<HTMLDivElement>(0.06);
  const t = pl.proofTicker;
  const trust = pl.trustBar;

  return (
    <div ref={ref} className="border-y border-hairline bg-page">
      {/* Feed nocy */}
      <div className="ticker js-reveal border-b border-hairline py-3.5" aria-label={t.caption}>
        <div className="ticker-track">
          {[false, true].map((clone) => (
            <ul key={String(clone)} aria-hidden={clone} className="flex shrink-0 items-center gap-10">
              {t.items.map((item, i) => (
                <li key={i} className="num flex items-center gap-3 whitespace-nowrap text-[13px] text-sub">
                  <span className="inline-block h-1 w-1 rounded-full bg-forest-700" aria-hidden="true" />
                  {item}
                </li>
              ))}
              <li className="label whitespace-nowrap">{t.caption}</li>
            </ul>
          ))}
        </div>
      </div>

      {/* Linia zaufania (dawny TrustBar — copy §1) */}
      <div className="container-hms flex flex-col items-center gap-4 py-5 md:flex-row md:justify-between">
        <p className="js-reveal text-sm text-mute">{trust.line}</p>
        {/* v5: realne monochromatyczne loga (nominative use) — 55%→100% na hover */}
        <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
          {trust.platforms.map((p) => (
            <li
              key={p}
              className="js-reveal text-[13px] text-sub opacity-55 transition-opacity duration-200 hover:opacity-100"
            >
              <PlatformLogo name={p} iconSize={15} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
