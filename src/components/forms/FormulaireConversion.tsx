"use client";

import { useId, useState } from "react";
import { Fleche } from "@/components/ui/section";
import type { Champ, Formulaire } from "@/content/schemas/conversion";

/**
 * Formulaire des pages de conversion (/contact, /devis).
 *
 * Aucun libellé n'est écrit ici : la structure des champs, les messages d'erreur
 * et les états viennent du JSON validé par `content/schemas/conversion.ts`.
 *
 * Validation : celle du navigateur (`required`, `type="email"`, `minLength`),
 * mais l'affichage est repris à la main. `onInvalid` annule l'infobulle native —
 * générique, non stylable, et qui disparaît au premier clic — au profit d'un
 * message persistant relié au champ par `aria-describedby`.
 */

type Etat = "idle" | "envoi" | "succes" | "erreur";
type Ton = "clair" | "sombre";

/**
 * Envoi réel vers `/api/contact`, qui relaie par Resend.
 *
 * L'erreur remontée par la route est propagée telle quelle : le visiteur doit
 * savoir si sa demande n'est pas partie. Une confirmation affichée alors que
 * rien n'a été envoyé est le pire résultat possible pour une page de contact.
 */
async function envoyerFormulaire(donnees: Record<string, string>): Promise<void> {
  const reponse = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donnees),
  });

  if (!reponse.ok) {
    const detail = await reponse.json().catch(() => null);
    throw new Error(detail?.error ?? "Envoi impossible");
  }
}

export function FormulaireConversion({
  formulaire,
  ton = "clair",
}: {
  formulaire: Formulaire;
  ton?: Ton;
}) {
  const [etat, setEtat] = useState<Etat>("idle");
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const uid = useId();

  const idChamp = (name: string) => `${uid}-${name}`;
  const idErreur = (name: string) => `${uid}-${name}-erreur`;
  const idAide = (name: string) => `${uid}-${name}-aide`;

  const sombre = ton === "sombre";

  function marquerErreur(name: string, message: string) {
    setErreurs((precedent) => ({ ...precedent, [name]: message }));
  }

  function effacerErreur(name: string) {
    setErreurs((precedent) => {
      if (!(name in precedent)) return precedent;
      const suite = { ...precedent };
      delete suite[name];
      return suite;
    });
  }

  async function surSoumission(evenement: React.FormEvent<HTMLFormElement>) {
    evenement.preventDefault();
    const form = evenement.currentTarget;

    // `checkValidity()` déclenche un événement `invalid` par champ fautif :
    // nos gestionnaires posent les messages, puis on rend la main à l'utilisateur.
    if (!form.checkValidity()) {
      form.querySelector<HTMLElement>(":invalid")?.focus();
      return;
    }

    setEtat("envoi");
    setErreurs({});

    const donnees = Object.fromEntries(
      [...new FormData(form).entries()].map(([cle, valeur]) => [cle, String(valeur)]),
    );

    try {
      await envoyerFormulaire(donnees);
      setEtat("succes");
    } catch {
      setEtat("erreur");
    }
  }

  /* ------------------------------ Confirmation ---------------------------- */

  if (etat === "succes") {
    return (
      <div
        role="status"
        className={`rounded-2xl border p-8 sm:p-12 ${
          sombre ? "border-beew-creme/25 bg-beew-noir" : "border-beew-noir/15 bg-beew-blanc"
        }`}
      >
        <p className="text-[11px] tracking-[0.25em] text-beew-orange uppercase">
          {formulaire.etats.succesTitre}
        </p>
        <p className={`mt-6 max-w-prose text-lg leading-relaxed ${sombre ? "" : "text-beew-noir"}`}>
          {formulaire.etats.succes}
        </p>
      </div>
    );
  }

  /* -------------------------------- Champs -------------------------------- */

  const baseControle = [
    "w-full min-h-[44px] rounded-xl border bg-transparent px-4 py-3 text-sm",
    "outline-none transition-colors",
    sombre
      ? "border-beew-creme/25 text-beew-creme placeholder:text-beew-creme/35 focus:border-beew-creme"
      : "border-beew-noir/20 text-beew-noir placeholder:text-beew-noir/35 focus:border-beew-noir",
  ].join(" ");

  function rendreChamp(champ: Champ) {
    const enErreur = Boolean(erreurs[champ.name]);
    const decrit = [champ.aide ? idAide(champ.name) : null, enErreur ? idErreur(champ.name) : null]
      .filter(Boolean)
      .join(" ");

    const commun = {
      id: idChamp(champ.name),
      name: champ.name,
      required: champ.requis,
      autoComplete: champ.autoComplete,
      "aria-invalid": enErreur || undefined,
      "aria-describedby": decrit || undefined,
      className: `${baseControle} ${enErreur ? "border-beew-orange" : ""}`,
      onInvalid: (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        marquerErreur(champ.name, champ.erreur);
      },
      onInput: (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (e.currentTarget.validity.valid) effacerErreur(champ.name);
      },
    };

    return (
      <div
        key={champ.name}
        className={champ.demiLargeur ? "sm:col-span-1" : "sm:col-span-2"}
      >
        <label
          htmlFor={idChamp(champ.name)}
          className={`block text-[11px] tracking-[0.2em] uppercase ${
            sombre ? "text-beew-creme/70" : "text-beew-noir/60"
          }`}
        >
          {champ.label}
          {!champ.requis && (
            <span className={sombre ? "text-beew-creme/40" : "text-beew-noir/35"}> (facultatif)</span>
          )}
        </label>

        {champ.aide && (
          <p
            id={idAide(champ.name)}
            className={`mt-2 text-xs leading-relaxed ${
              sombre ? "text-beew-creme/45" : "text-beew-noir/45"
            }`}
          >
            {champ.aide}
          </p>
        )}

        <div className="mt-3">
          {champ.type === "textarea" ? (
            <textarea {...commun} rows={6} placeholder={champ.placeholder} minLength={20} />
          ) : champ.type === "select" ? (
            // `bg-beew-noir` sur fond sombre : sans lui, la liste déroulante
            // native hérite du blanc système et devient illisible.
            <select {...commun} className={`${commun.className} ${sombre ? "bg-beew-noir" : "bg-beew-blanc"}`} defaultValue="">
              <option value="" disabled>
                {champ.placeholder ?? "—"}
              </option>
              {champ.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input {...commun} type={champ.type} placeholder={champ.placeholder} />
          )}
        </div>

        {enErreur && (
          <p id={idErreur(champ.name)} className="mt-2 text-xs leading-relaxed text-beew-orange">
            {erreurs[champ.name]}
          </p>
        )}
      </div>
    );
  }

  /* ------------------------------ Formulaire ------------------------------ */

  return (
    <form onSubmit={surSoumission} className="relative grid gap-6 sm:grid-cols-2">
      {/* Piège à robots : hors flux, hors tabulation, masqué aux lecteurs
          d'écran. Un humain ne peut pas le remplir ; un robot le remplit
          presque toujours, et la route ignore alors silencieusement l'envoi. */}
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor={idChamp("entreprise_site")}>Ne pas remplir</label>
        <input
          id={idChamp("entreprise_site")}
          name="entreprise_site"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {formulaire.champs.map(rendreChamp)}

      <div className="sm:col-span-2">
        <label
          htmlFor={idChamp("consentement")}
          className={`flex min-h-[44px] cursor-pointer items-start gap-4 text-xs leading-relaxed ${
            sombre ? "text-beew-creme/60" : "text-beew-noir/60"
          }`}
        >
          <input
            id={idChamp("consentement")}
            name="consentement"
            type="checkbox"
            required
            aria-describedby={erreurs.consentement ? idErreur("consentement") : undefined}
            aria-invalid={Boolean(erreurs.consentement) || undefined}
            className={`mt-0.5 h-6 w-6 shrink-0 accent-beew-orange ${
              erreurs.consentement ? "outline outline-2 outline-beew-orange" : ""
            }`}
            onInvalid={(e) => {
              e.preventDefault();
              marquerErreur("consentement", formulaire.consentement.erreur);
            }}
            onChange={(e) => {
              if (e.currentTarget.checked) effacerErreur("consentement");
            }}
          />
          <span className="pt-1">{formulaire.consentement.label}</span>
        </label>
        {erreurs.consentement && (
          <p id={idErreur("consentement")} className="mt-2 text-xs text-beew-orange">
            {erreurs.consentement}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-6 sm:col-span-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={etat === "envoi"}
          className={`group inline-flex min-h-[52px] items-center gap-3 rounded-full px-8 py-4 text-[11px] tracking-[0.2em] uppercase transition-opacity hover:opacity-85 disabled:opacity-50 ${
            sombre ? "bg-beew-blanc text-beew-noir" : "bg-beew-noir text-beew-creme"
          }`}
        >
          {etat === "envoi" ? formulaire.etats.envoi : formulaire.bouton}
          <Fleche />
        </button>

        <p className={`text-xs leading-relaxed ${sombre ? "text-beew-creme/45" : "text-beew-noir/45"}`}>
          {formulaire.note}
        </p>
      </div>

      {/* Zone d'annonce : lue par les lecteurs d'écran dès qu'un échec survient. */}
      <p
        role="alert"
        className={`sm:col-span-2 text-sm leading-relaxed text-beew-orange ${
          etat === "erreur" ? "" : "sr-only"
        }`}
      >
        {etat === "erreur" ? formulaire.etats.erreur : ""}
      </p>
    </form>
  );
}
