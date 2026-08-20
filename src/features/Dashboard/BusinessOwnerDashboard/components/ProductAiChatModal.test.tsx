import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ProductDraft } from "../types";
import ProductAiChatModal from "./ProductAiChatModal";

// The component renders from the draft alone, so the hook is supplied as a plain
// object rather than being run - what is under test is that backend state maps to
// the right UI, not how that state was fetched.
type Chat = Parameters<typeof ProductAiChatModal>[0]["chat"];

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

const confirmButton = () => screen.getByRole("button", { name: /create product/i });

describe("ProductAiChatModal", () => {
    it("renders the conversation", () => {
        render(<ProductAiChatModal chat={chat()} />);

        expect(screen.getByText("Hi! Tell me about your product.")).toBeTruthy();
    });

    it("disables creation until the backend says the draft can be confirmed", () => {
        render(<ProductAiChatModal chat={chat({ draft: draft({ canConfirm: false }) })} />);

        expect(confirmButton().hasAttribute("disabled")).toBe(true);
    });

    it("enables creation only on the backend's canConfirm", () => {
        render(<ProductAiChatModal chat={chat({ draft: draft({ canConfirm: true }) })} />);

        expect(confirmButton().hasAttribute("disabled")).toBe(false);
    });

    it("does not enable creation just because the agent moved to review", () => {
        // The agent proposing a product is not the same as the product being valid;
        // canConfirm is the backend's own verdict and is what gates the button.
        render(
            <ProductAiChatModal
                chat={chat({ draft: draft({ status: "WaitingForProductApproval", canConfirm: false }) })}
            />
        );

        expect(confirmButton().hasAttribute("disabled")).toBe(true);
    });

    it("shows the product preview with resolved category and metadata", () => {
        render(
            <ProductAiChatModal
                chat={chat({
                    draft: draft({
                        draft: {
                            title: "Margherita Pizza",
                            description: "Classic.",
                            price: 14.5,
                            categoryId: "22222222-2222-4222-8222-222222222222",
                            categoryName: "Pizza",
                            metadata: { ingredients: ["Tomato", "Basil"], spicy: false },
                        },
                    }),
                })}
            />
        );

        expect(screen.getByText("Margherita Pizza")).toBeTruthy();
        // A name, not a guid.
        expect(screen.getByText("Pizza")).toBeTruthy();
        // Lists are joined for reading rather than dumped as JSON.
        expect(screen.getByText("Tomato, Basil")).toBeTruthy();
    });

    it("lists what is still missing", () => {
        render(
            <ProductAiChatModal
                chat={chat({
                    draft: draft({
                        draft: {
                            title: "Pizza", description: null, price: null,
                            categoryId: null, categoryName: null, metadata: null,
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
            <ProductAiChatModal
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
        render(<ProductAiChatModal chat={chat({ draft: draft({ status: "Cancelled" }) })} />);

        expect(screen.queryByLabelText("Message")).toBeNull();
    });

    it("surfaces an error to the owner", () => {
        render(
            <ProductAiChatModal
                chat={chat({ error: "The assistant is unavailable right now." })}
            />
        );

        expect(screen.getByRole("alert").textContent).toContain("unavailable");
    });

    it("omits the voice button when the browser cannot record", () => {
        const base = chat();

        render(
            <ProductAiChatModal
                chat={{ ...base, voice: { ...base.voice, isSupported: false } } as Chat}
            />
        );

        expect(screen.queryByTitle(/record a voice message/i)).toBeNull();
        // Typing is still available, so recording being unsupported is not a dead end.
        expect(screen.getByLabelText("Message")).toBeTruthy();
    });
});
