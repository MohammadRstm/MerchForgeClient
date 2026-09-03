import type { ReactNode } from "react";
import { Link } from "react-router";
import "../../Home/Home.css";
import "./LegalPage.css";
import { routes } from "../../../config/routes";

interface LegalPageProps {
    title: string;
    version: string;
    effectiveDate: string;
    children: ReactNode;
}

const LEGAL_NAV = [
    { label: "Terms of Service", to: routes.TERMS },
    { label: "Privacy Policy", to: routes.PRIVACY },
    { label: "Acceptable Use Policy", to: routes.ACCEPTABLE_USE },
    { label: "AI Terms", to: routes.AI_TERMS },
];

/**
 * Shared shell for every legal document — one place that owns the "Legal" eyebrow,
 * title, version/effective-date line, and the cross-links between documents, so
 * TermsOfService/PrivacyPolicy/AcceptableUsePolicy/AiTerms only ever supply their
 * own body content.
 */
const LegalPage = ({ title, version, effectiveDate, children }: LegalPageProps) => {
    return (
        <main className="legal-page mf-section">
            <div className="legal-page__inner mf-section__inner">
                <aside className="legal-page__nav" aria-label="Legal documents">
                    {LEGAL_NAV.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`legal-page__nav-link${item.label === title ? " legal-page__nav-link--active" : ""}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </aside>

                <article className="legal-page__content">
                    <p className="mf-eyebrow">Legal</p>
                    <h1 className="legal-page__title mf-headline">{title}</h1>
                    <p className="legal-page__meta">
                        Version {version} &middot; Effective {effectiveDate}
                    </p>

                    <div className="legal-page__draft-notice">
                        <p>
                            <strong>This is an initial draft, not a finished legal document.</strong> It
                            was written directly from MerchForge's actual implementation and is intended
                            to be reviewed by a qualified lawyer before MerchForge is publicly available.
                            It is not legal advice.
                        </p>
                        <p>
                            Highlighted text like{" "}
                            <span className="legal-page__placeholder">[this]</span> marks a detail this
                            document does not have a real answer for yet — a legal entity name, address,
                            or governing jurisdiction that needs to be filled in before this document is
                            final.
                        </p>
                    </div>

                    <div className="legal-page__body">{children}</div>
                </article>
            </div>
        </main>
    );
};

export default LegalPage;
