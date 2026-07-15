"use client";

import { useRef } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { gsap, useGSAP, useReveal, typeInto, NO_REDUCE, REDUCE } from "@/lib/motion";
import { fmtIntPl } from "@/lib/typography";

/** Trzy kroki (redesign): dawny horizontal-pin (3,1 ekranu, prawa połowa martwa) →
 *  pionowy timeline dwukolumnowy (węzeł + tekst | demo). Demo gra raz on-enter. Bez pinu. */

function SnippetDemo() {
  const d = pl.how.demos;
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <p className="num text-xs leading-relaxed text-sub">
        <span className="how-code block" data-full={d.snippet}>{d.snippet}</span>
        <span className="how-code block" data-full={d.snippet2}>{d.snippet2}</span>
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
      <p className="text-xs text-mute">{m.fromLabel}: <span className="text-sub">{m.from}</span></p>
      <p className="mt-1 text-xs text-mute">{m.subjectLabel}: <span className="font-medium text-ink">{m.subject}</span></p>
      <div className="mt-4 border-t border-hairline pt-4">
        <p className="text-xs text-mute">{d.reportKpi}</p>
        <p className="num mt-1 text-2xl font-semibold tracking-tight text-ink">{fmtIntPl(kpi.value)} zł</p>
      </div>
    </div>
  );
}

const DEMOS = [SnippetDemo, ScanDemo, ReportDemo];

function animatePanelContent(tl: gsap.core.Timeline, panel: HTMLElement, at: number) {
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
    tl.fromTo(q<HTMLElement>(".how-scan-check"), { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25, stagger: 0.12, ease: "back.out(2)" }, at + 0.25);
  }
  if (report) tl.fromTo(report, { autoAlpha: 0, y: 14, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5 }, at);
}

export function HowItWorks() {
  const t = pl.how;
  const scope = useRef<HTMLElement>(null);
  const headRef = useReveal<HTMLDivElement>();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        gsap.utils.toArray<HTMLElement>(".how-block-m", root).forEach((el) => {
          gsap.set(el.querySelectorAll(".how-code-ok, .how-scan-row, .how-report"), { autoAlpha: 0 });
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 75%", once: true } });
          animatePanelContent(tl, el, 0);
        });
      });
      mm.add(REDUCE, () => {
        gsap.set(root.querySelectorAll(".how-code-ok, .how-scan-row, .how-report"), { autoAlpha: 1 });
      });
    },
    { scope }
  );

  return (
    <section ref={scope} data-ambient="kroki" className="section-pad bg-page">
      <Container>
        <div ref={headRef}>
          <SectionLabel num="07">{t.label}</SectionLabel>
          <SectionH2>{t.h2}</SectionH2>
        </div>

        {/* Pionowy timeline: spina 01→03 po lewej, tekst + demo dwukolumnowo */}
        <div className="mt-14 flex flex-col">
          {t.steps.map((step, i) => {
            const Demo = DEMOS[i];
            return (
              <div
                key={i}
                className="how-block-m grid items-start gap-6 border-t border-hairline py-10 md:grid-cols-2 md:gap-16 lg:py-16"
              >
                <div className="flex gap-5">
                  <span className="num inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-strongline text-sm text-forest-700">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{step.title}</h3>
                    <p className="mt-2 max-w-[40ch] leading-relaxed text-sub">{step.body}</p>
                  </div>
                </div>
                <div className="w-full max-w-[440px] md:justify-self-end">
                  <Demo />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-10 text-sm text-mute">{t.note}</p>
      </Container>
    </section>
  );
}
