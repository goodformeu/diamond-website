"use client";

import { forwardRef } from "react";
import type { Group } from "three";

/**
 * Placeholder-quality diamond geometry for Act One (scenes 1–2). Kept simple
 * on purpose in this phase so the scroll choreography/timing can be tuned
 * before investing in a higher-fidelity model.
 */
const Diamond = forwardRef<Group>(function Diamond(_props, ref) {
  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[1.3, 0]} />
        <meshPhysicalMaterial
          color="#dfe1e5"
          metalness={0.3}
          roughness={0.08}
          transmission={0.85}
          thickness={1.4}
          ior={2.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transparent
        />
      </mesh>
    </group>
  );
});

export default Diamond;
