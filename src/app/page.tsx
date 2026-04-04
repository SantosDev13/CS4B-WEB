import Hero from "@/components/Hero";
import About from "@/components/About";
import StatsSection from "@/components/StatsSection";
import CEO from "@/components/CEO";
import Partners from "@/components/Partners";
import News from "@/components/News";
import CTA from "@/components/CTA";


export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <StatsSection />
      <CEO />
      <Partners />
      <News />
      <CTA />
    </>
  );
}
