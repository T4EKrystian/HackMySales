import { test, expect } from "@playwright/test";
import { gotoAndSettle } from "../helpers";

/** Agent qa-mobile: brak pionowych pasów pustki >200 px między sekcjami
 *  (zmierzone dziś: 300–380 px w Problemie — min-h-[62svh] justify-center). */

test("odstępy między sekcjami ≤200 px", async ({ page }) => {
  test.fail(true, "kontrakt F2: pasy pustki (dziś 300-380 px w Problemie)");

  await gotoAndSettle(page);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 700) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(80);
  }
  const gaps = await page.evaluate(() => {
    const els = [...document.querySelectorAll("main > section, footer")];
    const out: { after: string; gap: number }[] = [];
    for (let i = 0; i < els.length - 1; i++) {
      const a = els[i].getBoundingClientRect();
      const b = els[i + 1].getBoundingClientRect();
      const gap = Math.round(b.top - a.bottom);
      if (gap > 200) out.push({ after: els[i].id || (els[i] as HTMLElement).dataset.ambient || els[i].tagName, gap });
    }
    // pustka WEWNĄTRZ sekcji: odstęp między kolejnymi widocznymi dziećmi > 200 px
    document.querySelectorAll("main > section").forEach((sec) => {
      const kids = [...sec.querySelectorAll(":scope > * , :scope > div > *")].filter((el) => {
        const st = getComputedStyle(el);
        return st.display !== "none" && el.getBoundingClientRect().height > 0;
      });
      for (let i = 0; i < kids.length - 1; i++) {
        const a = kids[i].getBoundingClientRect();
        const b = kids[i + 1].getBoundingClientRect();
        const gap = Math.round(b.top - a.bottom);
        if (gap > 200) out.push({ after: `${sec.id || (sec as HTMLElement).dataset.ambient}#child${i}`, gap });
      }
    });
    return out;
  });
  expect(gaps, `pasy pustki: ${JSON.stringify(gaps.slice(0, 10))}`).toHaveLength(0);
});
