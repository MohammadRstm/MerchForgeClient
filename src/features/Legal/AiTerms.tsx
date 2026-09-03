import { Link } from "react-router";
import LegalPage from "./components/LegalPage";
import { routes } from "../../config/routes";
import { LEGAL_EFFECTIVE_DATE, LEGAL_VERSIONS } from "./legalMeta";

const AiTerms = () => (
    <LegalPage title="AI Terms" version={LEGAL_VERSIONS.aiTerms} effectiveDate={LEGAL_EFFECTIVE_DATE}>
        <p>
            These AI Terms are part of our <Link to={routes.TERMS}>Terms of Service</Link>{" "}
            and apply whenever you use one of MerchForge's AI-assisted features. They exist
            because AI-generated content works differently from content you write or
            upload yourself, and you should understand exactly how before you rely on it.
        </p>

        <h2>1. What the AI Features Do</h2>
        <p>MerchForge currently offers three AI-assisted features, each optional:</p>
        <ul>
            <li>
                <strong>AI product-listing assistant</strong> — a text (or voice)
                conversation that helps draft a product's title, description, price,
                category, SKU, stock, tags, and other details from what you tell it.
            </li>
            <li>
                <strong>AI image editing</strong> — edits an existing product photo
                according to a text instruction you give (for example, changing the
                background or the product's color).
            </li>
            <li>
                <strong>AI "suggest details from a photo"</strong> — proposes product field
                values based only on what's visible in a photo you upload.
            </li>
        </ul>

        <h2>2. What Is Sent to the AI Provider</h2>
        <p>
            Full detail on exactly what data is sent to which provider for each feature is
            in our <Link to={routes.PRIVACY}>Privacy Policy</Link>, Section 3. In short:
            the product-listing assistant sends your conversation and business/category
            context to OpenAI (and your voice recording, if used, to OpenAI's
            transcription service); the image features send the product photo itself and
            your instruction to Google's Gemini models. Submitting an image or a voice
            recording to these features means that content leaves MerchForge and is
            processed by that third party.
        </p>

        <h2>3. What MerchForge Stores</h2>
        <p>
            MerchForge stores the conversation text, the resulting draft, and — for the
            image features — the instruction text and the URLs of the images involved,
            tied to your business account, as a record of what was asked for and what came
            back. See our <Link to={routes.PRIVACY}>Privacy Policy</Link>, Section 6, for
            the full detail, including what MerchForge's own operational logs deliberately
            exclude.
        </p>

        <h2>4. You Must Have the Right to Submit What You Upload</h2>
        <p>
            You must own, or otherwise have the necessary rights to, any photo or content
            you submit to an AI feature — including the right to have it processed and
            edited by a third-party AI provider on your behalf. Do not submit a photo you
            found online, a competitor's product image, or anything you do not have
            permission to use this way.
        </p>

        <h2>5. Prohibited Submissions</h2>
        <p>
            Do not submit anything to an AI feature that would violate our{" "}
            <Link to={routes.ACCEPTABLE_USE}>Acceptable Use Policy</Link> — including
            content that is unlawful, infringing, or depicts a real person without their
            consent in a way intended to deceive.
        </p>

        <h2>6. AI Output May Be Inaccurate — Review Before You Publish</h2>
        <div className="legal-page__callout">
            <p>
                <strong>AI-generated descriptions and images can be wrong.</strong> A
                description may misstate a product's materials, dimensions, or features; an
                edited image may not look the way you expect. You must review every
                AI-generated product description and image before publishing it to your
                storefront — MerchForge does not review or verify AI output on your behalf,
                and nothing is published automatically without your action.
            </p>
        </div>

        <h2>7. You Are Responsible for How You Use Generated Content</h2>
        <p>
            Once you publish AI-assisted content on your storefront, it is your product
            listing — subject to the same responsibilities as anything else you publish
            under our <Link to={routes.TERMS}>Terms of Service</Link>, Section 9. This
            includes making sure the listing is accurate and doesn't mislead a customer,
            even if the inaccuracy originated from the AI output.
        </p>

        <h2>8. No Guarantee of Uniqueness</h2>
        <p>
            AI models can produce similar or identical output for similar inputs, including
            for other MerchForge merchants or other users of the same underlying AI
            provider. MerchForge does not guarantee that AI-generated text or images are
            unique to you.
        </p>

        <h2>9. No Guarantee of Commercial or Legal Suitability</h2>
        <p>
            MerchForge does not guarantee that AI-generated content is free of third-party
            intellectual property claims, or that it is suitable for any particular
            commercial, regulatory, or legal purpose in your jurisdiction. If you sell in a
            regulated category (for example, anything with mandatory labeling or safety
            disclosures), do not rely on AI-generated text to satisfy that requirement
            without your own review.
        </p>

        <h2>10. Ownership and Licensing of AI-Generated Content</h2>
        <p>
            Whether AI-generated output can be owned the way traditionally authored content
            can — and what rights, if any, the underlying AI provider retains or grants
            over it — depends on copyright law in the relevant jurisdiction and on that
            provider's own terms of service, neither of which this document can resolve on
            MerchForge's behalf. We are not making a legal claim here about who owns
            AI-generated content; this is deliberately left open for lawyer review rather
            than asserted one way or the other. Until that review happens, treat
            AI-generated content the same way you would treat content whose ownership
            status is uncertain.
        </p>

        <h2>11. Changes to AI Features and Providers</h2>
        <p>
            We may change which AI provider or model powers a given feature, or change what
            a feature does, over time. If a change would meaningfully affect what data is
            sent or how a feature behaves, we will update our{" "}
            <Link to={routes.PRIVACY}>Privacy Policy</Link> and this document to reflect
            it.
        </p>

        <h2>12. Questions</h2>
        <p>
            Questions about the AI features can be sent to the contact address in our{" "}
            <Link to={routes.TERMS}>Terms of Service</Link>.
        </p>
    </LegalPage>
);

export default AiTerms;
