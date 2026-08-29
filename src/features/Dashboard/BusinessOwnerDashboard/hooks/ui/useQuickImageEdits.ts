import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { editProductImageService } from "../../../../../services/api/imageEditing.api";
import { describeAiChatError } from "../../utils/describeAiChatError";
import { FEATURE_KEY_AI_IMAGE_EDITING } from "../../constants/featureKeys";
import { QUICK_IMAGE_EDIT_ACTIONS, type QuickImageEditKey } from "../../constants/quickImageEdits";
import useFeatureCreditBalance from "../data/useFeatureCreditBalance";

export type QuickImageEditResult = {
    url: string;
    status: "pending" | "done" | "error";
    error?: string;
};

type UseQuickImageEditsArgs = {
    replaceImage: (oldUrl: string, newUrl: string) => void;
};

/**
 * "Remove background" / "Enhance photo" — a fixed one-click instruction applied
 * to whichever images the owner picks, reusing the *real* gallery's own
 * select-tiles interaction (the same one useImageEditChat drives) rather than an
 * abstract picker modal, since there's nothing to describe here, only images to
 * choose. Once confirmed, every selected image is sent to Gemini concurrently
 * (same no-inter-awaiting model as useMultiAngleImages/useColorImages) and each
 * result replaces that exact image in place — this edits existing photos, it
 * doesn't generate new variants, so there's no "swap the gallery" step needed.
 */
const useQuickImageEdits = (businessId: string, { replaceImage }: UseQuickImageEditsArgs) => {
    const [actionKey, setActionKey] = useState<QuickImageEditKey | undefined>(undefined);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
    const [results, setResults] = useState<QuickImageEditResult[] | undefined>(undefined);
    const [isGenerating, setIsGenerating] = useState(false);

    const queryClient = useQueryClient();

    const invalidateFeatureCredits = () =>
        queryClient.invalidateQueries({ queryKey: ["business-dashboard", "features", businessId] });

    const { creditsRemaining, creditsGrantedTotal, includedInPlan } = useFeatureCreditBalance(
        businessId,
        FEATURE_KEY_AI_IMAGE_EDITING
    );
    const outOfCredits = !includedInPlan && creditsRemaining !== undefined && creditsRemaining <= 0;

    const open = (key: QuickImageEditKey) => {
        setActionKey(key);
        setIsSelecting(true);
        setSelectedUrls(new Set());
        setResults(undefined);
    };

    const close = () => {
        if (isGenerating) return;

        setIsSelecting(false);
        setActionKey(undefined);
        setSelectedUrls(new Set());
        setResults(undefined);
    };

    const toggleSelect = (url: string) => {
        setSelectedUrls((prev) => {
            const next = new Set(prev);
            if (next.has(url)) {
                next.delete(url);
            } else {
                next.add(url);
            }
            return next;
        });
    };

    const confirm = () => {
        if (!actionKey || selectedUrls.size === 0 || isGenerating || outOfCredits) return;

        const urls = Array.from(selectedUrls);
        const prompt = QUICK_IMAGE_EDIT_ACTIONS[actionKey].prompt;

        setIsGenerating(true);
        setIsSelecting(false);
        setResults(urls.map((url) => ({ url, status: "pending" })));

        let settledCount = 0;

        urls.forEach((url) => {
            editProductImageService(businessId, { imageUrl: url, prompt })
                .then((job) => {
                    invalidateFeatureCredits();

                    if (!job.outputImageUrl) {
                        throw new Error("The AI didn't return an image.");
                    }

                    replaceImage(url, job.outputImageUrl);

                    setResults((prev) =>
                        prev?.map((result) => (result.url === url ? { ...result, status: "done" } : result))
                    );
                })
                .catch((e) => {
                    setResults((prev) =>
                        prev?.map((result) =>
                            result.url === url
                                ? { ...result, status: "error", error: describeAiChatError(e, "Couldn't update this image.") }
                                : result
                        )
                    );
                })
                .finally(() => {
                    settledCount += 1;
                    if (settledCount === urls.length) setIsGenerating(false);
                });
        });
    };

    const processingImageUrls = new Set(
        (results ?? []).filter((result) => result.status === "pending").map((result) => result.url)
    );

    return {
        isOpen: isSelecting || Boolean(results),
        isSelecting,
        actionKey,
        open,
        selectedUrls,
        toggleSelect,

        results,
        isGenerating,
        processingImageUrls,
        confirm,
        close,

        creditsRemaining,
        creditsGrantedTotal,
        includedInPlan,
        outOfCredits,
    };
};

export default useQuickImageEdits;
