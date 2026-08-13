"use client";

import { useSceneProgress } from "@/components/scroll/SceneProgressProvider";
import { SCENE_LABELS } from "@/content/scenes";

/**
 * A minimal vertical progress rail, desktop-only — small clickable ticks, no
 * labels, no dominant chrome. Mobile relies on FloatingNav's own "0X" badge
 * instead of duplicating this.
 */
export default function ProgressIndicator() {
  const { activeScene, scrollToScene } = useSceneProgress();

  return (
    <div className="fixed top-1/2 left-6 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 md:left-10 md:flex lg:left-16">
      <span className="text-[10px] tracking-[0.2em] text-mist">{String(activeScene).padStart(2, "0")}</span>

      <div className="flex flex-col items-center gap-2">
        {SCENE_LABELS.map((label, i) => {
          const index = i + 1;
          const isActive = index === activeScene;
          return (
            <button
              key={label}
              type="button"
              aria-label={`Ga naar ${label}`}
              onClick={() => scrollToScene(index)}
              className="flex items-center justify-center py-0.5"
            >
              <span
                className={`w-[3px] rounded-full transition-all duration-300 ${
                  isActive ? "h-4 bg-accent" : "h-[3px] bg-line hover:bg-mist"
                }`}
              />
            </button>
          );
        })}
      </div>

      <span className="text-[10px] tracking-[0.2em] text-mist">{String(SCENE_LABELS.length).padStart(2, "0")}</span>
    </div>
  );
}
