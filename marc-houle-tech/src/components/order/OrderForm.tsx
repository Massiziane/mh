"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

export default function OrderForm() {
  const [submitted, setSubmitted] = useState(false);

  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const [contractName, setContractName] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitted(true);
  }

  function handlePhotosChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files ?? []);

    setPhotoNames(files.map((file) => file.name));
  }

  function handleContractChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    setContractName(file?.name ?? "");
  }

  if (submitted) {
    return (
      <div className="w-full rounded-[22px] border border-[#113b5e]/10 bg-white p-8 text-center shadow-[0_10px_30px_rgba(0,38,70,0.08)]">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e9f8ef] text-2xl font-black text-[#169454]">
          ✓
        </div>

        <h3 className="mt-5 text-2xl font-bold text-[#032f55]">
          Demande prête
        </h3>

        <p className="mx-auto mt-3 max-w-[420px] text-sm leading-6 text-[#677789]">
          Votre demande et votre contrat signé sont prêts à être
          transmis.
        </p>

        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 inline-flex min-h-[50px] items-center justify-center rounded-full border border-[#032f55]/15 bg-white px-6 font-bold text-[#032f55] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          Retour au formulaire
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-[14px] border border-[#113b5e]/15 bg-[#f8fbfe] px-4 py-3.5 text-[16px] text-[#182433] outline-none transition placeholder:text-[#677789]/55 focus:border-[#0868ad] focus:bg-white focus:ring-4 focus:ring-[#0868ad]/10";

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-[22px] border border-[#113b5e]/10 bg-white p-5 text-left shadow-[0_10px_30px_rgba(0,38,70,0.08)] sm:p-7"
    >
      <div className="space-y-6">

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-bold text-[#032f55]"
          >
            Nom complet
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Votre nom complet"
            className={inputClass}
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-bold text-[#032f55]"
          >
            Numéro de téléphone
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="514-000-0000"
            className={inputClass}
          />
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="mb-2 block text-sm font-bold text-[#032f55]"
          >
            Adresse
          </label>

          <input
            id="address"
            name="address"
            type="text"
            required
            placeholder="Votre adresse"
            className={inputClass}
          />
        </div>

        {/* Availability */}
        <div>
          <label
            htmlFor="availability"
            className="mb-2 block text-sm font-bold text-[#032f55]"
          >
            Disponibilités
          </label>

          <textarea
            id="availability"
            name="availability"
            required
            rows={3}
            placeholder="Ex. Lundi après 14 h, mercredi matin..."
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-bold text-[#032f55]"
          >
            Décrivez votre besoin
          </label>

          <textarea
            id="description"
            name="description"
            required
            rows={5}
            placeholder="Expliquez le problème, l'appareil concerné ou le service dont vous avez besoin..."
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* Service photos */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label
              htmlFor="photos"
              className="text-sm font-bold text-[#032f55]"
            >
              Photos du problème
            </label>

            <span className="text-xs font-medium text-[#677789]">
              Facultatif
            </span>
          </div>

          <label
            htmlFor="photos"
            className="flex min-h-[145px] cursor-pointer flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-[#0868ad]/20 bg-[#f8fbfe] px-5 text-center transition hover:border-[#0868ad]/50 hover:bg-[#eaf5ff]"
          >
            <div className="grid h-12 w-12 place-items-center rounded-[14px] bg-[#eaf5ff] text-2xl">
              📷
            </div>

            <strong className="mt-3 text-sm text-[#032f55]">
              Ajouter des photos
            </strong>

            <span className="mt-1 text-xs leading-5 text-[#677789]">
              Vous pouvez sélectionner plusieurs images
            </span>
          </label>

          <input
            id="photos"
            name="photos"
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotosChange}
            className="hidden"
          />

          {photoNames.length > 0 && (
            <div className="mt-3 rounded-[12px] border border-[#113b5e]/10 bg-[#f8fbfe] px-4 py-3">
              <p className="mb-2 text-xs font-bold text-[#032f55]">
                Photos sélectionnées
              </p>

              <ul className="space-y-1">
                {photoNames.map((name) => (
                  <li
                    key={name}
                    className="truncate text-xs text-[#677789]"
                  >
                    ✓ {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Signed contract */}
        <div className="rounded-[18px] border border-[#d4af37]/30 bg-[#fffdf7] p-5">
          <div className="mb-4">
            <span className="inline-flex rounded-full bg-[#f4dc88]/35 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#705b13]">
              Requis
            </span>

            <h3 className="mt-3 text-lg font-bold text-[#032f55]">
              Contrat signé
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#677789]">
              Téléchargez le contrat ci-dessous, signez-le, puis
              téléversez votre copie signée avant d&apos;envoyer votre
              demande.
            </p>
          </div>

          <label
            htmlFor="signedContract"
            className="flex min-h-[145px] cursor-pointer flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-[#d4af37]/40 bg-white px-5 text-center transition hover:border-[#d4af37] hover:bg-[#fffaf0]"
          >
            <div className="grid h-12 w-12 place-items-center rounded-[14px] bg-[#f4dc88]/30 text-2xl">
              📄
            </div>

            <strong className="mt-3 text-sm text-[#032f55]">
              Téléverser le contrat signé
            </strong>

            <span className="mt-1 text-xs leading-5 text-[#677789]">
              PDF, JPG, JPEG ou PNG
            </span>
          </label>

          <input
            id="signedContract"
            name="signedContract"
            type="file"
            accept=".pdf,image/jpeg,image/png"
            required
            onChange={handleContractChange}
            className="hidden"
          />

          {contractName && (
            <div className="mt-3 flex items-center gap-3 rounded-[12px] border border-[#169454]/20 bg-[#e9f8ef] px-4 py-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white font-black text-[#169454]">
                ✓
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold text-[#169454]">
                  Contrat ajouté
                </p>

                <p className="truncate text-xs text-[#435365]">
                  {contractName}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-2 flex min-h-[54px] w-full items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#efca55] px-6 text-base font-black text-[#10283d] shadow-[0_15px_35px_rgba(212,175,55,0.3)] transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(212,175,55,0.42)] active:translate-y-0"
        >
          Envoyer ma demande
        </button>

      </div>
    </form>
  );
}