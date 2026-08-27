import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import type { IconType } from "react-icons";
import logo from "../../assets/logo.svg";
import { routes } from "../../config/routes";

export interface DashboardNavItem {
    label: string;
    to: string;
    icon: IconType;
    end?: boolean;
}

interface SidebarProps {
    items: DashboardNavItem[];
}

const Sidebar = ({ items }: SidebarProps) => {
    const [open, setOpen] = useState(false);

    // Mirrors the mobile-menu behavior already proven in Header.tsx: lock scroll,
    // close on Escape, and close automatically if the viewport grows past mobile.
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        const onResize = () => {
            if (window.innerWidth > 900) setOpen(false);
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("resize", onResize);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("resize", onResize);
        };
    }, [open]);

    const closeMenu = () => setOpen(false);

    return (
        <>
            <button
                type="button"
                className="dashboard-sidebar-toggle"
                aria-expanded={open}
                aria-controls="dashboard-sidebar"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((value) => !value)}
            >
                <span className="dashboard-sidebar-toggle-bar" />
                <span className="dashboard-sidebar-toggle-bar" />
                <span className="dashboard-sidebar-toggle-bar" />
            </button>

            {open && <div className="dashboard-sidebar-overlay" onClick={closeMenu} />}

            <aside
                id="dashboard-sidebar"
                className={`dashboard-sidebar${open ? " dashboard-sidebar--open" : ""}`}
            >
                <Link to={routes.HOME} className="dashboard-sidebar-logo" onClick={closeMenu}>
                    <img src={logo} alt="" className="dashboard-sidebar-logo-mark" />
                    MerchForge
                </Link>

                <nav className="dashboard-sidebar-nav" aria-label="Dashboard">
                    {items.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                `dashboard-sidebar-link${isActive ? " dashboard-sidebar-link--active" : ""}`
                            }
                        >
                            <item.icon className="dashboard-sidebar-link-icon" aria-hidden="true" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
