"use client";

import { useRef, useState } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { gsap, useGSAP, useReveal, NO_REDUCE, EASE } from "@/lib/motion";
import { useGLView } from "@/lib/glRegistry";

type Errors = { url?: string; email?: string };
type Stage = "url" | "scanning" | "email" | "sent";

/** CTA końcowe v3 (copy §11 + §11b) — MAKIETA (bez backendu; zgłoszenie w console.log).
 *  Po walidacji adresu: ~2 s uczciwej sekwencji (echo domeny + kroki z §11), potem pole
 *  e-mail. W tle scena `converge` — cząstki rdzenia zbiegają się ku formularzowi
 *  (domknięcie klamry z hero). Reduced-motion / no-JS: klasyczny formularz od razu. */
export function FinalCta() {
  const t = pl.finalCta;
  const ref = useReveal<HTMLElement>(0.08);
  const scope = useRef<HTMLDivElement>(null);
  const { ref: glRef, glState } = useGLView("cta-converge", "converge");
  const [errors, setErrors] = useState<Errors>({});
  const [stage, setStage] = useState<Stage>("url");
  const [domain, setDomain] = useState("");
  const [enhanced, setEnhanced] = useState(false);

  // Cząstki zbiegają się w miarę zbliżania do formularza
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        setEnhanced(true); // JS + motion: sekwencja skanu aktywna
        gsap.to(glState, {
          progress: 1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 85%", end: "center 55%", scrub: 0.5 },
        });
      });
    },
    { scope: ref }
  );

  const validUrl = (url: string) => /^(https?:\/\/)?[^\s]+\.[a-z]{2,}([/?#][^\s]*)?$/i.test(url);
  const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email);

  const runScan = (url: string) => {
    setDomain(url.replace(/^https?:\/\//i, "").replace(/[/?#].*$/, ""));
    setStage("scanning");
    glState.boost = 1;
    gsap.to(glState, { boost: 0, duration: 1.6, ease: EASE.soft });

    // Kroki renderują się dopiero PO zmianie stage — timeline budujemy po commicie Reacta
    requestAnimationFrame(() => {
      const root = scope.current;
      if (!root) return setStage("email");
      const steps = root.querySelectorAll<HTMLElement>(".scan-step");
      const line = root.querySelector<HTMLElement>(".scan-line");
      if (!steps.length) return setStage("email");
      gsap.set(steps, { autoAlpha: 0, y: 10 });
      const tl = gsap.timeline({ onComplete: () => setStage("email") });
      if (line) {
        tl.fromTo(line, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.7, ease: EASE.inOut })
          .to(line, { opacity: 0, duration: 0.3 }, "+=1.2");
      }
      tl.to(steps, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.4, ease: EASE.soft }, 0.35);
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const url = String(fd.get("shop") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();

    if (enhanced && stage === "url") {
      if (!validUrl(url)) return setErrors({ url: t.errors.url });
      setErrors({});
      runScan(url);
      return;
    }

    const next: Errors = {};
    if (!validUrl(url)) next.url = t.errors.url;
    if (!validEmail(email)) next.email = t.errors.email;
    setErrors(next);
    if (Object.keys(next).length) return;

    console.log("demo-request (makieta)", { shop: url, email });
    setStage("sent");
  };

  const showEmail = !enhanced || stage === "email" || stage === "sent";
  const scanning = stage === "scanning";

  return (
    <section ref={ref} id="demo" className="relative overflow-hidden">
      <div className="glow-bg absolute inset-x-0 bottom-0 h-full rotate-180" aria-hidden="true" />
      {/* Scena `converge` — cząstki zbiegają się ku centrum sekcji */}
      {/* środek sceny = strefa formularza (cząstki zbiegają się KU inputowi) */}
      <div ref={glRef} aria-hidden="true" className="pointer-events-none absolute inset-x-[-10%] top-[22%] bottom-[-30%]" />

      <Container className="relative max-w-[760px] py-28 text-center md:py-40">
        <h2
          className="js-reveal font-display font-bold tracking-tight text-ink"
          style={{ fontSize: "var(--text-h2)", lineHeight: 1.1 }}
        >
          {t.h2}
        </h2>
        <p className="js-reveal mx-auto mt-5 max-w-[52ch] text-sub" style={{ fontSize: "var(--text-lead)", lineHeight: 1.6 }}>
          {t.lead}
        </p>

        {stage === "sent" ? (
          <p
            role="status"
            className="mx-auto mt-12 flex w-fit items-center gap-3 rounded-full border border-hairline bg-card px-6 py-4 text-sm text-ink"
          >
            <Glyph name="check" size={16} className="text-ok" />
            {t.success}
          </p>
        ) : (
          <div ref={scope} className="js-reveal mx-auto mt-12 max-w-[560px]">
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
              <div className="relative text-left">
                <label htmlFor="cta-shop" className="sr-only">{t.urlLabel}</label>
                <input
                  id="cta-shop"
                  name="shop"
                  type="text"
                  inputMode="url"
                  placeholder={t.urlPlaceholder}
                  disabled={scanning}
                  aria-invalid={!!errors.url}
                  aria-describedby={errors.url ? "cta-shop-err" : undefined}
                  className={`w-full rounded-full border bg-field px-6 py-4 text-center text-base text-ink placeholder:text-mute disabled:opacity-70 ${
                    errors.url ? "border-danger" : "border-hairline focus:border-strongline"
                  }`}
                />
                {/* linia skanu */}
                {scanning && (
                  <span className="scan-line pointer-events-none absolute inset-x-6 bottom-2 h-px bg-blue" aria-hidden="true" />
                )}
                {errors.url && (
                  <p id="cta-shop-err" role="alert" className="mt-2 px-2 text-xs text-danger">{errors.url}</p>
                )}
              </div>

              {/* Sekwencja §11b — uczciwe kroki, zero udawanej detekcji */}
              {(scanning || (enhanced && stage === "email")) && (
                <ul className="mt-2 flex flex-col gap-2 text-left" role="status" aria-live="polite">
                  <li className="scan-step flex items-center gap-2 text-sm text-sub">
                    <Glyph name="check" size={14} className="shrink-0 text-ok" />
                    <span>
                      {t.scan.accepted} <span className="num text-ink">{domain}</span>
                    </span>
                  </li>
                  {t.scan.steps.map((s) => (
                    <li key={s} className="scan-step flex items-center gap-2 text-sm text-sub">
                      <Glyph name="arrow-right" size={14} className="shrink-0 text-blue-soft" />
                      {s}
                    </li>
                  ))}
                </ul>
              )}

              <div className={showEmail ? "fade-in-panel flex flex-col gap-3" : "hidden"}>
                <div className="text-left">
                  <label htmlFor="cta-email" className="sr-only">{t.emailLabel}</label>
                  <input
                    id="cta-email"
                    name="email"
                    type="email"
                    placeholder={t.emailPlaceholder}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "cta-email-err" : undefined}
                    className={`w-full rounded-full border bg-field px-6 py-4 text-center text-base text-ink placeholder:text-mute ${
                      errors.email ? "border-danger" : "border-hairline focus:border-strongline"
                    }`}
                  />
                  {errors.email && (
                    <p id="cta-email-err" role="alert" className="mt-2 px-2 text-xs text-danger">{errors.email}</p>
                  )}
                </div>
              </div>

              {!scanning && (
                <Button type="submit" size="lg" className="w-full sm:mx-auto sm:w-auto sm:px-12">
                  {t.submit}
                </Button>
              )}
            </form>
          </div>
        )}

        <p className="js-reveal mt-8 text-sm text-mute">{t.below}</p>
      </Container>
    </section>
  );
}
