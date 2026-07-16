import { pl } from "@/content/pl";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { ProofTicker } from "@/components/sections/ProofTicker";
import { Problem } from "@/components/sections/Problem";
import { Pillars } from "@/components/sections/Pillars";
import { Channels } from "@/components/sections/Channels";
import { Crescendo } from "@/components/sections/Crescendo";
import { Studies } from "@/components/sections/Studies";
import { Trust } from "@/components/sections/Trust";
import { Results } from "@/components/sections/Results";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { ProductVisualDefs } from "@/components/ui/ProductVisual";
import { StickyCta } from "@/components/mobile/StickyCta";

// JSON-LD — czyścimy nbsp do czystego tekstu dla robotów
const clean = (s: string) => s.replace(/ /g, " ");

// Bez `offers`, dopóki ceny są placeholderami (lejek = demo, nie self-serve)
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
      <main id="tresc" className="relative z-[1]">
        <Hero />
        <ProofTicker />
        <Problem />
        <Pillars />
        <Channels />
        <Crescendo />
        <Studies />
        <Trust />
        <Results />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
    </>
  );
}
