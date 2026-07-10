"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, EASE } from "@/lib/motion";

/** Custom cursor (motion.md v3 §3): dot + follower z lerp, mix-blend-difference.
 *  Istnieje TYLKO przy pointer:fine i bez reduced-motion; nad polami tekstowymi
 *  wraca natywny kursor. Elementy z [data-cursor-label] pokazują etykietę
 *  (treść z atrybutu — copy zostaje przy komponencie, w słowniku). */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ok =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    return () => document.documentElement.classList.remove("has-cursor");
  }, []);

  useGSAP(
    () => {
      if (!enabled) return;
      const dot = dotRef.current!;
      const ring = ringRef.current!;
      const label = labelRef.current!;

      gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

      const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: EASE.soft });
      const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: EASE.soft });
      const rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: EASE.soft });
      const ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: EASE.soft });
      // quickTo("scale") ostrzega przy resetTo („not eligible for reset") — GSAP każe
      // rozbić na osie; jedna funkcja-fasada zachowuje dotychczasowe API
      const rScaleX = gsap.quickTo(ring, "scaleX", { duration: 0.3, ease: EASE.soft });
      const rScaleY = gsap.quickTo(ring, "scaleY", { duration: 0.3, ease: EASE.soft });
      const rScale = (v: number) => {
        rScaleX(v);
        rScaleY(v);
      };

      let shown = false;
      const onMove = (e: PointerEvent) => {
        if (!shown) {
          shown = true;
          gsap.to([dot, ring], { opacity: 1, duration: 0.25 });
        }
        dx(e.clientX);
        dy(e.clientY);
        rx(e.clientX);
        ry(e.clientY);
      };

      const setMode = (mode: "base" | "link" | "label" | "hidden", text = "") => {
        if (mode === "hidden") {
          gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
          return;
        }
        if (shown) gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
        rScale(mode === "link" ? 1.7 : mode === "label" ? 2.6 : 1);
        ring.dataset.mode = mode;
        if (mode === "label") {
          label.textContent = text;
          gsap.to(label, { opacity: 1, duration: 0.2 });
        } else {
          gsap.to(label, { opacity: 0, duration: 0.15 });
        }
      };

      const onOver = (e: PointerEvent) => {
        const t = e.target as HTMLElement;
        if (!(t instanceof HTMLElement)) return;
        if (t.closest("input, textarea, select")) return setMode("hidden");
        const labelled = t.closest<HTMLElement>("[data-cursor-label]");
        if (labelled) return setMode("label", labelled.dataset.cursorLabel ?? "");
        if (t.closest("a, button, [role='button'], summary, label")) return setMode("link");
        setMode("base");
      };

      const onLeave = () => {
        shown = false;
        gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
      };
      const onDown = () => rScale(0.82);
      const onUp = () => rScale(ring.dataset.mode === "link" ? 1.7 : 1);

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      window.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      return () => {
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
      };
    },
    { dependencies: [enabled] }
  );

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120]">
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" data-mode="base">
        <div ref={labelRef} className="cursor-label" />
      </div>
    </div>
  );
}
