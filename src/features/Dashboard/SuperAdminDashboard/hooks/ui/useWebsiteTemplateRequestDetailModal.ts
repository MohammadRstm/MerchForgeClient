import { useState } from "react";
import useWebsiteTemplateRequestDetail from "../data/useWebsiteTemplateRequestDetail";
import useStartWebsiteTemplateRequestBuild from "../data/useStartWebsiteTemplateRequestBuild";
import useCloseWebsiteTemplateRequest from "../data/useCloseWebsiteTemplateRequest";
import { closeWebsiteTemplateRequestFormSchema } from "../../validation";
import { ApiError } from "../../../../../Error/ApiError";

/**
 * Owns which request (if any) is open in the detail modal, plus the Start Build /
 * Close Request actions for it. finalWebsiteUrl is local form state, not committed
 * until Close Request is actually submitted.
 */
const useWebsiteTemplateRequestDetailModal = () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [finalWebsiteUrl, setFinalWebsiteUrl] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { data: request, isLoading, isError } = useWebsiteTemplateRequestDetail(selectedId);
    const { mutate: startBuild, isPending: isStartingBuild } = useStartWebsiteTemplateRequestBuild(selectedId ?? "");
    const { mutate: closeRequest, isPending: isClosing } = useCloseWebsiteTemplateRequest(selectedId ?? "");

    const open = (requestId: string) => {
        setSelectedId(requestId);
        setFinalWebsiteUrl("");
        setError(null);
    };

    const close = () => {
        if (isStartingBuild || isClosing) {
            return;
        }

        setSelectedId(null);
    };

    const handleStartBuild = () => {
        startBuild(undefined, {
            onError: (err) => {
                setError(err instanceof ApiError ? err.message : "Couldn't start the build. Please try again.");
            },
        });
    };

    const submitClose = () => {
        const result = closeWebsiteTemplateRequestFormSchema.safeParse({ finalWebsiteUrl });

        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        closeRequest(result.data, {
            onError: (err) => {
                setError(err instanceof ApiError ? err.message : "Couldn't close the request. Please try again.");
            },
        });
    };

    return {
        isOpen: !!selectedId,
        request,
        isLoading,
        isError,

        finalWebsiteUrl,
        setFinalWebsiteUrl,
        error,
        isStartingBuild,
        isClosing,

        open,
        close,
        handleStartBuild,
        submitClose,
    };
};

export default useWebsiteTemplateRequestDetailModal;
