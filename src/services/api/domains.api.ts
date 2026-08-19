import type { Domain, DomainCategory } from "../../features/Auth/AcceptInvitation/types";
import {
    domainCategoriesSchema,
    domainsSchema,
} from "../../features/Auth/AcceptInvitation/validation";
import { unAuthenticatedApi } from "./api";
import { apiRoutes } from "./apiRoutes";

// Unauthenticated: the registration form that reads these is reached from an
// emailed invitation link, before the invitee has an account.

export const getDomainsService = async (): Promise<Domain[]> => {
    const { data } = await unAuthenticatedApi.get<Domain[]>(apiRoutes.DOMAINS);

    return domainsSchema.parse(data);
};

export const getDomainCategoriesService = async (
    domainId: string
): Promise<DomainCategory[]> => {
    const { data } = await unAuthenticatedApi.get<DomainCategory[]>(
        apiRoutes.DOMAIN_CATEGORIES(domainId)
    );

    return domainCategoriesSchema.parse(data);
};
