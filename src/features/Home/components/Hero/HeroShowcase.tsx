import { useCallback, useEffect, useRef, useState } from 'react';
import { AnglesScene, ColourwaysScene, ConveyorScene, IngredientsScene } from './HeroScenes';
import './HeroShowcase.css';

interface Scene {
    id: string;
    /** Names the capability, shown under the stage. */
    label: string;
    /** What the scene shows, for anyone who cannot see it. */
    description: string;
    render: () => React.ReactElement;
}

const SCENES: Scene[] = [
    {
        id: 'angles',
        label: 'Every angle, from one photo',
        description: 'A shirt photographed once, shown from the back and side, both generated.',
        render: () => <AnglesScene />,
    },
    {
        id: 'colourways',
        label: 'Every colourway, from one photo',
        description: 'An oak stool recoloured to forest green and terracotta, the same stool each time.',
        render: () => <ColourwaysScene />,
    },
    {
        id: 'ingredients',
        label: 'The listing writes itself',
        description: 'A burger photograph read by the model, with its ingredients listed as they are found.',
        render: () => <IngredientsScene />,
    },
    {
        id: 'dashboard',
        label: 'A real dashboard, not a mockup',
        description: 'Cards from a live MerchForge dashboard drifting past — real charts, real products, real storefront templates.',
        render: () => <ConveyorScene />,
    },
];

/**
 * The hero's showcase: four scenes on one stage, advanced by button, drag or
 * arrow key.
 *
 * Advances on its own every five seconds while the hero is in the viewport, and
 * stops permanently the moment anyone takes control — a carousel that keeps
 * moving under someone reading it is the reason carousels have a bad name. It
 * never starts at all under prefers-reduced-motion.
 */

/** Long enough to read a scene, short enough that nobody waits for the next one. */
const AUTO_ADVANCE_MS = 5000;

/** Horizontal travel before a drag counts as a deliberate swipe, in px. */
const SWIPE_THRESHOLD = 56;

export default function HeroShowcase() {
    const [index, setIndex] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);

    // Bumped on every change so the scene that becomes active remounts and
    // replays its entrance, rather than sitting there already finished.
    const [nonce, setNonce] = useState(0);

    // Initialised rather than set from an effect: the preference is knowable on
    // the first render, and setting state in an effect costs a second pass.
    const [autoPlay, setAutoPlay] = useState(
        () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
    // Only advances while the hero is actually on screen. Otherwise a visitor
    // reading further down the page comes back to a scene they never saw change,
    // and the timer burns work nobody is watching.
    const [inView, setInView] = useState(false);

    const rootRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const dragStart = useRef<number | null>(null);

    const go = useCallback((next: number) => {
        setIndex(((next % SCENES.length) + SCENES.length) % SCENES.length);
        setNonce((n) => n + 1);
    }, []);

    /** Any deliberate interaction ends auto-advance for the rest of the visit. */
    const takeControl = useCallback((next: number) => {
        setAutoPlay(false);
        go(next);
    }, [go]);

    useEffect(() => {
        const node = rootRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            // Any part of it showing counts; the hero fills the viewport, so a
            // stricter threshold would stall it during the scroll away.
            { threshold: 0 },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!autoPlay || !inView) return;

        const timer = window.setTimeout(() => go(index + 1), AUTO_ADVANCE_MS);
        return () => window.clearTimeout(timer);
    }, [autoPlay, inView, index, go]);

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        // Primary button / touch only, and never on a control inside the stage.
        if (event.button !== 0) return;

        dragStart.current = event.clientX;
        trackRef.current?.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (dragStart.current === null) return;
        setDragOffset(event.clientX - dragStart.current);
    };

    const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
        if (dragStart.current === null) return;

        const travelled = event.clientX - dragStart.current;
        dragStart.current = null;
        setDragOffset(0);

        if (Math.abs(travelled) < SWIPE_THRESHOLD) return;
        takeControl(index + (travelled < 0 ? 1 : -1));
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            takeControl(index + 1);
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            takeControl(index - 1);
        }
    };

    const active = SCENES[index];

    return (
        <div className="showcase" ref={rootRef}>
            <div
                ref={trackRef}
                className={`showcase__viewport${dragOffset !== 0 ? ' showcase__viewport--dragging' : ''}`}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onKeyDown={onKeyDown}
                role="group"
                aria-roledescription="carousel"
                aria-label="What MerchForge makes from one photograph"
                tabIndex={0}
            >
                <div
                    className="showcase__track"
                    style={{ transform: `translate3d(calc(${-index * 100}% + ${dragOffset}px), 0, 0)` }}
                >
                    {SCENES.map((scene, i) => (
                        <div
                            // Only the active panel carries the nonce, so only it
                            // remounts — the others keep their DOM and their images.
                            key={i === index ? `${scene.id}-${nonce}` : scene.id}
                            className={`showcase__panel${i === index ? ' is-active' : ''}`}
                            aria-hidden={i !== index}
                            inert={i !== index ? true : undefined}
                        >
                            {scene.render()}
                        </div>
                    ))}
                </div>
            </div>

            <div className="showcase__bar">
                <p className="showcase__label" aria-live="polite">
                    {active.label}
                </p>

                <div className="showcase__controls">
                    <div className="showcase__dots" role="tablist" aria-label="Choose a scene">
                        {SCENES.map((scene, i) => (
                            <button
                                key={scene.id}
                                type="button"
                                role="tab"
                                aria-selected={i === index}
                                aria-label={scene.label}
                                className={`showcase__dot${i === index ? ' is-active' : ''}`}
                                onClick={() => takeControl(i)}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        className="showcase__next"
                        onClick={() => takeControl(index + 1)}
                        aria-label={`Next: ${SCENES[(index + 1) % SCENES.length].label}`}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* The visual carries the meaning, so it is described here rather than
                left to alt text spread across several images. */}
            <p className="showcase__sr" aria-live="polite">
                {active.description}
            </p>
        </div>
    );
}
