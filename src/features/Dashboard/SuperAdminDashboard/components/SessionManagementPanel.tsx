type SessionManagementPanelProps = {
    activeSessions?: number;
    isLoading: boolean;
    onRevokeAll: () => void;
};

/**
 * Session visibility is deliberately limited to a count, not a per-device list -
 * RefreshToken carries no IP/user-agent/device data, and adding that would edge
 * into device fingerprinting, which this page's spec explicitly rules out.
 */
const SessionManagementPanel = ({ activeSessions, isLoading, onRevokeAll }: SessionManagementPanelProps) => {
    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Session Management</h3>
            </div>
            <div className="session-management-row">
                <div>
                    <span className="failed-login-count-value">{isLoading ? "—" : activeSessions}</span>
                    <span className="dashboard-table-muted"> active session{activeSessions === 1 ? "" : "s"} platform-wide</span>
                </div>
                <button type="button" className="dashboard-modal-confirm-btn" onClick={onRevokeAll}>
                    Revoke All Sessions
                </button>
            </div>
        </section>
    );
};

export default SessionManagementPanel;
