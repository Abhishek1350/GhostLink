import { siteConfig } from "~/config/site";
import styles from "./styles.module.css";
import { useFetcher } from "react-router";
import { useEffect, useState } from "react";

export default function Contact() {
  const emailDisplay = siteConfig.email;
  const siteUrlDisplay = siteConfig.url
    ? siteConfig.url.replace(/^https?:\/\//, "")
    : "ghostlink.example.com";

  const fetcher = useFetcher();

  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (fetcher.state !== "idle") return;
    setError(null);
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
      return setError("All fields are required");
    }

    if (name.length > 100) {
      return setError("Name must be less than 100 characters");
    }

    if (message.length > 1000) {
      return setError("Message must be less than 1000 characters");
    }

    fetcher.submit(formData);
  }

  useEffect(() => {
    if (fetcher.data?.success) {
      setSubmitted(true);
      fetcher.reset()
    } else if (fetcher.data?.error) {
      setError(
        fetcher.data?.error || "Something went wrong. Please try again.",
      );
    } else {
      setError(null);
    }
  }, [fetcher.data]);

  return (
    <section
      id="contact"
      className={styles.section}
      aria-labelledby="contact-title"
    >
      <div className={styles.inner}>
        <span className="section-label" data-aos="fade-up">
          Contact
        </span>
        <h2
          id="contact-title"
          className="section-title"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Get in touch
        </h2>
        <p
          className={`section-subtitle ${styles.subtitle}`}
          data-aos="fade-up"
          data-aos-delay="150"
        >
          Have questions, feedback, or need help getting set up? Drop us a
          message and we'll get back to you as soon as we can.
        </p>

        <fetcher.Form
          className={styles.form}
          aria-label="Contact form"
          data-aos="fade-up"
          data-aos-delay="200"
          method="post"
          onSubmit={handleSubmit}
        >
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label htmlFor="contact-name" className={styles.label}>
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                className="input-field"
                placeholder="Your name"
                required
                autoComplete="name"
                maxLength={100}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="contact-email" className={styles.label}>
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="contact-message" className={styles.label}>
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              className={`input-field ${styles.textarea}`}
              placeholder="How can we help?"
              required
              maxLength={1000}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {submitted && <div className={styles.success}>Message sent!</div>}

          {!submitted && (
            <button
              type="submit"
              className={`btn-primary ${styles.submitBtn}`}
              disabled={fetcher.state !== "idle"}
            >
              Send message
            </button>
          )}
        </fetcher.Form>

        <div
          className={styles.contactCards}
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <a href={`mailto:${emailDisplay}`} className={styles.contactCard}>
            <span className={styles.contactCardIcon} aria-hidden="true">
              ✉️
            </span>
            <div className={styles.contactCardContent}>
              <span className={styles.contactCardLabel}>Email us</span>
              <span className={styles.contactCardValue}>{emailDisplay}</span>
            </div>
          </a>
          <a
            href={siteConfig.url || "/"}
            className={styles.contactCard}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.contactCardIcon} aria-hidden="true">
              🌐
            </span>
            <div className={styles.contactCardContent}>
              <span className={styles.contactCardLabel}>Visit website</span>
              <span className={styles.contactCardValue}>{siteUrlDisplay}</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
