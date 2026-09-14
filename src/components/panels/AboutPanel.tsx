"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { useLanguage } from "@/hooks/useLanguage";
import styles from "./AboutPanel.module.css";

type Props = {
  className: string;
  header: ReactNode;
  isActive: boolean;
};

const STACK_NODES = [
  {
    id: "typescript",
    group: 0,
    item: 0,
    x: 20,
    y: 18,
    delay: 0,
    icon: "typescript",
  },
  {
    id: "react",
    group: 0,
    item: 1,
    x: 43,
    y: 13,
    delay: 0.6,
    icon: "react",
  },
  {
    id: "next",
    group: 0,
    item: 2,
    x: 65,
    y: 22,
    delay: 1.2,
    icon: "nextdotjs",
  },
  {
    id: "node",
    group: 0,
    item: 3,
    x: 78,
    y: 42,
    delay: 1.8,
    icon: "nodedotjs",
  },
  {
    id: "ejs",
    group: 0,
    item: 4,
    x: 31,
    y: 40,
    delay: 2.4,
    icon: "ejs",
  },
  {
    id: "tailwind",
    group: 0,
    item: 5,
    x: 54,
    y: 38,
    delay: 3,
    icon: "tailwindcss",
  },
  {
    id: "mongo",
    group: 0,
    item: 6,
    x: 24,
    y: 62,
    delay: 3.6,
    icon: "mongodb",
  },
  {
    id: "supabase",
    group: 0,
    item: 7,
    x: 47,
    y: 62,
    delay: 1.1,
    icon: "supabase",
  },
  {
    id: "mysql",
    group: 0,
    item: 8,
    x: 70,
    y: 65,
    delay: 1.7,
    icon: "mysql",
  },
  {
    id: "docker",
    group: 0,
    item: 9,
    x: 38,
    y: 80,
    delay: 2.3,
    icon: "docker",
  },
  {
    id: "postman",
    group: 0,
    item: 10,
    x: 84,
    y: 78,
    delay: 3.1,
    icon: "postman",
  },
  { id: "n8n", group: 1, item: 0, x: 18, y: 86, delay: 0.9, icon: "n8n" },
  { id: "claude", group: 1, item: 1, x: 58, y: 84, delay: 1.5, icon: "claude" },
  {
    id: "chatgpt",
    group: 1,
    item: 2,
    x: 14,
    y: 38,
    delay: 2.1,
    icon: "openai",
  },
  { id: "figma", group: 2, item: 0, x: 85, y: 16, delay: 2.7, icon: "figma" },
  {
    id: "adobe",
    group: 2,
    item: 1,
    x: 85,
    y: 58,
    delay: 3.9,
    icon: "adobe",
  },
] as const;

const STACK_LINKS = [
  ["figma", "react"],
  ["typescript", "react"],
  ["react", "next"],
  ["next", "tailwind"],
  ["next", "node"],
  ["node", "supabase"],
  ["supabase", "mysql"],
  ["node", "mongo"],
  ["docker", "postman"],
  ["n8n", "claude"],
  ["claude", "chatgpt"],
  ["figma", "adobe"],
] as const;

const LINK_EDGE_OFFSET = 4.6;

function initials(label: string) {
  return label
    .split(/[\s&.]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function highlightIntro(paragraph: string) {
  // Les formulations qui désignent le métier dans chaque langue. Elles
  // sont toutes rendues avec la même signature, « Digital Specialist
  // Solutions », pour que la marque reste identique dans les deux
  // versions du site.
  const roleLabels = [
    "Digital Specialist Solutions",
    "Digital Solutions Specialist",
    "spécialiste des solutions numériques",
  ];
  const pattern = new RegExp(`(Antonino|${roleLabels.join("|")})`, "g");

  return paragraph.split(pattern).map((part, index) => {
    if (part === "Antonino") {
      return (
        <strong key={`${part}-${index}`} className={styles.highlight}>
          {part}
        </strong>
      );
    }

    if (roleLabels.includes(part)) {
      return (
        <strong key={`${part}-${index}`} className={styles.highlight}>
          Digital Specialist Solutions
        </strong>
      );
    }

    return part;
  });
}

/** Échappe les caractères spéciaux d'un mot avant de l'injecter en regex. */
function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Entoure les termes métier d'un `<span>` pour qu'ils puissent s'allumer
 * l'un après l'autre. Opère sur les fragments de texte déjà produits par
 * `highlightIntro`, sans toucher aux éléments qu'elle a créés.
 */
type Fragment = string | React.ReactElement;

function highlightKeywords(
  nodes: Fragment[],
  keywords: string[],
  compteur: { valeur: number },
): Fragment[] {
  if (keywords.length === 0) return nodes;
  const pattern = new RegExp(`(${keywords.map(escapeRegex).join("|")})`, "gi");
  const lowered = keywords.map((k) => k.toLowerCase());

  return nodes.flatMap<Fragment>((node, nodeIndex) => {
    if (typeof node !== "string") return node;

    return node.split(pattern).map<Fragment>((part, partIndex) => {
      if (!lowered.includes(part.toLowerCase())) return part;
      const rang = compteur.valeur++;
      return (
        <span
          key={`kw-${nodeIndex}-${partIndex}`}
          className={styles.keyword}
          style={{ "--kw-i": String(rang) } as React.CSSProperties}
        >
          {part}
        </span>
      );
    });
  });
}

export default function AboutPanel({ className, header, isActive }: Props) {
  const { t } = useLanguage();
  const nodesById = new Map(STACK_NODES.map((node) => [node.id, node]));
  // Rang global des mots-clés : il pilote leur ordre d'allumage.
  const rangMotCle = { valeur: 0 };

  // Le texte déborde de sa colonne en français, plus long que l'anglais.
  // On marque le débordement pour que le bas s'estompe : sans ce signal,
  // la dernière ligne paraît coupée au lieu de paraître défilable.
  const texteRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const boite = texteRef.current;
    if (!boite) return;

    const mesurer = () => {
      const deborde = boite.scrollHeight > boite.clientHeight + 2;
      boite.dataset.overflow = String(deborde);
    };

    mesurer();

    // Pendant l'apparition, les paragraphes sont décalés vers le bas :
    // le texte paraît alors déborder de 34 px alors qu'il tient une fois
    // le mouvement terminé. On remesure donc à la fin de l'animation.
    boite.addEventListener("animationend", mesurer);

    // La hauteur de la boîte est plafonnée : elle ne bouge pas quand son
    // contenu change. On surveille donc aussi les paragraphes.
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(boite);
    for (const enfant of boite.children) observateur.observe(enfant);

    return () => {
      boite.removeEventListener("animationend", mesurer);
      observateur.disconnect();
    };
  }, [t]);

  return (
    <section
      className={`${className} ${styles.pane}`}
      aria-label="About"
      data-pane-active={isActive}
    >
      {header}

      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2
            className={styles.title}
            data-fx="clip"
            style={{ "--fx-i": 0 } as React.CSSProperties}
          >
            {t.about.titleLines.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>

          <div className={styles.text} ref={texteRef}>
            {t.about.paragraphs.map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 24)}
                data-fx
                style={{ "--fx-i": String(1 + index) } as React.CSSProperties}
              >
                {highlightKeywords(
                  index === 0 ? highlightIntro(paragraph) : [paragraph],
                  t.about.keywords,
                  rangMotCle,
                )}
              </p>
            ))}
          </div>
        </div>

        <div
          className={styles.constellation}
          data-fx="pop"
          style={{ "--fx-i": 2 } as React.CSSProperties}
        >
          <span className={styles.toolboxGhost} aria-hidden>
            {t.stack.ghost}
          </span>

          <div className={styles.links} aria-hidden>
            {STACK_LINKS.map(([from, to], index) => {
              const a = nodesById.get(from);
              const b = nodesById.get(to);
              if (!a || !b) return null;
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const rawLength = Math.hypot(dx, dy);
              const length = Math.max(0, rawLength - LINK_EDGE_OFFSET * 2);
              const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
              const startX = a.x + (dx / rawLength) * LINK_EDGE_OFFSET;
              const startY = a.y + (dy / rawLength) * LINK_EDGE_OFFSET;

              return (
                <span
                  key={`${from}-${to}`}
                  className={styles.link}
                  style={
                    {
                      "--link-i": String(index),
                      // Valeurs arrondies volontairement : le navigateur
                      // tronque la précision en analysant le style, et
                      // React signalait alors un écart entre le rendu
                      // serveur et le rendu client à chaque chargement.
                      left: `${startX.toFixed(3)}%`,
                      top: `${startY.toFixed(3)}%`,
                      width: `${length.toFixed(3)}%`,
                      rotate: `${angle.toFixed(3)}deg`,
                    } as React.CSSProperties
                  }
                />
              );
            })}
          </div>

          <div className={styles.groupLabels} aria-hidden>
            {t.stack.groups.map((group, i) => (
              <span key={group.label} data-group={i}>
                {group.label}
              </span>
            ))}
          </div>

          {STACK_NODES.map((node) => {
            const label = t.stack.groups[node.group]?.items[node.item] ?? "";
            // Icônes servies depuis `public/icons`. Un CDN externe
            // laissait la constellation se vider s'il tombait, et la
            // version n'y était pas figée.
            const iconSrc = "icon" in node ? `/icons/${node.icon}.svg` : "";

            return (
              <span
                key={node.id}
                className={styles.node}
                data-id={node.id}
                data-group={node.group}
                style={
                  {
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    animationDelay: `${node.delay}s`,
                  } as React.CSSProperties
                }
              >
                <span className={styles.nodeMark}>
                  {iconSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={iconSrc} alt="" loading="lazy" aria-hidden />
                  ) : (
                    initials(label)
                  )}
                </span>
                <span className={styles.nodeLabel}>{label}</span>
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
