import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type useWebsiteTemplateRequestDetailModal from "../hooks/ui/useWebsiteTemplateRequestDetailModal";

type WebsiteTemplateRequestDetailModalProps = {
    modal: ReturnType<typeof useWebsiteTemplateRequestDetailModal>;
};

const WebsiteTemplateRequestDetailModal = ({ modal }: WebsiteTemplateRequestDetailModalProps) => {
    const {
        isOpen,
        request,
        isLoading,
        isError,
        finalWebsiteUrl,
        setFinalWebsiteUrl,
        error,
        isStartingBuild,
        isClosing,
        close,
        handleStartBuild,
        submitClose,
    } = modal;

    return (
        <Modal isOpen={isOpen} onClose={close}>
            <Modal.Header>
                <h2>Website request</h2>
            </Modal.Header>

            <Modal.Body>
                {isLoading ? (
                    <div className="dashboard-table-loading">
                        <Spinner size={28} />
                    </div>
                ) : isError || !request ? (
                    <p className="dashboard-table-message dashboard-table-message--error">
                        Failed to load this request. Please try again.
                    </p>
                ) : (
                    <div className="website-request-detail">
                        <div className="website-request-detail__business">
                            <span className="website-request-detail__business-name">{request.businessName}</span>
                            <span className="website-request-detail__business-id" title="Business ID">
                                Business ID: <code>{request.businessId}</code>
                            </span>
                        </div>

                        <dl className="website-request-detail__grid">
                            <dt>Owner</dt>
                            <dd>
                                {request.ownerFullName} ({request.ownerEmail})
                            </dd>

                            <dt>Template</dt>
                            <dd>
                                {request.templateLabel} ({request.templateName})
                            </dd>

                            <dt>Domain</dt>
                            <dd>{request.domainName}</dd>

                            <dt>Status</dt>
                            <dd>
                                <span className={`website-request-status website-request-status--${request.status.toLowerCase()}`}>
                                    {request.status}
                                </span>
                            </dd>

                            <dt>Submitted</dt>
                            <dd>{new Date(request.createdAt).toLocaleString()}</dd>

                            {request.buildStartedAt && (
                                <>
                                    <dt>Build started</dt>
                                    <dd>{new Date(request.buildStartedAt).toLocaleString()}</dd>
                                </>
                            )}

                            {request.closedAt && (
                                <>
                                    <dt>Closed</dt>
                                    <dd>
                                        {new Date(request.closedAt).toLocaleString()}
                                        {request.closedByFullName ? ` by ${request.closedByFullName}` : ""}
                                    </dd>
                                </>
                            )}

                            {request.finalWebsiteUrl && (
                                <>
                                    <dt>Final website</dt>
                                    <dd>
                                        <a href={request.finalWebsiteUrl} target="_blank" rel="noopener noreferrer">
                                            {request.finalWebsiteUrl}
                                        </a>
                                    </dd>
                                </>
                            )}
                        </dl>

                        <div className="website-request-detail__notes">
                            <span className="website-request-detail__notes-label">Customization notes</span>
                            <p>{request.customizationNotes}</p>
                        </div>

                        {request.status !== "Closed" && (
                            <div className="website-request-detail__actions">
                                {request.status === "Pending" && (
                                    <button
                                        type="button"
                                        className="business-dashboard-button-secondary"
                                        onClick={handleStartBuild}
                                        disabled={isStartingBuild || isClosing}
                                    >
                                        {isStartingBuild ? "Starting..." : "Start build"}
                                    </button>
                                )}

                                <div className="website-request-detail__close-form">
                                    <label htmlFor="final-website-url">Final website URL</label>
                                    <input
                                        id="final-website-url"
                                        type="text"
                                        className="dashboard-invite-input"
                                        value={finalWebsiteUrl}
                                        onChange={(e) => setFinalWebsiteUrl(e.target.value)}
                                        placeholder="https://customer-store.example.com"
                                        disabled={isClosing}
                                    />
                                    <button
                                        type="button"
                                        className="business-dashboard-button-primary"
                                        onClick={submitClose}
                                        disabled={isClosing || isStartingBuild}
                                    >
                                        {isClosing ? "Closing..." : "Close request"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && (
                            <p className="business-dashboard-form-error" role="alert">
                                {error}
                            </p>
                        )}
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <button type="button" className="dashboard-modal-cancel-btn" onClick={close}>
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default WebsiteTemplateRequestDetailModal;
