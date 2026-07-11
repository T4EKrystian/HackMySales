import { test, expect } from "@playwright/test";
import { trackConsole } from "../helpers";

/** V7.1 BUG 1 — kolejność montowania hero-czatu: gotowa wiadomość NIGDY nie jest
 *  wyrenderowana (own-opacity, bbox) przed swoją fazą typingu. Brama
 *  `.js .chat-step .chat-msg{opacity:0}` + reveal silnika (fromTo autoAlpha) zamyka
 *  lukę, którą łapał pomiar „fill" klienta (6,7% f001 → 0,8% f005 → rośnie).
 *  Asercja: liczba own-widocznych .chat-msg rośnie MONOTONICZNIE od 0 — brak klatki
 *  „wiadomość istnieje → znika → wraca". (Desktop 1440: gra pełne okno ChatDemo.) */

test("hero-czat: montaż = typing → wiadomość, nigdy odwrotnie (monotonicznie od 0)", async ({ page }) => {
  const con = trackConsole(page);
  await page.goto("/", { waitUntil: "commit" });

  const seq: number[] = [];
  const t0 = Date.now();
  // próbkuj od mountu aż playback odsłoni ≥2 wiadomości (albo 12 s bezpiecznika)
  while (Date.now() - t0 < 12_000) {
    const c = await page.evaluate(
      () =>
        [...document.querySelectorAll("#chat-demo .chat-step .chat-msg")].filter(
          (el) => parseFloat(getComputedStyle(el).opacity) > 0.5 && el.getBoundingClientRect().height > 4
        ).length
    );
    seq.push(c);
    if (c >= 2) break;
    await page.waitForTimeout(80);
  }

  test.info().annotations.push({ type: "metric", description: `sekwencja own-widocznych .chat-msg: ${seq.join(",")}` });

  // (1) pierwsza klatka: ZERO gotowych wiadomości (brak błysku pełnej wiadomości)
  expect(seq[0], `pierwsza klatka bez gotowych wiadomości (seq=${seq.join(",")})`).toBe(0);
  // (2) monotonicznie NIEMALEJĄCO — żadna wiadomość nie „znika" po pojawieniu
  for (let i = 1; i < seq.length; i++) {
    expect(seq[i], `klatka ${i}: wiadomość zniknęła (${seq[i - 1]}→${seq[i]}); seq=${seq.join(",")}`).toBeGreaterThanOrEqual(
      seq[i - 1]
    );
  }
  // (3) playback faktycznie odsłonił wiadomości (nie „pusty pass")
  expect(Math.max(...seq), "playback odsłonił ≥1 wiadomość").toBeGreaterThanOrEqual(1);
  expect(con, "konsola czysta").toHaveLength(0);
});
