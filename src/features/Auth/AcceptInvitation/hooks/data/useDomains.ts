import { useQuery } from "@tanstack/react-query";
import { getDomainsService } from "../../../../../services/api/domains.api";

const useDomains = () => {
    return useQuery({
        queryKey: ["domains"],
        queryFn: getDomainsService,
        // Platform reference data: it changes only when a SuperAdmin edits it, so
        // there's no reason to refetch it while someone fills in a form.
        staleTime: Infinity,
    });
};

export default useDomains;
