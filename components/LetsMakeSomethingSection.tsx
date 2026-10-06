"use client";

import React from "react";

export default function LetsMakeSomethingSection() {
  return (
    <section 
      id="lets-make"
      className="relative w-full flex flex-col overflow-hidden" 
      style={{ 
        minHeight: "115vh",    // Made taller than 100vh so adjacent black sections don't peek in
        backgroundColor: "#f4f1e1", 
        color: "#29211d", 
        zIndex: 2,             // covers the fixed GateWorld canvas below
        padding: "5vh 0",      // Add some padding to keep content centered nicely
      }}
    >
      <style>{`
        @keyframes sharpTilt1 {
          0%, 100% { transform: rotate(-12deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes sharpTilt2 {
          0%, 100% { transform: rotate(15deg); }
          50% { transform: rotate(-5deg); }
        }
        .animated-icon-1 {
          animation: sharpTilt1 1.2s ease-in-out infinite;
          transform-origin: center center;
        }
        .animated-icon-2 {
          animation: sharpTilt2 1.5s ease-in-out infinite reverse;
          transform-origin: center center;
        }
        .pencil-outline {
          stroke-dasharray: 2200;
          stroke-dashoffset: 2200;
          transition: stroke-dashoffset 2.2s cubic-bezier(0.1, 0.6, 0.3, 1);
        }
        .tagline-group:hover .pencil-outline {
          stroke-dashoffset: 0;
        }
        .draw-svg path, .draw-svg circle {
          stroke-dasharray: 1500;
          stroke-dashoffset: 1500;
          animation: drawIn 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes drawIn {
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* ── CENTRE: giant headline + icons ─────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">

        {/* Notebook Video – upper-left, beside "Let's make" */}
        <div 
          className="absolute animated-icon-1"
          style={{ top: "12%", left: "7%", zIndex: 1 }}
        >
          <video 
            src="/notebook.webm" 
            autoPlay loop muted playsInline 
            className="w-32 lg:w-40 h-auto drop-shadow-xl"
          />
        </div>

        {/* Eye Doodle – right side, beside "something" */}
        <div 
          className="absolute animated-icon-2 hidden md:block"
          style={{ top: "30%", right: "7%", zIndex: 1 }}
        >
          <svg className="draw-svg drop-shadow-sm" width="110" height="110" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 20C20 40 20 80 40 100C60 80 80 80 100 100C120 80 120 40 100 20C80 40 60 40 40 20Z" stroke="#c0a68d" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="70" cy="60" r="10" stroke="#c0a68d" strokeWidth="7" fill="none" />
            <path d="M30 70L20 80M90 70L100 80" stroke="#c0a68d" strokeWidth="7" strokeLinecap="round" />
          </svg>
        </div>

        {/* Headline */}
        <h2 
          className="tracking-tighter flex flex-col items-center relative z-20 text-center select-none"
          style={{ 
            fontSize: "clamp(4rem, 7.5vw, 8.5rem)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            lineHeight: "0.88",
          }}
        >
          {/* Row 1: Let's make */}
          <div className="flex items-baseline gap-5 font-bold text-[#29211d]">
            <span>Let's</span>
            <span className="relative">
              make
              <div className="absolute -bottom-1 left-0 w-full h-[7px] bg-[#29211d] rounded-sm"></div>
            </span>
          </div>

          {/* Row 2: something */}
          <div className="font-normal text-[#29211d] mt-5">something</div>

          {/* Row 3: worth + cat inline */}
          <div className="flex items-center gap-4 mt-4">
            <span className="font-extralight text-[#29211d]">worth</span>
            <div className="animated-icon-2" style={{ marginBottom: "-4px" }}>
              <svg 
                className="draw-svg drop-shadow-sm" 
                width="88" height="66" 
                viewBox="0 0 120 90" fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M30,50 L20,10 L45,30 Q60,25 75,30 L100,10 L90,50 Q105,70 90,85 Q60,95 30,85 Q15,70 30,50 Z" stroke="#ff3a00" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="45" cy="55" r="4" fill="#ff3a00" />
                <circle cx="75" cy="55" r="4" fill="#ff3a00" />
                <path d="M60,65 L55,75 L60,80 L65,75 Z" fill="#ff3a00" />
                <path d="M10,55 L35,60 M10,65 L35,65 M10,75 L35,70" stroke="#ff3a00" strokeWidth="4" strokeLinecap="round" />
                <path d="M110,55 L85,60 M110,65 L85,65 M110,75 L85,70" stroke="#ff3a00" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Row 4: Big cursive word below worth — replaces "looping" */}
          <div 
            style={{ 
              fontFamily: "'Caveat', cursive",
              fontSize: "clamp(3.5rem, 7vw, 8rem)",
              color: "#ff3a00",
              transform: "rotate(-2deg)",
              fontWeight: 900,
              marginTop: "0.1em",
              letterSpacing: "0.01em",
            }}
          >
            remarkable.
          </div>

          {/* Tagline — more gap below remarkable */}
          <div className="tagline-group relative inline-block cursor-pointer mt-20" style={{ padding: "20px 60px 28px 60px" }}>
            <p 
              className="text-2xl md:text-3xl font-light tracking-wide text-center text-[#29211d] relative z-10 whitespace-nowrap"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Your next project starts{" "}
              <span className="italic font-semibold underline" style={{ textUnderlineOffset: '5px', textDecorationThickness: '1px' }}>remarkable</span>{" "}
              here
            </p>

            {/* Truly hand-drawn pencil oval border — orange, wide as text, two-stroke for authenticity */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              viewBox="0 0 700 90" 
              preserveAspectRatio="none"
              style={{ overflow: "visible" }}
            >
              {/* Two overlapping imperfect strokes = genuine pencil look */}
              <path
                className="pencil-outline"
                d="M 38 18 C 90 7, 210 2, 350 5 C 490 8, 610 6, 660 18 C 678 28, 678 60, 660 72 C 608 84, 490 88, 350 86 C 210 84, 90 82, 38 70 C 18 60, 16 30, 38 18 Z"
                fill="none"
                stroke="#ff3a00"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: "url(#hw1)" }}
              />
              <path
                className="pencil-outline"
                d="M 42 15 C 100 4, 220 0, 350 4 C 480 7, 600 5, 655 16 C 676 26, 675 63, 657 75 C 600 87, 480 90, 350 88 C 220 86, 100 85, 42 73 C 20 64, 19 27, 42 15 Z"
                fill="none"
                stroke="#ff3a00"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: "url(#hw2)", opacity: 0.6 }}
              />
              <defs>
                <filter id="hw1">
                  <feTurbulence type="fractalNoise" baseFrequency="0.02 0.04" numOctaves="4" seed="3" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
                </filter>
                <filter id="hw2">
                  <feTurbulence type="fractalNoise" baseFrequency="0.03 0.06" numOctaves="3" seed="9" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
            </svg>
          </div>

        </h2>
      </div>

    </section>
  );
}
