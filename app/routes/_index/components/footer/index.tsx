import { Link } from "react-router";
import styles from "./styles.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logoIcon} aria-hidden="true">G</span>
          <span className={styles.brandName}>GhostLink</span>
        </div>

        <p className={styles.copyright}>
          © {year} GhostLink. Built by{" "}
          <a
            href="https://imabhishek.site"
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abhishek Bhardwaj
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
              Privacy
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
