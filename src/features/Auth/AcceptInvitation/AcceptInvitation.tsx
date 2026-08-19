import { Link } from "react-router";
import logo from "./../../../assets/logo.svg";
import { routes } from "./../../../config/routes";
import "./AcceptInvitation.css";
import useAcceptInvitationPage from "./hooks/useAcceptInvitationPage";

const Brand = (
  <a href="/" className="invite__brand">
    <img src={logo} alt="" className="invite__brand-mark" />
    <span className="invite__brand-name">MerchForge</span>
  </a>
);

export default function AcceptInvitation() {
  const {
    acceptInvitationFormData,
    errors,
    isInvitationInvalid,
    acceptInvitationPending,
    acceptInvitationError,
    acceptInvitationSuccess,

    submit,
    handleChange,
  } = useAcceptInvitationPage();

  if (isInvitationInvalid) {
    return (
      <main className="invite">
        <div className="invite__panel">
          {Brand}
          <div className="invite__card invite__card--status">
            <h1 className="invite__headline">This invitation link isn't valid.</h1>
            <p className="invite__subtext">
              We couldn't find a valid email address on this link. Double-check the invitation
              email, or reach out and we'll send you a new one.
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
              Your MerchForge account has been created. You can log in now and start setting up
              your catalog.
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
          <h1 className="invite__headline">You're almost in.</h1>
          <p className="invite__subtext">
            Fill in your details to finish setting up your MerchForge business account.
          </p>

          <form className="invite__form" onSubmit={submit} noValidate>
            <div className="invite__row">
              <div className="invite__field">
                <label htmlFor="FirstName" className="invite__label">
                  First name
                </label>
                <input
                  id="FirstName"
                  name="FirstName"
                  type="text"
                  autoComplete="given-name"
                  className={`invite__input${errors.FirstName ? ' invite__input--error' : ''}`}
                  value={acceptInvitationFormData.FirstName}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.FirstName)}
                  aria-describedby={errors.FirstName ? 'FirstName-error' : undefined}
                />
                {errors.FirstName && (
                  <span id="FirstName-error" className="invite__error" role="alert">
                    {errors.FirstName}
                  </span>
                )}
              </div>

              <div className="invite__field">
                <label htmlFor="LastName" className="invite__label">
                  Last name
                </label>
                <input
                  id="LastName"
                  name="LastName"
                  type="text"
                  autoComplete="family-name"
                  className={`invite__input${errors.LastName ? ' invite__input--error' : ''}`}
                  value={acceptInvitationFormData.LastName}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.LastName)}
                  aria-describedby={errors.LastName ? 'LastName-error' : undefined}
                />
                {errors.LastName && (
                  <span id="LastName-error" className="invite__error" role="alert">
                    {errors.LastName}
                  </span>
                )}
              </div>
            </div>

            <div className="invite__field">
              <label htmlFor="BusinessName" className="invite__label">
                Business name
              </label>
              <input
                id="BusinessName"
                name="BusinessName"
                type="text"
                autoComplete="organization"
                className={`invite__input${errors.BusinessName ? ' invite__input--error' : ''}`}
                value={acceptInvitationFormData.BusinessName}
                onChange={handleChange}
                aria-invalid={Boolean(errors.BusinessName)}
                aria-describedby={errors.BusinessName ? 'BusinessName-error' : undefined}
              />
              {errors.BusinessName && (
                <span id="BusinessName-error" className="invite__error" role="alert">
                  {errors.BusinessName}
                </span>
              )}
            </div>

            <div className="invite__field">
              <label htmlFor="email" className="invite__label">
                Email
              </label>
              <input
                id="email"
                name="Email"
                type="email"
                className="invite__input invite__input--disabled"
                value={acceptInvitationFormData.Email}
                disabled
                readOnly
              />
              <span className="invite__hint">This is the email your invitation was sent to.</span>
            </div>

            {acceptInvitationError && (
              <p className="invite__form-error" role="alert">
                Something went wrong submitting your registration. Please try again.
              </p>
            )}

            <button type="submit" className="invite__submit" disabled={acceptInvitationPending}>
              {acceptInvitationPending ? 'Creating account…' : 'Complete registration'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
