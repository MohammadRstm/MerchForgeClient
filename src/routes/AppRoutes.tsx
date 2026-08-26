import { Route, Routes } from "react-router"
import PagesWithHeaderLayout from "../layout/PagesWithHeaders/PagesWithHeaders";
import AuthenticatedRoutes from "./AuthenticatedRoutes";
import ErrorBoundaryRoutes from "./ErrorBoundaryRoutes";
import Home from "../features/Home/Home";
import { routes } from "../config/routes";
import Login from "../features/Auth/Login/Login";
import AcceptInvitation from "../features/Auth/AcceptInvitation/AcceptInvitation";
import DashboardPage from "../features/Dashboard/DashboardPage";
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
                    <Route element={<AuthenticatedRoutes />}>
                        <Route path={routes.DASHBOARD} element={<DashboardPage />} />
                        <Route path={routes.CHOOSE_WEBSITE_TEMPLATE} element={<WebsiteTemplateSelectionPage />} />
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