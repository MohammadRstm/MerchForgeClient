import { useMemo, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    getBusinessProductService,
    uploadProductImageService,
} from "../../../../../services/api/businessDashboard.api";
import { ApiError } from "../../../../../Error/ApiError";
import useProductForm from "../data/useProductForm";
import useSaveProduct from "../data/useSaveProduct";
import useProductFormState from "./useProductFormState";

const useProductModal = (businessId: string) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | undefined>(undefined);
    const [imageUploading, setImageUploading] = useState(false);
    const [imageUploadError, setImageUploadError] = useState<string | undefined>(undefined);

    const { data: productForm, isLoading: productFormLoading } = useProductForm(businessId, isOpen);

    // Fetched rather than taken from the list row: the list carries only what the
    // table shows, while the form needs description, categoryId and metadata.
    const { data: editingProduct, isLoading: editingProductLoading } = useQuery({
        queryKey: ["business-dashboard", "product", businessId, editingProductId],
        queryFn: () => getBusinessProductService(businessId, editingProductId!),
        enabled: isOpen && Boolean(editingProductId),
    });

    // Memoized because this is a dependency of useProductFormState's effect. The
    // `?? []` fallback would otherwise produce a fresh array on every render, firing
    // the effect each time, setting state, and looping until React bails out — which
    // happens even with the modal closed, since this hook always runs.
    const fields = useMemo(() => productForm?.metadataFields ?? [], [productForm]);

    const { values, errors, setField, setMetadataField, validate, toPayload } =
        useProductFormState(editingProductId ? editingProduct : undefined, fields);

    const { mutate: save, isPending: isSaving, error: saveErrorRaw, reset: resetSave } = useSaveProduct(businessId);

    const openForCreate = () => {
        setEditingProductId(undefined);
        setImageUploadError(undefined);
        resetSave();
        setIsOpen(true);
    };

    const openForEdit = (productId: string) => {
        setEditingProductId(productId);
        setImageUploadError(undefined);
        resetSave();
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        setEditingProductId(undefined);
        setImageUploadError(undefined);
    };

    const uploadImage = async (file: File) => {
        setImageUploading(true);
        setImageUploadError(undefined);

        try {
            const { imageUrl } = await uploadProductImageService(businessId, file);
            setField("imageUrl", imageUrl);
        } catch (error) {
            // The server's message is specific and actionable ("Images must be 5 MB
            // or smaller", "isn't a valid image of the type it claims to be"), so
            // it's shown rather than replaced with a generic failure.
            setImageUploadError(
                error instanceof ApiError ? error.message : "Couldn't upload that image."
            );
        } finally {
            setImageUploading(false);
        }
    };

    const clearImage = () => setField("imageUrl", null);

    const submit = (e?: FormEvent) => {
        e?.preventDefault();

        if (!validate()) return;

        save(
            { productId: editingProductId, payload: toPayload() },
            { onSuccess: close }
        );
    };

    return {
        isOpen,
        isEditing: Boolean(editingProductId),

        openForCreate,
        openForEdit,
        close,

        form: fields,
        productForm,
        productFormLoading,
        editingProductLoading: Boolean(editingProductId) && editingProductLoading,

        values,
        errors,
        setField,
        setMetadataField,

        submit,
        isSaving,
        saveError:
            saveErrorRaw instanceof ApiError
                ? saveErrorRaw.message
                : saveErrorRaw
                    ? "Couldn't save the product. Please try again."
                    : undefined,

        imageUploading,
        imageUploadError,
        uploadImage,
        clearImage,
    };
};

export default useProductModal;
