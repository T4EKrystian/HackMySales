"use client";

import { useRef } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { Logo } from "@/components/ui/Logo";
import { type ProductKind } from "@/components/ui/ProductVisual";
import { AiBadge, PersonaAvatar } from "@/components/chat/parts";
import { ProductThumb } from "@/components/ui/ProductThumb";
import { gsap, useGSAP, useReveal, typeInto, DESKTOP_MOTION, MOBILE_MOTION } from "@/lib/motion";

/** Arena (copy §4b+§4d, motion.md §3): tabela „Różnica" jako pojedynek na 4 rundy.
 *  Pytanie klienta pisze się na środku; FAQ-bot odpowiada z opóźnieniem sztampą,
 *  HackMySales — konkretem ze scenariuszy §1/§3. Werdykty rund = wiersze tabeli 1:1,
 *  wynik bije do 0:4. Desktop: pin ~280%. Mobile: rundy pionowo, auto-play on-enter.
 *  Reduced-motion: wszystko widoczne statycznie. */

type HmsCard = { initials: string; kind?: ProductKind; name: string; tags: string; price: string; meta: string };
type Round = {
  q: string;
  faq: string;
  hms: {
    text: string;
    card?: HmsCard;
    after?: string;
    results?: ReadonlyArray<{ name: string; price: string; kind?: ProductKind }>;
    note?: string;
    badge?: string;
  };
  verdict: { left: string; right: string };
};

function buildRounds(): Round[] {
  const t = pl.comparison;
  const [sA, sB, sC] = pl.hero.chat.scenarios;
  const search = pl.pillars.demo.search;
  const botA = sA.steps[1] as { text: string; card?: HmsCard; after?: string };
  const botB = sB.steps[1] as { text: string; card?: HmsCard; after?: string };
  const botC = sC.steps[1] as { text: string };

  const hms = [
    { text: botA.text, card: botA.card, after: botA.after },
    { text: t.arena.r2Intro, results: search.results, note: search.note },
    { text: botB.text, card: botB.card, after: botB.after },
    { text: botC.text, badge: sC.badge },
  ];
  const qs = [sA.steps[0].text, search.query, sB.steps[0].text, sC.steps[0].text];

  return qs.map((q, i) => ({
    q,
    faq: t.arena.faqReplies[i],
    hms: hms[i],
    verdict: t.rows[t.arena.verdictRows[i]],
  }));
}

/* ---------- Wspólne klocki UI ---------- */

function HmsAnswer({ r }: { r: Round }) {
  return (
    // prawa strona ŻYJE przez ELEWACJĘ (L2 + line-2), nie poświatę —
    // anti-kitsch V6: budżet 1 glow/viewport (kontrast stron robi legacy-desaturacja)
    <div className="arena-hms-msg rounded-2xl rounded-bl-md border border-line-2 bg-l2 px-4 py-3 text-sm leading-relaxed text-ink [box-shadow:var(--highlight-top)]">
      <p>{r.hms.text}</p>
      {r.hms.card && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-hairline bg-card p-3">
          {r.hms.card.kind ? (
            <ProductThumb name={r.hms.card.name} kind={r.hms.card.kind} size={44} />
          ) : (
            <div aria-hidden="true" className="num flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-tint text-xs text-blue-soft">
              {r.hms.card.initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{r.hms.card.name}</p>
            <p className="truncate text-xs text-mute">{r.hms.card.tags}</p>
          </div>
          <span className="num ml-auto shrink-0 text-sm text-ink">{r.hms.card.price}</span>
        </div>
      )}
      {r.hms.results && (
        <ul className="mt-3 divide-y divide-[var(--border-hairline)] rounded-xl border border-hairline bg-card">
          {r.hms.results.map((res) => (
            <li key={res.name} className="flex items-center gap-2.5 px-3 py-2">
              {res.kind && <ProductThumb name={res.name} kind={res.kind} size={30} />}
              <span className="min-w-0 flex-1 truncate text-xs text-ink">{res.name}</span>
              <span className="num shrink-0 text-xs text-sub">{res.price}</span>
            </li>
          ))}
        </ul>
      )}
      {r.hms.after && <p className="mt-3">{r.hms.after}</p>}
      {r.hms.note && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-mute">
          <Glyph name="check" size={12} className="text-ok" />
          {r.hms.note}
        </p>
      )}
      {r.hms.badge && (
        <p className="num mt-3 inline-flex items-center gap-1.5 rounded-full border border-hairline bg-blue-tint px-3 py-1.5 text-xs text-blue-soft">
          <Glyph name="check" size={12} />
          {r.hms.badge}
        </p>
      )}
    </div>
  );
}

function VerdictChips({ r }: { r: Round }) {
  return (
    <div className="arena-verdict mt-4 grid gap-3 sm:grid-cols-2">
      <p className="flex items-start gap-2 text-xs leading-relaxed text-mute">
        <Glyph name="x" size={13} className="mt-0.5 shrink-0" />
        {r.verdict.left}
      </p>
      <p className="flex items-start gap-2 text-xs leading-relaxed text-ink">
        <Glyph name="check" size={13} className="mt-0.5 shrink-0 text-blue" />
        {r.verdict.right}
      </p>
    </div>
  );
}

/* ---------- Sekcja ---------- */

export function Comparison() {
  const t = pl.comparison;
  const scope = useRef<HTMLElement>(null);
  const headRef = useReveal<HTMLDivElement>(0.07);
  const sumRef = useReveal<HTMLDivElement>(0.07);
  const rounds = buildRounds();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      const buildRoundTl = (tl: gsap.core.Timeline, el: HTMLElement, at: number) => {
        const q = gsap.utils.selector(el);
        const question = q<HTMLElement>(".arena-q-text")[0];
        const faqMsg = q<HTMLElement>(".arena-faq-msg")[0];
        const hmsMsg = q<HTMLElement>(".arena-hms-msg")[0];
        const verdict = q<HTMLElement>(".arena-verdict")[0];

        tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, at);
        const sub = gsap.timeline();
        typeInto(sub, question, { speed: 0.022, max: 0.9 });
        tl.add(sub, at + 0.15);
        tl.fromTo(
          hmsMsg,
          { autoAlpha: 0, y: 16, scale: 0.98 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" },
          at + 1.05
        );
        // FAQ-bot celowo później i bez życia
        tl.fromTo(faqMsg, { autoAlpha: 0, y: 8 }, { autoAlpha: 0.85, y: 0, duration: 0.5, ease: "power1.out" }, at + 1.45);
        tl.fromTo(verdict, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35 }, at + 1.9);
      };

      mm.add(DESKTOP_MOTION, () => {
        const stage = root.querySelector<HTMLElement>(".arena-stage");
        const roundEls = gsap.utils.toArray<HTMLElement>(".arena-round", root);
        const scoreEl = root.querySelector<HTMLElement>(".arena-score");
        const roundNo = root.querySelector<HTMLElement>(".arena-round-no");
        if (!stage || roundEls.length < 4) return;

        // budżet ≥90vh/stan: 4 rundy × 90% = end 360% (motion-craft „Kalibracja scrubów")
        const SEG = 3.6;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            pin: true,
            start: "top top",
            invalidateOnRefresh: true,
            end: "+=360%",
            scrub: 0.8,
            snap: { snapTo: "labels", duration: 0.4, ease: "power2.inOut" },
            onUpdate(self) {
              const p = self.progress;
              const done = Math.min(4, Math.floor((p + 0.06) / 0.25));
              if (scoreEl) scoreEl.textContent = `0 : ${done}`;
              if (roundNo) roundNo.textContent = `${Math.min(4, Math.floor(p * 4) + 1)}/4`;
            },
          },
        });

        tl.addLabel("start", 0);
        roundEls.forEach((el, i) => {
          const at = i * SEG;
          buildRoundTl(tl, el, at);
          // snap w środek pełnej ekspozycji rundy (werdykt osiadł w at+2.25)
          tl.addLabel(`round${i}`, at + 2.6);
          if (i < roundEls.length - 1) {
            tl.to(el, { autoAlpha: 0, y: -12, duration: 0.3, ease: "power1.in" }, at + SEG - 0.25);
          }
        });
        // ogon do pełnych 4×SEG — rundy zajmują RÓWNE ćwiartki progresu (licznik 0:4)
        const pad = 4 * SEG - tl.duration();
        if (pad > 0) tl.to({}, { duration: pad });
        tl.addLabel("end", 4 * SEG);
      });

      mm.add(MOBILE_MOTION, () => {
        const blocks = gsap.utils.toArray<HTMLElement>(".arena-round-m", root);
        blocks.forEach((el) => {
          gsap.set(el.querySelectorAll(".arena-faq-msg, .arena-hms-msg, .arena-verdict"), { autoAlpha: 0 });
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: "top 75%", once: true },
          });
          buildRoundTl(tl, el, 0);
        });
      });
    },
    { scope }
  );

  const Scoreboard = (
    <div className="flex items-center justify-center gap-6">
      <span className="text-sm font-medium text-mute">{t.colLeft}</span>
      <span className="arena-score num rounded-xl border border-hairline bg-card px-5 py-2 text-2xl font-bold tracking-tight text-ink">
        0 : 0
      </span>
      <span className="flex items-center gap-2 text-sm font-medium text-ink">
        <Logo withWord={false} markSize={16} />
        {t.colRight}
      </span>
    </div>
  );

  const RoundContent = ({ r, mobile = false }: { r: Round; mobile?: boolean }) => (
    <div className={mobile ? "" : "flex h-full flex-col justify-center"}>
      {/* Pytanie klienta — na środku */}
      <div className="mx-auto w-fit max-w-[90%] rounded-2xl rounded-br-md bg-blue px-4 py-3 text-sm leading-relaxed text-onblue">
        <span className="arena-q-text" data-full={r.q}>
          {r.q}
        </span>
      </div>
      {/* Dwie odpowiedzi */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 md:gap-8">
        <div className="min-w-0">
          <p className="label mb-3 flex items-center gap-2">
            {t.arena.faqName}
            {/* v5: skin legacy — wersja bota z metryczką (deck §1c) */}
            <span className="num rounded-[4px] border border-line-1 px-1.5 py-px text-[9px]">{pl.chatUi.legacyName}</span>
          </p>
          {/* poziom 0 + desaturacja + systemowy font — strona celowo martwa (skin legacy v5) */}
          <div className="arena-faq-msg chat-legacy-font rounded-[6px] rounded-bl-none border border-line-1 px-4 py-3 text-sm leading-relaxed text-sub opacity-85 saturate-[.6]">
            {r.faq}
          </div>
        </div>
        <div className="min-w-0">
          {/* v5: prawa strona = persona Magda (skin onsite) */}
          <p className="label mb-3 flex items-center gap-2 text-blue-soft">
            <PersonaAvatar size={16} />
            {pl.hero.chat.persona.name}
            <AiBadge />
          </p>
          <HmsAnswer r={r} />
        </div>
      </div>
      <VerdictChips r={r} />
    </div>
  );

  return (
    <section ref={scope} id="roznica" className="section-pad relative">
      <Container className="max-w-[980px]">
        <div ref={headRef}>
          <SectionLabel num="04">{t.label}</SectionLabel>
          <SectionH2 className="max-w-[24ch]">{t.h2}</SectionH2>
        </div>
      </Container>

      {/* Desktop: pinowana arena */}
      <div className="hidden md:block motion-reduce:md:hidden">
        <div className="arena-stage flex h-svh flex-col">
          <Container className="flex w-full max-w-[980px] flex-1 flex-col justify-center">
            <div className="mb-4 flex items-center justify-between">
              <span className="label">
                {t.arena.roundLabel} <span className="arena-round-no num text-blue-soft">1/4</span>
              </span>
            </div>
            {Scoreboard}
            <div className="relative mt-10 min-h-[420px]">
              {rounds.map((r, i) => (
                <div key={i} className="arena-round absolute inset-0" style={{ opacity: i === 0 ? undefined : 0 }}>
                  <RoundContent r={r} />
                </div>
              ))}
            </div>
          </Container>
        </div>
      </div>

      {/* Mobile + reduced-motion: rundy pionowo */}
      <Container className="mt-10 flex max-w-[980px] flex-col gap-10 md:hidden motion-reduce:md:flex">
        {rounds.map((r, i) => (
          <div key={i} className="arena-round-m">
            <p className="label mb-5">
              {t.arena.roundLabel} <span className="num text-blue-soft">{i + 1}/4</span>
            </p>
            <RoundContent r={r} mobile />
          </div>
        ))}
        <div className="flex justify-center md:hidden motion-reduce:md:flex">{Scoreboard}</div>
      </Container>

      {/* Podsumowanie: pozostałe wiersze tabeli + dopisek */}
      <Container className="mt-16 max-w-[980px]">
        <div ref={sumRef} className="grid gap-3">
          {t.arena.summaryRows.map((idx) => (
            <div key={idx} className="js-reveal grid gap-3 border-t border-hairline pt-4 sm:grid-cols-2 sm:gap-8">
              <p className="flex items-start gap-2 text-sm leading-relaxed text-mute">
                <Glyph name="x" size={14} className="mt-0.5 shrink-0" />
                {t.rows[idx].left}
              </p>
              <p className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                <Glyph name="check" size={14} className="mt-0.5 shrink-0 text-blue" />
                {t.rows[idx].right}
              </p>
            </div>
          ))}
        </div>
        <p className="js-reveal mt-10 text-sm text-mute">{t.footer}</p>
      </Container>
    </section>
  );
}
