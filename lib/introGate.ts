"use client";

/** Bramka intro hero (V6-F4A): czat budzi się DOPIERO po choreografii wejścia.
 *  Singleton modułowy, monotoniczny (done nigdy nie wraca), z bezpiecznikiem
 *  czasowym — kill timeline'u / karta w tle NIGDY nie deadlockuje czatu.
 *  Hazard kolejności efektów (dziecko-ChatShell subskrybuje ZANIM rodzic-Hero
 *  uzbroi bramkę) rozwiązany queueMicrotask-deferem przy nieuzbrojonej bramce. */

let armed = false;
let done = false;
let safety: number | undefined;
const waiters = new Set<() => void>();

export function armIntroGate(safetyMs = 2600) {
  if (done || armed) return;
  armed = true;
  safety = window.setTimeout(markIntroDone, safetyMs);
}

export function markIntroDone() {
  if (done) return;
  done = true;
  window.clearTimeout(safety);
  waiters.forEach((fn) => fn());
  waiters.clear();
}

/** Wywołuje fn po zakończeniu intro (natychmiast, jeśli już done). Zwraca cleanup. */
export function whenIntroDone(fn: () => void): () => void {
  if (done) {
    fn();
    return () => {};
  }
  if (!armed) {
    // efekty dziecka biegną przed efektem rodzica — mikrotask przeskakuje
    // za cały flush layout-effectów tego commita; brak arm = intro nie gra (np.
    // reduced-motion race) → odpal od razu
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      if (done || armed) whenIntroDone(fn);
      else fn();
    });
    return () => {
      cancelled = true;
    };
  }
  waiters.add(fn);
  return () => {
    waiters.delete(fn);
  };
}
