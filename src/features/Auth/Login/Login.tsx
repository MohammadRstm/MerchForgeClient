import "./Login.css";
import { Link } from "react-router";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import useLoginPage from "./hooks/useLoginPage";

const Login = () =>{

    const {
        loginFormData,
        loginError,
        errors,
        loginPending,

        submit,
        handleChange,
    } = useLoginPage();


    return(
        <form className="login-form" onSubmit={submit}>

            <h2 className="login-title">
                Welcome Back!
            </h2>
            
            {loginError && (
                <div className="login-server-errors">
                    Invalid username or passwrod
                </div>
            )}

            <label>

                <p className="login-label-text username-login-label">Username</p>
                <input
                id="username"
                name="username"
                className="login-form-inp username-login-inp"
                type="text"
                placeholder="Enter your username..."
                value={loginFormData.username}
                onChange={handleChange}
                />
                
                {errors && (
                    <p className="validation-erros">{errors.username}</p>
                )}

            </label>

            <label>

                <p className="login-label-text password-login-label">Password</p>
                <input
                id="password"
                name="password"
                className="login-form-inp password-login-inp"
                type="password"
                placeholder="Enter your password..."
                value={loginFormData.password}
                onChange={handleChange}
                />

                {errors && (
                    <p className="validation-erros">{errors.password}</p>
                )}

            </label>

            <div className="submit-btn-container">

                <input
                type="submit"
                className="login-submit-btn"
                value="Login"
                />
                {loginPending && (
                    <Spinner
                    size={20}
                    />
                )}
                <p className="singup-suggestion">Don't have an account? <Link className="signup-suggestion-link" to="/signup">Signup</Link></p>

            </div>

        </form>
    );
}

export default Login;