import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { startScroll, stopScroll } from "./lib/scroll";

import { Preloader } from "./components/Preloader";
import { ScrollProgress } from "./components/ScrollProgress";
import { Navbar } from "./components/Navbar";

import { Hero } from "./sections/Hero";
import { MarqueeStrip } from "./sections/MarqueeStrip";
import { About } from "./sections/About";
import { Services } from "./sections/Services";
import { Work } from "./sections/Work";
import { Process } from "./sections/Process";
import { Testimonials } from "./sections/Testimonials";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";

export default function App() {
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);

  const handleLoaded = useCallback(() => {
    if (readyRef.current) return;
    readyRef.current = true;
    setReady(true);
    startScroll();
    window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
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
      <ScrollProgress />
      <Navbar ready={ready} />

      <main>
        <Hero ready={ready} />
        <MarqueeStrip />
        <About />
        <Services />
        <Work />
        <Process />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
