import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type { WebsiteTemplateOption } from "../../BusinessOwnerDashboard/types";

type CustomizationNotesFormProps = {
    template: WebsiteTemplateOption;
    notes: string;
    onNotesChange: (value: string) => void;
    error: string | null;
    isPending: boolean;
    onBack: () => void;
    onSubmit: () => void;
};

const CustomizationNotesForm = ({
    template,
    notes,
    onNotesChange,
    error,
    isPending,
    onBack,
    onSubmit,
}: CustomizationNotesFormProps) => {
    return (
        <div className="customization-form">
            <p className="customization-form__selected">
                Selected template: <strong>{template.label}</strong>
            </p>

            <h2 className="customization-form__heading">Tell us what you'd like to change</h2>
            <p className="customization-form__hint">
                Different colors, sections, layout, your business information, or anything else you'd like
                adjusted from the stock template.
            </p>

            <textarea
                className="customization-form__textarea"
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="e.g. Use our brand colors (navy and gold), add a testimonials section, and use the business info from our dashboard for the About page."
                rows={8}
                disabled={isPending}
            />

            {error && (
                <p className="business-dashboard-form-error" role="alert">
                    {error}
                </p>
            )}

            <div className="customization-form__actions">
                <button type="button" className="business-dashboard-button-secondary" onClick={onBack} disabled={isPending}>
                    Back
                </button>
                <button type="button" className="business-dashboard-button-primary" onClick={onSubmit} disabled={isPending}>
                    {isPending ? (
                        <>
                            <Spinner size={16} /> Submitting...
                        </>
                    ) : (
                        "Submit request"
                    )}
                </button>
            </div>
        </div>
    );
};

export default CustomizationNotesForm;
