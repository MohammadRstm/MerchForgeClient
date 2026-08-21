import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type { WebsiteTemplateResponse } from "../types";

type WebsiteTemplatesTableProps = {
    templates?: WebsiteTemplateResponse[];
    isLoading: boolean;
    isError: boolean;
    onAdd: () => void;
};

const WebsiteTemplatesTable = ({ templates, isLoading, isError, onAdd }: WebsiteTemplatesTableProps) => {
    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Website Templates</h3>

                <div className="dashboard-table-controls">
                    <button type="button" className="dashboard-primary-btn" onClick={onAdd}>
                        Add template
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Failed to load website templates. Please try again.
                </p>
            ) : !templates || templates.length === 0 ? (
                <p className="dashboard-table-message">No website templates yet.</p>
            ) : (
                <div className="dashboard-table-wrapper">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Label</th>
                                <th>Domain</th>
                                <th>Status</th>
                                <th>Order</th>
                                <th>Businesses Using It</th>
                            </tr>
                        </thead>

                        <tbody>
                            {templates.map((template) => (
                                <tr key={template.id}>
                                    <td>{template.name}</td>
                                    <td>{template.label}</td>
                                    <td>{template.domainName}</td>
                                    <td>{template.isActive ? "Active" : "Inactive"}</td>
                                    <td>{template.displayOrder}</td>
                                    <td>{template.businessesUsingIt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default WebsiteTemplatesTable;
