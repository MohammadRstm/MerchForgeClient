import { useState } from "react";
import { ApiError } from "../../../../../Error/ApiError";
import useEditProductImage from "../data/useEditProductImage";
import useVoiceRecorder from "./useVoiceRecorder";

export type ImageEditChatMessage = {
    role: "user" | "assistant";
    text: string;
    kind: "text" | "voice";
};

export type ImageReplacement = { oldUrl: string; newUrl: string };

/**
 * Selecting images and describing an edit, styled like the "Fill with AI" chat but
 * fundamentally simpler underneath: there is no multi-turn conversation with the
 * backend, just one edit call per selected image. The message log below is built
 * client-side purely for a consistent look — nothing here is resumable.
 *
 * Gemini returns one output image per call, which is what forces the loop: editing
 * three selected photos independently means three requests, not one request naming
 * three images (that would fuse them into a single combined image instead).
 */
const useImageEditChat = (businessId: string, onImagesReplaced: (replacements: ImageReplacement[]) => void) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
    const [messages, setMessages] = useState<ImageEditChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [error, setError] = useState<string | undefined>(undefined);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState<{ done: number; total: number } | undefined>(undefined);

    const editImage = useEditProductImage(businessId);

    const describeError = (e: unknown, fallback: string) =>
        e instanceof ApiError ? e.message : fallback;

    const open = () => {
        setIsOpen(true);
        setSelectedUrls(new Set());
        setError(undefined);
        setMessages([
            {
                role: "assistant",
                text: "Select the image or images you want to change below, then describe the edit.",
                kind: "text",
            },
        ]);
    };

    const close = () => {
        if (isProcessing) return;

        setIsOpen(false);
        setSelectedUrls(new Set());
        setMessages([]);
        setMessageInput("");
        setError(undefined);
        setProgress(undefined);
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

    /**
     * Runs one instruction against every selected image, one request per image.
     * Audio is only ever sent on the first call — its transcript comes back on the
     * job and is reused as plain text for the rest, so a shared voice instruction
     * isn't re-transcribed (and doesn't risk transcribing slightly differently)
     * once per image.
     */
    const submit = async (text: string | undefined, audio: Blob | undefined) => {
        const urls = Array.from(selectedUrls);

        if (urls.length === 0) {
            setError("Select at least one image first.");
            return;
        }

        if (!text && !audio) return;

        setMessageInput("");
        setError(undefined);
        setIsProcessing(true);
        setProgress({ done: 0, total: urls.length });

        const replacements: ImageReplacement[] = [];
        let resolvedText = text;
        let userBubbleShown = false;
        let failureCount = 0;

        for (const url of urls) {
            try {
                const job = await editImage.mutateAsync({
                    imageUrl: url,
                    prompt: resolvedText,
                    audio: resolvedText ? undefined : audio,
                });

                resolvedText = job.prompt;

                if (!userBubbleShown) {
                    setMessages((prev) => [
                        ...prev,
                        { role: "user", text: job.prompt, kind: audio ? "voice" : "text" },
                    ]);
                    userBubbleShown = true;
                }

                if (job.outputImageUrl) {
                    replacements.push({ oldUrl: url, newUrl: job.outputImageUrl });
                }
            } catch (e) {
                failureCount += 1;

                if (!userBubbleShown) {
                    setMessages((prev) => [
                        ...prev,
                        { role: "user", text: text ?? "Voice instruction", kind: audio ? "voice" : "text" },
                    ]);
                    userBubbleShown = true;
                }

                setError(describeError(e, "Couldn't edit one of the images."));
            }

            setProgress((prev) => (prev ? { ...prev, done: prev.done + 1 } : undefined));
        }

        setIsProcessing(false);
        setProgress(undefined);
        setSelectedUrls(new Set());

        if (replacements.length > 0) {
            onImagesReplaced(replacements);
        }

        setMessages((prev) => [
            ...prev,
            {
                role: "assistant",
                text:
                    failureCount === 0
                        ? `Done — updated ${replacements.length} image${replacements.length === 1 ? "" : "s"}.`
                        : `Updated ${replacements.length} of ${urls.length} image${urls.length === 1 ? "" : "s"}.`,
                kind: "text",
            },
        ]);
    };

    const sendMessage = () => {
        const text = messageInput.trim();
        if (!text) return;

        submit(text, undefined);
    };

    const voice = useVoiceRecorder((audio) => submit(undefined, audio));

    return {
        isOpen,
        open,
        close,

        selectedUrls,
        toggleSelect,

        messages,
        messageInput,
        setMessageInput,
        sendMessage,

        isProcessing,
        progress,
        error,
        voice,
    };
};

export default useImageEditChat;
