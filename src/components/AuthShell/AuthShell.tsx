import { useLayoutEffect, useState } from "react";
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
    // The header's real height varies by viewport (its padding uses clamp()) and
    // isn't a fixed number anywhere in the app -- a hardcoded guess here just
    // reserves the wrong amount of space and either strands empty room or, worse,
    // forces a scrollbar on a form that should fit. Measuring the actual <header>
    // is the only way this stays correct across viewport widths.
    const [headerHeight, setHeaderHeight] = useState(0);

    useLayoutEffect(() => {
        const header = document.querySelector("header");
        if (!header) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) setHeaderHeight(entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height);
        });
        observer.observe(header);

        return () => observer.disconnect();
    }, []);

    return (
        <main className="auth-shell" style={{ height: `calc(100vh - ${headerHeight}px)` }}>
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
