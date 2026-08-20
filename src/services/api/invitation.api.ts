import { businessOwnerInvitationResponseSchema } from "../../features/Dashboard/SuperAdminDashboard/validation";
import { authenticatedApi } from "./api";
import { apiRoutes } from "./apiRoutes";

/**
 * Issues a business-owner invitation. The API emails the link and returns only the
 * address and expiry — the raw token is never sent back to the caller, so there is
 * nothing here for the dashboard to display or copy.
 */
export const createBusinessOwnerInvitationService = async (email: string) => {
    const { data } = await authenticatedApi.post(apiRoutes.INVITATION_BUSINESS_OWNER, {
        email,
    });

    return businessOwnerInvitationResponseSchema.parse(data);
};
