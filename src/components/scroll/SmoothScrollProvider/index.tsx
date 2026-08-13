"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/components/scroll/gsapConfig";

type ScrollContextValue = {
  /** Mutable ref, not state — Lenis is read imperatively (e.g. lenis.scrollTo) and must never trigger a re-render on its own. */
  lenisRef: RefObject<Lenis | null>;
  /** True when the user has requested reduced motion at the OS level. */
  isReducedMotion: boolean;
  /** True for touch-primary devices (phones/tablets) — used to serve the lighter experience. */
  isCoarsePointer: boolean;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function useScrollContext() {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    throw new Error("useScrollContext must be used within a SmoothScrollProvider");
  }
  return ctx;
}

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  // Track the two media features that decide which experience the visitor gets.
  useEffect(() => {
    registerGsap();

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");

    const updateMediaState = () => {
      setIsReducedMotion(reducedMotionQuery.matches);
      setIsCoarsePointer(coarsePointerQuery.matches);
    };
    updateMediaState();

    reducedMotionQuery.addEventListener("change", updateMediaState);
    coarsePointerQuery.addEventListener("change", updateMediaState);

    return () => {
      reducedMotionQuery.removeEventListener("change", updateMediaState);
      coarsePointerQuery.removeEventListener("change", updateMediaState);
    };
  }, []);

  // Only run Lenis smooth-scroll when neither reduced-motion nor a touch-primary
  // device is detected; both cases fall back to native scroll behaviour.
  useEffect(() => {
    const shouldSmooth = !isReducedMotion && !isCoarsePointer;

    if (!shouldSmooth) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isReducedMotion, isCoarsePointer]);

  return (
    <ScrollContext.Provider value={{ lenisRef, isReducedMotion, isCoarsePointer }}>
      {children}
    </ScrollContext.Provider>
  );
}
