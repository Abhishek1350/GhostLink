import { siteConfig } from "~/config/site";
import styles from "./styles.module.css";

export default function Contact() {
  const emailDisplay = siteConfig.email || "support@example.com";
  const siteUrlDisplay = siteConfig.url
    ? siteConfig.url.replace(/^https?:\/\//, "")
    : "ghostlink.example.com";

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

        <form
          className={styles.form}
          action={`https://formsubmit.co/${emailDisplay}`}
          method="POST"
          aria-label="Contact form"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <input type="hidden" name="_captcha" value="false" />
          <input
            type="hidden"
            name="_subject"
            value={`${siteConfig.name} Contact Form`}
          />

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
            />
          </div>

          <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
            Send message
          </button>
        </form>

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
