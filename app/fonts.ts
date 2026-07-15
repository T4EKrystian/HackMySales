// Fonty redesignu (Paper / Forest / Acid) — ładowane przez next/font.
// next/font self-hostuje pliki pod _next/static/media (RODO: brak runtime-CDN),
// automatycznie emituje <link rel=preload> i generuje metric-matched fallback
// (size-adjust) → chroni budżet CLS na nagłówku hero. Zastępuje @fontsource/geist.
import { Fraunces } from "next/font/google";
import localFont from "next/font/local";

// Display serif — akcenty italic w nagłówkach, drop-cap manifestu, pull-quote,
// głos Magdy. Subsets latin + latin-ext = pełne polskie znaki diakrytyczne.
export const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-fraunces",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

// Sans — wszystko poza akcentami. Vendorowane z Fontshare (poza Google), 3 wagi.
export const generalSans = localFont({
  src: [
    { path: "./fonts/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/GeneralSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/GeneralSans-Semibold.woff2", weight: "600", style: "normal" },
  ],
  display: "swap",
  variable: "--font-general",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
  adjustFontFallback: "Arial", // metric-matched fallback → CLS na body
});
