import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CustomerSilent from './features/CustomerAuth/CustomerSilent/CustomerSilent.tsx'
import { routes } from './config/routes.ts'

const root = createRoot(document.getElementById('root')!)

// /customer/silent is loaded in a hidden iframe or a flash-popup by every storefront
// using the SDK, on every page load, regardless of whether anyone is signed in as a
// customer -- it must do nothing but read the customerRefreshToken cookie, as fast as
// possible (the SDK gives it a few seconds before falling back to the next step in
// its renewal chain). Routing it through the normal AppProviders -> App tree mounted
// AuthProvider unconditionally too, which calls POST /api/Auth/refresh on mount --
// the OWNER's own refresh endpoint, entirely unrelated to customer auth. Confirmed
// live: any storefront reload silently exercised the *business owner's* session
// (rotating or clearing their refresh cookie/localStorage) purely as a side effect of
// this page happening to sit inside the same app shell, breaking a real owner's
// dashboard session in another tab despite them never touching the storefront's
// login. App/AppProviders are dynamically imported (not statically, at the top of
// this file) specifically so this branch never even fetches/parses the dashboard's
// module graph, not just avoids rendering it -- this route must stay small and fast,
// and a static import would defeat that regardless of which branch actually renders.
if (window.location.pathname === routes.CUSTOMER_SILENT) {
    root.render(
        <StrictMode>
            <CustomerSilent />
        </StrictMode>
    )
} else {
    void Promise.all([
        import('./App.tsx'),
        import('./providers/AppProvider.tsx'),
    ]).then(([{ default: App }, { default: AppProviders }]) => {
        root.render(
            <StrictMode>
                <AppProviders>
                    <App />
                </AppProviders>
            </StrictMode>
        )
    })
}
