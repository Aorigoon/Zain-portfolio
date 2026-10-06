"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import Boat, { boatWorldAt, BOAT_HEADING, BOAT_SIDE } from "./Boat";
import LiquidPortal from "./LiquidPortal";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";

gsap.registerPlugin(ScrollTrigger);

// ── Quality tier: weakest phones get a cheaper reflection + DPR ──────────
function useQualityTier() {
  return useMemo(() => {
    if (typeof window === "undefined")
      return { res: 256, maxDpr: 1.25, low: true, precision: "mediump" as const };
    const low =
      window.matchMedia("(pointer: coarse)").matches ||
      (navigator as any).deviceMemory <= 4 ||
      (navigator.hardwareConcurrency || 8) <= 4;
    return {
      res: low ? 256 : 1024, // 1024 reflection target — crisper cloud/gate mirror
      maxDpr: low ? 1.25 : 2,
      low,
      precision: (low ? "mediump" : "highp") as "mediump" | "highp",
    };
  }, []);
}

// ── Sun sits ahead of the camera — specular glitter path on the water.
const SUN_DIR = new THREE.Vector3(0.2, 0.45, -1).normalize();

// ── Photoreal sky dome — CC0 equirectangular panorama (Poly Haven
//    "kloofendal_48d_partly_cloudy_puresky", tonemapped to JPG). BackSide
//    sphere with toneMapped:false renders it EXACTLY, and the Water mirror
//    reflects the dome — so the photoreal clouds "paade fully", reference-
//    grade sky (user: mousham.design jaisa neat & pure chahiye).
function SkyDome() {
  const tex = useMemo(() => {
    const t = new THREE.TextureLoader().load("/assets/sky_horizon.jpg");
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.x = -1; // BackSide sphere mirrors the panorama — un-mirror it
    return t;
  }, []);
  return (
    <mesh scale={110} renderOrder={-1}>
      <sphereGeometry args={[1, 48, 32]} />
      <meshBasicMaterial map={tex} side={THREE.BackSide} depthWrite={false} toneMapped={false} fog={false} />
    </mesh>
  );
}

// ── Sun glow — soft additive light source ahead (SUN_DIR), the reference's
//    backlight. Sprite renders in the Water reflection too.
function SunGlow() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 2, 128, 128, 128);
    g.addColorStop(0, "rgba(255,252,240,0.95)");
    g.addColorStop(0.25, "rgba(255,244,214,0.5)");
    g.addColorStop(0.6, "rgba(255,238,200,0.16)");
    g.addColorStop(1, "rgba(255,238,200,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  const pos = SUN_DIR.clone().normalize().multiplyScalar(88);
  return (
    <sprite position={[pos.x, pos.y, pos.z]} scale={[34, 34, 1]}>
      <spriteMaterial
        map={tex}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
        fog={false}
      />
    </sprite>
  );
}

// ── Torii gate from the GLB, auto-scaled to world size ───────────────────
function ToriiGate() {
  const { scene } = useGLTF("/3d-models/japanese_tori_gate.glb");

  const placed = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = 5.2 / size.y; // world height ≈ 5.2 units (slightly smaller gate)
    return { s, center, min: box.min.clone() };
  }, [scene]);

  return (
    <group
      scale={placed.s}
      position={[-placed.center.x * placed.s, -placed.min.y * placed.s - 0.35, -placed.center.z * placed.s]}
    >
      <primitive object={scene} />
    </group>
  );
}

// ── Camera rig — ONE smooth CatmullRom spline with THREE stops, each with
//    its own HOLD: the stone → the tree island → the wooden raft-sign.
const camCurve = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 2.3, 14),
    new THREE.Vector3(0, 2.05, 2),
    new THREE.Vector3(0, 2.0, -4), // stone close-up — hold anchor
    new THREE.Vector3(2.0, 2.1, -8.5),
    new THREE.Vector3(4.4, 2.2, -13.5), // passing the stone's right side
    new THREE.Vector3(4.4, 2.35, -21), // right-side world over the water
    new THREE.Vector3(3.2, 2.5, -27),
    new THREE.Vector3(2.7, 2.6, -27.5), // island view — hold anchor
    new THREE.Vector3(0.3, 2.6, -31.2),
    new THREE.Vector3(-4.6, 2.6, -35.8), // pehle side-step (user: neeche ki taraf NAHI)
    new THREE.Vector3(-8.6, 2.55, -41.5),
    new THREE.Vector3(-10.2, 2.5, -46.2), // boat ke PEECHHE — camera ooncha, poori ship frame me
  ],
  false,
  "catmullrom",
  0.5
);

const lookCurve = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 2.4, 0),
    new THREE.Vector3(0, 1.9, -6),
    new THREE.Vector3(0, 1.7, -11), // the stone (hold anchor)
    new THREE.Vector3(1.8, 1.9, -20),
    new THREE.Vector3(4.5, 2.4, -38), // the tree (hold anchor)
    new THREE.Vector3(1.5, 2.3, -42.5),
    new THREE.Vector3(-12.4, 1.7, -50.8), // boat ka beech (paani me nahi — jhukna nahi)
  ],
  false,
  "catmullrom",
  0.5
);

// arc-length fractions of the three hold anchors
const U_STONE = (() => {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i <= 200; i++) {
    const p = camCurve.getPointAt(i / 200);
    const d = Math.abs(p.z + 4) + Math.abs(p.x);
    if (d < bestD) {
      bestD = d;
      best = i / 200;
    }
  }
  return best;
})();
const U_ISLAND = (() => {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i <= 200; i++) {
    const p = camCurve.getPointAt(i / 200);
    const d = p.distanceTo(new THREE.Vector3(2.7, 2.6, -27.5));
    if (d < bestD) {
      bestD = d;
      best = i / 200;
    }
  }
  return best;
})();

const _camPos = new THREE.Vector3();
const _camLook = new THREE.Vector3();
const _boatPos = new THREE.Vector3();
const _sidePos = new THREE.Vector3();
const _sideLook = new THREE.Vector3();
const _chasePos = new THREE.Vector3();
const _chaseLook = new THREE.Vector3();

function CameraRig({ progress }: { progress: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  useFrame(() => {
    const p = Math.max(0, Math.min(1, progress.current));
    const e = p * p * (3 - 2 * p); // smoothstep
    let u: number;
    if (e < 0.26) {
      // approach the stone
      u = (e / 0.26) * U_STONE;
    } else if (e < 0.38) {
      // HOLD at the stone — reading time
      u = U_STONE;
    } else if (e < 0.58) {
      // travel to the tree island — slow, scenic leg (user: speed kam karo)
      u = U_STONE + ((e - 0.38) / 0.2) * (U_ISLAND - U_STONE);
    } else if (e < 0.66) {
      // HOLD at the project island
      u = U_ISLAND;
    } else if (e < 0.74) {
      // LEFT travel — zyada scroll, project cards ring ke bilkul bahar se
      u = U_ISLAND + ((e - 0.66) / 0.08) * (1 - U_ISLAND);
    } else {
      // HOLD — boat ka side view (user: pehle SIDE, phir peeche)
      u = 1;
    }
    if (e < 0.78) {
      camCurve.getPointAt(u, _camPos);
      lookCurve.getPointAt(u, _camLook);
    } else {
      // Chase beat — boat chalti hai, camera uske PEECHHE aa jaata hai (user)
      boatWorldAt(e, _boatPos);
      const k = THREE.MathUtils.smoothstep(
        THREE.MathUtils.clamp((e - 0.78) / 0.06, 0, 1),
        0,
        1
      );
      camCurve.getPointAt(1, _sidePos);
      lookCurve.getPointAt(1, _sideLook);
      // pure BACK view — thoda ooncha + door, poori ship frame me (user)
      _chasePos.copy(_boatPos).addScaledVector(BOAT_HEADING, -6.5).addScaledVector(BOAT_SIDE, 0.35);
      _chasePos.y = 2.6;
      _chaseLook.copy(_boatPos).addScaledVector(BOAT_HEADING, 3.5);
      _chaseLook.y = 1.5;
      _camPos.lerpVectors(_sidePos, _chasePos, k);
      _camLook.lerpVectors(_sideLook, _chaseLook, k);
    }
    camera.position.copy(_camPos);
    camera.lookAt(_camLook);
  });
  return null;
}

// ── Real wave water — three.js Water shader (animated normal-map ripples
//    + live planar reflection), fog-matched so it melts into the sky ──────
function WaterSurface({ res }: { res: number }) {
  const normals = useMemo(() => {
    const t = new THREE.TextureLoader().load("/assets/waternormals.jpg");
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }, []);

  const water = useMemo(() => {
    // 2000×2000 — plane ka far edge TRUE horizon ke paar chala jaata hai,
    // toh dome aur paani ke beech koi sliver/edge line nahi bachti (user:
    // "is tarha lagta jaise partition hy")
    const geom = new THREE.PlaneGeometry(2000, 2000);
    const w = new Water(geom, {
      textureWidth: res,
      textureHeight: res,
      waterNormals: normals,
      sunDirection: SUN_DIR,
      sunColor: 0xffffff,
      waterColor: 0x8ab8de,
      // near-perfect mirror — cloud reflections must read FULLY, like the
      // reference where the water is a second sky
      distortionScale: 0.65,
      fog: true,
    });
    w.rotation.x = -Math.PI / 2;
    // finer ripples — small-scale detail reads as khubsurat glass, not broad swells
    (w.material as THREE.ShaderMaterial).uniforms.size.value = 4;
    return w;
  }, [res, normals]);

  useFrame((_, delta) => {
    const u = (water.material as THREE.ShaderMaterial).uniforms;
    u.time.value += delta * 0.5;
  });

  return <primitive object={water} />;
}

// ── Inscription drawn with the already-loaded Caveat webfont ─────────────
function useStoneTexture() {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    const draw = () => {
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 720;
      const ctx = c.getContext("2d")!;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";

      // kicker — "about me" first, at the top
      try { ctx.letterSpacing = "10px"; } catch { /* older engines ignore */ }
      ctx.globalAlpha = 0.8;
      ctx.font = "700 34px 'Caveat', cursive";
      ctx.fillText("ABOUT ME", c.width / 2, 100);
      ctx.globalAlpha = 1;
      try { ctx.letterSpacing = "0px"; } catch { /* ignore */ }

      // headline — the name
      ctx.font = "700 70px 'Caveat', cursive";
      ctx.fillText("Hello, I am Zain.", c.width / 2, 195);

      // body — big enough to actually read
      ctx.font = "700 40px 'Caveat', cursive";
      const lines = [
        "I turn ambitious ideas into",
        "living digital experiences —",
        "where design, motion",
        "and code move as one.",
      ];
      lines.forEach((l, i) => ctx.fillText(l, c.width / 2, 265 + i * 50));

      // divider
      ctx.globalAlpha = 0.75;
      ctx.font = "700 28px 'Caveat', cursive";
      ctx.fillText("✦  ✦  ✦", c.width / 2, 462);
      ctx.globalAlpha = 1;

      // the big roles line
      ctx.font = "700 58px 'Caveat', cursive";
      ctx.fillText("Full-Stack Developer", c.width / 2, 532);
      ctx.fillText("& Graphic Designer", c.width / 2, 600);

      const t = new THREE.CanvasTexture(c);
      t.anisotropy = 4;
      setTex(t);
    };
    if (document.fonts?.status === "loaded") draw();
    else document.fonts?.ready.then(draw);
  }, []);
  return tex;
}

// ── The About stone — a natural standing TABLET built in three.js.
//    (The GLB rock was a narrow pillar, user rejected it.) Irregular
//    slab outline + the GLB's own extracted stone textures keep it
//    natural-looking. Static: no rise/fade; the camera does the moving.
function useTabletGeometry() {
  return useMemo(() => {
    const W = 2.5, H = 3.1;
    const pts: THREE.Vector2[] = [];
    const N = 26;
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      const cx = Math.cos(t), cy = Math.sin(t);
      const px = Math.sign(cx) * Math.pow(Math.abs(cx), 0.8) * (W / 2);
      const py = Math.sign(cy) * Math.pow(Math.abs(cy), 0.8) * (H / 2);
      // deterministic organic wobble — no two edges look machine-cut
      const w = 1 + Math.sin(i * 2.7) * 0.045 + Math.sin(i * 6.3 + 1.7) * 0.028;
      pts.push(new THREE.Vector2(px * w, py * w));
    }
    const shape = new THREE.Shape(pts);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 3,
      steps: 1,
    });
    geo.center();
    return geo;
  }, []);
}

function AboutStone() {
  const geo = useTabletGeometry();
  const tex = useStoneTexture();

  const rockMap = useMemo(() => {
    const t = new THREE.TextureLoader().load("/assets/stone_basecolor.png");
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(0.42, 0.42);
    t.offset.set(0.5, 0.5);
    return t;
  }, []);
  const rockNormal = useMemo(() => {
    const t = new THREE.TextureLoader().load("/assets/stone_normal.png");
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(0.42, 0.42);
    t.offset.set(0.5, 0.5);
    return t;
  }, []);

  return (
    <group position={[0, 1.2, -11]} rotation={[0, 0.08, 0.015]}>
      <mesh geometry={geo}>
        <meshStandardMaterial
          map={rockMap}
          normalMap={rockNormal}
          normalScale={new THREE.Vector2(0.8, 0.8)}
          roughness={0.95}
          metalness={0}
        />
      </mesh>
      {/* inscription floating just off the flat front face */}
      <mesh position={[0, 0.15, 0.31]}>
        <planeGeometry args={[1.85, 2.6]} />
        <meshBasicMaterial map={tex ?? undefined} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ── The island — small irregular rock disc built in three.js, wearing the
//    same natural stone textures as the tablet. The oak tree stands on it.
function useIslandGeometry() {
  return useMemo(() => {
    const R = 4.5;
    const pts: THREE.Vector2[] = [];
    const N = 30;
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      const w = 1 + Math.sin(i * 2.1) * 0.07 + Math.sin(i * 5.3 + 2.0) * 0.05;
      pts.push(new THREE.Vector2(Math.cos(t) * R * w, Math.sin(t) * R * w));
    }
    const shape = new THREE.Shape(pts);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 1.4,
      bevelEnabled: true,
      bevelThickness: 0.22,
      bevelSize: 0.25,
      bevelSegments: 4,
      steps: 1,
    });
    geo.rotateX(-Math.PI / 2); // lay flat — extrusion becomes the island's thickness
    geo.center();
    return geo;
  }, []);
}

function Island({
  position = [4.5, -0.55, -38],
  rotationY = 0.9,
  scale = 1,
}: {
  position?: [number, number, number];
  rotationY?: number;
  scale?: number;
}) {
  const geo = useIslandGeometry();
  const rockMap = useMemo(() => {
    const t = new THREE.TextureLoader().load("/assets/stone_basecolor.png");
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(0.16, 0.16);
    t.offset.set(0.5, 0.5);
    return t;
  }, []);
  const rockNormal = useMemo(() => {
    const t = new THREE.TextureLoader().load("/assets/stone_normal.png");
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(0.16, 0.16);
    t.offset.set(0.5, 0.5);
    return t;
  }, []);
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <mesh geometry={geo}>
        <meshStandardMaterial
          map={rockMap}
          normalMap={rockNormal}
          normalScale={new THREE.Vector2(0.7, 0.7)}
          roughness={0.95}
          metalness={0}
        />
      </mesh>
    </group>
  );
}

// ── The user's oak tree, auto-scaled onto the island top ─────────────────
function OakTree() {
  const { scene } = useGLTF("/3d-models/oak_tree.glb");
  const placed = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = 5.6 / size.y; // world height ≈ 5.6 units
    return { s, center, min: box.min.clone() };
  }, [scene]);
  return (
    <group position={[4.5, 0.55, -38]} rotation={[0, 0.5, 0]}>
      <group
        scale={placed.s}
        position={[-placed.center.x * placed.s, -placed.min.y * placed.s, -placed.center.z * placed.s]}
      >
        <primitive object={scene} />
      </group>
    </group>
  );
}

// ── Curved project cards orbiting the tree (mousham-style). Placeholder
//    art for now — swap in real project screenshots when provided. ────────
function makeCardTexture(label: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 320;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#101216";
  ctx.fillRect(0, 0, 512, 320);
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 496, 304);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "700 58px 'Caveat', cursive";
  ctx.fillText(label, 256, 150);
  try { ctx.letterSpacing = "6px"; } catch { /* ignore */ }
  ctx.font = "700 24px 'Montserrat', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillText("COMING SOON", 256, 205);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function OrbitCards() {
  const group = useRef<THREE.Group>(null);
  const labels = useMemo(() => ["Project 01", "Project 02", "Project 03", "Project 04", "Project 05"], []);
  const textures = useMemo(() => labels.map(makeCardTexture), [labels]);
  useFrame((_, delta) => {
    // the ring slowly revolves around the tree
    if (group.current) group.current.rotation.y += delta * 0.12;
  });
  const R = 3.3;
  return (
    <group ref={group} position={[4.5, 2.3, -38]}>
      {labels.map((label, i) => {
        const theta = (i / labels.length) * Math.PI * 2;
        return (
          <mesh key={label} position={[0, Math.sin(i * 1.7) * 0.25, 0]}>
            {/* wide curved segment — cards wrap the ring beautifully */}
            <cylinderGeometry args={[R, R, 1.7, 14, 1, true, theta - 0.425, 0.85]} />
            <meshBasicMaterial map={textures[i]} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}

// ── The distant island stays INVISIBLE until the camera has passed the
//    stone (user: "patthar hi nazar aaye") — then it fades in ahead,
//    exactly like the reference video where the tree appears far away.
function FarIslandGroup({
  progress,
  completedRef,
}: {
  progress: React.MutableRefObject<number>;
  completedRef: React.MutableRefObject<boolean>;
}) {
  const group = useRef<THREE.Group>(null);
  const mats = useRef<THREE.Material[] | null>(null);
  useFrame(() => {
    const g = group.current;
    if (!g) return;
    if (!mats.current) {
      // safe to cache once: the Suspense boundary mounts this whole subtree
      // only after both GLBs have loaded
      const found: THREE.Material[] = [];
      g.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.Material | undefined;
        if (m && !found.includes(m)) found.push(m);
      });
      found.forEach((m) => { m.transparent = true; });
      mats.current = found;
    }
    const p = Math.max(0, Math.min(1, progress.current));
    const e = p * p * (3 - 2 * p);
    // reveal later leg stops as the camera crosses the stone
    const reveal = Math.max(0, Math.min(1, (e - 0.42) / 0.16));
    for (const m of mats.current) m.opacity = reveal;
  });
  return (
    <group ref={group}>
      <Island />
      <OakTree />
      <OrbitCards />
      <Boat progress={progress} completedRef={completedRef} />
    </group>
  );
}

// ── Section ──────────────────────────────────────────────────────────────
// The world renders on a FIXED canvas that lives BEHIND the hero cloth
// (hero z-10, this z-0) — the cloth falls away straight into the gate world,
// no black gap. This section only supplies the scroll runway for the dolly;
// the portal prompt + enter cutscene hand over to skills (z-2).
export default function GateWorldSection() {
  const rootRef = useRef<HTMLElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const blackRef = useRef<HTMLDivElement>(null); // journey ke end ka black fill
  const progress = useRef(0);
  const completedRef = useRef(false); // journey end tak poora hua? (boat reveal rule — user)
  const teleportedRef = useRef(false); // portal teleport ek dafa (user)
  const fwdJumpAtRef = useRef(0); // fwd teleport time — rev cooldown
  const [active, setActive] = useState(true); // alive from load until covered
  const quality = useQualityTier();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Dolly progress across the runway — no pin, the canvas is fixed.
      // Starts at "top bottom" (= the exact moment the hero cloth finishes
      // falling) so there is NO dead scroll between the drop and the journey
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.7,
        onUpdate: (self) => {
          progress.current = self.progress;
          // black portal fill — boat portal plane (d=21) cross karte hi black
          // bhar jaata hai ("usi waqt" — user); full black next section ke
          // peek (scrollY 5920) se pehle, aur color section ke bg se match
          if (blackRef.current) {
            const e = self.progress * self.progress * (3 - 2 * self.progress);
            blackRef.current.style.opacity = String(
              Math.min(1, Math.max(0, (e - 0.905) / 0.02))
            );
          }
          if (self.progress > 0.985) completedRef.current = true;
          // TELEPORT — PURE SCROLL (user: "jaisa pehle tha — animation ship
          // par aake ruk jaye"). Koi auto-play nahi: scroll jitna utna
          // chalna; rukne par ship wahin rukti hai.
          const gateEl = rootRef.current;
          // FORWARD — black full hone par seedha FRAMEWORKS. SIRF gate zone
          // ke andar (user: "footer nazar nahi aa raha" — page ke bottom par
          // progress clamp 1 hota hai aur teleport footer ko 7100 par wapas
          // khinch leta tha — ab bounds check)
          if (
            !teleportedRef.current &&
            self.progress > 0.865 &&
            gateEl &&
            window.scrollY < gateEl.offsetTop + gateEl.offsetHeight - 2
          ) {
            teleportedRef.current = true;
            fwdJumpAtRef.current = performance.now();
            if (gateEl) window.scrollTo(0, gateEl.offsetTop + gateEl.offsetHeight + 380);
          }
          // REVERSE — intent par (1.5s cooldown + 450px upar): wapas portal
          // ke paas, portal saamne nazar aata hai. Scrub SNAP: warna 0.7s
          // transit camera sweep se paani white blow-out hota hai (user)
          if (
            teleportedRef.current &&
            gateEl &&
            performance.now() - fwdJumpAtRef.current > 1500 &&
            window.scrollY < gateEl.offsetTop + gateEl.offsetHeight - 450
          ) {
            teleportedRef.current = false;
            window.scrollTo(0, gateEl.offsetTop + 3835); // portal saamne, bright scene
            if (self.animation) {
              const targetP = Math.min(
                1,
                Math.max(
                  0,
                  (window.scrollY - (gateEl.offsetTop - window.innerHeight)) /
                    (gateEl.offsetHeight + window.innerHeight)
                )
              );
              self.animation.progress(targetP);
            }
          }
          if (hintRef.current) {
            const fade = Math.max(0, 1 - self.progress / 0.14);
            hintRef.current.style.opacity = String(fade);
          }
        },
      });
    }, rootRef);

    // Pause rendering once the next section fully covers the fixed canvas
    const onScroll = () => {
      const root = rootRef.current;
      if (!root) return;
      const bottom = root.getBoundingClientRect().bottom + window.scrollY;
      setActive(window.scrollY < bottom - 2);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      ctx.revert();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="gate-world"
      className="relative w-full select-none"
      style={{ height: "620vh", zIndex: 0 }} // four-stop water journey + portal enter
    >
      <div className="fixed inset-0" style={{ zIndex: 0 }}>
        <Canvas
          style={{ position: "absolute", inset: 0 }}
          dpr={[1, quality.maxDpr]}
          frameloop={active ? "always" : "never"}
          camera={{ position: [0, 2.3, 14], fov: 40, near: 0.1, far: 200 }}
          gl={{
            // MSAA is expensive on mobile GPUs — the DPR clamp + reflection
            // distortion hide aliasing instead (per research on the cost model)
            antialias: false,
            powerPreference: "high-performance",
            precision: quality.precision,
          }}
        >
          <Suspense fallback={null}>
            {/* Fog melts distant water/clouds into the horizon pale */}
            <color attach="background" args={["#cfe6f7"]} />
            <fog attach="fog" args={["#cfe6f7", 35, 150]} />
            <ambientLight intensity={1.0} />
            <directionalLight position={[4, 10, 12]} intensity={1.0} />

            <SkyDome />
            <SunGlow />

            <CameraRig progress={progress} />
            <ToriiGate />
            <AboutStone />
            <FarIslandGroup progress={progress} completedRef={completedRef} />
            <LiquidPortal progress={progress} />
            <WaterSurface res={quality.res} />
          </Suspense>
        </Canvas>

        {/* black portal fill — color next section ke bg (#000000) se match:
            boundary invisible, section ka rise seamless */}
        <div
          ref={blackRef}
          className="absolute inset-0 pointer-events-none"
          style={{ background: "#000000", opacity: 0 }}
        />

        {/* Scroll hint — revealed as the cloth falls away, fades when the dolly starts */}
        <p
          ref={hintRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-sm tracking-[0.4em] uppercase pointer-events-none"
          style={{ color: "#ffffff", textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}
        >
          Scroll to start ↓
        </p>
      </div>
    </section>
  );
}
