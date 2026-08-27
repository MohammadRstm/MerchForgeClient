import useDashboardWebsiteTemplates from "./data/useDashboardWebsiteTemplates";
import useCreateWebsiteTemplateForm from "./ui/useCreateWebsiteTemplateForm";
import useWebsiteTemplateDetailModal from "./ui/useWebsiteTemplateDetailModal";

const useAdminTemplatesPage = () => {
    const {
        data: websiteTemplates,
        isLoading: websiteTemplatesLoading,
        isError: websiteTemplatesError,
    } = useDashboardWebsiteTemplates();

    const createTemplateForm = useCreateWebsiteTemplateForm();
    const websiteTemplateDetailModal = useWebsiteTemplateDetailModal();

    return {
        websiteTemplates,
        websiteTemplatesLoading,
        websiteTemplatesError,
        createTemplateForm,
        websiteTemplateDetailModal,
    };
};

export default useAdminTemplatesPage;
