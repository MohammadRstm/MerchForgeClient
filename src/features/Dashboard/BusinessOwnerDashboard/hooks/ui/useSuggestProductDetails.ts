import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { suggestProductDetailsService } from "../../../../../services/api/imageSuggestion.api";
import { describeAiChatError } from "../../utils/describeAiChatError";
import { applyAiDraftToForm, type DraftFieldKey } from "../../utils/applyAiDraftToForm";
import { FEATURE_KEY_AI_IMAGE_EDITING } from "../../constants/featureKeys";
import useFeatureCreditBalance from "../data/useFeatureCreditBalance";
import type { ProductFormField, ProductFormImage } from "../../types";

type UseSuggestProductDetailsArgs = {
    images: ProductFormImage[];
};

/** Every key the draft actually filled — nothing to toggle for a field left null. */
const filledFieldKeys = (draft: {
    title: string | null;
    description: string | null;
    price: number | null;
    compareAtPrice: number | null;
    categoryId: string | null;
    sku: string | null;
    stockQuantity: number | null;
    tags: string[];
    saleEndsAt: string | null;
    metadata: Record<string, unknown> | null;
}): Set<DraftFieldKey> => {
    const keys: DraftFieldKey[] = [];

    if (draft.title != null) keys.push("title");
    if (draft.description != null) keys.push("description");
    if (draft.price != null) keys.push("price");
    if (draft.compareAtPrice != null) keys.push("compareAtPrice");
    if (draft.categoryId != null) keys.push("categoryId");
    if (draft.sku != null) keys.push("sku");
    if (draft.stockQuantity != null) keys.push("stockQuantity");
    if (draft.tags.length > 0) keys.push("tags");
    if (draft.saleEndsAt != null) keys.push("saleEndsAt");
    if (draft.metadata != null && Object.keys(draft.metadata).length > 0) keys.push("metadata");

    return new Set(keys);
};

/**
 * "Suggest details from photo" — one-shot, no picking phase (there's only ever
 * the main image to look at). Unlike the voice draft flow, which mirrors fields
 * into the form the instant the agent reveals them, this shows what the AI found
 * and waits for an explicit Apply click: a single photo guess is less reliable
 * than a multi-turn conversation, and applying it silently could clobber text the
 * owner already typed.
 */
const useSuggestProductDetails = (businessId: string, { images }: UseSuggestProductDetailsArgs) => {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
    const [suggestion, setSuggestion] = useState<Awaited<ReturnType<typeof suggestProductDetailsService>> | undefined>(
        undefined
    );
    const [selectedFields, setSelectedFields] = useState<Set<DraftFieldKey>>(new Set());
    const [error, setError] = useState<string | undefined>(undefined);

    const queryClient = useQueryClient();

    const invalidateFeatureCredits = () =>
        queryClient.invalidateQueries({ queryKey: ["business-dashboard", "features", businessId] });

    const { creditsRemaining, creditsGrantedTotal, includedInPlan } = useFeatureCreditBalance(
        businessId,
        FEATURE_KEY_AI_IMAGE_EDITING
    );

    const mainImage = images.find((image) => image.isMain);

    const open = () => {
        setIsOpen(true);
        setSuggestion(undefined);
        setSelectedFields(new Set());
        setError(undefined);

        if (!mainImage) return;

        setStatus("working");

        suggestProductDetailsService(businessId, { imageUrl: mainImage.url })
            .then((result) => {
                invalidateFeatureCredits();
                setSuggestion(result);
                setSelectedFields(filledFieldKeys(result));
                setStatus("done");
            })
            .catch((e) => {
                setError(describeAiChatError(e, "Couldn't read that photo."));
                setStatus("error");
            });
    };

    const close = () => {
        setIsOpen(false);
        setStatus("idle");
        setSuggestion(undefined);
        setSelectedFields(new Set());
        setError(undefined);
    };

    const toggleField = (key: DraftFieldKey) => {
        setSelectedFields((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const apply = (
        fields: ProductFormField[],
        callbacks: Parameters<typeof applyAiDraftToForm>[2]
    ) => {
        if (!suggestion) return;

        applyAiDraftToForm(suggestion, fields, callbacks, selectedFields);
        close();
    };

    return {
        isOpen,
        open,
        close,

        hasMainImage: Boolean(mainImage),
        status,
        suggestion,
        selectedFields,
        toggleField,
        error,
        apply,

        creditsRemaining,
        creditsGrantedTotal,
        includedInPlan,
    };
};

export default useSuggestProductDetails;
