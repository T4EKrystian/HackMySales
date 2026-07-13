"use client";

import { useEffect, useState } from "react";
import { HeroLab, type LabLayout } from "./HeroLab";

type Palette = "dark" | "light";
type VariantId = `${LabLayout}-${Palette}`;

const VARIANTS: { id: VariantId; label: string; layout: LabLayout; palette: Palette }[] = [
  { id: "aurora-dark", label: "Aurora · Dark", layout: "aurora", palette: "dark" },
  { id: "aurora-light", label: "Aurora · Light", layout: "aurora", palette: "light" },
  { id: "editorial-dark", label: "Editorial · Dark", layout: "editorial", palette: "dark" },
  { id: "editorial-light", label: "Editorial · Light", layout: "editorial", palette: "light" },
];

/** Bake-off hero (Faza A). Przełącznik na żywo; do screenshotów: #<id> ustawia wariant,
 *  sufiks „:bare" chowa przełącznik (np. /lab/hero#aurora-light:bare). */
export default function HeroBakeoff() {
  const [current, setCurrent] = useState<VariantId>("aurora-dark");
  const [bare, setBare] = useState(false);

  useEffect(() => {
    const apply = () => {
      const raw = window.location.hash.replace(/^#/, "");
      const [id, flag] = raw.split(":");
      if (VARIANTS.some((v) => v.id === id)) setCurrent(id as VariantId);
      setBare(flag === "bare");
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const active = VARIANTS.find((v) => v.id === current)!;

  return (
    <div className={`lab-stage pal-${active.palette}`} data-variant={active.id}>
      {!bare && (
        <div className="lab-switch" role="group" aria-label="Warianty hero">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              data-active={v.id === current}
              onClick={() => {
                setCurrent(v.id);
                window.location.hash = v.id;
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}
      <HeroLab key={active.id} layout={active.layout} />
    </div>
  );
}
