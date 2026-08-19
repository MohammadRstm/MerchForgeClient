import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    attachProductDraftImageService,
    cancelProductDraftService,
    confirmProductDraftService,
    resolveProductDraftImageService,
    sendProductDraftMessageService,
    sendProductDraftVoiceService,
    startProductDraftService,
} from "../../../../../services/api/productDrafts.api";
import type { ProductDraft } from "../../types";

/**
 * Server state for one AI conversation.
 *
 * Every call is a mutation rather than a query: each one advances the conversation,
 * so there is nothing to poll or refetch — the response *is* the new state, and the
 * caller stores it. Modelling the chat as a query would mean re-running turns.
 */
const useProductDraft = (businessId: string, onDraftUpdated: (draft: ProductDraft) => void) => {
    const queryClient = useQueryClient();

    const start = useMutation({
        mutationFn: () => startProductDraftService(businessId),
        onSuccess: onDraftUpdated,
    });

    const sendMessage = useMutation({
        mutationFn: ({ draftId, message }: { draftId: string; message: string }) =>
            sendProductDraftMessageService(businessId, draftId, message),
        onSuccess: onDraftUpdated,
    });

    const sendVoice = useMutation({
        mutationFn: ({ draftId, audio }: { draftId: string; audio: Blob }) =>
            sendProductDraftVoiceService(businessId, draftId, audio),
        onSuccess: onDraftUpdated,
    });

    const attachImage = useMutation({
        mutationFn: ({ draftId, file }: { draftId: string; file: File }) =>
            attachProductDraftImageService(businessId, draftId, file),
        onSuccess: onDraftUpdated,
    });

    const resolveImage = useMutation({
        mutationFn: ({ draftId, approved }: { draftId: string; approved: boolean }) =>
            resolveProductDraftImageService(businessId, draftId, approved),
        onSuccess: onDraftUpdated,
    });

    const confirm = useMutation({
        mutationFn: (draftId: string) => confirmProductDraftService(businessId, draftId),
        onSuccess: () => {
            // A product now exists, so the list, stats and category breakdown are all
            // stale — the same invalidation manual creation does.
            queryClient.invalidateQueries({ queryKey: ["business-dashboard"] });
        },
    });

    const cancel = useMutation({
        mutationFn: (draftId: string) => cancelProductDraftService(businessId, draftId),
        onSuccess: onDraftUpdated,
    });

    return { start, sendMessage, sendVoice, attachImage, resolveImage, confirm, cancel };
};

export default useProductDraft;
