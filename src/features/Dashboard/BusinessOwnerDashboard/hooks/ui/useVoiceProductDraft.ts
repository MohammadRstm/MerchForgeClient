import { useEffect, useRef, useState } from "react";
import { describeAiChatError } from "../../utils/describeAiChatError";
import { FEATURE_KEY_AI_PRODUCT_GENERATION } from "../../constants/featureKeys";
import type { ProductDraft } from "../../types";
import useProductDraft from "../data/useProductDraft";
import useHasPlanFeature from "../data/useHasPlanFeature";
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

    // ai.product_generation is unlimited-by-plan-only now (no standalone credit
    // purchase), so entitlement is a plain "does the active plan include it"
    // check, not a credit balance.
    const { hasFeature: includedInPlan } = useHasPlanFeature(businessId, FEATURE_KEY_AI_PRODUCT_GENERATION);
    const outOfCredits = !includedInPlan;

    const draftApi = useProductDraft(businessId, (updated) => {
        setDraft(updated);
        setError(undefined);
    });

    // The recorder hands the finished recording to this callback from
    // MediaRecorder's own onstop event, which fires asynchronously, well after
    // the render that started it. Closing over `draft` directly would bake in
    // whatever it was at that render — undefined on a first recording, since
    // recording starts in the same tick as the draft-creation request, before it
    // has resolved. A ref sidesteps that: it's the same mutable box across every
    // render, so by the time the recording actually finishes it always reads the
    // latest draft rather than whichever one existed when recording began.
    const draftRef = useRef(draft);
    useEffect(() => {
        draftRef.current = draft;
    });

    const voice = useVoiceRecorder((audio) => {
        const currentDraft = draftRef.current;
        if (!currentDraft) return;

        draftApi.sendVoice.mutate(
            { draftId: currentDraft.id, audio },
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
        // Stops the mic and throws away whatever was recorded so far, rather
        // than letting it finish and get sent to a draft that's about to be
        // discarded — otherwise closing mid-recording would still process (and
        // spend a credit on) a turn for a conversation the owner just abandoned.
        if (voice.isRecording) voice.cancel();

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
        includedInPlan,
        outOfCredits,

        attachImageIfFirst,
        resolveImage,
        confirm,

        voice,
    };
};

export default useVoiceProductDraft;
