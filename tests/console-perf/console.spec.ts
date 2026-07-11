import { test, expect } from "@playwright/test";
import { gotoAndSettle, ride, trackConsole, installLongTasks, readLongTasks, SEL } from "../helpers";
import { mkdir, writeFile } from "node:fs/promises";

/** Agent qa-console-perf: konsola 0 errors / 0 warnings na PEŁNYM przebiegu
 *  z interakcjami; long tasks >200 ms raportowane (report-only — brief). */

test("konsola 0/0 na pełnym przejeździe + interakcje", async ({ page }, testInfo) => {
  test.slow();
  const con = trackConsole(page);
  await installLongTasks(page);
  await gotoAndSettle(page, "/", 3000);

  await ride(page, { speed: 1200 });

  // interakcje na dnie: taby Kanałów (desktop ma switcher; mobile też renderuje taby)
  const tabs = page.locator(SEL.chTabs);
  if ((await tabs.count()) >= 4) {
    const swY = await page.evaluate(
      (sel) => document.querySelector(sel)!.getBoundingClientRect().top + scrollY,
      SEL.switcher
    );
    await page.evaluate((y) => window.scrollTo(0, y - 400), swY);
    await page.waitForTimeout(800);
    for (const i of [1, 2, 3, 0]) {
      await tabs.nth(i).click();
      await page.waitForTimeout(600);
    }
  }

  // long tasks — raport do qa/perf/ + adnotacja (bez twardego progu; env LT_FAIL_MS wymusza)
  const lt = (await readLongTasks(page)).filter((t) => t.duration > 200);
  await mkdir("qa/perf", { recursive: true });
  await writeFile(`qa/perf/longtasks-${testInfo.project.name}.json`, JSON.stringify(lt, null, 2));
  testInfo.annotations.push({ type: "longtasks>200ms", description: `${lt.length} szt.: ${JSON.stringify(lt.slice(0, 5))}` });
  const failMs = Number(process.env.LT_FAIL_MS ?? 0);
  if (failMs > 0) {
    const over = lt.filter((t) => t.duration > failMs);
    expect(over, `long tasks > ${failMs} ms`).toHaveLength(0);
  }

  expect(con, `konsola: ${JSON.stringify(con.slice(0, 6))}`).toHaveLength(0);
});
