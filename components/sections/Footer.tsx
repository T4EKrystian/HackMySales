import { pl } from "@/content/pl";
import { Container } from "@/components/ui/Section";
import { Logo } from "@/components/ui/Logo";

/** Stopka v3: wielki wordmark z fill-wipe na hover, kolumny hairline,
 *  pas mono na dole. Krótko, pewnie. */
export function Footer() {
  const t = pl.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[1] overflow-hidden border-t border-hairline bg-page">
      <Container className="pt-16">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div className="max-w-[280px]">
            <Logo />
            <p className="label mt-4 leading-relaxed">{t.tagline}</p>
          </div>
          <nav aria-label="Stopka" className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 md:max-w-[560px]">
            {t.columns.map((col) => (
              <div key={col.title}>
                <p className="label mb-4">{col.title}</p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="inline-flex min-h-11 items-center text-sm text-sub hover:text-ink md:min-h-0">
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

      {/* Wielki znak wodny — sage, zakotwiczony od lewej, świadomie schodzący za prawą
          krawędź (sygnatura premium). Kadr pionowo pełny (nie tnie liter w pół — kom. klienta). */}
      <Container className="mt-20">
        <div
          className="relative overflow-hidden"
          style={{ height: "clamp(3rem, 13vw, 11.5rem)" }}
          aria-hidden="true"
        >
          <p
            className="absolute bottom-[-0.06em] left-0 select-none whitespace-nowrap text-left font-display font-semibold leading-[0.8] tracking-[-0.04em] text-sage"
            style={{ fontSize: "clamp(4rem, 17vw, 15rem)" }}
          >
            HackMySales
          </p>
        </div>
      </Container>

      <Container className="pb-8">
        <p className="num mt-12 flex flex-wrap items-center justify-between gap-2 border-t border-hairline pt-6 text-xs text-mute">
          <span>
            © {year} {t.copyright}
          </span>
        </p>
      </Container>
    </footer>
  );
}
