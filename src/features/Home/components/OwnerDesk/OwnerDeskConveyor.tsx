import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { settleStep, throwRateFromVelocity } from './beltThrow';
import Overview from '../../../../assets/Landing/Landing__OwnerDesk__overview.png';
import ProductsCatalog from '../../../../assets/Landing/Landing__OwnerDesk__products-catalog.png';
import OrdersSummary from '../../../../assets/Landing/Landing__OwnerDesk__orders-summary.png';
import ProductPerformance from '../../../../assets/Landing/Landing__OwnerDesk__product-performance.png';
import InventoryTable from '../../../../assets/Landing/Landing__OwnerDesk__inventory-table.png';
import TopProducts from '../../../../assets/Landing/Landing__OwnerDesk__top-products.png';
import OrdersPerformance from '../../../../assets/Landing/Landing__OwnerDesk__orders-performance.png';
import OverviewAttention from '../../../../assets/Landing/Landing__OwnerDesk__overview-attention.png';
import InventoryPerformance from '../../../../assets/Landing/Landing__OwnerDesk__inventory-performance.png';
import OrdersTable from '../../../../assets/Landing/Landing__OwnerDesk__orders-table.png';

/**
 * Real captures from a live MerchForge dashboard, carried past on a shallow 3D
 * belt: each card grows and turns square-on as it reaches the centre of the
 * stage, then shrinks and turns away again on its way out.
 *
 * The motion is entirely CSS. Every card runs the same two infinite animations
 * and is simply offset in time by one slot - a card's phase is (i / count) of
 * the cycle - which is what spaces them evenly along the belt and what makes the
 * loop seamless: nothing ever restarts as a group, so there is no jump to hide.
 * It also means no duplicated set: the browser composites transform and opacity
 * on its own, and the only JavaScript that ever animates anything here is the
 * sub-second loop that eases a thrown belt back to its normal speed.
 *
 * Dragging scrubs it and a flick throws it; clicking deliberately does nothing.
 *
 * Travel and depth are two separate animations on two nested elements on
 * purpose. The travel has to stay perfectly linear or the cards stop being
 * evenly spaced, while the depth curve wants to be shaped - most of its change
 * happening near the centre, so one card is clearly the focus rather than four
 * cards being vaguely different sizes. Keeping them apart lets each be simple.
 */

interface Tile {
    src: string;
    alt: string;
}

/**
 * Ordered so neighbours never look alike. The belt shows three or four cards at
 * once, so two dense tables or two orange area charts sitting side by side read
 * as one repeated image rather than as a tour of the product - the sequence
 * below deliberately alternates chart, table, photography and stat tiles.
 */
const TILES: Tile[] = [
    { src: Overview, alt: 'The dashboard overview: revenue, orders, average order value and products sold, above a revenue chart' },
    { src: ProductsCatalog, alt: 'The product catalog, each item shown with its photography and customer rating' },
    { src: OrdersSummary, alt: 'Order totals by status, with the orders still waiting on confirmation called out' },
    { src: ProductPerformance, alt: 'Product performance over thirty days: revenue, units sold and orders against the previous period' },
    { src: InventoryTable, alt: 'The inventory table, with stock levels, low-stock thresholds and per-product sales' },
    { src: TopProducts, alt: 'Top products ranked by revenue, beside best sellers by units with period-on-period change' },
    { src: OrdersPerformance, alt: 'Order revenue and order count over thirty days, against the previous period' },
    { src: OverviewAttention, alt: 'Orders requiring attention, beside an inventory health breakdown by stock status' },
    { src: InventoryPerformance, alt: 'Inventory performance: units sold, stock added and stock removed over thirty days' },
    { src: OrdersTable, alt: 'The orders list, showing customer, item count, total and fulfilment status' },
];

/** Travel past this and the gesture counts as a drag rather than a stray press. */
const DRAG_SLOP = 5;

/** Only the last of these milliseconds of pointer travel decide the throw. */
const FLING_WINDOW_MS = 120;

/** A flick can drive the belt this many times its own speed, forwards or back. */
const MAX_RATE = 9;

/** Exponential settle constant: how quickly a thrown belt returns to 1x. */
const SETTLE_TAU_MS = 620;

/**
 * currentTime is parked this many cycles up the clock while dragging. The
 * effect is periodic so it changes nothing on screen, but it leaves room for a
 * rightward throw to run the animation backwards without the clock reaching
 * zero - below which an animation sits in its before-phase and stops rendering.
 */
const CLOCK_HEADROOM_CYCLES = 50;

interface PointerSample {
    x: number;
    t: number;
}

interface DragState {
    pointerX: number;
    animations: Animation[];
    /** Each animation's currentTime when the drag began, in ms. */
    baseTimes: number[];
    cycleMs: number;
    msPerPx: number;
    /** The belt's own speed, for turning a throw into a playback rate. */
    pxPerMs: number;
    samples: PointerSample[];
    moved: boolean;
}

export default function OwnerDeskConveyor() {
    const beltRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<DragState | null>(null);
    const settleRef = useRef(0);

    const [dragging, setDragging] = useState(false);

    const stopSettling = () => {
        if (!settleRef.current) return;
        cancelAnimationFrame(settleRef.current);
        settleRef.current = 0;
    };

    // The settle loop below outlives any single event handler, so it has to be
    // cancelled if the section unmounts mid-throw.
    useEffect(() => stopSettling, []);

    /**
     * Ease the playback rate back to 1 after a throw.
     *
     * This is the one JavaScript animation loop in the component, and it earns
     * its place: it runs for under a second after a flick, adjusts a single
     * number per frame rather than measuring or laying anything out, and the
     * belt itself is still being animated and composited by CSS throughout.
     * Exponential rather than linear so the fast part of the throw is over
     * quickly and the last of it drifts in, which is how something with mass
     * actually slows down.
     */
    const settleToNormalSpeed = (animations: Animation[]) => {
        stopSettling();
        let previous = performance.now();

        const tick = (now: number) => {
            const dt = now - previous;
            previous = now;

            const rate = settleStep(animations[0].playbackRate, dt, SETTLE_TAU_MS);

            if (Math.abs(rate - 1) < 0.02) {
                animations.forEach((animation) => { animation.playbackRate = 1; });
                settleRef.current = 0;
                return;
            }

            animations.forEach((animation) => { animation.playbackRate = rate; });
            settleRef.current = requestAnimationFrame(tick);
        };

        settleRef.current = requestAnimationFrame(tick);
    };

    /**
     * Dragging scrubs the belt by seeking the animations themselves rather than
     * by adding a second transform on top of them. Position along the belt *is*
     * animation time here, so moving the clock is the only way to drag without
     * two systems fighting over the same transform - and it means letting go
     * needs no reconciliation step: the animation is already exactly where the
     * finger left it and simply carries on.
     */
    const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (event.button !== 0 || !beltRef.current) return;

        const animations = beltRef.current
            .getAnimations({ subtree: true })
            .filter((animation) => animation.effect !== null);

        // Reduced motion removes the animations entirely, so there is nothing to
        // scrub and nothing to suppress - the belt just is not draggable there.
        if (animations.length === 0) return;

        const slot = beltRef.current.querySelector<HTMLElement>('.desk-belt__slot');
        const timing = animations[0].effect?.getTiming();
        const cycleMs = typeof timing?.duration === 'number' ? timing.duration : 0;
        if (!slot || cycleMs <= 0) return;

        // offsetWidth, not getBoundingClientRect: the slots are rotated and
        // pushed back in Z, so their rendered box is not their layout width.
        const step = Number.parseFloat(
            getComputedStyle(beltRef.current).getPropertyValue('--step'),
        ) || 1;
        const span = slot.offsetWidth * step * TILES.length;

        stopSettling();

        // Park the clock high before anything else touches it. A rightward throw
        // runs the animations backwards, and a currentTime that reaches zero
        // drops into the before-phase and stops rendering - so give it room
        // first. Modulo keeps this idempotent across repeated drags, and the
        // effect is periodic so none of it shows.
        animations.forEach((animation) => {
            const time = Number(animation.currentTime ?? 0) % cycleMs;
            animation.playbackRate = 1;
            animation.currentTime = time + CLOCK_HEADROOM_CYCLES * cycleMs;
        });

        dragRef.current = {
            pointerX: event.clientX,
            animations,
            baseTimes: animations.map((animation) => Number(animation.currentTime ?? 0)),
            cycleMs,
            // The belt covers `span` pixels in one cycle, so this converts the
            // pointer's travel into the clock's.
            msPerPx: cycleMs / span,
            pxPerMs: span / cycleMs,
            samples: [{ x: event.clientX, t: performance.now() }],
            moved: false,
        };

        setDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag) return;

        const dx = event.clientX - drag.pointerX;
        if (Math.abs(dx) > DRAG_SLOP) drag.moved = true;

        // Kept for the throw. Only the tail matters, so the list is trimmed to
        // the window rather than growing for the length of the gesture - and it
        // means a drag that stalls before release throws nothing, which is what
        // stopping dead should do.
        const now = performance.now();
        drag.samples.push({ x: event.clientX, t: now });
        while (drag.samples.length > 2 && now - drag.samples[0].t > FLING_WINDOW_MS) {
            drag.samples.shift();
        }

        drag.animations.forEach((animation, index) => {
            // Travel runs +span/2 -> -span/2, so advancing the clock carries
            // cards leftward. Dragging right therefore has to run it backwards.
            let time = drag.baseTimes[index] - dx * drag.msPerPx;

            // The effect is periodic, so adding whole cycles changes nothing on
            // screen - it just keeps the clock out of the negative, where an
            // animation sits in its before-phase and stops rendering.
            if (time < 0) time += Math.ceil(-time / drag.cycleMs) * drag.cycleMs;

            animation.currentTime = time;
        });
    };

    /**
     * Ends the gesture and hands the belt back.
     *
     * Reachable from pointerup, pointercancel *and* lostpointercapture. The
     * last one is the safety net and it is not theoretical: a native image drag
     * takes the pointer stream away mid-gesture and no pointerup ever arrives,
     * which left the belt paused with is-dragging still on it - stuck until the
     * next press. It showed up more often on narrow screens simply because the
     * card fills most of the belt there, so almost every press lands on an
     * image. Preventing the drag (below) stops that particular cause; ending on
     * lost capture covers every other way a pointer can vanish.
     */
    const endDrag = (event: PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag) return;

        dragRef.current = null;
        setDragging(false);

        if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        // A press that never travelled is not a throw. Hand the belt straight
        // back at its own speed rather than reading a velocity out of noise.
        if (!drag.moved) {
            drag.animations.forEach((animation) => { animation.playbackRate = 1; });
            return;
        }

        const oldest = drag.samples[0];
        const newest = drag.samples[drag.samples.length - 1];
        const elapsed = newest.t - oldest.t;

        // Pointer velocity in px/ms over the tail of the gesture. A drag that
        // came to rest before release has newest ~= oldest, so this is ~0 and
        // the belt simply resumes.
        const velocity = elapsed > 0 ? (newest.x - oldest.x) / elapsed : 0;
        const rate = throwRateFromVelocity(velocity, drag.pxPerMs, MAX_RATE);

        drag.animations.forEach((animation) => { animation.playbackRate = rate; });
        settleToNormalSpeed(drag.animations);
    };

    const state = dragging ? ' is-dragging' : '';

    return (
        // --count belongs on .desk-belt, not on the stage: .desk-belt is where
        // --span is declared, custom properties only inherit downward, and a
        // --span that cannot see --count resolves to nothing - which silently
        // takes the whole travel transform with it and stacks every card in one
        // place. Verified in the browser rather than assumed.
        <div
            ref={beltRef}
            className={`desk-belt${state}`}
            style={{ '--count': TILES.length } as CSSProperties}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onLostPointerCapture={endDrag}
            // The browser's own image dragging competes for the same gesture and
            // wins, swallowing the pointer stream. Cancelling it here is what
            // keeps a press on a screenshot scrubbing the belt instead of
            // peeling the picture off it.
            onDragStart={(event) => event.preventDefault()}
        >
            <div
                className="desk-belt__stage"
                role="img"
                aria-label="A continuous belt of screenshots from the MerchForge dashboard: overview, products, inventory and orders"
            >
                {TILES.map((tile, index) => (
                    <div
                        className="desk-belt__slot"
                        key={tile.src}
                        style={{ '--i': index } as CSSProperties}
                    >
                        <figure className="desk-belt__card">
                            {/* draggable={false} as well as the CSS: -webkit-user-drag
                                is non-standard and Firefox ignores it entirely, so
                                the stylesheet alone left images draggable there. */}
                            <img
                                src={tile.src}
                                alt={tile.alt}
                                draggable={false}
                                loading={index < 3 ? 'eager' : 'lazy'}
                            />
                        </figure>
                    </div>
                ))}
            </div>
        </div>
    );
}
