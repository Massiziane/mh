import Link from "next/link";

import { createPricingPlan } from "../actions";

export default function NewPricingPlanPage() {
  const inputClass =
    "mt-2 w-full rounded-[14px] border border-[#113b5e]/15 bg-[#f8fbfe] px-4 py-3 text-[#182433] outline-none transition placeholder:text-[#677789]/50 focus:border-[#0868ad] focus:bg-white focus:ring-4 focus:ring-[#0868ad]/10";

  const labelClass =
    "text-sm font-black text-[#032f55]";

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="mb-8">
        <Link
          href="/admin/pricing"
          className="text-sm font-bold !text-[#0868ad]"
        >
          ← Retour aux tarifs
        </Link>

        <span className="mt-6 inline-flex rounded-full bg-[#fff6d8] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#8a6b00]">
          Nouvelle formule
        </span>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-[#032f55]">
          Ajouter une formule
        </h1>

        <p className="mt-2 max-w-[650px] text-sm leading-6 text-[#677789]">
          Cette formule sera utilisée à la fois pour la carte
          de tarif et pour sa page détaillée.
        </p>
      </div>

      <form
        action={createPricingPlan}
        className="rounded-[22px] border border-[#113b5e]/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,38,70,0.06)] sm:p-8"
      >
        {/* Basic information */}
        <section>
          <h2 className="text-xl font-black text-[#032f55]">
            Informations principales
          </h2>

          <p className="mt-1 text-sm text-[#677789]">
            Informations affichées sur la carte de tarif.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <label>
              <span className={labelClass}>
                Titre *
              </span>

              <input
                name="title"
                required
                placeholder="Service à vie — 60 à 69 ans"
                className={inputClass}
              />
            </label>

            <label>
              <span className={labelClass}>
                Groupe d&apos;âge *
              </span>

              <input
                name="age"
                required
                placeholder="60 à 69 ans"
                className={inputClass}
              />
            </label>

            <label>
              <span className={labelClass}>
                Prix *
              </span>

              <div className="relative">
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="499.00"
                  className={`${inputClass} pr-12`}
                />

                <span className="pointer-events-none absolute bottom-[13px] right-4 font-black text-[#677789]">
                  $
                </span>
              </div>
            </label>

            <label>
              <span className={labelClass}>
                Badge
              </span>

              <input
                name="badge"
                placeholder="Le plus populaire"
                className={inputClass}
              />
            </label>

            <label>
              <span className={labelClass}>
                Slug
              </span>

              <input
                name="slug"
                placeholder="60-69-ans"
                className={inputClass}
              />

              <p className="mt-2 text-xs text-[#677789]">
                Laissez vide pour le générer automatiquement
                à partir du titre.
              </p>
            </label>

            <label>
              <span className={labelClass}>
                Ordre d&apos;affichage
              </span>

              <input
                name="sortOrder"
                type="number"
                defaultValue="0"
                className={inputClass}
              />
            </label>
          </div>

          <label className="mt-6 block">
            <span className={labelClass}>
              Description de la carte *
            </span>

            <textarea
              name="description"
              required
              rows={4}
              placeholder="Description courte affichée directement sur la carte..."
              className={`${inputClass} resize-y`}
            />
          </label>
        </section>

        <div className="my-8 border-t border-[#113b5e]/10" />

        {/* Detail page */}
        <section>
          <h2 className="text-xl font-black text-[#032f55]">
            Page détaillée
          </h2>

          <p className="mt-1 text-sm text-[#677789]">
            Contenu affiché sur /tarifs/[slug].
          </p>

          <label className="mt-6 block">
            <span className={labelClass}>
              Description complète
            </span>

            <textarea
              name="additionalDescription"
              rows={7}
              placeholder="Expliquez le fonctionnement de la formule, ses avantages, les conditions, etc."
              className={`${inputClass} resize-y`}
            />
          </label>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <label>
              <span className={labelClass}>
                Image principale
              </span>

              <input
                name="mainImageUrl"
                type="url"
                placeholder="https://..."
                className={inputClass}
              />
            </label>

            <label>
              <span className={labelClass}>
                Contrat
              </span>

              <input
                name="contractUrl"
                placeholder="/contracts/contrat.pdf"
                className={inputClass}
              />
            </label>
          </div>

          <label className="mt-6 block">
            <span className={labelClass}>
              Galerie
            </span>

            <textarea
              name="galleryUrls"
              rows={5}
              placeholder={`https://site.com/image-1.jpg
https://site.com/image-2.jpg
https://site.com/image-3.jpg`}
              className={`${inputClass} resize-y font-mono text-sm`}
            />

            <p className="mt-2 text-xs text-[#677789]">
              Une URL par ligne.
            </p>
          </label>
        </section>

        <div className="my-8 border-t border-[#113b5e]/10" />

        {/* Options */}
        <section>
          <h2 className="text-xl font-black text-[#032f55]">
            Affichage
          </h2>

          <div className="mt-5 space-y-4">
            <label className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-[#113b5e]/10 bg-[#f8fbfe] p-4">
              <input
                type="checkbox"
                name="active"
                defaultChecked
                className="h-5 w-5 accent-[#0868ad]"
              />

              <div>
                <div className="font-bold text-[#032f55]">
                  Formule active
                </div>

                <p className="mt-1 text-xs text-[#677789]">
                  Afficher cette formule sur le site.
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-[#113b5e]/10 bg-[#f8fbfe] p-4">
              <input
                type="checkbox"
                name="featured"
                className="h-5 w-5 accent-[#0868ad]"
              />

              <div>
                <div className="font-bold text-[#032f55]">
                  Mettre en vedette
                </div>

                <p className="mt-1 text-xs text-[#677789]">
                  Utiliser le style de carte principale.
                </p>
              </div>
            </label>
          </div>
        </section>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#113b5e]/10 pt-6 sm:flex-row sm:justify-end">
          <Link
            href="/admin/pricing"
            className="flex items-center justify-center rounded-[14px] border border-[#113b5e]/15 px-5 py-3 text-sm font-black !text-[#032f55]"
          >
            Annuler
          </Link>

          <button
            type="submit"
            className="rounded-[14px] bg-[#0868ad] px-6 py-3 text-sm font-black !text-white transition hover:bg-[#075a95]"
          >
            Créer la formule
          </button>
        </div>
      </form>
    </div>
  );
}