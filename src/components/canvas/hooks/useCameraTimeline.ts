"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import * as THREE from "three";
import type { Group } from "three";

type Pointer = { x: number; y: number };

/**
 * Drives the whole Act One per-frame choreography (camera dolly + mouse
 * parallax + diamond idle/shrink + cut-tool reveal) from a single scroll
 * progress ref (0–1) written by GSAP's ScrollTrigger onUpdate — never React
 * state, so scrolling never triggers a component re-render.
 */
export function useCameraTimeline(
  progressRef: RefObject<number>,
  pointerRef: RefObject<Pointer>,
  diamondRef: RefObject<Group | null>,
  cutToolRef: RefObject<Group | null>,
) {
  const { camera } = useThree();
  const parallax = useRef({ x: 0, y: 0 });

  useFrame((_state, delta) => {
    const progress = progressRef.current;

    const targetZ = THREE.MathUtils.lerp(6, 2.4, THREE.MathUtils.smoothstep(progress, 0, 0.85));
    const targetY = THREE.MathUtils.lerp(0, -0.25, THREE.MathUtils.smoothstep(progress, 0.35, 1));

    parallax.current.x = THREE.MathUtils.damp(parallax.current.x, pointerRef.current.x * 0.35, 4, delta);
    parallax.current.y = THREE.MathUtils.damp(parallax.current.y, pointerRef.current.y * 0.2, 4, delta);

    camera.position.set(parallax.current.x, targetY + parallax.current.y, targetZ);
    camera.lookAt(0, 0, 0);

    const diamond = diamondRef.current;
    if (diamond) {
      diamond.rotation.y += delta * THREE.MathUtils.lerp(0.15, 0.6, THREE.MathUtils.smoothstep(progress, 0, 0.75));
      diamond.rotation.x = THREE.MathUtils.lerp(0, 0.4, THREE.MathUtils.smoothstep(progress, 0.3, 0.75));
      const diamondScale = 1 - THREE.MathUtils.smoothstep(progress, 0.72, 0.95);
      diamond.scale.setScalar(diamondScale);
    }

    const cutTool = cutToolRef.current;
    if (cutTool) {
      const cutScale = THREE.MathUtils.smoothstep(progress, 0.72, 1);
      cutTool.scale.setScalar(cutScale);
      cutTool.rotation.z = THREE.MathUtils.lerp(-0.6, 0, THREE.MathUtils.smoothstep(progress, 0.72, 1));
      cutTool.rotation.y += delta * 0.2;
    }
  });
}
