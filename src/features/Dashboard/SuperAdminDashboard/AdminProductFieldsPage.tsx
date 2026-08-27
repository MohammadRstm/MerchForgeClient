import "./SuperAdminDashboard.css";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import useDomains from "../../Auth/AcceptInvitation/hooks/data/useDomains";
import useAdminProductFieldsPage from "./hooks/useAdminProductFieldsPage";
import ProductAttributeDefinitionModal from "./components/ProductAttributeDefinitionModal";

const AdminProductFieldsPage = () => {
    const page = useAdminProductFieldsPage();
    const { data: domains } = useDomains();

    const {
        domainFilter,
        setDomainFilter,
        definitions,
        isLoading,
        isError,
        openCreate,
        openEdit,
        toggleActive,
        isTogglingActive,
    } = page;

    return (
        <main className="dashboard-page">
            <div className="dashboard-page-header">
                <h1 className="dashboard-heading">Product Fields</h1>
            </div>

            <section className="dashboard-table-card">
                <div className="dashboard-table-header">
                    <h3>Optional product fields by domain</h3>

                    <div className="product-fields-controls">
                        <select
                            className="dashboard-filter-select"
                            value={domainFilter ?? ""}
                            onChange={(e) => setDomainFilter(e.target.value || undefined)}
                        >
                            <option value="">All domains</option>
                            {domains?.map((domain) => (
                                <option key={domain.id} value={domain.id}>
                                    {domain.name}
                                </option>
                            ))}
                        </select>

                        <button type="button" className="dashboard-primary-btn" onClick={openCreate}>
                            Add field
                        </button>
                    </div>
                </div>

                <p className="dashboard-table-message" style={{ textAlign: "left", padding: 0, marginBottom: 12 }}>
                    These are the optional fields businesses in each domain may use on their products. Retiring a
                    field doesn't affect businesses that already use it — it just stops appearing as a choice for
                    new selections.
                </p>

                {isLoading ? (
                    <div className="dashboard-table-loading">
                        <Spinner size={28} />
                    </div>
                ) : isError ? (
                    <p className="dashboard-table-message dashboard-table-message--error">
                        Failed to load product fields. Please try again.
                    </p>
                ) : !definitions || definitions.length === 0 ? (
                    <p className="dashboard-table-message">No product fields defined yet.</p>
                ) : (
                    <div className="dashboard-table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Domain</th>
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
                                {definitions.map((definition) => (
                                    <tr key={definition.id} className={definition.isActive ? undefined : "product-fields-inactive-row"}>
                                        <td>{definition.domainName}</td>
                                        <td>{definition.key}</td>
                                        <td>{definition.label}</td>
                                        <td>{definition.valueType}</td>
                                        <td>{definition.isRequired ? "Yes" : "No"}</td>
                                        <td>{definition.allowedValues.length > 0 ? definition.allowedValues.join(", ") : "—"}</td>
                                        <td>{definition.displayOrder}</td>
                                        <td>
                                            <span className={`dashboard-badge ${definition.isActive ? "dashboard-badge--user" : ""}`}>
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

            <ProductAttributeDefinitionModal page={page} />
        </main>
    );
};

export default AdminProductFieldsPage;
