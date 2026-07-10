"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { AMBIENT_ZONES, AMBIENT_DEFAULT, getAmbientValue } from "@/lib/ambient";
import { ScrollTrigger } from "@/lib/motion";

/** Globalne pole ambient (V5-F4, DNA „Particles doctrine"): 300–500 pkt, 1–2 px,
 *  opacity ≤ .35, powolny dryf z zawijaniem, ZERO reakcji na kursor.
 *  Render: pełnoekranowy pass PO wszystkich drei-Views (priority 1000) — dowiedzione:
 *  Views nie przywracają viewportu i zostawiają autoClear=false tylko na czas swojego
 *  renderu, a implicit clear back-buffera (preserveDrawingBuffer:false) czyści klatkę;
 *  pass MUSI: przywrócić pełny viewport, wyłączyć scissor test i strzec autoClear.
 *  Strefy per sekcja: lerp uniformów wg scrollY (mapa: lib/ambient.ts), maska −70%
 *  pod kolumną treści, tryby hub (Kanały) i split L/R (Arena).
 *  Debug: ?ambient=debug — ramki stref + odczyt gęstości. */

const VERT = /* glsl */ `
uniform float uTime;
uniform vec2 uViewport;   // px CSS
uniform float uPx;        // devicePixelRatio
uniform float uDensity;   // 0..1 — próg culla
uniform float uSplit;     // 1 = Arena: lewa rzadsza, prawa gęstsza
uniform float uMask;      // 0..0.7 — tłumienie pod kolumną treści
uniform vec2 uBand;       // xMin..xMax kolumny treści (px)
uniform vec3 uHub;        // x,y środka huba (px), z = siła 0..1
attribute vec2 aBase;     // pozycja startowa znormalizowana 0..1
attribute vec2 aVel;      // dryf w jednostkach viewportu / s
attribute float aSeed;
attribute float aCull;
varying float vAlpha;
varying float vSeed;

void main(){
  vec2 p01 = fract(aBase + aVel * uTime);
  vec2 pos = p01 * uViewport;

  // hub (Kanały): łagodny przyciąg radialny ku środkowi diagramu
  vec2 toHub = uHub.xy - pos;
  pos += toHub * uHub.z * 0.4 * (0.25 + aSeed * 0.6);

  // gęstość: próg per punkt (płynne "ubywanie"); Arena: modulacja znakiem X
  float sideK = mix(1.0, pos.x < uViewport.x * 0.5 ? 0.35 : 1.4, uSplit);
  float dens = clamp(uDensity * sideK, 0.0, 1.0);
  float visible = step(aCull, dens);

  // maska kolumny treści: cząstki są TŁEM, nie konkurują z czytaniem
  float inBand = smoothstep(uBand.x - 80.0, uBand.x + 80.0, pos.x)
               * (1.0 - smoothstep(uBand.y - 80.0, uBand.y + 80.0, pos.x));
  float maskK = 1.0 - uMask * inBand;

  vAlpha = visible * maskK * (0.55 + 0.45 * sin(uTime * (0.3 + aSeed * 0.4) + aSeed * 31.7));
  vSeed = aSeed;

  // ortho w px, y w dół — z=0
  vec2 ndc = vec2(pos.x / uViewport.x * 2.0 - 1.0, 1.0 - pos.y / uViewport.y * 2.0);
  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = (1.2 + aSeed * 1.1) * uPx;
}
`;

const FRAG = /* glsl */ `
precision mediump float;
uniform vec3 uColA;   // blue-400
uniform vec3 uColB;   // przygaszony/chłodny
uniform float uTint;  // mix ku uColB
uniform float uAlpha; // sufit .35
varying float vAlpha;
varying float vSeed;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float disc = smoothstep(0.5, 0.15, length(c));
  if (disc < 0.01) discard;
  vec3 col = mix(uColA, uColB, clamp(uTint + vSeed * 0.15, 0.0, 1.0));
  gl_FragColor = vec4(col, disc * vAlpha * uAlpha);
}
`;

function tokenColor(name: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(v || "#ffffff");
}

type MeasuredZone = {
  id: string;
  top: number;
  bottom: number;
  density: number;
  tint: number;
  mask: number;
  mode?: "hub" | "split";
  el: HTMLElement;
};

const LERP = 0.06;

export function AmbientField() {
  const size = useThree((s) => s.size);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const COUNT = Math.round(420 * (isMobile ? 0.4 : 1));

  const scene = useMemo(() => new THREE.Scene(), []);
  const camera = useMemo(() => {
    const c = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
    c.position.z = 1;
    return c;
  }, []);

  const zonesRef = useRef<MeasuredZone[]>([]);
  const debugRef = useRef<{ box: HTMLDivElement; label: HTMLDivElement } | null>(null);

  const geometry = useMemo(() => {
    const base = new Float32Array(COUNT * 2);
    const vel = new Float32Array(COUNT * 2);
    const seed = new Float32Array(COUNT);
    const cull = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      base[i * 2] = Math.random();
      base[i * 2 + 1] = Math.random();
      // dryf 4–10 px/s przy 1440 px szerokości → jednostki viewportu/s
      const ang = Math.random() * Math.PI * 2;
      const sp = (4 + Math.random() * 6) / 1440;
      vel[i * 2] = Math.cos(ang) * sp;
      vel[i * 2 + 1] = Math.sin(ang) * sp * 0.7;
      seed[i] = Math.random();
      cull[i] = i / COUNT; // równomierny próg — density=0.3 pokazuje dokładnie 30%
    }
    // przetasowanie progów, żeby cull nie korelował z pozycją startową
    for (let i = COUNT - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = cull[i];
      cull[i] = cull[j];
      cull[j] = t;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
    g.setAttribute("aBase", new THREE.BufferAttribute(base, 2));
    g.setAttribute("aVel", new THREE.BufferAttribute(vel, 2));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aCull", new THREE.BufferAttribute(cull, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);
    return g;
  }, [COUNT]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: Math.random() * 100 },
          uViewport: { value: new THREE.Vector2(1, 1) },
          uPx: { value: 1 },
          uDensity: { value: AMBIENT_DEFAULT.density },
          uTint: { value: AMBIENT_DEFAULT.tint },
          uMask: { value: 0 },
          uBand: { value: new THREE.Vector2(0, 0) },
          uSplit: { value: 0 },
          uHub: { value: new THREE.Vector3(0, 0, 0) },
          uAlpha: { value: 0.35 },
          uColA: { value: tokenColor("--blue-400") },
          uColB: { value: tokenColor("--text-muted") },
        },
      }),
    []
  );

  // punkty do własnej Scene (izolacja od pustych grup Views w scenie roota)
  useEffect(() => {
    const pts = new THREE.Points(geometry, material);
    pts.frustumCulled = false;
    scene.add(pts);
    return () => {
      scene.remove(pts);
      geometry.dispose();
      material.dispose();
    };
  }, [scene, geometry, material]);

  // Pomiar stref: fonts.ready + resize + ScrollTrigger.refresh (pin-spacery!)
  useEffect(() => {
    const debug = new URLSearchParams(window.location.search).get("ambient") === "debug";

    const measure = () => {
      const zones: MeasuredZone[] = [];
      for (const z of AMBIENT_ZONES) {
        const el = document.querySelector<HTMLElement>(z.selector);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        zones.push({
          id: z.id,
          top: r.top + window.scrollY,
          bottom: r.bottom + window.scrollY,
          density: z.density,
          tint: z.tint,
          mask: z.mask,
          mode: z.mode,
          el,
        });
      }
      zones.sort((a, b) => a.top - b.top);
      zonesRef.current = zones;

      if (debug) {
        document.querySelectorAll("[data-ambient-debug]").forEach((n) => n.remove());
        zones.forEach((z) => {
          const box = document.createElement("div");
          box.dataset.ambientDebug = "1";
          box.style.cssText = `position:absolute;left:0;right:0;top:${z.top}px;height:${
            z.bottom - z.top
          }px;outline:1px dashed rgba(92,119,255,.5);pointer-events:none;z-index:9999;`;
          const tag = document.createElement("span");
          tag.textContent = `${z.id} · den ${z.density}`;
          tag.style.cssText =
            "position:absolute;top:4px;left:8px;font:11px monospace;color:#5C77FF;background:rgba(10,12,18,.8);padding:2px 6px;border-radius:4px;";
          box.appendChild(tag);
          document.body.appendChild(box);
        });
        if (!debugRef.current) {
          const label = document.createElement("div");
          label.style.cssText =
            "position:fixed;bottom:12px;left:12px;font:11px monospace;color:#5C77FF;background:rgba(10,12,18,.85);padding:4px 8px;border-radius:6px;z-index:9999;pointer-events:none;";
          document.body.appendChild(label);
          debugRef.current = { box: label, label };
        }
      }
    };

    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);
    ScrollTrigger.addEventListener("refresh", measure);
    return () => {
      window.removeEventListener("resize", measure);
      ScrollTrigger.removeEventListener("refresh", measure);
      document.querySelectorAll("[data-ambient-debug]").forEach((n) => n.remove());
      debugRef.current?.label.remove();
      debugRef.current = null;
    };
  }, []);

  useFrame((s, dt) => {
    const u = material.uniforms;
    u.uTime.value += Math.min(dt, 0.05);
    u.uViewport.value.set(size.width, size.height);
    u.uPx.value = s.gl.getPixelRatio();

    // kolumna treści: container 1240 centered (maska −70% wg doktryny)
    const bandW = Math.min(1240, size.width - 48);
    u.uBand.value.set((size.width - bandW) / 2, (size.width + bandW) / 2);

    // aktywna strefa wg środka viewportu
    const mid = window.scrollY + size.height / 2;
    const zones = zonesRef.current;
    let target = { ...AMBIENT_DEFAULT, mode: undefined as MeasuredZone["mode"], el: null as HTMLElement | null, id: "" };
    for (const z of zones) {
      if (mid >= z.top && mid <= z.bottom) {
        target = { density: z.density, tint: z.tint, mask: z.mask, mode: z.mode, el: z.el, id: z.id };
        break;
      }
    }
    // sprzężenia dynamiczne (kalkulator: 0.3→0.5 wg odzysku)
    const dyn = target.id ? getAmbientValue(target.id) : undefined;
    const targetDensity = dyn !== undefined ? target.density + (0.5 - target.density) * dyn : target.density;

    u.uDensity.value += (targetDensity - u.uDensity.value) * LERP;
    u.uTint.value += (target.tint - u.uTint.value) * LERP;
    u.uMask.value += (target.mask - u.uMask.value) * LERP;
    u.uSplit.value += ((target.mode === "split" ? 1 : 0) - u.uSplit.value) * LERP;

    // hub: środek elementu strefy w px viewportu
    let hubK = 0;
    if (target.mode === "hub" && target.el) {
      const r = target.el.getBoundingClientRect();
      u.uHub.value.x = r.left + r.width / 2;
      u.uHub.value.y = r.top + r.height / 2;
      hubK = 1;
    }
    u.uHub.value.z += (hubK * 0.5 - u.uHub.value.z) * LERP;

    if (debugRef.current) {
      debugRef.current.label.textContent = `ambient: ${target.id || "default"} · den ${u.uDensity.value.toFixed(2)} · mask ${u.uMask.value.toFixed(2)}`;
    }

    // pełnoekranowy pass po Views: pełny viewport + scissor OFF + strażnik autoClear
    const gl = s.gl;
    const prevAutoClear = gl.autoClear;
    const prevScissor = gl.getScissorTest();
    gl.autoClear = false;
    gl.setScissorTest(false);
    gl.setViewport(0, 0, size.width, size.height);
    gl.render(scene, camera);
    gl.setScissorTest(prevScissor);
    gl.autoClear = prevAutoClear;
  }, 1000);

  return null;
}
