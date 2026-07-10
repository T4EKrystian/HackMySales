"use client";

import { useRef, useState } from "react";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { Glyph } from "@/components/ui/Glyph";
import { Logo } from "@/components/ui/Logo";
import { ChatShell } from "@/components/chat/ChatShell";
import { scenarioToScript, type ChatScript } from "@/components/chat/script";
import { gsap, useGSAP, useReveal, DESKTOP_MOTION, EASE } from "@/lib/motion";
import { useGLView } from "@/lib/glRegistry";

/** Kanały (copy §4e, features/motion v3 + v5): centralny mini-rdzeń + beams SVG.
 *  v5: klik nodu / taba przełącza switcher pod diagramem — TA SAMA rozmowa (§1 scenariusz A)
 *  w 4 skinach ChatShell (onsite/messenger/instagram/email); pulsy płyną do aktywnego kanału.
 *  Hover/focus na kanale → przykładowa wymiana (na mobile widoczna na stałe).
 *  Treści wymian 1:1 z §1/§3c/§4 — zero nowych obietnic. */

type Exchange = { user?: string; bot: string };

function nodeExchanges(): Record<string, Exchange> {
  const sA = pl.hero.chat.scenarios[0];
  const moda = pl.forWho.segments[0];
  const b2b = pl.forWho.segments[3];
  return {
    www: { user: sA.steps[0].text, bot: sA.steps[1].text },
    messenger: { user: moda.user, bot: moda.bot },
    instagram: { user: b2b.user, bot: b2b.bot },
    email: { bot: pl.goldMines.nightMail.lines[0] },
  };
}

const NODE_SKINS = ["onsite", "messenger", "instagram", "email"] as const;

/** E-mail = wątek: temat z pytania klienta, odpowiedź Magdy jako punkty raportowe. */
function emailScript(base: ChatScript): ChatScript {
  return {
    key: `${base.key}-email`,
    steps: base.steps
      .filter((s) => s.role === "bot")
      .flatMap((s) => {
        const lines = [{ role: "bot" as const, text: s.text }];
        if (s.card) lines.push({ role: "bot" as const, text: `${s.card.name} — ${s.card.price}` });
        if (s.after) lines.push({ role: "bot" as const, text: s.after });
        return lines;
      }),
  };
}

export function Channels() {
  const t = pl.channels;
  const scope = useRef<HTMLElement>(null);
  const headRef = useReveal<HTMLDivElement>(0.08);
  const { ref: coreRef } = useGLView("channels-core", "mini");
  const exchanges = nodeExchanges();
  const [activeCh, setActiveCh] = useState(0);
  const scriptA = scenarioToScript(pl.hero.chat.scenarios[0]);
  const nightMail = pl.goldMines.nightMail;

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const net = root.querySelector<HTMLElement>(".ch-net");
      const centerEl = root.querySelector<HTMLElement>(".ch-center");
      const nodes = gsap.utils.toArray<HTMLElement>(".ch-node", root);
      const paths = gsap.utils.toArray<SVGPathElement>(".ch-beam", root);
      const pulses = gsap.utils.toArray<SVGPathElement>(".ch-pulse", root);
      if (!net || !centerEl || paths.length < 4) return;

      // Geometria beams — liczona z realnych pozycji kart (odporna na RWD)
      const layout = () => {
        const nb = net.getBoundingClientRect();
        const cb = centerEl.getBoundingClientRect();
        const cx = cb.left - nb.left + cb.width / 2;
        const cy = cb.top - nb.top + cb.height / 2;
        nodes.forEach((node, i) => {
          const r = node.getBoundingClientRect();
          const leftSide = r.left + r.width / 2 < cb.left;
          const nx = leftSide ? r.right - nb.left : r.left - nb.left;
          const ny = r.top - nb.top + r.height / 2;
          const midX = (cx + nx) / 2;
          const d = `M ${cx} ${cy} C ${midX} ${cy}, ${midX} ${ny}, ${nx} ${ny}`;
          paths[i]?.setAttribute("d", d);
          pulses[i]?.setAttribute("d", d);
        });
      };
      layout();
      const ro = new ResizeObserver(layout);
      ro.observe(net);

      const mm = gsap.matchMedia();
      mm.add(DESKTOP_MOTION, () => {
        gsap.fromTo(
          paths,
          { drawSVG: "50% 50%" },
          {
            drawSVG: "0% 100%",
            duration: 1.1,
            ease: EASE.inOut,
            stagger: 0.12,
            scrollTrigger: { trigger: net, start: "top 75%", once: true },
          }
        );
        pulses.forEach((p, i) => {
          gsap.set(p, { strokeDasharray: "10 150", strokeDashoffset: 160 });
          gsap.to(p, {
            strokeDashoffset: 0,
            duration: 2.6,
            ease: "none",
            repeat: -1,
            delay: 0.8 + i * 0.55,
            scrollTrigger: { trigger: net, start: "top 75%", once: true },
          });
        });
      });

      return () => ro.disconnect();
    },
    { scope }
  );

  // v5: pulsy „płyną do aktywnego kanału" — nieaktywne przygasają
  useGSAP(
    () => {
      const pulses = gsap.utils.toArray<SVGPathElement>(".ch-pulse", scope.current);
      pulses.forEach((p, i) => {
        gsap.to(p, { opacity: i === activeCh ? 0.95 : 0.15, duration: 0.4, ease: EASE.soft });
      });
    },
    { scope, dependencies: [activeCh] }
  );

  const GLYPHS: Record<string, "www" | "messenger" | "instagram" | "mail"> = {
    www: "www",
    messenger: "messenger",
    instagram: "instagram",
    email: "mail",
  };

  const NodeCard = ({ nodeKey, name, idx, orbit = "" }: { nodeKey: string; name: string; idx: number; orbit?: string }) => {
    const ex = exchanges[nodeKey];
    const isActive = idx === activeCh;
    return (
      <div
        className={`ch-node frame-hover group relative cursor-pointer rounded-2xl border bg-l1 px-5 py-3.5 transition-colors duration-200 md:rounded-full md:focus-within:z-20 ${
          isActive ? "border-blue" : "border-line-1"
        } ${orbit}`}
        onClick={() => setActiveCh(idx)}
      >
        {/* klik nodu = zmiana skina w switcherze (v5) */}
        <button
          onClick={() => setActiveCh(idx)}
          aria-pressed={isActive}
          className="flex items-center gap-3 text-sm font-medium text-ink"
        >
          <Glyph name={GLYPHS[nodeKey]} size={17} className={isActive ? "text-blue-soft" : "text-mute"} />
          {name}
        </button>
        {/* Wymiana przykładowa: mobile inline, desktop tooltip na hover/focus */}
        <div className="mt-3 flex flex-col gap-2 md:pointer-events-none md:absolute md:left-1/2 md:top-[calc(100%+10px)] md:z-10 md:mt-0 md:w-72 md:-translate-x-1/2 md:rounded-xl md:border md:border-hairline md:bg-elevated md:p-4 md:opacity-0 md:shadow-card md:transition-opacity md:duration-200 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
          {ex.user && (
            <p className="max-w-[95%] self-end rounded-xl rounded-br-sm bg-blue px-3 py-2 text-xs leading-relaxed text-onblue">
              {ex.user}
            </p>
          )}
          <p className="max-w-[95%] self-start rounded-xl rounded-bl-sm bg-card px-3 py-2 text-xs leading-relaxed text-sub md:bg-surface">
            {ex.bot}
          </p>
        </div>
      </div>
    );
  };

  // bez bg-surface — mini-rdzeń rysuje się na globalnym canvasie pod treścią
  return (
    <section ref={scope} id="kanaly" className="section-pad">
      <Container>
        <div ref={headRef}>
          <SectionLabel num="05">{t.label}</SectionLabel>
          <SectionH2 className="max-w-[24ch]">{t.h2}</SectionH2>
          <p className="js-reveal mt-5 max-w-[58ch] text-sub" style={{ fontSize: "var(--text-lead)", lineHeight: 1.6 }}>
            {t.lead}
          </p>
        </div>

        <div className="ch-net relative mt-14 grid items-center gap-5 md:grid-cols-[1fr_auto_1fr] md:gap-16">
          {/* Beams — tylko desktop */}
          <svg className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" aria-hidden="true">
            {t.nodes.map((n) => (
              <g key={n.key}>
                <path className="ch-beam" fill="none" stroke="var(--border-strong)" strokeWidth="1.25" />
                <path className="ch-pulse" fill="none" stroke="var(--blue-400)" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
              </g>
            ))}
          </svg>

          {/* satelity na łuku orbity (nie płaski rząd) — przesunięcia ku hubowi */}
          <div className="relative z-10 flex flex-col gap-5 md:gap-24">
            <NodeCard nodeKey={t.nodes[0].key} name={t.nodes[0].name} idx={0} orbit="md:translate-x-10 md:-translate-y-2" />
            <NodeCard nodeKey={t.nodes[1].key} name={t.nodes[1].name} idx={1} orbit="md:translate-x-10 md:translate-y-2" />
          </div>

          {/* Centralny węzeł: mini-rdzeń (scena `mini`) + znak */}
          <div className="ch-center relative z-10 mx-auto flex h-44 w-44 items-center justify-center">
            <div ref={coreRef} aria-hidden="true" className="pointer-events-none absolute inset-[-40%]" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-hairline bg-card/70 backdrop-blur-sm">
              <Logo withWord={false} markSize={34} />
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-5 md:gap-24">
            <NodeCard nodeKey={t.nodes[2].key} name={t.nodes[2].name} idx={2} orbit="md:-translate-x-10 md:-translate-y-2" />
            <NodeCard nodeKey={t.nodes[3].key} name={t.nodes[3].name} idx={3} orbit="md:-translate-x-10 md:translate-y-2" />
          </div>
        </div>

        {/* Switcher skinów (v5): TA SAMA rozmowa §1A w wybranym kanale */}
        <div className="mx-auto mt-14 w-full max-w-[620px]">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Wybierz kanał demo">
            {t.nodes.map((n, i) => (
              <button
                key={n.key}
                onClick={() => setActiveCh(i)}
                aria-pressed={i === activeCh}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
                  i === activeCh ? "bg-blue-tint text-blue-soft" : "text-mute hover:bg-l3 hover:text-sub"
                }`}
              >
                {n.name}
              </button>
            ))}
          </div>
          <div className="mt-4">
            {NODE_SKINS[activeCh] === "email" ? (
              <ChatShell
                key="email"
                skin="email"
                chrome="bare"
                script={emailScript(scriptA)}
                emailMeta={{
                  fromLabel: nightMail.fromLabel,
                  from: nightMail.from,
                  subjectLabel: nightMail.subjectLabel,
                  subject: scriptA.steps[0].text,
                }}
              />
            ) : (
              <ChatShell
                key={NODE_SKINS[activeCh]}
                skin={NODE_SKINS[activeCh]}
                script={scriptA}
                bodyClassName="max-h-[440px] min-h-[380px] p-5 pt-[86px]"
              />
            )}
          </div>
        </div>

        <p className="js-reveal mt-12 text-sm text-mute">{t.caption}</p>
      </Container>
    </section>
  );
}
