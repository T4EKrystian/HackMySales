import { test, expect } from "@playwright/test";
import { gotoAndSettle } from "../helpers";

/** Brief V7-F0: przełączenie tonu podmienia odpowiedź ≤300 ms; kłódka nie zmienia stanu. */

const SECTION = "[data-ambient='kontrola']";

test("kontrola: ton podmienia podgląd ≤300 ms; kłódka inertna", async ({ page }) => {
  await gotoAndSettle(page);
  const y = await page.evaluate((s) => document.querySelector(s)!.getBoundingClientRect().top + scrollY, SECTION);
  await page.evaluate((yy) => window.scrollTo(0, yy - 120), y);
  await page.waitForTimeout(1200);

  const preview = page.locator(`${SECTION} [role="log"]`);
  const before = (await preview.innerText()).replace(/\s+/g, " ").trim();

  // przełącz ton (drugi przycisk w segmented)
  const toneBtns = page.locator(`${SECTION} [role="group"] button[aria-pressed]`);
  await toneBtns.nth(1).click();
  let changedAt = -1;
  const t0 = Date.now();
  for (let i = 0; i < 40; i++) {
    const now = (await preview.innerText()).replace(/\s+/g, " ").trim();
    if (now !== before) {
      changedAt = Date.now() - t0;
      break;
    }
    await page.waitForTimeout(10);
  }
  expect(changedAt, "podgląd podmieniony").toBeGreaterThanOrEqual(0);
  expect(changedAt, `podmiana w ${changedAt} ms`).toBeLessThanOrEqual(300);

  // kłódka: Toggle role="switch" aria-disabled="true" — klik NIE zmienia aria-checked
  // (stan eksponowany jest przez aria-checked, nie aria-pressed/data-on — te nie istnieją)
  const lock = page.locator(`${SECTION} [role="switch"][aria-disabled="true"]`).first();
  await expect(lock, "kłódka istnieje").toBeVisible();
  const lockCheckedBefore = await lock.getAttribute("aria-checked");
  expect(lockCheckedBefore, "kłódka ma aria-checked").not.toBeNull();
  const previewBefore = (await preview.innerText()).replace(/\s+/g, " ").trim();
  await lock.click({ force: true });
  await page.waitForTimeout(400);
  const lockCheckedAfter = await lock.getAttribute("aria-checked");
  expect(lockCheckedAfter, "aria-checked kłódki bez zmian").toBe(lockCheckedBefore);
  await expect(lock, "kłódka wciąż zablokowana").toHaveAttribute("aria-disabled", "true");
  const previewAfter = (await preview.innerText()).replace(/\s+/g, " ").trim();
  expect(previewAfter, "podgląd bez zmian po kliku kłódki").toBe(previewBefore);
});
