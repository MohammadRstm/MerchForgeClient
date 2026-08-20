import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBusinessMemberService } from "../../../../../services/api/businessDashboard.api";
import type { CreateBusinessMemberPayload } from "../../types";

const useCreateBusinessMember = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateBusinessMemberPayload) =>
            createBusinessMemberService(businessId, payload),

        onSuccess: () => {
            // The team table obviously, but also the stats: member count and the
            // team-by-role breakdown both just changed.
            queryClient.invalidateQueries({ queryKey: ["business-dashboard"] });
        },
    });
};

export default useCreateBusinessMember;
