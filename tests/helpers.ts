/**
 * V7-F0: wspólne helpery suit QA. Konwencje przeniesione z zamrożonych
 * skryptów dowodowych (scripts/qa-v6.mjs, qa-scroll.mjs):
 * - NOISE: filtr szumu headless-GL (konsola "produkcyjna" = po tym filtrze 0/0),
 * - widoczność: offsetParent + opacity (static chowa elementy przez display:none —
 *   samo computed opacity kłamie; docs/failures.md 2026-07-11),
 * - sondy wielopolowe JEDNYM evaluate (rozdrobnione sondy dziurawią próbkowanie).
 */
import type { Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";

export { demo, demoValues } from "../content/demo-data";

export const NOISE =
  /SwiftShader|GroupMarkerNotSet|Automatic fallback to software WebGL|GPU stall|Vulkan|WebGL context was lost/i;

/** Zbiera error/warning (po filtrze NOISE) + pageerror. Wywołać PRZED goto. */
export function trackConsole(page: Page): string[] {
  const bucket: string[] = [];
  page.on("console", (m) => {
    const t = m.type();
    if ((t === "error" || t === "warning") && !NOISE.test(m.text())) bucket.push(`${t}: ${m.text().slice(0, 200)}`);
  });
  page.on("pageerror", (e) => bucket.push(`pageerror: ${e.message.slice(0, 200)}`));
  return bucket;
}

/** networkidle + oddech na fonty/refresh ST/idle-mount GL. */
export async function gotoAndSettle(page: Page, path = "/", settleMs = 2500) {
  await page.goto(path, { waitUntil: "networkidle" });
  await page.waitForTimeout(settleMs);
}

export type RideSample = {
  t: number;
  y: number;
  probIdx: number;
  pillarIdx: number;
  round: string;
  score: string;
  howIdx: number;
  searchEmpty: boolean;
};

/**
 * Przejazd wheel-scrollem do dna (port pętli qa-scroll.mjs):
 * krok co `tick` ms, klatka JPEG q45 co 250 ms (gdy shotsDir), sonda stanu
 * pinów + pustych ram wyszukiwarki jednym evaluate.
 */
export async function ride(
  page: Page,
  { speed, tick = 100, shotsDir }: { speed: number; tick?: number; shotsDir?: string }
): Promise<{ samples: RideSample[]; frames: number; scrollMs: number }> {
  if (shotsDir) await mkdir(shotsDir, { recursive: true });
  const vp = page.viewportSize()!;
  const step = Math.round((speed * tick) / 1000);
  const samples: RideSample[] = [];
  let frames = 0;
  let lastShot = 0;
  let t = 0;
  let atBottom = false;

  // Desktop: mouse.wheel przez Lenis — testuje scrub/piny na realnym kole.
  // Mobile <768: wheel nad logiem czatu (data-lenis-prevent) scrolluje WEWNĘTRZNY
  // kontener, nie stronę → timeout. Mobile = brak pinów (CLAUDE.md), więc scroll
  // programowy (window.scrollTo, z którym Lenis się synchronizuje — sprawdzone qa-v6 B6)
  // niezawodnie dojeżdża do dna i wciąż waliduje puste ramy / duchy H2 / dead-scroll.
  const isMobile = vp.width < 768;
  if (!isMobile) await page.mouse.move(90, vp.height / 2);
  let targetY = 0;

  while (!atBottom && t < 120_000) {
    if (isMobile) {
      targetY += step;
      await page.evaluate((y) => window.scrollTo(0, y), targetY);
    } else {
      await page.mouse.wheel(0, step);
    }
    await page.waitForTimeout(tick);
    t += tick;
    samples.push({
      t,
      ...(await page.evaluate(() => {
        const q = (s: string) => document.querySelector(s);
        const vis = (el: Element | null) => {
          if (!el) return false;
          const r = el.getBoundingClientRect();
          return r.top < innerHeight && r.bottom > 0;
        };
        const op = (el: Element | null) => (el ? parseFloat(getComputedStyle(el).opacity) : 0);
        const probIdx = [...document.querySelectorAll(".prob-rail-seg")].findIndex(
          (el) => (el as HTMLElement).dataset.active === "true"
        );
        const pillarIdx = [...document.querySelectorAll(".pillar-item")].findIndex(
          (el) => (el as HTMLElement).dataset.active === "true"
        );
        const howIdx = [...document.querySelectorAll(".how-progress-dot")].filter(
          (el) => (el as HTMLElement).dataset.active === "true"
        ).length;
        // WIDOCZNY wariant, nie pierwszy w DOM: Pillars renderuje desktopowy blok
        // (.pp-results) PRZED mobilnym; na 390px desktopowy jest display:none (rect 0×0),
        // więc querySelector zwracał ukryty węzeł → searchEmpty zawsze false (pusta
        // asercja na mobile). offsetParent!==null wybiera realnie renderowany wariant.
        const pick = (sel: string) => [...document.querySelectorAll(sel)].find((el) => (el as HTMLElement).offsetParent !== null) ?? null;
        const realUl = pick(".pp-results");
        let searchEmpty = false;
        if (realUl && vis(realUl.parentElement)) {
          const rows = [...realUl.querySelectorAll(".pp-row")];
          // po redesignie wyniki są ZAWSZE widoczne z SSR (min. przygaszone opacity 0.35) —
          // skeleton usunięty; pusta rama = ul niewidoczny albo zero wierszy.
          const ulVisible = op(realUl) > 0.05;
          searchEmpty = !ulVisible || rows.length === 0;
        }
        return {
          y: scrollY,
          probIdx: vis(q(".prob-stage")) ? probIdx : -1,
          pillarIdx: vis(q(".pillar-stage")) ? pillarIdx : -1,
          round: vis(q(".arena-stage")) ? q(".arena-round-no")?.textContent ?? "" : "",
          score: vis(q(".arena-stage")) ? (q(".arena-score") as HTMLElement | null)?.innerText.replace(/\s+/g, " ") ?? "" : "",
          howIdx: vis(q(".how-stage")) ? howIdx : -1,
          searchEmpty,
        };
      })),
    });
    if (shotsDir && t - lastShot >= 250) {
      lastShot = t;
      await page.screenshot({ path: `${shotsDir}/f${String(frames++).padStart(4, "0")}.jpg`, quality: 45, type: "jpeg" });
    }
    atBottom = await page.evaluate(() => Math.ceil(scrollY + innerHeight) >= document.body.scrollHeight - 2);
  }
  await page.waitForTimeout(1200); // osiadanie snapów
  return { samples, frames, scrollMs: t };
}

/** Ekspozycje ciągłych okien per stan. „0" jest WYKLUCZONE tylko dla howIdx
 *  (0 = zero aktywnych kropek). Dla probIdx/pillarIdx index 0 to PRAWIDŁOWY pierwszy
 *  stan (pierwszy stat Problemu / pierwszy filar) — musi być mierzony, inaczej
 *  asercja (a) nie sprawdza dwellu pierwszego stanu. „-1" = poza pinem (zawsze out). */
export function dwell(samples: RideSample[], key: keyof RideSample): Record<string, number> {
  const zeroIsInactive = key === "howIdx";
  const out: Record<string, number> = {};
  let cur: string | null = null;
  let start = 0;
  for (const s of samples) {
    const v = String(s[key]);
    if (v !== cur) {
      const skip = cur === null || cur === "-1" || cur === "" || (zeroIsInactive && cur === "0");
      if (!skip) out[cur] = Math.max(out[cur] ?? 0, s.t - start);
      cur = v;
      start = s.t;
    }
  }
  return out;
}

/** PerformanceObserver longtask — wołać PRZED goto. */
export async function installLongTasks(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __lt: { start: number; duration: number }[] }).__lt = [];
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          (window as unknown as { __lt: { start: number; duration: number }[] }).__lt.push({
            start: Math.round(e.startTime),
            duration: Math.round(e.duration),
          });
        }
      }).observe({ type: "longtask", buffered: true });
    } catch {
      /* longtask nieobsługiwany — zostaje pusta lista */
    }
  });
}

export async function readLongTasks(page: Page): Promise<{ start: number; duration: number }[]> {
  return page.evaluate(() => (window as unknown as { __lt?: { start: number; duration: number }[] }).__lt ?? []);
}

/**
 * Stan „żywej krawędzi" rozmowy: typing widoczny (offsetParent + opacity — kontrakt
 * sond qa-v6 B5) lub ratio ostatniej WIDOCZNEJ wiadomości względem logu.
 * Czysta geometria rectów, jedno evaluate.
 */
export async function lastActiveInView(
  page: Page,
  logSel: string
): Promise<{ typingVisible: boolean; ratio: number; hasSteps: boolean }> {
  return page.evaluate((sel) => {
    const log = document.querySelector(sel);
    if (!log) return { typingVisible: false, ratio: 1, hasSteps: false };
    const lr = log.getBoundingClientRect();
    const typing = [...log.querySelectorAll(".chat-typing")].find(
      (el) => (el as HTMLElement).offsetParent !== null && parseFloat(getComputedStyle(el).opacity) > 0.1
    );
    let typingVisible = false;
    if (typing) {
      const tr = typing.getBoundingClientRect();
      const vis = Math.min(tr.bottom, lr.bottom) - Math.max(tr.top, lr.top);
      typingVisible = vis / Math.max(1, tr.height) >= 0.9;
    }
    const msgs = [...log.querySelectorAll(".chat-step")].filter((el) => {
      const st = getComputedStyle(el);
      return parseFloat(st.opacity) > 0.5 && st.visibility !== "hidden";
    });
    const last = msgs.at(-1);
    if (!last) return { typingVisible, ratio: 1, hasSteps: false };
    const r = last.getBoundingClientRect();
    const visible = Math.min(r.bottom, lr.bottom) - Math.max(r.top, lr.top);
    return { typingVisible, ratio: +(Math.max(0, visible) / Math.max(1, r.height)).toFixed(3), hasSteps: true };
  }, logSel);
}

/** Mapa selektorów — ustalona i przetestowana w qa-v6/qa-scroll; nie wymyślać nowych. */
export const SEL = {
  heroLog: '#chat-demo [role="log"]',
  heroTabs: '#chat-demo [role="group"] button',
  heroSteps: "#chat-demo .chat-step",
  typing: ".chat-typing",
  msg: ".chat-msg",
  badge: '[data-role="badge"]',
  counters: "[data-counter]",
  counterNum: "[data-counter-num]",
  probNum: ".prob-num",
  pinSpacer: ".pin-spacer",
  arenaRound: ".arena-round-no",
  arenaScore: ".arena-score",
} as const;
