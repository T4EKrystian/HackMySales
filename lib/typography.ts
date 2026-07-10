/** Polska typografia — patrz .claude/skills/pl-typography.
 *  Stosowane raz, przy budowie słownika (content/pl.ts). */

const NB = " ";

export function plNbsp(text: string): string {
  return (
    text
      // sierotki: jednoliterowe spójniki/przyimki nie kończą linii
      .replace(/(^|[\s(„")])([aiouwzAIOUWZ]) /g, `$1$2${NB}`)
      // jednostki i skróty kleją się do liczby
      .replace(/ (zł|szt\.|mc|p\.p\.|h\b)/g, `${NB}$1`)
      // separator tysięcy: 47 218 → spacja nierozdzielająca
      .replace(/(\d) (?=\d{3}(\D|$))/g, `$1${NB}`)
      // półpauza nie zostaje sama na początku linii
      .replace(/ — /g, `${NB}— `)
  );
}

/** Rekurencyjnie przepuszcza wszystkie stringi słownika przez plNbsp. */
export function deepNbsp<T>(value: T): T {
  if (typeof value === "string") return plNbsp(value) as T;
  if (Array.isArray(value)) return value.map(deepNbsp) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = deepNbsp(v);
    return out as T;
  }
  return value;
}

export const fmtInt = new Intl.NumberFormat("pl-PL");

/** Grupowanie tysięcy także dla liczb 4-cyfrowych (styl decku: „6 840 zł”) —
 *  Intl pl-PL grupuje dopiero od 10 000, więc robimy to sami, nbsp jako separator. */
export const fmtIntPl = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, NB);

export const fmtZl = (n: number) => `${fmtIntPl(n)}${NB}zł`;
