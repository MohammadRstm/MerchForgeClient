import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../../../components/Pagination/Pagination";
import type { PagedResult } from "../../../../types/pagination";
import useDomains from "../../../Auth/AcceptInvitation/hooks/data/useDomains";
import TemplateCard from "./TemplateCard";
import type useTemplatesGridState from "../hooks/ui/useTemplatesGridState";
import type { WebsiteTemplateResponse, WebsiteTemplateSortField } from "../types";

type TemplatesGridProps = {
    templatesPage?: PagedResult<WebsiteTemplateResponse>;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    gridState: ReturnType<typeof useTemplatesGridState>;
    onAdd: () => void;
    onOpenTemplate: (templateId: string) => void;
};

const SORT_OPTIONS: { field: WebsiteTemplateSortField; label: string }[] = [
    { field: "DisplayOrder", label: "Display Order" },
    { field: "Name", label: "Name" },
    { field: "CreatedAt", label: "Date Created" },
    { field: "BusinessesUsingIt", label: "Businesses Using" },
    { field: "RequestCount", label: "Website Requests" },
];

const TemplatesGrid = ({
    templatesPage,
    isLoading,
    isFetching,
    isError,
    gridState,
    onAdd,
    onOpenTemplate,
}: TemplatesGridProps) => {
    const { data: domains } = useDomains();

    const {
        query,
        searchInput,
        businessDomainId,
        isActive,
        hasBusinesses,
        isCustomizable,
        hasActiveFilters,
        handleSearchChange,
        handleDomainChange,
        handleActiveChange,
        handleHasBusinessesChange,
        handleIsCustomizableChange,
        handleSortChange,
        clearFilters,
        setPage,
    } = gridState;

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Templates</h3>
                <button type="button" className="dashboard-primary-btn" onClick={onAdd}>
                    + Add Template
                </button>
            </div>

            <div className="dashboard-table-controls">
                <input
                    type="text"
                    className="dashboard-search-input"
                    placeholder="Search by name or domain..."
                    value={searchInput}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />

                <select
                    className="dashboard-filter-select"
                    value={businessDomainId ?? ""}
                    onChange={(e) => handleDomainChange(e.target.value)}
                >
                    <option value="">All domains</option>
                    {domains?.map((domain) => (
                        <option key={domain.id} value={domain.id}>
                            {domain.name}
                        </option>
                    ))}
                </select>

                <select
                    className="dashboard-filter-select"
                    value={isActive === undefined ? "" : String(isActive)}
                    onChange={(e) => handleActiveChange(e.target.value === "" ? undefined : e.target.value === "true")}
                >
                    <option value="">All statuses</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>

                <select
                    className="dashboard-filter-select"
                    value={hasBusinesses === undefined ? "" : String(hasBusinesses)}
                    onChange={(e) => handleHasBusinessesChange(e.target.value === "" ? undefined : e.target.value === "true")}
                >
                    <option value="">All usage</option>
                    <option value="true">Used</option>
                    <option value="false">Unused</option>
                </select>

                <select
                    className="dashboard-filter-select"
                    value={isCustomizable === undefined ? "" : String(isCustomizable)}
                    onChange={(e) => handleIsCustomizableChange(e.target.value === "" ? undefined : e.target.value === "true")}
                >
                    <option value="">All customization</option>
                    <option value="true">Customizable</option>
                    <option value="false">Non-customizable</option>
                </select>

                <select
                    className="dashboard-filter-select"
                    value={query.sortBy}
                    onChange={(e) => handleSortChange(e.target.value as WebsiteTemplateSortField)}
                >
                    {SORT_OPTIONS.map((option) => (
                        <option key={option.field} value={option.field}>
                            Sort: {option.label}
                        </option>
                    ))}
                </select>

                {hasActiveFilters && (
                    <button type="button" className="dashboard-inline-link-btn" onClick={clearFilters}>
                        Clear filters
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Failed to load templates. Please try again.
                </p>
            ) : !templatesPage || templatesPage.items.length === 0 ? (
                hasActiveFilters ? (
                    <p className="dashboard-table-message">
                        No templates match your filters.{" "}
                        <button type="button" className="dashboard-inline-link-btn" onClick={clearFilters}>
                            Clear filters
                        </button>
                    </p>
                ) : (
                    <p className="dashboard-table-message">
                        No storefront templates have been created yet.{" "}
                        <button type="button" className="dashboard-inline-link-btn" onClick={onAdd}>
                            Add your first template
                        </button>
                    </p>
                )
            ) : (
                <div className="template-cards-grid" style={{ opacity: isFetching ? 0.6 : 1 }}>
                    {templatesPage.items.map((template) => (
                        <TemplateCard key={template.id} template={template} onOpen={() => onOpenTemplate(template.id)} />
                    ))}
                </div>
            )}

            <Pagination
                page={templatesPage?.page ?? 1}
                totalPages={templatesPage?.totalPages ?? 0}
                onPageChange={setPage}
            />
        </section>
    );
};

export default TemplatesGrid;
