import { useQuery } from "@tanstack/react-query";
import { getRequestedTemplatesService } from "../../../../../services/api/dashboard.api";

const useRequestedTemplates = (take = 10) => {
    return useQuery({
        queryKey: ["dashboard", "requested-templates", take],
        queryFn: () => getRequestedTemplatesService(take),
    });
};

export default useRequestedTemplates;
