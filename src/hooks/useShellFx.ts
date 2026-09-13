"use client";

import { useEffect, type RefObject } from "react";

/** Lissage du halo : plus la valeur est basse, plus il traîne derrière la souris. */
const AURA_EASING = 0.12;

function prefersMotion() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Halo lumineux qui suit le curseur dans la vitre, et parallaxe des
 * éléments marqués `data-parallax` (la valeur donne l'amplitude en px,
 * négative pour aller à contresens du curseur).
 */
export function useShellFx(
  shellRef: RefObject<HTMLElement | null>,
  auraRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const shell = shellRef.current;
    const aura = auraRef.current;
    if (!shell || !aura || !prefersMotion()) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let ratioX = 0;
    let ratioY = 0;
    let frame = 0;

    // Interrogé une fois : refaire la requête à chaque image serait du
    // gaspillage, d'autant qu'aucun élément ne dérive aujourd'hui.
    const drifting = Array.from(
      shell.querySelectorAll<HTMLElement>("[data-parallax]"),
    );

    const onMove = (event: PointerEvent) => {
      const rect = shell.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
      ratioX = targetX / rect.width - 0.5;
      ratioY = targetY / rect.height - 0.5;
      aura.style.opacity = "1";
    };

    const onLeave = () => {
      aura.style.opacity = "0";
      ratioX = 0;
      ratioY = 0;
    };

    const loop = () => {
      currentX += (targetX - currentX) * AURA_EASING;
      currentY += (targetY - currentY) * AURA_EASING;
      aura.style.translate = `${currentX.toFixed(1)}px ${currentY.toFixed(1)}px`;

      for (const node of drifting) {
        const strength = Number(node.dataset.parallax) || 0;
        node.style.translate = `${(ratioX * strength).toFixed(1)}px ${(ratioY * strength * 0.62).toFixed(1)}px`;
      }

      frame = requestAnimationFrame(loop);
    };
    loop();

    shell.addEventListener("pointermove", onMove);
    shell.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      shell.removeEventListener("pointermove", onMove);
      shell.removeEventListener("pointerleave", onLeave);
    };
  }, [shellRef, auraRef]);
}

/**
 * Boutons et liens magnétiques : ils se décalent légèrement vers le
 * curseur au survol. Réappliqué à chaque changement de panneau, le temps
 * que les éléments du panneau soient montés.
 */
export function useMagneticControls(
  shellRef: RefObject<HTMLElement | null>,
  deps: unknown[],
) {
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || !prefersMotion()) return;

    const cleanups: Array<() => void> = [];

    for (const node of shell.querySelectorAll<HTMLElement>(
      // `data-no-magnet` permet à un bouton de refuser l'effet et de se
      // contenter d'un survol discret.
      "button:not([data-no-magnet]), form a, nav a",
    )) {
      const move = (event: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 9;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 6;
        node.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
        node.style.scale = "1.05";
      };
      const reset = () => {
        node.style.translate = "";
        node.style.scale = "";
      };

      node.addEventListener("pointermove", move);
      node.addEventListener("pointerleave", reset);
      cleanups.push(() => {
        node.removeEventListener("pointermove", move);
        node.removeEventListener("pointerleave", reset);
        reset();
      });
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shellRef, ...deps]);
}
