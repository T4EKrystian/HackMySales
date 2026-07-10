import type { Metadata, Viewport } from "next";
import "@fontsource-variable/schibsted-grotesk";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

export const metadata: Metadata = {
  // [PLACEHOLDER] docelowa domena produkcyjna
  metadataBase: new URL("https://hackmysales.pl"),
  title: "HackMySales — AI, które sprzedaje w Twoim sklepie internetowym",
  description:
    "Czat AI, wyszukiwarka i rekomendacje podłączone do Twojego sklepu. Doradza klientom 24/7, ratuje koszyki i pokazuje przychód co do złotówki. Wdrożenie bez developera.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "HackMySales",
    title: "HackMySales — AI, które sprzedaje w Twoim sklepie internetowym",
    description:
      "Czat AI, wyszukiwarka i rekomendacje podłączone do Twojego sklepu. Doradza klientom 24/7 i pokazuje przychód co do złotówki.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HackMySales — AI, które sprzedaje w Twoim sklepie internetowym",
    description:
      "Czat AI, wyszukiwarka i rekomendacje dla e-commerce. Policzalnie, co do złotówki.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#05060B", // pasek przeglądarki mobilnej w kolorze tła strony
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Inline skrypt niżej dodaje klasę .js PRZED hydracją — React 19 zgłasza mismatch
    // atrybutów <html>; tłumimy ostrzeżenie tylko na tym elemencie (wzorzec theme-script).
    <html lang="pl" suppressHydrationWarning>
      <body className="bg-page text-ink">
        {/* Klasa .js przed renderem treści — steruje stanem startowym animacji (no-JS: wszystko widoczne) */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <a href="#tresc" className="skip-link">
          Przejdź do treści
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
