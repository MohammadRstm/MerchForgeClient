import { useEffect, useRef } from 'react';
import { createHeroNetwork, type Rgb } from './heroNetwork';

/**
  * Mounts the hero background mesh. React owns the element and the lifecycle;
 * heroNetwork.ts owns the pixels.
 *
 * Purely decorative, so it is hidden from assistive technology entirely — the
 * hero already describes itself through its heading and copy.
 */

const INK_FALLBACK: Rgb = [20, 22, 27];
const ACCENT_FALLBACK: Rgb = [255, 155, 0];

/**
 * Reads a colour straight out of the marketing token set, so the mesh follows
 * --mf-text and --mf-accent instead of keeping its own copy of the palette that
 * would silently drift the first time either changes.
 */
function readToken(element: Element, name: string, fallback: Rgb): Rgb {
    const raw = getComputedStyle(element).getPropertyValue(name).trim();
    if (!raw) return fallback;

    const hex = raw.replace('#', '');
    const expanded =
        hex.length === 3
            ? hex
                  .split('')
                  .map((c) => c + c)
                  .join('')
            : hex;

    if (expanded.length !== 6) return fallback;

    const value = Number.parseInt(expanded, 16);
    if (Number.isNaN(value)) return fallback;

    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

export default function HeroBackdrop() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        const network = createHeroNetwork(
            canvas,
            {
                ink: readToken(canvas, '--mf-text', INK_FALLBACK),
                accent: readToken(canvas, '--mf-accent', ACCENT_FALLBACK),
            },
            { reducedMotion: motionQuery.matches },
        );

        // Two independent reasons to stop: scrolled past, or the tab is not being
        // looked at. Either alone should pause it, so they are tracked separately
        // rather than one overwriting the other.
        let onScreen = false;
        let visible = document.visibilityState === 'visible';

        const sync = () => network.setRunning(onScreen && visible);

        const observer = new IntersectionObserver(
            ([entry]) => {
                onScreen = entry.isIntersecting;
                sync();
            },
            { threshold: 0 },
        );

        observer.observe(canvas);

        const onVisibility = () => {
            visible = document.visibilityState === 'visible';
            sync();
        };

        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            observer.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
            network.destroy();
        };
    }, []);

    return <canvas ref={canvasRef} className="hero__network" aria-hidden="true" />;
}
