import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type { InventorySummary } from "../../BusinessOwnerDashboard/types";

type BusinessInventorySnapshotProps = {
    summary?: InventorySummary;
    isLoading: boolean;
    isError: boolean;
};

const BusinessInventorySnapshot = ({ summary, isLoading, isError }: BusinessInventorySnapshotProps) => {
    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Inventory</h3>
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={24} />
                </div>
            ) : isError || !summary ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Unable to load inventory data.
                </p>
            ) : summary.trackedProductCount === 0 && summary.untrackedProductCount === 0 ? (
                <p className="dashboard-table-message">No products have been added yet.</p>
            ) : (
                <div className="inventory-snapshot">
                    <p className="inventory-snapshot-total">
                        {summary.trackedProductCount} tracked product{summary.trackedProductCount === 1 ? "" : "s"}
                        {summary.untrackedProductCount > 0 && (
                            <span className="dashboard-table-muted"> · {summary.untrackedProductCount} untracked</span>
                        )}
                    </p>

                    <dl className="inventory-snapshot-rows">
                        <div>
                            <dt>
                                <span className="dashboard-badge dashboard-badge--success">Healthy</span>
                            </dt>
                            <dd>
                                {Math.max(
                                    0,
                                    summary.trackedProductCount - summary.lowStockCount - summary.outOfStockCount
                                )}
                            </dd>
                        </div>
                        <div>
                            <dt>
                                <span className="dashboard-badge dashboard-badge--warning">Low stock</span>
                            </dt>
                            <dd>{summary.lowStockCount}</dd>
                        </div>
                        <div>
                            <dt>
                                <span className="dashboard-badge dashboard-badge--danger">Out of stock</span>
                            </dt>
                            <dd>{summary.outOfStockCount}</dd>
                        </div>
                    </dl>
                </div>
            )}
        </section>
    );
};

export default BusinessInventorySnapshot;
