import { Container } from "@/components/ui/Container";
import { INSTAGRAM_URL, FACEBOOK_URL } from "@/content/diamond";

/**
 * Deliberately minimal — the "credits" after the film, not another scene.
 * No scroll animation, no large multi-column footer, real links only.
 */
export default function Footer() {
  return (
    <footer aria-label="Footer" className="border-t border-line bg-ink py-10">
      <Container>
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <p className="font-display text-sm tracking-[0.2em] text-paper">
            DIAMOND <span className="text-mist">COIFFURES</span>
          </p>

          <div className="flex gap-6 text-xs uppercase tracking-[0.2em] text-mist">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-paper"
            >
              Instagram
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-paper"
            >
              Facebook
            </a>
          </div>

          <p className="text-xs text-mist">© {new Date().getFullYear()} Diamond Coiffures Barbershop</p>
        </div>
      </Container>
    </footer>
  );
}
