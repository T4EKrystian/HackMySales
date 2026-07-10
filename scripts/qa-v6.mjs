/**
 * V6-F6: asercje choreografii (wejście 1,2 s + morph Kanałów) na PROD buildzie.
 * Serwuje out/ własnym serwerem statycznym (:5342), więc konsola = konsola produkcyjna.
 *
 * A — wejście:  A1 LCP = .hero-lead i <1200 ms; A2 lead opacity==1 przez 2,5 s;
 *   A3 kolejność beatów (dot-grid wjeżdża podczas intro, czat NIGDY przed intro);
 *   A4 gap intro→czat 350–1100 ms (proxy: .hero-demo==1 → pierwszy widoczny .chat-step;
 *   górka zawiera rampę fade dividera, stąd okno szersze niż samo wake 0,4 s);
 *   A5 kotwica /#kanaly: czat hero NIE startuje poza viewportem, startuje RAZ po powrocie;
 *   A6 późny chunk GL (delay 2,5 s): zero błędów, rdzeń dojeżdża bez wywrotki;
 *   A7 reduced-motion: zero <canvas>, zero pin-spacerów, czat statycznie widoczny.
 * B — Kanały:  B1 każda para skinów — switcher nigdy pusty w klatkach 0–950 ms;
 *   B2 „ten sam mózg": kotwiczne zdanie bota obecne w każdym skinie;
 *   B3 klik NODU: puls PRZED morphem (treść bez zmian ≤240 ms, zmieniona ≤900 ms);
 *   B4 click-storm 12×80 ms → jeden czysty stan + konsola 0/0;
 *   B5 po `seen` zero replay (żadnego .chat-typing po przełączeniu);
 *   B6 mobile 390: przełączenie fade, konsola czysto; B7 smoke Filarów.
 *
 * Uruchom: node scripts/qa-v6.mjs   (wymaga świeżego `npm run build` → out/)
 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, readdir, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";

const PORT = 5342;
const BASE = `http://localhost:${PORT}`;
const OUT = "out";
const ART = "qa/v6";
await mkdir(ART, { recursive: true });

// ── serwer statyczny out/ ────────────────────────────────
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webp": "image/webp", ".png": "image/png",
  ".svg": "image/svg+xml", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml",
};
const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, BASE).pathname);
    if (p.endsWith("/")) p += "index.html";
    if (!extname(p)) p += ".html";
    const body = await readFile(join(OUT, p));
    res.writeHead(200, { "content-type": MIME[extname(p)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
});
await new Promise((r) => server.listen(PORT, r));

// chunk z three.js (do testu późnego GL) — szukamy sygnatury w plikach chunków
const chunksDir = join(OUT, "_next/static/chunks");
let glChunk = null;
for (const f of await readdir(chunksDir)) {
  if (!f.endsWith(".js")) continue;
  const src = await readFile(join(chunksDir, f), "utf8");
  if (src.includes("WebGLRenderer")) { glChunk = f; break; }
}

// ── harness ──────────────────────────────────────────────
let fail = 0;
const A = (ok, label) => { console.log(`${ok ? "✓" : "✗"} ${label}`); if (!ok) fail++; };
const NOISE = /SwiftShader|GroupMarkerNotSet|Automatic fallback to software WebGL|GPU stall|Vulkan|WebGL context was lost/i;
const track = (page, bucket) => {
  page.on("console", (m) => {
    const t = m.type();
    if ((t === "error" || t === "warning") && !NOISE.test(m.text())) bucket.push(`${t}: ${m.text().slice(0, 160)}`);
  });
  page.on("pageerror", (e) => bucket.push(`pageerror: ${e.message.slice(0, 160)}`));
};
const op = (page, sel) =>
  page.evaluate((s) => {
    const el = document.querySelector(s);
    return el ? parseFloat(getComputedStyle(el).opacity) : -1;
  }, sel);

const browser = await chromium.launch();

// ── A1–A4: wejście ───────────────────────────────────────
{
  const con = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  track(page, con);
  await page.addInitScript(() => {
    window.__lcp = [];
    new PerformanceObserver((l) =>
      l.getEntries().forEach((e) =>
        window.__lcp.push({ t: Math.round(e.startTime), cls: String(e.element?.className ?? "") })
      )
    ).observe({ type: "largest-contentful-paint", buffered: true });
  });
  const t0 = Date.now();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });

  // A2/A3/A4: sondy co 50 ms przez 5 s
  const probes = [];
  let shots = 0;
  const SHOT_AT = [150, 600, 1300, 2200];
  while (Date.now() - t0 < 5000) {
    const t = Date.now() - t0;
    // jedna sonda = jeden evaluate — 4 osobne wywołania rozrzedzały próbkowanie
    // tak, że okno 150–350 ms bywało puste
    probes.push({
      t,
      ...(await page.evaluate(() => {
        const o = (s) => {
          const el = document.querySelector(s);
          return el ? parseFloat(getComputedStyle(el).opacity) : -1;
        };
        const els = [...document.querySelectorAll("#chat-demo .chat-step")];
        return {
          lead: o(".hero-lead"),
          bg: o(".hero-bg-el"),
          demo: o(".hero-demo"),
          step: els.length ? Math.max(...els.map((e) => parseFloat(getComputedStyle(e).opacity))) : -1,
        };
      })),
    });
    if (shots < SHOT_AT.length && t >= SHOT_AT[shots]) {
      await page.screenshot({ path: `${ART}/intro-${SHOT_AT[shots]}.png` });
      shots++;
    }
    await page.waitForTimeout(40);
  }
  const lcp = await page.evaluate(() => window.__lcp.at(-1));
  // kandydat LCP = treść hero malowana z SSR: linia H1 (.hero-line) albo lead
  A(lcp && /hero-(lead|line)/.test(lcp.cls) && lcp.t < 1200, `A1 LCP = treść hero (SSR), <1200 ms (${lcp?.t} ms, "${lcp?.cls}")`);

  const leadDips = probes.filter((p) => p.lead >= 0 && p.lead < 0.99);
  A(leadDips.length === 0, `A2 .hero-lead opacity==1 przez 5 s (dipów: ${leadDips.length})`);

  const bgMid = probes.find((p) => p.t >= 120 && p.t <= 450);
  const bgEnd = probes.find((p) => p.t >= 2400);
  const stepBefore = probes.filter((p) => p.t <= 1200 && p.step > 0.1);
  A(bgMid && bgMid.bg < 0.95, `A3a dot-grid w trakcie wjazdu przy ~${bgMid?.t} ms (op ${bgMid?.bg.toFixed(2)})`);
  A(bgEnd && bgEnd.bg >= 0.99, `A3b dot-grid dojechał (op ${bgEnd?.bg})`);
  A(stepBefore.length === 0, `A3c czat NIE gra przed końcem intro (widocznych kroków ≤1,2 s: ${stepBefore.length})`);

  // introEnd = domknięcie tweenu demo PO dipie (przed hydratacją SSR pokazuje 1 —
  // pierwszy sample z op≥0.99 to stan sprzed startu choreografii, nie jej koniec)
  const dipIdx = probes.findLastIndex((p) => p.demo >= 0 && p.demo < 0.5);
  const introEnd = dipIdx >= 0 ? probes.slice(dipIdx).find((p) => p.demo >= 0.99)?.t : undefined;
  const chatStart = probes.find((p) => p.step > 0.05)?.t;
  const gap = introEnd != null && chatStart != null ? chatStart - introEnd : NaN;
  A(gap >= 350 && gap <= 1100, `A4 gap intro→czat = ${gap} ms (intro ${introEnd} ms, czat ${chatStart} ms)`);
  A(con.length === 0, `A konsola czysta (${con.length})${con.length ? " " + JSON.stringify(con.slice(0, 3)) : ""}`);
  await page.close();
}

// ── A5: kotwica /#kanaly ─────────────────────────────────
{
  const con = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  track(page, con);
  await page.goto(`${BASE}/#kanaly`, { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  // ST słusznie odpala onEnter przy wejściu PONIŻEJ triggera (hero „minięte") —
  // legalne są oba stany: nie zaczął (op~0) albo gra/odegrał czysto (op~1).
  // Regresją byłby stan utknięty w połowie po osiadaniu lub podwójny start
  // (dublowanie kroków / brud w konsoli).
  const heroChat = () =>
    page.evaluate(() => {
      const els = [...document.querySelectorAll("#chat-demo .chat-step")];
      return {
        n: els.length,
        max: els.length ? Math.max(...els.map((e) => parseFloat(getComputedStyle(e).opacity))) : -1,
      };
    });
  const away = await heroChat();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(4500);
  const back = await heroChat();
  A(away.max < 0.05 || away.max > 0.9, `A5a kotwica: czat hero w spójnym stanie (max op ${away.max.toFixed(2)})`);
  A(back.max > 0.5, `A5b czat gra/odegrany po powrocie do hero (max op ${back.max.toFixed(2)})`);
  A(away.n === back.n, `A5c bez podwójnego startu — liczba kroków stała (${away.n} → ${back.n})`);
  A(con.length === 0, `A5 konsola czysta (${con.length})${con.length ? " " + JSON.stringify(con.slice(0, 3)) : ""}`);
  await page.close();
}

// ── A6: późny chunk GL ───────────────────────────────────
if (glChunk) {
  const con = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  track(page, con);
  await page.route(`**/${glChunk}`, async (route) => {
    await new Promise((r) => setTimeout(r, 2500));
    route.continue();
  });
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${ART}/lategl-1500.png` });
  await page.waitForTimeout(4500);
  await page.screenshot({ path: `${ART}/lategl-6000.png` });
  const canvas = await page.evaluate(() => !!document.querySelector("canvas"));
  A(canvas, `A6a canvas dojechał mimo delayu chunka (${glChunk})`);
  A(con.length === 0, `A6b konsola czysta przy późnym GL (${con.length})${con.length ? " " + JSON.stringify(con.slice(0, 3)) : ""}`);
  await page.close();
} else {
  A(false, "A6 nie znalazłem chunka three.js (WebGLRenderer) w out/");
}

// ── A7: reduced-motion ───────────────────────────────────
{
  const con = [];
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  track(page, con);
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const st = await page.evaluate(() => ({
    canvas: document.querySelectorAll("canvas").length,
    spacers: document.querySelectorAll(".pin-spacer").length,
    lead: parseFloat(getComputedStyle(document.querySelector(".hero-lead")).opacity),
    step: Math.max(...[...document.querySelectorAll("#chat-demo .chat-step")].map((e) => parseFloat(getComputedStyle(e).opacity))),
  }));
  A(st.canvas === 0, `A7a reduced: zero canvasów (${st.canvas})`);
  A(st.spacers === 0, `A7b reduced: zero pin-spacerów (${st.spacers})`);
  A(st.lead === 1 && st.step === 1, `A7c reduced: treść statycznie widoczna (lead ${st.lead}, czat ${st.step})`);
  A(con.length === 0, `A7 konsola czysta (${con.length})${con.length ? " " + JSON.stringify(con.slice(0, 3)) : ""}`);
  await ctx.close();
}

// ── B: Kanały (desktop) ──────────────────────────────────
{
  const con = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  track(page, con);
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  // celujemy w SAM SWITCHER (sekcja + ~800 px) — scroll do góry sekcji zostawiał
  // go pod linią startu ST i playback nigdy nie ruszał
  const swY = await page.evaluate(() => document.querySelector(".ch-switcher").getBoundingClientRect().top + scrollY);
  await page.evaluate((y) => window.scrollTo(0, y - 900), swY);
  await page.waitForTimeout(400);
  await page.evaluate((y) => window.scrollTo(0, y - 430), swY);

  // pełne odtworzenie (→ seen): finałem playbacku jest badge (data-role="badge")
  const played = await page
    .waitForFunction(
      () => {
        const b = document.querySelector('.ch-switcher [data-role="badge"]');
        return !!b && parseFloat(getComputedStyle(b).opacity) > 0.9;
      },
      { timeout: 45000 }
    )
    .then(() => true)
    .catch(() => false);
  if (!played) {
    const diag = await page.evaluate(() => {
      const steps = [...document.querySelectorAll(".ch-switcher .chat-step")];
      return steps.map((s) => `${s.dataset.role ?? "msg"}:${getComputedStyle(s).opacity}`).join(" ");
    });
    console.log(`   diag B0: ${diag}`);
  }
  A(played, "B0 rozmowa w Kanałach odegrała się do końca (→ seen)");

  // B2 zdanie-kotwica z pierwszego bota (skin onsite)
  const anchor = await page.evaluate(() => {
    const s = [...document.querySelectorAll(".ch-switcher .chat-step")].map((e) => e.innerText.trim()).filter((t) => t.length > 30);
    return s[0]?.slice(0, 40) ?? "";
  });

  const probeSwitcher = () =>
    page.evaluate(() => {
      const sw = document.querySelector(".ch-switcher");
      const frame = sw?.querySelector('[data-flip-id="ch-frame"]');
      const vis = (els) => els.filter((e) => parseFloat(getComputedStyle(e).opacity) > 0.5).length;
      // innerText pomija visibility:hidden (autoAlpha) i display:none — czyli
      // mierzy TEKST FAKTYCZNIE WIDOCZNY (header emaila jest statyczny → rama
      // podczas morphu nigdy nie jest wizualnie pusta)
      const visText = (sw?.innerText ?? "").replace(/\s+/g, " ").trim();
      return {
        h: frame ? Math.round(frame.getBoundingClientRect().height) : 0,
        steps: vis([...(sw?.querySelectorAll(".chat-step") ?? [])]),
        lines: vis([...(sw?.querySelectorAll(".nm-line, .nm-link") ?? [])]),
        textLen: visText.length,
        text: visText.slice(0, 4000),
      };
    });

  // B1+B2: każda para przełączeń przez taby
  const tabs = page.locator('#kanaly [role="group"] button');
  let emptyFrames = 0;
  let anchorMisses = [];
  for (const target of [1, 2, 3, 0]) {
    await tabs.nth(target).click();
    const tStart = Date.now();
    while (Date.now() - tStart < 950) {
      const p = await probeSwitcher();
      if (!(p.h > 120 && p.textLen >= 20)) emptyFrames++;
      await page.waitForTimeout(110);
    }
    const after = await probeSwitcher();
    if (!after.text.includes(anchor.replace(/\s+/g, " "))) anchorMisses.push(target);
  }
  A(emptyFrames === 0, `B1 switcher nigdy pusty w klatkach 0–950 ms (pustych: ${emptyFrames})`);
  A(anchorMisses.length === 0, `B2 „ten sam mózg" — kotwica bota w każdym skinie (brak w: ${JSON.stringify(anchorMisses)}; kotwica: "${anchor}")`);

  // B5: po seen zero replay — po przełączeniu nie pojawia się .chat-typing
  await tabs.nth(1).click();
  // typing „widoczny" = renderowany (offsetParent) I nieprzezroczysty — static
  // chowa dots przez display:none, więc samo computed opacity==1 to nie replay
  let typingSeen = false;
  for (let t = 0; t < 2000; t += 150) {
    typingSeen ||= await page.evaluate(() =>
      [...document.querySelectorAll(".ch-switcher .chat-typing")].some(
        (el) => el.offsetParent !== null && parseFloat(getComputedStyle(el).opacity) > 0.1
      )
    );
    await page.waitForTimeout(150);
  }
  A(!typingSeen, "B5 po `seen` przełączenie bez replay (zero .chat-typing)");

  // B3: klik NODU (email, idx 3) — puls PRZED morphem
  await tabs.nth(0).click();
  await page.waitForTimeout(1500);
  const before = await probeSwitcher();
  await page.locator(".ch-node button").nth(3).click();
  await page.waitForTimeout(200);
  const at200 = await probeSwitcher();
  await page.waitForTimeout(700);
  const at900 = await probeSwitcher();
  const unchanged200 = at200.text === before.text;
  const changed900 = at900.text !== before.text && at900.lines + at900.steps > 0;
  A(unchanged200, `B3a puls najpierw: treść bez zmian po 200 ms od kliku nodu`);
  A(changed900, `B3b morph potem: treść zmieniona ≤900 ms (steps ${at900.steps}, lines ${at900.lines})`);

  // B4: click-storm 12×80 ms
  for (let i = 0; i < 12; i++) {
    await tabs.nth(i % 4).click({ force: true });
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(2200);
  const storm = await probeSwitcher();
  const pressed = await page.evaluate(() =>
    [...document.querySelectorAll('#kanaly [role="group"] button')].filter((b) => b.getAttribute("aria-pressed") === "true").length
  );
  A(storm.h > 120 && storm.steps + storm.lines > 0 && pressed === 1, `B4 click-storm → jeden czysty stan (h ${storm.h}, widoczne ${storm.steps + storm.lines}, pressed ${pressed})`);

  // B7: smoke Filarów (opt-in flip props bez regresji sąsiadów)
  const pillY = await page.evaluate(() => document.querySelector("#produkt").getBoundingClientRect().top + scrollY);
  await page.evaluate((y) => window.scrollTo(0, y - 400), pillY);
  await page.waitForTimeout(300);
  await page.evaluate((y) => window.scrollTo(0, y + 300), pillY);
  await page.waitForTimeout(2000);
  const pill = await page.evaluate(() => ({
    items: document.querySelectorAll(".pillar-item").length,
    shell: !!document.querySelector(".pillar-stage [role='log'], .pillar-stage .pp-results"),
  }));
  A(pill.items >= 3 && pill.shell, `B7 Filary żyją (items ${pill.items}, shell ${pill.shell})`);

  A(con.length === 0, `B konsola czysta (${con.length})${con.length ? " " + JSON.stringify(con.slice(0, 4)) : ""}`);
  await page.close();
}

// ── B6: mobile 390 ───────────────────────────────────────
{
  const con = [];
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  track(page, con);
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const kanY = await page.evaluate(() => document.querySelector("#kanaly").getBoundingClientRect().top + scrollY);
  await page.evaluate((y) => window.scrollTo(0, y - 200), kanY);
  await page.waitForTimeout(1200);
  const swY = await page.evaluate(() => document.querySelector(".ch-switcher").getBoundingClientRect().top + scrollY);
  await page.evaluate((y) => window.scrollTo(0, y - 350), swY);
  await page.waitForTimeout(1000);
  await page.locator('#kanaly [role="group"] button').nth(2).click();
  await page.waitForTimeout(400);
  const st = await page.evaluate(() => {
    const sw = document.querySelector(".ch-switcher");
    return { text: (sw?.innerText ?? "").length, h: Math.round(sw?.getBoundingClientRect().height ?? 0) };
  });
  A(st.text > 40 && st.h > 120, `B6 mobile 390: przełączenie fade, treść jest (len ${st.text}, h ${st.h})`);
  A(con.length === 0, `B6 konsola czysta (${con.length})${con.length ? " " + JSON.stringify(con.slice(0, 3)) : ""}`);
  await page.close();
}

await browser.close();
server.close();
console.log(fail === 0 ? "\nZIELONO — choreografia V6." : `\nCZERWONO — ${fail} asercji padło.`);
process.exit(fail === 0 ? 0 : 1);
