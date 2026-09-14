/**
 * Moteur de tri des demandes entrantes.
 *
 * Ce fichier ne contient que de la logique pure : aucun appel réseau, rien
 * qui dépende du navigateur. Il sert donc aussi bien à la démonstration
 * publique qu'à un traitement réel côté serveur, et il reste testable.
 */

export const CATEGORIES = [
  "prospect",
  "question",
  "collaboration",
  "spam",
  "autre",
] as const;

export type Categorie = (typeof CATEGORIES)[number];
export type Urgence = "haute" | "moyenne" | "basse";

export type Triage = {
  categorie: Categorie;
  urgence: Urgence;
  /** Langue détectée du message, pour répondre dans la bonne. */
  langue: "fr" | "en";
  /** Une ligne : de quoi s'agit-il. */
  resume: string;
  /** Réponse proposée, à relire avant envoi. */
  reponse: string;
  /** Ce qu'il faut faire ensuite. */
  action: string;
  /** 0 à 1. En dessous de 0,6 le classement mérite une relecture humaine. */
  confiance: number;
  /** Qui a produit ce résultat : le modèle, ou les règles de repli. */
  moteur: "ia" | "regles";
};

export const LONGUEUR_MAX = 2000;

/** Vrai si le texte peut être trié : ni vide, ni démesuré. */
export function messageValide(texte: unknown): texte is string {
  return (
    typeof texte === "string" &&
    texte.trim().length >= 10 &&
    texte.length <= LONGUEUR_MAX
  );
}

/* -------------------------------------------------------------------------
   Repli déterministe
   Le modèle peut manquer : pas de clé, quota épuisé, panne. Une démonstration
   cassée vaut moins que pas de démonstration du tout, donc ces règles
   prennent le relais. Elles sont volontairement simples et lisibles.
   ------------------------------------------------------------------------- */

const MOTS = {
  fr: [
    "le",
    "la",
    "les",
    "vous",
    "nous",
    "bonjour",
    "merci",
    "pour",
    "avec",
    "site",
    "projet",
    "devis",
    "je",
    "une",
    "des",
    "est",
    "que",
    "qui",
    "dans",
    "sur",
    "mon",
    "votre",
    "sommes",
    "cherchons",
  ],
  prospect: [
    "devis",
    "tarif",
    "prix",
    "budget",
    "combien",
    "quote",
    "pricing",
    "cost",
    "hire",
    "recrut",
    "mission",
    "besoin d",
    "we need",
    "looking for",
  ],
  collaboration: [
    "partenariat",
    "collabor",
    "ensemble",
    "partner",
    "freelance pour",
    "sous-trait",
  ],
  question: [
    "comment",
    "pourquoi",
    "est-ce que",
    "question",
    "how do",
    "what is",
    "can you explain",
  ],
  spam: [
    "seo",
    "backlink",
    "crypto",
    "bitcoin",
    "viagra",
    "casino",
    "unsubscribe",
    "click here",
    "guaranteed",
    "dear sir",
    "business proposal",
    "investment opportunity",
  ],
  urgent: [
    "urgent",
    "rapidement",
    "au plus vite",
    "dès que possible",
    "asap",
    "deadline",
    "cette semaine",
    "today",
  ],
};

function contient(texte: string, mots: string[]) {
  return mots.filter((mot) => texte.includes(mot)).length;
}

/**
 * Devine la langue en comptant les mots outils français.
 *
 * La ponctuation est remplacée par des espaces avant comparaison : sans
 * ça, « Bonjour, » et « avez-vous » ne sont pas reconnus, et un message
 * français se voit répondre en anglais.
 */
export function detecterLangue(message: string): "fr" | "en" {
  const texte = ` ${message.toLowerCase().replace(/[^a-zà-ÿ]+/g, " ")} `;
  const marques = MOTS.fr.filter((mot) => texte.includes(` ${mot} `)).length;
  return marques >= 2 ? "fr" : "en";
}

const REPONSES: Record<Categorie, { fr: string; en: string }> = {
  prospect: {
    fr: "Bonjour, merci pour votre message. Votre projet m'intéresse. Pouvons-nous en parler cette semaine, par téléphone ou en visio, pour cadrer le périmètre et le budget ? Je reviens vers vous avec une proposition dans la foulée.",
    en: "Hello, thanks for reaching out. Your project sounds interesting. Could we talk this week, by phone or video, to scope it out and discuss budget? I'll follow up with a proposal right after.",
  },
  collaboration: {
    fr: "Bonjour, merci pour votre proposition. Je suis ouvert aux collaborations. Pouvez-vous m'en dire plus sur le cadre envisagé et le rythme de travail attendu ?",
    en: "Hello, thanks for the proposal. I'm open to collaborating. Could you tell me more about the setup you have in mind and the expected workload?",
  },
  question: {
    fr: "Bonjour, merci pour votre question. Voici ce que je peux vous dire en quelques lignes, et je reste disponible si vous souhaitez qu'on approfondisse.",
    en: "Hello, thanks for your question. Here's a short answer and I'm happy to go into more detail if useful.",
  },
  spam: {
    fr: "Aucune réponse nécessaire.",
    en: "No reply needed.",
  },
  autre: {
    fr: "Bonjour, merci pour votre message. Je le lis et reviens vers vous rapidement.",
    en: "Hello, thanks for your message. I'll read it and get back to you shortly.",
  },
};

const ACTIONS: Record<Categorie, { fr: string; en: string }> = {
  prospect: { fr: "Répondre sous 24 h", en: "Reply within 24 h" },
  collaboration: { fr: "Répondre sous 48 h", en: "Reply within 48 h" },
  question: { fr: "Répondre sous 48 h", en: "Reply within 48 h" },
  spam: { fr: "Archiver sans réponse", en: "Archive, no reply" },
  autre: { fr: "À relire soi-même", en: "Read it yourself" },
};

/** Classement par règles, utilisé quand le modèle n'est pas joignable. */
export function trierParRegles(message: string): Triage {
  const texte = message.toLowerCase();
  const langue = detecterLangue(message);

  const scores: Record<Categorie, number> = {
    spam: contient(texte, MOTS.spam) * 2,
    prospect: contient(texte, MOTS.prospect),
    collaboration: contient(texte, MOTS.collaboration),
    question: contient(texte, MOTS.question),
    autre: 0,
  };

  const [categorie, score] = (
    Object.entries(scores) as [Categorie, number][]
  ).reduce((meilleur, actuel) =>
    actuel[1] > meilleur[1] ? actuel : meilleur,
  );

  const retenue: Categorie = score === 0 ? "autre" : categorie;
  const presse = contient(texte, MOTS.urgent) > 0;

  const urgence: Urgence =
    retenue === "spam"
      ? "basse"
      : presse || retenue === "prospect"
        ? "haute"
        : "moyenne";

  return {
    categorie: retenue,
    urgence,
    langue,
    resume:
      langue === "fr"
        ? `Message classé « ${retenue} » d'après les mots-clés repérés.`
        : `Message sorted as "${retenue}" from the keywords found.`,
    reponse: REPONSES[retenue][langue],
    action: ACTIONS[retenue][langue],
    // Des règles par mots-clés ne valent pas une lecture : on l'assume.
    confiance: score === 0 ? 0.3 : Math.min(0.55, 0.3 + score * 0.1),
    moteur: "regles",
  };
}

/* -------------------------------------------------------------------------
   Consigne envoyée au modèle
   ------------------------------------------------------------------------- */

export function construireConsigne(message: string) {
  return `Tu tries les demandes reçues par le formulaire de contact d'Antonino Lo Bianco, développeur web et spécialiste en automatisation à Bruxelles.

Analyse le message ci-dessous et réponds UNIQUEMENT par un objet JSON valide, sans texte autour, sans balises de code.

Champs attendus :
- "categorie" : un seul mot parmi ${CATEGORIES.join(", ")}
- "urgence" : haute, moyenne ou basse
- "langue" : fr ou en, la langue du message
- "resume" : une seule phrase courte décrivant la demande
- "reponse" : une réponse prête à envoyer, rédigée dans la langue du message, polie, directe, sans formule creuse, maximum 4 phrases
- "action" : ce qu'Antonino doit faire ensuite, en cinq mots maximum
- "confiance" : un nombre entre 0 et 1

Si le message est une sollicitation commerciale non désirée, du référencement, de la crypto ou une arnaque, classe-le en "spam", mets une confiance élevée et propose "Archiver sans réponse" comme action.

Message :
"""
${message.slice(0, LONGUEUR_MAX)}
"""`;
}

/** Valide et normalise ce que renvoie le modèle : il peut dévier. */
export function lireReponseModele(brut: string): Triage | null {
  // Le modèle encadre parfois son JSON de balises de code malgré la consigne.
  const nettoye = brut
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const debut = nettoye.indexOf("{");
  const fin = nettoye.lastIndexOf("}");
  if (debut === -1 || fin === -1) return null;

  let donnees: Record<string, unknown>;
  try {
    donnees = JSON.parse(nettoye.slice(debut, fin + 1));
  } catch {
    return null;
  }

  const categorie = String(donnees.categorie ?? "").toLowerCase();
  const urgence = String(donnees.urgence ?? "").toLowerCase();
  const langue = String(donnees.langue ?? "").toLowerCase();

  if (!CATEGORIES.includes(categorie as Categorie)) return null;
  if (typeof donnees.reponse !== "string" || donnees.reponse.trim() === "") {
    return null;
  }

  const confiance = Number(donnees.confiance);

  return {
    categorie: categorie as Categorie,
    urgence: (["haute", "moyenne", "basse"].includes(urgence)
      ? urgence
      : "moyenne") as Urgence,
    langue: langue === "fr" ? "fr" : "en",
    resume: String(donnees.resume ?? "").slice(0, 300),
    reponse: donnees.reponse.slice(0, 1200),
    action: String(donnees.action ?? "").slice(0, 80),
    confiance: Number.isFinite(confiance)
      ? Math.min(1, Math.max(0, confiance))
      : 0.7,
    moteur: "ia",
  };
}
