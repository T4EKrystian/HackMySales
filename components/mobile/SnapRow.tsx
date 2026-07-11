"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

/** SnapRow (V7-F3) — reużywalny wzorzec mobilny snap-x: natywny scroller (treść
 *  dostępna palcem BEZ JS), aktywny indeks z IntersectionObservera, kropki-buttony
 *  ≥44 px. `initial` przez scrollLeft w layout-effekcie (przed paintem → zero CLS).
 *  Desktop/reduced: wariant `md:grid` (statyczne kolumny, nie poziomy scroller). */
export function SnapRow({
  items,
  ariaLabel,
  slideClassName = "w-full",
  initial = 0,
  onActiveChange,
  dots = true,
  goToLabel,
  className = "",
  mdGridCols = "md:grid-cols-3",
}: {
  items: ReactNode[];
  ariaLabel: string;
  slideClassName?: string;
  initial?: number;
  onActiveChange?: (i: number) => void;
  dots?: boolean;
  goToLabel?: (i: number) => string;
  className?: string;
  /** liczba kolumn wariantu desktop/reduced (md:grid) */
  mdGridCols?: string;
}) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(initial);

  // pozycja startowa (np. Growth wycentrowany) — przed paintem, bez animacji
  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el || initial <= 0) return;
    const slide = el.children[initial] as HTMLElement | undefined;
    if (slide) el.scrollLeft = slide.offsetLeft - (el.clientWidth - slide.clientWidth) / 2;
  }, [initial]);

  // aktywny indeks: IO z rootem=scroller (jeden observer na wszystkie slajdy)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const slides = [...el.querySelectorAll<HTMLElement>("[data-snap-slide]")];
    const io = new IntersectionObserver(
      (ents) => {
        const vis = ents.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) {
          const i = slides.indexOf(vis.target as HTMLElement);
          if (i >= 0) {
            setActive(i);
            onActiveChange?.(i);
          }
        }
      },
      { root: el, threshold: 0.6 }
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [onActiveChange]);

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    const slide = el?.children[i] as HTMLElement | undefined;
    if (!el || !slide) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: slide.offsetLeft - (el.clientWidth - slide.clientWidth) / 2, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className={className}>
      <ul
        ref={scrollerRef}
        aria-label={ariaLabel}
        className={`hide-scrollbar -mx-[var(--container-pad)] flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[var(--container-pad)] py-3 scroll-px-[var(--container-pad)] md:mx-0 md:grid ${mdGridCols} md:overflow-visible md:py-0 md:px-0`}
      >
        {items.map((item, i) => (
          <li key={i} data-snap-slide className={`shrink-0 snap-center md:w-auto ${slideClassName}`}>
            {item}
          </li>
        ))}
      </ul>

      {dots && items.length > 1 && (
        <div className="mt-5 flex justify-center gap-2 md:hidden" role="tablist" aria-label={ariaLabel}>
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={goToLabel ? goToLabel(i) : `${i + 1}`}
              onClick={() => goTo(i)}
              className="grid h-11 w-11 place-items-center"
            >
              <span
                className={`block rounded-full transition-all duration-200 ${
                  i === active ? "h-2 w-2 bg-blue" : "h-1.5 w-1.5 bg-strongline"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
