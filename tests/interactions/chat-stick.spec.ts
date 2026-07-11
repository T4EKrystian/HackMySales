import { test, expect } from "@playwright/test";
import { gotoAndSettle, lastActiveInView, trackConsole, SEL } from "../helpers";

/** Brief V7-F0: podczas autoplay co 300 ms typing LUB ostatnia wiadomość ma
 *  intersectionRatio ≥ 0.9 względem kontenera czatu (nigdy niewidoczne pisanie). */

test("chat hero: stick-to-bottom — pisanie nigdy poza widokiem", async ({ page }) => {
  // F1: stick-to-bottom kotwiczony w dole aktywnego kroku (dots/wiadomość), pomiar
  // w rAF po paincie. Było worst ratio 0.14 (follow tylko PO wiadomości).
  const con = trackConsole(page);
  await gotoAndSettle(page);

  // czekaj na start playbacku (intro ~1,5 s + wake)
  await page.waitForFunction(
    (sel) => {
      const els = [...document.querySelectorAll(sel)];
      return els.some((e) => parseFloat(getComputedStyle(e).opacity) > 0.5);
    },
    SEL.heroSteps,
    { timeout: 15_000 }
  );

  // sampling co 300 ms do końca rozmowy (badge) albo 35 s
  const samples: { t: number; typingVisible: boolean; ratio: number }[] = [];
  const t0 = Date.now();
  while (Date.now() - t0 < 35_000) {
    const s = await lastActiveInView(page, SEL.heroLog);
    if (s.hasSteps) samples.push({ t: Date.now() - t0, typingVisible: s.typingVisible, ratio: s.ratio });
    const done = await page.evaluate(
      (sel) => {
        const b = document.querySelector(`${sel} [data-role="badge"]`);
        return !!b && parseFloat(getComputedStyle(b).opacity) > 0.9;
      },
      SEL.heroLog
    );
    if (done) break;
    await page.waitForTimeout(300);
  }

  expect(samples.length, "playback wyprodukował sample").toBeGreaterThan(10);
  const bad = samples.filter((s) => !s.typingVisible && s.ratio < 0.9);
  const worst = Math.min(...samples.map((s) => (s.typingVisible ? 1 : s.ratio)));
  test.info().annotations.push({ type: "metric", description: `worst ratio: ${worst}; złe sample: ${bad.length}/${samples.length}` });
  expect(bad, `złe sample (typing niewidoczny i ratio<0.9): ${JSON.stringify(bad.slice(0, 5))}`).toHaveLength(0);
  expect(con, "konsola czysta").toHaveLength(0);
});

test("chat hero: typing indicator zawsze w 1 linii", async ({ page }) => {
  await gotoAndSettle(page);
  // złap widoczny indicator w trakcie playbacku
  await page.waitForFunction(
    (sel) =>
      [...document.querySelectorAll(sel)].some(
        (el) => (el as HTMLElement).offsetParent !== null && parseFloat(getComputedStyle(el).opacity) > 0.5
      ),
    `${SEL.heroLog} ${SEL.typing}`,
    { timeout: 20_000 }
  );
  const m = await page.evaluate((sel) => {
    const el = [...document.querySelectorAll(sel)].find(
      (e) => (e as HTMLElement).offsetParent !== null && parseFloat(getComputedStyle(e).opacity) > 0.5
    ) as HTMLElement;
    const h = el.getBoundingClientRect().height;
    // dowód „jednego rzędu": wszystkie kropki dzielą offsetTop (zawinięcie = rozjazd),
    // + wysokość bąbla w budżecie px (1-rząd ~30 px, zawinięty 2-rząd ~48 px+).
    const tops = [...el.querySelectorAll(".chat-dot")].map((d) => (d as HTMLElement).offsetTop);
    const rowSpread = tops.length ? Math.max(...tops) - Math.min(...tops) : 0;
    return { h, rowSpread, dots: tops.length };
  }, `${SEL.heroLog} ${SEL.typing}`);
  expect(m.dots, "bąbel pisania ma kropki").toBeGreaterThan(0);
  expect(m.rowSpread, `kropki w jednym rzędzie (spread ${m.rowSpread}px)`).toBeLessThanOrEqual(2);
  expect(m.h, `wysokość bąbla ${m.h}px w budżecie 1 rzędu (≤40)`).toBeLessThanOrEqual(40);
});
