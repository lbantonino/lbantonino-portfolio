"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { SECTION_AVATARS, SECTION_COUNT } from "@/lib/content";
import { useLanguage } from "@/hooks/useLanguage";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useMagneticControls, useShellFx } from "@/hooks/useShellFx";
import LangSwitch from "./LangSwitch";
import SectionHeader from "./SectionHeader";
import SideNav from "./SideNav";
import HeroPanel from "./panels/HeroPanel";
import WorkPanel from "./panels/WorkPanel";
import AboutPanel from "./panels/AboutPanel";
import ContactPanel from "./panels/ContactPanel";
import styles from "./Portfolio.module.css";

/**
 * En dessous de cette largeur le site bascule d'un défilement horizontal
 * par panneaux vers un empilement vertical classique.
 */
export const COMPACT_QUERY = "(max-width: 900px)";

const LAST_INDEX = SECTION_COUNT - 1;

/** Les sections, dans l'ordre du défilement. */
function panneaux(scroller: HTMLElement) {
  return Array.from(scroller.children) as HTMLElement[];
}

/**
 * Section considérée comme courante : la dernière dont le haut est déjà
 * passé au-dessus du tiers supérieur de l'écran. Se fonde sur les
 * positions réelles, les sections n'ayant pas toutes la même hauteur.
 */
function sectionVisible(scroller: HTMLElement) {
  const repere = scroller.scrollTop + scroller.clientHeight * 0.35;
  let trouve = 0;
  panneaux(scroller).forEach((panneau, i) => {
    if (panneau.offsetTop <= repere) trouve = i;
  });
  return trouve;
}

/** Delta de molette à cumuler avant de changer de section. */
const WHEEL_THRESHOLD = 60;
/**
 * Temps mort après un saut. Il couvre l'animation de défilement et impose
 * un rythme : même en faisant tourner la molette sans s'arrêter, on ne
 * dépasse pas une section par seconde environ.
 */
const WHEEL_COOLDOWN = 420;

/**
 * Attente réduite quand on repart en sens inverse. Changer de sens est
 * toujours une nouvelle intention : la remontée ne doit pas sembler bloquée.
 */
const WHEEL_REVERSE_GRACE = 0;

/** En deçà, un delta est du bruit d'inertie, pas un vrai changement de sens. */
const WHEEL_DIRECTION_NOISE = 4;

/**
 * Silence à observer entre deux événements pour considérer qu'un nouveau
 * geste commence. Un pavé tactile émet son inertie toutes les 8 à 16 ms,
 * un cran de souris arrive plutôt toutes les 120 ms et plus : 100 ms
 * sépare proprement les deux. Sans ce seuil, l'inertie d'un seul geste
 * suffirait à enchaîner plusieurs sections.
 */
const WHEEL_GESTURE_GAP = 100;

/**
 * Verrou maximum après un saut. Certains trackpads gardent une traîne
 * d'inertie très longue : on l'ignore au début, puis on rend la main pour
 * permettre une navigation rapide sans attendre l'arrêt complet du scroll.
 */
const WHEEL_LOCK_MAX = 700;

const AMBIENT_PARTICLES = [
  { left: 6, top: 88, size: 2.5, delay: 0, duration: 19, drift: -18 },
  { left: 14, top: 72, size: 1.5, delay: 5.5, duration: 24, drift: 22 },
  { left: 23, top: 94, size: 3, delay: 2.5, duration: 21, drift: 14 },
  { left: 34, top: 78, size: 1.5, delay: 11, duration: 27, drift: -26 },
  { left: 46, top: 90, size: 2, delay: 4, duration: 23, drift: 18 },
  { left: 57, top: 68, size: 2.5, delay: 14, duration: 18, drift: -16 },
  { left: 68, top: 96, size: 1.5, delay: 8.5, duration: 26, drift: 24 },
  { left: 79, top: 82, size: 2, delay: 17, duration: 22, drift: -20 },
  { left: 88, top: 76, size: 3.5, delay: 6, duration: 29, drift: 12 },
  { left: 95, top: 92, size: 1.5, delay: 20, duration: 25, drift: -24 },
];

const AMBIENT_BEAMS = [
  { left: 12, top: 18, rotate: -18, delay: 0, duration: 11 },
  { left: 48, top: 8, rotate: 9, delay: 3.8, duration: 13 },
  { left: 72, top: 34, rotate: -32, delay: 7.2, duration: 12 },
];

export default function Portfolio() {
  const shellRef = useRef<HTMLElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const isCompact = useMediaQuery(COMPACT_QUERY);
  const { t } = useLanguage();

  // La molette lit la section courante ici : si son écouteur dépendait de
  // `index`, il se ré-enregistrerait à chaque saut et perdrait le verrou
  // qui limite un geste à une section.
  const indexRef = useRef(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useShellFx(shellRef, auraRef);
  useMagneticControls(shellRef, [index, isCompact]);

  const sectionLabels = [
    t.sections[0],
    t.sections[1],
    t.sections[2],
    t.sections[3],
  ];

  const goTo = useCallback(
    (target: number) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const clamped = Math.min(LAST_INDEX, Math.max(0, target));
      const panneau = panneaux(scroller)[clamped];
      if (!panneau) return;
      setIndex(clamped);
      scroller.scrollTo({ top: panneau.offsetTop, behavior: "smooth" });
    },
    [],
  );

  // Garde l'index actif aligné sur la position réelle du scroll, que
  // celui-ci vienne d'un clic, de la molette ou d'un swipe.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let frame = 0;
    const sync = () => {
      const next = sectionVisible(scroller);
      setIndex((current) => (current === next ? current : next));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    sync();
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Prendre le focus dans un panneau (au clavier, ou via un contrôle
  // interne) pousse le navigateur à faire défiler la piste pour révéler
  // l'élément. On la recale aussitôt sur le panneau courant.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    if (isCompact) return;

    const realign = () => {
      requestAnimationFrame(() => {
        const attendu = panneaux(scroller)[sectionVisible(scroller)]?.offsetTop;
        if (attendu === undefined) return;
        if (Math.abs(scroller.scrollTop - attendu) < 1) return;
        scroller.scrollTo({ top: attendu });
      });
    };

    scroller.addEventListener("focusin", realign);
    return () => scroller.removeEventListener("focusin", realign);
  }, [isCompact]);

  // Molette -> changement de section. On accumule le delta et on déclenche
  // un saut complet plutôt que de laisser le défilement natif : le geste
  // amène ainsi toujours sur un panneau entier, jamais entre deux.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || isCompact) return;

    let accumulated = 0;
    let lastEventAt = 0;
    let readyAt = 0;
    // Vrai dès qu'un geste a déclenché son saut : le reste du flux
    // d'inertie est alors ignoré. Un geste, une section.
    let spent = false;
    let spentAt = 0;
    // Sens du dernier saut, pour reconnaître un demi-tour.
    let lastDirection = 0;
    // Section visée par le dernier ordre, animation comprise. S'appuyer
    // sur la section courante ferait viser une section trop loin quand un
    // ordre arrive avant la fin du défilement précédent.
    let aimed = 0;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const target = event.target as HTMLElement | null;

      // Un panneau plus haut que l'écran garde la molette pour lui, mais
      // seulement tant qu'il n'a pas atteint son bord : sinon on resterait
      // prisonnier de la section.
      const pane = target?.closest<HTMLElement>(`.${styles.pane}`);
      if (pane && pane.scrollHeight > pane.clientHeight + 4) {
        const atBottom =
          pane.scrollTop + pane.clientHeight >= pane.scrollHeight - 2;
        const atTop = pane.scrollTop <= 2;
        const leaving =
          (event.deltaY > 0 && atBottom) || (event.deltaY < 0 && atTop);
        if (!leaving) return;
      }

      event.preventDefault();

      const now = Date.now();
      const way = event.deltaY > 0 ? 1 : -1;
      const reversing =
        lastDirection !== 0 &&
        way !== lastDirection &&
        Math.abs(event.deltaY) > WHEEL_DIRECTION_NOISE;

      const gestureExpired =
        spent && now >= readyAt && now - spentAt > WHEEL_LOCK_MAX;

      if (reversing || gestureExpired || now - lastEventAt > WHEEL_GESTURE_GAP) {
        accumulated = 0;
        spent = false;
        spentAt = 0;
        // Demi-tour : on raccourcit l'attente au lieu de la subir.
        if (reversing) readyAt = Math.min(readyAt, now + WHEEL_REVERSE_GRACE);
      }
      lastEventAt = now;

      if (spent || now < readyAt) return;

      accumulated += event.deltaY;
      if (Math.abs(accumulated) < WHEEL_THRESHOLD) return;

      const direction = accumulated > 0 ? 1 : -1;
      accumulated = 0;
      spent = true;
      spentAt = now;
      lastDirection = direction;
      readyAt = now + WHEEL_COOLDOWN;

      // Si le défilement précédent est terminé, la section courante fait
      // foi ; sinon on repart de la section déjà visée.
      // Le défilement précédent est-il terminé, c'est-à-dire sommes-nous
      // posés exactement sur le haut d'une section ?
      const hautActuel = panneaux(scroller)[indexRef.current]?.offsetTop ?? 0;
      const settled = Math.abs(scroller.scrollTop - hautActuel) < 2;
      const from = settled ? indexRef.current : aimed;
      aimed = Math.min(LAST_INDEX, Math.max(0, from + direction));
      goTo(aimed);
    };

    scroller.addEventListener("wheel", onWheel, { passive: false });
    return () => scroller.removeEventListener("wheel", onWheel);
  }, [isCompact, goTo]);

  // Flèches gauche / droite pour naviguer entre les panneaux.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement;
      if (typing) return;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        goTo(index + 1);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        goTo(index - 1);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  return (
    <div className={styles.stage}>
      <div className={`${styles.orb} ${styles.orbTop}`} aria-hidden />
      <div className={`${styles.orb} ${styles.orbBottom}`} aria-hidden />

      <main ref={shellRef} className={styles.shell}>
        <div className={styles.ambient} aria-hidden>
          <span className={styles.dots} />
          <span className={`${styles.aurora} ${styles.auroraA}`} />
          <span className={`${styles.aurora} ${styles.auroraB}`} />
          <span className={`${styles.aurora} ${styles.auroraC}`} />
          <span className={styles.scanline} />
          <span className={styles.noise} />

          {AMBIENT_BEAMS.map((beam) => (
            <span
              key={`${beam.left}-${beam.top}`}
              className={styles.beam}
              style={
                {
                  left: `${beam.left}%`,
                  top: `${beam.top}%`,
                  rotate: `${beam.rotate}deg`,
                  animationDelay: `${beam.delay}s`,
                  animationDuration: `${beam.duration}s`,
                } as React.CSSProperties
              }
            />
          ))}

          {AMBIENT_PARTICLES.map((particle) => (
            <span
              key={`${particle.left}-${particle.delay}`}
              className={styles.particle}
              style={
                {
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  "--particle-drift": `${particle.drift}px`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <div ref={auraRef} className={styles.aura} aria-hidden />

        <div className={styles.chrome}>
          <SectionHeader
            avatar={SECTION_AVATARS[index] ?? SECTION_AVATARS[0]}
            label={sectionLabels[index] ?? sectionLabels[0]}
            mode="fixed"
          />
          <LangSwitch />
        </div>

        <SideNav activeIndex={index} onNavigate={goTo} isCompact={isCompact} />

        <div ref={scrollerRef} className={`${styles.scroller} no-scrollbar`}>
          <HeroPanel
            className={styles.pane}
            header={
              <SectionHeader
                avatar={SECTION_AVATARS[0]}
                label={t.sections[0]}
                mode="panel"
              />
            }
            isActive={index === 0}
            onSeeWork={() => goTo(1)}
            onStartProject={() => goTo(3)}
          />
          <WorkPanel
            className={styles.pane}
            header={
              <SectionHeader
                avatar={SECTION_AVATARS[1]}
                label={t.sections[1]}
                mode="panel"
              />
            }
            isActive={index === 1}
          />
          <AboutPanel
            className={styles.pane}
            header={
              <SectionHeader
                avatar={SECTION_AVATARS[2]}
                label={t.sections[2]}
                mode="panel"
              />
            }
            isActive={index === 2}
          />
          <ContactPanel
            className={styles.pane}
            header={
              <SectionHeader
                avatar={SECTION_AVATARS[3]}
                label={t.sections[3]}
                mode="panel"
              />
            }
            isActive={index === 3}
          />
        </div>

      </main>
    </div>
  );
}
