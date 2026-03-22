import styles from "./styles.module.css";

const FAQ_ITEMS = [
  {
    question: "Is GhostLink free?",
    answer:
      "Yes. GhostLink is a simple, free tool to help keep your Shopify URLs clean and reduce the impact of broken links. If pricing ever changes, it will be clearly communicated on the App Store listing and inside the app.",
  },
  {
    question: "Do I need to edit my theme code?",
    answer:
      "No. GhostLink uses a theme app embed, which you can enable from the Theme Editor: Online Store, then Themes, then Customize, then App embeds, then GhostLink Scout. There are no manual code changes to make.",
  },
  {
    question: "Where are redirects stored?",
    answer:
      "Every redirect created by GhostLink is a normal Shopify URL redirect. You'll find them in your Shopify admin under Online Store, then Content, then Menus, then URL redirects. You can edit or delete them at any time.",
  },
  {
    question: "Does GhostLink affect SEO?",
    answer:
      "Broken links and 404 pages can hurt SEO and user experience. GhostLink helps you turn those dead ends into proper redirects, which is generally a positive signal for search engines and customers. The app is lightweight and runs only on 404 pages.",
  },
  {
    question: "Does GhostLink store customer data?",
    answer:
      "GhostLink works with URLs and page-level information. It logs your shop identifier, 404 paths and full URLs, referrer URLs, hit counts, and timestamps. We do not collect or store personally identifiable information like customer names, emails, or payment details.",
  },
];

function ChevronIcon() {
  return (
    <svg
      className={styles.chevron}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-title">
      <div className={styles.inner}>
        <span className="section-label" data-aos="fade-up">
          FAQ
        </span>
        <h2
          id="faq-title"
          className={`section-title ${styles.title}`}
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Frequently asked questions
        </h2>

        <div className={styles.list} role="list">
          {FAQ_ITEMS.map((item, i) => (
            <details
              className={styles.item}
              key={i}
              data-aos="fade-up"
              data-aos-delay={150 + i * 60}
            >
              <summary className={styles.question}>
                {item.question}
                <ChevronIcon />
              </summary>
              <p className={styles.answer}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
