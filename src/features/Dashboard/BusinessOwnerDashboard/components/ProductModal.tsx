import { useEffect, useRef } from "react";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type { ProductDraftProduct, ProductFormField } from "../types";
import type useProductModal from "../hooks/ui/useProductModal";
import type useVoiceProductDraft from "../hooks/ui/useVoiceProductDraft";
import type useImageEditChat from "../hooks/ui/useImageEditChat";
import type useMultiAngleImages from "../hooks/ui/useMultiAngleImages";
import type useColorImages from "../hooks/ui/useColorImages";
import ProductImagesField from "./ProductImagesField";
import ColorListField from "./ColorListField";
import VoiceProductButton from "./VoiceProductButton";
import ImageEditChatPanel from "./ImageEditChatPanel";
import MultiAngleImagesModal from "./MultiAngleImagesModal";
import ColorImagesModal from "./ColorImagesModal";
import useClickOutside from "../../../../hooks/useClickOutsideElementToClose";
import { isoToDateInputValue } from "../hooks/ui/useProductFormState";

/**
 * Only touches the metadata keys the assistant has actually mentioned. Looping
 * over the full field list (the way editing an existing product populates the
 * form) would blank out anything the owner already typed for a key the AI
 * hasn't reached yet — the draft only ever reveals fields, it never clears them.
 */
const applyAiMetadataToForm = (
    metadata: Record<string, unknown>,
    fields: ProductFormField[],
    setMetadataField: (key: string, value: string | boolean) => void
) => {
    for (const [key, raw] of Object.entries(metadata)) {
        const field = fields.find((f) => f.key === key);
        if (!field || raw == null) continue;

        if (field.valueType === "Boolean") {
            setMetadataField(key, raw === true);
            continue;
        }

        setMetadataField(key, Array.isArray(raw) ? raw.join(", ") : String(raw));
    }
};

type ProductModalProps = {
    modal: ReturnType<typeof useProductModal>;
    /**
     * Offered only when creating. Editing an existing product through a fresh
     * voice draft would create a second product rather than update this one.
     */
    voiceDraft?: ReturnType<typeof useVoiceProductDraft>;
    /** Offered whenever there's at least one image, in both create and edit — unlike voiceDraft, touching up a photo makes sense either way. */
    imageEditChat?: ReturnType<typeof useImageEditChat>;
    /** Same availability as imageEditChat — a second, more constrained one-shot image action offered alongside it. */
    multiAngle?: ReturnType<typeof useMultiAngleImages>;
    /** A third one-shot image action, offered only once the product also has at least one chosen color. */
    colorImages?: ReturnType<typeof useColorImages>;
};

/** Renders the input that matches an optional field's declared value type. */
const MetadataField = ({
    field,
    value,
    onChange,
}: {
    field: ProductFormField;
    value: string | boolean;
    onChange: (value: string | boolean) => void;
}) => {
    if (field.valueType === "Boolean") {
        return (
            <label className="business-dashboard-form-checkbox">
                <input
                    type="checkbox"
                    checked={value === true}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <span>{field.label}</span>
            </label>
        );
    }

    const textValue = typeof value === "string" ? value : "";

    if (field.valueType === "ColorList") {
        return <ColorListField field={field} value={textValue} onChange={onChange} />;
    }

    return (
        <div className="business-dashboard-form-field">
            <label className="business-dashboard-form-label" htmlFor={`metadata-${field.key}`}>
                {field.label}
                <span className="business-dashboard-form-optional"> (optional)</span>
            </label>

            <input
                id={`metadata-${field.key}`}
                className="business-dashboard-form-input"
                type={field.valueType === "Number" ? "number" : "text"}
                value={textValue}
                onChange={(e) => onChange(e.target.value)}
                placeholder={field.valueType === "TextList" ? "Separate with commas" : undefined}
            />

            {field.valueType === "TextList" && (
                <span className="business-dashboard-form-hint">
                    Separate multiple values with commas.
                </span>
            )}
        </div>
    );
};

const ProductModal = ({ modal, voiceDraft, imageEditChat, multiAngle, colorImages }: ProductModalProps) => {
    const {
        isOpen,
        isEditing,
        close,
        form,
        productForm,
        productFormLoading,
        editingProductLoading,
        values,
        errors,
        setField,
        setMetadataField,
        removeImage,
        setMainImage,
        maxImages,
        submit,
        isSaving,
        saveError,
        imageUploading,
        imageUploadError,
        uploadImage,
    } = modal;

    const isPreparing = productFormLoading || editingProductLoading;
    const isVoiceDraftActive = Boolean(voiceDraft?.isActive);
    const isImageEditOpen = Boolean(imageEditChat?.isOpen);
    // Confirming has its own "Creating…" state on the button, and the recording
    // pill/thinking pill already show progress next to the mic button, so the
    // card-wide glow is reserved for genuinely waiting on the assistant's next
    // turn after a recording is sent.
    const isAiThinking =
        isVoiceDraftActive &&
        Boolean(voiceDraft?.isBusy) &&
        !voiceDraft?.isConfirming &&
        !voiceDraft?.voice.isRecording;

    const wrapperRef = useRef<HTMLDivElement>(null);

    // Cancelling the voice draft is part of closing the pair while it's active —
    // otherwise a draft would keep running in the background with no way back to it.
    const handleClose = () => {
        if (voiceDraft?.isActive) voiceDraft.cancel();
        if (imageEditChat?.isOpen) imageEditChat.close();
        close();
    };

    useClickOutside(wrapperRef, handleClose);

    // Mirrors the assistant's structured understanding into the real form fields
    // as it arrives, so the owner watches the form fill in as each recording is
    // processed. Only ever reveals values -- a field the AI hasn't reached yet
    // (still null) is left exactly as the owner left it, never cleared.
    const aiDraftProduct: ProductDraftProduct | undefined = voiceDraft?.draft?.draft ?? undefined;

    useEffect(() => {
        if (!aiDraftProduct) return;

        if (aiDraftProduct.title != null) setField("title", aiDraftProduct.title);
        if (aiDraftProduct.description != null) setField("description", aiDraftProduct.description);
        if (aiDraftProduct.price != null) setField("price", String(aiDraftProduct.price));
        if (aiDraftProduct.compareAtPrice != null) setField("compareAtPrice", String(aiDraftProduct.compareAtPrice));
        if (aiDraftProduct.categoryId != null) setField("categoryId", aiDraftProduct.categoryId);
        if (aiDraftProduct.sku != null) setField("sku", aiDraftProduct.sku);
        if (aiDraftProduct.stockQuantity != null) setField("stockQuantity", String(aiDraftProduct.stockQuantity));
        if (aiDraftProduct.tags.length > 0) setField("tags", aiDraftProduct.tags.join(", "));
        if (aiDraftProduct.saleEndsAt != null) setField("saleEndsAt", isoToDateInputValue(aiDraftProduct.saleEndsAt));
        if (aiDraftProduct.metadata != null) {
            applyAiMetadataToForm(aiDraftProduct.metadata, form, setMetadataField);
        }
    }, [aiDraftProduct, form, setField, setMetadataField]);

    if (!isOpen) return null;

    // Confirming an AI draft and submitting the manual form both mean the same
    // thing — "this product is done" — so there is only ever one primary action.
    // While a voice draft is active it's wired to the draft's confirm instead of
    // the plain form submit; the voice button itself offers no create action.
    const primaryLabel = isVoiceDraftActive
        ? voiceDraft?.isConfirming
            ? "Creating…"
            : "Create product"
        : isSaving
          ? "Saving…"
          : isEditing
            ? "Save changes"
            : "Add product";

    const primaryDisabled = isVoiceDraftActive
        ? !voiceDraft?.draft?.canConfirm || voiceDraft?.isBusy
        : isSaving || isPreparing || imageUploading;

    const handlePrimaryAction = isVoiceDraftActive ? voiceDraft?.confirm : submit;

    return (
        <div className="modal-backdrop">
            <div ref={wrapperRef} className="product-ai-modals">
                <div className="modal-container product-form-card">
                    {isAiThinking && (
                        // Traces the card's own border rather than anything inside it — a
                        // short segment of stroke chasing continuously around the perimeter,
                        // not a spinner or gradient blob sitting over the form.
                        <svg className="product-form-card__glow-trace" aria-hidden="true">
                            <rect x="0" y="0" width="100%" height="100%" rx="16" pathLength={100} />
                        </svg>
                    )}

                    <button
                        type="button"
                        className="modal-cancel-button"
                        onClick={handleClose}
                        aria-label="Close modal"
                    >
                        ×
                    </button>

                    <div className="modal-header">
                        <div className="product-modal__header">
                            <h2>{isEditing ? "Edit product" : "Add product"}</h2>
                        </div>
                    </div>

                    <div className="modal-body">
                        {isPreparing ? (
                            <div className="business-dashboard-table-loading">
                                <Spinner size={28} />
                            </div>
                        ) : (
                            <form className="business-dashboard-form" onSubmit={submit} noValidate>
                                <ProductImagesField
                                    images={values.images}
                                    maxImages={maxImages}
                                    isUploading={imageUploading}
                                    uploadError={imageUploadError}
                                    validationError={errors.images}
                                    onAddImage={(file) => {
                                        uploadImage(file);
                                        // Keeps a voice draft's own image in sync with whatever
                                        // the owner uploads here, so canConfirm can actually turn
                                        // true — see useVoiceProductDraft.attachImageIfFirst.
                                        voiceDraft?.attachImageIfFirst(file);
                                    }}
                                    onRemoveImage={removeImage}
                                    onSetMainImage={setMainImage}
                                    onEditImages={imageEditChat && !isVoiceDraftActive ? imageEditChat.open : undefined}
                                    onGenerateAngles={multiAngle && !isVoiceDraftActive ? multiAngle.open : undefined}
                                    onGenerateColors={colorImages && !isVoiceDraftActive ? colorImages.open : undefined}
                                    hasProductColors={colorImages?.hasColors}
                                    isSelectingForEdit={isImageEditOpen}
                                    selectedForEdit={imageEditChat?.selectedUrls}
                                    onToggleSelectForEdit={imageEditChat?.toggleSelect}
                                    processingImageUrl={imageEditChat?.processingUrl}
                                />

                                <div className="business-dashboard-form-field">
                                    <label className="business-dashboard-form-label" htmlFor="product-title">
                                        Title
                                    </label>
                                    <input
                                        id="product-title"
                                        className="business-dashboard-form-input"
                                        value={values.title}
                                        onChange={(e) => setField("title", e.target.value)}
                                        aria-invalid={Boolean(errors.title)}
                                    />
                                    {errors.title && (
                                        <span className="business-dashboard-form-error" role="alert">
                                            {errors.title}
                                        </span>
                                    )}
                                </div>

                                <div className="business-dashboard-form-field">
                                    <label className="business-dashboard-form-label" htmlFor="product-description">
                                        Description
                                    </label>
                                    <textarea
                                        id="product-description"
                                        className="business-dashboard-form-input business-dashboard-form-textarea"
                                        rows={3}
                                        value={values.description}
                                        onChange={(e) => setField("description", e.target.value)}
                                        aria-invalid={Boolean(errors.description)}
                                    />
                                    {errors.description && (
                                        <span className="business-dashboard-form-error" role="alert">
                                            {errors.description}
                                        </span>
                                    )}
                                </div>

                                <div className="business-dashboard-form-row">
                                    <div className="business-dashboard-form-field">
                                        <label className="business-dashboard-form-label" htmlFor="product-price">
                                            Price
                                        </label>
                                        <input
                                            id="product-price"
                                            className="business-dashboard-form-input"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={values.price}
                                            onChange={(e) => setField("price", e.target.value)}
                                            aria-invalid={Boolean(errors.price)}
                                        />
                                        {errors.price && (
                                            <span className="business-dashboard-form-error" role="alert">
                                                {errors.price}
                                            </span>
                                        )}
                                    </div>

                                    <div className="business-dashboard-form-field">
                                        <label className="business-dashboard-form-label" htmlFor="product-compare-at-price">
                                            Compare-at price
                                            <span className="business-dashboard-form-optional"> (optional)</span>
                                        </label>
                                        <input
                                            id="product-compare-at-price"
                                            className="business-dashboard-form-input"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="Shown struck through, for a sale"
                                            value={values.compareAtPrice}
                                            onChange={(e) => setField("compareAtPrice", e.target.value)}
                                            aria-invalid={Boolean(errors.compareAtPrice)}
                                        />
                                        {errors.compareAtPrice && (
                                            <span className="business-dashboard-form-error" role="alert">
                                                {errors.compareAtPrice}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="business-dashboard-form-row">
                                    <div className="business-dashboard-form-field">
                                        <label className="business-dashboard-form-label" htmlFor="product-category">
                                            Category
                                        </label>
                                        <select
                                            id="product-category"
                                            className="business-dashboard-form-input"
                                            value={values.categoryId}
                                            onChange={(e) => setField("categoryId", e.target.value)}
                                            aria-invalid={Boolean(errors.categoryId)}
                                        >
                                            <option value="">Select a category</option>
                                            {productForm?.categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.categoryId && (
                                            <span className="business-dashboard-form-error" role="alert">
                                                {errors.categoryId}
                                            </span>
                                        )}
                                    </div>

                                    <div className="business-dashboard-form-field">
                                        <label className="business-dashboard-form-label" htmlFor="product-sku">
                                            SKU
                                            <span className="business-dashboard-form-optional"> (optional)</span>
                                        </label>
                                        <input
                                            id="product-sku"
                                            className="business-dashboard-form-input"
                                            value={values.sku}
                                            onChange={(e) => setField("sku", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="business-dashboard-form-row">
                                    <div className="business-dashboard-form-field">
                                        <label className="business-dashboard-form-label" htmlFor="product-stock-quantity">
                                            Stock quantity
                                            <span className="business-dashboard-form-optional"> (optional — leave blank if untracked)</span>
                                        </label>
                                        <input
                                            id="product-stock-quantity"
                                            className="business-dashboard-form-input"
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={values.stockQuantity}
                                            onChange={(e) => setField("stockQuantity", e.target.value)}
                                        />
                                    </div>

                                    <div className="business-dashboard-form-field">
                                        <label className="business-dashboard-form-label" htmlFor="product-sale-ends-at">
                                            Sale ends
                                            <span className="business-dashboard-form-optional"> (optional)</span>
                                        </label>
                                        <input
                                            id="product-sale-ends-at"
                                            className="business-dashboard-form-input"
                                            type="date"
                                            value={values.saleEndsAt}
                                            onChange={(e) => setField("saleEndsAt", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="business-dashboard-form-field">
                                    <label className="business-dashboard-form-label" htmlFor="product-tags">
                                        Tags
                                        <span className="business-dashboard-form-optional"> (optional)</span>
                                    </label>
                                    <input
                                        id="product-tags"
                                        className="business-dashboard-form-input"
                                        placeholder="New, Bestseller, Limited Edition"
                                        value={values.tags}
                                        onChange={(e) => setField("tags", e.target.value)}
                                    />
                                    <span className="business-dashboard-form-hint">Separate multiple tags with commas.</span>
                                </div>

                                {form.length > 0 && (
                                    <>
                                        <hr className="business-dashboard-form-divider" />
                                        <p className="business-dashboard-form-section">
                                            Product details
                                            <span className="business-dashboard-form-optional">
                                                {" "}
                                                — all optional
                                            </span>
                                        </p>

                                        {form.map((field) => (
                                            <MetadataField
                                                key={field.key}
                                                field={field}
                                                value={values.metadata[field.key] ?? ""}
                                                onChange={(value) => setMetadataField(field.key, value)}
                                            />
                                        ))}
                                    </>
                                )}

                                {saveError && (
                                    <p className="business-dashboard-form-error" role="alert">
                                        {saveError}
                                    </p>
                                )}
                            </form>
                        )}
                    </div>

                    <div className="modal-footer product-form-card__footer">
                        {!isEditing && voiceDraft && !isImageEditOpen && (
                            <VoiceProductButton voiceDraft={voiceDraft} />
                        )}

                        <div className="product-form-card__footer-actions">
                            <button type="button" className="business-dashboard-button-secondary" onClick={handleClose}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="business-dashboard-button-primary"
                                onClick={handlePrimaryAction}
                                disabled={primaryDisabled}
                            >
                                {primaryLabel}
                            </button>
                        </div>
                    </div>
                </div>

                {imageEditChat && isImageEditOpen && <ImageEditChatPanel chat={imageEditChat} />}
                {multiAngle && <MultiAngleImagesModal multiAngle={multiAngle} />}
                {colorImages && <ColorImagesModal colorImages={colorImages} />}
            </div>
        </div>
    );
};

export default ProductModal;
