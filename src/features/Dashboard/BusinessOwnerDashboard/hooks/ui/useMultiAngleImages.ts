import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { editProductImageService } from "../../../../../services/api/imageEditing.api";
import { describeAiChatError } from "../../utils/describeAiChatError";
import { FEATURE_KEY_AI_IMAGE_EDITING } from "../../constants/featureKeys";
import { MAX_ANGLES, PRODUCT_IMAGE_ANGLES } from "../../constants/productImageAngles";
import useFeatureCreditBalance from "../data/useFeatureCreditBalance";
import type { ProductFormImage } from "../../types";

export type AngleResult = {
    key: string;
    label: string;
    status: "pending" | "done" | "error";
    url?: string;
    error?: string;
};

type UseMultiAngleImagesArgs = {
    images: ProductFormImage[];
    addImage: (image: Omit<ProductFormImage, "isMain">) => void;
    removeNonMainImages: () => void;
};

/**
 * A one-shot "generate this same product from a few different angles" action —
 * no conversation, no history, nothing persisted beyond the resulting images.
 * Unlike the AI image-edit chat (which edits one image per selected photo,
 * sequentially, since each edit needs its own instruction to be composed as it
 * goes), every angle here uses the *same* source image and a fixed, preset
 * instruction, so all of them can be requested up front and run at the same time.
 *
 * Deliberately calls editProductImageService directly rather than going through
 * useEditProductImage: that hook wraps ONE shared mutation, which only ever
 * tracks one in-flight call's status at a time — exactly wrong here, where up to
 * four calls are in flight together and each needs its own independent status.
 */
const useMultiAngleImages = (
    businessId: string,
    { images, addImage, removeNonMainImages }: UseMultiAngleImagesArgs
) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [results, setResults] = useState<AngleResult[] | undefined>(undefined);
    const [isGenerating, setIsGenerating] = useState(false);

    const queryClient = useQueryClient();

    // Every successful call can spend an ai.image_editing credit server-side, so
    // the balance shown elsewhere (this modal's own cost line, the Features card)
    // needs to refetch after each one settles, not just once the whole batch does.
    const invalidateFeatureCredits = () =>
        queryClient.invalidateQueries({ queryKey: ["business-dashboard", "features", businessId] });

    const { creditsRemaining, creditsGrantedTotal, includedInPlan } = useFeatureCreditBalance(
        businessId,
        FEATURE_KEY_AI_IMAGE_EDITING
    );

    const mainImage = images.find((image) => image.isMain);

    const open = () => {
        setIsOpen(true);
        setSelectedKeys([]);
        setResults(undefined);
    };

    const close = () => {
        // A batch in flight can't be abandoned mid-way — some of its calls may
        // already be about to land, and closing wouldn't stop them anyway.
        if (isGenerating) return;

        setIsOpen(false);
        setSelectedKeys([]);
        setResults(undefined);
    };

    const toggleAngle = (key: string) => {
        setSelectedKeys((prev) => {
            if (prev.includes(key)) return prev.filter((k) => k !== key);
            if (prev.length >= MAX_ANGLES) return prev;
            return [...prev, key];
        });
    };

    /**
     * Fires one call per selected angle, all in the same tick — no `await`
     * between them, which is what makes them genuinely concurrent rather than
     * one finishing before the next starts. Each call's `.then()`/`.catch()`
     * updates only its own slot in `results` the moment *that* call settles, so
     * the first image back is shown immediately rather than waiting on however
     * many of the others (or however slow the slowest one is).
     */
    const generate = () => {
        if (!mainImage || selectedKeys.length === 0 || isGenerating) return;

        const angles = PRODUCT_IMAGE_ANGLES.filter((angle) => selectedKeys.includes(angle.key));

        setIsGenerating(true);
        setResults(angles.map((angle) => ({ key: angle.key, label: angle.label, status: "pending" })));

        // Set once, right before the *first* successful angle is added — not
        // eagerly before any call runs. If every angle fails (no credits left,
        // the provider is down), the owner's existing gallery is never touched;
        // only a call that actually produced a replacement earns the swap.
        let hasSwappedGallery = false;
        let settledCount = 0;

        angles.forEach((angle) => {
            editProductImageService(businessId, { imageUrl: mainImage.url, prompt: angle.prompt })
                .then((job) => {
                    invalidateFeatureCredits();

                    if (!job.outputImageUrl) {
                        throw new Error("The AI didn't return an image.");
                    }

                    if (!hasSwappedGallery) {
                        hasSwappedGallery = true;
                        removeNonMainImages();
                    }

                    addImage({ url: job.outputImageUrl });

                    setResults((prev) =>
                        prev?.map((result) =>
                            result.key === angle.key
                                ? { ...result, status: "done", url: job.outputImageUrl! }
                                : result
                        )
                    );
                })
                .catch((e) => {
                    setResults((prev) =>
                        prev?.map((result) =>
                            result.key === angle.key
                                ? {
                                      ...result,
                                      status: "error",
                                      error: describeAiChatError(e, "Couldn't generate this angle."),
                                  }
                                : result
                        )
                    );
                })
                .finally(() => {
                    settledCount += 1;
                    if (settledCount === angles.length) setIsGenerating(false);
                });
        });
    };

    return {
        isOpen,
        open,
        close,

        hasMainImage: Boolean(mainImage),
        selectedKeys,
        toggleAngle,

        results,
        isGenerating,
        generate,

        creditsRemaining,
        creditsGrantedTotal,
        includedInPlan,
    };
};

export default useMultiAngleImages;
