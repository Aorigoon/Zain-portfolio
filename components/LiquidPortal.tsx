"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BOAT_REST, BOAT_HEADING } from "./Boat";

// ── BLACK LIQUID PORTAL (user: "portal shuru me NAHI aaye — jaise hi boat
//    thodi aage chale tab aaye; boat portal ko touch kare, andar jaaye, phir
//    effect"). Boat path ke aakhir me floating dark disc — halka liquid
//    wobble edge. Reveal SAIL se juda hai: boat chal hi chuki hogi tabhi
//    portal saamne aata hai. Phir HTML black overlay bhar deta hai.

const PATH_POINT = (d: number, out: THREE.Vector3) =>
  out.copy(BOAT_REST).addScaledVector(BOAT_HEADING, d);

// boat is plane ko d=21 (sail≈0.7) par cross karti hai — bilkul tab jab
// black fill complete hota hai ("usi waqt" — user)
const PORTAL_D = 21;
const PORTAL_R = 3.4;

export default function LiquidPortal({ progress }: { progress: React.MutableRefObject<number> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const pos = useMemo(() => PATH_POINT(PORTAL_D, new THREE.Vector3()), []);
  const yaw = useMemo(() => Math.atan2(BOAT_HEADING.x, BOAT_HEADING.z), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReveal: { value: 0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    const p = Math.max(0, Math.min(1, progress.current));
    const e = p * p * (3 - 2 * p);
    // reveal e-based — side-hold se hi portal nazar aata hai, back-scroll
    // par bhi (user: "wapsi par portal nazar nahi aata" — fix)
    matRef.current.uniforms.uReveal.value = THREE.MathUtils.smoothstep(
      THREE.MathUtils.clamp((e - 0.72) / 0.06, 0, 1),
      0,
      1
    );
  });

  return (
    // yaw+π: face boat/camera ki taraf (warna back-face cull = portal gayab)
    <mesh position={[pos.x, 1.7, pos.z]} rotation={[0, yaw + Math.PI, 0]}>
      <circleGeometry args={[PORTAL_R, 48]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform float uReveal;
          void main() {
            vec2 c = vUv - 0.5;
            float d = length(c) * 2.0;
            float ang = atan(c.y, c.x);
            // liquid wobble edge — halka saans jaisa
            float edge = 0.86 + sin(ang * 5.0 + uTime * 0.9) * 0.035 + sin(ang * 9.0 - uTime * 0.6) * 0.02;
            // deep black core, ink-dark rim
            float body = smoothstep(edge, edge - 0.3, d);
            vec3 col = vec3(0.0);
            col += vec3(0.05, 0.06, 0.08) * smoothstep(edge - 0.32, edge, d) * (0.5 + 0.5 * sin(uTime * 1.3));
            float alpha = smoothstep(1.0, edge - 0.02, d) * uReveal;
            if (alpha < 0.003) discard;
            gl_FragColor = vec4(col, alpha);
          }
        `}
      />
    </mesh>
  );
}
