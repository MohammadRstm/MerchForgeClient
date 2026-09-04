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
    /** The product the generated images belong to, so they are stored under it. */
    productId: string;
    images: ProductFormImage[];
    addImage: (image: Omit<ProductFormImage, "isMain">) => void;
    replaceImage: (oldUrl: string, newUrl: string) => void;
};

/**
 * A one-shot "generate this same product from a few different angles" action —
 * no conversation, no history, nothing persisted beyond the resulting images.
 * Unlike the AI image-edit chat (which edits one image per selected photo,
 * sequentially, since each edit needs its own instruction to be composed as it
 * goes), every angle here uses a fixed, preset instruction, so all of them can be
 * requested up front and run at the same time.
 *
 * Deliberately calls editProductImageService directly rather than going through
 * useEditProductImage: that hook wraps ONE shared mutation, which only ever
 * tracks one in-flight call's status at a time — exactly wrong here, where up to
 * four calls are in flight together and each needs its own independent status.
 */
const useMultiAngleImages = (
    businessId: string,
    { productId, images, addImage, replaceImage }: UseMultiAngleImagesArgs
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
    const outOfCredits = !includedInPlan && creditsRemaining !== undefined && creditsRemaining <= 0;

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
     *
     * Nothing is ever deleted. Each requested angle is paired, in order, with an
     * already-existing non-main image (whether the owner uploaded it or a prior
     * angle/color run generated it) — that image is both the source Gemini edits
     * *and* the one that gets replaced in place with the result, so a photo
     * already carrying a color or angle change keeps carrying it forward. Once
     * existing non-main images run out, the remaining angles fall back to the
     * main image as their source and their results are added as new images —
     * the same "not enough images yet" behavior this always had. An existing
     * non-main image beyond however many angles were requested is simply left
     * alone; it wasn't needed as a source this time.
     */
    const generate = () => {
        if (!mainImage || selectedKeys.length === 0 || isGenerating || outOfCredits) return;

        const angles = PRODUCT_IMAGE_ANGLES.filter((angle) => selectedKeys.includes(angle.key));
        const nonMainImages = images.filter((image) => !image.isMain);

        setIsGenerating(true);
        setResults(angles.map((angle) => ({ key: angle.key, label: angle.label, status: "pending" })));

        let settledCount = 0;

        angles.forEach((angle, index) => {
            const source = nonMainImages[index];
            const sourceUrl = source?.url ?? mainImage.url;

            editProductImageService(businessId, {
                imageUrl: sourceUrl,
                productId,
                prompt: angle.prompt,
            })
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
        outOfCredits,
    };
};

export default useMultiAngleImages;
