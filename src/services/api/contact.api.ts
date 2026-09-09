import { unAuthenticatedApi } from "./api";
import { apiRoutes } from "./apiRoutes";

export interface ContactEnquiryPayload {
    Name: string;
    Email: string;
    Subject: string;
    Message: string;
}

export const submitContactEnquiry = (data: ContactEnquiryPayload) => {
    return unAuthenticatedApi.post(apiRoutes.CONTACT, data);
};
