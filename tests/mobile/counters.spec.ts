import { test, expect } from "@playwright/test";
import { gotoAndSettle } from "../helpers";

/** Agent qa-mobile: liczniki statystyk mają NIEZEROWĄ, FINALNĄ wartość po
 *  wjeździe w viewport — to jest złamane DZIŚ (SSR „98" kasowane do „0" na
 *  mount przez immediateRender; naprawa = Counter v4, F2). */

test("liczniki: po wjeździe w viewport wartość == data-final (nigdy 0/pusta)", async ({ page }) => {
  // Wolny, deliberny przejazd DZIŚ przechodzi (ST zdąża strzelić przy 250 ms/krok) —
  // to zielony regression-guard. Bug klienta („samo %") reprodukuje test szybkiego,
  // urwanego przejazdu niżej (known-fail F2). Counter v4 domknie oba warianty.
  await gotoAndSettle(page);
  // powolny przejazd z krótkim osiadaniem przy każdym kroku
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const bad: { final: string; text: string; y: number }[] = [];
  for (let y = 0; y < H; y += 500) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(1500);
  // ostateczny stan WSZYSTKICH widocznych counterów
  const state = await page.evaluate(() =>
    [...document.querySelectorAll("[data-counter]")]
      .filter((el) => (el as HTMLElement).offsetParent !== null)
      .map((el) => ({
        final: ((el as HTMLElement).dataset.final ?? "").trim(),
        text: (el.querySelector("[data-counter-num]")?.textContent ?? "").trim(),
      }))
  );
  expect(state.length, "są widoczne countery").toBeGreaterThan(3);
  for (const c of state) {
    const norm = (s: string) => s.replace(/[\s  ]/g, "");
    if (!norm(c.text) || norm(c.text) === "0" || norm(c.text) !== norm(c.final)) bad.push({ ...c, y: -1 });
  }
  expect(bad, `countery bez finalnej wartości: ${JSON.stringify(bad)}`).toHaveLength(0);
});

test("szybki, urwany przejazd nie zostawia zer przy sufiksach", async ({ page }) => {
  // F2: Counter v4 — DOM zawsze = final; IO-dip to jedyna animacja (bez ST)
  await gotoAndSettle(page);
  // brutalny skok w środek sekcji Problem (scenariusz screenshota klienta)
  const probY = await page.evaluate(
    () => document.querySelector("[data-ambient='problem']")!.getBoundingClientRect().top + scrollY
  );
  await page.evaluate((y) => window.scrollTo(0, y + 400), probY);
  await page.waitForTimeout(120); // NIE czekamy na animacje — łapiemy stan „z zaskoczenia"
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  await page.evaluate((y) => window.scrollTo(0, y + 400), probY);
  await page.waitForTimeout(2500); // teraz osiadanie
  const nums = await page.evaluate(() =>
    [...document.querySelectorAll("[data-ambient='problem'] [data-counter]")]
      .filter((el) => (el as HTMLElement).offsetParent !== null)
      .map((el) => ({
        final: ((el as HTMLElement).dataset.final ?? "").trim(),
        text: (el.querySelector("[data-counter-num]")?.textContent ?? "").trim(),
      }))
  );
  const bad = nums.filter((c) => c.text !== c.final);
  expect(bad, `liczby ≠ final po urwanym przejeździe: ${JSON.stringify(bad)}`).toHaveLength(0);
});
