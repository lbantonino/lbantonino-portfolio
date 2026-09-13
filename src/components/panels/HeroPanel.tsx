"use client";

import type { Pillar } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTypewriter } from "@/hooks/useTypewriter";
import styles from "./HeroPanel.module.css";

function PillarCard({ pillar, order }: { pillar: Pillar; order: number }) {
  const number = String(order + 1).padStart(2, "0");

  return (
    <article
      className={styles.pillar}
      data-fx
      style={{ "--fx-i": 3 + order } as React.CSSProperties}
    >
      {/* Chiffre fantôme en arrière-plan. Le bloc reste volontairement
          immobile : pas de dérive au curseur ici. */}
      <span className={styles.pillarGhost} aria-hidden>
        {number}
      </span>

      <div className={styles.pillarHead}>
        <span className={styles.pillarLabel}>{pillar.label}</span>
        <span className={styles.pillarRule} aria-hidden />
        <span className={styles.pillarIndex}>{number}</span>
      </div>

      <h3 className={styles.pillarTitle}>{pillar.title}</h3>
      <p className={styles.pillarBody}>{pillar.body}</p>

      <ul className={styles.pillarPoints}>
        {pillar.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </article>
  );
}

type Props = {
  className: string;
  isActive: boolean;
  onSeeWork: () => void;
  onStartProject: () => void;
};

export default function HeroPanel({
  className,
  isActive,
  onSeeWork,
  onStartProject,
}: Props) {
  const { t } = useLanguage();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  // Les sauts de ligne sont frappés comme les autres caractères.
  const { typed, steady } = useTypewriter(
    t.hero.titleLines.join("\n"),
    !reducedMotion,
  );
  const typedLines = typed.split("\n");

  return (
    <section
      className={`${className} ${styles.pane}`}
      aria-label="Home"
      data-pane-active={isActive}
    >
      <div className={styles.row}>
        <div className={styles.copy}>
          {/* Le titre complet reste lu par les lecteurs d'écran ; seule
              la version visible est frappée lettre à lettre. */}
          <h1 className={styles.title}>
            <span className={styles.srOnly}>{t.hero.titleLines.join(" ")}</span>

            {t.hero.titleLines.map((line, i) => (
              <span
                key={line}
                className={`${styles.titleLine} ${i === 2 ? styles.titleFaded : ""}`}
                aria-hidden
              >
                {typedLines[i] ?? ""}
                {i === typedLines.length - 1 && (
                  <span
                    className={styles.caret}
                    data-steady={steady}
                    aria-hidden
                  />
                )}
              </span>
            ))}
          </h1>

          <p
            className={styles.lede}
            data-fx
            style={{ "--fx-i": 1 } as React.CSSProperties}
          >
            {t.hero.lede}
          </p>

          <div
            className={styles.buttons}
            data-fx="pop"
            style={{ "--fx-i": 2 } as React.CSSProperties}
          >
            <button
              type="button"
              className={styles.primary}
              onClick={onSeeWork}
            >
              {t.hero.seeWork}
            </button>
            <button
              type="button"
              className={styles.secondary}
              onClick={onStartProject}
            >
              {t.hero.startProject}
            </button>
          </div>
        </div>

        <div className={styles.pillars}>
          {t.pillars.map((pillar, i) => (
            <PillarCard key={pillar.title} pillar={pillar} order={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
