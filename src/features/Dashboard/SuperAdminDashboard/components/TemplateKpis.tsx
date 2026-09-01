import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import StatCards from "../../../../components/DashboardWidgets/StatCards";
import type { TemplateStatsResponse } from "../types";

type TemplateKpisProps = {
    stats?: TemplateStatsResponse;
    isLoading: boolean;
    isError: boolean;
};

const TemplateKpis = ({ stats, isLoading, isError }: TemplateKpisProps) => {
    if (isLoading) {
        return (
            <div className="dashboard-stats-loading">
                <Spinner size={24} />
            </div>
        );
    }

    if (isError || !stats) {
        return (
            <p className="dashboard-table-message dashboard-table-message--error">
                Unable to load template statistics.
            </p>
        );
    }

    return (
        <StatCards
            cards={[
                { label: "Total Templates", value: stats.totalTemplates },
                { label: "Active Templates", value: stats.activeTemplates },
                { label: "Inactive Templates", value: stats.inactiveTemplates },
                { label: "Businesses Using Templates", value: stats.businessesUsingTemplates },
                {
                    label: "Most Used Template",
                    value: stats.mostUsedTemplateName
                        ? `${stats.mostUsedTemplateName} (${stats.mostUsedTemplateBusinessCount})`
                        : "—",
                },
                { label: "Pending Template Requests", value: stats.pendingTemplateRequests },
            ]}
        />
    );
};

export default TemplateKpis;
