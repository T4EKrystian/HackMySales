import { test, expect } from "@playwright/test";
import { gotoAndSettle } from "../helpers";

/** Brief V7-F0: akordeony/„Pełne porównanie": height animuje się, aria-expanded się zmienia. */

test("FAQ: aria-expanded + wysokość regionu 0 ↔ >0", async ({ page }) => {
  await gotoAndSettle(page);
  const y = await page.evaluate(() => document.querySelector("#faq")!.getBoundingClientRect().top + scrollY);
  await page.evaluate((yy) => window.scrollTo(0, yy - 120), y);
  await page.waitForTimeout(800);

  // item #1 (domyślnie zamknięty — otwarty jest #0)
  const btn = page.locator('#faq button[aria-controls="faq-a-1"]');
  const region = page.locator("#faq-a-1");

  await expect(btn).toHaveAttribute("aria-expanded", "false");
  const hClosed = (await region.boundingBox())?.height ?? 0;
  expect(hClosed, "zamknięty region ma wysokość ~0").toBeLessThanOrEqual(2);

  await btn.click();
  await expect(btn).toHaveAttribute("aria-expanded", "true");
  await page.waitForTimeout(450); // animacja grid-rows
  const hOpen = (await region.boundingBox())?.height ?? 0;
  expect(hOpen, "otwarty region ma wysokość >40").toBeGreaterThan(40);

  await btn.click();
  await expect(btn).toHaveAttribute("aria-expanded", "false");
  await page.waitForTimeout(450);
  const hAgain = (await region.boundingBox())?.height ?? 0;
  expect(hAgain, "ponownie zamknięty ~0").toBeLessThanOrEqual(2);
});
