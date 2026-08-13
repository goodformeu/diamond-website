"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/components/scroll/gsapConfig";
import { useScrollContext } from "@/components/scroll/SmoothScrollProvider";
import { useRegisterScene } from "@/components/scroll/SceneProgressProvider";
import { ABOUT_BEATS, ABOUT_CLOSING } from "@/content/diamond";

/**
 * Scene 6 — the real "over ons" text (verbatim fragments, not invented copy)
 * paced out as large, breathing typographic beats rather than an About Us
 * paragraph. Contemplative letter-spacing/blur rhythm, distinct from Scene 4's
 * punchier zoom, so the three DOM scenes don't feel repetitive.
 */
export default function SceneExperience() {
  const { isReducedMotion } = useScrollContext();
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const closingRef = useRef<HTMLParagraphElement>(null);

  useRegisterScene(6, sectionRef);

  useEffect(() => {
    if (isReducedMotion) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const beats = beatRefs.current.filter((el): el is HTMLParagraphElement => el !== null);
      const closingSegment = 0.16;
      const beatSpan = (1 - closingSegment) / beats.length;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: pinRef.current,
        },
      });

      beats.forEach((beat, i) => {
        const start = i * beatSpan;
        tl.fromTo(
          beat,
          { opacity: 0, letterSpacing: "0.4em", filter: "blur(6px)" },
          { opacity: 1, letterSpacing: "0em", filter: "blur(0px)", duration: beatSpan * 0.55, ease: "sine.out" },
          start,
        ).to(
          beat,
          { opacity: 0, filter: "blur(6px)", duration: beatSpan * 0.35, ease: "sine.in" },
          start + beatSpan * 0.65,
        );
      });

      tl.fromTo(
        closingRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: closingSegment * 0.7, ease: "sine.out" },
        1 - closingSegment,
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  if (isReducedMotion) {
    return <SceneExperienceFallback />;
  }

  return (
    <section ref={sectionRef} id="experience" aria-label="The Experience" className="bg-ink">
      <div ref={containerRef} className="relative h-[280vh] md:h-[400vh]">
        <div ref={pinRef} className="relative flex h-screen w-full items-center justify-center overflow-hidden px-6">
          <span className="absolute top-8 left-6 z-10 text-xs uppercase tracking-[0.3em] text-mist md:top-10 md:left-10 lg:left-16">
            06 — The Experience
          </span>

          {ABOUT_BEATS.map((beat, i) => (
            <p
              key={beat}
              ref={(el) => {
                beatRefs.current[i] = el;
              }}
              className="absolute max-w-[85vw] text-balance text-center font-display text-display-huge text-paper opacity-0"
            >
              {beat}
            </p>
          ))}

          <p
            ref={closingRef}
            className="absolute text-sm uppercase tracking-[0.3em] text-mist opacity-0 md:text-base"
          >
            {ABOUT_CLOSING}
          </p>
        </div>
      </div>
    </section>
  );
}

function SceneExperienceFallback() {
  const sectionRef = useRef<HTMLElement>(null);
  useRegisterScene(6, sectionRef);

  return (
    <section ref={sectionRef} id="experience" aria-label="The Experience" className="bg-ink py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 text-center md:px-10 lg:px-16">
        <span className="text-xs uppercase tracking-[0.3em] text-mist">06 — The Experience</span>
        <div className="mx-auto mt-10 max-w-3xl space-y-6">
          {ABOUT_BEATS.map((beat) => (
            <p key={beat} className="font-display text-2xl text-paper md:text-4xl">
              {beat}
            </p>
          ))}
        </div>
        <p className="mt-10 text-sm uppercase tracking-[0.3em] text-mist">{ABOUT_CLOSING}</p>
      </div>
    </section>
  );
}
