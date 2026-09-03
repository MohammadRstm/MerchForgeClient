import type { CustomerSignupFormDataType } from "../types";

export const INITIAL_CUSTOMER_SIGNUP_FORM_DATA: CustomerSignupFormDataType = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    // Never pre-checked — the customer must actively opt in.
    agreedToTerms: false,
};
