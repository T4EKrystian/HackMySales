"use client";

import { useRef } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { gsap, useGSAP, useReveal, typeInto, DESKTOP_MOTION, MOBILE_MOTION } from "@/lib/motion";
import { fmtIntPl } from "@/lib/typography";

/** Trzy kroki v3 (motion.md §3): horizontal pin — panele jadą poziomo scrubem,
 *  linia postępu z węzłami 01→03. Wizuale zamiast ikon: snippet wkleja się sam,
 *  skan katalogu odhacza produkty, pierwszy raport z liczbą.
 *  Mobile: pion ze sticky progress-line. Reduced: statycznie. */

function SnippetDemo() {
  const d = pl.how.demos;
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <p className="num text-xs leading-relaxed text-sub">
        <span className="how-code block" data-full={d.snippet}>
          {d.snippet}
        </span>
        <span className="how-code block" data-full={d.snippet2}>
          {d.snippet2}
        </span>
      </p>
      <p className="how-code-ok num mt-4 inline-flex items-center gap-1.5 rounded-full bg-blue-tint px-3 py-1 text-xs text-blue-soft">
        {d.snippetOk}
      </p>
    </div>
  );
}

function ScanDemo() {
  const d = pl.how.demos;
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <p className="label mb-3">{d.scanLabel}</p>
      <ul className="flex flex-col gap-2">
        {d.scanItems.map((name) => (
          <li key={name} className="how-scan-row flex items-center justify-between gap-3 text-xs text-sub">
            <span className="truncate">{name}</span>
            <Glyph name="check" size={12} className="how-scan-check shrink-0 text-ok" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReportDemo() {
  const d = pl.how.demos;
  const m = pl.goldMines.nightMail;
  const kpi = pl.morning.kpis[0];
  return (
    <div className="how-report rounded-xl border border-hairline bg-surface p-5">
      <p className="text-xs text-mute">
        {m.fromLabel}: <span className="text-sub">{m.from}</span>
      </p>
      <p className="mt-1 text-xs text-mute">
        {m.subjectLabel}: <span className="font-medium text-ink">{m.subject}</span>
      </p>
      <div className="mt-4 border-t border-hairline pt-4">
        <p className="text-xs text-mute">{d.reportKpi}</p>
        <p className="num mt-1 text-2xl font-bold tracking-tight text-ink">{fmtIntPl(kpi.value)} zł</p>
      </div>
    </div>
  );
}

const DEMOS = [SnippetDemo, ScanDemo, ReportDemo];

export function HowItWorks() {
  const t = pl.how;
  const scope = useRef<HTMLElement>(null);
  const headRef = useReveal<HTMLDivElement>();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      const animatePanelContent = (tl: gsap.core.Timeline, panel: HTMLElement, at: number) => {
        const q = gsap.utils.selector(panel);
        const codes = q<HTMLElement>(".how-code");
        const codeOk = q<HTMLElement>(".how-code-ok")[0];
        const rows = q<HTMLElement>(".how-scan-row");
        const report = q<HTMLElement>(".how-report")[0];

        if (codes.length) {
          const sub = gsap.timeline();
          codes.forEach((c) => typeInto(sub, c, { speed: 0.02, max: 1.0 }));
          tl.add(sub, at);
          if (codeOk) tl.fromTo(codeOk, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.3 }, at + 1.6);
        }
        if (rows.length) {
          tl.fromTo(rows, { autoAlpha: 0, x: 16 }, { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.12 }, at);
          tl.fromTo(
            q<HTMLElement>(".how-scan-check"),
            { scale: 0, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.25, stagger: 0.12, ease: "back.out(2)" },
            at + 0.25
          );
        }
        if (report) {
          tl.fromTo(report, { autoAlpha: 0, y: 14, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5 }, at);
        }
      };

      mm.add(DESKTOP_MOTION, () => {
        const stage = root.querySelector<HTMLElement>(".how-stage");
        const track = root.querySelector<HTMLElement>(".how-track");
        const panels = gsap.utils.toArray<HTMLElement>(".how-panel", root);
        const fill = root.querySelector<HTMLElement>(".how-progress-fill");
        const dots = gsap.utils.toArray<HTMLElement>(".how-progress-dot", root);
        if (!stage || !track || panels.length < 3) return;

        // Krok 01: treść gra RAZ, time-based, przy wejściu w pin — stan spoczynku s0
        // (snap!) to KOMPLETNA karta. Scrub-bound start zostawiał na snapie pustą ramkę,
        // a chip „zainstalowano" (at+1.6) wypadał, gdy panel 01 już wyjeżdżał.
        const p0 = gsap.timeline({ paused: true });
        gsap.set(panels[0].querySelectorAll(".how-code-ok"), { autoAlpha: 0 });
        animatePanelContent(p0, panels[0], 0);
        let p0played = false;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            pin: true,
            start: "top top",
            invalidateOnRefresh: true,
            end: "+=280%",
            scrub: 0.8,
            snap: { snapTo: "labels", duration: 0.4, ease: "power2.inOut" },
            onToggle(self) {
              if (self.isActive && !p0played) {
                p0played = true;
                p0.play();
              }
            },
            onUpdate(self) {
              const idx = Math.min(2, Math.floor(self.progress * 3));
              dots.forEach((d, i) => d.setAttribute("data-active", String(i <= idx)));
            },
          },
        });

        tl.to(track, { xPercent: -66.666, duration: 3 }, 0);
        if (fill) tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 3, transformOrigin: "left" }, 0);
        // Kroki 02/03: okna scrubu domknięte PRZED etykietą spoczynku (s1=1.5, s2=3) —
        // na snapie karta zawsze pełna, nigdy w połowie odsłonięta.
        animatePanelContent(tl, panels[1], 0.7);
        animatePanelContent(tl, panels[2], 2.3);
        // stany krok 1/2/3 = track w pozycjach 0 / −33% / −66% (spójnie z dawnym snapTo [0,.5,1])
        tl.addLabel("s0", 0).addLabel("s1", 1.5).addLabel("s2", 3);
      });

      mm.add(MOBILE_MOTION, () => {
        const blocks = gsap.utils.toArray<HTMLElement>(".how-block-m", root);
        blocks.forEach((el) => {
          gsap.set(el.querySelectorAll(".how-code-ok, .how-scan-row, .how-report"), { autoAlpha: 0 });
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 75%", once: true } });
          animatePanelContent(tl, el, 0);
        });
      });
    },
    { scope }
  );

  const StepText = ({ i }: { i: number }) => (
    <>
      <span className="num inline-flex h-10 items-center rounded-full border border-strongline bg-card px-4 text-sm text-blue-soft">
        0{i + 1}
      </span>
      <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink">{t.steps[i].title}</h3>
      <p className="mt-2 max-w-[40ch] text-sm leading-relaxed text-sub">{t.steps[i].body}</p>
    </>
  );

  return (
    <section ref={scope} data-ambient="kroki" className="bg-surface">
      {/* JEDEN wspólny header nad wariantami (v5: koniec z duchami H2 w DOM) */}
      <Container className="pt-14 md:pt-28">
        <div ref={headRef}>
          <SectionLabel num="07">{t.label}</SectionLabel>
          <SectionH2>{t.h2}</SectionH2>
        </div>
      </Container>

      {/* Desktop: horizontal pin */}
      <div className="hidden md:block motion-reduce:md:hidden">
        <div className="how-stage flex h-svh flex-col overflow-hidden">
          <div className="relative mt-6 flex-1">
            <div className="how-track flex h-full w-[300%]">
              {t.steps.map((_, i) => {
                const Demo = DEMOS[i];
                return (
                  <div key={i} className="how-panel w-1/3">
                    <Container className="grid h-full items-center gap-10 pb-16 lg:grid-cols-[1fr_1fr]">
                      <div>
                        <StepText i={i} />
                      </div>
                      <div className="max-w-[420px]">
                        <Demo />
                      </div>
                    </Container>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Linia postępu z węzłami */}
          <Container className="w-full pb-14">
            <div className="relative h-px bg-hairline">
              <div className="how-progress-fill absolute inset-0 origin-left bg-blue" style={{ transform: "scaleX(0)" }} />
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  data-active={i === 0 ? "true" : "false"}
                  className="how-progress-dot num absolute top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-strongline bg-surface text-[13px] md:text-[10px] text-mute transition-colors duration-300 data-[active=true]:border-blue data-[active=true]:text-blue-soft"
                  style={{ left: `${i * 50}%`, transform: `translate(-${i * 50}%, -50%)` }}
                >
                  0{i + 1}
                </span>
              ))}
            </div>
            <p className="mt-8 text-sm text-mute">{t.note}</p>
          </Container>
        </div>
      </div>

      {/* Mobile + reduced: pion ze sticky progress-line */}
      <div className="pb-14 md:hidden motion-reduce:md:block">
        <Container>
          <div className="relative mt-12 border-l border-hairline pl-7">
            <div className="flex flex-col gap-16">
              {t.steps.map((_, i) => {
                const Demo = DEMOS[i];
                return (
                  <div key={i} className="how-block-m relative">
                    <span className="absolute -left-[33px] top-1 h-3 w-3 rounded-full border-2 border-blue bg-surface" aria-hidden="true" />
                    <StepText i={i} />
                    <div className="mt-5 max-w-[420px]">
                      <Demo />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="mt-12 text-sm text-mute">{t.note}</p>
        </Container>
      </div>
    </section>
  );
}
