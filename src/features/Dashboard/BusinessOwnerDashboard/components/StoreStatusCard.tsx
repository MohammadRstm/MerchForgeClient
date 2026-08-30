type StoreStatusCardProps = {
    hasWebsite: boolean;
    websiteUrl?: string | null;
};

/** Derived, not invented — Business has no explicit "is my storefront live" flag, so this reflects the one real signal that exists: whether a website URL has been published. */
const StoreStatusCard = ({ hasWebsite, websiteUrl }: StoreStatusCardProps) => {
    return (
        <section className="business-dashboard-table-card overview-compact-card">
            <span className="business-dashboard-form-label">Store Status</span>

            <span
                className={`business-dashboard-badge overview-compact-card__value ${
                    hasWebsite ? "business-dashboard-badge--status-active" : "business-dashboard-badge--status-pastdue"
                }`}
            >
                ● {hasWebsite ? "Published" : "Not Published"}
            </span>

            <span className="overview-compact-card__note">
                {hasWebsite ? "Your storefront is live." : "Publish your storefront to start selling."}
            </span>

            {hasWebsite && websiteUrl && (
                <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="business-dashboard-button-ghost overview-section-link"
                >
                    View Storefront →
                </a>
            )}
        </section>
    );
};

export default StoreStatusCard;
