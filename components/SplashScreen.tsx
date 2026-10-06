"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const WORDS = [
  "Hello", "سلام", "नमस्ते", "হ্যালো", "Привет",
  "Hola", "Bonjour", "你好", "안녕하세요", "こんにちは",
];

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef     = useRef<HTMLDivElement>(null);
  const pillarsRef   = useRef<HTMLDivElement>(null);
  const maskLayerRef = useRef<HTMLDivElement>(null);

  const animated = useRef(false);
  const doneRef = useRef(false);

  const finish = (hideNow: boolean) => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete();
    // hideNow sirf failsafe ke liye — normal flow me ink tear animation poori
    // hone ke baad timeline khud container chhupa deta hai
    if (hideNow && containerRef.current) containerRef.current.style.display = "none";
  };

  useEffect(() => {
    if (animated.current) return;
    if (!wordsRef.current || !containerRef.current) return;
    animated.current = true;

    const words   = wordsRef.current.children;
    const pillars = pillarsRef.current ? Array.from(pillarsRef.current.children) : [];

    // Failsafe: agar GSAP/rAF kisi bhi wajah se atak jaye (background tab,
    // slow phone, GPU hiccup) to splash hamesha ke liye white na chhode.
    const failsafe = window.setTimeout(() => finish(true), 8000);
    return () => window.clearTimeout(failsafe);

    const tl = gsap.timeline();

    // ── 0. Reveal screen (pillars slide away) ──────────────────────────
    if (pillars.length > 0) {
      tl.to(pillars, {
        y: (i: number) => (i % 2 === 0 ? "-100%" : "100%"),
        duration: 0.5,
        ease: "power3.inOut",
        stagger: { amount: 0.3, from: "edges" },
      });
    }

    // ── 1. Flash greeting words ─────────────────────────────────────────
    Array.from(words).forEach((word) => {
      tl.fromTo(word,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }
      ).to(word, { opacity: 0, y: -60, duration: 0.09, ease: "power2.in", delay: 0.08 });
    });

    // ── 2. Call onComplete right before ink tear starts ─────────────────
    tl.call(() => {
      finish(false);
    }, undefined, "-=0.15");

    // ── 3. GPU-Accelerated PNG Sprite Ink Mask Tear (60 FPS) ───────────
    if (maskLayerRef.current) {
      tl.to(maskLayerRef.current, {
        WebkitMaskPosition: "100% 0%",
        maskPosition: "100% 0%",
        duration: 1.15,
        ease: "steps(39)",
      }, "-=0.1")
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.15,
        onComplete: () => {
          gsap.set(containerRef.current, { display: "none" });
        },
      });
    }

  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="splash-screen"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999999,
        backgroundColor: "transparent",
      }}
    >
      {/* ── Pillars (initial wipe) ─────────────────── */}
      <div
        ref={pillarsRef}
        style={{ position: "absolute", inset: 0, zIndex: 30, pointerEvents: "none" }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(100% / 6 * ${i})`,
              top: "-1%",
              width: "calc(100% / 6 + 2px)",
              height: "102%",
              backgroundColor: "#ffffff",
              outline: "1px solid #ffffff",
              willChange: "transform",
            }}
          />
        ))}
      </div>

      {/* ── PNG Sprite Ink Mask Layer (100% GPU Hardware Accelerated) ─── */}
      <div
        ref={maskLayerRef}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#000000",
          zIndex: 10,
          WebkitMaskImage: "url('/ink-transition-sprite.png')",
          maskImage: "url('/ink-transition-sprite.png')",
          WebkitMaskSize: "4000% 100%",
          maskSize: "4000% 100%",
          WebkitMaskPosition: "0% 0%",
          maskPosition: "0% 0%",
          willChange: "mask-position, -webkit-mask-position",
        }}
      />

      {/* ── Greeting words ───────────────────────────── */}
      <div ref={wordsRef} className="splash-words-container" style={{ zIndex: 40 }}>
        {WORDS.map((w, i) => (
          <span key={i} className="splash-text">{w}</span>
        ))}
      </div>
    </div>
  );
}
