import { useId, useRef, useState } from 'react';
import { InventoryPanel, OrdersPanel, OverviewPanel, ProductsPanel, WebsitePanel } from './OwnerDeskPanels';
import './OwnerDesk.css';

/**
 * The half of MerchForge that isn't AI: the dashboard an owner actually runs.
 *
 * Built as the product rather than as a diagram of it — the rail carries the
 * real sidebar labels, and choosing one swaps the surface beside it. Driven
 * entirely by the visitor, deliberately: the hero already advances on its own,
 * and two things moving without being asked is one too many.
 */

const SURFACES = [
    { id: 'overview', label: 'Overview', blurb: 'What happened while you were away.', render: () => <OverviewPanel /> },
    { id: 'products', label: 'Products', blurb: 'Every product, every variant, one list.', render: () => <ProductsPanel /> },
    { id: 'inventory', label: 'Inventory', blurb: 'What is moving, what is stuck, what is nearly gone.', render: () => <InventoryPanel /> },
    { id: 'orders', label: 'Orders', blurb: 'From placed to fulfilled, without a spreadsheet.', render: () => <OrdersPanel /> },
    { id: 'website', label: 'Website Requests', blurb: 'Pick a template, we build the storefront.', render: () => <WebsitePanel /> },
];

export default function OwnerDesk() {
    const [active, setActive] = useState(0);
    const baseId = useId();
    const tabsRef = useRef<HTMLDivElement>(null);

    /** Roving focus, which is what a tablist is expected to do with arrow keys. */
    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const step = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1
            : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1
            : 0;

        if (step === 0) return;

        event.preventDefault();
        const next = (active + step + SURFACES.length) % SURFACES.length;
        setActive(next);

        tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
    };

    const surface = SURFACES[active];

    return (
        <section className="mf-section desk" id="dashboard" aria-labelledby={`${baseId}-heading`}>
            <div className="mf-section__inner">
                <header className="desk__header">
                    <p className="mf-eyebrow">Your dashboard</p>
                    <h2 className="desk__heading" id={`${baseId}-heading`}>
                        The AI makes the listing. This is where you run the shop.
                    </h2>
                    <p className="desk__lede">
                        Everything after the photo — stock, orders, customers and the storefront itself —
                        in one place, without a spreadsheet in sight.
                    </p>
                </header>

                <div className="desk__frame">
                    <div
                        className="desk__rail"
                        role="tablist"
                        aria-orientation="vertical"
                        aria-label="Dashboard surfaces"
                        ref={tabsRef}
                        onKeyDown={onKeyDown}
                    >
                        {SURFACES.map((item, index) => (
                            <button
                                key={item.id}
                                type="button"
                                role="tab"
                                id={`${baseId}-tab-${item.id}`}
                                aria-selected={index === active}
                                aria-controls={`${baseId}-panel-${item.id}`}
                                // Only the selected tab is tabbable; arrows move between
                                // them. Five stops in a row is not what Tab is for.
                                tabIndex={index === active ? 0 : -1}
                                className={`desk__rail-item${index === active ? ' is-active' : ''}`}
                                onClick={() => setActive(index)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="desk__stage">
                        <div
                            // Keyed so the panel remounts and replays its entrance
                            // instead of appearing already settled.
                            key={surface.id}
                            role="tabpanel"
                            id={`${baseId}-panel-${surface.id}`}
                            aria-labelledby={`${baseId}-tab-${surface.id}`}
                            tabIndex={0}
                            className="desk__stage-inner"
                        >
                            {surface.render()}
                        </div>
                    </div>
                </div>

                <p className="desk__blurb" aria-live="polite">
                    {surface.blurb}
                </p>
            </div>
        </section>
    );
}
