"use client";

import { LANGS } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import styles from "./LangSwitch.module.css";

export default function LangSwitch() {
  const { lang, setLanguage } = useLanguage();

  return (
    <div className={styles.switch} aria-label="Language">
      {LANGS.map((code, i) => (
        <span key={code} className={styles.item}>
          {i > 0 && <span className={styles.slash} aria-hidden />}
          <button
            type="button"
            className={styles.button}
            data-active={code === lang}
            onClick={() => setLanguage(code)}
            aria-pressed={code === lang}
            lang={code}
          >
            {code.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
