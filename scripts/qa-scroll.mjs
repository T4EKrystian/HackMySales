/**
 * V5-F3: test dwuprędkościowy kalibracji scrolla (motion-craft „Kalibracja scrubów").
 * Przejazd wheel-scrollem 1200 i 3000 px/s, klatki co 250 ms → qa/scroll/{v}/,
 * asercje: (a) każdy stan pinu ≥0,5 s @1200; (b) zero pustych ram wyszukiwarki;
 * (c) countery po przejeździe = wartości końcowe (data-final, SSR = deck);
 * (d) zero zduplikowanych H2; (e) dead-scroll ≤16 px.
 * Uruchom (dev na :5341): node scripts/qa-scroll.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = "http://localhost:5341";
const VP = { width: 1440, height: 960 };
const SPEEDS = [1200, 3000];
const TICK = 100; // ms między wheelami

const results = {};

const browser = await chromium.launch();

for (const speed of SPEEDS) {
  const dir = `qa/scroll/${speed}`;
  await mkdir(dir, { recursive: true });
  const page = await browser.newPage({ viewport: VP });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(3500); // fonty + refresh + GL idle-mount

  // ekspozycja stanów pinów: próbki co TICK — stan per sekcja + pustość ram demo
  const samples = [];
  let frame = 0;
  let lastShot = 0;
  const step = Math.round((speed * TICK) / 1000);

  const readState = () =>
    page.evaluate(() => {
      const q = (s) => document.querySelector(s);
      const vis = (el) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top < innerHeight && r.bottom > 0;
      };
      const op = (el) => (el ? parseFloat(getComputedStyle(el).opacity) : 0);
      // aktywne stany pinów
      const probIdx = [...document.querySelectorAll(".prob-rail-seg")].findIndex(
        (el) => el.dataset.active === "true"
      );
      const pillarIdx = [...document.querySelectorAll(".pillar-item")].findIndex(
        (el) => el.dataset.active === "true"
      );
      const roundNo = q(".arena-round-no")?.textContent ?? "";
      const howIdx = [...document.querySelectorAll(".how-progress-dot")].filter(
        (el) => el.dataset.active === "true"
      ).length;
      // pustość ramy wyszukiwarki (tylko gdy widoczna w viewporcie)
      const realUl = q(".pp-results");
      const skel = q(".pp-skel");
      let searchEmpty = false;
      if (realUl && vis(realUl.parentElement)) {
        const rows = [...realUl.querySelectorAll(".pp-row")];
        const rowsHidden = rows.length > 0 && rows.every((r) => op(r) < 0.05);
        const ulVisible = op(realUl) > 0.05;
        const skelVisible = op(skel) > 0.05;
        // pusta rama = widoczna rama bez wierszy i bez skeletonu
        searchEmpty = ulVisible && rowsHidden && !skelVisible;
        // rama „znikła" całkiem (ul i skel ukryte) też liczy się jako pusty frame
        if (!ulVisible && !skelVisible) searchEmpty = true;
      }
      return {
        y: scrollY,
        probIdx: vis(q(".prob-stage")) ? probIdx : -1,
        pillarIdx: vis(q(".pillar-stage")) ? pillarIdx : -1,
        round: vis(q(".arena-stage")) ? roundNo : "",
        howIdx: vis(q(".how-stage")) ? howIdx : -1,
        searchEmpty,
      };
    });

  // przejazd do dna — kursor na LEWYM marginesie (z dala od przewijalnych
  // kontenerów czatu z data-lenis-prevent, które łykają wheel przed stroną)
  await page.mouse.move(90, VP.height / 2);
  let atBottom = false;
  let t = 0;
  while (!atBottom && t < 240_000) {
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(TICK);
    t += TICK;
    samples.push({ t, ...(await readState()) });
    if (t - lastShot >= 250) {
      lastShot = t;
      await page.screenshot({ path: `${dir}/f${String(frame++).padStart(4, "0")}.jpg`, quality: 45, type: "jpeg" });
    }
    atBottom = await page.evaluate(
      () => Math.ceil(scrollY + innerHeight) >= document.body.scrollHeight - 2
    );
  }
  // dojazd + osiadanie snapów
  await page.waitForTimeout(1200);

  // (c) countery = data-final — tylko RENDEROWANE w tym viewporcie
  // (wariant mobilny Problemu = display:none na desktopie: ST bez geometrii,
  // nikt go nie widzi; po resize refresh+scrub dociąga wartości normalnie)
  const counters = await page.evaluate(() =>
    [...document.querySelectorAll("[data-counter]")]
      .filter((el) => el.offsetParent !== null)
      .map((el) => ({
        text: el.querySelector("[data-counter-num]")?.textContent ?? "",
        final: el.dataset.final,
      }))
  );
  const hiddenCounters = await page.evaluate(
    () => [...document.querySelectorAll("[data-counter]")].filter((el) => el.offsetParent === null).length
  );
  // prob-num (desktop pin, poza Counterem)
  const probNums = await page.evaluate(() =>
    [...document.querySelectorAll(".prob-num")].map((el) => el.textContent)
  );

  // (d) H2
  const h2 = await page.evaluate(() => {
    const t = [...document.querySelectorAll("h2")].map((h) => h.textContent.trim());
    return { count: t.length, dups: t.filter((x, i) => t.indexOf(x) !== i) };
  });

  // (e) dead-scroll na dnie
  const dead = await page.evaluate(() => {
    const f = document.querySelector("footer");
    return Math.round(Math.abs(f.getBoundingClientRect().bottom - innerHeight));
  });

  // ekspozycje stanów (ciągłe okna per stan)
  const dwell = (key) => {
    const out = {};
    let cur = null;
    let start = 0;
    for (const s of samples) {
      const v = String(s[key]);
      if (v !== cur) {
        if (cur !== null && cur !== "-1" && cur !== "" && cur !== "0")
          out[cur] = Math.max(out[cur] ?? 0, s.t - start);
        cur = v;
        start = s.t;
      }
    }
    return out;
  };

  results[speed] = {
    frames: frame,
    scrollMs: t,
    dwellProb: dwell("probIdx"),
    dwellPillar: dwell("pillarIdx"),
    dwellRound: dwell("round"),
    dwellHow: dwell("howIdx"),
    emptySearchFrames: samples.filter((s) => s.searchEmpty).length,
    counters,
    hiddenCounters,
    probNums,
    h2,
    dead,
  };
  await page.close();
}

await browser.close();

// ── Asercje ──────────────────────────────────────────────
let fail = 0;
const A = (ok, label) => {
  console.log(`${ok ? "✓" : "✗"} ${label}`);
  if (!ok) fail++;
};

for (const speed of SPEEDS) {
  const r = results[speed];
  console.log(`\n── ${speed} px/s — klatek: ${r.frames}, przejazd: ${(r.scrollMs / 1000).toFixed(1)} s`);
  if (speed === 1200) {
    const all = [r.dwellProb, r.dwellPillar, r.dwellRound, r.dwellHow];
    const min = Math.min(...all.flatMap((d) => Object.values(d)).filter((v) => v > 0));
    A(min >= 500, `(a) każdy stan pinu ≥0,5 s (min: ${min} ms) ${JSON.stringify(all.map((d) => d))}`);
  }
  A(r.emptySearchFrames === 0, `(b) puste ramy wyszukiwarki: ${r.emptySearchFrames}`);
  const badC = r.counters.filter((c) => c.text.replace(/\s/g, "") !== c.final.replace(/\s/g, ""));
  A(
    badC.length === 0,
    `(c) countery == final (widocznych: ${r.counters.length}, ukrytych wariantów: ${r.hiddenCounters}${badC.length ? " złe: " + JSON.stringify(badC) : ""})`
  );
  const expectedProb = ["98", "70", "16"];
  A(
    JSON.stringify(r.probNums) === JSON.stringify(expectedProb),
    `(c2) prob-num po przejeździe: ${JSON.stringify(r.probNums)}`
  );
  A(r.h2.dups.length === 0, `(d) duplikaty H2: ${JSON.stringify(r.h2.dups)} (h2: ${r.h2.count})`);
  A(r.dead <= 16, `(e) dead-scroll: ${r.dead} px`);
}

console.log(fail === 0 ? "\nZIELONO — obie prędkości." : `\nCZERWONO — ${fail} asercji padło.`);
process.exit(fail === 0 ? 0 : 1);
