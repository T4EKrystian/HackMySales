"use client";

import { useSyncExternalStore } from "react";

/** Mini-store stanu overlaya mobilnego (V7-F3) — wzorzec glRegistry/introGate:
 *  mutowalny stan + useSyncExternalStore, zero context-providera i re-renderów
 *  drzewa. Pisze ChatSheet (otwarcie/zamknięcie), czyta StickyCta (chowa się,
 *  gdy sheet otwarty). */

let open = false;
const listeners = new Set<() => void>();

export function setOverlayOpen(v: boolean) {
  if (open === v) return;
  open = v;
  listeners.forEach((l) => l());
}

export function useOverlayOpen(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => open,
    () => false // SSR: overlay zawsze zamknięty
  );
}
