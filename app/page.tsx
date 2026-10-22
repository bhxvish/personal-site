import Hero from "@/components/hero/Hero";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Timeline from "@/components/sections/Timeline";
import Toolkit from "@/components/sections/Toolkit";
import Work from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Work />
      <Toolkit />
      <Timeline />
      <Contact />
    </>
  );
}
