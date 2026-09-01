import { useState } from "react";

export const GROWTH_PERIOD_OPTIONS = [
    { label: "7 Days", days: 7 },
    { label: "30 Days", days: 30 },
    { label: "6 Months", days: 182 },
    { label: "1 Year", days: 365 },
] as const;

const useCustomerGrowthPeriod = () => {
    const [days, setDays] = useState<number>(30);

    return { days, setDays };
};

export default useCustomerGrowthPeriod;
