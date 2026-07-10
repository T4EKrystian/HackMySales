"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import {
  getGLServerSnapshot,
  getGLSnapshot,
  glPointer,
  subscribeGL,
  type GLViewEntry,
} from "@/lib/glRegistry";
import { CoreParticles } from "./scenes/CoreParticles";
import { FieldPoints } from "./scenes/FieldPoints";

function SceneFor({ entry }: { entry: GLViewEntry }) {
  switch (entry.scene) {
    case "core":
      return <CoreParticles entry={entry} variant="core" />;
    case "mini":
      return <CoreParticles entry={entry} variant="mini" />;
    case "converge":
      return <CoreParticles entry={entry} variant="converge" />;
    case "field":
      return <FieldPoints entry={entry} />;
  }
}

/** Jeden context WebGL dla całej strony. Widoki scissorowane do DIV-ów sekcji
 *  (drei View + track). rAF gaśnie, gdy nic nie widać albo karta w tle. */
export default function GLCanvas() {
  const entries = useSyncExternalStore(subscribeGL, getGLSnapshot, getGLServerSnapshot);
  const [active, setActive] = useState(true);

  // Globalny kursor dla scen (repulsja rdzenia) — jeden listener zamiast N.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      glPointer.x = e.clientX;
      glPointer.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Pauza pętli renderowania: żaden widok w viewporcie lub document.hidden.
  useEffect(() => {
    const vis = new Map<Element, boolean>();
    const update = () => {
      const any = [...vis.values()].some(Boolean);
      setActive(any && !document.hidden);
    };
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => vis.set(e.target, e.isIntersecting));
        update();
      },
      { rootMargin: "12% 0px" }
    );
    entries.forEach((e) => {
      vis.set(e.el, false);
      io.observe(e.el);
    });
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [entries]);

  const refs = useMemo(() => entries.map((e) => ({ current: e.el })), [entries]);

  // UWAGA: <View track> musi być DZIECKIEM Canvasa (wariant CanvasView) — renderowany
  // poza nim ignoruje track i mierzy własny, pusty div. Priorytety useFrame (index>0)
  // wyłączają automatyczny render roota — rysują wyłącznie widoki.
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance", stencil: false, depth: false }}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      aria-hidden="true"
    >
      {entries.map((e, i) => (
        <View key={e.key} index={i + 1} track={refs[i] as React.RefObject<HTMLElement>}>
          <SceneFor entry={e} />
        </View>
      ))}
    </Canvas>
  );
}
