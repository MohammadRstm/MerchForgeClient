import { useNavigate } from "react-router";
import { routes } from "../../../../config/routes";

type BillingNoticeProps = {
    message: string | null;
};

/** Renders nothing when there's nothing worth surfacing — a permanent billing card would waste space on every visit for the common case where the plan is simply fine. */
const BillingNotice = ({ message }: BillingNoticeProps) => {
    const navigate = useNavigate();

    if (!message) return null;

    return (
        <div className="overview-billing-notice">
            <span>{message}</span>
            <button type="button" className="business-dashboard-button-secondary" onClick={() => navigate(routes.DASHBOARD_BILLING)}>
                View Billing
            </button>
        </div>
    );
};

export default BillingNotice;
