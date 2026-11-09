import About from "@/components/About";
import Capabilities from "@/components/Capabilities";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import Nav from "@/components/Nav";
import Portfolio from "@/components/Portfolio";
import { ScrollProgress } from "@/components/interactive";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <About />
        <Journey />
        <Capabilities />
        <Portfolio />
        <Contact />
      </main>
    </>
  );
}
