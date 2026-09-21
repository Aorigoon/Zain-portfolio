"use client";

import { useEffect, useState } from "react";
import SplashScreen from "../components/SplashScreen";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ServiceSection from "../components/ServiceSection";
import WorkSection from "../components/WorkSection";
import ContactSection from "../components/ContactSection";
import Lenis from "lenis";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    // Disable automatic browser scroll restoration and force top scroll on mount
    if (typeof window !== "undefined") {
      if (window.history.scrollRestoration) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }

    // Initialize AOS for data-aos animations
    AOS.init({
      once: true,
      offset: 0,
      anchorPlacement: "top-bottom",
    });

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Lock body scroll while splash screen is active
  useEffect(() => {
    if (!splashFinished) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [splashFinished]);

  const handleSplashComplete = () => {
    setSplashFinished(true);
  };

  return (
    <main>

      {/* Conditionally render Splash Screen */}
      {!splashFinished && <SplashScreen onComplete={handleSplashComplete} />}

      {/*==================== Overlay Start ====================*/}
      <div className="overlay"></div>
      {/*==================== Overlay End ====================*/}



      {/* Custom Toast Message start */}
      <div id="toast-container"></div>
      {/* Custom Toast Message End */}

      <Header />

      {/* GSAP Smooth Scroll Containers TEMPORARILY REMOVED */}
      <>
        <>
          {/* Main Portfolio Sections */}
          <HeroSection />
          <AboutSection />

          {/* ======================== Marquee section start =========================== */}
          <div className="custom-marquee-container tw-pt-17 bg-black">
            <div className="custom-marquee-content">
              <div className="custom-marquee-group">
                <div>
                  <h2 className="marquee-two-title marquee-three-title text-uppercase text-white">
                    Services <span className="text-white">-</span>
                  </h2>
                </div>
                <div>
                  <h2 className="marquee-two-title marquee-three-title text-uppercase text-stroke">
                    Services <span className="text-white">-</span>
                  </h2>
                </div>
                <div>
                  <h2 className="marquee-two-title marquee-three-title text-uppercase text-white">
                    Services <span className="text-white">-</span>
                  </h2>
                </div>
                <div>
                  <h2 className="marquee-two-title marquee-three-title text-uppercase text-stroke">
                    Services <span className="text-white">-</span>
                  </h2>
                </div>
                <div>
                  <h2 className="marquee-two-title marquee-three-title text-uppercase text-white">
                    Services <span className="text-white">-</span>
                  </h2>
                </div>
              </div>
              <div className="custom-marquee-group">
                <div>
                  <h2 className="marquee-two-title marquee-three-title text-uppercase text-white">
                    Services <span className="text-white">-</span>
                  </h2>
                </div>
                <div>
                  <h2 className="marquee-two-title marquee-three-title text-uppercase text-stroke">
                    Services <span className="text-white">-</span>
                  </h2>
                </div>
                <div>
                  <h2 className="marquee-two-title marquee-three-title text-uppercase text-white">
                    Services <span className="text-white">-</span>
                  </h2>
                </div>
                <div>
                  <h2 className="marquee-two-title marquee-three-title text-uppercase text-stroke">
                    Services <span className="text-white">-</span>
                  </h2>
                </div>
                <div>
                  <h2 className="marquee-two-title marquee-three-title text-uppercase text-white">
                    Services <span className="text-white">-</span>
                  </h2>
                </div>
              </div>
            </div>
          </div>
          {/* ======================== Marquee section end =========================== */}

          <ServiceSection />
          <WorkSection />
          <ContactSection />
        </>
      </>

    </main>
  );
}
