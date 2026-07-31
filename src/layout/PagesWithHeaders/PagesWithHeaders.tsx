import { Outlet } from "react-router";
import Header from "../../features/Header/Header";
import "./PagesWithHeaders.css";

const PagesWithHeaderLayout = () =>{
    return(
        <>
            <Header />
            <Outlet />
        </>
    );
}

export default PagesWithHeaderLayout;