/**
 * V7-F0: serwer statyczny buildu `out/` — wspólna warstwa serwowania dla
 * suit Playwright (:5343 via webServer) i Lighthouse (:5344).
 * Ekstrakcja 1:1 z qa-v6.mjs (MIME map, "/"→index.html, brak rozszerzenia→".html"),
 * żeby „konsola testów = konsola produkcyjna" (zero dev-serwerowego szumu).
 */
import { createServer } from "node:http";
import { readFile, access } from "node:fs/promises";
import { join, extname } from "node:path";

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webp": "image/webp", ".png": "image/png",
  ".svg": "image/svg+xml", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml",
};

export function createStaticServer({ root = "out", port = Number(process.env.PORT ?? 5343) } = {}) {
  const server = createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
      if (p.endsWith("/")) p += "index.html";
      if (!extname(p)) p += ".html";
      const body = await readFile(join(root, p));
      res.writeHead(200, { "content-type": MIME[extname(p)] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404).end("not found");
    }
  });
  return new Promise((resolve, reject) => {
    // reject zamiast wiecznego wisu przy zajętym porcie (EADDRINUSE)
    server.once("error", reject);
    server.listen(port, () => {
      server.removeListener("error", reject);
      resolve({ server, port, close: () => new Promise((r) => server.close(r)) });
    });
  });
}

// CLI: `npm run serve:out` (webServer Playwrighta woła dokładnie to)
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await access("out/index.html");
  } catch {
    console.error("Brak out/index.html — najpierw `npm run build` (static export).");
    process.exit(1);
  }
  const { port, close } = await createStaticServer({});
  console.log(`serving out/ on http://localhost:${port}`);
  const bye = async () => { await close(); process.exit(0); };
  process.on("SIGINT", bye);
  process.on("SIGTERM", bye);
}
