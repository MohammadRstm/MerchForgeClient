import CounterBase from '../../../../assets/Landing/Landing__Showcase__counter-base.jpg';
import CounterGreen from '../../../../assets/Landing/Landing__Showcase__counter-green.jpg';
import Burger from '../../../../assets/Landing/Landing__Showcase__burger.jpg';
import AngleFront from '../../../../assets/Landing/Landing__Showcase__angle-front.jpg';

/**
 * The five dashboard surfaces, drawn rather than screenshotted.
 *
 * Screenshots would be stale the first time the dashboard changed, blurry on a
 * retina display, and unreadable on a phone. Drawing them from the marketing
 * tokens keeps them sharp, translatable and honest to the current product.
 *
 * The wording is lifted from the real dashboard — "Restock needed", "Fastest
 * mover", "Sitting idle" — because invented marketing labels are exactly what
 * makes a product mock read as a mock.
 *
 * Palette note: these deliberately use the marketing --mf-* tokens rather than
 * the dashboard's own blue. CLAUDE.md keeps the two design systems apart, and a
 * panel of dashboard blue dropped into a warm marketing page would read as a
 * pasted screenshot rather than part of the page.
 */

/** Numbers are deliberately uneven. Round ones read as invented, because they are. */

function StatTile({ label, value, delta }: { label: string; value: string; delta?: string }) {
    return (
        <div className="desk-stat">
            <p className="desk-stat__label">{label}</p>
            <p className="desk-stat__value">{value}</p>
            {delta ? <p className="desk-stat__delta">{delta}</p> : null}
        </div>
    );
}

const ACTIVITY = [
    { when: '11:42', what: 'Stock added', detail: 'Oak counter stool · +24 units' },
    { when: '10:08', what: 'Order placed', detail: '#4471 · Amara Nwosu · $184.00' },
    { when: '09:15', what: 'Restock needed', detail: 'Linen shirt, sand · 3 left' },
    { when: 'Yest.', what: 'Product published', detail: 'Cheeseburger · created from a photo' },
];

export function OverviewPanel() {
    return (
        <div className="desk-panel desk-panel--overview">
            <div className="desk-stats">
                <StatTile label="Revenue, 30 days" value="$26,740" delta="+9.3%" />
                <StatTile label="Orders" value="312" delta="+18" />
                <StatTile label="Products" value="68" />
                <StatTile label="Customers" value="1,142" delta="+37" />
            </div>

            <div className="desk-feed">
                <p className="desk-panel__caption">Recent activity</p>
                <ul>
                    {ACTIVITY.map((row) => (
                        <li key={row.when + row.what}>
                            <span className="desk-feed__when">{row.when}</span>
                            <span className="desk-feed__what">{row.what}</span>
                            <span className="desk-feed__detail">{row.detail}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

const PRODUCTS = [
    { image: CounterBase, name: 'Oak counter stool', variants: ['Oak', 'Forest', 'Terracotta'], price: '$149.00', state: 'Live' },
    { image: AngleFront, name: 'Linen overshirt', variants: ['Sand', 'Ecru'], price: '$88.00', state: 'Live' },
    { image: Burger, name: 'Signature cheeseburger', variants: ['Single', 'Double'], price: '$14.50', state: 'Draft' },
];

export function ProductsPanel() {
    return (
        <div className="desk-panel">
            <p className="desk-panel__caption">Catalog</p>

            <ul className="desk-rows desk-rows--products">
                {PRODUCTS.map((product) => (
                    <li key={product.name}>
                        <img src={product.image} alt="" loading="lazy" />

                        <div className="desk-rows__main">
                            <p className="desk-rows__title">{product.name}</p>
                            <p className="desk-chips">
                                {product.variants.map((variant) => (
                                    <span key={variant}>{variant}</span>
                                ))}
                            </p>
                        </div>

                        <span className="desk-rows__figure">{product.price}</span>
                        <span className={`desk-pill desk-pill--${product.state.toLowerCase()}`}>{product.state}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const STOCK = [
    { name: 'Oak counter stool', held: 24, cap: 40, note: 'Fastest mover' },
    { name: 'Linen overshirt, sand', held: 3, cap: 40, note: 'Restock needed', low: true },
    { name: 'Forest counter stool', held: 31, cap: 40, note: 'Sitting idle' },
];

export function InventoryPanel() {
    return (
        <div className="desk-panel">
            <div className="desk-stats desk-stats--inline">
                <StatTile label="Total units in stock" value="1,284" />
                <StatTile label="Low stock" value="6" />
                <StatTile label="Out of stock" value="1" />
            </div>

            <ul className="desk-rows desk-rows--stock">
                {STOCK.map((item) => (
                    <li key={item.name}>
                        <div className="desk-rows__main">
                            <p className="desk-rows__title">{item.name}</p>
                            <span className={`desk-note${item.low ? ' desk-note--warn' : ''}`}>{item.note}</span>
                        </div>

                        <span className="desk-meter" aria-hidden="true">
                            <span
                                className={item.low ? 'is-low' : undefined}
                                style={{ width: `${Math.round((item.held / item.cap) * 100)}%` }}
                            />
                        </span>

                        <span className="desk-rows__figure">{item.held}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const ORDERS = [
    { id: '#4471', who: 'Amara Nwosu', total: '$184.00', state: 'Paid' },
    { id: '#4470', who: 'Tomás Ferreira', total: '$62.50', state: 'Fulfilled' },
    { id: '#4468', who: 'Hannah Lindqvist', total: '$297.00', state: 'Fulfilled' },
    { id: '#4467', who: 'Wei Chen', total: '$41.00', state: 'Refunded' },
];

export function OrdersPanel() {
    return (
        <div className="desk-panel">
            <p className="desk-panel__caption">Orders</p>

            <ul className="desk-rows desk-rows--orders">
                {ORDERS.map((order) => (
                    <li key={order.id}>
                        <span className="desk-rows__id">{order.id}</span>
                        <span className="desk-rows__main desk-rows__title">{order.who}</span>
                        <span className="desk-rows__figure">{order.total}</span>
                        <span className={`desk-pill desk-pill--${order.state.toLowerCase()}`}>{order.state}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/** Where the request has got to. Only one of these is the current step. */
const STAGES = ['Requested', 'In build', 'Review', 'Live'];
const CURRENT_STAGE = 1;

export function WebsitePanel() {
    return (
        <div className="desk-panel desk-panel--website">
            <figure className="desk-preview">
                <img src={CounterGreen} alt="" loading="lazy" />
                <figcaption>Storefront preview</figcaption>
            </figure>

            <div className="desk-request">
                <p className="desk-panel__caption">Website request</p>
                <p className="desk-rows__title">Homeware — editorial template</p>

                <ol className="desk-stages">
                    {STAGES.map((stage, index) => (
                        <li
                            key={stage}
                            className={
                                index < CURRENT_STAGE ? 'is-done' : index === CURRENT_STAGE ? 'is-current' : undefined
                            }
                        >
                            <span aria-hidden="true" />
                            {stage}
                        </li>
                    ))}
                </ol>

                <p className="desk-note">Your colours, logo and type — applied to the template you picked.</p>
            </div>
        </div>
    );
}
