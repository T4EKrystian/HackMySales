"use client";

import { useRef, useState } from "react";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { CheckGlyph } from "@/components/ui/kit";
import {
  ChatPanelContent,
  SearchPanelContent,
  RecoGrid,
  buildPanelTl,
  DeviceFrame,
} from "@/components/sections/feature-panels";
import { gsap, useGSAP, useReveal, ScrollTrigger, NO_REDUCE, REDUCE } from "@/lib/motion";

/** Filary (AIDA): TRZY naprzemienne wiersze hairline w kolejności owner
 *  (Wyszukiwarka → Rekomendacje → Chat). Wyszukiwarka gra mikro-timeline on-enter;
 *  RecoGrid i czat animują się same. Panele współdzielone z hero. */

const PANELS = [SearchPanelContent, RecoGrid, ChatPanelContent];
const KINDS = ["search", "reco", "chat"] as const;

export function Pillars() {
  const t = pl.pillars;
  const scope = useRef<HTMLElement>(null);
  const headRef = useReveal<HTMLDivElement>();
  const [chatOn, setChatOn] = useState(false);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        gsap.utils.toArray<HTMLElement>(".pillar-row", root).forEach((row, i) => {
          const panel = row.querySelector<HTMLElement>(".pillar-panel");
          ScrollTrigger.create({
            trigger: row,
            start: "top 72%",
            once: true,
            onEnter: () => {
              if (KINDS[i] === "chat") setChatOn(true);
              else if (KINDS[i] === "search" && panel) buildPanelTl(panel, "search");
            },
          });
        });
      });
      mm.add(REDUCE, () => setChatOn(true));
    },
    { scope }
  );

  return (
    <section ref={scope} id="funkcje" className="section-pad bg-page">
      <Container>
        <div ref={headRef}>
          <SectionLabel>{t.label}</SectionLabel>
          <SectionH2 className="max-w-[22ch]">{t.h2}</SectionH2>
        </div>

        <div className="mt-14 flex flex-col">
          {t.items.map((item, i) => {
            const Panel = PANELS[i];
            const reverse = i % 2 === 1;
            return (
              <div
                key={i}
                className="pillar-row grid items-center gap-8 border-t border-hairline py-10 lg:grid-cols-2 lg:gap-16 lg:py-16"
              >
                <div className={reverse ? "lg:order-2" : ""}>
                  <p className="num text-xs text-forest-700">0{i + 1}</p>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">{item.title}</h3>
                  <p className="mt-3 max-w-[46ch] leading-relaxed text-sub">{item.body}</p>
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {item.caps.map((c) => (
                      <li key={c} className="flex items-center gap-2.5 text-sm text-sub">
                        <CheckGlyph className="shrink-0 text-blue-soft" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={reverse ? "lg:order-1" : ""} data-cursor-label={pl.ui.cursorDemo}>
                  <DeviceFrame label={t.panelLabels[i]}>
                    {KINDS[i] === "chat" ? (
                      <ChatPanelContent active={chatOn} />
                    ) : KINDS[i] === "reco" ? (
                      <RecoGrid compact />
                    ) : (
                      <Panel />
                    )}
                  </DeviceFrame>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
