/** V7-F0: porównanie screenshotów z baseline (pixelmatch, próg 0,5% — brief).
 *  Baseline COMMITOWANE w tests/visual/__baseline__/{project}/; bieżące + diffy
 *  w gitignorowanym qa/shots/{git-sha}/. Nowy baseline WYŁĄCZNIE świadomą
 *  komendą `npm run qa:visual:baseline` (VISUAL_BASELINE=1). */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const BASELINE_DIR = "tests/visual/__baseline__";
let sha: string | null = null;
function gitSha(): string {
  if (!sha) sha = execSync("git rev-parse --short HEAD").toString().trim();
  return sha;
}

export type CompareResult =
  | { status: "recorded"; baselinePath: string }
  | { status: "pass"; diffRatio: number }
  | { status: "fail"; diffRatio: number; diffPath: string; currentPath: string }
  | { status: "no-baseline"; currentPath: string };

/** Kopiuje lewy-górny prostokąt w×h do nowego PNG (wyrównanie wymiarów ±2 px). */
function cropTopLeft(src: PNG, w: number, h: number): PNG {
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    const srcStart = y * src.width * 4;
    const dstStart = y * w * 4;
    src.data.copy(out.data, dstStart, srcStart, srcStart + w * 4);
  }
  return out;
}

export async function compareOrRecord(o: { name: string; project: string; png: Buffer }): Promise<CompareResult> {
  const baselinePath = join(BASELINE_DIR, o.project, `${o.name}.png`);
  const currentDir = join("qa/shots", gitSha(), o.project);
  const currentPath = join(currentDir, `${o.name}.png`);
  await mkdir(currentDir, { recursive: true });
  await writeFile(currentPath, o.png);

  if (process.env.VISUAL_BASELINE === "1") {
    await mkdir(dirname(baselinePath), { recursive: true });
    await writeFile(baselinePath, o.png);
    return { status: "recorded", baselinePath };
  }

  let baseBuf: Buffer;
  try {
    baseBuf = await readFile(baselinePath);
  } catch {
    return { status: "no-baseline", currentPath };
  }

  let a = PNG.sync.read(baseBuf);
  let b = PNG.sync.read(o.png);
  if (a.width !== b.width || a.height !== b.height) {
    // Subpikselowe zaokrąglenie wysokości sekcji (±1-2 px run-to-run) to NIE regresja —
    // przycinamy oba do wspólnego prostokąta. Większa rozbieżność = realna zmiana layoutu.
    if (Math.abs(a.width - b.width) > 2 || Math.abs(a.height - b.height) > 2) {
      return { status: "fail", diffRatio: 1, diffPath: currentPath, currentPath };
    }
    const w = Math.min(a.width, b.width);
    const h = Math.min(a.height, b.height);
    a = cropTopLeft(a, w, h);
    b = cropTopLeft(b, w, h);
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const bad = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 });
  const diffRatio = bad / (a.width * a.height);
  if (diffRatio <= 0.005) return { status: "pass", diffRatio };

  const diffPath = join(currentDir, `${o.name}.diff.png`);
  await writeFile(diffPath, PNG.sync.write(diff));
  return { status: "fail", diffRatio, diffPath, currentPath };
}
