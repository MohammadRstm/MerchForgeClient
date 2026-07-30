import { Outlet } from "react-router";
import Header from "../../features/Header/Header";
import "./PagesWithHeaderLayout.css";

const PagesWithHeaderLayout = () =>{
    return(
        <>
            <Header />
            <Outlet />
        </>
    );
}

export default PagesWithHeaderLayout;