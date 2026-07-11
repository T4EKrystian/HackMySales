import { test, expect } from "@playwright/test";
import { demo } from "../helpers";
import { gotoAndSettle } from "../helpers";

/** Brief V7-F0: zmiana slidera aktualizuje wynik < 100 ms; wartości = demo-data.ts.
 *  Cel asercji wyniku: sr-only w RollingNumber (czysty tekst, synchroniczny ze stanem). */

const RESULT = '#wyniki p[aria-live="polite"] .sr-only';

test("kalkulator: defaulty z truth-table, reakcja <100 ms", async ({ page }) => {
  await gotoAndSettle(page);
  const wyY = await page.evaluate(() => document.querySelector("#wyniki")!.getBoundingClientRect().top + scrollY);
  await page.evaluate((y) => window.scrollTo(0, y - 200), wyY);
  await page.waitForTimeout(800);

  // defaulty sliderów == demo.calc.defaults
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
  // (kwota kosztu renderuje się rolkami RollingNumber — innerText sekcji to sieczka
  //  reelów 0-9; twardym łącznikiem z truth-table są defaulty sliderów wyżej)
});
