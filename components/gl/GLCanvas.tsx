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
import { AmbientField } from "./scenes/AmbientField";

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
  // Guard `pointerType==="mouse"`: dotyk podczas scrollu NIE rusza glPointer
  // (rdzeń/sceny nie skaczą za palcem — V7-F3 budżet mobile).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      glPointer.x = e.clientX;
      glPointer.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // DPR: mobile ≤1.4 (mniej pikseli do rasteryzacji na gęstych ekranach) / desktop 1.75
  const maxDpr = typeof window !== "undefined" && window.innerWidth < 768 ? 1.4 : 1.75;

  // v5: ambient żyje na CAŁEJ stronie → pętla gaśnie tylko przy karcie w tle.
  // Views same się kulują (drei pomija render poza viewportem); budżet passu <0,3 ms.
  useEffect(() => {
    const update = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", update);
    update();
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const refs = useMemo(() => entries.map((e) => ({ current: e.el })), [entries]);

  // UWAGA: <View track> musi być DZIECKIEM Canvasa (wariant CanvasView) — renderowany
  // poza nim ignoruje track i mierzy własny, pusty div. Priorytety useFrame (index>0)
  // wyłączają automatyczny render roota — rysują wyłącznie widoki.
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, maxDpr]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance", stencil: false, depth: false }}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      aria-hidden="true"
    >
      {entries.map((e, i) => (
        <View key={e.key} index={i + 1} track={refs[i] as React.RefObject<HTMLElement>}>
          <SceneFor entry={e} />
        </View>
      ))}
      {/* pass ambient PO widokach (priority 1000) — własna Scene, pełny viewport */}
      <AmbientField />
    </Canvas>
  );
}
