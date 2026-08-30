import "./BusinessOwnerDashboard.css";
import useAuth from "../../../context/Auth/useAuth";
import useOwnerOrdersPage from "./hooks/useOwnerOrdersPage";
import OrderStatCards from "./components/OrderStatCards";
import NeedsAttention from "./components/NeedsAttention";
import OrdersAnalyticsSection from "./components/OrdersAnalyticsSection";
import OrdersToolbar from "./components/OrdersToolbar";
import OrderStatusTabs from "./components/OrderStatusTabs";
import BulkActionsBar from "./components/BulkActionsBar";
import OrdersTable from "./components/OrdersTable";
import OrderDetailDrawer from "./components/OrderDetailDrawer";
import CancelOrderModal from "./components/CancelOrderModal";
import OrdersPrintSummary from "./components/OrdersPrintSummary";
import { shortOrderRef } from "./utils/orderRef";

const OwnerOrdersPage = () => {
    const { session } = useAuth();
    const businessId = session?.business?.id ?? "";
    const businessName = session?.business?.name ?? "";

    const {
        stats,

        ordersPage,
        ordersLoading,
        ordersFetching,
        ordersError,
        ordersTable,

        selection,

        selectedOrderId,
        selectedOrder,
        selectedOrderLoading,
        selectedOrderError,
        viewOrder,
        closeOrder,

        orderNotes,
        orderNotesLoading,
        addOrderNote,
        isAddingNote,

        orderStatusHistory,
        orderStatusHistoryLoading,

        isUpdatingStatus,
        isUpdatingPaymentStatus,
        updateStatusError,
        updateOrderStatus,
        updateOrderPaymentStatus,
        changeOrderStatus,

        filterByStatus,
        viewPendingOrders,

        cancelTarget,
        requestCancelOrder,
        requestBulkCancel,
        dismissCancelDialog,
        confirmCancel,
        isCancelling,

        runBulkAction,
        isBulkUpdating,
        bulkActionError,

        exportCurrentFilter,
        exportSelected,
        isExporting,
    } = useOwnerOrdersPage();

    const cancelSubject =
        cancelTarget?.type === "single"
            ? `#${shortOrderRef(cancelTarget.orderId)}`
            : cancelTarget?.type === "bulk"
              ? `${cancelTarget.orderIds.length} orders`
              : undefined;

    return (
        <main className="business-dashboard-page">
            <div className="business-dashboard-page-header">
                <div>
                    <h1 className="business-dashboard-heading">Orders</h1>
                    <p className="business-dashboard-page-subtitle">Manage and track your store orders</p>
                </div>

                <div className="business-dashboard-header-actions">
                    <button
                        type="button"
                        className="business-dashboard-button-secondary"
                        disabled={isExporting}
                        onClick={exportCurrentFilter}
                    >
                        {isExporting ? "Exporting…" : "Export"}
                    </button>
                </div>
            </div>

            <OrderStatCards stats={stats} activeStatus={ordersTable.query.status} onFilterByStatus={filterByStatus} />

            <NeedsAttention stats={stats} onViewPending={viewPendingOrders} />

            <OrdersAnalyticsSection businessId={businessId} hasAnyOrders={(stats?.totalCount ?? 0) > 0} />

            <section className="business-dashboard-table-card">
                <div className="business-dashboard-table-header">
                    <h3>Orders</h3>
                </div>

                <OrdersToolbar tableState={ordersTable} />
                <OrderStatusTabs activeStatus={ordersTable.query.status} onChange={filterByStatus} />

                {bulkActionError && (
                    <p className="business-dashboard-form-error" role="alert">
                        {bulkActionError}
                    </p>
                )}

                <BulkActionsBar
                    selectedOrders={selection.selectedOrders}
                    isRunning={isBulkUpdating}
                    onRunAction={runBulkAction}
                    onCancel={requestBulkCancel}
                    onExportSelected={exportSelected}
                    onPrintSelected={() => window.print()}
                />

                <OrdersTable
                    ordersPage={ordersPage}
                    isLoading={ordersLoading}
                    isFetching={ordersFetching}
                    isError={ordersError}
                    hasActiveFilters={ordersTable.hasActiveFilters}
                    tableState={ordersTable}
                    selection={selection}
                    onViewOrder={viewOrder}
                    onChangeStatus={changeOrderStatus}
                    onRequestCancel={requestCancelOrder}
                />
            </section>

            <OrderDetailDrawer
                businessName={businessName}
                orderId={selectedOrderId}
                order={selectedOrder}
                isLoading={selectedOrderLoading}
                isError={selectedOrderError}
                statusHistory={orderStatusHistory}
                statusHistoryLoading={orderStatusHistoryLoading}
                notes={orderNotes}
                notesLoading={orderNotesLoading}
                onAddNote={addOrderNote}
                isAddingNote={isAddingNote}
                isUpdatingStatus={isUpdatingStatus}
                isUpdatingPaymentStatus={isUpdatingPaymentStatus}
                statusError={updateStatusError}
                onUpdateStatus={updateOrderStatus}
                onUpdatePaymentStatus={updateOrderPaymentStatus}
                onRequestCancel={requestCancelOrder}
                onClose={closeOrder}
            />

            <CancelOrderModal
                isOpen={Boolean(cancelTarget)}
                subject={cancelSubject}
                isCancelling={isCancelling}
                onConfirm={confirmCancel}
                onCancel={dismissCancelDialog}
            />

            <OrdersPrintSummary businessName={businessName} orders={selection.selectedOrders} />
        </main>
    );
};

export default OwnerOrdersPage;
