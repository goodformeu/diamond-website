"use client";

import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Container";
import { useRegisterScene } from "@/components/scroll/SceneProgressProvider";
import { ADDRESS, PHONE_DISPLAY, PHONE_RAW, OPENING_HOURS } from "@/content/diamond";

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;
const TEL_HREF = `tel:+31${PHONE_RAW.slice(1)}`;

/**
 * Scene 7 — deliberately the calm beat: no pin, no scrub, no scroll-jacking.
 * Real address/phone/hours only, plain reveal-on-scroll via Framer Motion.
 */
export default function SceneVisit() {
  const sectionRef = useRef<HTMLElement>(null);
  useRegisterScene(7, sectionRef);

  return (
    <section ref={sectionRef} id="visit" aria-label="Visit Us" className="bg-ink py-32 md:py-44">
      <Container>
        <Reveal>
          <span className="text-xs uppercase tracking-[0.3em] text-mist">07 — Visit</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 max-w-2xl font-display text-display-lg text-paper">Visit Us</h2>
        </Reveal>

        <div className="mt-20 grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="space-y-12">
            <Reveal delay={0.15}>
              <div className="border-t border-line pt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-mist">Adres</p>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block font-display text-2xl text-paper transition-colors hover:text-accent md:text-3xl"
                >
                  {ADDRESS}
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="border-t border-line pt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-mist">Telefoon</p>
                <a
                  href={TEL_HREF}
                  className="mt-3 inline-block font-display text-2xl text-paper transition-colors hover:text-accent md:text-3xl"
                >
                  {PHONE_DISPLAY}
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <p className="text-sm text-mist">Reviews volgen zodra Diamond deze aanlevert.</p>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div>
              <p className="mb-6 text-xs uppercase tracking-[0.2em] text-mist">Openingstijden</p>
              <dl className="divide-y divide-line border-t border-line">
                {OPENING_HOURS.map((row) => (
                  <div key={row.day} className="flex items-baseline justify-between py-3">
                    <dt className="font-display text-base text-paper md:text-lg">{row.day}</dt>
                    <dd className="text-sm text-mist">{row.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
