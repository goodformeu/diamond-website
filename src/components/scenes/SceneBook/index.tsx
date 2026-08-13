"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, registerGsap } from "@/components/scroll/gsapConfig";
import { useScrollContext } from "@/components/scroll/SmoothScrollProvider";
import { useRegisterScene } from "@/components/scroll/SceneProgressProvider";
import { BOOKING_URL, WHATSAPP_URL } from "@/content/diamond";

const EASE = "expo.out";

/**
 * Scene 8 — the finale. Deliberately NOT pinned/scrubbed: this is the
 * conversion moment, so the CTA appears once via a simple entrance and then
 * gets out of the way — no scroll-jacking right when someone wants to tap
 * "Book Now".
 */
export default function SceneBook() {
  const { isReducedMotion } = useScrollContext();
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useRegisterScene(8, sectionRef);

  useEffect(() => {
    if (isReducedMotion) return;
    registerGsap();

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        })
        .fromTo(eyebrowRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: EASE })
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 60, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: EASE },
          "-=0.5",
        )
        .fromTo(ctaRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: EASE }, "-=0.5");
    }, sectionRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  if (isReducedMotion) {
    return <SceneBookFallback sectionRef={sectionRef} />;
  }

  return (
    <section
      ref={sectionRef}
      id="book"
      aria-label="Book Your Cut"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 py-28 text-center"
    >
      <span className="absolute top-8 left-6 text-xs uppercase tracking-[0.3em] text-mist md:top-10 md:left-10 lg:left-16">
        08 — Book
      </span>

      <p ref={eyebrowRef} className="mb-8 text-xs uppercase tracking-[0.3em] text-mist opacity-0 md:mb-10">
        Purmerend — Barbershop
      </p>

      <h2 ref={titleRef} className="max-w-[90vw] text-balance font-display text-display-xl text-paper opacity-0">
        Your next cut.
      </h2>

      <BookCta ctaRef={ctaRef} />
    </section>
  );
}

function BookCta({ ctaRef }: { ctaRef?: RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={ctaRef}
      className={`mt-12 flex flex-col items-center gap-6 md:mt-14 md:flex-row md:gap-8 ${ctaRef ? "opacity-0" : ""}`}
    >
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center border border-paper px-10 py-4 text-xs uppercase tracking-[0.3em] text-paper transition-colors hover:bg-paper hover:text-ink"
      >
        Book Now
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-mist transition-colors hover:text-paper"
      >
        <span aria-hidden>↗</span> WhatsApp
      </a>
    </div>
  );
}

function SceneBookFallback({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  return (
    <section
      ref={sectionRef}
      id="book"
      aria-label="Book Your Cut"
      className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-28 text-center"
    >
      <span className="mb-8 text-xs uppercase tracking-[0.3em] text-mist md:mb-10">08 — Book</span>
      <h2 className="max-w-[90vw] text-balance font-display text-display-xl text-paper">Your next cut.</h2>
      <BookCta />
    </section>
  );
}
