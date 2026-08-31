import { Link } from "react-router";
import { routes } from "../../../../config/routes";

type BusinessQuickActionsProps = {
    websiteUrl: string | null;
    businessId: string;
    businessName: string;
    onRevokeSessions: () => void;
};

const BusinessQuickActions = ({ websiteUrl, businessId, businessName, onRevokeSessions }: BusinessQuickActionsProps) => {
    return (
        <>
            {websiteUrl && (
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="dashboard-action-btn">
                    View Storefront
                </a>
            )}
            <Link to={routes.ADMIN_WEBSITE_REQUESTS} className="dashboard-action-btn">
                Website Requests
            </Link>
            <Link
                to={`${routes.ADMIN_CUSTOMERS}?businessId=${businessId}&businessName=${encodeURIComponent(businessName)}`}
                className="dashboard-action-btn"
            >
                View Customers
            </Link>
            <button type="button" className="dashboard-action-btn" onClick={onRevokeSessions}>
                Revoke All Sessions
            </button>
        </>
    );
};

export default BusinessQuickActions;
