"use client";

import { useEffect, useState } from "react";

/**
 * Suit une media query côté client. Renvoie `false` au premier rendu (et
 * pendant le rendu serveur), puis la vraie valeur dès le montage.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}
