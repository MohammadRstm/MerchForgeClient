import "./Signup.css";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { Link } from "react-router";
import useSignupPage from "./hooks/useSignupPage";

const Signup = () =>{

    const {
        signupFormData,
        registrationServerError,
        errors,
        loadingRegistration,

        submit,
        handleChange,
    } = useSignupPage();

    return(
        <form className="signup-form" onSubmit={submit}>
            <h2 className="singup-title">
                    Welcome To Movie Hub!
            </h2>
                
            {registrationServerError && (
                <div className="signup-errors">
                    Invalid username or passwrod or name we don't know
                </div>
            )}

            <label>

                <p className="sigup-label-text firstname-signup-label">Firstname</p>
                <input
                id="firstname"
                name="firstname"
                className="signup-form-inp firstname-signup-inp"
                type="text"
                placeholder="Enter your firstname..."
                value={signupFormData.firstname}
                onChange={handleChange}
                />

                {errors.firstname && (
                    <p className="error">{errors.firstname}</p>
                )}

            </label>
            
            <label>

                <p className="signup-label-text lastname-signup-label">Lastname</p>
                <input
                id="lastname"
                name="lastname"
                className="signup-form-inp lastname-singup-inp"
                type="text"
                placeholder="Enter your lastname..."
                value={signupFormData.lastname}
                onChange={handleChange}
                />


                {errors.lastname && (
                    <p className="error">{errors.lastname}</p>
                )}

            </label>
            
            <label>

                <p className="signup-label-text username-signup-label">Username</p>
                <input
                id="username"
                name="username"
                className="signup-form-inp username-signup-inp"
                type="text"
                placeholder="Enter your username..."
                value={signupFormData.username}
                onChange={handleChange}
                />

                {errors.username && (
                    <p className="error">{errors.username}</p>
                )}

            </label>
            
            <label>

                <p className="signup-label-text password-signup-label">Password</p>
                <input
                id="password"
                name="password"
                className="signup-form-inp password-signup-inp"
                type="password"
                placeholder="Enter your password..."
                value={signupFormData.password}
                onChange={handleChange}
                />

                {errors.password && (
                    <p className="error">{errors.password}</p>
                )}

            </label>

                <div className="submit-btn-container">

                    <input
                    type="submit"
                    className="singup-submit-btn"
                    value="Register"
                    />
                    {loadingRegistration && (
                        <Spinner
                        size={20}
                        />
                    )}
                    <p className="login-suggestion">Already have an account? <Link className="login-suggestion-link" to="/login">Login</Link></p>

                </div>
        </form>
    );
}

export default Signup;