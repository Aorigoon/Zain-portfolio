"use client";

import { useEffect, useState } from "react";
import SplashScreen from "../components/SplashScreen";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import GateWorldSection from "../components/GateWorldSection";
import SkillsSection from "../components/SkillsSection";
import LetsMakeSomethingSection from "../components/LetsMakeSomethingSection";
import ContactSection from "../components/ContactSection";
import CustomCursor from "../components/CustomCursor";

export default function RealPortfolio() {
  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    // Lock scroll on body during splash screen
    if (!splashFinished) {
      document.documentElement.style.overflow = "clip";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "auto";
    }
  }, [splashFinished]);

  return (
    <>
      <CustomCursor />
      <SplashScreen onComplete={() => setSplashFinished(true)} />

      <Header />

      <main>
        <HeroSection splashFinished={splashFinished} />
        <GateWorldSection />
        <SkillsSection />
        <LetsMakeSomethingSection />
        <ContactSection />
      </main>
    </>
  );
}
