import { pl } from "@/content/pl";
import { Container } from "@/components/ui/Section";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/ui/Glyph";

/** Stopka v4: blok marki (logo + tagline + CTA + kontakt) · kolumny linków ·
 *  wielki wordmark-znak wodny · pas prawny (© + polityka/regulamin). */
export function Footer() {
  const t = pl.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[1] overflow-hidden border-t border-hairline bg-page">
      <Container className="pt-16 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.15fr_2fr] md:gap-16">
          {/* Blok marki */}
          <div className="max-w-[360px]">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-sub">{t.tagline}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button href={t.cta.href} variant="primary" size="md">
                {t.cta.label}
              </Button>
              <a
                href={`mailto:${t.email}`}
                className="group inline-flex items-center gap-2 text-sm text-sub transition-colors duration-150 hover:text-ink"
              >
                <Glyph name="mail" size={16} className="text-mute transition-colors group-hover:text-blue-soft" />
                <span className="num">{t.email}</span>
              </a>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-mute">{t.company}</p>
          </div>

          {/* Kolumny linków */}
          <nav aria-label="Stopka" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {t.columns.map((col) => (
              <div key={col.title}>
                <p className="label mb-4">{col.title}</p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="inline-flex min-h-11 items-center text-sm text-sub transition-colors duration-150 hover:text-ink md:min-h-0"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </Container>

      {/* Wielki znak wodny — watermark, zakotwiczony od lewej, świadomie schodzący za prawą krawędź. */}
      <Container className="mt-16 md:mt-20">
        <div
          className="relative overflow-hidden"
          style={{
            height: "clamp(3rem, 13vw, 11.5rem)",
            maskImage: "linear-gradient(90deg, transparent 0%, #000 7%, #000 82%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 7%, #000 82%, transparent 100%)",
          }}
          aria-hidden="true"
        >
          <p
            className="absolute bottom-[-0.06em] left-0 select-none whitespace-nowrap text-left font-display font-semibold leading-[0.8] tracking-[-0.04em] text-watermark"
            style={{ fontSize: "clamp(4rem, 17vw, 15rem)" }}
          >
            HackMySales
          </p>
        </div>
      </Container>

      {/* Pas prawny */}
      <Container className="pb-8">
        <div className="mt-10 flex flex-col gap-3 border-t border-hairline pt-6 text-xs text-mute sm:flex-row sm:items-center sm:justify-between">
          <span className="num">
            © {year} {t.copyright}
          </span>
          <nav aria-label="Informacje prawne" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {t.legal.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="inline-flex min-h-[28px] items-center transition-colors duration-150 hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
