export const SUBJECT_OPTIONS = [
    { value: "business-registration", label: "Business Registration" },
    { value: "career-opportunities", label: "Career Opportunities" },
    { value: "custom", label: "Custom" },
] as const;

export type SubjectOption = (typeof SUBJECT_OPTIONS)[number]["value"];

export interface ContactFormData {
    name: string;
    email: string;
    subjectOption: SubjectOption | "";
    customSubject: string;
    message: string;
}

export interface ContactFormErrors {
    name?: string;
    email?: string;
    subjectOption?: string;
    customSubject?: string;
    message?: string;
}
