import { useState } from "react";
import useDashboardCustomers from "./data/useDashboardCustomers";
import useCustomerStats from "./data/useCustomerStats";
import useCustomerGrowth from "./data/useCustomerGrowth";
import useCustomerDistribution from "./data/useCustomerDistribution";
import useRecentCustomers from "./data/useRecentCustomers";
import useBusinessOptions from "./data/useBusinessOptions";
import useCustomersTableState from "./ui/useCustomersTableState";
import useCustomerGrowthPeriod from "./ui/useCustomerGrowthPeriod";
import useTopCustomersPanel from "./ui/useTopCustomersPanel";

const NEW_CUSTOMERS_PERIOD_DAYS = 30;

const useAdminCustomersPage = () => {
    const customersTable = useCustomersTableState();

    const {
        data: customersPage,
        isLoading: customersLoading,
        isFetching: customersFetching,
        isError: customersError,
    } = useDashboardCustomers(customersTable.query);

    const [statsPeriodDays, setStatsPeriodDays] = useState(NEW_CUSTOMERS_PERIOD_DAYS);
    const { data: stats, isLoading: statsLoading, isError: statsError } = useCustomerStats(statsPeriodDays);

    const growthPeriod = useCustomerGrowthPeriod();
    const { data: growth, isLoading: growthLoading, isError: growthError } = useCustomerGrowth(growthPeriod.days);

    const {
        data: distribution,
        isLoading: distributionLoading,
        isError: distributionError,
    } = useCustomerDistribution();

    const {
        data: recentCustomers,
        isLoading: recentCustomersLoading,
        isError: recentCustomersError,
    } = useRecentCustomers();

    const { data: businessOptions } = useBusinessOptions();

    const topCustomers = useTopCustomersPanel();

    const goToBusiness = (businessName: string) => {
        const match = businessOptions?.find((b) => b.name === businessName);
        if (match) {
            customersTable.handleBusinessChange(match.id, match.name);
        }
    };

    return {
        customersPage,
        customersLoading,
        customersFetching,
        customersError,
        customersTable,
        businessOptions: businessOptions ?? [],

        stats,
        statsLoading,
        statsError,
        statsPeriodDays,
        setStatsPeriodDays,

        growth,
        growthLoading,
        growthError,
        growthPeriod,

        distribution,
        distributionLoading,
        distributionError,
        goToBusiness,

        recentCustomers,
        recentCustomersLoading,
        recentCustomersError,

        topCustomers,
    };
};

export default useAdminCustomersPage;
