import { useId } from 'react';
import OwnerDeskConveyor from './OwnerDeskConveyor';
import './OwnerDesk.css';

/**
 * The half of MerchForge that isn't AI: the dashboard an owner actually runs.
 *
 * Shown as real screenshots on a conveyor rather than a rail-and-panels mockup
 * of the dashboard — see OwnerDeskConveyor for why, and for where those
 * screenshots come from.
 */

export default function OwnerDesk() {
    const baseId = useId();

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

                <OwnerDeskConveyor />
            </div>
        </section>
    );
}
