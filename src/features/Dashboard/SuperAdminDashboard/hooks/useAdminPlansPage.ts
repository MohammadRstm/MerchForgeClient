import useSubscriptionPlans from "./data/useSubscriptionPlans";
import useCreateSubscriptionPlanForm from "./ui/useCreateSubscriptionPlanForm";
import useSubscriptionPlanDetailModal from "./ui/useSubscriptionPlanDetailModal";

const useAdminPlansPage = () => {
    const {
        data: subscriptionPlans,
        isLoading: subscriptionPlansLoading,
        isError: subscriptionPlansError,
    } = useSubscriptionPlans();

    const createPlanForm = useCreateSubscriptionPlanForm();
    const subscriptionPlanDetailModal = useSubscriptionPlanDetailModal();

    return {
        subscriptionPlans,
        subscriptionPlansLoading,
        subscriptionPlansError,
        createPlanForm,
        subscriptionPlanDetailModal,
    };
};

export default useAdminPlansPage;
