import styles from "./styles.module.css";

const STEPS = [
  {
    number: 1,
    title: "Install and enable",
    description:
      "Install GhostLink from the Shopify App Store. Enable the GhostLink Scout embed in your theme. No code edits needed.",
  },
  {
    number: 2,
    title: "404s get logged",
    description:
      "Whenever a customer lands on a 404 page, GhostLink records the broken path, full URL, referrer, and how many times it was hit.",
  },
  {
    number: 3,
    title: "Fix or Auto-Pilot",
    description:
      "Fix broken links one by one with a single click, or turn on Auto-Pilot to redirect all new 404s to a page you choose.",
  },
  {
    number: 4,
    title: "Shopify redirects",
    description:
      "Every fix creates a standard Shopify URL redirect in your store admin. You can edit or delete them anytime.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.section} aria-labelledby="hiw-title">
      <div className={styles.inner}>
        <p className={styles.sectionLabel} aria-hidden="true">How it works</p>
        <h2 id="hiw-title" className={styles.title}>
          From broken link to redirect in seconds
        </h2>

        <ol className={styles.timeline} role="list">
          {STEPS.map((step) => (
            <li className={styles.step} key={step.number}>
              <span className={styles.stepNumber} aria-hidden="true">
                {step.number}
              </span>
              <div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
