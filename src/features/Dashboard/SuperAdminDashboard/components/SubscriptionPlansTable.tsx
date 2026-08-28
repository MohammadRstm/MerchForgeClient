import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type { SubscriptionPlanResponse } from "../types";

const currencyFormatter = (currency: string) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency });

type SubscriptionPlansTableProps = {
    plans?: SubscriptionPlanResponse[];
    isLoading: boolean;
    isError: boolean;
    onAdd: () => void;
    onOpen: (planId: string) => void;
};

const SubscriptionPlansTable = ({ plans, isLoading, isError, onAdd, onOpen }: SubscriptionPlansTableProps) => {
    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Subscription Plans</h3>

                <div className="dashboard-table-controls">
                    <button type="button" className="dashboard-primary-btn" onClick={onAdd}>
                        Add plan
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Failed to load subscription plans. Please try again.
                </p>
            ) : !plans || plans.length === 0 ? (
                <p className="dashboard-table-message">No subscription plans yet.</p>
            ) : (
                <div className="dashboard-table-wrapper">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Billing</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {plans.map((plan) => (
                                <tr
                                    key={plan.id}
                                    className={`website-request-row${plan.isActive ? "" : " product-fields-inactive-row"}`}
                                    onClick={() => onOpen(plan.id)}
                                >
                                    <td>{plan.name}</td>
                                    <td>{currencyFormatter(plan.currency).format(plan.price)}</td>
                                    <td>{plan.billingInterval}</td>
                                    <td>
                                        <span
                                            className={`dashboard-badge ${plan.isActive ? "dashboard-badge--user" : ""}`}
                                        >
                                            {plan.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default SubscriptionPlansTable;
