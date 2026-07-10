import { pl } from "@/content/pl";
import { Container } from "@/components/ui/Section";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const t = pl.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[1] border-t border-hairline bg-page">
      <Container className="py-16">
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
                      <a href={l.href} className="text-sm text-sub hover:text-ink">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <p className="mt-14 border-t border-hairline pt-7 text-xs text-mute">
          © <span className="num">{year}</span> {t.copyright}
        </p>
      </Container>
    </footer>
  );
}
