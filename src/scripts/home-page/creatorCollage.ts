/**
 * Intro animation for the creator collage (CreatorCollage.astro).
 *
 * Desktop: the seven bubbles start invisible and slightly undersized in a ring
 * around the centre of the collage, fade up while the whole ring makes one
 * revolution — each bubble spinning against that turn, so the photos rotate
 * opposite the orbit — then glide out, upright and growing to full size, to the
 * resting positions their CSS already describes. The headline and bolt fade in
 * as that outward move begins, and the list pills fade in last, once their
 * bubble has landed.
 *
 * Mobile (below DESKTOP_MIN, the shared `lg:` breakpoint from scripts/
 * breakpoints.ts): no ring or spin — the bubbles simply fade in at the resting
 * positions CSS already holds, then the headline/bolt and pills follow. Nothing
 * is moved or measured.
 *
 * Nothing here hardcodes a layout: the ring offsets are measured at run time
 * from each bubble's real box, so the same timeline works at every breakpoint
 * without knowing the percentage offsets in the markup.
 *
 * DOM hooks (see CreatorCollage.astro):
 *   data-collage         section root the script scans for
 *   data-orbit           wrapper rotated as a group; also the measuring frame
 *   data-bubble          element moved/scaled — a bubble image, or a wrapper when
 *                        the bubble carries a pill that must travel with it
 *   data-collage-reveal  headline / bolt, faded in with the outward move
 *   data-bubble-tag      pill / plus badge, faded in after the bubbles settle
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isDesktop, prefersReducedMotion } from "../breakpoints";

gsap.registerPlugin(ScrollTrigger);

/** Ring radius as a fraction of the collage's shorter side. */
const RING_RATIO = 0.22;

/** Size the bubbles hold while in the ring; they reach 1 as they fly out. */
const RING_SCALE = 0.8;

interface Offset {
  dx: number;
  dy: number;
}

/**
 * For each bubble, the (dx, dy) that would carry it from where CSS puts it to
 * its seat on the ring. Measured with transforms cleared, so the numbers
 * describe real layout rather than a half-finished animation.
 */
function ringOffsets(frame: HTMLElement, bubbles: HTMLElement[]): Offset[] {
  const frameRect = frame.getBoundingClientRect();
  const centreX = frameRect.width / 2;
  const centreY = frameRect.height / 2;
  const radius = Math.min(frameRect.width, frameRect.height) * RING_RATIO;

  return bubbles.map((bubble, i) => {
    const rect = bubble.getBoundingClientRect();
    const restX = rect.left - frameRect.left + rect.width / 2;
    const restY = rect.top - frameRect.top + rect.height / 2;

    // Start at 12 o'clock and step evenly around the circle.
    const angle = -Math.PI / 2 + (i / bubbles.length) * Math.PI * 2;

    return {
      dx: centreX + Math.cos(angle) * radius - restX,
      dy: centreY + Math.sin(angle) * radius - restY,
    };
  });
}

function initCollage(root: HTMLElement): void {
  if (root.dataset.collageReady === "true") return;
  root.dataset.collageReady = "true";

  const found = root.querySelector<HTMLElement>("[data-orbit]");
  if (!found) return;
  // Typed non-null so the nested `play()` closure keeps the narrowing.
  const orbit: HTMLElement = found;

  const bubbles = gsap.utils.toArray<HTMLElement>(
    orbit.querySelectorAll("[data-bubble]"),
  );
  if (!bubbles.length) return;

  const tags = gsap.utils.toArray<HTMLElement>(
    orbit.querySelectorAll("[data-bubble-tag]"),
  );
  // Headline and bolt live outside the orbit layer, so they are found on the
  // section root rather than within the rotating group.
  const reveals = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll("[data-collage-reveal]"),
  );

  // Reduced motion: the CSS that hides them is behind a no-preference query,
  // so there is nothing to undo — just make sure no transform lingers.
  if (prefersReducedMotion()) {
    gsap.set([...bubbles, ...tags, ...reveals], { clearProps: "all" });
    return;
  }

  /**
   * The plain mobile intro: fade the bubbles in where CSS already seats them,
   * then the headline/bolt and pills. No ring, no measuring, no transforms to
   * unwind on resize.
   */
  function playFade(): void {
    gsap.set(bubbles, { clearProps: "transform" });
    gsap.set([...bubbles, ...tags, ...reveals], { opacity: 0 });

    const timeline = gsap.timeline();

    timeline.to(bubbles, {
      opacity: 1,
      duration: 2,
      ease: "power1.out",
      stagger: 0.06,
    });

    // Headline and bolt come up alongside the bubbles.
    timeline.to(
      reveals,
      { opacity: 1, duration: 0.6, ease: "power1.out" },
      "<",
    );

    // Pills settle in last, just behind the bubbles.
    timeline.to(
      tags,
      { opacity: 1, duration: 0.4, ease: "power1.out", stagger: 0.06 },
      "<",
    );
  }

  /**
   * Build and play the full orbit timeline. Deferred until the collage scrolls
   * into view so the ring is measured against the final layout — the bubbles
   * load lazily, and a measurement taken at page load can predate their boxes
   * settling.
   */
  function playOrbit(): void {
    gsap.set(bubbles, { clearProps: "transform" });
    const offsets = ringOffsets(orbit, bubbles);

    gsap.set(orbit, { transformOrigin: "50% 50%" });
    gsap.set([...tags, ...reveals], { opacity: 0 });
    bubbles.forEach((bubble, i) => {
      gsap.set(bubble, {
        opacity: 0,
        scale: RING_SCALE,
        rotation: 0,
        x: offsets[i].dx,
        y: offsets[i].dy,
      });
    });

    const timeline = gsap.timeline();

    // Fade into the ring, still slightly undersized…
    timeline.to(bubbles, {
      opacity: 1,
      duration: 1.4,
      ease: "power1.out",
      stagger: 0.09,
    });

    // …while the ring itself turns once. `<` starts it with the tween above.
    timeline.to(
      orbit,
      { rotation: "+=360", duration: 3, ease: "power1.inOut" },
      "<",
    );

    // Each bubble spins against that turn. The ring already imposes +360 on
    // every child, so -360 leaves one net turn the other way a little — the photos
    // rotate counter to the orbit. Same duration and ease as the ring, so the
    // two stay exactly opposed the whole way round; -720 is a whole number of
    // turns, so the faces finish upright for the fly-out.
    timeline.to(
      bubbles,
      { rotation: "-=360", duration: 3, ease: "power1.inOut" },
      "<",
    );

    // Then break formation for the resting positions CSS already holds. The
    // bubbles stay upright on the way out — they are photographs, so a spin
    // would turn the faces with them.
    const flyOut = { duration: 1.4, ease: "power3.inOut", stagger: 0.07 };

    timeline.to(bubbles, { x: 0, y: 0, scale: 1, ...flyOut }, "+=0.1");

    // Headline and bolt come up with that move — `+=0.1` pins this to the same start.
    timeline.to(
      reveals,
      { opacity: 1, duration: 1.2, ease: "power1.out" },
      "+=0.1",
    );

    // Stagger each pill in behind its bubble, overlapping the tail of the fly-out.
    timeline.to(
      tags,
      { opacity: 1, duration: 0.5, ease: "power1.out", stagger: 0.08 },
      "-=0.5",
    );

    // The ring offsets only described the journey; every bubble ends at x/y 0,
    // so a later resize re-lays them out from CSS with nothing to undo.
  }

  // Pick the intro when the collage enters view, so the choice reflects the
  // viewport the reader actually lands on rather than the width at page load.
  function play(): void {
    if (isDesktop()) {
      playOrbit();
    } else {
      playFade();
    }
  }

  ScrollTrigger.create({
    trigger: "[data-collage-reveal]",
    start: isDesktop() ? "top 85%" : "top 70%",
    once: true,
    onEnter: play,
  });
}

/** Wire up every collage on the page. */
export function initCreatorCollage(): void {
  document.querySelectorAll<HTMLElement>("[data-collage]").forEach(initCollage);
}
