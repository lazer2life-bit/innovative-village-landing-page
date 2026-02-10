import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Audience } from "@/components/landing/audience";
import { Problems } from "@/components/landing/problems";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AISection } from "@/components/landing/ai-section";
import { Team } from "@/components/landing/team";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Audience />
      <Problems />
      <Features />
      <HowItWorks />
      <AISection />
      <Team />
      <CTA />
      <Footer />
    </main>
  );
}
