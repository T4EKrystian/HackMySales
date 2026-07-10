---
name: motion-craft
description: Standardy motion/WebGL — GSAP+Lenis+R3F, higiena pinów, wydajność, reduced-motion. Czytaj przed każdą zmianą animacji lub sceny 3D.
---

# Motion Craft — standardy implementacji

## Podział odpowiedzialności
- GSAP (+ScrollTrigger/SplitText/DrawSVG/MotionPath/Flip): scroll, piny, timeline'y, typo.
- Motion: springs na hover/tap/toggle w komponentach. NIGDY oba na tej samej właściwości elementu.
- Tokeny (jeden plik): ease `expo.out` / `cubic-bezier(.16,1,.3,1)`; dur .3/.6/1.2; stagger .06–.09.

## Higiena ScrollTriggera (źródło znanych bugów)
- Każdy trigger: `invalidateOnRefresh:true`; kill w cleanupie efektu; `ScrollTrigger.refresh()`
  po `document.fonts.ready` i po załadowaniu obrazów/lazy sekcji.
- Piny: świadome `pinSpacing`; po ostatniej sekcji NIE MOŻE zostać martwa przestrzeń scrolla —
  po każdej zmianie sprawdź `document.body.scrollHeight` vs realny koniec footeru (±16px).
- Debug: włącz `markers:true` lokalnie przy każdej regresji, wyłącz przed commitem.

## Lenis
- Init raz w providerze; sync: `lenis.on('scroll', ScrollTrigger.update)`,
  `gsap.ticker.add(t => lenis.raf(t*1000))`, `gsap.ticker.lagSmoothing(0)`.
- `data-lenis-prevent` na modalach/overflow-scroll wewnętrznych.
- UWAGA REPO: w TYM projekcie sync robi `lenis/react` (autoRaf + `useLenis(ScrollTrigger.update)`) —
  ręczne wiązanie z tickerem GSAP historycznie zabiło scroll kółkiem (motion.md v3 §1). Nie zmieniać.

## R3F / WebGL
- Jeden fixed `<Canvas>` + `drei/View` per sekcja; `dpr=[1,1.75]`, `antialias:false`, bez cieni.
- RAF: pauza przy `document.hidden` i gdy żaden View nie jest w viewporcie.
- KRYTERIUM WIDOCZNOŚCI: scena musi czytać się jako kompozycja na statycznym screenshocie
  (wyraźna forma + głębia + glow). Jeśli wygląda jak szum gwiazdek — jest ZA SŁABA: zwiększ
  rozmiar/gęstość rdzenia, dodaj fresnel rim, selektywny bloom (threshold ~0.85), fog/depth fade,
  dwie warstwy (rdzeń gęsty + orbita rzadka), reakcję na mysz (lerp uMouse, siła widoczna).
- Materiały: additive blending na points; kolor z akcentu DNA, nie biały.
- UWAGA REPO: EffectComposer NIE działa per drei-View (composer renderuje fullscreen poza scissorem
  widoku — zweryfikowane w źródłach postprocessing/drei). „Bloom" robimy fake'iem: glow-quad
  (2 gaussy, additive) + hot-center w shaderze punktów.

## Reduced motion + mobile
- `prefers-reduced-motion`: bez pinów/parallax/particles (poster), zostają fade'y.
- Mobile: particles −60%, bez mouse-reactivity, piny → wersje pionowe, custom cursor OFF.

## Perf checklist (po każdej fazie)
- Animuj tylko transform/opacity; `will-change` punktowo; 60fps scroll desktop.
- three przez dynamic import po idle; hero-poster do czasu mountu (LCP < 2.5s, CLS < .05).
