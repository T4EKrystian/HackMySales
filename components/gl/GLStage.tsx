"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const GLCanvas = dynamic(() => import("./GLCanvas"), { ssr: false });

/** Brama warstwy WebGL (motion.md v3 §2): montuje lazy Canvas dopiero po idle,
 *  tylko gdy brak reduced-motion i WebGL jest dostępny. Do tego czasu sekcje
 *  pokazują statyczne postery gradientowe — zero wpływu na LCP. */
export function GLStage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      const c = document.createElement("canvas");
      if (!c.getContext("webgl2") && !c.getContext("webgl")) return;
    } catch {
      return;
    }
    const start = () => setReady(true);
    // Safari nie ma requestIdleCallback — fallback na timeout
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(start, 900);
    return () => window.clearTimeout(t);
  }, []);

  return ready ? <GLCanvas /> : null;
}
