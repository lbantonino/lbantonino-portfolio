"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { LONGUEUR_MAX, type Triage } from "@/lib/triage";
import { useLanguage } from "@/hooks/useLanguage";
import styles from "./TriageDemo.module.css";

/**
 * Les textes vivent ici plutôt que dans `i18n.ts` : cette page est une
 * annexe autonome, et charger son vocabulaire dans le dictionnaire du site
 * alourdirait toutes les autres sections pour rien.
 */
const TEXTES = {
  fr: {
    retour: "Retour au portfolio",
    eyebrow: "Démonstration en direct",
    titre: ["Une demande arrive.", "Personne n'ouvre la boîte."],
    intro:
      "Écrivez le message que vous m'enverriez, ou choisissez un exemple. Il sera classé, une réponse sera rédigée et l'action à mener sera décidée. Rien n'est enregistré.",
    exemples: "Exemples",
    champ: "Le message reçu",
    placeholder:
      "Bonjour, nous cherchons quelqu'un pour refaire le site de notre société. Quel serait le budget ?",
    envoyer: "Trier ce message",
    encours: "Analyse en cours…",
    vide: "Écrivez au moins dix caractères.",
    trop: "Vous avez atteint la limite d'essais. Réessayez dans quelques minutes.",
    panne: "L'analyse a échoué. Réessayez dans un instant.",
    resultats: "Résultat",
    categorie: "Catégorie",
    urgence: "Urgence",
    confiance: "Confiance",
    action: "Action à mener",
    resume: "En une ligne",
    reponse: "Réponse proposée",
    copier: "Copier la réponse",
    copie: "Copiée",
    moteurIa: "Analysé par le modèle",
    moteurRegles:
      "Modèle indisponible : classement de secours par règles, toujours fonctionnel",
    note: "Les messages de cette démonstration sont analysés puis oubliés. Aucune donnée n'est conservée.",
    categories: {
      prospect: "Prospect",
      question: "Question",
      collaboration: "Collaboration",
      spam: "Indésirable",
      autre: "Autre",
    },
    urgences: { haute: "Haute", moyenne: "Moyenne", basse: "Basse" },
  },
  en: {
    retour: "Back to portfolio",
    eyebrow: "Live demo",
    titre: ["A request comes in.", "Nobody opens the inbox."],
    intro:
      "Write the message you would send me, or pick an example. It gets sorted, a reply is drafted and the next action is decided. Nothing is stored.",
    exemples: "Examples",
    champ: "Incoming message",
    placeholder:
      "Hi, we're looking for someone to rebuild our company website. What would the budget be?",
    envoyer: "Sort this message",
    encours: "Analysing…",
    vide: "Write at least ten characters.",
    trop: "You've hit the demo limit. Try again in a few minutes.",
    panne: "The analysis failed. Please try again.",
    resultats: "Result",
    categorie: "Category",
    urgence: "Urgency",
    confiance: "Confidence",
    action: "Next action",
    resume: "In one line",
    reponse: "Suggested reply",
    copier: "Copy the reply",
    copie: "Copied",
    moteurIa: "Analysed by the model",
    moteurRegles:
      "Model unavailable: fallback rule-based sorting, still working",
    note: "Messages in this demo are analysed then forgotten. Nothing is stored.",
    categories: {
      prospect: "Lead",
      question: "Question",
      collaboration: "Collaboration",
      spam: "Spam",
      autre: "Other",
    },
    urgences: { haute: "High", moyenne: "Medium", basse: "Low" },
  },
} as const;

const EXEMPLES = {
  fr: [
    {
      nom: "Un vrai prospect",
      texte:
        "Bonjour, je suis gérant d'une société de nettoyage à Bruxelles. Notre site date de 2016 et ne rapporte plus aucune demande de devis. Nous voudrions le refaire entièrement d'ici la fin du trimestre. Quel budget faut-il prévoir ?",
    },
    {
      nom: "Une question technique",
      texte:
        "Bonjour, j'ai vu votre projet BEHYBRID. Comment avez-vous géré l'espace membre et l'envoi de la newsletter ? Je travaille sur quelque chose de similaire.",
    },
    {
      nom: "Un indésirable",
      texte:
        "Dear Sir, we are an SEO agency offering guaranteed first page ranking on Google. We can provide 5000 backlinks for a very low price. Click here to claim your free audit today.",
    },
  ],
  en: [
    {
      nom: "A real lead",
      texte:
        "Hello, I run a cleaning company in Brussels. Our website is from 2016 and no longer brings in any quote requests. We'd like it rebuilt from scratch before the end of the quarter. What budget should we plan for?",
    },
    {
      nom: "A technical question",
      texte:
        "Hi, I saw your BEHYBRID project. How did you handle the member area and the newsletter sending? I'm working on something similar.",
    },
    {
      nom: "Spam",
      texte:
        "Dear Sir, we are an SEO agency offering guaranteed first page ranking on Google. We can provide 5000 backlinks for a very low price. Click here to claim your free audit today.",
    },
  ],
} as const;

type Etat = "repos" | "envoi" | "fait" | "erreur";

export default function TriageDemo() {
  const { lang } = useLanguage();
  const t = TEXTES[lang];

  const [message, setMessage] = useState("");
  const [etat, setEtat] = useState<Etat>("repos");
  const [probleme, setProbleme] = useState("");
  const [resultat, setResultat] = useState<Triage | null>(null);
  const [copie, setCopie] = useState(false);

  const envoyer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (etat === "envoi") return;

    if (message.trim().length < 10) {
      setProbleme(t.vide);
      setEtat("erreur");
      return;
    }

    setEtat("envoi");
    setProbleme("");
    setResultat(null);

    try {
      const reponse = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (reponse.status === 429) {
        setProbleme(t.trop);
        setEtat("erreur");
        return;
      }
      if (!reponse.ok) throw new Error(String(reponse.status));

      setResultat(await reponse.json());
      setEtat("fait");
    } catch {
      setProbleme(t.panne);
      setEtat("erreur");
    }
  };

  const copier = async () => {
    if (!resultat) return;
    try {
      await navigator.clipboard.writeText(resultat.reponse);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      // Le presse-papiers peut être refusé : le texte reste sélectionnable.
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <Link href="/" className={styles.retour}>
          ← {t.retour}
        </Link>

        <header className={styles.entete}>
          <span className={styles.eyebrow}>
            <span className={styles.point} aria-hidden />
            {t.eyebrow}
          </span>
          <h1 className={styles.titre}>
            {t.titre[0]}
            <br />
            <span className={styles.titreFaded}>{t.titre[1]}</span>
          </h1>
          <p className={styles.intro}>{t.intro}</p>
        </header>

        <div className={styles.colonnes}>
          <form className={styles.formulaire} onSubmit={envoyer}>
            <div className={styles.exemples}>
              <span className={styles.exemplesTitre}>{t.exemples}</span>
              {EXEMPLES[lang].map((exemple) => (
                <button
                  key={exemple.nom}
                  type="button"
                  className={styles.exemple}
                  onClick={() => {
                    setMessage(exemple.texte);
                    setEtat("repos");
                    setResultat(null);
                  }}
                >
                  {exemple.nom}
                </button>
              ))}
            </div>

            <label className={styles.champ}>
              {t.champ}
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={t.placeholder}
                maxLength={LONGUEUR_MAX}
                rows={9}
                className={styles.zone}
              />
            </label>

            <div className={styles.pied}>
              <span className={styles.compteur}>
                {message.length} / {LONGUEUR_MAX}
              </span>
              <button
                type="submit"
                className={styles.envoyer}
                disabled={etat === "envoi"}
              >
                {etat === "envoi" ? t.encours : t.envoyer}
              </button>
            </div>

            {etat === "erreur" && (
              <p className={styles.probleme} role="status">
                {probleme}
              </p>
            )}
          </form>

          <section className={styles.resultat} aria-live="polite">
            {!resultat && etat !== "envoi" && (
              <p className={styles.attente}>{t.note}</p>
            )}

            {etat === "envoi" && (
              <div className={styles.chargement}>
                <span />
                <span />
                <span />
              </div>
            )}

            {resultat && etat === "fait" && (
              <>
                <div className={styles.etiquettes}>
                  <span
                    className={styles.categorie}
                    data-categorie={resultat.categorie}
                  >
                    {t.categories[resultat.categorie]}
                  </span>
                  <span
                    className={styles.urgenceBadge}
                    data-urgence={resultat.urgence}
                  >
                    {t.urgence} : {t.urgences[resultat.urgence]}
                  </span>
                  <span className={styles.confiance}>
                    {t.confiance} {Math.round(resultat.confiance * 100)}%
                  </span>
                </div>

                <div className={styles.bloc}>
                  <span className={styles.blocTitre}>{t.resume}</span>
                  <p>{resultat.resume}</p>
                </div>

                <div className={styles.bloc}>
                  <span className={styles.blocTitre}>{t.action}</span>
                  <p className={styles.action}>{resultat.action}</p>
                </div>

                <div className={styles.bloc}>
                  <span className={styles.blocTitre}>{t.reponse}</span>
                  <p className={styles.reponse}>{resultat.reponse}</p>
                  <button
                    type="button"
                    className={styles.copier}
                    onClick={copier}
                  >
                    {copie ? t.copie : t.copier}
                  </button>
                </div>

                <p className={styles.moteur} data-moteur={resultat.moteur}>
                  {resultat.moteur === "ia" ? t.moteurIa : t.moteurRegles}
                </p>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
