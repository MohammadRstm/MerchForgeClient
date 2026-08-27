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
import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import OwnerOverviewPage from "../features/Dashboard/BusinessOwnerDashboard/OwnerOverviewPage";
import OwnerProductsPage from "../features/Dashboard/BusinessOwnerDashboard/OwnerProductsPage";
import OwnerWebsitePage from "../features/Dashboard/BusinessOwnerDashboard/OwnerWebsitePage";
import OwnerSettingsPage from "../features/Dashboard/BusinessOwnerDashboard/OwnerSettingsPage";
import AdminOverviewPage from "../features/Dashboard/SuperAdminDashboard/AdminOverviewPage";
import AdminBusinessesPage from "../features/Dashboard/SuperAdminDashboard/AdminBusinessesPage";
import AdminBusinessDetailPage from "../features/Dashboard/SuperAdminDashboard/AdminBusinessDetailPage";
import AdminWebsiteRequestsPage from "../features/Dashboard/SuperAdminDashboard/AdminWebsiteRequestsPage";
import AdminTemplatesPage from "../features/Dashboard/SuperAdminDashboard/AdminTemplatesPage";
import AdminUsersPage from "../features/Dashboard/SuperAdminDashboard/AdminUsersPage";
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
                </Route>

                {/* Dashboard routes intentionally do not use PagesWithHeaderLayout — a SaaS
                    dashboard shouldn't sit under the marketing nav bar. DashboardLayout is
                    their own chrome. */}
                <Route element={<AuthenticatedRoutes />}>
                    <Route element={<OwnerRouteGuard />}>
                        <Route path={routes.DASHBOARD} element={<DashboardLayout role="owner" />}>
                            <Route index element={<OwnerOverviewPage />} />
                            <Route path="products" element={<OwnerProductsPage />} />
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
                            <Route path="users" element={<AdminUsersPage />} />
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
