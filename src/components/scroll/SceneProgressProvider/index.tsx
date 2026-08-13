"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { useScrollContext } from "@/components/scroll/SmoothScrollProvider";

type TargetGetter = () => number;

type SceneActionsValue = {
  setActiveScene: (index: number) => void;
  registerScene: (index: number, getTarget: TargetGetter) => () => void;
  scrollToScene: (index: number) => void;
};

/**
 * Split in two contexts on purpose: SceneActions (registerScene/setActiveScene/
 * scrollToScene) is referentially stable and almost never changes, while
 * ActiveScene (the current scene number) changes on every scene transition.
 * Scene components only ever need the former — subscribing them to the
 * latter as well would re-render all 5+ scene components on every scene
 * change, when only the nav UI actually needs to visually update.
 */
const SceneActionsContext = createContext<SceneActionsValue | null>(null);
const ActiveSceneContext = createContext<number | null>(null);

export function useSceneActions() {
  const ctx = useContext(SceneActionsContext);
  if (!ctx) {
    throw new Error("useSceneActions must be used within a SceneProgressProvider");
  }
  return ctx;
}

export function useActiveScene() {
  const ctx = useContext(ActiveSceneContext);
  if (ctx === null) {
    throw new Error("useActiveScene must be used within a SceneProgressProvider");
  }
  return ctx;
}

/** Convenience hook for consumers (nav UI) that need both the live value and the actions. */
export function useSceneProgress() {
  return { activeScene: useActiveScene(), ...useSceneActions() };
}

/**
 * Registers a "normal" (non-Act-One) scene: its scroll-jump target is the
 * element's own top offset, and "active" is simply "this element is in the
 * middle of the viewport" via IntersectionObserver — independent of GSAP, so
 * it works identically whether or not the scene's own animation is running
 * (e.g. under reduced motion). Only reads SceneActions, never ActiveScene —
 * so a scene never re-renders just because a *different* scene became active.
 */
export function useRegisterScene(index: number, ref: RefObject<HTMLElement | null>) {
  const { registerScene, setActiveScene } = useSceneActions();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const unregisterTarget = registerScene(index, () => el.getBoundingClientRect().top + window.scrollY);

    // A thin trigger line at the vertical center of the viewport, rather than a
    // visibility percentage — needed because scenes vary hugely in height (a
    // 100vh CTA vs. a 450vh pinned choreography), and a percentage-based
    // threshold would never fire for the tall ones.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveScene(index);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    observer.observe(el);

    return () => {
      unregisterTarget();
      observer.disconnect();
    };
  }, [index, ref, registerScene, setActiveScene]);
}

export default function SceneProgressProvider({ children }: { children: ReactNode }) {
  const [activeScene, setActiveSceneState] = useState(1);
  const targetsRef = useRef<Map<number, TargetGetter>>(new Map());
  const { lenisRef, isReducedMotion } = useScrollContext();

  const setActiveScene = useCallback((index: number) => {
    setActiveSceneState((prev) => (prev === index ? prev : index));
  }, []);

  const registerScene = useCallback((index: number, getTarget: TargetGetter) => {
    targetsRef.current.set(index, getTarget);
    return () => {
      targetsRef.current.delete(index);
    };
  }, []);

  const scrollToScene = useCallback(
    (index: number) => {
      const getTarget = targetsRef.current.get(index);
      if (!getTarget) return;
      const y = getTarget();

      if (lenisRef.current) {
        lenisRef.current.scrollTo(y, { duration: 1.4 });
      } else {
        window.scrollTo({ top: y, behavior: isReducedMotion ? "auto" : "smooth" });
      }
    },
    [lenisRef, isReducedMotion],
  );

  const actions = useMemo(
    () => ({ setActiveScene, registerScene, scrollToScene }),
    [setActiveScene, registerScene, scrollToScene],
  );

  return (
    <SceneActionsContext.Provider value={actions}>
      <ActiveSceneContext.Provider value={activeScene}>{children}</ActiveSceneContext.Provider>
    </SceneActionsContext.Provider>
  );
}
