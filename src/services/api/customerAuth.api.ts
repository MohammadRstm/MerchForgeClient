import type {
    CustomerLoginFormDataType,
    CustomerSessionResponse,
    CustomerSignupFormDataType,
} from "../../features/CustomerAuth/types";
import { customerSessionResponseSchema } from "../../features/CustomerAuth/validation";
import { unAuthenticatedApi } from "./api";
import { apiRoutes } from "./apiRoutes";

// returnUrl, when present, is read from the page's own ?returnUrl= query param and
// passed straight through — the backend mints a one-time exchange code tied to it
// only when it's present, never a token in the URL itself.
export const customerLoginService = async (
    formData: CustomerLoginFormDataType,
    returnUrl?: string
): Promise<CustomerSessionResponse> => {
    const { data } = await unAuthenticatedApi.post(apiRoutes.CUSTOMER_AUTH_LOGIN, {
        ...formData,
        returnUrl,
    });

    return customerSessionResponseSchema.parse(data);
};

export const customerSignupService = async (
    formData: CustomerSignupFormDataType,
    returnUrl?: string
): Promise<CustomerSessionResponse> => {
    const { data } = await unAuthenticatedApi.post(apiRoutes.CUSTOMER_AUTH_SIGNUP, {
        ...formData,
        returnUrl,
    });

    return customerSessionResponseSchema.parse(data);
};

// Cookie-based (the customerRefreshToken cookie, Path=/api/CustomerAuth) — used
// exclusively by the hidden /customer/silent page for the SDK's silent-renewal chain.
export const customerSilentService = async (): Promise<CustomerSessionResponse> => {
    const { data } = await unAuthenticatedApi.post(apiRoutes.CUSTOMER_AUTH_SILENT);

    return customerSessionResponseSchema.parse(data);
};
