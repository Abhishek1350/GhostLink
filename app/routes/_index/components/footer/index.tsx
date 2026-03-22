import { Link } from "react-router";
import { siteConfig } from "~/config/site";
import styles from "./styles.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logoIcon} aria-hidden="true">
            {siteConfig.name.charAt(0)}
          </span>
          <span className={styles.brandName}>{siteConfig.name}</span>
        </div>

        <p className={styles.copyright}>
          © {year} {siteConfig.name}. Built by{" "}
          <a
            href={siteConfig.author.url}
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {siteConfig.author.name}
          </a>
        </p>

        <ul className={styles.links} role="list">
          <li>
            <Link to="#how-it-works" className={styles.link}>
              How it works
            </Link>
          </li>
          <li>
            <Link to="#features" className={styles.link}>
              Features
            </Link>
          </li>
          <li>
            <Link to="#faq" className={styles.link}>
              FAQ
            </Link>
          </li>
          <li>
            <Link to="/privacy" className={styles.link}>
              Privacy Policy
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
