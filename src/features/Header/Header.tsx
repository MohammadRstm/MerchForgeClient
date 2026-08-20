import { useCallback, useEffect, useState } from "react";
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

// Every href must match an id actually rendered on the landing page — "#features"
// and "#coming-soon" matched nothing, so those two nav items did nothing at all.
const NAV_LINKS: NavLink[] = [
    { label: "Features", href: "#how-it-works" },
    { label: "AI", href: "#ai" },
    { label: "Pricing", href: "#pricing" },
    { label: "Coming Soon", href: "#integrations" },
];

const Header = () => {
    const { isAuthenticated } = useAuth();
    const { mutate: submitLogout, isPending: logoutPending } = useLogout();

    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
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
                        <a key={link.href} href={link.href} className="header__link">
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
                        <>
                            <Link to={routes.LOGIN} className="header__login">
                                Log in
                            </Link>
                            <Link to={routes.SIGNUP} className="header__cta">
                                Sign up
                            </Link>
                        </>
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
                        <a key={link.href} href={link.href} className="header__mobile-link" onClick={closeMenu}>
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
                        <>
                            <Link to={routes.LOGIN} className="header__login header__login--mobile" onClick={closeMenu}>
                                Log in
                            </Link>
                            <Link to={routes.SIGNUP} className="header__cta header__cta--mobile" onClick={closeMenu}>
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
