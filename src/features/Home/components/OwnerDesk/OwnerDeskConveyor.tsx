import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
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
 * It also means no duplicated set and no JavaScript animation loop; the browser
 * composites transform and opacity on its own.
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

/** Travel past this and the gesture is a drag, not a click that wobbled. */
const DRAG_SLOP = 5;

interface DragState {
    pointerX: number;
    animations: Animation[];
    /** Each animation's currentTime when the drag began, in ms. */
    baseTimes: number[];
    cycleMs: number;
    msPerPx: number;
    moved: boolean;
}

export default function OwnerDeskConveyor() {
    const beltRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<DragState | null>(null);

    /**
     * Set when a drag actually travelled, and read by the click handler.
     * pointerup is followed by a click, so without this every drag would also
     * toggle the pause it just finished scrubbing.
     */
    const suppressClick = useRef(false);

    const [paused, setPaused] = useState(false);
    const [dragging, setDragging] = useState(false);

    /**
     * Click to stop, click again to carry on - not hover. A pointer crossing
     * this section is usually travelling somewhere else, so pausing on hover
     * stopped the belt for reasons nobody intended.
     *
     * It is a real toggle button rather than a click handler on a div because
     * something that animates by itself for more than five seconds needs a way
     * to stop it that does not require a mouse (WCAG 2.2.2). Enter and Space
     * are handled explicitly since this is a div playing the role.
     */
    const toggle = () => {
        if (suppressClick.current) {
            suppressClick.current = false;
            return;
        }

        setPaused((current) => !current);
    };

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;

        // Space would otherwise scroll the page out from under the thing the
        // visitor is trying to pause.
        event.preventDefault();
        toggle();
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

        dragRef.current = {
            pointerX: event.clientX,
            animations,
            baseTimes: animations.map((animation) => Number(animation.currentTime ?? 0)),
            cycleMs,
            // The belt covers `span` pixels in one cycle, so this converts the
            // pointer's travel into the clock's.
            msPerPx: cycleMs / span,
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

    const endDrag = (event: PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag) return;

        suppressClick.current = drag.moved;
        dragRef.current = null;
        setDragging(false);

        // Letting go returns to the normal animation, which is also why a drag
        // clears an earlier click-pause: the gesture ends in motion either way.
        if (drag.moved) setPaused(false);

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    const state = `${paused ? ' is-paused' : ''}${dragging ? ' is-dragging' : ''}`;

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
            role="button"
            tabIndex={0}
            aria-pressed={paused}
            aria-label={paused ? 'Resume the dashboard screenshots' : 'Pause the dashboard screenshots'}
            onClick={toggle}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
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
                            <img src={tile.src} alt={tile.alt} loading={index < 3 ? 'eager' : 'lazy'} />
                        </figure>
                    </div>
                ))}
            </div>
        </div>
    );
}
