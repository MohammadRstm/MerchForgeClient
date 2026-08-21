import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type { ProductFormField } from "../types";
import type useProductModal from "../hooks/ui/useProductModal";
import ProductImagesField from "./ProductImagesField";

type ProductModalProps = {
    modal: ReturnType<typeof useProductModal>;
    /**
     * Offered only when creating. Editing an existing product through a fresh
     * conversation would create a second product rather than update this one.
     */
    onFillWithAi?: () => void;
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

const ProductModal = ({ modal, onFillWithAi }: ProductModalProps) => {
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

    return (
        <Modal isOpen={isOpen} onClose={close}>
            <Modal.Header>
                <div className="product-modal__header">
                    <h2>{isEditing ? "Edit product" : "Add product"}</h2>

                    {!isEditing && onFillWithAi && (
                        <button
                            type="button"
                            className="business-dashboard-button-secondary product-modal__ai-button"
                            onClick={onFillWithAi}
                            disabled={isPreparing}
                        >
                            ✨ Fill with AI
                        </button>
                    )}
                </div>
            </Modal.Header>

            <Modal.Body>
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
                            onAddImage={uploadImage}
                            onRemoveImage={removeImage}
                            onSetMainImage={setMainImage}
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
            </Modal.Body>

            <Modal.Footer>
                <button type="button" className="business-dashboard-button-secondary" onClick={close}>
                    Cancel
                </button>
                <button
                    type="button"
                    className="business-dashboard-button-primary"
                    onClick={submit}
                    disabled={isSaving || isPreparing || imageUploading}
                >
                    {isSaving ? "Saving…" : isEditing ? "Save changes" : "Add product"}
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductModal;
