import { test, expect } from "@playwright/test";
import { gotoAndSettle } from "../helpers";

/** Agent qa-mobile: rozmiar celu dotykowego.
 *  BRAMKA TWARDA = WCAG 2.1 AA (2.5.8 Target Size Minimum): ≥24×24 px w OBU wymiarach
 *  — to prawny próg dostępności EU 2025, do którego celuje projekt (CLAUDE.md „a11y").
 *  Hit-area liczona jako bbox + rozszerzenie ::before (wzorce before:-inset-*).
 *
 *  AAA (2.5.5 Target Size, ≥44×44) raportujemy jako metrykę aspiracyjną. Elementy
 *  w paśmie 24–44 to strukturalnie ograniczone kontrolki, wszystkie z wyjątkami
 *  WCAG 2.5.8: (a) S/M/L w wąskiej karcie bento (segmentowana grupa full-width,
 *  40 px szer. — „equivalent"/spacing), (b) krótkie linki nawigacji stopki
 *  („FAQ" 31 px szer. — wyjątek „inline"). Wszystkie primary CTA, nav, dots karuzel,
 *  przełączniki i akcje mają ≥44 px po V7-F3. Szczegóły: docs/v7-report.md. */

test("cele dotykowe: WCAG AA ≥24 px (raport AAA ≥44)", async ({ page }, testInfo) => {
  await gotoAndSettle(page);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 800) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(50);
  }
  const { belowAA, belowAAA, total } = await page.evaluate(() => {
    const aa: { tag: string; w: number; h: number; text: string }[] = [];
    const aaa: { tag: string; w: number; h: number; text: string }[] = [];
    let count = 0;
    document.querySelectorAll("a, button, [role='button'], input, summary").forEach((el) => {
      const st = getComputedStyle(el);
      if (st.display === "none" || st.visibility === "hidden") return;
      if ((el as HTMLElement).offsetParent === null && st.position !== "fixed") return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      // hit-area: bbox + inset z ::before (wzorce before:-inset-* powiększają strefę)
      let w = r.width;
      let h = r.height;
      const before = getComputedStyle(el, "::before");
      if (before.content !== "none" && before.position === "absolute") {
        w += Math.abs(parseFloat(before.left) || 0) * 2;
        h += Math.abs(parseFloat(before.top) || 0) * 2;
      }
      count++;
      const rec = { tag: el.tagName.toLowerCase(), w: Math.round(w), h: Math.round(h), text: (el.textContent ?? "").trim().slice(0, 24) };
      if (w < 24 || h < 24) aa.push(rec);
      if (w < 44 || h < 44) aaa.push(rec);
    });
    return { belowAA: aa, belowAAA: aaa, total: count };
  });
  testInfo.annotations.push({
    type: "metric",
    description: `cele: ${total}, AAA(≥44) spełnia ${total - belowAAA.length}/${total}, poniżej AAA (pasmo 24–44, wyjątki WCAG): ${JSON.stringify(belowAAA.slice(0, 12))}`,
  });
  expect(belowAA, `WCAG AA: cele <24px (twarda bramka): ${JSON.stringify(belowAA.slice(0, 10))}`).toHaveLength(0);
});
