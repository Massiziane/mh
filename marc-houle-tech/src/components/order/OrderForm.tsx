
"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

type OrderFormProps = {
  pricingPlanId: string;
  contractRequired?: boolean;
  contractUrl?: string | null;
};

export default function OrderForm({
  pricingPlanId,
  contractRequired = true,
  contractUrl,
}: OrderFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const [contractName, setContractName] = useState("");
  const [fileError, setFileError] = useState("");
  const downloadableContract =
    contractUrl?.startsWith("/contracts/") &&
    contractUrl.toLowerCase().endsWith(".pdf")
      ? contractUrl
      : null;

  const inputClass =
    "w-full rounded-[14px] border border-[#113b5e]/15 bg-[#f8fbfe] px-4 py-3.5 text-[16px] text-[#182433] outline-none transition placeholder:text-[#677789]/55 focus:border-[#0868ad] focus:bg-white focus:ring-4 focus:ring-[#0868ad]/10";

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    if (fileError) {
      setError(fileError);
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData(event.currentTarget);

      formData.set("pricingPlanId", pricingPlanId);

      const response = await fetch("/api/orders", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let message =
          "Impossible d'envoyer votre demande. Veuillez réessayer.";

        try {
          const data = await response.json();
          message = data.error || data.message || message;
        } catch {
          // Keep default error message
        }

        throw new Error(message);
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Order submission error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Une erreur inattendue est survenue."
      );
    } finally {
      setLoading(false);
    }
  }

  function handlePhotosChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files ?? []);

    setPhotoNames(files.map((file) => file.name));
    const invalid = files.length > 2 || files.some(
      (file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 1024 * 1024
    );
    setFileError(invalid ? "Maximum 2 photos JPG, PNG ou WEBP de 1 Mo chacune." : "");
  }

  function handleContractChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    setContractName(file?.name ?? "");
    if (file && (
      !["application/pdf", "image/jpeg", "image/png"].includes(file.type) ||
      file.size > 1024 * 1024
    )) {
      setFileError("Le contrat doit être un PDF, JPG ou PNG de 1 Mo maximum.");
    } else {
      setFileError("");
    }
  }

  if (submitted) {
    return (
      <div className="w-full rounded-[22px] border border-[#113b5e]/10 bg-white p-8 text-center shadow-[0_10px_30px_rgba(0,38,70,0.08)]">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e9f8ef] text-2xl font-black text-[#169454]">
          ✓
        </div>

        <h3 className="mt-5 text-2xl font-bold text-[#032f55]">
          Demande envoyée !
        </h3>

        <p className="mx-auto mt-3 max-w-[420px] text-sm leading-6 text-[#677789]">
          Votre demande a été transmise avec succès.
          Notre équipe prendra connaissance de votre
          demande et vous contactera prochainement.
        </p>

        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setPhotoNames([]);
            setContractName("");
            setError("");
            setFileError("");
          }}
          className="mt-6 inline-flex min-h-[50px] items-center justify-center rounded-full border border-[#032f55]/15 bg-white px-6 font-bold text-[#032f55] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          Faire une autre demande
        </button>
      </div>
    );
  }

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
            disabled={loading}
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
            disabled={loading}
            placeholder="514-000-0000"
            className={inputClass}
          />
        </div>
        
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-bold text-[#032f55]"
          >
            Adresse courriel
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            placeholder="exemple@gmail.com"
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
            rows={5}
            placeholder="Expliquez le problème, l'appareil concerné ou le service dont vous avez besoin..."
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* Service Photos */}
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
              Maximum 2 photos (JPG, PNG, WEBP), 1 Mo chacune
            </span>
          </label>

          <input
            id="photos"
            name="photos"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            multiple
            disabled={loading}
            onChange={handlePhotosChange}
            className="hidden"
          />

          {photoNames.length > 0 && (
            <div className="mt-3 rounded-[12px] border border-[#113b5e]/10 bg-[#f8fbfe] px-4 py-3">
              <p className="mb-2 text-xs font-bold text-[#032f55]">
                Photos sélectionnées
              </p>

              <ul className="space-y-1">
                {photoNames.map((name, index) => (
                  <li
                    key={`${name}-${index}`}
                    className="truncate text-xs text-[#677789]"
                  >
                    ✓ {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Signed Contract */}
        <div className="rounded-[18px] border border-[#d4af37]/30 bg-[#fffdf7] p-5">
          <div className="mb-4">
            <span className="inline-flex rounded-full bg-[#f4dc88]/35 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#705b13]">
              {contractRequired ? "Requis" : "Facultatif"}
            </span>

            <h3 className="mt-3 text-lg font-bold text-[#032f55]">
              Contrat signé
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#677789]">
              Téléchargez le document PDF correspondant à votre formule, complétez-le et signez-le,
              puis téléversez votre copie signée
              {contractRequired ? " avant d'envoyer votre demande." : " si vous en disposez."}
            </p>
          </div>

          <div className="mb-5 rounded-[16px] border border-[#d4af37]/30 bg-white p-4 sm:p-5">
            <p className="text-sm font-bold text-[#032f55]">1. Télécharger le contrat</p>
            <p className="mt-1 text-xs leading-5 text-[#677789]">
              Ouvrez le PDF, remplissez les champs et ajoutez votre signature.
            </p>
            {downloadableContract ? (
              <a
                href={downloadableContract}
                download
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0868ad] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#032f55] sm:w-auto"
              >
                <span aria-hidden="true">↓</span> Télécharger le contrat (PDF)
              </a>
            ) : (
              <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                Le contrat PDF n'est pas encore disponible au téléchargement.
              </p>
            )}
          </div>

          <p className="mb-3 text-sm font-bold text-[#032f55]">2. Téléverser le contrat signé</p>

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
              PDF, JPG, JPEG ou PNG — 1 Mo maximum
            </span>
          </label>

          <input
            id="signedContract"
            name="signedContract"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            required={contractRequired}
            disabled={loading}
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

        {/* Error */}
        {(error || fileError) && (
          <div
            role="alert"
            className="rounded-[14px] border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700"
          >
            {error || fileError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex min-h-[54px] w-full items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#efca55] px-6 text-base font-black text-[#10283d] shadow-[0_15px_35px_rgba(212,175,55,0.3)] transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(212,175,55,0.42)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Envoi de votre demande..."
            : "Envoyer ma demande"}
        </button>

      </div>
    </form>
  );
}
