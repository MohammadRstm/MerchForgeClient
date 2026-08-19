import { useQuery } from "@tanstack/react-query";
import { getDomainCategoriesService } from "../../../../../services/api/domains.api";

const useDomainCategories = (domainId: string) => {
    return useQuery({
        // Keyed by domainId so switching domains swaps to that domain's categories
        // rather than showing the previous domain's cached list.
        queryKey: ["domains", domainId, "categories"],
        queryFn: () => getDomainCategoriesService(domainId),
        enabled: Boolean(domainId),
        staleTime: Infinity,
    });
};

export default useDomainCategories;
