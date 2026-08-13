"use client";

import { Canvas } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import type { Group } from "three";
import Diamond from "@/components/canvas/objects/Diamond";
import CutTool from "@/components/canvas/objects/CutTool";
import { useCameraTimeline } from "@/components/canvas/hooks/useCameraTimeline";

type Pointer = { x: number; y: number };

type SceneCanvasProps = {
  progressRef: RefObject<number>;
  pointerRef: RefObject<Pointer>;
};

function Rig({ progressRef, pointerRef }: SceneCanvasProps) {
  const diamondRef = useRef<Group>(null);
  const cutToolRef = useRef<Group>(null);

  useCameraTimeline(progressRef, pointerRef, diamondRef, cutToolRef);

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#ffffff" />
      <pointLight position={[-4, -2, -3]} intensity={0.6} color="#c9cbd1" />
      <Diamond ref={diamondRef} />
      <CutTool ref={cutToolRef} />
    </>
  );
}

/**
 * The single, shared WebGL canvas for Act One (scenes 1–3). Mounted/unmounted
 * by the parent scene component — never kept alive past scene 3, to free the
 * GPU/battery budget for the rest of the (2D/DOM) page.
 */
export default function SceneCanvas({ progressRef, pointerRef }: SceneCanvasProps) {
  return (
    <Canvas dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }} camera={{ fov: 35, position: [0, 0, 6] }}>
      <Rig progressRef={progressRef} pointerRef={pointerRef} />
    </Canvas>
  );
}
