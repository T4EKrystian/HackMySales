"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { pl } from "@/content/pl";
import { Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { useReveal } from "@/lib/motion";

type Errors = { url?: string; email?: string };

/** CTA końcowe — walidacja i stany z copy §13. Bez backendu:
 *  TODO [PLACEHOLDER] endpoint — na razie console.log + stan sukcesu. */
export function FinalCta() {
  const t = pl.finalCta;
  const ref = useReveal<HTMLElement>(0.08);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const url = String(fd.get("shop") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();

    const next: Errors = {};
    if (!/^(https?:\/\/)?[^\s]+\.[a-z]{2,}([/?#][^\s]*)?$/i.test(url)) next.url = t.errors.url;
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) next.email = t.errors.email;
    setErrors(next);
    if (Object.keys(next).length) return;

    // TODO [PLACEHOLDER]: podpiąć endpoint (CRM / e-mail / webhook)
    console.log("demo-request", { url, email });
    setSent(true);
  };

  return (
    <section ref={ref} id="demo" className="relative overflow-hidden bg-surface">
      <div className="glow-bg absolute inset-x-0 bottom-0 h-full rotate-180" aria-hidden="true" />
      <Container className="relative max-w-[720px] py-28 text-center md:py-36">
        <h2
          className="js-reveal font-display font-bold tracking-tight text-ink"
          style={{ fontSize: "var(--text-h2)", lineHeight: 1.1 }}
        >
          {t.h2}
        </h2>
        <p className="js-reveal mx-auto mt-5 max-w-[52ch] text-sub" style={{ fontSize: "var(--text-lead)", lineHeight: 1.6 }}>
          {t.lead}
        </p>

        {sent ? (
          <p
            role="status"
            className="js-reveal mx-auto mt-10 flex w-fit items-center gap-3 rounded-full border border-hairline bg-card px-6 py-4 text-sm text-ink"
          >
            <Check size={16} strokeWidth={2} className="text-ok" aria-hidden="true" />
            {t.success}
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate className="js-reveal mx-auto mt-10 flex max-w-[560px] flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1 text-left">
                <label htmlFor="cta-shop" className="sr-only">{t.urlLabel}</label>
                <input
                  id="cta-shop"
                  name="shop"
                  type="text"
                  inputMode="url"
                  placeholder={t.urlPlaceholder}
                  aria-invalid={!!errors.url}
                  aria-describedby={errors.url ? "cta-shop-err" : undefined}
                  className={`w-full rounded-full border bg-field px-5 py-3.5 text-sm text-ink placeholder:text-mute ${
                    errors.url ? "border-danger" : "border-hairline"
                  }`}
                />
                {errors.url && (
                  <p id="cta-shop-err" role="alert" className="mt-2 px-2 text-xs text-danger">{errors.url}</p>
                )}
              </div>
              <div className="flex-1 text-left">
                <label htmlFor="cta-email" className="sr-only">{t.emailLabel}</label>
                <input
                  id="cta-email"
                  name="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "cta-email-err" : undefined}
                  className={`w-full rounded-full border bg-field px-5 py-3.5 text-sm text-ink placeholder:text-mute ${
                    errors.email ? "border-danger" : "border-hairline"
                  }`}
                />
                {errors.email && (
                  <p id="cta-email-err" role="alert" className="mt-2 px-2 text-xs text-danger">{errors.email}</p>
                )}
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full sm:w-auto sm:self-center sm:px-12">
              {t.submit}
            </Button>
          </form>
        )}

        <p className="js-reveal mt-7 text-sm text-mute">{t.below}</p>
      </Container>
    </section>
  );
}
