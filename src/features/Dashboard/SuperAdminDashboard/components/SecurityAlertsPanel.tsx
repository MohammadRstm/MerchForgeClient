import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type { SecurityAlertResponse } from "../types";

type SecurityAlertsPanelProps = {
    alerts?: SecurityAlertResponse[];
    isLoading: boolean;
    isError: boolean;
};

/** Two severities only, and only real threshold-based signals - repeated failed logins and account disables. Not a SIEM. */
const SecurityAlertsPanel = ({ alerts, isLoading, isError }: SecurityAlertsPanelProps) => {
    if (isLoading) {
        return (
            <section className="dashboard-table-card">
                <div className="dashboard-table-header">
                    <h3>Security Alerts</h3>
                </div>
                <div className="dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="dashboard-table-card">
                <div className="dashboard-table-header">
                    <h3>Security Alerts</h3>
                </div>
                <p className="dashboard-table-message dashboard-table-message--error">
                    Unable to load security alerts.
                </p>
            </section>
        );
    }

    if (!alerts || alerts.length === 0) {
        return null;
    }

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Security Alerts</h3>
            </div>
            <ul className="security-alerts-list">
                {alerts.map((alert, index) => (
                    <li key={`${alert.title}-${alert.createdAt}-${index}`} className={`security-alert security-alert--${alert.severity.toLowerCase()}`}>
                        <div>
                            <span className={`dashboard-badge ${alert.severity === "Critical" ? "dashboard-badge--danger" : "dashboard-badge--warning"}`}>
                                {alert.severity}
                            </span>
                            <strong className="security-alert-title">{alert.title}</strong>
                        </div>
                        <p className="security-alert-description">{alert.description}</p>
                        <span className="dashboard-table-muted">{new Date(alert.createdAt).toLocaleString()}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default SecurityAlertsPanel;
