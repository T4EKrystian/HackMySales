import { test, expect } from "@playwright/test";
import { demo, gotoAndSettle } from "../helpers";

/** E5: kalkulator ROI wraca jako dowód rachunkowy. Zmiana suwaka aktualizuje wynik
 *  < 100 ms; defaulty = demo.calc.defaults (truth-table). Cel asercji wyniku:
 *  sr-only w RollingNumber (czysty tekst, synchroniczny ze stanem, aria-live). */

const RESULT = '#wyniki p[aria-live="polite"] .sr-only';

async function scrollToCalc(page: import("@playwright/test").Page) {
  const wyY = await page.evaluate(
    () => document.querySelector("#wyniki")!.getBoundingClientRect().top + scrollY
  );
  await page.evaluate((y) => window.scrollTo(0, y - 200), wyY);
  await page.waitForTimeout(800);
}

test("kalkulator: defaulty z truth-table, reakcja <100 ms", async ({ page }) => {
  await gotoAndSettle(page);
  await scrollToCalc(page);

  // defaulty suwaków == demo.calc.defaults
  const defaults = await page.evaluate(() => ({
    visits: Number((document.querySelector("#roi-visits") as HTMLInputElement).value),
    aov: Number((document.querySelector("#roi-aov") as HTMLInputElement).value),
    conv: Number((document.querySelector("#roi-conv") as HTMLInputElement).value),
  }));
  expect(defaults).toEqual(demo.calc.defaults);

  const before = (await page.locator(RESULT).textContent())?.trim();
  expect(before, "wynik istnieje").toBeTruthy();

  // zmiana range przez natywny setter + input event (React controlled)
  const t0 = Date.now();
  await page.evaluate(() => {
    const el = document.querySelector("#roi-visits") as HTMLInputElement;
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    set.call(el, String(Number(el.value) * 2));
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  // poll co 10 ms aż sr-only się zmieni
  let changedAt = -1;
  for (let i = 0; i < 30; i++) {
    const now = (await page.locator(RESULT).textContent())?.trim();
    if (now !== before) {
      changedAt = Date.now() - t0;
      break;
    }
    await page.waitForTimeout(10);
  }
  expect(changedAt, "wynik zaktualizowany").toBeGreaterThanOrEqual(0);
  expect(changedAt, `reakcja ${changedAt} ms`).toBeLessThan(100);
});

test("kalkulator: hit-area suwaków ≥44 px (WCAG 2.5.5)", async ({ page }) => {
  await gotoAndSettle(page);
  await scrollToCalc(page);

  const boxes = await page.evaluate(() =>
    ["#roi-visits", "#roi-aov", "#roi-conv"].map((sel) => {
      const r = document.querySelector(sel)!.getBoundingClientRect();
      return { sel, w: Math.round(r.width), h: Math.round(r.height) };
    })
  );
  for (const b of boxes) {
    expect(b.h, `${b.sel} wysokość ${b.h}px`).toBeGreaterThanOrEqual(44);
    expect(b.w, `${b.sel} szerokość ${b.w}px`).toBeGreaterThanOrEqual(44);
  }
});
