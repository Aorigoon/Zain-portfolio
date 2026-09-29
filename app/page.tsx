"use client";

import { useEffect, useState } from "react";
import SplashScreen from "../components/SplashScreen";
import Header from "../components/Header";

export default function RealPortfolio() {
  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    // Lock scroll on body, but using clip so fixed items don't hide
    if (!splashFinished) {
      document.documentElement.style.overflow = "clip";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "auto";
    }
  }, [splashFinished]);

  return (
    <div className="isolated-page">
      {!splashFinished && <SplashScreen onComplete={() => setSplashFinished(true)} />}

      <Header />

      <div className="mock-content">
        <h1>Real Portfolio - New Foundation</h1>
        <p>This page uses completely standalone CSS. The bottom navbar should be visible here.</p>
        <p>You can start bringing in your sections (Hero, About, etc.) one by one into this clean structure.</p>
        <div style={{ height: "150vh" }}>
          {/* Extra height for scrolling */}
        </div>
      </div>
    </div>
  );
}
