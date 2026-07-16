import { test, expect } from "@playwright/test";
import { gotoAndSettle } from "../helpers";

/** Agent qa-mobile: viewport 390×844 — twarde progi briefu V7. */

test("zero poziomego overflow", async ({ page }) => {
  await gotoAndSettle(page);
  const w = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(w, "documentElement.scrollWidth").toBeLessThanOrEqual(390);
});

test("typografia: proza ≥16 px, labelki ≥13 px", async ({ page }) => {
  // F2: var-override max-md (--text-sm→1rem, --text-xs→13px, --text-label→13px) + sweep mikro
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
    // BODY (poziom „body 16-17px" briefu): akapity treści ≥40 znaków w rozmiarze
    // body (text-sm/base/lead). Fine-print demo-mockupów (text-xs / arbitrary text-[Npx])
    // to poziom „labelki ≥13px" — sprawdzany niżej. Czat/ticker wykluczone.
    document.querySelectorAll("main p").forEach((el) => {
      const t = el.textContent?.trim() ?? "";
      if (t.length < 40 || !vis(el)) return;
      if (el.closest(".chat-step, .chat-msg, [role='log'], .glass-head")) return;
      const cls = (el as HTMLElement).className;
      if (/text-xs|text-\[\d/.test(cls)) return; // fine-print — reguła labelek
      const size = parseFloat(getComputedStyle(el).fontSize);
      if (size < 16) out.push({ kind: "proza", size, text: t.slice(0, 40) });
    });
    // labelki + fine-print: .label + text-xs + arbitrary małe — ≥13 px
    document.querySelectorAll("main .label, main [class*='text-xs'], main [class*='text-[1']").forEach((el) => {
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
  // Cel briefu ≤22 ekranów. Lejek AIDA (cięcie sekcji) zbił stronę pod cel —
  // marker known-fail zdjęty (rewizja AIDA 2026-07).
  await gotoAndSettle(page);
  const screens = await page.evaluate(() => document.documentElement.scrollHeight / innerHeight);
  test.info().annotations.push({ type: "metric", description: `ekranów: ${screens.toFixed(1)}` });
  expect(screens, `ekranów ${screens.toFixed(1)}`).toBeLessThanOrEqual(22);
});
