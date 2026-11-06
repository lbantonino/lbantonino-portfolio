"use client";

import { useEffect, useRef, useState } from "react";
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

/**
 * Les cinq premiers projets remplissent la mosaïque d'origine (ses 24 cases).
 * Les suivants s'alignent à sa droite, en colonnes pleine hauteur, et se
 * découvrent en faisant défiler la bande sur le côté.
 */
const MOSAIQUE = 5;

/** Fait glisser la bande d'un projet vers la droite (1) ou la gauche (-1). */
function avancerBande(bande: HTMLElement, sens: 1 | -1) {
  const carte = bande.querySelector<HTMLElement>(`.${styles.extra}`);
  const piste = bande.firstElementChild as HTMLElement | null;
  const ecart = piste ? parseFloat(getComputedStyle(piste).columnGap) || 0 : 0;
  const pas = carte ? carte.offsetWidth + ecart : bande.clientWidth / 2;
  const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  bande.scrollBy({ left: sens * pas, behavior: doux ? "smooth" : "auto" });
}

/** Où en est la bande : utile (elle déborde), au début, au bout. */
type Bornes = { utile: boolean; debut: boolean; fin: boolean };

function lireBornes(bande: HTMLElement): Bornes {
  const max = bande.scrollWidth - bande.clientWidth;
  return {
    utile: max > 2,
    debut: bande.scrollLeft <= 2,
    fin: bande.scrollLeft >= max - 2,
  };
}

function Chevron({ sens }: { sens: 1 | -1 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={sens > 0 ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProjectCard({
  project,
  index,
  extra = false,
}: {
  project: ProjectMeta;
  index: number;
  /** Carte rangée après la mosaïque, dans la partie qui défile. */
  extra?: boolean;
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
  // Une page du site reste dans l'onglet courant ; un projet hébergé
  // ailleurs s'ouvre à côté pour ne pas faire quitter le portfolio.
  const interne = project.href.startsWith("/");
  const linkProps = linked
    ? interne
      ? { href: project.href }
      : { href: project.href, target: "_blank", rel: "noreferrer" }
    : {};

  return (
    <Tag
      {...linkProps}
      className={extra ? `${styles.card} ${styles.extra}` : styles.card}
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
            sizes={
              // Une carte après la mosaïque est étroite sur ordinateur.
              extra
                ? "(max-width: 900px) 92vw, (max-width: 1200px) 46vw, 30vw"
                : "(max-width: 900px) 92vw, (max-width: 1200px) 46vw, 38vw"
            }
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

      {/* Place réservée (titre vide) : ni titre ni texte, juste la boîte. */}
      {project.title !== "" && (
        <div className={styles.body}>
          <h3 className={styles.title}>{project.title}</h3>
          <p className={styles.text}>{copy.body}</p>
          {project.accessCode && (
            <p className={styles.access}>
              {t.work.accessCode}{" "}
              <span className={styles.accessCode}>{project.accessCode}</span>
            </p>
          )}
        </div>
      )}
    </Tag>
  );
}

export default function WorkPanel({ className, header, isActive }: Props) {
  const { t } = useLanguage();
  const bandeRef = useRef<HTMLDivElement>(null);
  const [bornes, setBornes] = useState<Bornes>({
    utile: false,
    debut: true,
    fin: false,
  });

  // Suit la position de la bande pour griser la flèche du côté atteint, et
  // masquer les deux quand rien ne dépasse (écran étroit, cartes empilées).
  useEffect(() => {
    const bande = bandeRef.current;
    if (!bande) return;

    let frame = 0;
    const maj = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const suivant = lireBornes(bande);
        setBornes((avant) =>
          avant.utile === suivant.utile &&
          avant.debut === suivant.debut &&
          avant.fin === suivant.fin
            ? avant
            : suivant,
        );
      });
    };

    maj();
    bande.addEventListener("scroll", maj, { passive: true });
    const observateur = new ResizeObserver(maj);
    observateur.observe(bande);
    return () => {
      cancelAnimationFrame(frame);
      bande.removeEventListener("scroll", maj);
      observateur.disconnect();
    };
  }, []);

  const glisser = (sens: 1 | -1) => {
    if (bandeRef.current) avancerBande(bandeRef.current, sens);
  };

  return (
    <section
      className={`${className} ${styles.pane}`}
      aria-label="Work"
      data-pane-active={isActive}
    >
      {header}

      {/* Flèches : pour une souris sans défilement sur le côté. */}
      <div className={styles.fleches} data-utile={bornes.utile}>
        <button
          type="button"
          className={styles.fleche}
          aria-label={t.work.previous}
          aria-controls="bande-projets"
          disabled={bornes.debut}
          onClick={() => glisser(-1)}
        >
          <Chevron sens={-1} />
        </button>
        <button
          type="button"
          className={styles.fleche}
          aria-label={t.work.next}
          aria-controls="bande-projets"
          disabled={bornes.fin}
          onClick={() => glisser(1)}
        >
          <Chevron sens={1} />
        </button>
      </div>

      {/* La bande défile sur le côté ; elle s'étend sous le menu à gauche
          et jusqu'au bord de la vitre à droite. La molette verticale garde
          son rôle (changer de section) : à la souris, ce sont les flèches. */}
      <div
        ref={bandeRef}
        id="bande-projets"
        className={`${styles.rail} no-scrollbar`}
      >
        <div className={styles.track}>
          <div className={styles.grid}>
            {PROJECT_META.slice(0, MOSAIQUE).map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>

          {PROJECT_META.slice(MOSAIQUE).map((project, i) => (
            <ProjectCard
              key={project.title || `place-${MOSAIQUE + i}`}
              project={project}
              index={MOSAIQUE + i}
              extra
            />
          ))}
        </div>
      </div>
    </section>
  );
}
