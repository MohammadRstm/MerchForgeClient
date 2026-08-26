import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startWebsiteTemplateRequestBuildService } from "../../../../../services/api/dashboard.api";

const useStartWebsiteTemplateRequestBuild = (requestId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => startWebsiteTemplateRequestBuildService(requestId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "website-template-request", requestId] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "website-template-requests"] });
        },
    });
};

export default useStartWebsiteTemplateRequestBuild;
