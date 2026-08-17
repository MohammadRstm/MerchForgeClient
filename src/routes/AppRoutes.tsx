import { Route, Routes } from "react-router"
import PagesWithHeaderLayout from "../layout/PagesWithHeaders/PagesWithHeaders";
import AuthenticatedRoutes from "./AuthenticatedRoutes";
import ErrorBoundaryRoutes from "./ErrorBoundaryRoutes";
import Home from "../features/Home/Home";
import { routes } from "../config/routes";
import Login from "../features/Auth/Login/Login";
import AcceptInvitation from "../features/Auth/AcceptInvitation/AcceptInvitation";

const AppRoutes = () =>{

    return(
        <Routes>
            <Route element={<ErrorBoundaryRoutes />}>

                <Route path={routes.HOME} element={<Home />} />
                <Route element={<PagesWithHeaderLayout />}>
                    <Route path={routes.ACCEPT_INVITATION} element={<AcceptInvitation />} />
                    <Route path={routes.LOGIN} element={<Login />} />
                    <Route element={<AuthenticatedRoutes />}>
                        {/** EX USER PROFILE */}
                    </Route>    
                </Route>
            </Route>
        </Routes>
    );
}

export default AppRoutes;