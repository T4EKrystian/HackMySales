import { test, expect } from "@playwright/test";
import { pl } from "../../content/pl";
import { gotoAndSettle, SEL } from "../helpers";

/** Brief V7-F0: po zmianie taba / „Odtwórz jeszcze raz": scrollTop kontenera = 0,
 *  sekwencja startuje od zera. */

const heroTabs = `#chat-demo [role="group"][aria-label="Scenariusze demo"] button`;

const visibleSteps = (page: import("@playwright/test").Page) =>
  page.evaluate((sel) => {
    return [...document.querySelectorAll(sel)].filter((e) => {
      const st = getComputedStyle(e);
      return parseFloat(st.opacity) > 0.5 && st.visibility !== "hidden";
    }).length;
  }, SEL.heroSteps);

test("zmiana taba w połowie playbacku → scrollTop=0 i sekwencja od zera", async ({ page }) => {
  await gotoAndSettle(page);
  // poczekaj aż rozmowa realnie ruszy (≥2 widoczne kroki)
  await page.waitForFunction(
    (sel) =>
      [...document.querySelectorAll(sel)].filter((e) => parseFloat(getComputedStyle(e).opacity) > 0.5).length >= 2,
    SEL.heroSteps,
    { timeout: 25_000 }
  );
  await page.locator(heroTabs).nth(1).click();
  await page.waitForTimeout(200);
  const scrollTop = await page.evaluate((sel) => document.querySelector(sel)!.scrollTop, SEL.heroLog);
  expect(scrollTop, "scrollTop po zmianie taba").toBeLessThanOrEqual(2);
  const early = await visibleSteps(page);
  expect(early, "sekwencja wystartowała od zera (≤1 widoczny krok)").toBeLessThanOrEqual(1);
  // i rośnie
  await page.waitForFunction(
    (sel) =>
      [...document.querySelectorAll(sel)].filter((e) => parseFloat(getComputedStyle(e).opacity) > 0.5).length >= 2,
    SEL.heroSteps,
    { timeout: 20_000 }
  );
});

test("stale-done: po skończonej rozmowie zmiana taba nie trzyma dna", async ({ page }) => {
  // Regression guard: scenariusz „tab po done" dziś NIE reprodukuje objawu
  // (smooth z efektu [done] dawno wygasł) — objaw klienta łapie test replay niżej.
  // F1 i tak twardnieje tę ścieżkę (setDone(false) na script.key).
  await gotoAndSettle(page);
  // pełne odtworzenie scenariusza 1 (badge widoczny)
  await page.waitForFunction(
    (sel) => {
      const b = document.querySelector(`${sel} [data-role="badge"]`);
      return !!b && parseFloat(getComputedStyle(b).opacity) > 0.9;
    },
    SEL.heroLog,
    { timeout: 60_000 }
  );
  await page.locator(heroTabs).nth(2).click();
  // scrollTop ma zostać przy zerze przez cały okres potencjalnego wyścigu ze smooth
  for (let t = 0; t < 800; t += 100) {
    const st = await page.evaluate((sel) => document.querySelector(sel)!.scrollTop, SEL.heroLog);
    expect(st, `scrollTop w t=${t}ms po zmianie taba`).toBeLessThanOrEqual(5);
    await page.waitForTimeout(100);
  }
});

test("replay → scrollTop=0 i start od zera", async ({ page }) => {
  // F1: replay resetuje pinned/anchor/unread + efekt [done] jest warunkowy (instant)
  await gotoAndSettle(page);
  await page.waitForFunction(
    (sel) => {
      const b = document.querySelector(`${sel} [data-role="badge"]`);
      return !!b && parseFloat(getComputedStyle(b).opacity) > 0.9;
    },
    SEL.heroLog,
    { timeout: 60_000 }
  );
  await page.getByRole("button", { name: pl.hero.chat.replay }).click();
  await page.waitForTimeout(250);
  const scrollTop = await page.evaluate((sel) => document.querySelector(sel)!.scrollTop, SEL.heroLog);
  expect(scrollTop, "scrollTop po replay").toBeLessThanOrEqual(2);
  const early = await visibleSteps(page);
  expect(early, "replay startuje od zera").toBeLessThanOrEqual(1);
});
