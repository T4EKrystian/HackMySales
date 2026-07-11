import { test, expect } from "@playwright/test";
import { gotoAndSettle } from "../helpers";

/** Agent qa-mobile: wszystkie klikalne cele ≥44×44 (hit-area, nie sam glif —
 *  liczy się bbox PLUS pseudo-element rozszerzający, stąd pomiar przez
 *  elementFromPoint na siatce wokół środka nie jest potrzebny: bbox + padding
 *  wystarcza, a znane rozszerzenia before:-inset dają realny bbox rodzica). */

test("cele dotykowe ≥44×44", async ({ page }) => {
  // Kontrakt F3 (D8): dziś 40 naruszeń — taby scenariuszy 28 px, S/M/L 30 px,
  // taby kanałów 20 px, logo 37 px, hamburger 40 px. Wzorce mobile WOW (segmented
  // control, snap-x z dots, sheet, powiększone hit-area) doprowadzą do ≥44 px.
  test.fail(true, "kontrakt F3: hit-area mobile ≥44 px (dziś 40 naruszeń)");

  await gotoAndSettle(page);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 800) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(50);
  }
  const viol = await page.evaluate(() => {
    const out: { tag: string; w: number; h: number; text: string }[] = [];
    document.querySelectorAll("a, button, [role='button'], input, summary").forEach((el) => {
      const st = getComputedStyle(el);
      if (st.display === "none" || st.visibility === "hidden") return;
      if ((el as HTMLElement).offsetParent === null && st.position !== "fixed") return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      // hit-area: bbox elementu ALBO najbliższego klikalnego rodzica-wrappera
      // (wzorce before:-inset-* powiększają strefę — mierzymy realny bbox + inset z ::before)
      let w = r.width;
      let h = r.height;
      const before = getComputedStyle(el, "::before");
      if (before.content !== "none" && before.position === "absolute") {
        const insetTop = Math.abs(parseFloat(before.top) || 0);
        const insetLeft = Math.abs(parseFloat(before.left) || 0);
        w += insetLeft * 2;
        h += insetTop * 2;
      }
      if (w < 44 || h < 44) {
        out.push({ tag: el.tagName.toLowerCase(), w: Math.round(w), h: Math.round(h), text: (el.textContent ?? "").trim().slice(0, 24) });
      }
    });
    return out.slice(0, 40);
  });
  expect(viol, `cele <44px: ${JSON.stringify(viol.slice(0, 10))}`).toHaveLength(0);
});
