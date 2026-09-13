"use client";

import { useEffect, type RefObject } from "react";

const MAX_ROTATION_DEG = 13;

/**
 * Effet de parallaxe 3D au survol : la carte s'incline vers la souris et
 * chaque enfant portant `data-depth` se décale proportionnellement.
 * Désactivé sur les pointeurs tactiles et si l'utilisateur a réduit les
 * animations.
 */
export function useTilt(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const card = ref.current;
    if (!card) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const layers = Array.from(
      card.querySelectorAll<HTMLElement>("[data-depth]"),
    );

    const move = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `perspective(1000px) rotateY(${(px * MAX_ROTATION_DEG).toFixed(2)}deg) rotateX(${(-py * MAX_ROTATION_DEG).toFixed(2)}deg) translateY(-8px) scale(1.03)`;
      card.style.boxShadow = "0 40px 80px rgba(0,0,0,0.6)";
      card.style.borderColor = "rgba(255,255,255,0.32)";

      for (const layer of layers) {
        const depth = Number(layer.dataset.depth) || 0;
        layer.style.transform = `translate3d(${(-px * depth).toFixed(1)}px, ${(-py * depth).toFixed(1)}px, ${depth}px)`;
      }
    };

    const reset = () => {
      card.style.transform = "";
      card.style.boxShadow = "";
      card.style.borderColor = "";
      for (const layer of layers) layer.style.transform = "";
    };

    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", reset);
    return () => {
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", reset);
    };
  }, [ref]);
}
