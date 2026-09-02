import { useLayoutEffect, useState } from "react";
import { Link } from "react-router";
import logo from "../../assets/logo.svg";
import "./AuthShell.css";

interface AuthShellProps {
    children: React.ReactNode;
    /** Decorative illustration for the left panel — unique per page. */
    illustration: string;
    statementHeadline: string;
    statementSubtext: string;
    /** Gentle bob animation on the illustration. Off by default — only the owner
     *  login uses it; every other page's illustration stays still. */
    animated?: boolean;
}

/**
 * Shared split-screen shell for every auth page (owner login, invitation
 * acceptance, customer login/signup) — all of them sit under the marketing
 * header (see PagesWithHeaderLayout), so this borrows the marketing site's own
 * brand system (--mf-* tokens, Fraunces display font, warm accent) instead of
 * the dashboard's blue, rather than reinventing a third look.
 */
export default function AuthShell({
    children,
    illustration,
    statementHeadline,
    statementSubtext,
    animated = false,
}: AuthShellProps) {
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
                        src={illustration}
                        alt=""
                        className={`auth-shell__illustration${animated ? " auth-shell__illustration--animated" : ""}`}
                    />
                </div>

                <div className="auth-shell__statement">
                    <h2 className="auth-shell__statement-headline">{statementHeadline}</h2>
                    <p className="auth-shell__statement-subtext">{statementSubtext}</p>
                </div>
            </div>

            <div className="auth-shell__form-side">
                <div className="auth-shell__form-inner">{children}</div>
            </div>
        </main>
    );
}
