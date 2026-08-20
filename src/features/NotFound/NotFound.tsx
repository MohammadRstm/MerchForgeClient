import { Link } from "react-router";
import { routes } from "../../config/routes";
import "./NotFound.css";

/**
 * Catch-all for any path no route matches.
 *
 * Without it an unmatched URL rendered nothing at all — a blank white page with
 * no way back — which is what a typo, a stale bookmark, or a link to a page that
 * was never built all produced.
 */
const NotFound = () => {
    return (
        <div className="notfound-page">

            <div className="notfound-card">

                <div className="notfound-code">
                    404
                </div>

                <h1 className="notfound-title">
                    We can't find that page.
                </h1>

                <p className="notfound-text">
                    The link may be out of date, or the page may never have existed.
                </p>

                <div className="notfound-actions">
                    <Link to={routes.HOME} className="notfound-btn">
                        Back to home
                    </Link>

                    <Link to={routes.LOGIN} className="notfound-btn notfound-btn--ghost">
                        Log in
                    </Link>
                </div>

            </div>

        </div>
    );
};

export default NotFound;
