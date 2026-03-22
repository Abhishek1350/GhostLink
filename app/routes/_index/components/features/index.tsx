import styles from "./styles.module.css";

const FEATURES = [
  {
    icon: "📡",
    title: "Automatic 404 logging",
    description:
      "Tracks every visit to your 404 page. Stores the broken path, full URL, referrer, and hit count so you know which links need attention.",
  },
  {
    icon: "⚡",
    title: "One-click fixes",
    description:
      "Create a Shopify URL redirect right from the dashboard. Mark links as fixed without leaving the app or digging through admin menus.",
  },
  {
    icon: "✈️",
    title: "Auto-Pilot mode",
    description:
      "Turn on Auto-Pilot to redirect all new 404s to a safe page like your main collection or home page. It's optional, and you stay in control.",
  },
  {
    icon: "🎨",
    title: "No theme code edits",
    description:
      "Uses a small, official theme app embed. No Liquid code to paste, no manual theme editing. Just enable it and you're done.",
  },
  {
    icon: "🔒",
    title: "Your redirects, your data",
    description:
      "Redirects are stored as standard Shopify URL redirects. You can manage or delete them anytime from your Shopify admin.",
  },
  {
    icon: "💰",
    title: "Completely free",
    description:
      "GhostLink is a simple, free tool that keeps your Shopify URLs clean and helps reduce the impact of broken links on your store.",
  },
];

export default function Features() {
  return (
    <section id="features" className={styles.section} aria-labelledby="features-title">
      <div className={styles.inner}>
        <span className={styles.sectionLabel} data-aos="fade-up">Features</span>
        <h2 id="features-title" className={styles.title} data-aos="fade-up" data-aos-delay="100">
          Simple, focused 404 monitoring
        </h2>
        <p className={styles.subtitle} data-aos="fade-up" data-aos-delay="150">
          Everything you need to find and fix broken links. Nothing you don't.
        </p>

        <ul className={styles.grid} role="list">
          {FEATURES.map((feature, i) => (
            <li
              className={styles.card}
              key={feature.title}
              data-aos="fade-up"
              data-aos-delay={200 + i * 80}
            >
              <div className={styles.cardIcon} aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDesc}>{feature.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
