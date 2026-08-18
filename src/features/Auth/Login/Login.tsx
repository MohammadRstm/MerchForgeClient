import "./Login.css";
import { Link } from "react-router";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import useLoginPage from "./hooks/useLoginPage";

const Login = () => {
    const {
        loginFormData,
        loginError,
        errors,
        loginPending,
        submit,
        handleChange,
    } = useLoginPage();

    console.log(errors);
    return (
        <main className="login-page">
            <form className="login-form" onSubmit={submit}>

                <h1 className="login-title">Welcome Back</h1>

                <p className="login-subtitle">
                    Sign in to continue to your account.
                </p>

                {loginError && (
                    <div className="login-server-errors">
                        Invalid email or password.
                    </div>
                )}

                <label className="login-field">
                    <span className="login-label-text">Username</span>

                    <input
                        id="email"
                        name="Email"
                        className="login-form-inp"
                        type="text"
                        placeholder="Enter your email"
                        value={loginFormData.Email}
                        onChange={handleChange}
                    />

                    {errors?.Email && (
                        <p className="validation-errors">{errors.Email}</p>
                    )}
                </label>

                <label className="login-field">
                    <span className="login-label-text">Password</span>

                    <input
                        id="password"
                        name="Password"
                        className="login-form-inp"
                        type="password"
                        placeholder="Enter your password"
                        value={loginFormData.Password}
                        onChange={handleChange}
                    />

                    {errors?.Password && (
                        <p className="validation-errors">{errors.Password}</p>
                    )}
                </label>

                <button
                    className="login-submit-btn"
                    disabled={loginPending}
                >
                    {loginPending ? (
                        <Spinner size={20} />
                    ) : (
                        "Login"
                    )}
                </button>

                <p className="signup-suggestion">
                    Don't have an account?{" "}
                    <Link
                        className="signup-suggestion-link"
                        to="/signup"
                    >
                        Create one
                    </Link>
                </p>

            </form>
        </main>
    );
};

export default Login;