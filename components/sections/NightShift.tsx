"use client";

/** „Nocna Zmiana" (richness R1) — sygnaturowy ciemny akt: sklep śpi, bot sprzedaje.
 *  Zegar 22:41→08:00, nocne zdarzenia (feed §1b) rozwiązują się w ciemności, licznik
 *  przychodu rośnie niebiesko na czerni; o świcie ciemne niebo znika i suma nocy wali
 *  w skali. Dramatyzuje obietnicę hero „nigdy nie śpi". Kolory z tokenów ([data-theme=dark]
 *  = Apple-dark); JS animuje TYLKO opacity/transform (zero hexów, design-qa clean).
 *  Reduced-motion / mobile: statyczna klatka świtu, bez pinu. */

import { useRef } from "react";
import { pl } from "@/content/pl";
import { demo } from "@/content/demo-data";
import { fmtIntPl } from "@/lib/typography";
import { gsap, useGSAP } from "@/lib/motion";

// Gwiazdy — deterministycznie (seeded LCG → brak hydration-mismatch)
function makeStars(n: number) {
  let s = 20260714;
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) % 1000) / 1000;
  return Array.from({ length: n }, (_, i) => ({
    x: rnd() * 100,
    y: rnd() * 100,
    sz: 0.6 + rnd() * 1.8,
    o: 0.22 + rnd() * 0.5,
    tw: 2 + Math.floor(rnd() * 4),
    blue: i % 5 === 0,
  }));
}
const STARS = makeStars(90);
const NIGHT = pl.proofTicker.items.slice(0, 6); // 22:41 … 03:47
const TOTAL = demo.night.sale;

export function NightShift() {
  const scope = useRef<HTMLElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const moneyRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Pin/cinematyka TYLKO desktop + motion (CLAUDE.md: mobile bez pinów).
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const setClock = (mins: number) => {
          const h = Math.floor(mins / 60) % 24;
          const m = Math.floor(mins % 60);
          if (clockRef.current) clockRef.current.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        };
        const clock = { v: 22 * 60 + 41 };
        const money = { v: 0 };
        gsap.set(".nz-event", { opacity: 0, y: 22 });
        gsap.set(".nz-stat", { opacity: 0, y: 14 });
        gsap.set(".nz-dawn", { opacity: 0, scale: 0.97, y: 20 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: "+=150%",
            scrub: 0.6,
            pin: ".nz-stage",
            pinSpacing: true,
          },
        });
        tl.to(clock, { v: 22 * 60 + 41 + 559, duration: 6, ease: "none", onUpdate: () => setClock(clock.v) }, 0);
        tl.to(money, { v: TOTAL, duration: 5, ease: "none", onUpdate: () => { if (moneyRef.current) moneyRef.current.textContent = fmtIntPl(Math.round(money.v)); } }, 0.4);
        NIGHT.forEach((_, i) => tl.to(`.nz-event-${i}`, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, 0.3 + i * 0.72));
        gsap.utils.toArray<HTMLElement>(".nz-stat").forEach((el, i) => tl.to(el, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, 4.6 + i * 0.25));
        // ŚWIT — ciemne niebo znika (odsłania jasny payoff pod spodem), payoff wjeżdża
        tl.to(".nz-sky", { opacity: 0, duration: 1.1, ease: "power2.inOut" }, 5.5);
        tl.to(".nz-dawn", { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "expo.out" }, 5.9);

        return () => tl.scrollTrigger?.kill();
      });
    },
    { scope }
  );

  return (
    <section ref={scope} aria-label="Nocna zmiana — bot sprzedaje, gdy śpisz" className="relative bg-page motion-safe:md:h-[250vh]">
      <div className="nz-stage relative flex min-h-[80vh] items-center overflow-hidden bg-page py-20 motion-safe:md:sticky motion-safe:md:top-0 motion-safe:md:h-svh motion-safe:md:min-h-0 motion-safe:md:py-0">
        {/* PAYOFF świtu (jasny, pod niebem — odsłaniany gdy niebo znika) */}
        <div className="nz-dawn container-hms pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 text-center motion-safe:md:block motion-safe:md:opacity-0">
          <p className="label">08:00</p>
          <h2 className="t-h2 mt-3 font-display font-semibold text-ink">{pl.results.night.title}</h2>
          <p className="num mt-6 font-semibold leading-none tracking-tight text-blue" style={{ fontSize: "clamp(4rem,11vw,9rem)" }}>
            {fmtIntPl(TOTAL)}
            <span style={{ fontSize: "0.4em" }}> zł</span>
          </p>
          <p className="t-lead mt-4 text-mute">
            {fmtIntPl(demo.night.convos)} rozmów obsłużonych · {fmtIntPl(demo.night.tickets)} ticketów mniej — {pl.results.night.caption}
          </p>
        </div>

        {/* NIEBO nocy — pasmo LEŚNE (tentpole środka strony), znika o świcie */}
        <div className="nz-sky absolute inset-0 flex items-center overflow-hidden bg-forest-950 text-onforest">
          <div className="noise-forest" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {STARS.map((s, i) => (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.sz,
                  height: s.sz,
                  background: s.blue ? "var(--acid)" : "var(--sage-200)",
                  opacity: s.o,
                  boxShadow: s.blue ? "0 0 6px var(--acid)" : "none",
                  animation: `nz-tw ${s.tw}s ease-in-out ${i % 5}s infinite`,
                }}
              />
            ))}
          </div>

          <div className="container-hms relative grid w-full items-center gap-12 lg:grid-cols-2">
            {/* zegar + zdarzenia */}
            <div>
              <p className="text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-onforest/55">CZAT AI · NOC</p>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span ref={clockRef} className="num font-semibold tracking-tight text-onforest" style={{ fontSize: "clamp(3rem,7vw,5.5rem)" }}>
                  08:00
                </span>
                <span className="t-h3 font-display font-semibold text-onforest/65">sklep śpi. bot sprzedaje.</span>
              </div>
              <ul className="mt-10 flex flex-col gap-3">
                {NIGHT.map((ev, i) => (
                  <li key={i} className={`nz-event nz-event-${i} num flex items-center gap-3 text-sm text-onforest/75`}>
                    <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-acid" style={{ boxShadow: "0 0 8px color-mix(in srgb, var(--acid) 45%, transparent)" }} />
                    {ev}
                  </li>
                ))}
              </ul>
            </div>

            {/* licznik przychodu — kwasowo na lesie (przychód rośnie w skali) */}
            <div className="text-center lg:text-left">
              <p className="text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-onforest/55">PRZYCHÓD Z NOCY — NARASTAJĄCO</p>
              <p className="num mt-3 whitespace-nowrap font-semibold leading-none tracking-tight text-acid" style={{ fontSize: "clamp(3.5rem,10vw,8.5rem)" }}>
                <span ref={moneyRef}>{fmtIntPl(TOTAL)}</span>
                <span className="text-onforest/70" style={{ fontSize: "0.42em" }}> zł</span>
              </p>
              <div className="mt-8 flex justify-center gap-10 lg:justify-start">
                {[
                  { v: fmtIntPl(demo.night.convos), l: "rozmowy obsłużone" },
                  { v: fmtIntPl(demo.night.tickets), l: "ticketów mniej" },
                ].map((s) => (
                  <div key={s.l} className="nz-stat">
                    <span className="num block font-semibold text-onforest" style={{ fontSize: "2rem" }}>{s.v}</span>
                    <span className="mt-1 block text-[0.8125rem] uppercase tracking-[0.14em] text-onforest/55">{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes nz-tw{0%,100%{opacity:.22}50%{opacity:.85}}`}</style>
    </section>
  );
}
