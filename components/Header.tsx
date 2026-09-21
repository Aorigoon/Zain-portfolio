"use client";

import { useState, useRef, forwardRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { useLiquidGlass } from "../hooks/useLiquidGlass";

// Sub-component for the modal so useLiquidGlass can initialize on mount
const LiquidModal = forwardRef<HTMLDivElement, { children: React.ReactNode } & any>((props, ref) => {
  const internalRef = useRef<HTMLDivElement>(null);
  
  const setRefs = (node: HTMLDivElement) => {
    internalRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as any).current = node;
  };

  useLiquidGlass(internalRef, {
    scale: -60,
    blur: 10,
    saturate: 1.2,
    fallbackBlur: 16
  });

  return (
    <motion.div ref={setRefs} {...props}>
      {props.children}
    </motion.div>
  );
});
LiquidModal.displayName = "LiquidModal";

const Header = () => {
  const [isTopOpen, setIsTopOpen] = useState(false);
  const [isBottomOpen, setIsBottomOpen] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [mounted, setMounted] = useState(false);

  const topNavRef = useRef<HTMLDivElement>(null);
  const bottomNavRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll();
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setIsScrolledDown(true);
      if (isTopOpen) setIsTopOpen(false);
    } else {
      setIsScrolledDown(false);
      if (isBottomOpen) setIsBottomOpen(false);
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply the liquid glass effect to the capsules
  useLiquidGlass(topNavRef, {
    scale: -80,
    blur: 8,
    saturate: 1.3,
    fallbackBlur: 12
  });

  useLiquidGlass(bottomNavRef, {
    scale: -80,
    blur: 8,
    saturate: 1.3,
    fallbackBlur: 12
  });

  if (!mounted) return null;

  const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string, isTop: boolean) => {
    e.preventDefault();
    if (isTop) setIsTopOpen(false);
    else setIsBottomOpen(false);
    
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Top Floating Capsule Header - visible when not scrolled */}
      <div 
        style={{ 
          position: "fixed", 
          top: "24px", 
          left: "50%", 
          transform: `translateX(-50%) translateY(${isScrolledDown ? "-120px" : "0"})`, 
          opacity: isScrolledDown ? 0 : 1,
          pointerEvents: isScrolledDown ? "none" : "auto",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 1000, 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center" 
        }}
      >
        <AnimatePresence>
          {isTopOpen && (
            <LiquidModal
              className="glass-card"
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: "350px",
                maxWidth: "90vw",
                borderRadius: "24px",
                padding: "1.5rem",
                color: "#ffffff",
                marginBottom: "1rem",
                order: 2, // appear below the button
                marginTop: "1rem"
              }}
            >
              {/* Modal Content */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <a href="#hero" onClick={(e) => handleMenuClick(e, "#hero", true)} className="menu-link" style={{ fontSize: "1.6rem", fontWeight: 700, textDecoration: "none", transformOrigin: "left" }}>WORK</a>
                  <a href="#about" onClick={(e) => handleMenuClick(e, "#about", true)} className="menu-link" style={{ fontSize: "1.6rem", fontWeight: 700, textDecoration: "none", transformOrigin: "left" }}>ABOUT</a>
                  <a href="#services" onClick={(e) => handleMenuClick(e, "#services", true)} className="menu-link" style={{ fontSize: "1.6rem", fontWeight: 700, textDecoration: "none", transformOrigin: "left" }}>SERVICES</a>
                  <a href="#contact" onClick={(e) => handleMenuClick(e, "#contact", true)} className="menu-link" style={{ fontSize: "1.6rem", fontWeight: 700, textDecoration: "none", transformOrigin: "left" }}>CONTACT</a>
                </div>
                <div style={{ fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.5px", color: "#f5f5f7" }}>Zain.</div>
              </div>

              {/* Glowing Divider Line */}
              <div style={{ 
                height: "1px", 
                margin: "0 0 1.2rem 0", 
                background: "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.25), rgba(255,255,255,0.05))" 
              }} aria-hidden="true" />

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}>
                <a href="mailto:omioinfo@mail.com" style={{ textDecoration: "none", color: "rgba(255,255,255,0.7)" }}>omioinfo@mail.com</a>
                <a href="tel:+48555223224" style={{ textDecoration: "none", color: "rgba(255,255,255,0.7)" }}>(+00) 678 345 98568</a>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Manchester 21, Zurich, CH</span>
              </div>
            </LiquidModal>
          )}
        </AnimatePresence>

        <motion.div
          ref={topNavRef}
          className="glass-card"
          initial={false}
          animate={{
            width: isTopOpen ? 56 : 380,
            height: isTopOpen ? 56 : 64,
            borderRadius: isTopOpen ? 28 : 32,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            order: 1 // capsule sits on top
          }}
        >
          <AnimatePresence mode="wait">
            {!isTopOpen ? (
              <motion.div
                key="top-nav-content"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
                transition={{ duration: 0.3 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  height: "100%",
                  padding: "0 16px",
                  flexShrink: 0,
                }}
              >
                {/* Logo */}
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
                  <img
                    src="/assets/images/logo/logo-secendary.png"
                    alt="Zain Logo"
                    style={{ maxHeight: "28px", width: "auto", display: "block" }}
                  />
                  <span style={{ color: "white", fontWeight: "900", fontSize: "1.25rem", letterSpacing: "-0.5px" }}>Zain.</span>
                </Link>

                {/* Hamburger Button */}
                <button 
                  onClick={() => setIsTopOpen(true)}
                  className="hamburger-btn"
                  style={{
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "0",
                  }}
                >
                  <div style={{ width: "20px", height: "2px", background: "#f5f5f7", transition: "width 0.2s" }} className="line-top" />
                  <div style={{ width: "20px", height: "2px", background: "#f5f5f7", transition: "width 0.2s" }} className="line-bottom" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="top-close-content"
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 90, transition: { duration: 0.1 } }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsTopOpen(false)}
                className="close-btn"
                style={{
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                  color: "#f5f5f7",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom Floating Navigation - visible when scrolled */}
      <div 
        style={{ 
          position: "fixed", 
          bottom: "32px", 
          left: "50%", 
          transform: `translateX(-50%) translateY(${isScrolledDown ? "0" : "120px"})`, 
          opacity: isScrolledDown ? 1 : 0,
          pointerEvents: isScrolledDown ? "auto" : "none",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 1000, 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center" 
        }}
      >
        <AnimatePresence>
          {isBottomOpen && (
            <LiquidModal
              className="glass-card"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: "350px",
                maxWidth: "90vw",
                borderRadius: "24px",
                padding: "1.5rem",
                color: "#ffffff",
                marginBottom: "1rem",
              }}
            >
              {/* Modal Content */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <a href="#hero" onClick={(e) => handleMenuClick(e, "#hero", false)} className="menu-link" style={{ fontSize: "1.6rem", fontWeight: 700, textDecoration: "none", transformOrigin: "left" }}>WORK</a>
                  <a href="#about" onClick={(e) => handleMenuClick(e, "#about", false)} className="menu-link" style={{ fontSize: "1.6rem", fontWeight: 700, textDecoration: "none", transformOrigin: "left" }}>ABOUT</a>
                  <a href="#services" onClick={(e) => handleMenuClick(e, "#services", false)} className="menu-link" style={{ fontSize: "1.6rem", fontWeight: 700, textDecoration: "none", transformOrigin: "left" }}>SERVICES</a>
                  <a href="#contact" onClick={(e) => handleMenuClick(e, "#contact", false)} className="menu-link" style={{ fontSize: "1.6rem", fontWeight: 700, textDecoration: "none", transformOrigin: "left" }}>CONTACT</a>
                </div>
                <div style={{ fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.5px", color: "#f5f5f7" }}>Zain.</div>
              </div>

              {/* Glowing Divider Line */}
              <div style={{ 
                height: "1px", 
                margin: "0 0 1.2rem 0", 
                background: "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.25), rgba(255,255,255,0.05))" 
              }} aria-hidden="true" />

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}>
                <a href="mailto:omioinfo@mail.com" style={{ textDecoration: "none", color: "rgba(255,255,255,0.7)" }}>omioinfo@mail.com</a>
                <a href="tel:+48555223224" style={{ textDecoration: "none", color: "rgba(255,255,255,0.7)" }}>(+00) 678 345 98568</a>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Manchester 21, Zurich, CH</span>
              </div>
            </LiquidModal>
          )}
        </AnimatePresence>

        <motion.div
          ref={bottomNavRef}
          className="glass-card"
          initial={false}
          animate={{
            width: isBottomOpen ? 56 : 380,
            height: isBottomOpen ? 56 : 64,
            borderRadius: isBottomOpen ? 28 : 32,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <AnimatePresence mode="wait">
            {!isBottomOpen ? (
              <motion.div
                key="bottom-nav-content"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
                transition={{ duration: 0.3 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  height: "100%",
                  padding: "0 16px",
                  flexShrink: 0,
                }}
              >
                {/* Hamburger Button */}
                <button 
                  onClick={() => setIsBottomOpen(true)}
                  className="hamburger-btn"
                  style={{
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "0",
                  }}
                >
                  <div style={{ width: "20px", height: "2px", background: "#f5f5f7", transition: "width 0.2s" }} className="line-top" />
                  <div style={{ width: "20px", height: "2px", background: "#f5f5f7", transition: "width 0.2s" }} className="line-bottom" />
                </button>

                {/* Logo Text */}
                <Link href="/" style={{ color: "white", fontWeight: "900", fontSize: "1.25rem", textDecoration: "none", letterSpacing: "-0.5px" }}>
                  Zain.
                </Link>
              </motion.div>
            ) : (
              <motion.button
                key="bottom-close-content"
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 90, transition: { duration: 0.1 } }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsBottomOpen(false)}
                className="close-btn"
                style={{
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                  color: "#f5f5f7",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        .glass-card {
          background: rgba(18, 18, 24, 0.82) !important;
          box-shadow:
            inset 0 1px 1px rgba(255, 255, 255, 0.25),
            inset 0 -8px 20px rgba(255, 255, 255, 0.05),
            inset 0 0 0 1px rgba(255, 255, 255, 0.12) !important;
        }
        .hamburger-btn:hover .line-bottom {
          width: 12px !important;
        }
        .menu-link {
          transition: transform 0.2s ease, color 0.2s ease;
          color: #f5f5f7 !important;
        }
        .menu-link:hover {
          transform: scale(1.08);
          color: #ffffff !important;
        }
        .close-btn:hover {
          background: rgba(255,255,255,0.1) !important;
          border-radius: 50%;
        }
      `}</style>
    </>
  );
};

export default Header;
