/** Postbuild: wstrzykuje <link rel="preload"> dla krytycznych fontów (latin + latin-ext
 *  dla Schibsted Grotesk i Inter) do out/index.html. Mobile-throttled LCP jest gated
 *  swapem fontów — preload ściąga repaint o ~2 s (premium-audit / Lighthouse F5).
 *  Zero zależności: czyta URL-e wprost ze zbudowanego CSS (hashe zawsze aktualne). */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const cssDir = join(OUT, "_next", "static", "css");
const css = readdirSync(cssDir)
  .filter((f) => f.endsWith(".css"))
  .map((f) => readFileSync(join(cssDir, f), "utf8"))
  .join("\n");

const wanted = /\/_next\/static\/media\/(?:schibsted-grotesk|inter)-latin(?:-ext)?-wght-normal\.[a-z0-9]+\.woff2/g;
const fonts = [...new Set(css.match(wanted) ?? [])];

if (!fonts.length) {
  console.warn("[postbuild-preload] nie znalazłem fontów w CSS — pomijam");
  process.exit(0);
}

const links = fonts
  .map((href) => `<link rel="preload" href="${href}" as="font" type="font/woff2" crossorigin=""/>`)
  .join("");

for (const page of ["index.html", "404.html"]) {
  const path = join(OUT, page);
  try {
    const html = readFileSync(path, "utf8");
    if (html.includes('as="font"')) continue; // idempotentnie
    writeFileSync(path, html.replace("</head>", `${links}</head>`));
  } catch {
    /* strona może nie istnieć — ok */
  }
}
console.log(`[postbuild-preload] wstrzyknięto ${fonts.length} preloadów:`, fonts.map((f) => f.split("/").pop()).join(", "));
