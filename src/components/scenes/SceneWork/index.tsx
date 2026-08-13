"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/components/scroll/gsapConfig";
import { useScrollContext } from "@/components/scroll/SmoothScrollProvider";
import { useRegisterScene } from "@/components/scroll/SceneProgressProvider";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";

/**
 * Scene 5 — an asymmetric, overlapping composition of editorial photo frames
 * that mask-reveal, drift and rotate at different rates as the user scrolls,
 * with the "THE WORK" title layered underneath. Photos are real Diamond
 * Coiffures work photos, downloaded locally from the official site's
 * /services page (see public/images/) for this local/demo build.
 */
const PHOTO_A = { src: "/images/barber-cutting-closeup.webp", alt: "Close-up van een barber die een klant knipt bij Diamond Coiffures" };
const PHOTO_B = { src: "/images/barbershop-interior.webp", alt: "Interieur van Diamond Coiffures Barbershop" };
const PHOTO_C = { src: "/images/braid-styling-detail.jpg", alt: "Detail van vlechtwerk door Diamond Coiffures" };
export default function SceneWork() {
  const { isReducedMotion } = useScrollContext();
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const frameARef = useRef<HTMLDivElement>(null);
  const frameBRef = useRef<HTMLDivElement>(null);
  const frameCRef = useRef<HTMLDivElement>(null);

  useRegisterScene(5, sectionRef);

  useEffect(() => {
    if (isReducedMotion) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: pinRef.current,
        },
      });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
        0,
      ).to(titleRef.current, { opacity: 0.12, duration: 0.2, ease: "none" }, 0.3);

      tl.fromTo(
        frameARef.current,
        { opacity: 0, clipPath: "inset(0% 0% 100% 0%)", y: 60 },
        { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 0.3, ease: "power2.out" },
        0.05,
      ).to(frameARef.current, { y: -80, rotate: -2, duration: 0.5, ease: "none" }, 0.4);

      tl.fromTo(
        frameBRef.current,
        { opacity: 0, clipPath: "inset(0% 100% 0% 0%)", x: 60 },
        { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", x: 0, duration: 0.3, ease: "power2.out" },
        0.25,
      ).to(frameBRef.current, { y: 60, rotate: 1.5, duration: 0.5, ease: "none" }, 0.55);

      tl.fromTo(
        frameCRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" },
        0.5,
      ).to(frameCRef.current, { y: -40, duration: 0.4, ease: "none" }, 0.7);
    }, containerRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  if (isReducedMotion) {
    return <SceneWorkFallback />;
  }

  return (
    <section ref={sectionRef} id="work" aria-label="The Work" className="bg-ink">
      <div ref={containerRef} className="relative h-[260vh] md:h-[350vh]">
        <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
          <span className="absolute top-8 left-6 z-20 text-xs uppercase tracking-[0.3em] text-mist md:top-10 md:left-10 lg:left-16">
            05 — The Work
          </span>

          <h2
            ref={titleRef}
            className="absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 text-center font-display text-display-huge text-paper opacity-0"
          >
            The Work
          </h2>

          <div ref={frameARef} className="absolute top-[14%] left-[6%] z-10 w-[46%] md:top-[16%] md:left-[10%] md:w-[32%]">
            <PhotoPlaceholder ratio="aspect-[3/4]" src={PHOTO_A.src} alt={PHOTO_A.alt} />
          </div>
          <div ref={frameBRef} className="absolute top-[30%] right-[6%] z-10 w-[50%] md:top-[22%] md:right-[12%] md:w-[34%]">
            <PhotoPlaceholder ratio="aspect-[4/5]" src={PHOTO_B.src} alt={PHOTO_B.alt} />
          </div>
          <div
            ref={frameCRef}
            className="absolute bottom-[8%] left-1/2 z-10 w-[56%] -translate-x-1/2 md:bottom-[10%] md:left-[38%] md:w-[30%]"
          >
            <PhotoPlaceholder ratio="aspect-[5/4]" src={PHOTO_C.src} alt={PHOTO_C.alt} />
          </div>
        </div>
      </div>
    </section>
  );
}

function SceneWorkFallback() {
  const sectionRef = useRef<HTMLElement>(null);
  useRegisterScene(5, sectionRef);

  return (
    <section ref={sectionRef} id="work" aria-label="The Work" className="bg-ink py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <span className="text-xs uppercase tracking-[0.3em] text-mist">05 — The Work</span>
        <h2 className="mt-6 font-display text-display-lg text-paper">The Work</h2>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PhotoPlaceholder ratio="aspect-[3/4]" src={PHOTO_A.src} alt={PHOTO_A.alt} />
          <PhotoPlaceholder ratio="aspect-[4/5]" src={PHOTO_B.src} alt={PHOTO_B.alt} />
          <PhotoPlaceholder ratio="aspect-[5/4]" src={PHOTO_C.src} alt={PHOTO_C.alt} />
        </div>
      </div>
    </section>
  );
}
