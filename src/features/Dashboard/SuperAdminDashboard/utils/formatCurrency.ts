/**
 * Formats an amount in its own currency — a Super Admin views businesses across
 * different currencies, unlike the Owner dashboard's single hardcoded-USD formatter
 * (chartMetrics.ts), which is safe only because one business has one currency.
 */
export const formatCurrency = (amount: number, currencyCode: string): string => {
    try {
        return new Intl.NumberFormat(undefined, { style: "currency", currency: currencyCode }).format(amount);
    } catch {
        // An unrecognized/empty currency code shouldn't crash the page - fall back to a plain number.
        return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(amount);
    }
};

export const formatCompactCurrency = (amount: number, currencyCode: string): string => {
    try {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: currencyCode,
            notation: "compact",
            maximumFractionDigits: 1,
        }).format(amount);
    } catch {
        return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(amount);
    }
};
