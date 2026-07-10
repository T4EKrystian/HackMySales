import { pl } from "@/content/pl";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Problem } from "@/components/sections/Problem";
import { Pillars } from "@/components/sections/Pillars";
import { GoldMines } from "@/components/sections/GoldMines";
import { Comparison } from "@/components/sections/Comparison";
import { ForWho } from "@/components/sections/ForWho";
import { MorningPanel } from "@/components/sections/MorningPanel";
import { ProgressDots } from "@/components/ui/ProgressDots";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Results } from "@/components/sections/Results";
import { Integrations } from "@/components/sections/Integrations";
import { Trust } from "@/components/sections/Trust";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";

// JSON-LD — czyścimy nbsp do czystego tekstu dla robotów
const clean = (s: string) => s.replace(/ /g, " ");

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pl.faq.items.map((it) => ({
    "@type": "Question",
    name: clean(it.q),
    acceptedAnswer: { "@type": "Answer", text: clean(it.a) },
  })),
};

// Bez `offers`, dopóki ceny są placeholderami (content/seo.md)
const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HackMySales",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: clean(pl.hero.lead),
  publisher: { "@type": "Organization", name: "Time4Ecommerce" },
};

export default function Home() {
  return (
    <>
      <Nav />
      <ProgressDots />
      <main id="tresc">
        <Hero />
        <TrustBar />
        <Problem />
        <Pillars />
        <GoldMines />
        <Comparison />
        <ForWho />
        <HowItWorks />
        <MorningPanel />
        <Results />
        <Integrations />
        <Trust />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
    </>
  );
}
