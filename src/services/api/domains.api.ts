import type {
    Domain,
    DomainCategory,
    ProductAttribute,
} from "../../features/Auth/AcceptInvitation/types";
import {
    domainCategoriesSchema,
    domainsSchema,
    productAttributesSchema,
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

export const getDomainProductAttributesService = async (
    domainId: string
): Promise<ProductAttribute[]> => {
    const { data } = await unAuthenticatedApi.get<ProductAttribute[]>(
        apiRoutes.DOMAIN_PRODUCT_ATTRIBUTES(domainId)
    );

    return productAttributesSchema.parse(data);
};
