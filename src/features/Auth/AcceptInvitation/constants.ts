import type { AcceptInvitationFormDataType } from "./types";

export const INITIAL_ACCEPT_INVITATION_FORM_DATA: AcceptInvitationFormDataType = {
    FirstName: "",
    LastName: "",
    BusinessName: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    InvitationToken: "",
    BusinessDomainId: "",
    NewCategoryNames: [],
    SelectedProductAttributeKeys: [],
    // Never pre-checked — the owner must actively opt in.
    AgreedToTerms: false,
};
