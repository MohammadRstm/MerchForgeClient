import "./BusinessOwnerDashboard.css";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import StatCards from "../../../components/DashboardWidgets/StatCards";
import BreakdownPieChart from "../../../components/DashboardWidgets/BreakdownPieChart";
import GrowthBarChart from "../../../components/DashboardWidgets/GrowthBarChart";
import useBusinessOwnerDashboardPage from "./hooks/useBusinessOwnerDashboardPage";
import ProductsTable from "./components/ProductsTable";
import MembersTable from "./components/MembersTable";
import SubscriptionCard from "./components/SubscriptionCard";
import FeaturesCard from "./components/FeaturesCard";
import FeatureCreditsModal from "./components/FeatureCreditsModal";
import ProductModal from "./components/ProductModal";
import ProductDetailModal from "./components/ProductDetailModal";
import DeleteProductModal from "./components/DeleteProductModal";
import MemberModal from "./components/MemberModal";
import MemberCredentialsModal from "./components/MemberCredentialsModal";
import ChooseWebsiteTemplateModal from "./components/ChooseWebsiteTemplateModal";

const currencyFormatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
});

const BusinessOwnerDashboard = () => {
    const {
        businessName,

        stats,
        statsLoading,
        statsError,

        productsPage,
        productsLoading,
        productsFetching,
        productsError,
        productsTable,

        members,
        membersLoading,
        membersError,
        memberModal,
        websiteTemplateModal,

        subscription,
        subscriptionLoading,
        subscriptionError,

        featureCreditsModal,

        productModal,
        productDetailModal,
        editFromDetail,
        aiChat,
        openAiChat,

        productPendingDeletion,
        isDeletingProduct,
        deleteProductError,
        requestDeleteProduct,
        confirmDeleteProduct,
        cancelDeleteProduct,
    } = useBusinessOwnerDashboardPage();

    return (
        <main className="business-dashboard-page">
            <div className="business-dashboard-page-header">
                <h1 className="business-dashboard-heading">{businessName || "Business"} Dashboard</h1>

                {!websiteTemplateModal.isLoading && websiteTemplateModal.status?.chosen == null && (
                    <button type="button" className="business-dashboard-button-primary" onClick={websiteTemplateModal.open}>
                        Choose website template
                    </button>
                )}
            </div>

            {statsLoading ? (
                <div className="business-dashboard-stats-loading">
                    <Spinner size={32} />
                </div>
            ) : statsError || !stats ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Failed to load business statistics. Please try again.
                </p>
            ) : (
                <>
                    <StatCards
                        cards={[
                            { label: "Team Members", value: stats.memberCount },
                            { label: "Total Products", value: stats.productCount },
                            { label: "Product Drafts", value: stats.productDraftCount },
                            {
                                label: "Average Price",
                                value:
                                    stats.averageProductPrice != null
                                        ? currencyFormatter.format(stats.averageProductPrice)
                                        : "—",
                            },
                            { label: "Business Since", value: new Date(stats.createdAt).toLocaleDateString() },
                        ]}
                    />

                    <div className="widget-charts-grid">
                        <BreakdownPieChart
                            title="Products by Category"
                            data={stats.productsByCategory.map((entry) => ({ label: entry.key, count: entry.count }))}
                        />
                        <BreakdownPieChart
                            title="Team by Role"
                            data={stats.membersByRole.map((entry) => ({ label: entry.key, count: entry.count }))}
                        />
                        <BreakdownPieChart
                            title="Product Drafts by Status"
                            data={stats.productDraftsByStatus.map((entry) => ({ label: entry.key, count: entry.count }))}
                        />
                        <GrowthBarChart
                            title="Products Added (6mo)"
                            data={stats.productsOverTime}
                            color="#3b82f6"
                        />
                    </div>
                </>
            )}

            <SubscriptionCard
                subscription={subscription}
                isLoading={subscriptionLoading}
                isError={subscriptionError}
            />

            <FeaturesCard
                features={featureCreditsModal.features}
                isLoading={featureCreditsModal.isLoading}
                isError={featureCreditsModal.isError}
                onSelectFeature={featureCreditsModal.open}
            />

            <MembersTable
                members={members}
                isLoading={membersLoading}
                isError={membersError}
                onAddMember={memberModal.open}
            />

            <ProductsTable
                productsPage={productsPage}
                isLoading={productsLoading}
                isFetching={productsFetching}
                isError={productsError}
                tableState={productsTable}
                categories={stats?.productsByCategory.map((entry) => entry.key) ?? []}
                onAddProduct={productModal.openForCreate}
                onViewProduct={productDetailModal.open}
                onEditProduct={productModal.openForEdit}
                onDeleteProduct={requestDeleteProduct}
                deletingProductId={isDeletingProduct ? productPendingDeletion?.id : undefined}
            />

            <ProductModal modal={productModal} onFillWithAi={openAiChat} chat={aiChat} />

            <ProductDetailModal modal={productDetailModal} onEdit={editFromDetail} />

            <DeleteProductModal
                product={productPendingDeletion}
                isDeleting={isDeletingProduct}
                error={deleteProductError}
                onConfirm={confirmDeleteProduct}
                onCancel={cancelDeleteProduct}
            />

            <MemberModal modal={memberModal} />

            <ChooseWebsiteTemplateModal modal={websiteTemplateModal} />

            <FeatureCreditsModal modal={featureCreditsModal} />

            <MemberCredentialsModal
                member={memberModal.created}
                onDismiss={memberModal.dismissCreated}
            />
        </main>
    );
};

export default BusinessOwnerDashboard;
