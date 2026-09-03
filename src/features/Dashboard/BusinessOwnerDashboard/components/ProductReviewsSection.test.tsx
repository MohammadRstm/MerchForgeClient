import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProductReviewsSection from "./ProductReviewsSection";
import type { ProductReview } from "../types";

// The component renders purely from the modal hook's return value, so it's supplied
// as a plain object rather than being run — what's under test is that state maps to
// the right UI, not how that state was produced.
type Modal = Parameters<typeof ProductReviewsSection>[0]["modal"];

const review = (overrides: Partial<ProductReview> = {}): ProductReview => ({
    id: "11111111-1111-4111-8111-111111111111",
    rating: 5,
    comment: "Exactly as described.",
    customerName: "Mia Sato",
    customerEmail: "mia.sato@example.com",
    isHidden: false,
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
    ...overrides,
});

const modal = (overrides: Partial<Modal> = {}): Modal =>
    ({
        reviews: { items: [review()], page: 1, pageSize: 5, totalCount: 1, totalPages: 1 },
        reviewsLoading: false,
        reviewsError: false,
        reviewsPage: 1,
        setReviewsPage: vi.fn(),
        setReviewHidden: vi.fn(),
        isUpdatingReview: false,
        ...overrides,
    }) as Modal;

describe("ProductReviewsSection", () => {
    it("shows an empty state explaining who is allowed to review", () => {
        render(
            <ProductReviewsSection
                modal={modal({
                    reviews: { items: [], page: 1, pageSize: 5, totalCount: 0, totalPages: 0 },
                })}
            />
        );

        expect(screen.getByText(/only customers who have ordered this product/i)).toBeTruthy();
    });

    it("surfaces a load failure rather than looking empty", () => {
        render(<ProductReviewsSection modal={modal({ reviewsError: true, reviews: undefined })} />);

        expect(screen.getByText(/unable to load reviews/i)).toBeTruthy();
    });

    it("renders a review with its comment and reviewer", () => {
        render(<ProductReviewsSection modal={modal()} />);

        expect(screen.getByText("Exactly as described.")).toBeTruthy();
        expect(screen.getByText(/Mia Sato/)).toBeTruthy();
    });

    it("renders a rating-only review without a comment paragraph", () => {
        render(<ProductReviewsSection modal={modal({
            reviews: {
                items: [review({ comment: null })],
                page: 1, pageSize: 5, totalCount: 1, totalPages: 1,
            },
        })} />);

        expect(screen.queryByText("Exactly as described.")).toBeNull();
        expect(screen.getByText(/Mia Sato/)).toBeTruthy();
    });

    it("offers Hide for a visible review and asks to hide it", () => {
        const setReviewHidden = vi.fn();
        render(<ProductReviewsSection modal={modal({ setReviewHidden })} />);

        screen.getByRole("button", { name: "Hide" }).click();

        expect(setReviewHidden).toHaveBeenCalledWith({
            reviewId: "11111111-1111-4111-8111-111111111111",
            isHidden: true,
        });
    });

    it("marks a hidden review and offers Restore instead", () => {
        const setReviewHidden = vi.fn();
        render(
            <ProductReviewsSection
                modal={modal({
                    reviews: {
                        items: [review({ isHidden: true })],
                        page: 1, pageSize: 5, totalCount: 1, totalPages: 1,
                    },
                    setReviewHidden,
                })}
            />
        );

        expect(screen.getByText("Hidden")).toBeTruthy();

        screen.getByRole("button", { name: "Restore" }).click();

        expect(setReviewHidden).toHaveBeenCalledWith({
            reviewId: "11111111-1111-4111-8111-111111111111",
            isHidden: false,
        });
    });

    it("disables the control while an update is in flight", () => {
        render(<ProductReviewsSection modal={modal({ isUpdatingReview: true })} />);

        expect((screen.getByRole("button", { name: "Hide" }) as HTMLButtonElement).disabled).toBe(
            true
        );
    });
});
