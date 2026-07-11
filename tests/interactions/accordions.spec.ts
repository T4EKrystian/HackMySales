import { test, expect } from "@playwright/test";
import { pl } from "../../content/pl";
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

test("Pricing: pełne porównanie rozwija wiersze i raportuje stan", async ({ page }) => {
  await gotoAndSettle(page);
  const y = await page.evaluate(() => document.querySelector("#cennik")!.getBoundingClientRect().top + scrollY);
  await page.evaluate((yy) => window.scrollTo(0, yy - 120), y);
  await page.waitForTimeout(800);

  // wiersze są ZAWSZE w DOM — kolaps przez grid 0fr↔1fr; mierzymy wysokość wrappera
  const toggle = page.locator('#cennik button[aria-expanded]').first();
  await expect(toggle, "toggle porównania istnieje").toBeVisible();
  await expect(toggle).toHaveText(new RegExp(pl.pricing.moreLabel));
  await expect(toggle).toHaveAttribute("aria-expanded", "false");

  // wrapper porównania = div z inline grid-template-rows (nie mylić z rolkami cen,
  // które też mają overflow-hidden ~30 px wysokości)
  const wrap = page.locator('#cennik div[style*="grid-template-rows"] > .overflow-hidden').first();
  const hBefore = (await wrap.boundingBox())?.height ?? 0;
  expect(hBefore, "zwinięte wiersze mają wysokość ~0").toBeLessThanOrEqual(2);

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.waitForTimeout(450); // animacja grid-rows
  const hAfter = (await wrap.boundingBox())?.height ?? 0;
  expect(hAfter, `wiersze rozwinięte (h ${hBefore} → ${hAfter})`).toBeGreaterThan(50);
});
