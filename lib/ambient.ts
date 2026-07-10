"use client";

/** Ambient particles site-wide (V5-F4, DNA „Particles doctrine"): strefy modulacji
 *  per sekcja. Strefy celują w ISTNIEJĄCE elementy (id / data-ambient) — sekcje nie
 *  muszą nic rejestrować; AmbientField mierzy offsety po fonts.ready, resize
 *  i ScrollTrigger.refresh (pin-spacery przesuwają layout o setki vh).
 *  Wartości density/tint/mask lerpują się w useFrame — bez skoków na granicach. */

export type AmbientZoneConfig = {
  id: string;
  /** selektor elementu strefy; brak elementu = strefa pomijana */
  selector: string;
  /** 0..1 — udział widocznych punktów */
  density: number;
  /** 0..1 — mix koloru ku chłodniejszemu/przygaszonemu */
  tint: number;
  /** 0..0.7 — tłumienie pod kolumną treści (−70% max wg doktryny) */
  mask: number;
  /** hub: radialny przyciąg ku środkowi elementu (Kanały) */
  mode?: "hub" | "split";
};

/** Mapa briefu: hero 100 → sekcje czytane 15–30, Kanały hub, Arena split L/R,
 *  Wyniki sprzężone z kalkulatorem (setAmbientValue), reszta oddech 12–20%. */
export const AMBIENT_ZONES: AmbientZoneConfig[] = [
  { id: "hero", selector: "[data-ambient='hero']", density: 1, tint: 0, mask: 0 },
  { id: "problem", selector: "[data-ambient='problem']", density: 0.4, tint: 0.65, mask: 0.55 },
  { id: "produkt", selector: "#produkt", density: 0.3, tint: 0.2, mask: 0.7 },
  { id: "funkcje", selector: "#funkcje", density: 0.25, tint: 0.2, mask: 0.7 },
  { id: "arena", selector: "[data-ambient='arena']", density: 0.28, tint: 0.25, mask: 0.3, mode: "split" },
  { id: "kanaly", selector: "#kanaly", density: 0.6, tint: 0, mask: 0 , mode: "hub" },
  { id: "branze", selector: "#branze", density: 0.2, tint: 0.25, mask: 0.55 },
  { id: "kroki", selector: "[data-ambient='kroki']", density: 0.2, tint: 0.25, mask: 0.6 },
  { id: "poranek", selector: "[data-ambient='poranek']", density: 0.2, tint: 0.2, mask: 0.5 },
  { id: "wyniki", selector: "#wyniki", density: 0.3, tint: 0.1, mask: 0.55 },
  { id: "integracje", selector: "[data-ambient='integracje']", density: 0.2, tint: 0.2, mask: 0.4 },
  { id: "kontrola", selector: "[data-ambient='kontrola']", density: 0.15, tint: 0.3, mask: 0.55 },
  { id: "cennik", selector: "#cennik", density: 0.15, tint: 0.2, mask: 0.6 },
  { id: "faq", selector: "#faq", density: 0.12, tint: 0.3, mask: 0.6 },
  { id: "final", selector: "[data-ambient='final']", density: 0.2, tint: 0, mask: 0 },
];

/** Strefa domyślna między/poza zdefiniowanymi (oddech tła). */
export const AMBIENT_DEFAULT = { density: 0.18, tint: 0.25, mask: 0.3 };

/** Wartości dynamiczne (np. kalkulator: odzysk ↑ → gęstość 0.3→0.5).
 *  Mutowalny store czytany per frame — zero re-renderów (wzorzec glState). */
const values = new Map<string, number>();

export function setAmbientValue(zoneId: string, v: number) {
  values.set(zoneId, Math.max(0, Math.min(1, v)));
}

export function getAmbientValue(zoneId: string): number | undefined {
  return values.get(zoneId);
}
