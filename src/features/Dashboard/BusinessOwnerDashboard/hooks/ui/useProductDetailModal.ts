import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBusinessProductService } from "../../../../../services/api/businessDashboard.api";
import useProductForm from "../data/useProductForm";

/**
 * The read-only "view everything about this product" card opened by clicking a
 * table row. Separate from useProductModal (the edit form) — viewing and editing are
 * different intents, and not every click on a row is a click to change something.
 */
const useProductDetailModal = (businessId: string) => {
    const [productId, setProductId] = useState<string | undefined>(undefined);

    const isOpen = Boolean(productId);

    const { data: product, isLoading } = useQuery({
        queryKey: ["business-dashboard", "product", businessId, productId],
        queryFn: () => getBusinessProductService(businessId, productId!),
        enabled: isOpen,
    });

    // Metadata field labels aren't on the product itself (it only stores values), so
    // the form's field definitions are fetched the same way useProductModal does.
    const { data: productForm } = useProductForm(businessId, isOpen);

    const open = (id: string) => setProductId(id);
    const close = () => setProductId(undefined);

    return {
        isOpen,
        isLoading,
        product,
        metadataFields: productForm?.metadataFields ?? [],
        open,
        close,
    };
};

export default useProductDetailModal;
