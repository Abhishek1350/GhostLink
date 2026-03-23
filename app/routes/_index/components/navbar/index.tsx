import { useState } from "react";
import { Link } from "react-router";
import { siteConfig } from "~/config/site";
import styles from "./styles.module.css";

const NAV_LINKS = [
  { label: "How it works", to: "#how-it-works" },
  { label: "Features", to: "#features" },
  { label: "FAQ", to: "#faq" },
  { label: "Contact", to: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar} aria-label="Main navigation">
      <div className={styles.inner}>
        <Link
          to="/"
          className={styles.logo}
          aria-label={`${siteConfig.name} home`}
        >
          <img
            src={siteConfig.logo}
            alt={siteConfig.name}
            className={styles.logoIcon}
            aria-hidden="true"
            width={35}
            height={35}
          />
          {siteConfig.name}
        </Link>

        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <ul
          id="primary-nav"
          className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ""}`}
          role="list"
        >
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                className={styles.navLink}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={siteConfig.appStoreUrl}
              className={styles.cta}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              Install Free
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
