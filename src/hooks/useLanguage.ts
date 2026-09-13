"use client";

import { useEffect, useSyncExternalStore } from "react";

import { COPY, type Lang } from "@/lib/i18n";

const STORAGE_KEY = "portfolio-lang";

/**
 * La langue vit dans un petit store hors de React : tous les composants
 * la lisent via `useSyncExternalStore`, sans avoir à traverser un
 * fournisseur de contexte, et le rendu serveur reste cohérent.
 */
let current: Lang | null = null;
const listeners = new Set<() => void>();

function detect(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "fr" || saved === "en") return saved;
    return navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en";
  } catch {
    // Navigation privée ou stockage bloqué : l'anglais fait office de défaut.
    return "en";
  }
}

function getSnapshot(): Lang {
  if (!current) current = detect();
  return current;
}

/** Le serveur ne connaît ni le stockage ni le navigateur : il rend l'anglais. */
function getServerSnapshot(): Lang {
  return "en";
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function setLanguage(next: Lang) {
  if (current === next) return;
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Le choix ne survivra pas au rechargement, mais la page fonctionne.
  }
  for (const listener of listeners) listener();
}

export function useLanguage() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const t = COPY[lang];

  // Tient l'attribut `lang` du document à jour : il sert aux lecteurs
  // d'écran, à la césure et aux moteurs de recherche.
  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
  }, [t.htmlLang]);

  return { lang, t, setLanguage };
}
