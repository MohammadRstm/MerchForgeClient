import { Link } from "react-router";
import logo from "./../../../assets/logo.svg";
import { routes } from "./../../../config/routes";
import Modal from "./../../../components/Modal/Modal";
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
    rawPassword,
    isPasswordModalOpen,

    domains,
    domainsLoading,
    domainsError,
    domainCategories,
    categoriesLoading,

    newCategoryInput,
    newCategoryError,

    submit,
    handleChange,
    onDomainChange,
    addNewCategory,
    removeNewCategory,
    handleNewCategoryInputChange,
    closePasswordModal,
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

        <Modal isOpen={isPasswordModalOpen} onClose={closePasswordModal}>
          <Modal.Header>
            <h2>Save your password</h2>
          </Modal.Header>
          <Modal.Body>
            <div>
              <p className="invite__subtext">
                This is your account password. For security reasons we can't show it to you
                again, so save it somewhere safe before you continue.
              </p>
              <p className="invite__password">{rawPassword}</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="invite__submit"
              onClick={closePasswordModal}
            >
              I've saved my password
            </button>
          </Modal.Footer>
        </Modal>
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

            <div className="invite__field">
              <label htmlFor="BusinessDomainId" className="invite__label">
                What does your business sell?
              </label>
              <select
                id="BusinessDomainId"
                name="BusinessDomainId"
                className={`invite__input${errors.BusinessDomainId ? ' invite__input--error' : ''}`}
                value={acceptInvitationFormData.BusinessDomainId}
                onChange={(e) => onDomainChange(e.target.value)}
                disabled={domainsLoading || domainsError}
                aria-invalid={Boolean(errors.BusinessDomainId)}
                aria-describedby={errors.BusinessDomainId ? 'BusinessDomainId-error' : undefined}
              >
                <option value="">
                  {domainsLoading ? 'Loading…' : 'Select a business type'}
                </option>
                {domains?.map((domain) => (
                  <option key={domain.id} value={domain.id}>
                    {domain.name}
                  </option>
                ))}
              </select>
              <span className="invite__hint">
                This determines the product categories available to your store.
              </span>
              {domainsError && (
                <span className="invite__error" role="alert">
                  Couldn't load business types. Refresh the page and try again.
                </span>
              )}
              {errors.BusinessDomainId && (
                <span id="BusinessDomainId-error" className="invite__error" role="alert">
                  {errors.BusinessDomainId}
                </span>
              )}
            </div>

            {acceptInvitationFormData.BusinessDomainId && (
              <div className="invite__field">
                <span className="invite__label">Your categories</span>

                {categoriesLoading ? (
                  <span className="invite__hint">Loading categories…</span>
                ) : (
                  <>
                    <span className="invite__hint">
                      These come with your business type and are ready to use.
                    </span>
                    <ul className="invite__chips" data-testid="existing-categories">
                      {domainCategories?.map((category) => (
                        <li key={category.id} className="invite__chip">
                          {category.name}
                        </li>
                      ))}
                    </ul>

                    <span className="invite__hint">
                      Need something else? Add it below — it'll be private to your store.
                    </span>

                    {acceptInvitationFormData.NewCategoryNames.length > 0 && (
                      <ul className="invite__chips" data-testid="new-categories">
                        {acceptInvitationFormData.NewCategoryNames.map((name) => (
                          <li key={name} className="invite__chip invite__chip--custom">
                            {name}
                            <button
                              type="button"
                              className="invite__chip-remove"
                              onClick={() => removeNewCategory(name)}
                              aria-label={`Remove ${name}`}
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="invite__category-add">
                      <input
                        id="NewCategory"
                        type="text"
                        placeholder="e.g. Vintage"
                        className={`invite__input${newCategoryError ? ' invite__input--error' : ''}`}
                        value={newCategoryInput}
                        onChange={(e) => handleNewCategoryInputChange(e.target.value)}
                        onKeyDown={(e) => {
                          // Enter adds a category rather than submitting the whole
                          // form, which would be a surprising way to lose the input.
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addNewCategory();
                          }
                        }}
                        aria-label="New category name"
                        aria-invalid={Boolean(newCategoryError)}
                      />
                      <button
                        type="button"
                        className="invite__add-category"
                        onClick={addNewCategory}
                        disabled={!newCategoryInput.trim()}
                      >
                        Add
                      </button>
                    </div>

                    {newCategoryError && (
                      <span className="invite__error" role="alert">
                        {newCategoryError}
                      </span>
                    )}
                    {errors.NewCategoryNames && (
                      <span className="invite__error" role="alert">
                        {errors.NewCategoryNames}
                      </span>
                    )}
                  </>
                )}
              </div>
            )}

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
