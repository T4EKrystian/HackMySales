import type { Metadata } from "next";
import { Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import {
  SectionShell,
  Eyebrow,
  Card,
  Folio,
  CheckGlyph,
  HeroGridTexture,
} from "@/components/ui/kit";

export const metadata: Metadata = {
  title: "Style Tile — HackMySales (Paper / Forest / Acid)",
  robots: { index: false, follow: false },
};

const PL_DIACRITICS = "ąęśżźółćń ĄĘŚŻŹÓŁĆŃ";

const PALETTE: { name: string; token: string; hex: string; dark?: boolean; ring?: boolean }[] = [
  { name: "paper", token: "--paper", hex: "#F7F5EF", ring: true },
  { name: "paper-deep", token: "--paper-deep", hex: "#EFEBE0", ring: true },
  { name: "sage-200", token: "--sage-200", hex: "#D8DFD3", ring: true },
  { name: "ink", token: "--ink", hex: "#101613", dark: true },
  { name: "ink-soft", token: "--ink-soft", hex: "#3D4640", dark: true },
  { name: "ink-mute", token: "--ink-mute", hex: "#6B756E", dark: true },
  { name: "forest-950", token: "--forest-950", hex: "#0A1F16", dark: true },
  { name: "forest-900", token: "--forest-900", hex: "#0E2A1E", dark: true },
  { name: "forest-700", token: "--forest-700", hex: "#1C4632", dark: true },
  { name: "acid", token: "--acid", hex: "#D6F94B" },
  { name: "acid-press", token: "--acid-press", hex: "#C4EB35" },
];

// Hero w obu polaryzacjach — decyzja użytkownika (STOP-GATE 2)
function HeroVariant({ tone }: { tone: "paper" | "forest" }) {
  const forest = tone === "forest";
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border p-8 sm:p-10 ${
        forest ? "bg-forest-950 text-onforest border-transparent" : "bg-page text-ink border-hairline"
      }`}
    >
      {forest && <div className="noise-forest" aria-hidden="true" />}
      <HeroGridTexture onForest={forest} />
      <div className="relative z-[1]">
        <Eyebrow className={forest ? "text-onforest/60" : ""}>Doradca AI dla e-commerce</Eyebrow>
        <h2
          className="mt-5 font-display font-semibold"
          style={{ fontSize: "clamp(2rem, 4.2vw, 3.1rem)", lineHeight: 0.98, letterSpacing: "-0.03em" }}
        >
          Twój sklep śpi.{" "}
          <em className="font-serif font-normal italic">Twoja sprzedaż</em> nie&nbsp;musi.
        </h2>
        <p className={`mt-5 max-w-[46ch] text-[1.0625rem] ${forest ? "text-onforest/75" : "text-sub"}`}>
          Magda rozmawia z klientami jak najlepszy sprzedawca — 24/7 — i&nbsp;domyka sprzedaż,
          zanim klient zdąży wyjść.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button variant="primary" size="lg">
            Wypróbuj za darmo
          </Button>
          <span className={`text-[0.95rem] ${forest ? "text-onforest/70" : "text-sub"}`}>
            Zobacz demo · 2&nbsp;min
          </span>
        </div>
        <p className={`mt-6 text-[0.85rem] ${forest ? "text-onforest/55" : "text-mute"}`}>
          Bez karty · Wdrożenie w&nbsp;15&nbsp;minut · Zgodne z&nbsp;RODO
        </p>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-2 border-t border-hairline py-6 sm:grid-cols-[10rem_1fr] sm:gap-6">
      <div className="pt-1">
        <Eyebrow>{label}</Eyebrow>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function StyleTile() {
  return (
    <main className="bg-page pb-32 text-ink">
      {/* HEADER */}
      <SectionShell tone="paper" className="!pb-0">
        <Container>
          <Eyebrow>Style tile · system projektowy</Eyebrow>
          <h1
            className="mt-4 font-display font-semibold text-ink"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: 0.98, letterSpacing: "-0.035em" }}
          >
            Paper <span className="text-mute">/</span> Forest{" "}
            <span className="acid-mark">Acid</span>
          </h1>
          <p className="mt-4 max-w-[60ch] text-sub">
            Fundament wizualny redesignu HackMySales. Ciepła biel-papier, pasma leśne i&nbsp;jeden
            akcent kwasowy jako zakreślacz Magdy — nie jako wypełnienie.
          </p>
        </Container>
      </SectionShell>

      {/* HERO POLARITY — decyzja: papier vs las */}
      <SectionShell tone="paper">
        <Container>
          <Row label="Hero — polaryzacja">
            <p className="mb-6 text-sm text-mute">
              Ta sama treść w&nbsp;dwóch trybach. Który ma być domyślnym hero strony głównej?
            </p>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <HeroVariant tone="paper" />
              <HeroVariant tone="forest" />
            </div>
          </Row>
        </Container>
      </SectionShell>

      {/* PALETA */}
      <SectionShell tone="paper" className="!py-0">
        <Container>
          <Row label="Paleta">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {PALETTE.map((s) => (
                <div
                  key={s.token}
                  className={`rounded-md p-3 ${s.ring ? "border border-hairline" : ""}`}
                  style={{ background: `var(${s.token})` }}
                >
                  <div className="h-12" />
                  <div className={`num text-[0.8125rem] ${s.dark ? "text-onforest" : "text-ink"}`}>
                    {s.name}
                  </div>
                  <div className={`num text-[0.6875rem] ${s.dark ? "text-onforest/70" : "text-mute"}`}>
                    {s.hex}
                  </div>
                </div>
              ))}
            </div>
          </Row>
        </Container>
      </SectionShell>

      {/* TYPOGRAFIA */}
      <SectionShell tone="paper" className="!py-0">
        <Container>
          <Row label="Hero — pełna skala">
            <h2
              className="font-display font-semibold text-ink"
              style={{ fontSize: "var(--text-hero)", lineHeight: 0.98, letterSpacing: "-0.035em" }}
            >
              Twój sklep śpi.{" "}
              <em className="font-serif font-normal italic">Twoja&nbsp;sprzedaż</em> nie&nbsp;musi.
            </h2>
          </Row>
          <Row label="H2 · Fraunces italic">
            <p className="t-h2 font-display font-semibold text-ink">
              68% koszyków jest porzucanych. <em className="font-serif font-normal italic">Magda</em>{" "}
              odpowiada, zanim&nbsp;klient zdąży&nbsp;wyjść.
            </p>
          </Row>
          <Row label="H3">
            <p className="t-h3 font-display font-medium text-ink">Sprzedaje, nie tylko odpowiada</p>
          </Row>
          <Row label="Lead">
            <p className="t-lead max-w-[62ch] text-sub">
              Widzi stany magazynowe na żywo, zna cały katalog i&nbsp;prowadzi klienta do zakupu —
              tonem Twojej marki.
            </p>
          </Row>
          <Row label="Body">
            <p className="max-w-[62ch] text-ink">
              Magda podłącza się do sklepu w&nbsp;15&nbsp;minut i&nbsp;uczy się oferty. Każda rozmowa
              kończy się rekomendacją produktu albo płynnym przejściem do&nbsp;człowieka — bez
              zmyślania, wyłącznie na&nbsp;podstawie Twojego katalogu.
            </p>
          </Row>
          <Row label="Caption / eyebrow">
            <Eyebrow>Doradca AI dla e-commerce · od 2017</Eyebrow>
          </Row>
          <Row label="Stat · mono">
            <div className="flex flex-wrap items-end gap-8">
              <span className="t-stat text-ink">
                +23<span className="text-sub">%</span>
              </span>
              <span className="t-stat text-ink">4&nbsp;500</span>
              <span className="t-stat text-ink">
                &lt;3<span className="text-sub"> s</span>
              </span>
            </div>
            <p className="mt-3 text-[0.8125rem] text-mute">
              Na papierze cyfry są atramentem (mono). Tint kwasowy na jednostce żyje tylko na pasmie
              leśnym — patrz niżej.
            </p>
          </Row>
          <Row label="Zakreślacz kwasowy">
            <p className="max-w-[62ch] text-[1.4rem] leading-snug text-ink">
              Magda odpowiada, <span className="acid-mark">zanim klient zdąży wyjść</span> — i&nbsp;robi
              to tonem Twojej&nbsp;marki.
            </p>
          </Row>
        </Container>
      </SectionShell>

      {/* DIAKRYTYKI — obie rodziny × 2 rozmiary */}
      <SectionShell tone="deep">
        <Container>
          <Row label="Diakrytyki PL">
            <div className="space-y-6">
              <div>
                <Eyebrow>General Sans · display</Eyebrow>
                <p className="mt-1 font-display text-ink" style={{ fontSize: "2.4rem", letterSpacing: "-0.02em" }}>
                  {PL_DIACRITICS}
                </p>
              </div>
              <div>
                <Eyebrow>General Sans · body 17px</Eyebrow>
                <p className="mt-1 font-display text-[1.0625rem] text-ink">{PL_DIACRITICS}</p>
              </div>
              <div>
                <Eyebrow>Fraunces · display italic</Eyebrow>
                <p className="mt-1 font-serif text-ink" style={{ fontSize: "2.4rem", fontStyle: "italic" }}>
                  {PL_DIACRITICS}
                </p>
              </div>
              <div>
                <Eyebrow>Fraunces · body 17px</Eyebrow>
                <p className="mt-1 font-serif text-[1.0625rem] text-ink">{PL_DIACRITICS}</p>
              </div>
            </div>
          </Row>
        </Container>
      </SectionShell>

      {/* PRZYCISKI — warianty × stany × rozmiary */}
      <SectionShell tone="paper" className="!py-0">
        <Container>
          <Row label="Przyciski">
            <div className="space-y-8">
              {/* warianty */}
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary">Wypróbuj za darmo</Button>
                <Button variant="ghost">Zobacz demo</Button>
                <Button variant="dark">Umów wdrożenie</Button>
                <Button variant="primary" size="lg">
                  Zacznij 14 dni za darmo
                </Button>
              </div>
              {/* stany (statycznie zasymulowane) */}
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex flex-col items-center gap-1.5">
                  <span className="inline-flex min-h-11 items-center rounded-md bg-acid-press px-5 text-[0.9375rem] font-medium text-onacid">
                    Wypróbuj za darmo
                  </span>
                  <span className="text-[0.6875rem] text-mute">hover</span>
                </span>
                <span className="inline-flex flex-col items-center gap-1.5">
                  <span className="inline-flex min-h-11 items-center rounded-md bg-acid px-5 text-[0.9375rem] font-medium text-onacid outline outline-2 outline-offset-2 outline-forest-700">
                    Wypróbuj za darmo
                  </span>
                  <span className="text-[0.6875rem] text-mute">focus-visible</span>
                </span>
                <span className="inline-flex flex-col items-center gap-1.5">
                  <span className="inline-flex min-h-11 scale-[0.98] items-center rounded-md bg-acid px-5 text-[0.9375rem] font-medium text-onacid">
                    Wypróbuj za darmo
                  </span>
                  <span className="text-[0.6875rem] text-mute">active</span>
                </span>
                <span className="inline-flex flex-col items-center gap-1.5">
                  <Button variant="primary" disabled>
                    Wypróbuj za darmo
                  </Button>
                  <span className="text-[0.6875rem] text-mute">disabled</span>
                </span>
              </div>
            </div>
          </Row>
        </Container>
      </SectionShell>

      {/* KARTA + CHECK GLYPH */}
      <SectionShell tone="paper" className="!py-0">
        <Container>
          <Row label="Karta + lista">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Card className="p-7">
                <div className="flex items-center justify-between">
                  <Eyebrow>Growth</Eyebrow>
                  <Folio n="02" />
                </div>
                <p className="mt-4 flex items-baseline gap-1">
                  <span className="num text-[2.6rem] font-medium tracking-tight text-ink">799</span>
                  <span className="text-sub"> zł / mies.</span>
                </p>
                <ul className="mt-6 space-y-3 text-[0.95rem] text-sub">
                  {["do 5 000 rozmów / mies.", "widzi stany magazynowe na żywo", "ton Twojej marki"].map(
                    (f) => (
                      <li key={f} className="flex items-center gap-3 border-t border-hairline pt-3">
                        <CheckGlyph className="text-forest-700" />
                        {f}
                      </li>
                    ),
                  )}
                </ul>
              </Card>
              {/* wariant leśny karty (dark card among light) */}
              <div className="relative overflow-hidden rounded-lg border border-transparent bg-forest-950 p-7 text-onforest">
                <div className="noise-forest" aria-hidden="true" />
                <div className="relative z-[1]">
                  <div className="flex items-center justify-between">
                    <Eyebrow className="text-onforest/60">Najczęściej wybierany</Eyebrow>
                    <Folio n="02" className="text-onforest/50" />
                  </div>
                  <p className="mt-4 flex items-baseline gap-1">
                    <span className="num text-[2.6rem] font-medium tracking-tight text-onforest">799</span>
                    <span className="text-onforest/70"> zł / mies.</span>
                  </p>
                  <ul className="mt-6 space-y-3 text-[0.95rem] text-onforest/80">
                    {["do 5 000 rozmów / mies.", "widzi stany magazynowe na żywo", "ton Twojej marki"].map(
                      (f) => (
                        <li key={f} className="flex items-center gap-3 border-t border-line-dark pt-3">
                          <CheckGlyph className="text-acid" />
                          {f}
                        </li>
                      ),
                    )}
                  </ul>
                  <div className="mt-6">
                    <Button variant="primary">Wybierz Growth</Button>
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      </SectionShell>

      {/* PASMO LEŚNE — tryb ciemny + akcent kwasowy na cyfrze */}
      <SectionShell tone="forest">
        <HeroGridTexture onForest />
        <Container>
          <div className="relative z-[1]">
            <Eyebrow className="text-onforest/60">Pasmo leśne · tryb tentpole</Eyebrow>
            <h2
              className="mt-4 max-w-[20ch] font-display font-semibold text-onforest"
              style={{ fontSize: "var(--text-h2)", lineHeight: 1.05, letterSpacing: "-0.025em" }}
            >
              Nocna zmiana pracuje, <em className="font-serif font-normal italic">gdy Ty śpisz</em>.
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                ["+23", "%", "wzrost konwersji"],
                ["−40", "%", "porzuconych koszyków"],
                ["<3", "s", "czas odpowiedzi"],
                ["24/7", "", "bez przerw"],
              ].map(([n, unit, label]) => (
                <div key={label as string}>
                  <div className="t-stat text-onforest">
                    {n}
                    {unit && <span className="text-acid">{unit}</span>}
                  </div>
                  <div className="mt-2 text-[0.85rem] text-onforest/65">{label}</div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-[0.8125rem] text-onforest/50">Mediana z wdrożeń 2025–2026</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button variant="primary" size="lg">
                Zacznij 14 dni za darmo
              </Button>
              <Button variant="ghost" className="!border-line-dark !text-onforest hover:!bg-forest-900">
                Zobacz demo
              </Button>
            </div>
          </div>
        </Container>
      </SectionShell>
    </main>
  );
}
