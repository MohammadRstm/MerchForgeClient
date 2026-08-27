import "./SuperAdminDashboard.css";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import useDomains from "../../Auth/AcceptInvitation/hooks/data/useDomains";
import useAdminProductFieldsPage from "./hooks/useAdminProductFieldsPage";
import ProductAttributeDefinitionModal from "./components/ProductAttributeDefinitionModal";
import type { ProductAttributeDefinition } from "./types";

const AdminProductFieldsPage = () => {
    const page = useAdminProductFieldsPage();
    const { data: domains, isLoading: domainsLoading, isError: domainsError } = useDomains();

    const { definitions, isLoading, isError, openCreate, openEdit, toggleActive, isTogglingActive } = page;

    const definitionsByDomain = new Map<string, ProductAttributeDefinition[]>();
    for (const definition of definitions ?? []) {
        const list = definitionsByDomain.get(definition.businessDomainId) ?? [];
        list.push(definition);
        definitionsByDomain.set(definition.businessDomainId, list);
    }

    return (
        <main className="dashboard-page">
            <div className="dashboard-page-header">
                <h1 className="dashboard-heading">Product Fields</h1>
            </div>

            <p className="dashboard-table-message" style={{ textAlign: "left", padding: 0, marginBottom: 16 }}>
                These are the optional fields businesses in each domain may use on their products. Retiring a field
                doesn't affect businesses that already use it — it just stops appearing as a choice for new
                selections.
            </p>

            {domainsLoading || isLoading ? (
                <div className="dashboard-stats-loading">
                    <Spinner size={32} />
                </div>
            ) : domainsError || isError || !domains ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Failed to load product fields. Please try again.
                </p>
            ) : (
                domains.map((domain) => {
                    const domainDefinitions = (definitionsByDomain.get(domain.id) ?? []).sort(
                        (a, b) => a.displayOrder - b.displayOrder
                    );

                    return (
                        <section key={domain.id} className="dashboard-table-card">
                            <div className="dashboard-table-header">
                                <h3>{domain.name}</h3>
                                <button
                                    type="button"
                                    className="dashboard-primary-btn"
                                    onClick={() => openCreate(domain.id)}
                                >
                                    Add field
                                </button>
                            </div>

                            {domainDefinitions.length === 0 ? (
                                <p className="dashboard-table-message">No product fields defined for this domain yet.</p>
                            ) : (
                                <div className="dashboard-table-wrapper">
                                    <table className="dashboard-table">
                                        <thead>
                                            <tr>
                                                <th>Key</th>
                                                <th>Label</th>
                                                <th>Type</th>
                                                <th>Required</th>
                                                <th>Allowed values</th>
                                                <th>Order</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {domainDefinitions.map((definition) => (
                                                <tr
                                                    key={definition.id}
                                                    className={definition.isActive ? undefined : "product-fields-inactive-row"}
                                                >
                                                    <td>{definition.key}</td>
                                                    <td>{definition.label}</td>
                                                    <td>{definition.valueType}</td>
                                                    <td>{definition.isRequired ? "Yes" : "No"}</td>
                                                    <td>
                                                        {definition.allowedValues.length > 0
                                                            ? definition.allowedValues.join(", ")
                                                            : "—"}
                                                    </td>
                                                    <td>{definition.displayOrder}</td>
                                                    <td>
                                                        <span
                                                            className={`dashboard-badge ${definition.isActive ? "dashboard-badge--user" : ""}`}
                                                        >
                                                            {definition.isActive ? "Active" : "Inactive"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="dashboard-row-actions">
                                                            <button
                                                                type="button"
                                                                className="dashboard-action-btn"
                                                                onClick={() => openEdit(definition)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="dashboard-action-btn"
                                                                onClick={() => toggleActive(definition)}
                                                                disabled={isTogglingActive}
                                                            >
                                                                {definition.isActive ? "Deactivate" : "Reactivate"}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    );
                })
            )}

            <ProductAttributeDefinitionModal page={page} />
        </main>
    );
};

export default AdminProductFieldsPage;
