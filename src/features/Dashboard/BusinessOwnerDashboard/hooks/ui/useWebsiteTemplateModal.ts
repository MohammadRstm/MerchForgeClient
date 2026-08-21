import { useState } from "react";
import useWebsiteTemplateStatus from "../data/useWebsiteTemplateStatus";
import useChooseWebsiteTemplate from "../data/useChooseWebsiteTemplate";
import { ApiError } from "../../../../../Error/ApiError";

/**
 * Drives both the "Choose a website template" button (shown only while `chosen` is
 * null) and the picker modal it opens. There is deliberately no local "hasChosen"
 * state — status always comes from the server, so a second tab choosing first is
 * reflected here on next fetch rather than silently disagreeing with it.
 */
const useWebsiteTemplateModal = (businessId: string) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { data: status, isLoading, isError } = useWebsiteTemplateStatus(businessId);
    const { mutate, isPending } = useChooseWebsiteTemplate(businessId);

    const open = () => {
        setSelectedId(null);
        setError(null);
        setIsOpen(true);
    };

    const close = () => {
        if (isPending) {
            return;
        }

        setIsOpen(false);
    };

    const select = (templateId: string) => setSelectedId(templateId);

    const confirm = () => {
        if (!selectedId) {
            setError("Pick a template first.");
            return;
        }

        mutate(selectedId, {
            onSuccess: () => setIsOpen(false),
            onError: (err) => {
                setError(err instanceof ApiError ? err.message : "Couldn't save that choice. Please try again.");
            },
        });
    };

    return {
        status,
        isLoading,
        isError,

        isOpen,
        selectedId,
        error,
        isPending,

        open,
        close,
        select,
        confirm,
    };
};

export default useWebsiteTemplateModal;
