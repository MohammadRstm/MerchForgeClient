import { useQuery } from "@tanstack/react-query";
import { getDomainProductAttributesService } from "../../../../../services/api/domains.api";

const useDomainProductAttributes = (domainId: string) => {
    return useQuery({
        queryKey: ["domains", domainId, "product-attributes"],
        queryFn: () => getDomainProductAttributesService(domainId),
        enabled: Boolean(domainId),
        staleTime: Infinity,
    });
};

export default useDomainProductAttributes;
