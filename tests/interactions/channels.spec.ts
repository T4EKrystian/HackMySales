import { test, expect } from "@playwright/test";
import { gotoAndSettle, SEL } from "../helpers";

/** Brief V7-F0: każdy z 4 skinów renderuje TĘ SAMĄ rozmowę (ten sam mózg).
 *  Reasercja qa-v6 B2 na nowym harnessie: zdanie-kotwica pierwszego bota
 *  obecne w każdym skinie (email renderuje treść w .nm-line). */

test("kanały: 4 skiny — ta sama rozmowa", async ({ page }) => {
  test.slow(); // pełne odtworzenie rozmowy (~30-45 s) przed przełączaniem

  await gotoAndSettle(page);
  const swY = await page.evaluate(
    (sel) => document.querySelector(sel)!.getBoundingClientRect().top + scrollY,
    SEL.switcher
  );
  await page.evaluate((y) => window.scrollTo(0, y - 900), swY);
  await page.waitForTimeout(400);
  await page.evaluate((y) => window.scrollTo(0, y - 430), swY);

  // pełne odtworzenie → seen (finał = badge)
  await page.waitForFunction(
    (sel) => {
      const b = document.querySelector(`${sel} [data-role="badge"]`);
      return !!b && parseFloat(getComputedStyle(b).opacity) > 0.9;
    },
    SEL.switcher,
    { timeout: 60_000 }
  );

  // kotwica z BOTA (nie z usera): zdanie usera trywialnie jest w każdym skinie,
  // a w email dodatkowo jako subject — porównanie do niego NIE testuje „tego samego
  // mózgu". Bierzemy odpowiedź bota (data-role="bot"), która w email renderuje się
  // jako .nm-line — musi wystąpić w treści KAŻDEGO skina.
  const anchor = await page.evaluate((sel) => {
    const texts = [...document.querySelectorAll(`${sel} .chat-step[data-role="bot"] .chat-msg`)]
      .map((e) => (e as HTMLElement).innerText.replace(/\s+/g, " ").trim())
      // pierwsze zdanie odpowiedzi bota, bez treści karty produktu (bierzemy prefiks)
      .map((t) => t.split(/[.!?]/)[0].trim())
      .filter((t) => t.length > 25);
    return texts[0]?.slice(0, 40) ?? "";
  }, SEL.switcher);
  expect(anchor.length, "kotwica-odpowiedź bota istnieje").toBeGreaterThan(20);

  const tabs = page.locator(SEL.chTabs);
  const misses: number[] = [];
  for (const target of [1, 2, 3, 0]) {
    await tabs.nth(target).click();
    await page.waitForTimeout(1100); // morph 450 + re-stagger + zapas
    const text = await page.evaluate(
      (sel) => (document.querySelector(sel) as HTMLElement).innerText.replace(/\s+/g, " "),
      SEL.switcher
    );
    if (!text.includes(anchor)) misses.push(target);
  }
  expect(misses, `skiny bez kotwicy "${anchor}"`).toHaveLength(0);
});
