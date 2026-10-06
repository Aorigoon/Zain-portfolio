"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "motion/react";
import { TextRoll } from "./ui/text-roll";

interface HeroSectionProps {
  splashFinished?: boolean;
  /** Rendered inside the sticky viewport, behind the cloth canvas. */
  children?: React.ReactNode;
}

// ── Cache texture globally so canvas isn't recreated on every mount ──────
let cachedTexture: THREE.CanvasTexture | null = null;

function getOrBuildTexture(): THREE.CanvasTexture {
  if (cachedTexture) return cachedTexture;

  const W = 2048, H = 1024;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;

  // White cloth base
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // Left Sidebar Text (drawn directly on the fabric)
  ctx.save();
  // X: 0.05 (closer to left), Y: 0.18
  ctx.translate(W * 0.05, H * 0.22);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "#111111";

  // ZAIN
  ctx.font = `900 ${Math.floor(H * 0.05)}px 'Plus Jakarta Sans', Arial, sans-serif`;
  ctx.letterSpacing = "2px";
  ctx.fillText("ZAIN", 0, 0);
  let zainW = ctx.measureText("ZAIN").width;

  // ©
  ctx.font = `900 ${Math.floor(H * 0.025)}px 'Plus Jakarta Sans', Arial, sans-serif`;
  ctx.letterSpacing = "0px";
  ctx.fillText("©", zainW + 10, -Math.floor(H * 0.02));

  ctx.restore();

  // "I design & build" with tight custom spacing
  ctx.fillStyle = "#111111";
  ctx.font = `normal ${Math.floor(H * 0.18)}px 'Priestacy', cursive`;
  const words = ["I", "design", "&", "build"];
  let currentX = W * 0.05;
  const spaceWidth = W * 0.015; // Tight custom space
  words.forEach(word => {
    ctx.fillText(word, currentX, H * 0.40);
    currentX += ctx.measureText(word).width + spaceWidth;
  });

  // Professional Tagline (Premium tightly spaced typography like the reference)
  const taglineX = W * 0.80; // Positioned on the right side, above 'M'/'E' in AWESOME
  const taglineY = H * 0.1; // Decreased Y to move it UPWARDS
  const lineGap = H * 0.04; // Very tight line gap

  ctx.font = `600 ${Math.floor(H * 0.02)}px 'Plus Jakarta Sans', Arial, sans-serif`;
  ctx.fillStyle = "#111111";
  ctx.fillText("Elevating Digital Experiences", taglineX, taglineY);

  ctx.font = `500 ${Math.floor(H * 0.02)}px 'Plus Jakarta Sans', Arial, sans-serif`;
  ctx.fillStyle = "#444444";
  ctx.fillText("Full-Stack Developer & Designer", taglineX, taglineY + lineGap);
  ctx.fillText("Crafting Seamless Solutions", taglineX, taglineY + lineGap * 2);
  ctx.fillText("Blending Logic with Imagination.", taglineX, taglineY + lineGap * 3);
  // "AWESOME"
  ctx.fillStyle = "#111111";
  ctx.save();
  ctx.translate(W * 0.07, H * 0.90);
  ctx.rotate(-0.07);
  ctx.font = `normal ${Math.floor(H * 0.50)}px 'Amanojaku', 'Plus Jakarta Sans', Arial Black, sans-serif`;
  // Using maxWidth (W * 0.85) ensures 'E' is never cut off even if the font is huge
  ctx.fillText("AWESOME", 0, 0, W * 0.85);
  ctx.restore();

  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = tex.magFilter = THREE.LinearFilter;
  cachedTexture = tex;
  return tex;
}

// ── Ultra-Fast 60FPS Soft Fabric Mesh ─────────────────────────────────────
function ClothMesh({
  dropRef,
  entryRef,
}: {
  dropRef: React.MutableRefObject<number>;
  entryRef: React.MutableRefObject<number>;
}) {
  const { viewport } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      Promise.all([
        document.fonts.load("normal 10px Amanojaku"),
        document.fonts.load("normal 10px Priestacy")
      ]).then(() => {
        setTexture(getOrBuildTexture());
      });
    }
  }, []);

  const uniforms = useMemo(() => {
    if (!texture) return null;
    return {
      uTex: { value: texture },
      uDrop: { value: 0.0 },
      uEntry: { value: 0.0 },
      uTime: { value: 0.0 },
    };
  }, [texture]);

  useFrame(({ clock }) => {
    if (!matRef.current || !uniforms) return;
    const u = matRef.current.uniforms;
    u.uDrop.value = dropRef.current;
    u.uEntry.value = entryRef.current;
    u.uTime.value = clock.getElapsedTime();
  });

  if (!texture || !uniforms) return null;

  const W = viewport.width * 1.05;
  const H = viewport.height * 1.05;

  return (
    <mesh>
      {/* Optimized 100x100 grid for buttery smooth 60FPS GPU performance */}
      <planeGeometry args={[W, H, 100, 100]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent={true}
        side={THREE.DoubleSide}
        vertexShader={`
          uniform float uDrop;
          uniform float uEntry;
          uniform float uTime;
          varying vec2  vUv;
          varying float vShade;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
              mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
              u.y
            );
          }

          float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            for(int i = 0; i < 4; i++) {
              v += a * noise(p);
              p *= 2.2;
              a *= 0.5;
            }
            return v;
          }

          void main() {
            vUv = uv;
            vec3 pos = position;

            float t = uDrop; // 0.0 -> 1.0

            // Scroll activation factor
            float tScroll = smoothstep(0.01, 0.30, t);

            // ── 1. RESTING STATE (Clean & Flat) ──────────────────────────
            float restingTexture = fbm(uv * 4.0 + vec2(0.2, 0.8)) * 0.12;

            float swayX = sin(uTime * 1.4 + uv.y * 2.5) * uEntry * 0.2 * (1.0 - uv.y);
            float swayY = cos(uTime * 1.6 + uv.x * 2.0) * uEntry * 0.1 * (1.0 - uv.y);
            pos.x += swayX;
            pos.y += swayY;

            // ── 2. DYNAMIC WAVES ON SCROLL ONLY ──────────────────────────
            float edgeWaveX = sin(uv.y * 9.0 + uTime * 0.8) * 0.08 * (1.0 - uv.x * 0.5) * tScroll;
            float edgeWaveY = cos(uv.x * 9.0 + uTime * 0.8) * 0.08 * (1.0 - uv.y * 0.5) * tScroll;
            pos.x += edgeWaveX;
            pos.y += edgeWaveY;

            float fold1 = sin((uv.x * 2.8 - uv.y * 2.2) * 3.14159 + sin(uv.y * 3.0)) * 0.65 * tScroll;
            float fold2 = sin((uv.x * 5.2 + uv.y * 3.5) * 3.14159) * 0.32 * tScroll;

            // ── 3. SCROLL UNPINNING & DEEP CURVED DROOP ──────────────────
            float rightWeight = pow(uv.x, 1.6);
            float dropPhase   = smoothstep(0.0, 0.65, t);

            float sagY = rightWeight * (1.0 - uv.y * 0.3) * ${(H * 0.85).toFixed(3)} * dropPhase;
            pos.y -= sagY;

            float pullX = rightWeight * (1.0 - uv.y) * ${(W * 0.35).toFixed(3)} * dropPhase;
            pos.x -= pullX;

            float flexWave1 = sin(uv.y * 5.5 + t * 4.0 + uv.x * 2.5) * 0.45 * rightWeight * dropPhase;
            float flexWave2 = cos(uv.x * 6.5 - t * 4.5 + uv.y * 3.5) * 0.35 * rightWeight * dropPhase;
            pos.x += flexWave1;
            pos.y += flexWave2 * 0.5;

            float catenaryArc = sin(uv.x * 3.14159) * 0.75 * dropPhase;
            pos.y -= catenaryArc;

            // ── 4. RADIAL TENSION CREASES & GATHERED DRAPES ──────────────
            vec2 pinUv = vec2(0.0, 1.0);
            float distPin  = length(uv - pinUv);
            float anglePin = atan(uv.y - 1.0, uv.x + 0.001);

            float tensionLines = sin(anglePin * 16.0 + distPin * 8.0 - t * 4.0) 
                                 * 0.48 * smoothstep(0.05, 0.7, t) * (1.0 - smoothstep(0.85, 1.0, t));

            float gatherFolds = sin(uv.x * 28.0 + sin(uv.y * 8.0)) 
                                * 0.55 * smoothstep(0.25, 0.75, t) * (1.0 - smoothstep(0.88, 1.0, t));

            float totalZ = restingTexture + fold1 + fold2 + tensionLines + gatherFolds + flexWave2;
            pos.z += totalZ;

            // ── 5. GRAVITY FALL OFF-SCREEN ───────────────────────────────
            float tFall = smoothstep(0.4, 1.0, t);
            float gravityFall = pow(tFall, 2.2) * ${(H * 2.2).toFixed(3)};
            pos.y -= gravityFall;

            pos.x += sin(tFall * 3.14159 * 2.0) * 0.4 * tFall;

            // ── 6. DYNAMIC LIGHTING ──────────────────────────────────────
            float dzdx = (fold1 + tensionLines + gatherFolds) * cos(uv.x * 10.0) * 0.75;
            float dzdy = (fold2 + restingTexture + flexWave1) * cos(uv.y * 8.0) * 0.75;
            vec3 N = normalize(vec3(-dzdx, -dzdy, 1.0));
            vec3 L = normalize(vec3(0.45, 0.85, 1.55));
            vShade = clamp(dot(N, L) * 0.35 + 0.85, 0.8, 1.1);

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D uTex;
          uniform float uDrop;
          varying vec2  vUv;
          varying float vShade;

          void main() {
            vec4 col = texture2D(uTex, vUv);
            float fade = 1.0 - smoothstep(0.88, 1.0, uDrop);
            vec3 finalColor = col.rgb * vShade;
            gl_FragColor = vec4(finalColor, col.a * fade);
          }
        `}
      />
    </mesh>
  );
}

// ── Scene ──────────────────────────────────────────────────────────────────
function ClothScene({
  dropRef,
  entryRef,
}: {
  dropRef: React.MutableRefObject<number>;
  entryRef: React.MutableRefObject<number>;
}) {
  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 6, 5]} intensity={0.75} />
      <ClothMesh dropRef={dropRef} entryRef={entryRef} />
    </>
  );
}

// ── HeroSection Component ──────────────────────────────────────────────────
export default function HeroSection({ splashFinished = false, children }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef(0);
  const entryRef = useRef(0);

  useEffect(() => { setMounted(true); }, []);

  // Entrance sway after splash screen completes
  useEffect(() => {
    if (!splashFinished) return;
    entryRef.current = 1.0;
    const start = performance.now();
    const DECAY = 2500;
    const tick = () => {
      const elapsed = performance.now() - start;
      entryRef.current = Math.max(0, 1 - elapsed / DECAY);
      if (elapsed < DECAY) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [splashFinished]);

  // Real scroll-driven lerp with smooth fluid dampening
  useEffect(() => {
    if (!splashFinished) return;

    let animId: number;

    const updateScroll = () => {
      // loop kabhi marna nahi chahiye — ref/height ek frame ke liye galat ho
      // to bas skip karo, agle frame do try karo (warna cloth mid-drop atak jata hai)
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollableHeight = containerRef.current.offsetHeight - window.innerHeight;

        if (scrollableHeight > 0) {
          const rawProgress = Math.max(0, Math.min(1, -rect.top / scrollableHeight));
          dropRef.current += (rawProgress - dropRef.current) * 0.08;
        }
      }

      animId = requestAnimationFrame(updateScroll);
    };

    animId = requestAnimationFrame(updateScroll);
    return () => cancelAnimationFrame(animId);
  }, [splashFinished]);

  return (
    <div
      ref={containerRef}
      id="hero"
      style={{
        height: "220vh",
        position: "relative",
        // transparent — the fixed GateWorld canvas (z-0) shows through as the
        // cloth falls; the cloth shader itself is untouched
        backgroundColor: "transparent",
        zIndex: 10,
      }}
    >
      <section
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          backgroundColor: "transparent",
        }}
      >
        {/* Content layer revealed as the cloth falls away */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          {children}
        </div>
        {mounted && splashFinished && (
          <Canvas
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              opacity: splashFinished ? 1 : 0,
              transition: "opacity 0.3s",
              pointerEvents: dropRef.current >= 0.95 ? "none" : "auto",
            }}
            camera={{ position: [0, 0, 7], fov: 45 }}
            gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
            onCreated={({ gl }) => gl.setClearColor("#000000", 0)}
          >
            <ClothScene dropRef={dropRef} entryRef={entryRef} />
          </Canvas>
        )}
      </section>
    </div>
  );
}
