"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import type { GLViewEntry } from "@/lib/glRegistry";

/** Pole kropek-klientów (sekcja Problem): siatka punktów, z których część gaśnie
 *  i odpływa w dół falami sterowanymi progressem pinu — wizualizacja cichej utraty. */

const VERT = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uIntensity;
uniform vec2 uArea;
uniform float uPx;
attribute float aOrder;
attribute float aSeed;
varying float vDead;
varying float vSeed;
varying float vA;

void main(){
  vec3 pos=vec3(position.x*uArea.x,position.y*uArea.y,0.0);
  // delikatny dryf życia
  pos.x+=sin(uTime*0.5+aSeed*17.0)*0.02;
  pos.y+=cos(uTime*0.4+aSeed*23.0)*0.02;

  // fala gaśnięcia: punkt umiera, gdy progress mija jego aOrder
  float t=clamp((uProgress-aOrder)*7.0,0.0,1.0);
  pos.y-=t*t*(0.35+aSeed*0.5);
  pos.x+=t*(aSeed-0.5)*0.2;

  vec4 mv=modelViewMatrix*vec4(pos,1.0);
  gl_Position=projectionMatrix*mv;
  gl_PointSize=uPx*(1.6+aSeed*1.2)*(1.0-t*0.45)*(5.2/max(0.1,-mv.z));
  vDead=t;
  vSeed=aSeed;
  vA=uIntensity;
}
`;

const FRAG = /* glsl */ `
precision mediump float;
uniform vec3 uColLive;
uniform vec3 uColDead;
varying float vDead;
varying float vSeed;
varying float vA;
void main(){
  vec2 c=gl_PointCoord-0.5;
  float d=length(c);
  float disc=smoothstep(0.5,0.18,d);
  if(disc<0.01) discard;
  vec3 col=mix(uColLive,uColDead,vDead);
  float a=disc*mix(0.34,0.05,vDead)*vA*(0.75+vSeed*0.25);
  gl_FragColor=vec4(col,a);
}
`;

function tokenColor(name: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(v || "#ffffff");
}

export function FieldPoints({ entry }: { entry: GLViewEntry }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const COLS = isMobile ? 26 : 52;
  const ROWS = isMobile ? 16 : 30;

  const matRef = useRef<THREE.ShaderMaterial>(null);
  const timeRef = useRef(0);
  const fadeRef = useRef(0);
  const smooth = useRef(0);

  const geo = useMemo(() => {
    const n = COLS * ROWS;
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3);
    const order = new Float32Array(n);
    const seed = new Float32Array(n);
    let i = 0;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const jx = (Math.random() - 0.5) * 0.02;
        const jy = (Math.random() - 0.5) * 0.02;
        pos[i * 3] = (x / (COLS - 1)) * 2 - 1 + jx;
        pos[i * 3 + 1] = (y / (ROWS - 1)) * 2 - 1 + jy;
        pos[i * 3 + 2] = 0;
        // ~78% punktów może zgasnąć (0..0.92), reszta zostaje (order > 1)
        order[i] = Math.random() < 0.78 ? Math.random() * 0.92 : 2.0;
        seed[i] = Math.random();
        i++;
      }
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aOrder", new THREE.BufferAttribute(order, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [COLS, ROWS]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uIntensity: { value: 0 },
      uArea: { value: new THREE.Vector2(2.4, 2.4) },
      uPx: { value: Math.min(window.devicePixelRatio, 1.75) },
      uColLive: { value: tokenColor("--blue-300") },
      uColDead: { value: tokenColor("--text-muted") },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((_, dt) => {
    const mat = matRef.current;
    if (!mat) return;
    const d = Math.min(dt, 0.05);
    timeRef.current += d;
    fadeRef.current = Math.min(1, fadeRef.current + d / 1.2);
    smooth.current += (entry.state.progress - smooth.current) * 0.12;

    mat.uniforms.uTime.value = timeRef.current;
    mat.uniforms.uIntensity.value = fadeRef.current;
    mat.uniforms.uProgress.value = smooth.current;

    // dopasuj obszar do proporcji track-DIV-a (świat: kamera z=6, fov 45)
    const w = entry.el.clientWidth || 1;
    const h = entry.el.clientHeight || 1;
    const worldH = 2 * Math.tan((45 * Math.PI) / 360) * 6;
    (mat.uniforms.uArea.value as THREE.Vector2).set(((worldH * (w / h)) / 2) * 0.94, (worldH / 2) * 0.94);
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={45} position={[0, 0, 6]} />
      <points geometry={geo} frustumCulled={false}>
        <shaderMaterial
          ref={matRef}
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}
