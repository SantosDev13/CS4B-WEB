import Hero from "@/components/public/Hero";
import About from "@/components/public/About";
import StatsSection from "@/components/public/StatsSection";
import CEO from "@/components/public/CEO";
import Partners from "@/components/public/Partners";
import News from "@/components/public/News";
import CTA from "@/components/public/CTA";


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
