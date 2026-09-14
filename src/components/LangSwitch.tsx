"use client";

import { LANGS } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import styles from "./LangSwitch.module.css";

type Props = {
  placement?: "chrome" | "home-mobile";
};

export default function LangSwitch({ placement = "chrome" }: Props) {
  const { lang, setLanguage } = useLanguage();

  return (
    <div
      className={styles.switch}
      data-placement={placement}
      aria-label="Language"
    >
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
