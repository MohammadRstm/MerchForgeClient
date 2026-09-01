import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type { FailedLoginStatsResponse } from "../types";

type FailedLoginMonitorProps = {
    stats?: FailedLoginStatsResponse;
    isLoading: boolean;
    isError: boolean;
};

const FailedLoginMonitor = ({ stats, isLoading, isError }: FailedLoginMonitorProps) => {
    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Failed Login Attempts</h3>
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError || !stats ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Unable to load failed login activity.
                </p>
            ) : (
                <>
                    <div className="failed-login-counts">
                        <div>
                            <span className="failed-login-count-value">{stats.today}</span>
                            <span className="dashboard-table-muted">Today</span>
                        </div>
                        <div>
                            <span className="failed-login-count-value">{stats.last7Days}</span>
                            <span className="dashboard-table-muted">Last 7 days</span>
                        </div>
                        <div>
                            <span className="failed-login-count-value">{stats.last30Days}</span>
                            <span className="dashboard-table-muted">Last 30 days</span>
                        </div>
                    </div>

                    {stats.recent.length === 0 ? (
                        <p className="dashboard-table-message">No failed login attempts recorded yet.</p>
                    ) : (
                        <ul className="recent-activity-list">
                            {stats.recent.map((attempt, index) => (
                                <li key={`${attempt.attemptedEmail}-${attempt.createdAt}-${index}`}>
                                    <span>{attempt.attemptedEmail}</span>
                                    <span className="dashboard-table-muted">
                                        {new Date(attempt.createdAt).toLocaleString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </section>
    );
};

export default FailedLoginMonitor;
