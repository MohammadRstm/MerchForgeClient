import { Route, Routes } from "react-router"
import PagesWithHeaderLayout from "../layout/PagesWithHeaders/PagesWithHeaders";
import AuthenticatedRoutes from "./AuthenticatedRoutes";
import ErrorBoundaryRoutes from "./ErrorBoundaryRoutes";
import OwnerRouteGuard from "./OwnerRouteGuard";
import AdminRouteGuard from "./AdminRouteGuard";
import Home from "../features/Home/Home";
import { routes } from "../config/routes";
import Login from "../features/Auth/Login/Login";
import AcceptInvitation from "../features/Auth/AcceptInvitation/AcceptInvitation";
import CustomerLogin from "../features/CustomerAuth/CustomerLogin/CustomerLogin";
import CustomerSignup from "../features/CustomerAuth/CustomerSignup/CustomerSignup";
import CustomerSilent from "../features/CustomerAuth/CustomerSilent/CustomerSilent";
import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import OwnerOverviewPage from "../features/Dashboard/BusinessOwnerDashboard/OwnerOverviewPage";
import OwnerProductsPage from "../features/Dashboard/BusinessOwnerDashboard/OwnerProductsPage";
import OwnerInventoryPage from "../features/Dashboard/BusinessOwnerDashboard/OwnerInventoryPage";
import OwnerOrdersPage from "../features/Dashboard/BusinessOwnerDashboard/OwnerOrdersPage";
import OwnerWebsitePage from "../features/Dashboard/BusinessOwnerDashboard/OwnerWebsitePage";
import OwnerSettingsPage from "../features/Dashboard/BusinessOwnerDashboard/OwnerSettingsPage";
import AdminOverviewPage from "../features/Dashboard/SuperAdminDashboard/AdminOverviewPage";
import AdminBusinessesPage from "../features/Dashboard/SuperAdminDashboard/AdminBusinessesPage";
import AdminBusinessDetailPage from "../features/Dashboard/SuperAdminDashboard/AdminBusinessDetailPage";
import AdminWebsiteRequestsPage from "../features/Dashboard/SuperAdminDashboard/AdminWebsiteRequestsPage";
import AdminTemplatesPage from "../features/Dashboard/SuperAdminDashboard/AdminTemplatesPage";
import AdminProductFieldsPage from "../features/Dashboard/SuperAdminDashboard/AdminProductFieldsPage";
import AdminUsersPage from "../features/Dashboard/SuperAdminDashboard/AdminUsersPage";
import AdminCustomersPage from "../features/Dashboard/SuperAdminDashboard/AdminCustomersPage";
import AdminCustomerDetailPage from "../features/Dashboard/SuperAdminDashboard/AdminCustomerDetailPage";
import WebsiteTemplateSelectionPage from "../features/Dashboard/WebsiteTemplateRequest/WebsiteTemplateSelectionPage";
import NotFound from "../features/NotFound/NotFound";

const AppRoutes = () =>{

    return(
        <Routes>
            <Route element={<ErrorBoundaryRoutes />}>

                <Route path={routes.HOME} element={<Home />} />
                <Route element={<PagesWithHeaderLayout />}>
                    <Route path={routes.ACCEPT_INVITATION} element={<AcceptInvitation />} />
                    <Route path={routes.LOGIN} element={<Login />} />
                    <Route path={routes.CUSTOMER_LOGIN} element={<CustomerLogin />} />
                    <Route path={routes.CUSTOMER_SIGNUP} element={<CustomerSignup />} />
                </Route>

                {/* No layout at all: this page is never seen by a person — it's loaded in a
                    hidden iframe or a flash-popup by the storefront SDK's silent-renewal
                    chain, and it must stay as small/fast as possible. */}
                <Route path={routes.CUSTOMER_SILENT} element={<CustomerSilent />} />

                {/* Dashboard routes intentionally do not use PagesWithHeaderLayout — a SaaS
                    dashboard shouldn't sit under the marketing nav bar. DashboardLayout is
                    their own chrome. */}
                <Route element={<AuthenticatedRoutes />}>
                    <Route element={<OwnerRouteGuard />}>
                        <Route path={routes.DASHBOARD} element={<DashboardLayout role="owner" />}>
                            <Route index element={<OwnerOverviewPage />} />
                            <Route path="products" element={<OwnerProductsPage />} />
                            <Route path="inventory" element={<OwnerInventoryPage />} />
                            <Route path="orders" element={<OwnerOrdersPage />} />
                            <Route path="website" element={<OwnerWebsitePage />} />
                            <Route path="settings" element={<OwnerSettingsPage />} />
                        </Route>
                        <Route path={routes.CHOOSE_WEBSITE_TEMPLATE} element={<WebsiteTemplateSelectionPage />} />
                    </Route>
                    <Route element={<AdminRouteGuard />}>
                        <Route path={routes.ADMIN} element={<DashboardLayout role="admin" />}>
                            <Route index element={<AdminOverviewPage />} />
                            <Route path="businesses" element={<AdminBusinessesPage />} />
                            <Route path="businesses/:businessId" element={<AdminBusinessDetailPage />} />
                            <Route path="website-requests" element={<AdminWebsiteRequestsPage />} />
                            <Route path="templates" element={<AdminTemplatesPage />} />
                            <Route path="product-fields" element={<AdminProductFieldsPage />} />
                            <Route path="users" element={<AdminUsersPage />} />
                            <Route path="customers" element={<AdminCustomersPage />} />
                            <Route path="customers/:customerId" element={<AdminCustomerDetailPage />} />
                        </Route>
                    </Route>
                </Route>

                {/* Last: anything that matched nothing above lands here rather than
                    rendering an empty page. */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;
