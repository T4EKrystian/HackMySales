"use client";

import { useState } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { useReveal } from "@/lib/motion";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"firstName" | "email" | "phone" | "url", string>>;

// Klucz usługi formularza (Web3Forms). Brak klucza → fallback mailto (działa bez backendu).
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const CONTACT = "kontakt@hackmysales.pl";

/** S8 Action (docx) — pasmo LEŚNE pełnej szerokości (tentpole domknięcia), siatka line-dark
 *  + szum, jeden akcent kwasowy (submit). Formularz demo: 6 pól (imię, nazwisko, e-mail,
 *  telefon, strona, wiadomość) z realną wysyłką na e-mail. Bez klucza → mailto z pre-fill.
 *  Reduced-motion / no-JS: pełny formularz od razu (wszystkie pola widoczne). */
export function FinalCta() {
  const t = pl.finalCta;
  const f = t.fields;
  const ref = useReveal<HTMLElement>(0.08);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  const validEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(s);
  const validUrl = (s: string) => /^(https?:\/\/)?[^\s]+\.[a-z]{2,}([/?#][^\s]*)?$/i.test(s);
  const validPhone = (s: string) => s.replace(/[^\d]/g, "").length >= 9;

  async function deliver(data: Record<string, string>) {
    if (!ACCESS_KEY) {
      const body = [
        `Imię: ${data.firstName} ${data.lastName}`.trim(),
        `E-mail: ${data.email}`,
        `Telefon: ${data.phone}`,
        `Strona: ${data.url}`,
        `Wiadomość: ${data.message}`,
      ].join("\n");
      window.location.href = `mailto:${CONTACT}?subject=${encodeURIComponent("Zgłoszenie demo — HackMySales")}&body=${encodeURIComponent(body)}`;
      return true;
    }
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: "Nowe zgłoszenie demo — HackMySales",
          from_name: "HackMySales — landing",
          "Imię": data.firstName,
          "Nazwisko": data.lastName,
          "E-mail": data.email,
          "Telefon": data.phone,
          "Strona": data.url,
          "Wiadomość": data.message,
          botcheck: data.botcheck,
        }),
      });
      const json = (await res.json()) as { success?: boolean };
      return res.ok && Boolean(json.success);
    } catch {
      return false;
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const data = {
      firstName: get("firstName"),
      lastName: get("lastName"),
      email: get("email"),
      phone: get("phone"),
      url: get("url"),
      message: get("message"),
      botcheck: get("botcheck"),
    };
    if (data.botcheck) return; // honeypot — cichy drop

    const next: Errors = {};
    if (!data.firstName) next.firstName = t.errors.firstName;
    if (!validEmail(data.email)) next.email = t.errors.email;
    if (!validPhone(data.phone)) next.phone = t.errors.phone;
    if (!validUrl(data.url)) next.url = t.errors.url;
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    const ok = await deliver(data);
    setStatus(ok ? "sent" : "error");
  };

  const inputCls =
    "w-full rounded-[var(--radius-md)] border bg-white/[0.06] px-4 py-3.5 text-base text-onforest placeholder:text-onforest/55";
  const okBorder = "border-white/15 focus:border-blue-soft";

  return (
    <section
      ref={ref}
      id="demo"
      className="relative overflow-hidden bg-forest-950 text-onforest shadow-[0_-22px_48px_-28px_rgb(10_31_22/0.3)]"
    >
      <div className="noise-forest" aria-hidden="true" />

      <Container className="relative z-[1] max-w-[720px] py-24 md:py-32">
        <p className="js-reveal label !text-onforest/60">{t.label}</p>
        <h2 className="t-h2 js-reveal mt-4 font-display font-semibold text-onforest">{t.h2}</h2>
        <p className="t-lead js-reveal mt-5 max-w-[54ch] text-onforest/75">{t.lead}</p>

        {/* kotwica ceny — sygnał kwalifikacji przed formularzem (nie pełny cennik) */}
        <p className="js-reveal mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="num text-xl font-medium text-acid">{pl.priceAnchor.text}</span>
          <span className="text-sm text-onforest/70">{pl.priceAnchor.sub}</span>
        </p>

        {status === "sent" ? (
          <p
            role="status"
            className="mt-12 flex w-fit items-center gap-3 rounded-full border border-line-dark bg-forest-900 px-6 py-4 text-sm text-onforest"
          >
            <Glyph name="check" size={16} className="text-acid" />
            {t.success}
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate className="js-reveal mt-12 grid gap-4 text-left sm:grid-cols-2">
            {/* honeypot — ukryty przed ludźmi */}
            <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <Field id="cf-first" name="firstName" label={f.firstName.label} placeholder={f.firstName.placeholder} required error={errors.firstName} inputCls={inputCls} okBorder={okBorder} />
            <Field id="cf-last" name="lastName" label={f.lastName.label} placeholder={f.lastName.placeholder} inputCls={inputCls} okBorder={okBorder} />
            <Field id="cf-email" name="email" type="email" label={f.email.label} placeholder={f.email.placeholder} required error={errors.email} inputCls={inputCls} okBorder={okBorder} />
            <Field id="cf-phone" name="phone" type="tel" label={f.phone.label} placeholder={f.phone.placeholder} required error={errors.phone} inputCls={inputCls} okBorder={okBorder} />
            <Field id="cf-url" name="url" label={f.url.label} placeholder={f.url.placeholder} required error={errors.url} className="sm:col-span-2" inputCls={inputCls} okBorder={okBorder} />

            <div className="sm:col-span-2">
              <label htmlFor="cf-msg" className="mb-1.5 block text-sm text-onforest/70">{f.message.label}</label>
              <textarea id="cf-msg" name="message" rows={3} placeholder={f.message.placeholder} className={`${inputCls} ${okBorder} resize-none`} />
            </div>

            <div className="mt-2 flex flex-col items-start gap-3 sm:col-span-2">
              <Button type="submit" variant="primary" size="lg" disabled={status === "sending"} className="w-full sm:w-auto sm:px-12">
                {status === "sending" ? t.sending : t.submit}
              </Button>
              {status === "error" && (
                <p role="alert" className="text-sm text-onforest/80">
                  {t.errors.server}
                </p>
              )}
            </div>
          </form>
        )}

        <p className="js-reveal mt-8 text-sm text-onforest/55">{t.below}</p>
      </Container>
    </section>
  );
}

function Field({
  id, name, label, placeholder, type = "text", required, error, className = "", inputCls, okBorder,
}: {
  id: string; name: string; label: string; placeholder: string; type?: string;
  required?: boolean; error?: string; className?: string; inputCls: string; okBorder: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm text-onforest/70">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`${inputCls} ${error ? "border-danger" : okBorder}`}
      />
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
