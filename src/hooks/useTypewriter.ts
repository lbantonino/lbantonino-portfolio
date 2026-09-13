"use client";

import { useEffect, useState } from "react";

type Phase = "typing" | "holding" | "erasing" | "pausing";
type State = { count: number; phase: Phase };

const TIMINGS = {
  /** Durée entre deux caractères à la frappe. */
  type: 58,
  /** Temps d'affichage du texte complet avant effacement. */
  hold: 2600,
  /** L'effacement est plus rapide que la frappe, comme un retour arrière. */
  erase: 26,
  /** Respiration avant de retaper. */
  pause: 550,
};

/** État suivant de la machine : frappe, pause, effacement, reprise. */
function advance({ count, phase }: State, length: number): State {
  switch (phase) {
    case "typing":
      return count >= length
        ? { count, phase: "holding" }
        : { count: count + 1, phase };
    case "holding":
      return { count, phase: "erasing" };
    case "erasing":
      return count <= 0
        ? { count, phase: "pausing" }
        : { count: count - 1, phase };
    default:
      return { count, phase: "typing" };
  }
}

/** Délai avant la prochaine étape, selon l'étape courante. */
function delayFor({ count, phase }: State, length: number): number {
  switch (phase) {
    case "typing":
      return count >= length ? 0 : TIMINGS.type;
    case "holding":
      return TIMINGS.hold;
    case "erasing":
      return count <= 0 ? 0 : TIMINGS.erase;
    default:
      return TIMINGS.pause;
  }
}

/**
 * Frappe le texte caractère par caractère, le laisse affiché, l'efface,
 * puis recommence sans fin. `enabled` à false rend le texte complet et
 * figé : c'est le cas quand l'utilisateur a réduit les animations.
 */
export function useTypewriter(text: string, enabled: boolean) {
  const [state, setState] = useState<State>({ count: 0, phase: "typing" });

  useEffect(() => {
    if (!enabled) return;
    const id = setTimeout(
      () => setState((current) => advance(current, text.length)),
      delayFor(state, text.length),
    );
    return () => clearTimeout(id);
  }, [state, enabled, text.length]);

  const count = enabled ? state.count : text.length;

  return {
    typed: text.slice(0, count),
    /** Le curseur cesse de clignoter pendant la frappe, comme un vrai. */
    steady: enabled && (state.phase === "typing" || state.phase === "erasing"),
  };
}
