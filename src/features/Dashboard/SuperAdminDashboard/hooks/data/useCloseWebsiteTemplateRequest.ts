import { useMutation, useQueryClient } from "@tanstack/react-query";
import { closeWebsiteTemplateRequestService } from "../../../../../services/api/dashboard.api";
import type { CloseWebsiteTemplateRequestPayload } from "../../types";

const useCloseWebsiteTemplateRequest = (requestId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CloseWebsiteTemplateRequestPayload) => closeWebsiteTemplateRequestService(requestId, payload),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "website-template-request", requestId] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "website-template-requests"] });
        },
    });
};

export default useCloseWebsiteTemplateRequest;
