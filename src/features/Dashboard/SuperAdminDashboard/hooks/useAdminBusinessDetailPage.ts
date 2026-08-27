import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useDashboardBusinessDetail from "./data/useDashboardBusinessDetail";
import useRevokeBusinessSessions from "./data/useRevokeBusinessSessions";
import useBusinessMetadataShape from "./data/useBusinessMetadataShape";
import useUpdateBusinessMetadataShape from "./data/useUpdateBusinessMetadataShape";
import { getDomainProductAttributesService } from "../../../../services/api/domains.api";
import type { UpdateMetadataShapeFieldPayload } from "../types";

const useAdminBusinessDetailPage = () => {
    const { businessId = "" } = useParams<{ businessId: string }>();

    const { data: business, isLoading, isError } = useDashboardBusinessDetail(businessId);

    const [revokeConfirmOpen, setRevokeConfirmOpen] = useState(false);
    const {
        mutate: revokeSessions,
        isPending: isRevoking,
        data: revokeResult,
        reset: resetRevoke,
    } = useRevokeBusinessSessions(businessId);

    const businessDomainId = business?.businessDomainId ?? undefined;

    const { data: currentShape, isLoading: shapeLoading } = useBusinessMetadataShape(businessId, !!business);

    const { data: catalogue, isLoading: catalogueLoading } = useQuery({
        queryKey: ["domain-product-attributes", businessDomainId],
        queryFn: () => getDomainProductAttributesService(businessDomainId!),
        enabled: !!businessDomainId,
    });

    // Starts null so the "which keys are checked" state can be seeded from the
    // business's already-saved shape exactly once, the first time it loads.
    const [selectedKeys, setSelectedKeys] = useState<Set<string> | null>(null);

    useEffect(() => {
        if (currentShape && selectedKeys === null) {
            setSelectedKeys(new Set(currentShape.map((field) => field.key)));
        }
    }, [currentShape, selectedKeys]);

    const toggleKey = (key: string) => {
        setSelectedKeys((current) => {
            const next = new Set(current ?? []);

            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }

            return next;
        });
    };

    const {
        mutate: saveShape,
        isPending: isSavingShape,
        isSuccess: shapeSaved,
        reset: resetShapeSave,
    } = useUpdateBusinessMetadataShape(businessId);

    const saveMetadataShape = () => {
        if (!catalogue || !selectedKeys) {
            return;
        }

        // Fields already in the business's shape keep whatever label/required/
        // allowed-values they already have; newly-checked fields start from the
        // domain catalogue's defaults (free-form, not required) rather than
        // guessing at customization the admin hasn't specified.
        const existingByKey = new Map((currentShape ?? []).map((field) => [field.key, field]));

        const fields: UpdateMetadataShapeFieldPayload[] = catalogue
            .filter((attribute) => selectedKeys.has(attribute.key))
            .map((attribute, index) => {
                const existing = existingByKey.get(attribute.key);

                return {
                    key: attribute.key,
                    label: existing?.label ?? attribute.label,
                    valueType: attribute.valueType,
                    isRequired: existing?.isRequired ?? false,
                    allowedValues: existing?.allowedValues ?? [],
                    displayOrder: index,
                };
            });

        saveShape(fields);
    };

    return {
        businessId,
        business,
        isLoading,
        isError,

        revokeConfirmOpen,
        openRevokeConfirm: () => {
            resetRevoke();
            setRevokeConfirmOpen(true);
        },
        closeRevokeConfirm: () => setRevokeConfirmOpen(false),
        confirmRevoke: () => revokeSessions(),
        isRevoking,
        revokeResult,

        catalogue,
        catalogueLoading,
        shapeLoading,
        selectedKeys,
        toggleKey,
        saveMetadataShape,
        isSavingShape,
        shapeSaved,
        resetShapeSave,
    };
};

export default useAdminBusinessDetailPage;
