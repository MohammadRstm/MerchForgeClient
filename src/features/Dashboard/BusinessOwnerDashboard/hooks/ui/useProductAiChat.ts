import { useState } from "react";
import { describeAiChatError } from "../../utils/describeAiChatError";
import { FEATURE_KEY_AI_PRODUCT_GENERATION } from "../../constants/featureKeys";
import type { ProductDraft } from "../../types";
import useProductDraft from "../data/useProductDraft";
import useFeatureCreditBalance from "../data/useFeatureCreditBalance";
import useVoiceRecorder from "./useVoiceRecorder";

/**
 * All the UI state for the AI chat: whether it's open, the draft returned by the
 * backend, the composer, and the error surface.
 *
 * Holds no workflow logic. What can happen next is decided by the backend and read
 * off draft.status and draft.canConfirm — the component renders that rather than
 * tracking its own idea of the conversation.
 */
export type PendingChatMessage = { text: string; kind: "text" | "voice" };

const useProductAiChat = (businessId: string, onProductCreated: () => void) => {
    const [isOpen, setIsOpen] = useState(false);
    const [draft, setDraft] = useState<ProductDraft | undefined>(undefined);
    const [messageInput, setMessageInput] = useState("");
    const [error, setError] = useState<string | undefined>(undefined);
    // Echoed the instant the owner sends something, before the round trip that
    // actually adds it to draft.messages — otherwise the bubble only appears once
    // the assistant's reply comes back, which reads as the message not having sent.
    const [pendingMessage, setPendingMessage] = useState<PendingChatMessage | undefined>(undefined);

    const describeError = describeAiChatError;

    const { creditsRemaining, includedInPlan } = useFeatureCreditBalance(
        businessId,
        FEATURE_KEY_AI_PRODUCT_GENERATION
    );

    const draftApi = useProductDraft(businessId, (updated) => {
        setDraft(updated);
        setError(undefined);
    });

    const voice = useVoiceRecorder((audio) => {
        if (!draft) return;

        setPendingMessage({ text: "Voice message…", kind: "voice" });

        draftApi.sendVoice.mutate(
            { draftId: draft.id, audio },
            {
                onSuccess: () => setPendingMessage(undefined),
                onError: (e) => {
                    setPendingMessage(undefined);
                    setError(describeError(e, "Couldn't send that recording."));
                },
            }
        );
    });

    const open = () => {
        setIsOpen(true);
        setError(undefined);

        // A fresh conversation each time the chat is opened. Resuming an older draft
        // is supported by the backend (GET by id) but there is no UI for choosing one
        // yet, so starting clean is the honest behaviour rather than silently
        // reattaching to something the owner has forgotten about.
        draftApi.start.mutate(undefined, {
            onError: (e) => setError(describeError(e, "Couldn't start the assistant.")),
        });
    };

    const close = () => {
        setIsOpen(false);
        setDraft(undefined);
        setMessageInput("");
        setError(undefined);
        setPendingMessage(undefined);
    };

    const sendMessage = () => {
        const message = messageInput.trim();
        if (!draft || !message) return;

        setMessageInput("");
        setPendingMessage({ text: message, kind: "text" });

        draftApi.sendMessage.mutate(
            { draftId: draft.id, message },
            {
                onSuccess: () => setPendingMessage(undefined),
                onError: (e) => {
                    // Restored so a failed turn doesn't cost the owner what they typed.
                    setMessageInput(message);
                    setPendingMessage(undefined);
                    setError(describeError(e, "Couldn't send that message."));
                },
            }
        );
    };

    const attachImage = (file: File) => {
        if (!draft) return;

        draftApi.attachImage.mutate(
            { draftId: draft.id, file },
            { onError: (e) => setError(describeError(e, "Couldn't upload that image.")) }
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
        draftApi.sendMessage.isPending ||
        draftApi.sendVoice.isPending ||
        draftApi.attachImage.isPending ||
        draftApi.resolveImage.isPending ||
        draftApi.confirm.isPending;

    return {
        isOpen,
        open,
        close,
        cancel,

        draft,
        isStarting: draftApi.start.isPending,
        isBusy,
        isConfirming: draftApi.confirm.isPending,
        error,
        pendingMessage,
        creditsRemaining,
        includedInPlan,

        messageInput,
        setMessageInput,
        sendMessage,

        attachImage,
        resolveImage,
        confirm,

        voice,
    };
};

export default useProductAiChat;
