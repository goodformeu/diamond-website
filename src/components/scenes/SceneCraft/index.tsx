"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/components/scroll/gsapConfig";
import { useScrollContext } from "@/components/scroll/SmoothScrollProvider";
import { useRegisterScene } from "@/components/scroll/SceneProgressProvider";
import { CRAFT_HIGHLIGHTS, PRICE_LIST } from "@/content/diamond";

/**
 * Scene 4 — a curated highlight reel of real treatments (from CRAFT_HIGHLIGHTS)
 * zooms through the screen one at a time as the user scrolls, each flying past
 * "off-screen" before the next appears. The complete official price list renders
 * as a calm reference list beneath the pinned choreography, so nothing real is
 * hidden behind the spectacle.
 */
export default function SceneCraft() {
  const { isReducedMotion } = useScrollContext();
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useRegisterScene(4, sectionRef);

  useEffect(() => {
    if (isReducedMotion) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const items = itemRefs.current.filter((el): el is HTMLDivElement => el !== null);
      const segment = 1 / items.length;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: pinRef.current,
        },
      });

      items.forEach((item, i) => {
        const start = i * segment;
        const offsetX = i % 2 === 0 ? -32 : 32;

        tl.fromTo(
          item,
          { opacity: 0, scale: 0.6, x: offsetX },
          { opacity: 1, scale: 1, x: 0, duration: segment * 0.5, ease: "power2.out" },
          start,
        ).to(
          item,
          {
            opacity: 0,
            scale: i === items.length - 1 ? 1.15 : 2.2,
            duration: segment * 0.3,
            ease: "power2.in",
          },
          start + segment * 0.62,
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  if (isReducedMotion) {
    return <SceneCraftFallback />;
  }

  return (
    <section ref={sectionRef} id="craft" aria-label="The Craft" className="bg-ink">
      <div ref={containerRef} className="relative h-[320vh] md:h-[450vh]">
        <div ref={pinRef} className="relative flex h-screen w-full items-center justify-center overflow-hidden px-6">
          <span className="absolute top-8 left-6 z-10 text-xs uppercase tracking-[0.3em] text-mist md:top-10 md:left-10 lg:left-16">
            04 — The Craft
          </span>

          {CRAFT_HIGHLIGHTS.map((item, i) => (
            <div
              key={item.name}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center opacity-0"
            >
              <h3 className="max-w-[90vw] text-balance font-display text-display-huge text-paper">
                {item.name}
              </h3>
              <p className="mt-6 text-sm uppercase tracking-[0.3em] text-accent md:text-base">
                {item.price}
              </p>
            </div>
          ))}
        </div>
      </div>

      <PriceReference />
    </section>
  );
}

function PriceReference() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-36 lg:px-16">
      <div className="mb-14 flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-mist">
        <span className="text-accent">Volledig overzicht</span>
        <span aria-hidden className="h-px flex-1 bg-line" />
      </div>
      <ul className="grid gap-x-16 md:grid-cols-2">
        {PRICE_LIST.map((item) => (
          <li
            key={item.name}
            className="flex items-baseline justify-between gap-6 border-b border-line py-4"
          >
            <span className="font-display text-base text-paper md:text-lg">{item.name}</span>
            <span className="text-sm whitespace-nowrap text-mist">{item.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SceneCraftFallback() {
  const sectionRef = useRef<HTMLElement>(null);
  useRegisterScene(4, sectionRef);

  return (
    <section ref={sectionRef} id="craft" aria-label="The Craft" className="bg-ink py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <span className="text-xs uppercase tracking-[0.3em] text-mist">04 — The Craft</span>
        <div className="mt-10 space-y-10">
          {CRAFT_HIGHLIGHTS.map((item) => (
            <div key={item.name} className="border-b border-line pb-6">
              <h3 className="font-display text-3xl text-paper md:text-5xl">{item.name}</h3>
              <p className="mt-2 text-sm uppercase tracking-[0.3em] text-accent">{item.price}</p>
            </div>
          ))}
        </div>
      </div>

      <PriceReference />
    </section>
  );
}
