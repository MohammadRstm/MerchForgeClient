import type { CSSProperties } from 'react';
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

export default function OwnerDeskConveyor() {
    return (
        // --count belongs on .desk-belt, not on the stage: .desk-belt is where
        // --span is declared, custom properties only inherit downward, and a
        // --span that cannot see --count resolves to nothing - which silently
        // takes the whole travel transform with it and stacks every card in one
        // place. Verified in the browser rather than assumed.
        <div className="desk-belt" style={{ '--count': TILES.length } as CSSProperties}>
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
