import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollTo, startScroll, stopScroll } from "./lib/scroll";

import { Preloader } from "./components/Preloader";
import { ScrollProgress } from "./components/ScrollProgress";
import { Navbar } from "./components/Navbar";
import { WebGLWorld } from "./components/WebGLWorld";
import { Cursor } from "./components/Cursor";
import { SectionHUD } from "./components/SectionHUD";

import { Hero } from "./sections/Hero";
import { MarqueeStrip } from "./sections/MarqueeStrip";
import { About } from "./sections/About";
import { Services } from "./sections/Services";
import { Work } from "./sections/Work";
import { Process } from "./sections/Process";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";
import { LegalPage } from "./pages/LegalPage";
import { getLegalPage } from "./lib/route";

export default function App() {
  const legalPage = getLegalPage();
  return legalPage ? <LegalPage page={legalPage} /> : <Home />;
}

function Home() {
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);

  const handleLoaded = useCallback(() => {
    if (readyRef.current) return;
    readyRef.current = true;
    setReady(true);
    startScroll();
    window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    // Arriving from a legal page via /#section — jump there once we're ready.
    const hash = window.location.hash;
    if (hash.length > 1) window.setTimeout(() => scrollTo(hash, { offset: -20 }), 300);
  }, []);

  useEffect(() => {
    stopScroll();
    window.scrollTo(0, 0);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    // Hard failsafe in case the preloader never reports back.
    const failsafe = window.setTimeout(handleLoaded, 4500);

    return () => {
      window.clearTimeout(failsafe);
      startScroll();
    };
  }, [handleLoaded]);

  return (
    <div className="grain relative">
      <Preloader onComplete={handleLoaded} />
      <WebGLWorld ready={ready} />
      <Cursor />
      <ScrollProgress />
      <Navbar ready={ready} />
      <SectionHUD ready={ready} />

      <main className="relative z-10">
        <Hero ready={ready} />
        <MarqueeStrip />
        <About />
        <Services />
        <Work />
        <Process />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
