import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import CustomerSignup from "./CustomerSignup";

// The api module is mocked, not axios and not the query hook — same convention as
// useColorImages.test.tsx. What's under test is that the form won't submit without
// the checkbox, and that it sends agreedToTerms once it is checked, not how the
// mutation itself works.
vi.mock("../../../services/api/customerAuth.api", () => ({
    customerSignupService: vi.fn(),
}));

import { customerSignupService } from "../../../services/api/customerAuth.api";

const wrapper = ({ children }: { children: ReactNode }) => {
    const client = new QueryClient({
        defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
    });
    return (
        <QueryClientProvider client={client}>
            <MemoryRouter initialEntries={["/customer/signup"]}>{children}</MemoryRouter>
        </QueryClientProvider>
    );
};

const fillRequiredFields = () => {
    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Mia" } });
    fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Sato" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "mia.sato@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "correct-horse" } });
};

describe("CustomerSignup", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the agreement checkbox unchecked, with links to the real Terms and Privacy routes", () => {
        render(<CustomerSignup />, { wrapper });

        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.checked).toBe(false);

        expect(screen.getByRole("link", { name: "Terms of Service" }).getAttribute("href")).toBe(
            "/terms"
        );
        expect(screen.getByRole("link", { name: "Privacy Policy" }).getAttribute("href")).toBe(
            "/privacy"
        );
    });

    it("does not submit, and shows a validation message, when the checkbox is left unchecked", async () => {
        render(<CustomerSignup />, { wrapper });
        fillRequiredFields();

        fireEvent.click(screen.getByRole("button", { name: "Create account" }));

        expect(
            await screen.findByText(/must agree to the terms of service and privacy policy/i)
        ).toBeTruthy();
        expect(customerSignupService).not.toHaveBeenCalled();
    });

    it("submits with agreedToTerms: true once the checkbox is checked", async () => {
        vi.mocked(customerSignupService).mockResolvedValue({
            authResponse: { accessToken: "token", accessTokenExpiresAt: "2026-01-01T00:00:00Z" },
            customerId: "11111111-1111-4111-8111-111111111111",
            email: "mia.sato@example.com",
            firstName: "Mia",
            lastName: "Sato",
            exchangeCode: null,
        });

        render(<CustomerSignup />, { wrapper });
        fillRequiredFields();

        fireEvent.click(screen.getByRole("checkbox"));
        fireEvent.click(screen.getByRole("button", { name: "Create account" }));

        await waitFor(() => expect(customerSignupService).toHaveBeenCalledTimes(1));

        const [submittedFormData] = vi.mocked(customerSignupService).mock.calls[0]!;
        expect(submittedFormData.agreedToTerms).toBe(true);
    });
});
