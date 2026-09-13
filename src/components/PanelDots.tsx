"use client";

import { useLanguage } from "@/hooks/useLanguage";
import styles from "./PanelDots.module.css";

type Props = {
  activeIndex: number;
  onNavigate: (index: number) => void;
};

export default function PanelDots({ activeIndex, onNavigate }: Props) {
  const { t } = useLanguage();

  return (
    <nav className={styles.dots} aria-label="Sections">
      {t.sections.map((label, i) => (
        <button
          key={label}
          type="button"
          className={styles.dot}
          data-active={i === activeIndex}
          onClick={() => onNavigate(i)}
          title={label}
          aria-label={label}
          aria-current={i === activeIndex ? "true" : undefined}
        />
      ))}
    </nav>
  );
}
