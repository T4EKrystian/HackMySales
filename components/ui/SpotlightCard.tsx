"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/** Karta bento (features §L19): spotlight-border śledzący kursor (CSS var na ::before)
 *  + tilt max 3° na sprężynach Motion. GSAP nie dotyka tych właściwości (podział ról
 *  wg motion.md §1). Na touch/reduced-motion: zwykła karta.
 *  Elewacje v4: level 2 = karty „hero" bento (highlight + cień warstwowy), level 1 = reszta. */
export function SpotlightCard({
  children,
  className = "",
  level = 1,
}: {
  children: ReactNode;
  className?: string;
  level?: 1 | 2;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [interactive, setInteractive] = useState(false);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 22, mass: 0.6 });
  const sry = useSpring(ry, { stiffness: 220, damping: 22, mass: 0.6 });

  useEffect(() => {
    setInteractive(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || !interactive) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--spot-x", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--spot-y", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--spot-o", "1");
    ry.set((px - 0.5) * 6); // max 3°
    rx.set((0.5 - py) * 6);
  };

  const onLeave = () => {
    ref.current?.style.setProperty("--spot-o", "0");
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={interactive ? { rotateX: srx, rotateY: sry, transformPerspective: 900 } : undefined}
      className={`spot-card relative rounded-[var(--radius-lg)] border ${
        level === 2
          ? "border-line-2 bg-l2 [box-shadow:var(--highlight-top),var(--shadow-l2)]"
          : "border-line-1 bg-l1"
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
