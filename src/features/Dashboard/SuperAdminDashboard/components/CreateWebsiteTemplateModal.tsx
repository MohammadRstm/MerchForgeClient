import Modal from "../../../../components/Modal/Modal";
import useDomains from "../../../Auth/AcceptInvitation/hooks/data/useDomains";
import { resolveImageUrl } from "../../BusinessOwnerDashboard/utils/resolveImageUrl";
import type useCreateWebsiteTemplateForm from "../hooks/ui/useCreateWebsiteTemplateForm";

type CreateWebsiteTemplateModalProps = {
    form: ReturnType<typeof useCreateWebsiteTemplateForm>;
};

const CreateWebsiteTemplateModal = ({ form }: CreateWebsiteTemplateModalProps) => {
    const { data: domains, isLoading: domainsLoading } = useDomains();

    return (
        <Modal isOpen={form.isOpen} onClose={form.close}>
            <Modal.Header>
                <h2>Add a website template</h2>
            </Modal.Header>

            <Modal.Body>
                <p className="dashboard-modal-text">
                    The name becomes the technical identifier a later deployment step
                    matches against a physical template project, e.g. "fashion-template-02".
                </p>

                <form
                    className="dashboard-form-grid"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.submit();
                    }}
                >
                    <div>
                        <label className="dashboard-invite-label" htmlFor="template-domain">
                            Domain
                        </label>
                        <select
                            id="template-domain"
                            className="dashboard-invite-input"
                            value={form.values.businessDomainId}
                            onChange={(e) => form.changeField("businessDomainId", e.target.value)}
                            disabled={form.isPending || domainsLoading}
                        >
                            <option value="">Select a domain...</option>
                            {domains?.map((domain) => (
                                <option key={domain.id} value={domain.id}>
                                    {domain.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="dashboard-invite-label" htmlFor="template-name">
                            Name
                        </label>
                        <input
                            id="template-name"
                            className="dashboard-invite-input"
                            type="text"
                            value={form.values.name}
                            onChange={(e) => form.changeField("name", e.target.value)}
                            placeholder="fashion-template-02"
                            disabled={form.isPending}
                        />
                    </div>

                    <div>
                        <label className="dashboard-invite-label" htmlFor="template-label">
                            Label
                        </label>
                        <input
                            id="template-label"
                            className="dashboard-invite-input"
                            type="text"
                            value={form.values.label}
                            onChange={(e) => form.changeField("label", e.target.value)}
                            placeholder="Fashion Template 02"
                            disabled={form.isPending}
                        />
                    </div>

                    <div>
                        <label className="dashboard-invite-label" htmlFor="template-video">
                            Preview video
                        </label>
                        <input
                            id="template-video"
                            className="dashboard-invite-input"
                            type="file"
                            accept="video/mp4,video/webm"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) form.uploadVideo(file);
                                e.target.value = "";
                            }}
                            disabled={form.isPending || form.videoUploading}
                        />
                        {form.videoUploading && <p className="dashboard-modal-text">Uploading video...</p>}
                        {form.values.videoPreviewUrl && !form.videoUploading && (
                            <video
                                src={resolveImageUrl(form.values.videoPreviewUrl)}
                                controls
                                muted
                                className="dashboard-template-video-preview"
                            />
                        )}
                    </div>

                    <div>
                        <label className="dashboard-invite-label" htmlFor="template-preview-website">
                            Preview website URL
                        </label>
                        <input
                            id="template-preview-website"
                            className="dashboard-invite-input"
                            type="text"
                            value={form.values.previewWebsiteUrl}
                            onChange={(e) => form.changeField("previewWebsiteUrl", e.target.value)}
                            placeholder="https://fashion-02-demo.example.com (optional, opened by the Preview button)"
                            disabled={form.isPending}
                        />
                    </div>

                    <div>
                        <label className="dashboard-invite-label" htmlFor="template-order">
                            Display order
                        </label>
                        <input
                            id="template-order"
                            className="dashboard-invite-input"
                            type="number"
                            min={0}
                            step={1}
                            value={form.values.displayOrder}
                            onChange={(e) => form.changeField("displayOrder", e.target.value)}
                            disabled={form.isPending}
                        />
                    </div>

                    {form.error && (
                        <p className="dashboard-invite-error" role="alert">
                            {form.error}
                        </p>
                    )}
                </form>
            </Modal.Body>

            <Modal.Footer>
                <div className="dashboard-modal-actions">
                    <button
                        type="button"
                        className="dashboard-modal-cancel-btn"
                        onClick={form.close}
                        disabled={form.isPending}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="dashboard-modal-primary-btn"
                        onClick={form.submit}
                        disabled={form.isPending}
                    >
                        {form.isPending ? "Adding..." : "Add template"}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateWebsiteTemplateModal;
