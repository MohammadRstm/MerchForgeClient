import { useState } from "react";
import { describeAiChatError } from "../../utils/describeAiChatError";
import { FEATURE_KEY_AI_IMAGE_EDITING } from "../../constants/featureKeys";
import useEditProductImage from "../data/useEditProductImage";
import useFeatureCreditBalance from "../data/useFeatureCreditBalance";
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
    /** Which selected image the current request is for — the others are still queued, not yet started. */
    const [processingUrl, setProcessingUrl] = useState<string | undefined>(undefined);

    const editImage = useEditProductImage(businessId);

    const describeError = describeAiChatError;

    const { creditsRemaining, creditsGrantedTotal, includedInPlan } = useFeatureCreditBalance(
        businessId,
        FEATURE_KEY_AI_IMAGE_EDITING
    );
    const outOfCredits = !includedInPlan && creditsRemaining !== undefined && creditsRemaining <= 0;

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
        setProcessingUrl(undefined);
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

        if (outOfCredits) {
            setError("You're out of AI image-editing credits. Buy more from Features to continue.");
            return;
        }

        setMessageInput("");
        setError(undefined);
        setIsProcessing(true);
        setProgress({ done: 0, total: urls.length });

        // Shown the instant the owner submits, not once the first edit comes back —
        // otherwise the message reads as though it never sent until the AI answers.
        // For a typed instruction this is already the final text; for voice it's a
        // placeholder, patched below with the real transcript once it's known.
        setMessages((prev) => [
            ...prev,
            { role: "user", text: text ?? "Voice message…", kind: audio ? "voice" : "text" },
        ]);

        const replacements: ImageReplacement[] = [];
        let resolvedText = text;
        let transcriptApplied = !audio;
        let failureCount = 0;

        for (const url of urls) {
            setProcessingUrl(url);

            try {
                const job = await editImage.mutateAsync({
                    imageUrl: url,
                    prompt: resolvedText,
                    audio: resolvedText ? undefined : audio,
                });

                resolvedText = job.prompt;

                if (!transcriptApplied) {
                    const transcript = job.prompt;
                    setMessages((prev) => {
                        const lastUserIndex = prev.map((m) => m.role).lastIndexOf("user");
                        if (lastUserIndex === -1) return prev;

                        const next = [...prev];
                        next[lastUserIndex] = { ...next[lastUserIndex], text: transcript };
                        return next;
                    });
                    transcriptApplied = true;
                }

                if (job.outputImageUrl) {
                    replacements.push({ oldUrl: url, newUrl: job.outputImageUrl });
                }
            } catch (e) {
                failureCount += 1;
                setError(describeError(e, "Couldn't edit one of the images."));
            }

            setProgress((prev) => (prev ? { ...prev, done: prev.done + 1 } : undefined));
        }

        setIsProcessing(false);
        setProgress(undefined);
        setProcessingUrl(undefined);
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
        processingUrl,
        error,
        voice,

        creditsRemaining,
        creditsGrantedTotal,
        includedInPlan,
        outOfCredits,
    };
};

export default useImageEditChat;
