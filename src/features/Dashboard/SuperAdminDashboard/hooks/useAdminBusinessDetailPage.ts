import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useDashboardBusinessDetail from "./data/useDashboardBusinessDetail";
import useRevokeBusinessSessions from "./data/useRevokeBusinessSessions";
import useBusinessMetadataShape from "./data/useBusinessMetadataShape";
import useUpdateBusinessMetadataShape from "./data/useUpdateBusinessMetadataShape";
import useDashboardProductAttributes from "./data/useDashboardProductAttributes";
import type { UpdateMetadataShapeFieldPayload } from "../types";

type FieldOverride = {
    label: string;
    isRequired: boolean;
    allowedValuesInput: string;
};

const parseAllowedValues = (input: string) =>
    input
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0);

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

    const {
        data: allDefinitions,
        isLoading: catalogueLoading,
        isError: catalogueError,
    } = useDashboardProductAttributes(businessDomainId);

    // Retired fields aren't offered for new selection, but a business that already
    // has one snapshotted still needs to see it (and be able to remove it) --
    // otherwise an admin could never un-check a field whose definition was retired
    // after this business picked it.
    const catalogue = allDefinitions?.filter(
        (d) => d.isActive || currentShape?.some((f) => f.key === d.key)
    );

    // Per included field's editable overrides, keyed by field key. Starts empty so
    // it can be seeded from the business's already-saved shape exactly once.
    const [fieldOverrides, setFieldOverrides] = useState<Map<string, FieldOverride> | null>(null);

    useEffect(() => {
        if (currentShape && fieldOverrides === null) {
            const seeded = new Map<string, FieldOverride>();

            for (const field of currentShape) {
                seeded.set(field.key, {
                    label: field.label,
                    isRequired: field.isRequired,
                    allowedValuesInput: field.allowedValues.join(", "),
                });
            }

            setFieldOverrides(seeded);
        }
    }, [currentShape, fieldOverrides]);

    const toggleKey = (key: string) => {
        setFieldOverrides((current) => {
            const next = new Map(current ?? []);

            if (next.has(key)) {
                next.delete(key);
                return next;
            }

            // Newly-included: default from the catalogue's own definition rather
            // than guessing at customization the admin hasn't specified yet.
            const definition = catalogue?.find((d) => d.key === key);

            next.set(key, {
                label: definition?.label ?? key,
                isRequired: definition?.isRequired ?? false,
                allowedValuesInput: definition?.allowedValues.join(", ") ?? "",
            });

            return next;
        });
    };

    const updateFieldOverride = <K extends keyof FieldOverride>(key: string, field: K, value: FieldOverride[K]) => {
        setFieldOverrides((current) => {
            const next = new Map(current ?? []);
            const existing = next.get(key);

            if (!existing) {
                return next;
            }

            next.set(key, { ...existing, [field]: value });
            return next;
        });
    };

    const {
        mutate: saveShape,
        isPending: isSavingShape,
        isSuccess: shapeSaved,
    } = useUpdateBusinessMetadataShape(businessId);

    const saveMetadataShape = () => {
        if (!catalogue || !fieldOverrides) {
            return;
        }

        const fields: UpdateMetadataShapeFieldPayload[] = catalogue
            .filter((attribute) => fieldOverrides.has(attribute.key))
            .map((attribute, index) => {
                const override = fieldOverrides.get(attribute.key)!;

                return {
                    key: attribute.key,
                    label: override.label.trim() || attribute.label,
                    valueType: attribute.valueType,
                    isRequired: override.isRequired,
                    allowedValues: parseAllowedValues(override.allowedValuesInput),
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
        catalogueError,
        shapeLoading,
        fieldOverrides,
        toggleKey,
        updateFieldOverride,
        saveMetadataShape,
        isSavingShape,
        shapeSaved,
    };
};

export default useAdminBusinessDetailPage;
