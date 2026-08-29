import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { editProductImageService } from "../../../../../services/api/imageEditing.api";
import { describeAiChatError } from "../../utils/describeAiChatError";
import { FEATURE_KEY_AI_IMAGE_EDITING } from "../../constants/featureKeys";
import { MAX_COLORS, buildColorImagePrompt } from "../../constants/productColorImages";
import useFeatureCreditBalance from "../data/useFeatureCreditBalance";
import type { ProductFormImage } from "../../types";

export type ColorImageResult = {
    hex: string;
    status: "pending" | "done" | "error";
    url?: string;
    error?: string;
};

type UseColorImagesArgs = {
    images: ProductFormImage[];
    /** The product's currently chosen colors, in order — same list ColorListField edits. */
    colors: string[];
    addImage: (image: Omit<ProductFormImage, "isMain">) => void;
    replaceImage: (oldUrl: string, newUrl: string) => void;
};

/**
 * "Add images with colors" — the same one-shot, no-history generation flow as
 * useMultiAngleImages, applied to the product's own color list instead of a fixed
 * angle catalog. Colors aren't a preset to pick labels from: when there are 4 or
 * fewer, every one of them is used automatically (nothing to choose); above 4 the
 * owner picks up to MAX_COLORS, the same cap the angle flow uses.
 */
const useColorImages = (
    businessId: string,
    { images, colors, addImage, replaceImage }: UseColorImagesArgs
) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [results, setResults] = useState<ColorImageResult[] | undefined>(undefined);
    const [isGenerating, setIsGenerating] = useState(false);

    const queryClient = useQueryClient();

    const invalidateFeatureCredits = () =>
        queryClient.invalidateQueries({ queryKey: ["business-dashboard", "features", businessId] });

    const { creditsRemaining, creditsGrantedTotal, includedInPlan } = useFeatureCreditBalance(
        businessId,
        FEATURE_KEY_AI_IMAGE_EDITING
    );
    const outOfCredits = !includedInPlan && creditsRemaining !== undefined && creditsRemaining <= 0;

    const mainImage = images.find((image) => image.isMain);
    const needsPicking = colors.length > MAX_COLORS;

    const open = () => {
        setIsOpen(true);
        // 4 or fewer colors: nothing to choose, so every color starts pre-selected
        // and the modal is purely a confirmation. More than 4: the owner has to
        // actually pick, so nothing starts selected.
        setSelectedColors(needsPicking ? [] : colors);
        setResults(undefined);
    };

    const close = () => {
        if (isGenerating) return;

        setIsOpen(false);
        setSelectedColors([]);
        setResults(undefined);
    };

    const toggleColor = (hex: string) => {
        setSelectedColors((prev) => {
            if (prev.includes(hex)) return prev.filter((c) => c !== hex);
            if (prev.length >= MAX_COLORS) return prev;
            return [...prev, hex];
        });
    };

    /**
     * Same concurrency model as useMultiAngleImages.generate, and the same
     * nothing-is-ever-deleted sourcing: each requested color is paired, in order,
     * with an already-existing non-main image (uploaded or previously generated),
     * which is both the source Gemini recolors *and* the one replaced in place
     * with the result. Once existing non-main images run out, remaining colors
     * fall back to the main image as their source and are added as new images.
     * See useMultiAngleImages for the full explanation — this mirrors it exactly.
     */
    const generate = () => {
        if (!mainImage || selectedColors.length === 0 || isGenerating || outOfCredits) return;

        const targets = selectedColors.slice(0, MAX_COLORS);
        const nonMainImages = images.filter((image) => !image.isMain);

        setIsGenerating(true);
        setResults(targets.map((hex) => ({ hex, status: "pending" })));

        let settledCount = 0;

        targets.forEach((hex, index) => {
            const source = nonMainImages[index];
            const sourceUrl = source?.url ?? mainImage.url;

            editProductImageService(businessId, { imageUrl: sourceUrl, prompt: buildColorImagePrompt(hex) })
                .then((job) => {
                    invalidateFeatureCredits();

                    if (!job.outputImageUrl) {
                        throw new Error("The AI didn't return an image.");
                    }

                    if (source) {
                        replaceImage(source.url, job.outputImageUrl);
                    } else {
                        addImage({ url: job.outputImageUrl });
                    }

                    setResults((prev) =>
                        prev?.map((result) =>
                            result.hex === hex ? { ...result, status: "done", url: job.outputImageUrl! } : result
                        )
                    );
                })
                .catch((e) => {
                    setResults((prev) =>
                        prev?.map((result) =>
                            result.hex === hex
                                ? { ...result, status: "error", error: describeAiChatError(e, "Couldn't generate this color.") }
                                : result
                        )
                    );
                })
                .finally(() => {
                    settledCount += 1;
                    if (settledCount === targets.length) setIsGenerating(false);
                });
        });
    };

    return {
        isOpen,
        open,
        close,

        hasMainImage: Boolean(mainImage),
        hasColors: colors.length > 0,
        colors,
        needsPicking,
        selectedColors,
        toggleColor,

        results,
        isGenerating,
        generate,

        creditsRemaining,
        creditsGrantedTotal,
        includedInPlan,
        outOfCredits,
    };
};

export default useColorImages;
