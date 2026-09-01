import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type { KeyCount } from "../types";

type RequestedTemplatesPanelProps = {
    data?: KeyCount[];
    isLoading: boolean;
    isError: boolean;
};

/** What businesses are asking for, distinct from Template Usage (what's actually live) - see the section's own framing. */
const RequestedTemplatesPanel = ({ data, isLoading, isError }: RequestedTemplatesPanelProps) => {
    const sorted = [...(data ?? [])].sort((a, b) => b.count - a.count);

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Requested Templates</h3>
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={24} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Unable to load requested templates.
                </p>
            ) : sorted.length === 0 ? (
                <p className="dashboard-table-message">No website requests have been submitted yet.</p>
            ) : (
                <div className="dashboard-table-wrapper">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Template</th>
                                <th>Requests</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((entry) => (
                                <tr key={entry.key}>
                                    <td>{entry.key}</td>
                                    <td>{entry.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default RequestedTemplatesPanel;
