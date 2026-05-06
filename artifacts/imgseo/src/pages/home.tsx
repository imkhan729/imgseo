import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { ToolSection } from "@/components/tool/tool-section";
import { Benefits } from "@/components/sections/benefits";
import { FAQ } from "@/components/sections/faq";
import { Blog } from "@/components/sections/blog";
import { UseCases } from "@/components/sections/use-cases";
import { SEOContent } from "@/components/sections/seo-content";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <div id="tool" className="scroll-mt-16">
          <ToolSection />
        </div>
        <Benefits />
        <UseCases />
        <SEOContent />
        <FAQ />
        <Blog />
      </main>
      <Footer />
    </div>
  );
}
