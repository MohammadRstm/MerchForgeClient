import { useState } from "react";
import useUpdateOrderStatus from "../data/useUpdateOrderStatus";
import type { OrderStatus } from "../../types";

/**
 * Runs a status change across many orders by calling the same single-order endpoint
 * UpdateOrderStatus already uses, once per order — there is no bulk endpoint, and
 * none is needed: each order's own AllowedOrderStatusTransitions check on the server
 * still runs per order, so a mixed/invalid selection fails only the orders it
 * actually applies to rather than corrupting the rest.
 */
const useBulkOrderActions = (businessId: string) => {
    const { mutateAsync } = useUpdateOrderStatus(businessId);
    const [isRunning, setIsRunning] = useState(false);

    const runBulkStatusUpdate = async (orderIds: string[], status: OrderStatus) => {
        setIsRunning(true);

        const results = await Promise.allSettled(orderIds.map((orderId) => mutateAsync({ orderId, status })));

        setIsRunning(false);

        const succeeded = results.filter((r) => r.status === "fulfilled").length;
        const failed = results.length - succeeded;

        return { succeeded, failed };
    };

    return { runBulkStatusUpdate, isRunning };
};

export default useBulkOrderActions;
