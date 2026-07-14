"use client";

import { useState } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { Container, SectionH2 } from "@/components/ui/Section";
import { PlatformLogo } from "@/components/ui/PlatformLogo";
import { useReveal } from "@/lib/motion";
import { motion } from "motion/react";

/** Integracje v3 (copy §7 + §7c): dwa przeciwbieżne marquee logotypów — od v5
 *  realne monochromatyczne symbole (simple-icons) + wordmarki PL platform
 *  (pauza na hover) + lokalny finder platformy z fuzzy-matchem.
 *  Nic nie wysyłamy — odpowiedzi wyprowadzone z FAQ. */

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

function lev(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (!m || !n) return Math.max(m, n);
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

function MarqueeRow({ items, reverse }: { items: readonly string[]; reverse?: boolean }) {
  return (
    <div className="ticker border-y border-hairline py-5" aria-hidden={reverse ? "true" : undefined}>
      <div className={reverse ? "ticker-track-rev" : "ticker-track"}>
        {[0, 1].map((clone) => (
          <ul key={clone} aria-hidden={clone === 1 || undefined} className="flex shrink-0 items-center gap-14 pr-14">
            {items.map((p) => (
              <li
                key={p}
                className="text-xl text-mute transition-colors duration-200 hover:text-blue-soft md:text-2xl"
              >
                <PlatformLogo name={p} iconSize={24} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function Integrations() {
  const t = pl.integrations;
  const ref = useReveal<HTMLElement>(0.05);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ hit?: string; miss?: boolean } | null>(null);

  const check = (raw: string) => {
    const q = norm(raw);
    if (q.length < 2) {
      setResult(null);
      return;
    }
    const hit = t.platforms.find((p) => {
      const np = norm(p);
      return np.includes(q) || q.includes(np) || lev(np, q) <= 2;
    });
    setResult(hit ? { hit } : { miss: true });
  };

  return (
    <section ref={ref} data-ambient="integracje" className="section-pad-tight bg-surface">
      <Container>
        <SectionH2 className="mt-0 max-w-[22ch]">{t.h2}</SectionH2>
      </Container>

      {/* Jeden pas logotypów z narracją (H2) — anti-slop: bez dual-marquee */}
      <div className="js-reveal mt-12">
        <MarqueeRow items={t.platforms} />
      </div>

      <Container>
        {/* Finder platformy (§7c) — lokalny, natychmiastowy */}
        <div className="js-reveal mx-auto mt-12 max-w-[520px]">
          <label htmlFor="platform-finder" className="label">
            {t.finder.label}
          </label>
          <input
            id="platform-finder"
            type="text"
            value={query}
            placeholder={t.finder.placeholder}
            onChange={(e) => {
              setQuery(e.target.value);
              check(e.target.value);
            }}
            className="mt-3 w-full rounded-full border border-hairline bg-field px-5 py-3.5 text-sm text-ink placeholder:text-mute focus:border-strongline"
            autoComplete="off"
          />
          <p role="status" aria-live="polite" className="mt-3 min-h-[1.75rem] text-sm">
            {result?.hit && (
              // wynik wjeżdża springiem (Motion — podział ról wg motion-craft)
              <motion.span
                key={result.hit}
                initial={{ opacity: 0, y: 8, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
                className="flex items-center gap-2 text-blue-soft"
              >
                <Glyph name="check" size={15} />
                <span>
                  <span className="font-medium text-ink">{result.hit}</span> {t.finder.hit}
                </span>
              </motion.span>
            )}
            {result?.miss && (
              <motion.span
                key="miss"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="block text-sub"
              >
                {t.finder.miss}
              </motion.span>
            )}
          </p>
        </div>

        <p className="js-reveal mx-auto mt-8 max-w-[75ch] text-center text-sm leading-relaxed text-mute">{t.note}</p>
      </Container>
    </section>
  );
}
