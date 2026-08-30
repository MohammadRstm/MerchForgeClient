import { FiSun, FiMoon } from "react-icons/fi";
import useTheme from "../../../../context/Theme/useTheme";

/** Dashboard-only preference — the landing/marketing site and login page always render in light mode regardless of this setting. */
const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Appearance</h3>
            </div>

            <p className="business-dashboard-form-hint" style={{ marginBottom: 12 }}>
                Choose how the dashboard looks. This only affects your dashboard — the public storefront and MerchForge's
                own site are unaffected.
            </p>

            <div className="analytics-range-selector">
                <button
                    type="button"
                    className={`analytics-range-btn${theme === "light" ? " analytics-range-btn--active" : ""}`}
                    onClick={() => setTheme("light")}
                >
                    <FiSun style={{ verticalAlign: "-2px", marginRight: 6 }} />
                    Light
                </button>
                <button
                    type="button"
                    className={`analytics-range-btn${theme === "dark" ? " analytics-range-btn--active" : ""}`}
                    onClick={() => setTheme("dark")}
                >
                    <FiMoon style={{ verticalAlign: "-2px", marginRight: 6 }} />
                    Dark
                </button>
            </div>
        </section>
    );
};

export default ThemeToggle;
