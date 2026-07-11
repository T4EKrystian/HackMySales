import { test, expect } from "@playwright/test";
import { gotoAndSettle, lastActiveInView, SEL } from "../helpers";

/** Brief V7-F1: gdy user przewinie log w górę podczas playbacku — silnik nie
 *  szarpie (pinned=false), pokazuje pigułkę „Nowa wiadomość"; klik przywraca pin.
 *  Cały spec = kontrakt F1 (feature nie istnieje w V6). */

test("odpięcie scrolla → pigułka; klik → powrót na żywą krawędź", async ({ page }) => {
  test.fail(true, "kontrakt F1: pinned-heurystyka + .chat-pill");

  await gotoAndSettle(page);
  await page.waitForFunction(
    (sel) =>
      [...document.querySelectorAll(sel)].filter((e) => parseFloat(getComputedStyle(e).opacity) > 0.5).length >= 3,
    SEL.heroSteps,
    { timeout: 30_000 }
  );

  // wheel W GÓRĘ nad logiem (kursor nad kontenerem czatu)
  const log = page.locator(SEL.heroLog);
  const box = (await log.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, -300);
  await page.waitForTimeout(400);

  await expect(log, "log oznaczony jako odpięty").toHaveAttribute("data-pinned", "false");

  // pigułka pojawia się przy najbliższej nowej wiadomości/typing
  await expect(page.locator("#chat-demo .chat-pill"), "pigułka nowej wiadomości").toBeVisible({ timeout: 15_000 });

  await page.locator("#chat-demo .chat-pill").click();
  await page.waitForTimeout(600);
  const s = await lastActiveInView(page, SEL.heroLog);
  expect(s.typingVisible || s.ratio >= 0.9, `po kliku pigułki żywa krawędź w widoku (ratio ${s.ratio})`).toBe(true);
  await expect(log).toHaveAttribute("data-pinned", "true");
});
