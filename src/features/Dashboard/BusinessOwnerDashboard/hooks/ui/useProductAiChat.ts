import { useState } from "react";
import { ApiError } from "../../../../../Error/ApiError";
import type { ProductDraft } from "../../types";
import useProductDraft from "../data/useProductDraft";
import useVoiceRecorder from "./useVoiceRecorder";

/**
 * All the UI state for the AI chat: whether it's open, the draft returned by the
 * backend, the composer, and the error surface.
 *
 * Holds no workflow logic. What can happen next is decided by the backend and read
 * off draft.status and draft.canConfirm — the component renders that rather than
 * tracking its own idea of the conversation.
 */
const useProductAiChat = (businessId: string, onProductCreated: () => void) => {
    const [isOpen, setIsOpen] = useState(false);
    const [draft, setDraft] = useState<ProductDraft | undefined>(undefined);
    const [messageInput, setMessageInput] = useState("");
    const [error, setError] = useState<string | undefined>(undefined);

    const describeError = (e: unknown, fallback: string) =>
        e instanceof ApiError ? e.message : fallback;

    const draftApi = useProductDraft(businessId, (updated) => {
        setDraft(updated);
        setError(undefined);
    });

    const voice = useVoiceRecorder((audio) => {
        if (!draft) return;

        draftApi.sendVoice.mutate(
            { draftId: draft.id, audio },
            { onError: (e) => setError(describeError(e, "Couldn't send that recording.")) }
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
    };

    const sendMessage = () => {
        const message = messageInput.trim();
        if (!draft || !message) return;

        setMessageInput("");

        draftApi.sendMessage.mutate(
            { draftId: draft.id, message },
            {
                onError: (e) => {
                    // Restored so a failed turn doesn't cost the owner what they typed.
                    setMessageInput(message);
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
