"use client";

import { useRef, useState } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { HeroGridTexture } from "@/components/ui/kit";
import { gsap, useGSAP, useReveal, NO_REDUCE, EASE } from "@/lib/motion";

type Errors = { url?: string; email?: string };
type Stage = "url" | "scanning" | "email" | "sent";

/** S10 CTA końcowe (redesign): pasmo LEŚNE pełnej szerokości (tentpole domknięcia) —
 *  siatka line-dark + szum, jeden akcent kwasowy (submit). MAKIETA: adres sklepu →
 *  ~2 s uczciwej sekwencji (echo domeny + kroki §11) → pole e-mail. Bez GL, bez backendu
 *  (zgłoszenie w console.log). Reduced-motion / no-JS: klasyczny formularz od razu. */
export function FinalCta() {
  const t = pl.finalCta;
  const ref = useReveal<HTMLElement>(0.08);
  const scope = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [stage, setStage] = useState<Stage>("url");
  const [domain, setDomain] = useState("");
  const [enhanced, setEnhanced] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => setEnhanced(true)); // JS + motion: sekwencja skanu aktywna
    },
    { scope: ref }
  );

  const validUrl = (url: string) => /^(https?:\/\/)?[^\s]+\.[a-z]{2,}([/?#][^\s]*)?$/i.test(url);
  const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email);

  const runScan = (url: string) => {
    setDomain(url.replace(/^https?:\/\//i, "").replace(/[/?#].*$/, ""));
    setStage("scanning");
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
      tl.to(steps, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.7, ease: EASE.soft }, 0.35).to({}, { duration: 0.25 });
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

  const field =
    "w-full rounded-full border bg-forest-900 px-6 py-4 text-center text-base text-onforest placeholder:text-onforest/45 disabled:opacity-70";

  return (
    <section ref={ref} id="demo" className="relative overflow-hidden bg-forest-950 text-onforest">
      <div className="noise-forest" aria-hidden="true" />
      <HeroGridTexture onForest />

      <Container className="relative z-[1] max-w-[760px] py-24 text-center md:py-36">
        <h2 className="t-h2 js-reveal font-display font-semibold text-onforest">{t.h2}</h2>
        <p className="t-lead js-reveal mx-auto mt-5 max-w-[52ch] text-onforest/75">{t.lead}</p>

        {stage === "sent" ? (
          <p
            role="status"
            className="mx-auto mt-12 flex w-fit items-center gap-3 rounded-full border border-line-dark bg-forest-900 px-6 py-4 text-sm text-onforest"
          >
            <Glyph name="check" size={16} className="text-acid" />
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
                  className={`${field} ${errors.url ? "border-danger" : "border-line-dark focus:border-onforest/40"}`}
                />
                {scanning && (
                  <span className="scan-line pointer-events-none absolute inset-x-6 bottom-2 h-px bg-acid" aria-hidden="true" />
                )}
                {errors.url && (
                  <p id="cta-shop-err" role="alert" className="mt-2 px-2 text-xs text-danger">{errors.url}</p>
                )}
              </div>

              {/* Sekwencja §11b — uczciwe kroki, zero udawanej detekcji */}
              {(scanning || (enhanced && stage === "email")) && (
                <ul className="mt-2 flex flex-col gap-2 text-left" role="status" aria-live="polite">
                  <li className="scan-step flex items-center gap-2 text-sm text-onforest/80">
                    <Glyph name="check" size={14} className="shrink-0 text-acid" />
                    <span>
                      {t.scan.accepted} <span className="num text-onforest">{domain}</span>
                    </span>
                  </li>
                  {t.scan.steps.map((s) => (
                    <li key={s} className="scan-step flex items-center gap-2 text-sm text-onforest/80">
                      <Glyph name="arrow-right" size={14} className="shrink-0 text-onforest/50" />
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
                    className={`${field} ${errors.email ? "border-danger" : "border-line-dark focus:border-onforest/40"}`}
                  />
                  {errors.email && (
                    <p id="cta-email-err" role="alert" className="mt-2 px-2 text-xs text-danger">{errors.email}</p>
                  )}
                </div>
              </div>

              {!scanning && (
                <Button type="submit" variant="primary" size="lg" className="w-full sm:mx-auto sm:w-auto sm:px-12">
                  {t.submit}
                </Button>
              )}
            </form>
          </div>
        )}

        <p className="js-reveal mt-8 text-sm text-onforest/55">{t.below}</p>
      </Container>
    </section>
  );
}
