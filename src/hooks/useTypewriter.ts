"use client";

import { useEffect, useState } from "react";

type Phase = "typing" | "holding" | "erasing" | "pausing";
type State = { index: number; count: number; phase: Phase };

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

/** État suivant de la machine : frappe, pause, effacement, puis texte
 *  suivant. */
function advance(
  { index, count, phase }: State,
  length: number,
  total: number,
): State {
  switch (phase) {
    case "typing":
      return count >= length
        ? { index, count, phase: "holding" }
        : { index, count: count + 1, phase };
    case "holding":
      return { index, count, phase: "erasing" };
    case "erasing":
      return count <= 0
        ? { index, count, phase: "pausing" }
        : { index, count: count - 1, phase };
    default:
      return { index: (index + 1) % total, count, phase: "typing" };
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
 * Frappe chaque texte caractère par caractère, le laisse affiché, l'efface,
 * puis passe au suivant et recommence sans fin. `enabled` à false rend le
 * premier texte complet et figé : c'est le cas quand l'utilisateur a
 * réduit les animations.
 */
export function useTypewriter(texts: string[], enabled: boolean) {
  const [state, setState] = useState<State>({
    index: 0,
    count: 0,
    phase: "typing",
  });

  const index = enabled ? state.index % texts.length : 0;
  const text = texts[index];

  useEffect(() => {
    if (!enabled) return;
    const id = setTimeout(
      () =>
        setState((current) => advance(current, text.length, texts.length)),
      delayFor(state, text.length),
    );
    return () => clearTimeout(id);
  }, [state, enabled, text.length, texts.length]);

  const count = enabled ? state.count : text.length;

  return {
    index,
    typed: text.slice(0, count),
    /** Le curseur cesse de clignoter pendant la frappe, comme un vrai. */
    steady: enabled && (state.phase === "typing" || state.phase === "erasing"),
  };
}
