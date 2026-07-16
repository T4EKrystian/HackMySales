import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { Logo } from "@/components/ui/Logo";
import { Glyph } from "@/components/ui/Glyph";
import { Footer } from "@/components/sections/Footer";

export type LegalSection = { h: string; body: string[] };

/** Powłoka stron prawnych (polityka prywatności / regulamin): slim header z logo
 *  + powrót, czytelna proza (max 720px), wspólna stopka. */
export function LegalShell({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-hairline bg-page/85 backdrop-blur-md">
        <Container className="flex h-[72px] items-center justify-between">
          <Link href="/" aria-label="HackMySales — strona główna" className="inline-flex min-h-11 items-center">
            <Logo />
          </Link>
          <Link
            href="/"
            className="group inline-flex min-h-11 items-center gap-2 text-sm text-sub transition-colors duration-150 hover:text-ink"
          >
            <Glyph name="chevron-left" size={16} className="transition-transform duration-150 group-hover:-translate-x-0.5" />
            Wróć na stronę główną
          </Link>
        </Container>
      </header>

      <main id="tresc" className="bg-page pb-24 pt-16 md:pt-20">
        <Container className="max-w-[760px]">
          <p className="label text-blue-soft">Dokument</p>
          <h1 className="t-h2 mt-3 font-display font-semibold text-ink">{title}</h1>
          <p className="mt-4 text-sm text-mute">Ostatnia aktualizacja: {updated}</p>
          <p className="t-lead mt-8 max-w-[62ch] text-sub">{intro}</p>

          <div className="mt-12 flex flex-col gap-10">
            {sections.map((s, i) => (
              <section key={i} className="border-t border-hairline pt-8">
                <h2 className="flex items-baseline gap-3 font-display text-xl font-semibold text-ink">
                  <span className="num text-sm text-blue-soft">{String(i + 1).padStart(2, "0")}</span>
                  {s.h}
                </h2>
                <div className="mt-4 flex flex-col gap-3">
                  {s.body.map((p, j) => (
                    <p key={j} className="max-w-[68ch] leading-relaxed text-sub">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
