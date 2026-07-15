"use client";

import { useEffect, useRef, useState } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { gsap, useGSAP, NO_REDUCE, FINE_POINTER, SCRAMBLE_CHARS, attachMagnet } from "@/lib/motion";

/** Nav v3 (motion.md §3): glass po scrollu, chowa się w dół / wraca w górę,
 *  scramble-hover na linkach, magnetic CTA, scroll-progress hairline. */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<HTMLElement>(null);
  const ctaWrapRef = useRef<HTMLSpanElement>(null);
  const t = pl.nav;

  // Pasek postępu scrolla (features §L14) — scrub przez cały dokument
  useGSAP(() => {
    const bar = progressRef.current;
    if (!bar) return;
    const mm = gsap.matchMedia();
    mm.add(NO_REDUCE, () => {
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
        }
      );
    });
  }, []);

  // Active-section indicator (V6-F5.1): IO po sekcjach z id — podkreślenie linku
  const [activeId, setActiveId] = useState("");
  useEffect(() => {
    const ids = t.links.map((l) => l.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    // mapa stanów WSZYSTKICH obserwowanych — między kotwicami wskaźnik gaśnie
    // (pojedynczy batch IO nie niesie pełnego obrazu; bez mapy „zamarzał")
    const state = new Map<string, boolean>(ids.map((id) => [id, false]));
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => state.set(e.target.id, e.isIntersecting));
        const current = ids.find((id) => state.get(id));
        setActiveId(current ?? "");
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [t.links]);

  // Scramble-hover linków + magnetic CTA (tylko desktop z myszą)
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FINE_POINTER, () => {
        const cleanups: Array<() => void> = [];

        gsap.utils.toArray<HTMLElement>(".nav-scramble", scopeRef.current!).forEach((el) => {
          const original = el.textContent ?? "";
          const enter = () => {
            // szerokość zablokowana na czas tweenu — zero przesuwania sąsiadów
            el.style.width = `${el.offsetWidth}px`;
            el.style.display = "inline-block";
            gsap.to(el, {
              duration: 0.5,
              scrambleText: { text: original, chars: SCRAMBLE_CHARS, speed: 1.4 },
              onComplete: () => {
                el.style.width = "";
                el.style.display = "";
              },
            });
          };
          el.parentElement?.addEventListener("mouseenter", enter);
          cleanups.push(() => el.parentElement?.removeEventListener("mouseenter", enter));
        });

        if (ctaWrapRef.current) cleanups.push(attachMagnet(ctaWrapRef.current, 8));
        return () => cleanups.forEach((fn) => fn());
      });
    },
    { scope: scopeRef }
  );

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Kierunek scrolla: >160px i w dół -> schowaj; w górę -> pokaż
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let lastY = window.scrollY;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 80);
        if (!reduce && !openRef.current) {
          const dy = y - lastY;
          if (y > 160 && dy > 4) setHidden(true);
          else if (dy < -4 || y <= 160) setHidden(false);
        }
        lastY = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setHidden(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      ref={scopeRef}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter,transform] duration-300 ${
        scrolled
          ? "border-b border-hairline bg-page/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      style={{ transitionTimingFunction: "var(--ease-out)" }}
    >
      {/* Postęp scrolla — widoczny dopiero po zescrollowaniu (razem z tłem nav) */}
      <div
        ref={progressRef}
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-blue transition-opacity duration-300 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: "scaleX(0)" }}
      />
      <div className="container-hms flex h-[72px] items-center justify-between">
        <a href="#top" aria-label="HackMySales — strona główna" className="inline-flex min-h-11 items-center rounded-md">
          <Logo status />
        </a>

        <nav aria-label="Główna" className="hidden items-center gap-8 md:flex">
          {t.links.map((l) => {
            const isActive = activeId === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? "true" : undefined}
                className={`nav-link relative text-sm transition-colors duration-150 hover:text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-blue after:transition-[width] after:duration-200 ${
                  isActive ? "text-ink after:w-full" : "text-sub after:w-0"
                }`}
              >
                <span className="nav-scramble">{l.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button href={t.loginHref} variant="ghost" size="md" rel="noopener">
            {t.login}
          </Button>
          <span ref={ctaWrapRef} className="inline-block will-change-transform">
            {/* forest (nie acid) — acid zarezerwowany dla CTA hero; zero duplikacji na 1. ekranie */}
            <Button href="#demo" variant="dark" size="md">
              {t.cta}
            </Button>
          </span>
        </div>

        <button
          className="rounded-md p-2.5 text-ink md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? t.menuClose : t.menuOpen}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Glyph name="x" size={24} /> : <Glyph name="menu" size={24} />}
        </button>
      </div>

      {/* Menu mobile — pełny ekran */}
      <div
        id="menu-mobile"
        className={`fixed inset-0 top-[72px] z-40 flex-col bg-page md:hidden ${open ? "flex" : "hidden"}`}
      >
        <nav aria-label="Mobilna" className="container-hms flex flex-col gap-2 pt-8">
          {t.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-hairline py-4 font-display text-2xl font-semibold text-ink"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-8 flex flex-col gap-3">
            <Button href="#demo" variant="primary" size="lg" onClick={() => setOpen(false)}>
              {t.cta}
            </Button>
            <Button href={t.loginHref} variant="ghost" size="lg" rel="noopener">
              {t.login}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
