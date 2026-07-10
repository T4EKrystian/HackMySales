"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { glPointer, type GLViewEntry } from "@/lib/glRegistry";

/** Simplex noise 3D (Ashima / stegu, MIT) — standardowa implementacja GLSL. */
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const VERT = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uIntensity;
uniform vec3 uMouse;
uniform float uMouseForce;
uniform float uPx;
uniform float uSize;
uniform float uMode; // 0 = core (dyspersja na scroll), 1 = converge (finał)
attribute vec3 aDir;
attribute float aSeed;
varying float vRim;
varying float vSeed;
varying float vFade;
${NOISE}

// Puls ~1.2 s: dwa uderzenia jak serce — rdzeń "oddycha", nigdy nie śpi.
float heartbeat(float t){
  float p=fract(t/1.2);
  return exp(-pow((p-0.12)*16.0,2.0))+0.55*exp(-pow((p-0.34)*14.0,2.0));
}

void main(){
  vec3 dir=aDir;
  float beat=heartbeat(uTime);
  float n=snoise(dir*2.1+uTime*0.16+aSeed*3.7);
  float r=1.0+n*0.22+beat*0.05;
  vec3 pos=dir*r;

  if(uMode>0.5){
    // converge: rozproszona chmura -> płaska elipsa wokół środka (formularza)
    vec3 target=vec3(pos.x*0.6,pos.y*0.12,pos.z*0.15);
    float e=uProgress*uProgress*(3.0-2.0*uProgress);
    pos=mix(pos*1.7,target,e);
  } else {
    // core: dyspersja i odpłynięcie w tło na scroll
    float d=uProgress*uProgress;
    pos+=dir*d*(2.6+aSeed*2.4);
    pos.y+=d*(0.4+aSeed*0.5);
  }

  // repulsja od kursora (uMouseForce=0 na mobile/mini)
  vec3 toM=pos-uMouse;
  float md=length(toM);
  pos+=normalize(toM+vec3(0.0001))*uMouseForce*smoothstep(1.15,0.0,md)*0.34;

  vec4 mv=modelViewMatrix*vec4(pos,1.0);
  gl_Position=projectionMatrix*mv;
  gl_PointSize=uSize*uPx*(0.7+aSeed*0.7)*(1.0+beat*0.45)*(5.2/max(0.1,-mv.z));

  vRim=pow(1.0-abs(dot(normalize(normalMatrix*dir),vec3(0.0,0.0,1.0))),1.6);
  vSeed=aSeed;
  vFade=uIntensity*(uMode>0.5?1.0:1.0-uProgress*0.85);
}
`;

const FRAG = /* glsl */ `
precision mediump float;
uniform vec3 uColA;
uniform vec3 uColB;
varying float vRim;
varying float vSeed;
varying float vFade;
void main(){
  vec2 c=gl_PointCoord-0.5;
  float d=length(c);
  float disc=smoothstep(0.5,0.1,d);
  if(disc<0.01) discard;
  float hot=pow(max(0.0,1.0-d*2.2),3.0); // gorący środek zamiast bloomu z composera
  vec3 col=mix(uColA,uColB,clamp(vRim+vSeed*0.25,0.0,1.0));
  col+=hot*0.5;
  float a=disc*(0.3+vRim*0.5+hot*0.4)*vFade;
  gl_FragColor=vec4(col,a);
}
`;

/** Kolory z tokenów CSS — jedyne źródło prawdy (zero hexów w komponentach). */
function tokenColor(name: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(v || "#ffffff");
}

type Variant = "core" | "mini" | "converge";

const VARIANT = {
  core: { count: 12000, scale: 1.55, size: 2.1, time: 1, mouse: 0.9 },
  mini: { count: 2200, scale: 1.0, size: 2.4, time: 0.55, mouse: 0 },
  converge: { count: 5200, scale: 1.35, size: 2.0, time: 0.7, mouse: 0 },
} as const;

export function CoreParticles({ entry, variant }: { entry: GLViewEntry; variant: Variant }) {
  const conf = VARIANT[variant];
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const count = Math.round(conf.count * (isMobile ? 0.4 : 1) * Number(entry.props?.density ?? 1));
  const mouseForce = isMobile ? 0 : conf.mouse;

  const matRef = useRef<THREE.ShaderMaterial>(null);
  const timeRef = useRef(0);
  const fadeRef = useRef(0);
  const smooth = useRef(0);
  const mouseWorld = useRef(new THREE.Vector3(0, 0, 99));
  const rect = useRef({ top: 0, left: 0, w: 1, h: 1 });

  // Geometria: sfera Fibonacciego + seedy
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const dir = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = count === 1 ? 0 : 1 - (i / (count - 1)) * 2;
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const th = golden * i;
      const x = Math.cos(th) * rad;
      const z = Math.sin(th) * rad;
      dir[i * 3] = x;
      dir[i * 3 + 1] = y;
      dir[i * 3 + 2] = z;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      seed[i] = Math.random();
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aDir", new THREE.BufferAttribute(dir, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: Math.random() * 10 },
      uProgress: { value: 0 },
      uIntensity: { value: 0 },
      uMouse: { value: new THREE.Vector3(0, 0, 99) },
      uMouseForce: { value: mouseForce },
      uPx: { value: Math.min(window.devicePixelRatio, 1.75) },
      uSize: { value: conf.size },
      uMode: { value: variant === "converge" ? 1 : 0 },
      uColA: { value: tokenColor("--blue-500") },
      uColB: { value: tokenColor("--blue-300") },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Cache prostokąta track-DIV-a w przestrzeni dokumentu (bez layout-readów per frame)
  const recache = () => {
    const r = entry.el.getBoundingClientRect();
    rect.current = { top: r.top + window.scrollY, left: r.left + window.scrollX, w: r.width || 1, h: r.height || 1 };
  };

  useMemo(() => {
    if (typeof window === "undefined") return;
    recache();
    window.addEventListener("resize", recache);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, dt) => {
    const mat = matRef.current;
    if (!mat) return;
    const d = Math.min(dt, 0.05);
    timeRef.current += d * conf.time;
    fadeRef.current = Math.min(1, fadeRef.current + d / 1.1);
    smooth.current += (entry.state.progress - smooth.current) * 0.09;

    mat.uniforms.uTime.value = timeRef.current;
    mat.uniforms.uIntensity.value = fadeRef.current * (0.85 + entry.state.boost * 0.5);
    mat.uniforms.uProgress.value = smooth.current;

    if (mouseForce > 0) {
      const rc = rect.current;
      const lx = ((glPointer.x - rc.left) / rc.w) * 2 - 1;
      const ly = -(((glPointer.y - (rc.top - window.scrollY)) / rc.h) * 2 - 1);
      // świat widoku: kamera z=6, fov 45
      const worldH = 2 * Math.tan((45 * Math.PI) / 360) * 6;
      const worldW = worldH * (rc.w / rc.h);
      const inside = lx > -1.2 && lx < 1.2 && ly > -1.2 && ly < 1.2;
      mouseWorld.current.set(
        (lx * worldW) / 2 / conf.scale,
        (ly * worldH) / 2 / conf.scale,
        inside ? 0.4 : 99
      );
      (mat.uniforms.uMouse.value as THREE.Vector3).lerp(mouseWorld.current, 0.08);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={45} position={[0, 0, 6]} />
      <points geometry={geo} frustumCulled={false} scale={conf.scale}>
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
