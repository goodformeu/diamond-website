"use client";

import { forwardRef } from "react";
import type { Group } from "three";

/**
 * Abstracted straight-razor silhouette (blade + handle) for Scene 3 — deliberately
 * non-literal per the brief ("abstracte of 3D barber tool"), not a modeled prop.
 * Starts at scale 0; the rig scales it into view during the final scroll beat.
 */
const CutTool = forwardRef<Group>(function CutTool(_props, ref) {
  return (
    <group ref={ref} scale={0}>
      <mesh position={[-0.55, 0, 0]} rotation={[0, 0, 0.12]}>
        <boxGeometry args={[1.5, 0.09, 0.02]} />
        <meshStandardMaterial color="#ececeb" metalness={0.85} roughness={0.18} />
      </mesh>
      <mesh position={[0.45, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.85, 20]} />
        <meshStandardMaterial color="#161617" metalness={0.35} roughness={0.55} />
      </mesh>
    </group>
  );
});

export default CutTool;
