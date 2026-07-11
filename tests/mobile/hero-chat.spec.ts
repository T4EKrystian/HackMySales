import { test, expect } from "@playwright/test";

/** V7.1 — mobilny hero-czat (karta HeroChatMobile). Dwa kontrakty z nagrania klienta:
 *  BUG 1 (karta): teaser SPÓJNY w czasie — pytanie klienta + „Magda pisze" (dots),
 *     BEZ gotowej odpowiedzi bota obok pisania. Pełna odpowiedź gra w sheecie po tapie.
 *  BUG 3 (avatar): stała pozycja pionowa — karta jest w bramie `.js .hero-demo`,
 *     więc nie maluje się w pozycji naturalnej przed nałożeniem offsetu intro (skok
 *     „avatar spada"). Y avatara stabilne od pierwszej WIDOCZNEJ klatki. */

test("mobilny hero-czat: karta = pytanie + pisanie, bez gotowej odpowiedzi", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.evaluate(() => document.querySelector("#chat-demo .md\\:hidden")?.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(500);

  const card = await page.evaluate(() => {
    const c = document.querySelector("#chat-demo .md\\:hidden")!;
    const msgs = [...c.querySelectorAll(".chat-msg")].map((el) => (el.textContent ?? "").trim());
    const hasTyping = !!c.querySelector(".chat-typing");
    return { msgCount: msgs.length, hasTyping, msgs };
  });

  // dokładnie JEDNA bańka (pytanie klienta) + wskaźnik pisania; zero gotowej odpowiedzi
  expect(card.msgCount, `karta pokazuje 1 bańkę (pytanie), nie gotową odpowiedź: ${JSON.stringify(card.msgs)}`).toBe(1);
  expect(card.hasTyping, "karta pokazuje wskaźnik pisania (dots)").toBe(true);
});

test("mobilny hero-czat: avatar bez pionowego skoku w intro (Y stabilne)", async ({ page }) => {
  await page.goto("/", { waitUntil: "commit" });
  const ys: number[] = [];
  const t0 = Date.now();
  while (Date.now() - t0 < 2800) {
    const y = await page.evaluate(() => {
      const vis = (el: Element | null) => {
        let n: Element | null = el;
        while (n) {
          const st = getComputedStyle(n);
          if (st.display === "none" || st.visibility === "hidden" || parseFloat(st.opacity) < 0.05) return false;
          n = n.parentElement;
        }
        return true;
      };
      const im = [...document.querySelectorAll("#chat-demo img[src*='magda']")].find(vis);
      const box = im?.closest("span");
      return box ? Math.round(box.getBoundingClientRect().top) : null;
    });
    if (y != null) ys.push(y);
    await page.waitForTimeout(100);
  }

  expect(ys.length, "avatar był widoczny w oknie intro").toBeGreaterThan(3);
  const range = Math.max(...ys) - Math.min(...ys);
  // największy skok między kolejnymi WIDOCZNYMI klatkami (dawny „drop" = 52 px)
  let maxJump = 0;
  for (let i = 1; i < ys.length; i++) maxJump = Math.max(maxJump, Math.abs(ys[i] - ys[i - 1]));
  test.info().annotations.push({ type: "metric", description: `Y avatara: ${ys.join(",")} (zakres ${range}px, maxSkok ${maxJump}px)` });
  expect(range, `zakres pionowy avatara ${range}px ≤ 24 (dawniej ~52)`).toBeLessThanOrEqual(24);
  expect(maxJump, `brak skoku >24px między klatkami (max ${maxJump}px)`).toBeLessThanOrEqual(24);
});
