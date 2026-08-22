import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ProductDraft } from "../types";
import AiChatPanel from "./AiChatPanel";

// The component renders from the draft alone, so the hook is supplied as a plain
// object rather than being run - what is under test is that backend state maps to
// the right UI, not how that state was fetched.
type Chat = Parameters<typeof AiChatPanel>[0]["chat"];

const draft = (overrides: Partial<ProductDraft> = {}): ProductDraft => ({
    id: "11111111-1111-4111-8111-111111111111",
    status: "CollectingInformation",
    messages: [
        { role: "assistant", text: "Hi! Tell me about your product.", kind: "text", at: "2026-02-01T10:00:00Z" },
    ],
    draft: null,
    missingFields: [],
    originalImageUrl: null,
    processedImageUrl: null,
    imageModificationPrompt: null,
    canConfirm: false,
    productId: null,
    ...overrides,
});

const chat = (overrides: Partial<Chat> = {}): Chat =>
    ({
        isOpen: true,
        open: vi.fn(),
        close: vi.fn(),
        cancel: vi.fn(),
        draft: draft(),
        isStarting: false,
        isBusy: false,
        isConfirming: false,
        error: undefined,
        pendingMessage: undefined,
        messageInput: "",
        setMessageInput: vi.fn(),
        sendMessage: vi.fn(),
        attachImage: vi.fn(),
        resolveImage: vi.fn(),
        confirm: vi.fn(),
        voice: {
            isSupported: true,
            isRecording: false,
            error: undefined,
            start: vi.fn(),
            stop: vi.fn(),
        },
        ...overrides,
    }) as Chat;

describe("AiChatPanel", () => {
    it("renders the conversation", () => {
        render(<AiChatPanel chat={chat()} />);

        expect(screen.getByText("Hi! Tell me about your product.")).toBeTruthy();
    });

    it("offers no create-product action of its own — that lives on the form card", () => {
        // Confirming an AI draft and submitting the manual form mean the same thing,
        // so there is only ever one create action, owned by ProductModal.
        render(<AiChatPanel chat={chat({ draft: draft({ canConfirm: true }) })} />);

        expect(screen.queryByRole("button", { name: /create product/i })).toBeNull();
    });

    it("does not restate the derived product — the form fields are where that shows up", () => {
        // The chat used to dump title/price/category/metadata into its own preview
        // grid; that's gone, since the form itself fills in live from the same data.
        render(
            <AiChatPanel
                chat={chat({
                    draft: draft({
                        draft: {
                            title: "Margherita Pizza",
                            description: "Classic.",
                            price: 14.5,
                            compareAtPrice: null,
                            categoryId: "22222222-2222-4222-8222-222222222222",
                            categoryName: "Pizza",
                            sku: null,
                            stockQuantity: null,
                            tags: [],
                            saleEndsAt: null,
                            metadata: { ingredients: ["Tomato", "Basil"], spicy: false },
                        },
                    }),
                })}
            />
        );

        expect(screen.queryByTestId("ai-preview")).toBeNull();
        expect(screen.queryByText("Margherita Pizza")).toBeNull();
    });

    it("lists what is still missing", () => {
        render(
            <AiChatPanel
                chat={chat({
                    draft: draft({
                        draft: {
                            title: "Pizza", description: null, price: null, compareAtPrice: null,
                            categoryId: null, categoryName: null, sku: null, stockQuantity: null,
                            tags: [], saleEndsAt: null, metadata: null,
                        },
                        missingFields: ["description", "price"],
                    }),
                })}
            />
        );

        expect(screen.getByText(/still needed/i).textContent).toContain("description, price");
    });

    it("offers approve and reject while an edited image is pending", () => {
        render(
            <AiChatPanel
                chat={chat({
                    draft: draft({
                        status: "WaitingForImageApproval",
                        originalImageUrl: "/uploads/a.png",
                        processedImageUrl: "/uploads/b.png",
                        imageModificationPrompt: "Make the background neutral",
                    }),
                })}
            />
        );

        expect(screen.getByText("Make the background neutral")).toBeTruthy();
        expect(screen.getByRole("button", { name: /use updated image/i })).toBeTruthy();
        expect(screen.getByRole("button", { name: /keep original/i })).toBeTruthy();

        // The composer is withheld so the conversation cannot move on around an
        // unresolved image.
        expect(screen.queryByLabelText("Message")).toBeNull();
    });

    it("hides the composer once the conversation has ended", () => {
        render(<AiChatPanel chat={chat({ draft: draft({ status: "Cancelled" }) })} />);

        expect(screen.queryByLabelText("Message")).toBeNull();
    });

    it("surfaces an error to the owner", () => {
        render(
            <AiChatPanel
                chat={chat({ error: "The assistant is unavailable right now." })}
            />
        );

        expect(screen.getByRole("alert").textContent).toContain("unavailable");
    });

    it("omits the voice button when the browser cannot record", () => {
        const base = chat();

        render(
            <AiChatPanel
                chat={{ ...base, voice: { ...base.voice, isSupported: false } } as Chat}
            />
        );

        expect(screen.queryByTitle(/record a voice message/i)).toBeNull();
        // Typing is still available, so recording being unsupported is not a dead end.
        expect(screen.getByLabelText("Message")).toBeTruthy();
    });
});
