"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSceneProgress } from "@/components/scroll/SceneProgressProvider";
import { SCENE_LABELS } from "@/content/scenes";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The only persistent navigation on the site: a small trigger showing the
 * current scene number, expanding into a compact jump-list on click. No
 * horizontal navbar, deliberately minimal so it never competes with a scene.
 */
export default function FloatingNav() {
  const [open, setOpen] = useState(false);
  const { activeScene, scrollToScene } = useSceneProgress();

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="fixed top-6 right-6 z-50 md:top-10 md:right-10">
      <button
        type="button"
        aria-label={open ? "Sluit navigatie" : "Open navigatie"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center border border-line bg-ink/70 text-paper backdrop-blur-md transition-colors hover:border-accent"
      >
        <span className="text-[10px] tracking-[0.15em] text-mist">
          {String(activeScene).padStart(2, "0")}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Scene-navigatie"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="absolute top-14 right-0 w-56 border border-line bg-ink/90 py-2 backdrop-blur-md"
          >
            {SCENE_LABELS.map((label, i) => {
              const index = i + 1;
              const isActive = index === activeScene;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    scrollToScene(index);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-4 px-5 py-2.5 text-left text-xs uppercase tracking-[0.2em] transition-colors ${
                    isActive ? "text-paper" : "text-mist hover:text-paper"
                  }`}
                >
                  <span className={isActive ? "text-accent" : "text-mist"}>
                    {String(index).padStart(2, "0")}
                  </span>
                  {label}
                </button>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
