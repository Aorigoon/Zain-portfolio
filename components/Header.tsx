"use client";

import React, { useRef, useState, forwardRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import Link from "next/link";
import { useLiquidGlass } from "../hooks/useLiquidGlass";

const LiquidModal = forwardRef<HTMLDivElement, { children: React.ReactNode } & any>((props, ref) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const setRefs = (node: HTMLDivElement) => {
    internalRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as any).current = node;
  };
  useLiquidGlass(internalRef, { scale: -60, blur: 10, saturate: 1.2, fallbackBlur: 16 });
  return (
    <motion.div ref={setRefs} {...props}>
      {props.children}
    </motion.div>
  );
});
LiquidModal.displayName = "LiquidModal";

type NavBarProps = {
  position: "top" | "bottom";
  isBottomOpen: boolean;
  setIsBottomOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function NavBar({ position, isBottomOpen, setIsBottomOpen }: NavBarProps) {
  const bottomNavRef = useRef<HTMLDivElement>(null);
  const isTop = position === "top";

  useLiquidGlass(bottomNavRef, { scale: -80, blur: 8, saturate: 1.3, fallbackBlur: 12 });

  return (
    <motion.div
      className="bottom-nav-wrapper"
      initial={{ y: isTop ? -100 : 100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      exit={{ y: isTop ? -100 : 100, x: "-50%", opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{
        position: "fixed",
        top: isTop ? "32px" : "auto",
        bottom: isTop ? "auto" : "32px",
        flexDirection: isTop ? "column" : "column-reverse",
        gap: isBottomOpen ? "1rem" : "0",
      }}
    >
      <motion.div
        ref={bottomNavRef}
        className="glass-card"
        initial={false}
        animate={{ width: isBottomOpen ? 56 : 148, height: isBottomOpen ? 56 : 52, borderRadius: isBottomOpen ? 28 : 26 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
          width: isBottomOpen ? 56 : 148, height: isBottomOpen ? 56 : 52, borderRadius: isBottomOpen ? 28 : 26
        }}
      >
        <AnimatePresence mode="wait">
          {!isBottomOpen ? (
            <motion.div
              key="bottom-nav-content"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", height: "100%", padding: "0 14px", flexShrink: 0 }}
            >
              <Link href="#" style={{ color: "white", fontWeight: "900", fontSize: "1.2rem", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>Zain.</Link>
              <button 
                onClick={() => setIsBottomOpen(true)}
                onTouchEnd={(e) => { e.preventDefault(); setIsBottomOpen(true); }}
                style={{
                  width: "38px", height: "38px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5px",
                  background: "transparent", border: "none", cursor: "pointer", padding: "0", color: "#f5f5f7", flexShrink: 0, touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
                }}
              >
                <svg viewBox="0 0 17 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: "20px", height: "9px", pointerEvents: "none" }}>
                  <line x1="0.75" y1="1" x2="16.25" y2="1" />
                  <line x1="4" y1="6" x2="13" y2="6" />
                </svg>
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="bottom-close-content"
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
              onClick={() => setIsBottomOpen(false)}
              onTouchEnd={(e) => { e.preventDefault(); setIsBottomOpen(false); }}
              className="close-btn"
              style={{
                width: "100%", height: "100%", background: "transparent", color: "#f5f5f7", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: "none" }}>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isBottomOpen && (
          <LiquidModal
            className="glass-card"
            initial={{ opacity: 0, y: isTop ? -30 : 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isTop ? -25 : 25, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "350px", maxWidth: "90vw", borderRadius: "24px",
              padding: "1.5rem", color: "#ffffff"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <a href="#work" onClick={(e) => { e.preventDefault(); setIsBottomOpen(false); }} className="menu-link" style={{ fontSize: "1.6rem", fontWeight: 700 }}>WORK</a>
                <a href="#about" onClick={(e) => { e.preventDefault(); setIsBottomOpen(false); }} className="menu-link" style={{ fontSize: "1.6rem", fontWeight: 700 }}>ABOUT</a>
                <a href="#services" onClick={(e) => { e.preventDefault(); setIsBottomOpen(false); }} className="menu-link" style={{ fontSize: "1.6rem", fontWeight: 700 }}>SERVICES</a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); setIsBottomOpen(false); }} className="menu-link" style={{ fontSize: "1.6rem", fontWeight: 700 }}>CONTACT</a>
              </div>
              <div style={{ fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.5px", color: "#f5f5f7" }}>Zain.</div>
            </div>
            {/* Glowing Divider Line */}
            <div style={{ height: "1px", margin: "0 0 1.2rem 0", background: "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.25), rgba(255,255,255,0.05))" }} aria-hidden="true" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}>
              <a href="mailto:omioinfo@mail.com" style={{ textDecoration: "none", color: "rgba(255,255,255,0.7)" }}>omioinfo@mail.com</a>
              <a href="tel:+48555223224" style={{ textDecoration: "none", color: "rgba(255,255,255,0.7)" }}>(+00) 678 345 98568</a>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Manchester 21, Zurich, CH</span>
            </div>
          </LiquidModal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Header() {
  const [isBottomOpen, setIsBottomOpen] = useState(false);
  
  const { scrollY } = useScroll();
  const [isAtTop, setIsAtTop] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setIsAtTop(false);
    } else {
      setIsAtTop(true);
    }
  });

  const atTop = mounted ? isAtTop : true;

  return (
    <AnimatePresence>
      {atTop ? (
        <NavBar key="top" position="top" isBottomOpen={isBottomOpen} setIsBottomOpen={setIsBottomOpen} />
      ) : (
        <NavBar key="bottom" position="bottom" isBottomOpen={isBottomOpen} setIsBottomOpen={setIsBottomOpen} />
      )}
    </AnimatePresence>
  );
}
