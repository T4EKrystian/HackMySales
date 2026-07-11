import { test, expect } from "@playwright/test";
import { gotoAndSettle } from "../helpers";

/** Agent qa-mobile: viewport 390×844 — twarde progi briefu V7. */

test("zero poziomego overflow", async ({ page }) => {
  await gotoAndSettle(page);
  const w = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(w, "documentElement.scrollWidth").toBeLessThanOrEqual(390);
});

test("typografia: proza ≥16 px, labelki ≥13 px", async ({ page }) => {
  // Kontrakt F2 (D8): dziś mediana 14 px (text-sm), labelki 12 px — naprawia
  // var-override max-md + sweep mikro. Marker zdejmuje F2.
  test.fail(true, "kontrakt F2: typografia mobile (dziś proza 14 px, labelki 12 px)");

  await gotoAndSettle(page);
  // pełny przejazd, żeby lazy sekcje się zamontowały
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 800) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(60);
  }
  const viol = await page.evaluate(() => {
    const out: { kind: string; size: number; text: string }[] = [];
    const vis = (el: Element) => {
      const st = getComputedStyle(el);
      if (st.display === "none" || st.visibility === "hidden" || parseFloat(st.opacity) < 0.05) return false;
      return (el as HTMLElement).offsetParent !== null;
    };
    // proza: akapity treści ≥40 znaków (poza chrome czatu i tickerem mono)
    document.querySelectorAll("main p").forEach((el) => {
      const t = el.textContent?.trim() ?? "";
      if (t.length < 40 || !vis(el)) return;
      if (el.closest(".chat-step, .chat-msg, [role='log'], .glass-head")) return;
      const size = parseFloat(getComputedStyle(el).fontSize);
      if (size < 16) out.push({ kind: "proza", size, text: t.slice(0, 40) });
    });
    // labelki: .label + drobne meta
    document.querySelectorAll("main .label, main [class*='text-xs']").forEach((el) => {
      const t = el.textContent?.trim() ?? "";
      if (!t || !vis(el)) return;
      const size = parseFloat(getComputedStyle(el).fontSize);
      if (size < 13) out.push({ kind: "label", size, text: t.slice(0, 30) });
    });
    return out.slice(0, 30);
  });
  expect(viol, `naruszenia progów: ${JSON.stringify(viol.slice(0, 8))}`).toHaveLength(0);
});

test("strona ≤22 ekranów", async ({ page }) => {
  // Kontrakt F3 (D8): dziś 34,1 ekranów; F2 tnie do ~28, F3 domyka ≤22.
  test.fail(true, "kontrakt F2+F3: długość strony (dziś 34,1 ekranów)");

  await gotoAndSettle(page);
  const screens = await page.evaluate(() => document.documentElement.scrollHeight / innerHeight);
  test.info().annotations.push({ type: "metric", description: `ekranów: ${screens.toFixed(1)}` });
  expect(screens, `ekranów ${screens.toFixed(1)}`).toBeLessThanOrEqual(22);
});
