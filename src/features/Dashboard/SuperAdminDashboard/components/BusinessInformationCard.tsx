import type { BusinessDetailResponse } from "../types";

type BusinessInformationCardProps = {
    business: BusinessDetailResponse;
};

const DAY_LABELS: Record<string, string> = {
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
};

const SOCIAL_LABELS: Record<string, string> = {
    facebook: "Facebook",
    instagram: "Instagram",
    twitter: "Twitter",
    tikTok: "TikTok",
    youTube: "YouTube",
    linkedIn: "LinkedIn",
};

const BusinessInformationCard = ({ business }: BusinessInformationCardProps) => {
    const hasContact = business.contactEmail || business.contactPhone || business.whatsAppNumber;
    const hasAddress =
        business.addressLine1 || business.city || business.state || business.postalCode || business.country;
    const socialEntries = business.socialLinks
        ? Object.entries(business.socialLinks).filter(([, value]) => value)
        : [];
    const hoursEntries = business.businessHours
        ? Object.entries(business.businessHours).filter(
              (entry): entry is [string, { closed: boolean; open: string; close: string }] => {
                  const day = entry[1];
                  return !!day && !day.closed && !!day.open && !!day.close;
              }
          )
        : [];

    const nothingToShow =
        !business.logoUrl &&
        !business.tagline &&
        !hasContact &&
        !hasAddress &&
        socialEntries.length === 0 &&
        hoursEntries.length === 0;

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Business Information</h3>
            </div>

            {nothingToShow ? (
                <p className="dashboard-table-message">No storefront branding information set yet.</p>
            ) : (
                <div className="business-info-grid">
                    {(business.logoUrl || business.tagline) && (
                        <div className="business-info-block">
                            {business.logoUrl && (
                                <img src={business.logoUrl} alt="" className="business-info-logo" />
                            )}
                            {business.tagline && <p className="business-info-tagline">{business.tagline}</p>}
                        </div>
                    )}

                    {hasContact && (
                        <div className="business-info-block">
                            <h4 className="dashboard-subsection-heading">Contact</h4>
                            <dl className="business-detail-grid">
                                {business.contactEmail && (
                                    <div>
                                        <dt>Email</dt>
                                        <dd>{business.contactEmail}</dd>
                                    </div>
                                )}
                                {business.contactPhone && (
                                    <div>
                                        <dt>Phone</dt>
                                        <dd>{business.contactPhone}</dd>
                                    </div>
                                )}
                                {business.whatsAppNumber && (
                                    <div>
                                        <dt>WhatsApp</dt>
                                        <dd>{business.whatsAppNumber}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    )}

                    {hasAddress && (
                        <div className="business-info-block">
                            <h4 className="dashboard-subsection-heading">Location</h4>
                            <p className="business-info-address">
                                {[business.addressLine1, business.addressLine2, business.city, business.state, business.postalCode, business.country]
                                    .filter(Boolean)
                                    .join(", ")}
                            </p>
                        </div>
                    )}

                    {socialEntries.length > 0 && (
                        <div className="business-info-block">
                            <h4 className="dashboard-subsection-heading">Social</h4>
                            <div className="product-overview-categories">
                                {socialEntries.map(([key, value]) => (
                                    <a
                                        key={key}
                                        href={value ?? undefined}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="dashboard-badge dashboard-badge--info"
                                    >
                                        {SOCIAL_LABELS[key] ?? key}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {hoursEntries.length > 0 && (
                        <div className="business-info-block">
                            <h4 className="dashboard-subsection-heading">Business hours</h4>
                            <ul className="business-info-hours">
                                {hoursEntries.map(([day, hours]) => (
                                    <li key={day}>
                                        <span>{DAY_LABELS[day] ?? day}</span>
                                        <span>
                                            {hours.open} – {hours.close}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default BusinessInformationCard;
