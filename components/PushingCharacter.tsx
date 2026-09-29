"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

function SupermanAnimated({ charPos }: { charPos: number }) {
  const { scene } = useGLTF('/superman_-_dc.glb');
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  
  const group = useRef<THREE.Group>(null);
  
  // Find bones
  const bones = useMemo(() => {
    const b: Record<string, THREE.Bone> = {};
    clone.traverse((node) => {
      if ((node as THREE.Bone).isBone) {
        b[node.name] = node as THREE.Bone;
      }
    });
    return b;
  }, [clone]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = 6;
    
    if (group.current) {
      group.current.position.x = charPos;
      // Face right and lean forward to push
      group.current.rotation.y = Math.PI / 2; // Facing right
      group.current.rotation.x = 0.5; // Lean forward
      
      // Move slightly to the right during the push to look natural
      group.current.position.x += (t * speed * 0.1);
      
      group.current.position.y = Math.abs(Math.sin(t * speed * 0.5)) * 0.1 - 2.5; // Straining steps
    }

    // Animate Arms pushing forward
    const lArm = bones["Bip001 L UpperArm_31"];
    const rArm = bones["Bip001 R UpperArm_56"];
    const lForearm = bones["Bip001 L Forearm_28"];
    const rForearm = bones["Bip001 R Forearm_53"];

    if (lArm && rArm && lForearm && rForearm) {
      // Put arms forward
      lArm.rotation.x = -1.5;
      lArm.rotation.z = -0.2;
      rArm.rotation.x = -1.5;
      rArm.rotation.z = 0.2;
      
      lForearm.rotation.x = 0.2;
      rForearm.rotation.x = 0.2;
    }

    // Animate Legs walking
    const lThigh = bones["Bip001 L Thigh_5"];
    const rThigh = bones["Bip001 R Thigh_9"];
    const lCalf = bones["Bip001 L Calf_4"];
    const rCalf = bones["Bip001 R Calf_8"];

    if (lThigh && rThigh && lCalf && rCalf) {
      lThigh.rotation.x = Math.sin(t * speed * 0.5) * 0.5;
      rThigh.rotation.x = Math.sin(t * speed * 0.5 + Math.PI) * 0.5;
      
      lCalf.rotation.x = Math.max(0, -Math.sin(t * speed * 0.5 + Math.PI/2)) * 0.8;
      rCalf.rotation.x = Math.max(0, -Math.sin(t * speed * 0.5 - Math.PI/2)) * 0.8;
    }
  });

  return (
    <group ref={group} scale={1.5}>
      <primitive object={clone} />
    </group>
  );
}

// Preload the model
useGLTF.preload('/superman_-_dc.glb');

export default function PushingCharacter({ charPos }: { charPos: number }) {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 100 }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 5]} intensity={3} />
        <SupermanAnimated charPos={charPos} />
      </Canvas>
    </div>
  );
}
