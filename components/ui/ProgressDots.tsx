"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "top", label: "Start" },
  { id: "produkt", label: "Produkt" },
  { id: "funkcje", label: "Funkcje" },
  { id: "roznica", label: "Różnica" },
  { id: "branze", label: "Branże" },
  { id: "panel", label: "Panel" },
  { id: "wyniki", label: "Wyniki" },
  { id: "cennik", label: "Cennik" },
  { id: "faq", label: "FAQ" },
  { id: "demo", label: "Demo" },
];

/** Boczna nawigacja kropkowa (features §L11) — desktop ≥1280px, dyskretna. */
export function ProgressDots() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Sekcje strony"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 xl:flex"
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={isActive ? "true" : undefined}
            className="group relative flex h-4 w-4 items-center justify-center"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive ? "h-2 w-2 bg-blue" : "h-1.5 w-1.5 bg-strongline group-hover:bg-mute"
              }`}
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-md border border-hairline bg-elevated px-2.5 py-1 text-xs text-sub opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              {s.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
