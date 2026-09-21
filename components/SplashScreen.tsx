"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const WORDS = [
  "Hello",        // English
  "سلام",         // Urdu
  "नमस्ते",       // Hindi
  "হ্যালো",         // Bengali
  "Привет",       // Russian
  "Hola",         // Spanish
  "Bonjour",      // French
  "你好",          // Chinese (Added)
  "안녕하세요",     // Korean (Added)
  "こんにちは",     // Japanese
];

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!wordsContainerRef.current || !pathRef.current || !containerRef.current) return;

    const words = wordsContainerRef.current.children;
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    // 1. Animate each word in an ultra-rapid sequence
    Array.from(words).forEach((word) => {
      tl.fromTo(word, 
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }
      )
      .to(word, {
        opacity: 0,
        y: -80,
        duration: 0.10,
        ease: "power2.in",
        delay: 0.10
      });
    });

    // 2. Liquid bend transition (Fluid & gentle arch reveal)
    tl.to(pathRef.current, {
      attr: { d: "M 0 0 L 100 0 L 100 100 Q 50 30 0 100 Z" },
      duration: 0.5,
      ease: "power2.in"
    })
    .to(pathRef.current, {
      attr: { d: "M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z" },
      duration: 0.45,
      ease: "power2.out"
    }, "-=0.15"); 
  }, [onComplete]);

  return (
    <div ref={containerRef} className="splash-screen">
      {/* SVG background overlay that will morph/bend */}
      <svg className="splash-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path ref={pathRef} d="M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z" fill="#0c0d0e" />
      </svg>
      
      <div ref={wordsContainerRef} className="splash-words-container">
        {WORDS.map((word, idx) => (
          <span key={idx} className="splash-text">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
