import { useCallback, useEffect, useState } from "react";

/** Collapse the header past here, and only restore it well back above there. The
 *  gap has to exceed the 16px of padding the collapse removes - see the comment on
 *  the scroll handler for why. */
const SHRINK_AT = 64;
const GROW_AT = 12;
import { Link } from "react-router";
import "./Header.css";
import logo from "../../assets/logo.svg";
import { routes } from "../../config/routes";
import useAuth from "../../context/Auth/useAuth";
import useLogout from "./hooks/data/useLogout";

interface NavLink {
    label: string;
    href: string;
}

// Every href must match an id actually rendered on the landing page.
const NAV_LINKS: NavLink[] = [
    { label: "How it works", href: "#studio" },
    { label: "Dashboard", href: "#dashboard" },
    { label: "Coming soon", href: "#whats-next" },
    { label: "Pricing", href: "#pricing" },
];

const Header = () => {
    const { isAuthenticated } = useAuth();
    const { mutate: submitLogout, isPending: logoutPending } = useLogout();

    // Read once on mount rather than assumed false, so arriving at a deep-linked
    // anchor does not start tall and immediately collapse.
    const [scrolled, setScrolled] = useState(() => window.scrollY > SHRINK_AT);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        // No rAF throttle: the work is one comparison, and React bails out of the
        // render when the value is unchanged, so the common case costs nothing.
        //
        // Hysteresis, not one threshold. Collapsing the header removes 16px of
        // padding above the scroll anchor, and the browser compensates by taking the
        // same 16px off scrollY to keep the content still. Against a single 8px line
        // that lands back under it, which restores the padding, which pushes back
        // over it - the two states then flip against each other as fast as the
        // browser can lay out, which is the header visibly vibrating. Two lines far
        // enough apart that one 16px correction cannot cross both makes that
        // impossible.
        const onScroll = () =>
            setScrolled((current) =>
                current ? window.scrollY > GROW_AT : window.scrollY > SHRINK_AT,
            );

        window.addEventListener("scroll", onScroll, { passive: true });

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!menuOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMenuOpen(false);
        };
        const onResize = () => {
            if (window.innerWidth > 720) setMenuOpen(false);
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("resize", onResize);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("resize", onResize);
        };
    }, [menuOpen]);

    const closeMenu = useCallback(() => setMenuOpen(false), []);

    return (
        <header className={`header${scrolled ? " header--scrolled" : ""}${menuOpen ? " header--open" : ""}`}>
            <div className="header__inner">
                <Link to={routes.HOME} className="header__logo" onClick={closeMenu}>
                    <img src={logo} alt="" className="header__logo-mark" />
                    MerchForge
                </Link>

                <nav className="header__links" aria-label="Primary">
                    {NAV_LINKS.map((link) => (
                        <a key={link.label} href={link.href} className="header__link">
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="header__actions">
                    {isAuthenticated ? (
                        <>
                            <Link to={routes.DASHBOARD} className="header__cta">
                                Dashboard
                            </Link>
                            <button
                                type="button"
                                className="header__login header__logout-btn"
                                onClick={() => submitLogout()}
                                disabled={logoutPending}
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <Link to={routes.LOGIN} className="header__login">
                            Log in
                        </Link>
                    )}
                </div>

                <button
                    type="button"
                    className="header__menu-toggle"
                    aria-expanded={menuOpen}
                    aria-controls="header-mobile-menu"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <span className="header__menu-bar" />
                    <span className="header__menu-bar" />
                    <span className="header__menu-bar" />
                </button>
            </div>

            <div className="header__mobile" id="header-mobile-menu" hidden={!menuOpen}>
                <nav className="header__mobile-links" aria-label="Mobile">
                    {NAV_LINKS.map((link) => (
                        <a key={link.label} href={link.href} className="header__mobile-link" onClick={closeMenu}>
                            {link.label}
                        </a>
                    ))}
                </nav>
                <div className="header__mobile-actions">
                    {isAuthenticated ? (
                        <>
                            <Link to={routes.DASHBOARD} className="header__cta header__cta--mobile" onClick={closeMenu}>
                                Dashboard
                            </Link>
                            <button
                                type="button"
                                className="header__login header__login--mobile header__logout-btn"
                                onClick={() => {
                                    closeMenu();
                                    submitLogout();
                                }}
                                disabled={logoutPending}
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <Link to={routes.LOGIN} className="header__login header__login--mobile" onClick={closeMenu}>
                            Log in
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
