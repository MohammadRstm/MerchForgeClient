import useDashboardStats from "./data/useDashboardStats";
import useInviteBusinessOwnerForm from "./ui/useInviteBusinessOwnerForm";

const useAdminOverviewPage = () => {
    const {
        data: stats,
        isLoading: statsLoading,
        isError: statsError,
    } = useDashboardStats();

    const inviteForm = useInviteBusinessOwnerForm();

    return {
        stats,
        statsLoading,
        statsError,
        inviteForm,
    };
};

export default useAdminOverviewPage;
