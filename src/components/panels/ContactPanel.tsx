"use client";

import { useState, type FormEvent } from "react";
import type { ReactNode } from "react";

import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/content";
import { useLanguage } from "@/hooks/useLanguage";
import styles from "./ContactPanel.module.css";

type Props = {
  className: string;
  header: ReactNode;
  isActive: boolean;
};

type Etat = "repos" | "envoi" | "envoye" | "erreur";

/**
 * Web3Forms reçoit l'envoi directement depuis le navigateur : leur
 * service répond par un challenge Cloudflare aux requêtes venant d'un
 * serveur. La clé est publique par conception, elle ne permet que
 * d'écrire dans la boîte du compte.
 */
const ENDPOINT = "https://api.web3forms.com/submit";

export default function ContactPanel({ className, header, isActive }: Props) {
  const { t } = useLanguage();
  const [etat, setEtat] = useState<Etat>("repos");

  // Le message part vers notre route serveur, qui le relaie à Web3Forms.
  // La clé reste côté serveur et n'apparaît jamais dans la page.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (etat === "envoi") return;

    const formulaire = event.currentTarget;
    const champs = new FormData(formulaire);
    setEtat("envoi");

    try {
      const cle = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
      if (!cle) throw new Error("clé absente");

      // Champ piège rempli : c'est un robot. On affiche un succès sans
      // rien envoyer, pour ne pas lui indiquer qu'il a été repéré.
      if (String(champs.get("company") ?? "").trim() !== "") {
        setEtat("envoye");
        formulaire.reset();
        return;
      }

      champs.delete("company");
      champs.append("access_key", cle);
      champs.append("from_name", "Portfolio Antonino");
      champs.append(
        "subject",
        t.contact.mailSubject.replace("{name}", String(champs.get("name") ?? "")),
      );
      // Répondre au message écrit directement au visiteur.
      champs.append("replyto", String(champs.get("email") ?? ""));

      // Envoi en `FormData` et sans en-tête ajouté : tout autre format
      // déclenche une requête préalable CORS que Web3Forms rejette.
      const reponse = await fetch(ENDPOINT, { method: "POST", body: champs });
      const resultat = await reponse.json();
      if (!reponse.ok || !resultat.success) {
        throw new Error(resultat.message ?? "refus");
      }

      setEtat("envoye");
      formulaire.reset();
    } catch {
      setEtat("erreur");
    }
  };

  const note = {
    repos: t.contact.noteIdle,
    envoi: t.contact.noteSending,
    envoye: t.contact.noteSent,
    erreur: t.contact.noteError.replace("{email}", CONTACT_EMAIL),
  }[etat];

  return (
    <section
      className={`${className} ${styles.pane}`}
      aria-label="Contact"
      data-pane-active={isActive}
    >
      {header}

      <div className={styles.grid}>
        <div>
          <h2 className={styles.title} data-fx="clip" style={{ "--fx-i": 1 } as React.CSSProperties}>
            {t.contact.titleLines.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>
          <p className={styles.lede}>
            {t.contact.lede.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </p>

          <div className={styles.links} data-fx style={{ "--fx-i": 2 } as React.CSSProperties}>
            <a href={`mailto:${CONTACT_EMAIL}`} className={styles.link}>
              {t.contact.emailRow}
              <span className={styles.linkHandle}>{CONTACT_EMAIL}</span>
            </a>

            {/* La ligne n'apparaît que si le numéro est renseigné. */}
            {CONTACT_PHONE && (
              <a
                href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
                className={styles.link}
              >
                {t.contact.phoneRow}
                <span className={styles.linkHandle}>{CONTACT_PHONE}</span>
              </a>
            )}
          </div>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
          data-fx
          style={{ "--fx-i": 4 } as React.CSSProperties}
        >
          <label className={styles.field}>
            {t.contact.nameLabel}
            <input
              className={styles.input}
              type="text"
              name="name"
              placeholder={t.contact.namePlaceholder}
              autoComplete="name"
              required
            />
          </label>

          <label className={styles.field}>
            {t.contact.emailLabel}
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder={t.contact.emailPlaceholder}
              autoComplete="email"
              required
            />
          </label>

          <label className={styles.field}>
            {t.contact.messageLabel}
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              name="message"
              rows={3}
              placeholder={t.contact.messagePlaceholder}
              required
            />
          </label>

          {/* Champ piège pour les robots : hors écran et ignoré au clavier. */}
          <input
            type="text"
            name="company"
            className={styles.honeypot}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
          />

          <button
            type="submit"
            className={styles.submit}
            data-no-magnet
            disabled={etat === "envoi"}
          >
            {t.contact.submit}
          </button>

          <span className={styles.note} role="status" data-etat={etat}>
            {note}
          </span>
        </form>
      </div>
    </section>
  );
}
