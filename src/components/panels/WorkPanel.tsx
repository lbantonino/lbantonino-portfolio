"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";

import { PROJECT_META, type ProjectMeta } from "@/lib/content";
import { useLanguage } from "@/hooks/useLanguage";
import styles from "./WorkPanel.module.css";

type Props = {
  className: string;
  header: ReactNode;
  isActive: boolean;
};

function ProjectCard({
  project,
  index,
}: {
  project: ProjectMeta;
  index: number;
}) {
  const { t } = useLanguage();
  const copy = t.work.projects[index];
  const linked = project.href !== "";
  // Le fichier peut ne pas encore être déposé dans `public/` : on retombe
  // alors sur le cadre nu plutôt que sur une vignette cassée.
  const [hasImage, setHasImage] = useState(project.img !== "");

  // Une carte sans lien reste un bloc statique : pas d'ancre vide, rien
  // à cliquer, et le lecteur d'écran ne l'annonce pas comme un lien.
  const Tag = linked ? "a" : "div";
  const linkProps = linked
    ? { href: project.href, target: "_blank", rel: "noreferrer" }
    : {};

  return (
    <Tag
      {...linkProps}
      className={styles.card}
      data-linked={linked}
      style={
        {
          "--fx-i": index,
          "--cols": project.cols,
          "--rows": project.rows,
        } as React.CSSProperties
      }
      data-fx
    >
      <div className={styles.media}>
        {hasImage ? (
          // `fill` + `sizes` : Next ne sert que la largeur réellement
          // occupée par la carte, en WebP, au lieu du PNG d'origine.
          <Image
            src={project.img}
            alt=""
            fill
            className={styles.image}
            sizes="(max-width: 900px) 92vw, (max-width: 1200px) 46vw, 38vw"
            aria-hidden
            onError={() => setHasImage(false)}
          />
        ) : (
          <span className={styles.mediaEmpty} aria-hidden />
        )}

        <div className={styles.badges}>
          {copy.badges.map((badge) => (
            <span key={badge} className={styles.kind}>
              <span className={styles.kindDot} aria-hidden />
              {badge}
            </span>
          ))}
        </div>

        {linked && (
          <span className={styles.open}>
            {t.work.viewProject} <span aria-hidden>↗</span>
          </span>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.text}>{copy.body}</p>
      </div>
    </Tag>
  );
}

export default function WorkPanel({ className, header, isActive }: Props) {
  return (
    <section
      className={`${className} ${styles.pane}`}
      aria-label="Work"
      data-pane-active={isActive}
    >
      {header}

      <div className={styles.grid}>
        {PROJECT_META.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
