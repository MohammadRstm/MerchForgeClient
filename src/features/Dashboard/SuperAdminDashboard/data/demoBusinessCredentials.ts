/**
 * Login credentials for SuperAdmin-created demo/showcase businesses (Business.IsDemo),
 * keyed by businessId. Static and checked into the frontend deliberately -- these are
 * internal showcase accounts with no real customer data behind them, not a real
 * security boundary, so there's no reason to round-trip them through the backend.
 *
 * Add an entry here every time a new demo business is created via
 * POST Dashboard/businesses/demo.
 */
export const DEMO_BUSINESS_CREDENTIALS: Record<string, { email: string; password: string }> = {
    "b6770f8b-14a1-49ee-9c07-929e826e82ad": {
        email: "demo-fashion-01@merchforge.internal",
        password: "DemoFashion2026!",
    },
};
