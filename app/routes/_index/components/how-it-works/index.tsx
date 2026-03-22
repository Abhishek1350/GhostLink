import styles from "./styles.module.css";

const STEPS = [
  {
    number: 1,
    icon: "📦",
    title: "Install and enable",
    description:
      "Install GhostLink from the Shopify App Store. Enable the GhostLink Scout embed in your theme. No code edits needed.",
  },
  {
    number: 2,
    icon: "📡",
    title: "404s get logged",
    description:
      "Whenever a customer lands on a 404 page, GhostLink records the broken path, full URL, referrer, and how many times it was hit.",
  },
  {
    number: 3,
    icon: "⚡",
    title: "Fix or Auto-Pilot",
    description:
      "Fix broken links one by one with a single click, or turn on Auto-Pilot to redirect all new 404s to a page you choose.",
  },
  {
    number: 4,
    icon: "✅",
    title: "Shopify redirects",
    description:
      "Every fix creates a standard Shopify URL redirect in your store admin. You can edit or delete them anytime.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className={styles.section}
      aria-labelledby="hiw-title"
    >
      <div className={styles.inner}>
        <span className="section-label" data-aos="fade-up">
          How it works
        </span>
        <h2
          id="hiw-title"
          className={`section-title ${styles.title}`}
          data-aos="fade-up"
          data-aos-delay="100"
        >
          From broken link to redirect in seconds
        </h2>

        <div className={styles.stepsGrid}>
          {STEPS.map((step, i) => (
            <div
              className={styles.stepCard}
              key={step.number}
              data-aos="fade-up"
              data-aos-delay={150 + i * 100}
            >
              <span className={styles.stepBadge} aria-hidden="true">
                {step.number}
              </span>
              <div className={styles.stepIcon} aria-hidden="true">
                {step.icon}
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.description}</p>
              {i < STEPS.length - 1 && (
                <span className={styles.connector} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
