import { DEMO_BUSINESS_CREDENTIALS } from "../data/demoBusinessCredentials";

type DemoBusinessCredentialsBannerProps = {
    businessId: string;
    isDemo: boolean;
};

const DemoBusinessCredentialsBanner = ({ businessId, isDemo }: DemoBusinessCredentialsBannerProps) => {
    if (!isDemo) return null;

    const credentials = DEMO_BUSINESS_CREDENTIALS[businessId];

    return (
        <div className="demo-credentials-banner">
            <span className="dashboard-badge dashboard-badge--neutral">Demo business</span>
            {credentials ? (
                <p className="demo-credentials-banner-text">
                    Login: <strong>{credentials.email}</strong> · <strong>{credentials.password}</strong>
                </p>
            ) : (
                <p className="demo-credentials-banner-text">
                    No stored login found for this demo business — add one to demoBusinessCredentials.ts.
                </p>
            )}
        </div>
    );
};

export default DemoBusinessCredentialsBanner;
