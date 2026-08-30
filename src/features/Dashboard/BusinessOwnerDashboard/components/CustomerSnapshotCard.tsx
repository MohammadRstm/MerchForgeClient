import useCountUp from "../hooks/ui/useCountUp";
import { numberFormatter } from "../utils/chartMetrics";
import type { CustomerSnapshot } from "../types";

type CustomerSnapshotCardProps = {
    snapshot?: CustomerSnapshot;
    isLoading: boolean;
    isError: boolean;
};

const CustomerSnapshotCard = ({ snapshot, isLoading, isError }: CustomerSnapshotCardProps) => {
    const animatedTotal = useCountUp(snapshot?.totalCustomers ?? 0);

    return (
        <section className="business-dashboard-table-card overview-compact-card">
            <span className="business-dashboard-form-label">Customers</span>

            {isLoading ? (
                <span className="overview-compact-card__value overview-kpi-card__value--empty">—</span>
            ) : isError ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">Unable to load.</p>
            ) : (
                <>
                    <span className="overview-compact-card__value">{numberFormatter.format(Math.round(animatedTotal))}</span>
                    {snapshot && snapshot.newCustomersInPeriod > 0 && (
                        <span className="overview-compact-card__note">
                            +{numberFormatter.format(snapshot.newCustomersInPeriod)} this period
                        </span>
                    )}
                </>
            )}
        </section>
    );
};

export default CustomerSnapshotCard;
