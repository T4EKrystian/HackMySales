import { test, expect } from "@playwright/test";
import { pl } from "../../content/pl";
import { gotoAndSettle } from "../helpers";

/** Agent qa-mobile: sticky CTA widoczne po hero; znika w finale (#demo).
 *  (Lejek AIDA nie ma #cennik — asercja cennika zdjęta.) */

test("sticky CTA po hero, ukryty w finale", async ({ page }) => {
  await gotoAndSettle(page);
  const heroH = await page.evaluate(() => document.querySelector("#top")!.getBoundingClientRect().height);
  await page.evaluate((y) => window.scrollTo(0, y + 400), heroH);
  await page.waitForTimeout(700);

  const cta = page.locator(`[data-sticky-cta] a, [data-sticky-cta] button`).filter({ hasText: pl.nav.cta }).first();
  await expect(cta, "sticky CTA widoczne po hero").toBeVisible();
  const box = (await cta.boundingBox())!;
  expect(box.height, "wysokość celu ≥44").toBeGreaterThanOrEqual(44);

  // w finale (#demo) znika
  const demoY = await page.evaluate(() => document.querySelector("#demo")!.getBoundingClientRect().top + scrollY);
  await page.evaluate((y) => window.scrollTo(0, y + 100), demoY);
  await page.waitForTimeout(700);
  await expect(page.locator("[data-sticky-cta]"), "ukryty w finale").toHaveAttribute("aria-hidden", "true");
});
