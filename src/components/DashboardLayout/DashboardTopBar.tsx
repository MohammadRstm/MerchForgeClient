import { Link } from "react-router";
import { routes } from "../../config/routes";
import useLogout from "../../features/Header/hooks/data/useLogout";

interface DashboardTopBarProps {
    label: string;
}

const DashboardTopBar = ({ label }: DashboardTopBarProps) => {
    const { mutate: submitLogout, isPending: logoutPending } = useLogout();

    return (
        <header className="dashboard-topbar">
            <span className="dashboard-topbar-label">{label}</span>

            <div className="dashboard-topbar-actions">
                <Link to={routes.HOME} className="dashboard-topbar-link">
                    Back to site
                </Link>
                <button
                    type="button"
                    className="dashboard-topbar-logout"
                    onClick={() => submitLogout()}
                    disabled={logoutPending}
                >
                    Log out
                </button>
            </div>
        </header>
    );
};

export default DashboardTopBar;
