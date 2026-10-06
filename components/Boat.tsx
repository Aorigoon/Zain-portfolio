"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// ── User ka boat model (Sketchfab → Draco+WebP compressed, 10.5MB → 1MB).
//    Tree island se kaafi door, chhote islet ke paas anchor. Scroll ke last
//    beat me boat chalti hai (sail) aur camera uske PEECHHE aa jaata hai —
//    boat aur camera dono isi file ke shared math se chalte hain taaki
//    frame-by-frame match karein.

export const BOAT_REST = new THREE.Vector3(-12.5, 0, -51.5);
export const BOAT_HEADING = new THREE.Vector3(-0.42, 0, -0.91).normalize();
// camera-side perpendicular — side view aur chase dono isi taraf se aate hain
export const BOAT_SIDE = new THREE.Vector3(BOAT_HEADING.z, 0, -BOAT_HEADING.x);
export const SAIL_START = 0.78;
// chase beat ke saath sail: boat slow-smooth aage, paani par SYSTEMS words
// ke upar se, aakhir me black portal me dhalti hai (LiquidPortal d=31)
export const SAIL_DIST = 30;

// smoothstepped journey progress — GateWorldSection ke CameraRig jaisa hi
function journeyE(p: number) {
  const c = Math.max(0, Math.min(1, p));
  return c * c * (3 - 2 * c);
}

// smoothstepped e (0..1) → boat ki world position; return = sail amount 0..1
export function boatWorldAt(e: number, out: THREE.Vector3) {
  const t = Math.max(0, Math.min(1, (e - SAIL_START) / (1 - SAIL_START)));
  const s = t * t * (3 - 2 * t);
  out.copy(BOAT_REST).addScaledVector(BOAT_HEADING, s * SAIL_DIST);
  return s;
}

const _pos = new THREE.Vector3();

export default function Boat({
  progress,
  completedRef,
}: {
  progress: React.MutableRefObject<number>;
  completedRef: React.MutableRefObject<boolean>;
}) {
  const { scene } = useGLTF("/3d-models/boat.glb");
  const sailRef = useRef<THREE.Group>(null);
  const bobRef = useRef<THREE.Group>(null);
  const wake = useRef<THREE.Group>(null);
  const wakeMats = useRef<THREE.MeshBasicMaterial[]>([]);
  // foam streak texture — soft edges + bubbles, flat-sticker look khatam
  const foam = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.4, "rgba(255,255,255,0.4)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 256);
    const m = ctx.createLinearGradient(0, 0, 128, 0);
    m.addColorStop(0, "rgba(0,0,0,0)");
    m.addColorStop(0.5, "rgba(0,0,0,1)");
    m.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillStyle = m;
    ctx.fillRect(0, 0, 128, 256);
    ctx.globalCompositeOperation = "source-atop";
    for (let i = 0; i < 90; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.15 + Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(Math.random() * 128, Math.random() * 256, 1 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  const ringMats = useRef<THREE.MeshBasicMaterial[]>([]);
  const ringMeshes = useRef<THREE.Mesh[]>([]);

  // wake trail — boat jahan-jahan guzarti hai wahan foam patches chhodti hai
  // jo phail kar dheere-dhere mitte hain (asli paani jaisa — foam boat ke
  // saath nahi chalta, peeche padha rehta hai). Research: foam-decay trick.
  const foamBlob = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 6, 64, 64, 62);
    g.addColorStop(0, "rgba(255,255,255,0.85)");
    g.addColorStop(0.45, "rgba(255,255,255,0.4)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.2 + Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(20 + Math.random() * 88, 20 + Math.random() * 88, 1 + Math.random() * 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  const TRAIL_N = 16;
  const trailRefs = useRef<(THREE.Mesh | null)[]>([]);
  const trailMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const trail = useMemo(
    () => Array.from({ length: TRAIL_N }, () => ({ born: -1, x: 0, z: 0, side: 1 })),
    []
  );
  const trailIdx = useRef(0);
  const trailLastDist = useRef(0);
  const prevSailRef = useRef(0); // reverse detection (back-scroll foam cleanup)

  const placed = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = 3.2 / Math.max(size.x, size.z); // user: poori ship frame me aani chahiye — chhoti ki
    return { s, center, min: box.min.clone() };
  }, [scene]);

  // boat ke GLB materials — first-pass hiding + sail haze inhi par lagta hai
  const hullMats = useMemo(() => {
    const found: THREE.Material[] = [];
    scene.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (m && !found.includes(m)) found.push(m);
    });
    found.forEach((m) => {
      m.transparent = true;
    });
    return found;
  }, [scene]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const e = journeyE(progress.current);
    let sail = 0;
    if (sailRef.current) {
      sail = boatWorldAt(e, _pos);
      sailRef.current.position.set(_pos.x, Math.sin(t * 1.4) * 0.07, _pos.z);
    }
    // VISIBILITY (user): boat PEHLE SE khadi nazar aaye — koi fade/pop nahi
    // ("boat yakdam aa gayi" complaint — ab hamesha visible, portal entry par
    // hi dhulti hai). Sail dauran halka fog-blur waisa hi.
    const vis = 1;
    // portal me dhulna — boat portal plane cross karti hai tab black bhar raha
    // hota hai (PORTAL_D=21 par sail≈0.7 → dono "usi waqt")
    const portalFade = 1 - THREE.MathUtils.smoothstep(
      THREE.MathUtils.clamp((sail - 0.62) / 0.13, 0, 1),
      0,
      1
    );
    const boatOp = vis * (1 - sail * 0.45) * portalFade;
    for (const m of hullMats) m.opacity = boatOp;
    if (sailRef.current) sailRef.current.visible = boatOp > 0.01;
    // bobbing — boat ke apne local axes par roll/pitch
    if (bobRef.current) {
      bobRef.current.rotation.z = Math.sin(t * 1.05 + 1.2) * 0.045;
      bobRef.current.rotation.x = Math.sin(t * 0.8) * 0.03;
    }
      // REVERSE CLEANUP (user): back-scroll par boat apni hi safed foam ke
      // beech se guzarti thi — ab reverse par poora trail saaf ho jaata hai
      // aur wake sirf FORWARD chalne par dikhti hai ("un-sail" = paani bhi
      // peeche ho jaata hai)
      const dir = sail - prevSailRef.current;
      prevSailRef.current = sail;
      const reversing = dir < -0.0004;
      if (reversing) {
        for (const slot of trail) slot.born = -1;
        trailLastDist.current = 0;
        trailIdx.current = 0;
      }

      // wake — sirf sailing ke dauraan peeche paani (user: "peeche paani ud raha hai")
      if (wake.current) {
        wake.current.position.set(_pos.x - BOAT_HEADING.x * 2.9, 0.02, _pos.z - BOAT_HEADING.z * 2.9);
        wake.current.rotation.y = Math.atan2(BOAT_HEADING.x, BOAT_HEADING.z);
        // stern churn — halka sa dhuan sa jhag, saans ki tarah (reverse par nahi)
        for (const m of wakeMats.current) m.opacity = 0.2 * sail * vis * portalFade * (reversing ? 0 : 1) * (0.75 + Math.sin(t * 6.5) * 0.25);
        // TRAIL — har thodi door par foam patch chhodo; wo wahin padha rehta
        // hai, phailta hai aur mit-ta hai (boat ke saath nahi chalta).
        // Sirf FORWARD par spawn (reverse par nahi — warna naye dhabbe)
        const dist = sail * SAIL_DIST;
        if (!reversing && sail > 0.02 && dist - trailLastDist.current > 1.15) {
          trailLastDist.current = dist;
          const slot = trail[trailIdx.current % TRAIL_N];
          slot.born = t;
          slot.x = _pos.x - BOAT_HEADING.x * 2.5;
          slot.z = _pos.z - BOAT_HEADING.z * 2.5;
          slot.side = trailIdx.current % 2 === 0 ? 1 : -1;
          trailIdx.current++;
        }
        for (let i = 0; i < TRAIL_N; i++) {
          const slot = trail[i];
          const mesh = trailRefs.current[i];
          const mat = trailMats.current[i];
          if (!mesh || !mat) continue;
          if (slot.born < 0) {
            mat.opacity = 0;
            continue;
          }
          const age = t - slot.born;
          if (age > 5.5) {
            mat.opacity = 0;
            continue;
          }
          mesh.position.set(slot.x + slot.side * age * 0.09, 0.02, slot.z);
          mesh.scale.setScalar(0.6 + age * 0.5);
          mat.opacity = 0.3 * (1 - age / 5.5) * sail * vis * portalFade;
        }
        if (sail <= 0.02) trailLastDist.current = 0;
      }
  });

  return (
    <>
      <group
        ref={sailRef}
        position={[BOAT_REST.x, 0, BOAT_REST.z]}
        rotation={[0, Math.atan2(BOAT_HEADING.x, BOAT_HEADING.z) + Math.PI, 0]} // +π: model ka front ulta tha — ab BACK camera ki taraf
      >
        <group ref={bobRef}>
          <group
            scale={placed.s}
            position={[-placed.center.x * placed.s, -placed.min.y * placed.s, -placed.center.z * placed.s]}
          >
            <primitive object={scene} />
          </group>
        </group>
      </group>

      {/* wake — foam streaks (noisy, soft) + phailte ripple rings */}
      <group ref={wake}>
        <group rotation={[0, 0.38, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2.2]}>
            <planeGeometry args={[0.9, 4.6]} />
            <meshBasicMaterial
              ref={(m) => { if (m) wakeMats.current[0] = m; }}
              map={foam}
              color="#eaf5fd"
              transparent
              opacity={0}
              depthWrite={false}
              toneMapped={false}
              fog={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
        <group rotation={[0, -0.38, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2.2]}>
            <planeGeometry args={[0.9, 4.6]} />
            <meshBasicMaterial
              ref={(m) => { if (m) wakeMats.current[1] = m; }}
              map={foam}
              color="#eaf5fd"
              transparent
              opacity={0}
              depthWrite={false}
              toneMapped={false}
              fog={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>

      {/* trail pool — boat ke peeche bichha foam (har patch world me fix rehta hai) */}
      {Array.from({ length: TRAIL_N }).map((_, i) => (
        <mesh
          key={`t${i}`}
          ref={(m) => { trailRefs.current[i] = m; }}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[0.75, 18]} />
          <meshBasicMaterial
            ref={(m) => { trailMats.current[i] = m; }}
            map={foamBlob}
            color="#e6f2fb"
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
            fog={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}
