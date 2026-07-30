import "./Header.css";
import { Link } from "react-router";
import { IoSearch } from "react-icons/io5";

const Header = () =>{

    return(
        <div className="header">
            <div className="header-logo">
               <Link className="home-link" to="/">Logo</Link>
            </div> 
             
            
            <div className="header-search-bar">
                <input
                className="header-search-inp"
                name="movie"
                type="text"
                placeholder="Search..."
                />

                <button
                className="header-search-submit-btn"
                >
                    <IoSearch />
                </button>
            </div>
            

            <div className="header-nav-bar">
                <Link className="header-nav-link header-aboutus-link" to="/aboutus">Aboutus</Link>
                <Link className="header-nav-link header-login-link" to="/login">Login</Link>
                <Link className="header-nav-link header-signup-link" to="/signup">Signup</Link>
            </div>

        </div>
    );
}

export default Header;