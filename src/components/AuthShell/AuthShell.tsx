import { Link } from "react-router";
import logo from "../../assets/logo.svg";
import cartIllustration from "../../assets/illustrations/shopping-cart.svg";
import "./AuthShell.css";

interface AuthShellProps {
    children: React.ReactNode;
}

/**
 * Shared split-screen shell for every auth page (owner login, invitation
 * acceptance, customer login/signup) — all of them sit under the marketing
 * header (see PagesWithHeaderLayout), so this borrows the marketing site's own
 * brand system (--mf-* tokens, Fraunces display font, warm accent) instead of
 * the dashboard's blue, rather than reinventing a third look.
 *
 * The left panel's brand statement is intentionally static across every page —
 * only the form side (passed as children) changes per page.
 */
export default function AuthShell({ children }: AuthShellProps) {
    return (
        <main className="auth-shell">
            <div className="auth-shell__visual">
                <Link to="/" className="auth-shell__brand">
                    <img src={logo} alt="" className="auth-shell__brand-mark" />
                    <span className="auth-shell__brand-name">MerchForge</span>
                </Link>

                <div className="auth-shell__graphic" aria-hidden="true">
                    <div className="auth-shell__blob auth-shell__blob--1" />
                    <div className="auth-shell__blob auth-shell__blob--2" />

                    <img
                        src={cartIllustration}
                        alt=""
                        className="auth-shell__illustration"
                    />
                </div>

                <div className="auth-shell__statement">
                    <h2 className="auth-shell__statement-headline">
                        Every storefront starts with a good first impression.
                    </h2>
                    <p className="auth-shell__statement-subtext">
                        MerchForge gives merchants a real storefront — catalog, checkout, and
                        orders — up and running in minutes.
                    </p>
                </div>
            </div>

            <div className="auth-shell__form-side">
                <div className="auth-shell__form-inner">{children}</div>
            </div>
        </main>
    );
}
