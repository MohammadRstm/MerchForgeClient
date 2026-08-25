import { useState } from "react";
import { describeAiChatError } from "../../utils/describeAiChatError";
import { FEATURE_KEY_AI_PRODUCT_GENERATION } from "../../constants/featureKeys";
import type { ProductDraft } from "../../types";
import useProductDraft from "../data/useProductDraft";
import useFeatureCreditBalance from "../data/useFeatureCreditBalance";
import useVoiceRecorder from "./useVoiceRecorder";

/**
 * All the state for the voice-only AI product draft: whether a draft is active,
 * the draft itself, and the error surface. Holds no workflow logic — what can
 * happen next is decided by the backend and read off draft.status and
 * draft.canConfirm, which ProductModal renders directly into the form.
 *
 * Voice is the only input. A merchant willing to type is equally well served by
 * the plain manual form, so there is no text-message path here or on the server.
 */
const useVoiceProductDraft = (businessId: string, onProductCreated: () => void) => {
    const [isActive, setIsActive] = useState(false);
    const [draft, setDraft] = useState<ProductDraft | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    const describeError = describeAiChatError;

    const { creditsRemaining, creditsGrantedTotal, includedInPlan } = useFeatureCreditBalance(
        businessId,
        FEATURE_KEY_AI_PRODUCT_GENERATION
    );

    const draftApi = useProductDraft(businessId, (updated) => {
        setDraft(updated);
        setError(undefined);
    });

    const voice = useVoiceRecorder((audio) => {
        if (!draft) return;

        draftApi.sendVoice.mutate(
            { draftId: draft.id, audio },
            {
                onError: (e) => setError(describeError(e, "Couldn't send that recording.")),
            }
        );
    });

    /** First press of the mic button — silently creates the draft, then starts recording. */
    const start = async () => {
        setIsActive(true);
        setError(undefined);

        draftApi.start.mutate(undefined, {
            onError: (e) => setError(describeError(e, "Couldn't start the assistant.")),
        });

        await voice.start();
    };

    const close = () => {
        setIsActive(false);
        setDraft(undefined);
        setError(undefined);
    };

    /**
     * Attaches the owner's uploaded image to the draft, but only the first time —
     * ConfirmAsync only ever uses one main image regardless, and attaching one
     * spends an AI turn (and a credit) server-side, so re-syncing on every
     * subsequent upload would silently burn credits for no benefit.
     */
    const attachImageIfFirst = (file: File) => {
        if (!draft || draft.originalImageUrl) return;

        draftApi.attachImage.mutate(
            { draftId: draft.id, file },
            { onError: (e) => setError(describeError(e, "Couldn't attach that image.")) }
        );
    };

    const resolveImage = (approved: boolean) => {
        if (!draft) return;

        draftApi.resolveImage.mutate(
            { draftId: draft.id, approved },
            { onError: (e) => setError(describeError(e, "Couldn't update the image.")) }
        );
    };

    const confirm = () => {
        if (!draft) return;

        draftApi.confirm.mutate(draft.id, {
            onSuccess: () => {
                onProductCreated();
                close();
            },
            onError: (e) => setError(describeError(e, "Couldn't create the product.")),
        });
    };

    const cancel = () => {
        if (!draft) {
            close();
            return;
        }

        draftApi.cancel.mutate(draft.id, {
            onSettled: close,
        });
    };

    const isBusy =
        draftApi.start.isPending ||
        draftApi.sendVoice.isPending ||
        draftApi.attachImage.isPending ||
        draftApi.resolveImage.isPending ||
        draftApi.confirm.isPending;

    return {
        isActive,
        start,
        close,
        cancel,

        draft,
        isStarting: draftApi.start.isPending,
        isBusy,
        isConfirming: draftApi.confirm.isPending,
        error,
        creditsRemaining,
        creditsGrantedTotal,
        includedInPlan,

        attachImageIfFirst,
        resolveImage,
        confirm,

        voice,
    };
};

export default useVoiceProductDraft;
