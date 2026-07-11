import { test, expect } from "@playwright/test";
import { gotoAndSettle } from "../helpers";
import { compareOrRecord } from "./compare";

/** Agent qa-visual: screenshot każdej sekcji (desktop+mobile) vs baseline.
 *  Kontekst reduced-motion (projekty visual-*) → deterministyczne piksele:
 *  zero canvasów GL, pinów, playbacków; stany ruchu pokrywa scroll-suite. */

test("sekcje vs baseline (pixelmatch ≤0,5%)", async ({ page }, testInfo) => {
  test.slow();
  // Jawne wymuszenie reduced-motion (config use.reducedMotion bywa nieaplikowane) —
  // gwarantuje statyczny stan: GLStage nie montuje canvasu, czat pokazuje wszystkie
  // kroki od razu (gałąź REDUCE), reveals bez animacji → screenshoty deterministyczne.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await gotoAndSettle(page, "/", 3000);

  // Maskuj NIEDETERMINISTYCZNĄ dekorację: rdzeń cząstek GL dryfuje między
  // przebiegami (halo wokół czatu = fałszywy diff), grain to warstwa filmowa.
  // Visual-regression testuje CONTENT/LAYOUT, nie szum — obecność GL waliduje
  // qa-console-perf. visibility:hidden zachowuje layout (canvas jest fixed).
  await page.addStyleTag({
    content: `canvas, .grain { visibility: hidden !important; }`,
  });

  // Rozgrzewka: przejedź całą stronę, żeby wyzwolić WSZYSTKIE reveals, lazy-mounty
  // i kaskady stanu (Channels: play→setDone→quickReplies→setSeen zmienia wysokość
  // switchera PO pierwszym paincie). Bez tego stitch tall-elementu łapie sekcję
  // w trakcie osiadania → kumulatywny dryf pionowy = fałszywy diff.
  const pageH = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < pageH; y += 600) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);

  const ids = await page.evaluate(() =>
    [
      "header",
      ...[...document.querySelectorAll("main > section")].map(
        (s, i) => (s.id ? `#${s.id}` : s.getAttribute("data-ambient") ? `[data-ambient="${s.getAttribute("data-ambient")}"]` : `main > section:nth-of-type(${i + 1})`)
      ),
      "footer",
    ]
  );

  // czeka aż wysokość elementu będzie STABILNA (2 kolejne odczyty równe) — gwarancja,
  // że layout osiadł zanim tall-element zostanie zestitchowany
  const waitStableHeight = async (sel: string) => {
    let prev = -1;
    for (let i = 0; i < 12; i++) {
      const h = await page.locator(sel).first().evaluate((el) => Math.round(el.getBoundingClientRect().height));
      if (h === prev) return;
      prev = h;
      await page.waitForTimeout(150);
    }
  };

  const failures: string[] = [];
  const recorded: string[] = [];
  for (const sel of ids) {
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded();
    await waitStableHeight(sel);
    await page.waitForTimeout(250);
    const png = await el.screenshot({ animations: "disabled" });
    const name = sel.replace(/[^a-z0-9-]+/gi, "_");
    const r = await compareOrRecord({ name, project: testInfo.project.name, png });
    if (r.status === "fail") failures.push(`${name}: diff ${(r.diffRatio * 100).toFixed(2)}% → ${r.diffPath}`);
    if (r.status === "no-baseline") failures.push(`${name}: BRAK BASELINE → nagraj: npm run qa:visual:baseline (bieżący: ${r.currentPath})`);
    if (r.status === "recorded") recorded.push(name);
  }
  if (recorded.length) testInfo.annotations.push({ type: "baseline", description: `nagrano: ${recorded.length} sekcji` });
  expect(failures, failures.join("\n")).toHaveLength(0);
});
