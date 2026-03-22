import styles from "./styles.module.css";

const VALUE_PROPS = [
  {
    icon: "👁",
    title: "Watch 404s automatically",
    desc: "A tiny theme embed logs real visitor 404 traffic for you.",
  },
  {
    icon: "🔧",
    title: "Fix in one click",
    desc: "Create standard Shopify URL redirects right from your dashboard.",
  },
  {
    icon: "🚀",
    title: "Auto-Pilot mode",
    desc: "Automatically redirect new 404s to a safe page of your choice.",
  },
];

export default function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroGlow} aria-hidden="true" />
      <div className={styles.inner}>
        <span className={styles.badge} data-aos="fade-down" data-aos-delay="100">
          Free Shopify App
        </span>

        <h1 className={styles.title} data-aos="fade-up" data-aos-delay="150">
          Fix broken links on Shopify{" "}
          <span className={styles.highlight}>before they cost you sales</span>
        </h1>

        <p className={styles.subtitle} data-aos="fade-up" data-aos-delay="250">
          Every broken link sends a customer to a dead end. 404 pages hurt your
          SEO, break trust, and quietly reduce conversions. GhostLink helps you
          spot every 404 and turn dead links into clean redirects, without
          touching your theme code.
        </p>

        <div className={styles.actions} data-aos="fade-up" data-aos-delay="350">
          <a
            href="https://apps.shopify.com/ghostlink"
            className={styles.primaryBtn}
            target="_blank"
            rel="noopener noreferrer"
          >
            Install on Shopify
          </a>
          <a href="#how-it-works" className={styles.secondaryBtn}>
            See how it works
          </a>
        </div>

        <div className={styles.valueProps} role="list">
          {VALUE_PROPS.map((prop, i) => (
            <div
              className={styles.valueProp}
              key={i}
              role="listitem"
              data-aos="fade-up"
              data-aos-delay={400 + i * 100}
            >
              <span className={styles.valuePropIcon} aria-hidden="true">
                {prop.icon}
              </span>
              <p className={styles.valuePropText}>
                <strong>{prop.title}</strong>
                {prop.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
