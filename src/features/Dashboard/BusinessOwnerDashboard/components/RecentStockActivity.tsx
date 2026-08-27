import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type { StockMovement } from "../types";

type RecentStockActivityProps = {
    movements?: StockMovement[];
    isLoading: boolean;
    isError: boolean;
};

const RecentStockActivity = ({ movements, isLoading, isError }: RecentStockActivityProps) => {
    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Recent stock activity</h3>
            </div>

            {isLoading ? (
                <div className="business-dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Failed to load recent activity. Please try again.
                </p>
            ) : !movements || movements.length === 0 ? (
                <p className="business-dashboard-table-message">No stock changes yet.</p>
            ) : (
                <div className="business-dashboard-table-wrapper">
                    <table className="business-dashboard-table">
                        <tbody>
                            {movements.map((movement) => (
                                <tr key={movement.id}>
                                    <td>{movement.productTitle}</td>
                                    <td>
                                        <span
                                            className={`business-dashboard-badge business-dashboard-badge--status-${movement.amount > 0 ? "active" : "cancelled"}`}
                                        >
                                            {movement.amount > 0 ? "+" : ""}
                                            {movement.amount}
                                        </span>
                                    </td>
                                    <td>{movement.reason ?? "—"}</td>
                                    <td>{new Date(movement.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default RecentStockActivity;
