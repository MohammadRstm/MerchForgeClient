import { useEffect } from "react";
import "./Contact.css";
import Spinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useContactForm } from "./hooks/useContactForm";
import "../Home/Home.css";

const Contact = () => {
    const { formData, errors, serverError, isPending, isSuccess, handleChange, submit } =
        useContactForm();

    // Auto-scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="contact-page mf-section">
            <div className="contact-page__inner mf-section__inner">
                <p className="mf-eyebrow">Contact</p>
                <h1 className="mf-headline contact-page__headline">Get in touch</h1>
                <p className="contact-page__tagline mf-subtext">
                    Have a question? We'd love to hear from you. Send us a message and we'll
                    respond as soon as possible.
                </p>

                <div className="contact-page__content">
                    <div className="contact-page__form-wrapper">
                        {isSuccess ? (
                            <div className="contact-page__success">
                                <div className="contact-page__success-icon">✓</div>
                                <h2 className="contact-page__success-headline">Thank you!</h2>
                                <p className="contact-page__success-message">
                                    Your message has been received. We'll be in touch shortly.
                                </p>
                            </div>
                        ) : (
                            <form className="contact-page__form" onSubmit={submit}>
                                {serverError && (
                                    <div className="contact-page__server-error">{serverError}</div>
                                )}

                                <div className="contact-page__form-group">
                                    <label htmlFor="name" className="contact-page__label">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        className="contact-page__input"
                                        placeholder="Your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={isPending}
                                        maxLength={120}
                                    />
                                    {errors.name && (
                                        <p className="contact-page__field-error">{errors.name}</p>
                                    )}
                                </div>

                                <div className="contact-page__form-group">
                                    <label htmlFor="email" className="contact-page__label">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="contact-page__input"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={isPending}
                                        maxLength={254}
                                    />
                                    {errors.email && (
                                        <p className="contact-page__field-error">{errors.email}</p>
                                    )}
                                </div>

                                <div className="contact-page__form-group">
                                    <label htmlFor="subject" className="contact-page__label">
                                        Subject
                                    </label>
                                    <input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        className="contact-page__input"
                                        placeholder="What is this about?"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        disabled={isPending}
                                        maxLength={150}
                                    />
                                    {errors.subject && (
                                        <p className="contact-page__field-error">{errors.subject}</p>
                                    )}
                                </div>

                                <div className="contact-page__form-group">
                                    <label htmlFor="message" className="contact-page__label">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        className="contact-page__textarea"
                                        placeholder="Tell us more..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        disabled={isPending}
                                        maxLength={4000}
                                        rows={6}
                                    />
                                    {errors.message && (
                                        <p className="contact-page__field-error">{errors.message}</p>
                                    )}
                                    <p className="contact-page__char-count">
                                        {formData.message.length} / 4000
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    className="mf-btn mf-btn--primary contact-page__submit"
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <span className="contact-page__submit-spinner">
                                            <Spinner size={16} />
                                        </span>
                                    ) : (
                                        "Send message"
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="contact-page__methods">
                        <div className="contact-page__method">
                            <h3 className="contact-page__method-title">WhatsApp</h3>
                            <p className="contact-page__method-text">
                                Message us on WhatsApp for faster response.
                            </p>
                            <a
                                href="https://wa.me/96171317958"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mf-btn mf-btn--secondary contact-page__method-btn"
                            >
                                Open WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Contact;
