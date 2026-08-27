import "./WebsiteTemplateSelectionPage.css";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import useWebsiteTemplateRequestPage from "./hooks/useWebsiteTemplateRequestPage";
import TemplateCard from "./components/TemplateCard";
import CustomizationNotesForm from "./components/CustomizationNotesForm";

const WebsiteTemplateSelectionPage = () => {
    const {
        options,
        isLoading,
        isError,

        step,
        selectedTemplate,
        customizationNotes,
        setCustomizationNotes,
        error,
        isPending,
        isSuccess,

        selectTemplate,
        backToSelection,
        submit,
        backToDashboard,
    } = useWebsiteTemplateRequestPage();

    return (
        <main className="website-template-page">
            <button type="button" className="website-template-page__back" onClick={backToDashboard}>
                <span aria-hidden="true">←</span> Back to dashboard
            </button>

            <h1 className="website-template-page__title">Choose Your Template</h1>

            {isLoading ? (
                <div className="website-template-page__loading">
                    <Spinner size={32} />
                </div>
            ) : isError || !options ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Failed to load templates. Please try again.
                </p>
            ) : isSuccess ? (
                <div className="website-template-page__success">
                    <h2>Request submitted</h2>
                    <p>
                        We've received your request and our team will be in touch once your custom website is
                        ready. You can check its status from your dashboard.
                    </p>
                    <button type="button" className="business-dashboard-button-primary" onClick={backToDashboard}>
                        Back to dashboard
                    </button>
                </div>
            ) : options.hasOpenRequest ? (
                <div className="website-template-page__success">
                    <h2>You already have a request in progress</h2>
                    <p>
                        Your website request for {options.domainName} businesses is being reviewed. We'll be in
                        touch once it's ready.
                    </p>
                    <button type="button" className="business-dashboard-button-primary" onClick={backToDashboard}>
                        Back to dashboard
                    </button>
                </div>
            ) : step === "select" ? (
                <>
                    <p className="website-template-page__subtitle">
                        Templates available for {options.domainName} businesses
                    </p>

                    {options.templates.length === 0 ? (
                        <p className="business-dashboard-table-message">
                            No templates are available for your domain yet. Check back soon.
                        </p>
                    ) : (
                        <div className="website-template-page__grid">
                            {options.templates.map((template) => (
                                <TemplateCard key={template.id} template={template} onSelect={selectTemplate} />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                selectedTemplate && (
                    <CustomizationNotesForm
                        template={selectedTemplate}
                        notes={customizationNotes}
                        onNotesChange={setCustomizationNotes}
                        error={error}
                        isPending={isPending}
                        onBack={backToSelection}
                        onSubmit={submit}
                    />
                )
            )}
        </main>
    );
};

export default WebsiteTemplateSelectionPage;
