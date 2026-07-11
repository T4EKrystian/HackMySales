import { defineConfig } from "@playwright/test";

/** V7-F0: suity agentów QA. Biegną na buildzie statycznym (:5343, serve-out) —
 *  konsola = konsola produkcyjna. workers:1 — wspólny serwer + timing GSAP/scroll.
 *  Mobile BEZ isMobile (czysty viewport, spójność z sondami qa-v6 B6). */

const DESKTOP = { viewport: { width: 1440, height: 900 } };
const MOBILE = { viewport: { width: 390, height: 844 }, hasTouch: true };

export default defineConfig({
  testDir: "tests",
  outputDir: "qa/test-results",
  fullyParallel: false,
  workers: 1,
  timeout: 120_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["json", { outputFile: "qa/last-run.json" }]],
  use: {
    baseURL: "http://localhost:5343",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node scripts/serve-out.mjs",
    port: 5343,
    reuseExistingServer: true,
    timeout: 15_000,
  },
  projects: [
    { name: "interactions", testMatch: "interactions/**/*.spec.ts", use: DESKTOP },
    { name: "scroll-desktop", testMatch: "scroll/**/*.spec.ts", use: DESKTOP },
    { name: "scroll-mobile", testMatch: "scroll/**/*.spec.ts", use: MOBILE },
    { name: "mobile", testMatch: "mobile/**/*.spec.ts", use: MOBILE },
    { name: "visual-desktop", testMatch: "visual/**/*.spec.ts", use: { ...DESKTOP, reducedMotion: "reduce" } },
    { name: "visual-mobile", testMatch: "visual/**/*.spec.ts", use: { ...MOBILE, reducedMotion: "reduce" } },
    { name: "console-desktop", testMatch: "console-perf/**/*.spec.ts", use: DESKTOP },
    { name: "console-mobile", testMatch: "console-perf/**/*.spec.ts", use: MOBILE },
  ],
});
