import "./BusinessOwnerDashboard.css";
import useOwnerOrdersPage from "./hooks/useOwnerOrdersPage";
import OrdersTable from "./components/OrdersTable";
import OrderDetailModal from "./components/OrderDetailModal";

const OwnerOrdersPage = () => {
    const {
        ordersPage,
        ordersLoading,
        ordersFetching,
        ordersError,
        ordersTable,

        selectedOrderId,
        selectedOrder,
        selectedOrderLoading,
        selectedOrderError,
        viewOrder,
        closeOrder,

        isUpdatingStatus,
        isUpdatingPaymentStatus,
        updateStatusError,
        updateOrderStatus,
        updateOrderPaymentStatus,
    } = useOwnerOrdersPage();

    return (
        <main className="business-dashboard-page">
            <div className="business-dashboard-page-header">
                <h1 className="business-dashboard-heading">Orders</h1>
            </div>

            <OrdersTable
                ordersPage={ordersPage}
                isLoading={ordersLoading}
                isFetching={ordersFetching}
                isError={ordersError}
                tableState={ordersTable}
                onViewOrder={viewOrder}
            />

            <OrderDetailModal
                orderId={selectedOrderId}
                order={selectedOrder}
                isLoading={selectedOrderLoading}
                isError={selectedOrderError}
                isUpdatingStatus={isUpdatingStatus}
                isUpdatingPaymentStatus={isUpdatingPaymentStatus}
                statusError={updateStatusError}
                onUpdateStatus={updateOrderStatus}
                onUpdatePaymentStatus={updateOrderPaymentStatus}
                onClose={closeOrder}
            />
        </main>
    );
};

export default OwnerOrdersPage;
