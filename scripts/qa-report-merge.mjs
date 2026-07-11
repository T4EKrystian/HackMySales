/**
 * V7-F0: sklejanie docs/qa-report.md z sekcji agentów QA.
 * Agenci mają tylko Bash/Read/Grep/Glob — sekcję piszą do pliku tymczasowego
 * i scalają TYM skryptem (idempotentna podmiana między markerami):
 *   node scripts/qa-report-merge.mjs --section interactions --status PASS --file qa/report-sections/interactions.md
 *   node scripts/qa-report-merge.mjs --summary
 * `--summary` przelicza tabelę nagłówka ze statusów sekcji i stawia werdykt.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { execSync } from "node:child_process";

const REPORT = "docs/qa-report.md";
const AGENTS = ["interactions", "scroll", "mobile", "visual", "console-perf"];

const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};

const TEMPLATE = `# QA Report — HackMySales landing

Raport sklejany przez agentów QA (\`/qa-all\`). Sekcje między markerami są
podmieniane automatycznie — nie edytować ręcznie wewnątrz markerów.

<!-- qa:summary:start -->
_Brak pełnego przebiegu._
<!-- qa:summary:end -->

${AGENTS.map((a) => `<!-- qa:${a}:start -->\n## ${a} — brak przebiegu\n<!-- qa:${a}:end -->`).join("\n\n")}
`;

async function loadReport() {
  try {
    return await readFile(REPORT, "utf8");
  } catch {
    await mkdir("docs", { recursive: true });
    return TEMPLATE;
  }
}

function replaceBlock(doc, name, body) {
  const start = `<!-- qa:${name}:start -->`;
  const end = `<!-- qa:${name}:end -->`;
  const re = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!re.test(doc)) return `${doc}\n\n${start}\n${body}\n${end}\n`;
  return doc.replace(re, `${start}\n${body}\n${end}`);
}

let doc = await loadReport();

const section = get("--section");
if (section) {
  if (!AGENTS.includes(section)) {
    console.error(`Nieznana sekcja "${section}" (dozwolone: ${AGENTS.join(", ")})`);
    process.exit(1);
  }
  const status = get("--status") ?? "UNKNOWN";
  const file = get("--file");
  const body = file ? (await readFile(file, "utf8")).trim() : `## ${section} — ${status}`;
  const stamped = `${body}\n\n_status: ${status} · ${new Date().toISOString().slice(0, 16).replace("T", " ")} · ${execSync("git rev-parse --short HEAD").toString().trim()}_`;
  doc = replaceBlock(doc, section, stamped);
  await writeFile(REPORT, doc);
  console.log(`OK: sekcja "${section}" (${status}) scalona do ${REPORT}`);
  process.exit(0);
}

if (args.includes("--summary")) {
  const statuses = AGENTS.map((a) => {
    const m = doc.match(new RegExp(`<!-- qa:${a}:start -->[\\s\\S]*?_status: (\\w[\\w-]*)`, ""));
    return { agent: a, status: m?.[1] ?? "BRAK" };
  });
  const buildFail = args.includes("--build-fail");
  const red = buildFail || statuses.some((s) => s.status !== "PASS");
  const table = [
    "| Agent | Wynik |",
    "|---|---|",
    ...statuses.map((s) => `| qa-${s.agent} | ${s.status} |`),
  ].join("\n");
  const verdict = red
    ? "**Werdykt: CZERWONO — zadania NIE WOLNO oznaczyć jako done.**"
    : "**Werdykt: ZIELONO.**";
  const head = `Ostatni pełny przebieg: ${new Date().toISOString().slice(0, 16).replace("T", " ")} · ${execSync("git rev-parse --short HEAD").toString().trim()}${buildFail ? " · **BUILD FAIL**" : ""}\n\n${table}\n\n${verdict}`;
  doc = replaceBlock(doc, "summary", head);
  await writeFile(REPORT, doc);
  console.log(red ? "CZERWONO" : "ZIELONO");
  process.exit(0);
}

console.error("Użycie: --section <name> --status <PASS|FAIL> --file <md>  |  --summary [--build-fail]");
process.exit(1);
