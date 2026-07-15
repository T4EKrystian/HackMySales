import { test, expect } from "@playwright/test";
import { trackConsole } from "../helpers";

/** V7.1 BUG 1 — kolejność montowania hero-czatu: gotowa wiadomość NIGDY nie jest
 *  wyrenderowana (own-opacity, bbox) przed swoją fazą typingu. Brama
 *  `.js .chat-step .chat-msg{opacity:0}` + reveal silnika (fromTo autoAlpha) zamyka
 *  lukę, którą łapał pomiar „fill" klienta (6,7% f001 → 0,8% f005 → rośnie).
 *  Asercja: liczba own-widocznych .chat-msg rośnie MONOTONICZNIE od 0 — brak klatki
 *  „wiadomość istnieje → znika → wraca". (Desktop 1440: gra pełne okno ChatDemo.) */

test("hero-czat: pre-seed pierwszej wymiany + playback bez znikania (monotonicznie)", async ({ page }) => {
  const con = trackConsole(page);
  await page.goto("/", { waitUntil: "commit" });

  const seq: number[] = [];
  const t0 = Date.now();
  let seed = -1;
  // pre-seed (P0.1): pierwsza wymiana renderowana OD RAZU; próbkuj aż playback dołoży ≥1 ponad seed
  while (Date.now() - t0 < 12_000) {
    const c = await page.evaluate(
      () =>
        [...document.querySelectorAll("#chat-demo .chat-step .chat-msg")].filter(
          (el) => parseFloat(getComputedStyle(el).opacity) > 0.5 && el.getBoundingClientRect().height > 4
        ).length
    );
    seq.push(c);
    if (seed < 0) seed = c;
    if (c >= seed + 1) break;
    await page.waitForTimeout(80);
  }

  test.info().annotations.push({ type: "metric", description: `sekwencja own-widocznych .chat-msg: ${seq.join(",")}` });

  // (1) pre-seed: pierwsza wymiana widoczna OD RAZU (>0), ale TYLKO ona (nie cała rozmowa)
  expect(seq[0], `pre-seed pierwszej wymiany widoczny od razu (seq=${seq.join(",")})`).toBeGreaterThan(0);
  expect(seq[0], `seed = tylko pierwsza wymiana, nie cała rozmowa (seq=${seq.join(",")})`).toBeLessThanOrEqual(3);
  // (2) monotonicznie NIEMALEJĄCO — żadna wiadomość nie „znika" po pojawieniu
  for (let i = 1; i < seq.length; i++) {
    expect(seq[i], `klatka ${i}: wiadomość zniknęła (${seq[i - 1]}→${seq[i]}); seq=${seq.join(",")}`).toBeGreaterThanOrEqual(
      seq[i - 1]
    );
  }
  // (3) playback dołożył wiadomości PONAD seed (nie „pusty pass")
  expect(Math.max(...seq), `playback dołożył ≥1 ponad seed (seq=${seq.join(",")})`).toBeGreaterThan(seq[0]);
  expect(con, "konsola czysta").toHaveLength(0);
});
