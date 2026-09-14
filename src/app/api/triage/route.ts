import { NextResponse } from "next/server";

import {
  construireConsigne,
  lireReponseModele,
  messageValide,
  trierParRegles,
  type Triage,
} from "@/lib/triage";

/**
 * Tri d'une demande entrante.
 *
 * La clé du modèle reste côté serveur : elle n'apparaît jamais dans la page.
 * Rien n'est enregistré, ni le message reçu ni le résultat produit.
 */

/**
 * Modèle Flash, couvert par le niveau gratuit. Les versions sont retirées
 * régulièrement : quand l'API renvoie un 404, elle nomme le remplaçant
 * dans son message d'erreur, visible dans le journal du serveur.
 */
const MODELE = "gemini-3.6-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODELE}:generateContent`;

/** Au-delà, on refuse : le quota gratuit est partagé par tous les visiteurs. */
const ESSAIS_MAX = 8;
const FENETRE_MS = 10 * 60 * 1000;

/**
 * Compteur en mémoire du processus. Il se remet à zéro à chaque
 * redémarrage et n'est pas partagé entre instances : c'est un garde-fou
 * contre l'emballement, pas une protection contre un attaquant décidé.
 */
const passages = new Map<string, number[]>();

function tropDEssais(cle: string) {
  const maintenant = Date.now();
  const recents = (passages.get(cle) ?? []).filter(
    (t) => maintenant - t < FENETRE_MS,
  );

  if (recents.length >= ESSAIS_MAX) {
    passages.set(cle, recents);
    return true;
  }

  recents.push(maintenant);
  passages.set(cle, recents);

  // Purge opportuniste : sans elle la table grossit indéfiniment.
  if (passages.size > 500) {
    for (const [k, v] of passages) {
      if (v.every((t) => maintenant - t >= FENETRE_MS)) passages.delete(k);
    }
  }

  return false;
}

function identifiant(request: Request) {
  const entete =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "";
  return entete.split(",")[0].trim() || "inconnu";
}

/** Interroge le modèle. Renvoie null si quoi que ce soit se passe mal. */
async function trierParModele(message: string): Promise<Triage | null> {
  const cle = process.env.GEMINI_API_KEY?.trim();
  if (!cle) return null;

  try {
    const reponse = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": cle,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: construireConsigne(message) }] }],
        generationConfig: {
          temperature: 0.3,
          /**
           * Ce modèle raisonne avant de répondre, et sa réflexion puise
           * dans ce même budget. Trop court, la réponse est tronquée en
           * plein JSON et devient illisible. Il faut donc prévoir large :
           * la réflexion coûte souvent plus que la réponse elle-même.
           */
          maxOutputTokens: 3000,
          responseMimeType: "application/json",
        },
      }),
      // Une démonstration qui fait patienter trop longtemps donne une
      // mauvaise impression : on préfère basculer sur les règles.
      signal: AbortSignal.timeout(12000),
    });

    if (!reponse.ok) {
      console.error("Gemini a refusé :", reponse.status, await reponse.text());
      return null;
    }

    const donnees = await reponse.json();
    const candidat = donnees?.candidates?.[0];
    const texte: unknown = candidat?.content?.parts?.[0]?.text ?? "";

    const lu = typeof texte === "string" ? lireReponseModele(texte) : null;

    // Sans cette trace, un basculement sur les règles restait muet : la
    // démonstration semblait marcher alors que le modèle ne répondait pas.
    if (!lu) {
      console.error(
        "Réponse du modèle inexploitable. finishReason:",
        candidat?.finishReason,
        "| début:",
        String(texte).slice(0, 200),
      );
    }

    return lu;
  } catch (erreur) {
    console.error("Appel au modèle impossible :", erreur);
    return null;
  }
}

export async function POST(request: Request) {
  let corps: Record<string, unknown>;
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ erreur: "corps-invalide" }, { status: 400 });
  }

  const message = corps.message;
  if (!messageValide(message)) {
    return NextResponse.json({ erreur: "message-invalide" }, { status: 400 });
  }

  if (tropDEssais(identifiant(request))) {
    return NextResponse.json({ erreur: "trop-d-essais" }, { status: 429 });
  }

  // Le modèle d'abord, les règles en filet : la démonstration répond
  // toujours, même sans clé configurée ou quota épuisé.
  const resultat = (await trierParModele(message)) ?? trierParRegles(message);

  return NextResponse.json(resultat);
}
