"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import PushingCharacter from "./PushingCharacter";

const WORDS = [
  "Hello", "سلام", "नमस्ते", "হ্যালো", "Привет", "Hola", "Bonjour", "你好", "안녕하세요", "こんにちは"
];

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  
  const [showCharacter, setShowCharacter] = useState(false);

  useEffect(() => {
    if (!wordsContainerRef.current || !containerRef.current) return;

    const words = wordsContainerRef.current.children;
    const tl = gsap.timeline();

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

    tl.to(wordsContainerRef.current, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        // Words are done. Character appears pushing from the start.
        setShowCharacter(true);
        
        // Push the entire splash screen away to the right
        // We tilt the screen slightly to make it look like a physical page being pushed from the left edge
        gsap.to(containerRef.current, {
          x: "100vw", // Move to the right
          rotationZ: 4, // Tilt the page slightly downwards on the right
          rotationY: 15, // 3D tilt inwards from the push
          transformOrigin: "left center", // Hinge from the left edge where he pushes
          duration: 1.8,
          ease: "power2.in",
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });
      }
    });

  }, [onComplete]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, pointerEvents: "none" }}>
      {showCharacter && (
        // Render Superman on top of the black screen, pushing it.
        // We keep him at a fixed position (-4 on the X axis, which is the left side).
        <PushingCharacter charPos={-4} />
      )}

      <div 
        ref={containerRef} 
        className="splash-screen-isolated" 
        style={{ 
          backgroundColor: "#0c0d0e", 
          perspective: "1000px",
          pointerEvents: "auto",
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 90
        }}
      >
        <div ref={wordsContainerRef} className="splash-words-container-isolated">
          {WORDS.map((word, idx) => (
            <span key={idx} className="splash-text-isolated">{word}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
