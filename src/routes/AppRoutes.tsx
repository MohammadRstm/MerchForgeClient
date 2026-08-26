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
import BusinessOwnerDashboard from "../features/Dashboard/BusinessOwnerDashboard/BusinessOwnerDashboard";
import SuperAdminDashboard from "../features/Dashboard/SuperAdminDashboard/SuperAdminDashboard";
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
                            {/* Overview is still the full pre-redesign dashboard component for
                                now; it gets decomposed into Overview/Products/Website/Settings
                                pages in a follow-up commit, once this shell is verified. */}
                            <Route index element={<BusinessOwnerDashboard />} />
                        </Route>
                        <Route path={routes.CHOOSE_WEBSITE_TEMPLATE} element={<WebsiteTemplateSelectionPage />} />
                    </Route>
                    <Route element={<AdminRouteGuard />}>
                        <Route path={routes.ADMIN} element={<DashboardLayout role="admin" />}>
                            <Route index element={<SuperAdminDashboard />} />
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
