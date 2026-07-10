"use client";

/** Rejestr widoków WebGL (design/motion.md v3 §2).
 *  Sekcje rejestrują zwykłe DIV-y + mutowalny stan (animowany GSAP-em bez re-renderów);
 *  lazy GLCanvas czyta rejestr i rysuje sceny drei <View track> — dzięki temu three.js
 *  nie trafia do bundle'a żadnej sekcji. */

import { useEffect, useRef } from "react";

export type GLSceneName = "core" | "mini" | "converge" | "field";

/** Mutowalny stan widoku — czytany w useFrame. progress: znaczenie zależne od sceny
 *  (core: dyspersja 0→1, converge: zbieganie 0→1, field: fala gaśnięcia 0→1). */
export type GLViewState = { progress: number; boost: number };

export type GLViewEntry = {
  key: string;
  el: HTMLElement;
  scene: GLSceneName;
  state: GLViewState;
  props?: Record<string, number | boolean>;
};

const entries = new Map<string, GLViewEntry>();
const subs = new Set<() => void>();
let snapshot: GLViewEntry[] = [];
const EMPTY: GLViewEntry[] = [];

function emit() {
  snapshot = [...entries.values()];
  subs.forEach((fn) => fn());
}

export function registerGLView(entry: GLViewEntry): () => void {
  entries.set(entry.key, entry);
  emit();
  return () => {
    entries.delete(entry.key);
    emit();
  };
}

export function subscribeGL(fn: () => void): () => void {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

export const getGLSnapshot = () => snapshot;
export const getGLServerSnapshot = () => EMPTY;

/** Globalna pozycja kursora (clientX/Y) — jeden listener w GLCanvas, sceny czytają per frame. */
export const glPointer = { x: -1e4, y: -1e4 };

/** Hook dla sekcji: zwraca ref DIV-a do podpięcia + mutowalny stan do animowania GSAP-em.
 *  Przy prefers-reduced-motion nie rejestruje niczego (GLStage i tak się nie montuje). */
export function useGLView(key: string, scene: GLSceneName, props?: Record<string, number | boolean>) {
  const ref = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GLViewState>({ progress: 0, boost: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return registerGLView({ key, el, scene, state: stateRef.current, props });
    // props celowo poza deps — rejestracja raz na mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, scene]);

  return { ref, glState: stateRef.current };
}
