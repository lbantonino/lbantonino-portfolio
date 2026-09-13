"use client";

import { SOCIALS } from "@/lib/content";
import { useLanguage } from "@/hooks/useLanguage";
import styles from "./SideNav.module.css";

const ICONS = [
  // Home
  <>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5.5 9.5V20h13V9.5" />
    <path d="M9.5 20v-6h5v6" />
  </>,
  // Work
  <>
    <rect x="3" y="7" width="18" height="13" rx="2.5" />
    <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
  </>,
  // About
  <>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
  </>,
  // Contact
  <>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </>,
];

type Props = {
  activeIndex: number;
  onNavigate: (index: number) => void;
  isCompact: boolean;
};

export default function SideNav({ activeIndex, onNavigate, isCompact }: Props) {
  const { t } = useLanguage();

  return (
    <nav className={styles.nav} aria-label="Sections">
      <div className={styles.links}>
        {!isCompact && (
          <div
            className={styles.pill}
            style={{ "--nav-index": activeIndex } as React.CSSProperties}
            aria-hidden
          />
        )}

        {t.sections.map((label, i) => (
          <button
            key={label}
            type="button"
            className={`${styles.link} ${
              isCompact && i === activeIndex ? styles.linkActive : ""
            }`}
            onClick={() => onNavigate(i)}
            title={label}
            aria-label={label}
            aria-current={i === activeIndex ? "true" : undefined}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {ICONS[i]}
            </svg>
          </button>
        ))}
      </div>

      <span className={styles.divider} aria-hidden />

      <a
        href={SOCIALS.github}
        target="_blank"
        rel="noreferrer"
        className={styles.social}
        aria-label="GitHub"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
        </svg>
      </a>

      <a
        href={SOCIALS.linkedin}
        target="_blank"
        rel="noreferrer"
        className={styles.social}
        aria-label="LinkedIn"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9.75h4v11.25H3V9.75Zm6.5 0h3.83v1.54h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76v5.9h-4v-5.23c0-1.25-.02-2.85-1.79-2.85-1.79 0-2.06 1.35-2.06 2.76v5.32h-4V9.75Z" />
        </svg>
      </a>
    </nav>
  );
}
