import { pl } from "@/content/pl";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { ProofTicker } from "@/components/sections/ProofTicker";
import { Problem } from "@/components/sections/Problem";
import { Manifest } from "@/components/sections/Manifest";
import { Pillars } from "@/components/sections/Pillars";
import { GoldMines } from "@/components/sections/GoldMines";
import { Comparison } from "@/components/sections/Comparison";
import { Channels } from "@/components/sections/Channels";
import { ForWho } from "@/components/sections/ForWho";
import { MorningPanel } from "@/components/sections/MorningPanel";
import { ProgressDots } from "@/components/ui/ProgressDots";
import { ProductVisualDefs } from "@/components/ui/ProductVisual";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Results } from "@/components/sections/Results";
import { Integrations } from "@/components/sections/Integrations";
import { Trust } from "@/components/sections/Trust";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { TeamNote } from "@/components/sections/TeamNote";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { StickyCta } from "@/components/mobile/StickyCta";

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
      <ProductVisualDefs />
      <Nav />
      <ProgressDots />
      {/* Wrapper z-[1]: treść ponad globalnym Canvasem WebGL (z-0, fixed za contentem) */}
      <main id="tresc" className="relative z-[1]">
        <Hero />
        <ProofTicker />
        <Problem />
        <Manifest />
        <Pillars />
        <GoldMines />
        <Comparison />
        <Channels />
        <ForWho />
        <HowItWorks />
        <MorningPanel />
        <Results />
        <Integrations />
        <Trust />
        <Pricing />
        <Faq />
        <TeamNote />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
    </>
  );
}
