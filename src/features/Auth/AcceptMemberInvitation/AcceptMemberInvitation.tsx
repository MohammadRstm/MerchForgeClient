import { Link } from "react-router";
import logo from "./../../../assets/logo.svg";
import { routes } from "./../../../config/routes";
import "./../AcceptInvitation/AcceptInvitation.css";
import useAcceptMemberInvitationPage from "./hooks/useAcceptMemberInvitationPage";

const Brand = (
  <a href="/" className="invite__brand">
    <img src={logo} alt="" className="invite__brand-mark" />
    <span className="invite__brand-name">MerchForge</span>
  </a>
);

export default function AcceptMemberInvitation() {
  const {
    formData,
    errors,
    isInvitationInvalid,
    acceptInvitationPending,
    acceptInvitationError,
    acceptInvitationSuccess,
    handleChange,
    submit,
  } = useAcceptMemberInvitationPage();

  if (isInvitationInvalid) {
    return (
      <main className="invite">
        <div className="invite__panel">
          {Brand}
          <div className="invite__card invite__card--status">
            <h1 className="invite__headline">This invitation link isn't valid.</h1>
            <p className="invite__subtext">
              We couldn't find an invitation token on this link. Double-check the
              invitation email, or ask whoever added you to send a new one.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (acceptInvitationSuccess) {
    return (
      <main className="invite">
        <div className="invite__panel">
          {Brand}
          <div className="invite__card invite__card--status">
            <h1 className="invite__headline">You're all set.</h1>
            <p className="invite__subtext">
              Your password is set and your account is ready. You can log in now.
            </p>
            <Link to={routes.LOGIN} className="invite__submit invite__submit--link">
              Go to login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="invite">
      <div className="invite__panel">
        {Brand}

        <div className="invite__card">
          <p className="invite__eyebrow">Complete your registration</p>
          <h1 className="invite__headline">Set your password.</h1>
          <p className="invite__subtext">
            You've been added to a team on MerchForge. Choose a password to finish
            setting up your account.
          </p>

          <form className="invite__form" onSubmit={submit} noValidate>
            <div className="invite__field">
              <label htmlFor="Password" className="invite__label">
                Password
              </label>
              <input
                id="Password"
                name="Password"
                type="password"
                autoComplete="new-password"
                className={`invite__input${errors.Password ? ' invite__input--error' : ''}`}
                value={formData.Password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.Password)}
                aria-describedby={errors.Password ? 'Password-error' : undefined}
                autoFocus
              />
              {errors.Password && (
                <span id="Password-error" className="invite__error" role="alert">
                  {errors.Password}
                </span>
              )}
            </div>

            <div className="invite__field">
              <label htmlFor="ConfirmPassword" className="invite__label">
                Confirm password
              </label>
              <input
                id="ConfirmPassword"
                name="ConfirmPassword"
                type="password"
                autoComplete="new-password"
                className={`invite__input${errors.ConfirmPassword ? ' invite__input--error' : ''}`}
                value={formData.ConfirmPassword}
                onChange={handleChange}
                aria-invalid={Boolean(errors.ConfirmPassword)}
                aria-describedby={errors.ConfirmPassword ? 'ConfirmPassword-error' : undefined}
              />
              {errors.ConfirmPassword && (
                <span id="ConfirmPassword-error" className="invite__error" role="alert">
                  {errors.ConfirmPassword}
                </span>
              )}
            </div>

            {acceptInvitationError && (
              <p className="invite__form-error" role="alert">
                Something went wrong setting your password. The link may have expired
                — ask whoever added you to send a new invitation, or try again.
              </p>
            )}

            <button type="submit" className="invite__submit" disabled={acceptInvitationPending}>
              {acceptInvitationPending ? 'Setting password…' : 'Set password'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
