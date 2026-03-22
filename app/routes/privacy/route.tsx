import type { LinksFunction, MetaFunction } from "react-router";
import { Link } from "react-router";
import { siteConfig } from "~/config/site";
import sharedStyles from "../_index/styles.css?url";
import styles from "./styles.module.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap",
  },
  { rel: "stylesheet", href: sharedStyles },
];

export const meta: MetaFunction = () => [
  { title: `Privacy Policy | ${siteConfig.name}` },
  {
    name: "description",
    content: `Privacy Policy for ${siteConfig.name}. Learn how we collect, use, and protect your information.`,
  },
];

const LAST_UPDATED = "March 22, 2026";
const APP_NAME = siteConfig.name;

export default function PrivacyPolicy() {
  const email = siteConfig.email;
  const siteUrl = siteConfig.url;
  const siteUrlDisplay = siteUrl.replace(/^https?:\/\//, "");

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Link to="/" className={styles.backLink}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to home
        </Link>

        <header className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last updated: {LAST_UPDATED}</p>
        </header>

        <p className={styles.intro}>
          {APP_NAME} ("we", "us", or "our") provides a Shopify app that helps
          merchants detect broken pages (404 errors) and create URL redirects to
          fix them. This Privacy Policy explains how we collect, use, and
          protect information when you install and use the {APP_NAME} app on
          your Shopify store.
        </p>

        <p className={styles.intro}>
          By installing and using {APP_NAME}, you agree to the collection and
          use of information in accordance with this policy.
        </p>

        <article className={styles.content}>
          <hr className={styles.divider} />

          <h2>1. Information we collect</h2>

          <h3>1.1 Shopify store information</h3>
          <p>
            When you install {APP_NAME}, Shopify provides us with basic
            information about your store, including:
          </p>
          <ul>
            <li>
              Your shop domain (for example,{" "}
              <code>your-store.myshopify.com</code>)
            </li>
            <li>Your contact email and store name (as provided by Shopify)</li>
            <li>Your installed apps and plan information (where applicable)</li>
          </ul>
          <p>We use this information to:</p>
          <ul>
            <li>Identify your store in our system</li>
            <li>Authenticate API requests between {APP_NAME} and Shopify</li>
            <li>Provide support when you contact us</li>
          </ul>

          <h3>1.2 404 / broken link logs</h3>
          <p>
            To provide our core functionality, {APP_NAME} records information
            about visits to 404 pages on your storefront. This log data can
            include:
          </p>
          <ul>
            <li>
              The <strong>path</strong> and <strong>full URL</strong> requested
              (for example <code>/old-collection</code>)
            </li>
            <li>
              The <strong>referrer URL</strong> (if available)
            </li>
            <li>
              A <strong>hit count</strong> (how many times a broken path has
              been visited)
            </li>
            <li>A status flag indicating whether the link has been fixed</li>
            <li>Timestamps for when a broken link was first and last seen</li>
          </ul>
          <p>This information is used solely to:</p>
          <ul>
            <li>Display broken links in your {APP_NAME} dashboard</li>
            <li>Help you decide which links to fix</li>
            <li>Automatically create redirects when you enable Auto-Pilot</li>
          </ul>
          <div className={styles.note}>
            <p>
              <strong>Note:</strong> Referrer URLs may occasionally contain
              additional query parameters that include identifiers (for example,
              UTM parameters). We store referrer URLs as provided by the browser
              and do not use them to profile visitors.
            </p>
          </div>

          <h3>1.3 Installation and usage analytics</h3>
          <p>
            We maintain basic installation and usage analytics to keep{" "}
            {APP_NAME} running reliably, such as:
          </p>
          <ul>
            <li>Your shop domain</li>
            <li>When {APP_NAME} was first installed or reinstalled</li>
            <li>When it was uninstalled</li>
            <li>How many times it has been installed/uninstalled</li>
          </ul>
          <p>
            We use this information to understand product adoption, diagnose
            issues, and improve {APP_NAME} over time.
          </p>

          <h3>1.4 Google Analytics</h3>
          <p>
            Our public website uses Google Analytics, a web analytics service
            provided by Google LLC, to help us understand how visitors interact
            with the site. Google Analytics uses cookies and collects
            information such as:
          </p>
          <ul>
            <li>Pages visited, time on site, and bounce rate</li>
            <li>Approximate geographic location (country/city level)</li>
            <li>Browser type, device, and operating system</li>
            <li>Referral source (how you found the site)</li>
          </ul>
          <p>
            This data is aggregated and anonymized. We do not use Google
            Analytics inside the Shopify app itself — only on our public-facing
            landing page. For more information, see Google's{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
            >
              opt-out browser add-on
            </a>
            .
          </p>

          <h3>1.5 End-customer data</h3>
          <p>
            {APP_NAME} is designed to work primarily with{" "}
            <strong>URL and page-level information</strong>. We do not
            intentionally collect or store personally identifiable information
            (PII) about your customers, such as names, email addresses, or
            payment information.
          </p>
          <p>
            Any customer data processed by Shopify (for example, via storefront
            requests or analytics) remains under Shopify's control. Where{" "}
            {APP_NAME} interacts with Shopify APIs, we follow Shopify's{" "}
            <a
              href="https://www.shopify.com/legal/api-terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              API License and Terms of Use
            </a>{" "}
            and{" "}
            <a
              href="https://www.shopify.com/partners/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              Partner Program Agreement
            </a>
            .
          </p>

          <hr className={styles.divider} />

          <h2>2. How we use your information</h2>
          <p>We use the information described above to:</p>
          <ul>
            <li>Operate and provide the {APP_NAME} app and its features</li>
            <li>
              Detect and display broken links in your {APP_NAME} dashboard
            </li>
            <li>
              Create Shopify URL redirects when you fix a broken link or enable
              Auto-Pilot
            </li>
            <li>
              Diagnose and fix bugs, monitor uptime, and improve app performance
            </li>
            <li>
              Communicate with you about app updates, support requests, and
              important notices
            </li>
          </ul>
          <p>
            We do <strong>not</strong> sell your data or your customers' data to
            third parties.
          </p>

          <hr className={styles.divider} />

          <h2>3. Where data is stored</h2>
          <p>
            {APP_NAME} stores your data in a secure database managed by our
            hosting provider. The specific region may vary depending on our
            infrastructure (for example, within the EU or US). We take
            reasonable technical and organizational measures to protect this
            data against unauthorized access, alteration, disclosure, or
            destruction.
          </p>

          <hr className={styles.divider} />

          <h2>4. Data retention</h2>
          <p>We retain:</p>
          <ul>
            <li>
              Store and installation information for as long as your store has{" "}
              {APP_NAME} installed, and for a reasonable period afterwards to
              comply with our legal obligations and resolve disputes.
            </li>
            <li>
              Broken link logs (404 data) for as long as reasonably necessary to
              provide the service and help you diagnose and fix issues.
            </li>
          </ul>
          <p>
            You can request deletion of your data at any time (see Section 7
            below). In addition, when you uninstall the app, we will:
          </p>
          <ul>
            <li>Stop collecting new data from your store</li>
            <li>
              Retain only what is necessary for legal, accounting, or security
              purposes, and delete or anonymize other data within a reasonable
              time
            </li>
          </ul>

          <hr className={styles.divider} />

          <h2>5. Sharing your information</h2>
          <p>We may share your information only with:</p>
          <ul>
            <li>
              <strong>Service providers</strong> who help us operate {APP_NAME}{" "}
              (for example, cloud hosting, logging, monitoring). These providers
              process data on our behalf and are bound by contractual
              obligations to protect it.
            </li>
            <li>
              <strong>Shopify</strong>, as required by their platform policies
              and compliance (for example, via privacy webhooks and audits).
            </li>
            <li>
              <strong>Google</strong> (via Google Analytics on our public
              website), for aggregated visitor analytics.
            </li>
            <li>
              <strong>Authorities or regulators</strong>, if required to do so
              by law or in response to valid legal requests.
            </li>
          </ul>
          <p>
            We do not sell or rent your information to third parties for
            marketing purposes.
          </p>

          <hr className={styles.divider} />

          <h2>6. Compliance with Shopify privacy requirements</h2>
          <p>
            As a Shopify app, {APP_NAME} adheres to Shopify's privacy and data
            protection requirements, including:
          </p>
          <ul>
            <li>
              Subscribing to and honoring Shopify's{" "}
              <strong>privacy/compliance webhooks</strong> (such as{" "}
              <code>customers/data_request</code>, <code>customers/redact</code>
              , and <code>shop/redact</code>)
            </li>
            <li>
              Deleting or anonymizing data when we receive valid requests from
              Shopify
            </li>
            <li>
              Using only the <strong>minimum necessary API scopes</strong> to
              provide our functionality
            </li>
          </ul>
          <p>
            For more details about Shopify's approach to data privacy, see
            Shopify's{" "}
            <a
              href="https://www.shopify.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            .
          </p>

          <hr className={styles.divider} />

          <h2>7. Your rights and choices</h2>
          <p>As a merchant, you have the right to:</p>
          <ul>
            <li>
              Access the data we store about your shop in relation to {APP_NAME}
            </li>
            <li>Request correction of inaccurate information</li>
            <li>
              Request deletion of your data from our systems (subject to legal
              obligations)
            </li>
            <li>Uninstall {APP_NAME} at any time from your Shopify admin</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at the address
            below or via the <Link to="/#contact">Contact section</Link> on our
            website.
          </p>

          <hr className={styles.divider} />

          <h2>8. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we
            will update the "Last updated" date at the top of this page. If
            changes are material, we may also notify you via the {APP_NAME} app
            or by email.
          </p>

          <hr className={styles.divider} />

          <h2>9. Contact us</h2>
          <p>
            If you have any questions about this Privacy Policy or how{" "}
            {APP_NAME} handles your data, please contact us:
          </p>
          <ul className={styles.contactList}>
            <li>
              🌐{" "}
              <a href={siteUrl} target="_blank" rel="noopener noreferrer">
                {siteUrlDisplay}
              </a>
            </li>
            <li>
              📬 <Link to="/#contact">Contact form</Link>
            </li>
            <li>
              ✉️ <a href={`mailto:${email}`}>{email}</a>
            </li>
          </ul>
        </article>
      </div>
    </div>
  );
}
