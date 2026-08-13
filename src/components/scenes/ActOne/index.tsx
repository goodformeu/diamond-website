"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap, registerGsap } from "@/components/scroll/gsapConfig";
import { useScrollContext } from "@/components/scroll/SmoothScrollProvider";
import { useSceneActions, useRegisterScene } from "@/components/scroll/SceneProgressProvider";

const SceneCanvas = dynamic(() => import("@/components/canvas/SceneCanvas"), { ssr: false });

const EASE = "expo.out";

/**
 * Act One = Scene 1 (Arrival) → Scene 2 (Transformation) → Scene 3 (The Cut).
 * These three beats deliberately share ONE pinned scroll range, ONE GSAP
 * timeline and ONE WebGL canvas — the brief requires scene 1 to visually
 * morph into scene 2 with no hard cut, which a per-scene canvas/timeline
 * split could not guarantee. Scroll distance for the whole act is 400vh —
 * tune pacing by changing that one class below.
 */
export default function ActOne() {
  const { isReducedMotion, isCoarsePointer } = useScrollContext();
  const { registerScene, setActiveScene } = useSceneActions();
  const showCinematic = !isReducedMotion && !isCoarsePointer;

  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const arrivalTitleRef = useRef<HTMLHeadingElement>(null);
  const transformTitleRef = useRef<HTMLParagraphElement>(null);
  const cutTitleRef = useRef<HTMLHeadingElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const beatRef = useRef(0);

  const [canvasMounted, setCanvasMounted] = useState(true);

  // Register scroll-jump targets for scenes 1–3: fractional positions within
  // Act One's single pinned container, matching the beat thresholds below.
  useEffect(() => {
    if (!showCinematic) return;
    const container = containerRef.current;
    if (!container) return;

    const makeTarget = (fraction: number) => () => {
      const rect = container.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      return top + rect.height * fraction;
    };

    const unregisters = [
      registerScene(1, makeTarget(0)),
      registerScene(2, makeTarget(0.4)),
      registerScene(3, makeTarget(0.78)),
    ];

    return () => unregisters.forEach((fn) => fn());
  }, [showCinematic, registerScene]);

  useEffect(() => {
    if (!showCinematic) return;
    registerGsap();

    const ctx = gsap.context(() => {
      // Entrance: plays once on load, independent of scroll.
      gsap
        .timeline({ delay: 0.2 })
        .fromTo(eyebrowRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: EASE })
        .fromTo(
          arrivalTitleRef.current,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 1.1, ease: EASE },
          "-=0.6",
        )
        .fromTo(scrollCueRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: EASE }, "-=0.4");

      // Choreography: scroll-scrubbed transformation through the three beats.
      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: pinRef.current,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            const beat = self.progress < 0.35 ? 1 : self.progress < 0.75 ? 2 : 3;
            if (beat !== beatRef.current) {
              beatRef.current = beat;
              setActiveScene(beat);
            }
          },
          onLeave: () => setCanvasMounted(false),
          onEnterBack: () => setCanvasMounted(true),
        },
      })
        .to(scrollCueRef.current, { opacity: 0, duration: 0.08 }, 0)
        .to(arrivalTitleRef.current, { opacity: 0, y: -50, duration: 0.18 }, 0.2)
        .to(eyebrowRef.current, { opacity: 0, duration: 0.12 }, 0.2)
        .fromTo(
          transformTitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.16 },
          0.38,
        )
        .to(transformTitleRef.current, { opacity: 0, y: -30, duration: 0.14 }, 0.66)
        .fromTo(cutTitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.2 }, 0.76);
    }, containerRef);

    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      ctx.revert();
    };
  }, [showCinematic, setActiveScene]);

  if (!showCinematic) {
    return <ActOneFallback />;
  }

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-ink">
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">{canvasMounted && <SceneCanvas progressRef={progressRef} pointerRef={pointerRef} />}</div>
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-ink via-transparent to-ink/40"
        />

        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p ref={eyebrowRef} className="mb-6 text-xs uppercase tracking-[0.3em] text-mist opacity-0">
              Purmerend — Barbershop
            </p>
            <h1 ref={arrivalTitleRef} className="font-display text-display-xl text-paper opacity-0">
              Diamond
            </h1>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <p ref={transformTitleRef} className="font-display text-display-lg text-paper opacity-0">
              Precision in Motion
            </p>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <h2 ref={cutTitleRef} className="font-display text-display-xl text-paper opacity-0">
              The Cut
            </h2>
          </div>
        </div>

        <div
          ref={scrollCueRef}
          className="absolute right-6 bottom-8 z-10 hidden flex-col items-center gap-3 opacity-0 md:right-10 md:flex lg:right-16"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-mist">Scroll</span>
          <span className="h-12 w-px bg-line" aria-hidden />
        </div>
      </div>
    </div>
  );
}

/**
 * Reduced-motion / touch fallback: no pin, no WebGL, no camera — just three
 * plainly-stacked beats. A CSS-only faceted diamond outline and a staggered
 * fade/rise (skipped entirely under reduced motion, see globals.css) keep it
 * feeling like the same brand rather than a bare, unstyled placeholder.
 */
function ActOneFallback() {
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);

  useRegisterScene(1, ref1);
  useRegisterScene(2, ref2);
  useRegisterScene(3, ref3);

  return (
    <div className="bg-ink">
      <div
        ref={ref1}
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
      >
        <svg
          aria-hidden
          viewBox="0 0 200 200"
          className="pointer-events-none absolute h-[70vw] max-h-[28rem] w-[70vw] max-w-[28rem] text-accent"
        >
          <polygon
            points="100,10 180,70 155,180 45,180 20,70"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.3"
          />
          <line x1="100" y1="10" x2="100" y2="180" stroke="currentColor" strokeWidth="1" opacity="0.18" />
          <line x1="20" y1="70" x2="180" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.18" />
          <line x1="100" y1="10" x2="45" y2="180" stroke="currentColor" strokeWidth="1" opacity="0.18" />
          <line x1="100" y1="10" x2="155" y2="180" stroke="currentColor" strokeWidth="1" opacity="0.18" />
        </svg>

        <p className="fallback-beat relative mb-6 text-xs uppercase tracking-[0.3em] text-mist">
          Purmerend — Barbershop
        </p>
        <h1
          className="fallback-beat relative font-display text-display-xl text-paper"
          style={{ animationDelay: "0.15s" }}
        >
          Diamond
        </h1>
      </div>

      <div ref={ref2} className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="fallback-beat font-display text-display-lg text-paper">Precision in Motion</p>
      </div>

      <div ref={ref3} className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h2 className="fallback-beat font-display text-display-xl text-paper">The Cut</h2>
      </div>
    </div>
  );
}
