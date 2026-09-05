import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { updatePricingPlan } from "../actions";

import DeletePricingButton from "@/components/admin/DeletePricingButton";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPricingPage({
  params,
}: Props) {
  const { id } = await params;

  const plan = await prisma.pricingPlan.findUnique({
    where: {
      id,
    },
  });

  if (!plan) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[900px]">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#0868ad]">
            Tarifs
          </p>

          <h1 className="mt-2 text-3xl font-black text-[#032f55]">
            Modifier la formule
          </h1>

          <p className="mt-2 text-sm text-[#677789]">
            Modifiez les informations de cette formule.
          </p>
        </div>

        <Link
          href="/admin/pricing"
          className="rounded-[14px] border border-[#113b5e]/10 bg-white px-4 py-3 text-sm font-bold text-[#032f55]"
        >
          ← Retour
        </Link>
      </div>

      <form
        action={updatePricingPlan}
        className="rounded-[24px] border border-[#113b5e]/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,38,70,0.06)] sm:p-8"
      >
        <input
          type="hidden"
          name="id"
          value={plan.id}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-bold text-[#032f55]"
            >
              Titre
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={plan.title}
              className="w-full rounded-[14px] border border-[#113b5e]/15 bg-white px-4 py-3 text-[#032f55] outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="age"
              className="mb-2 block text-sm font-bold text-[#032f55]"
            >
              Âge / libellé
            </label>

            <input
              id="age"
              name="age"
              type="text"
              required
              defaultValue={plan.age}
              className="w-full rounded-[14px] border border-[#113b5e]/15 bg-white px-4 py-3 text-[#032f55] outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-bold text-[#032f55]"
            >
              Prix
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={Number(plan.price)}
              className="w-full rounded-[14px] border border-[#113b5e]/15 bg-white px-4 py-3 text-[#032f55] outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="mb-2 block text-sm font-bold text-[#032f55]"
            >
              Slug
            </label>

            <input
              id="slug"
              name="slug"
              type="text"
              required
              defaultValue={plan.slug}
              className="w-full rounded-[14px] border border-[#113b5e]/15 bg-white px-4 py-3 text-[#032f55] outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="badge"
              className="mb-2 block text-sm font-bold text-[#032f55]"
            >
              Badge
            </label>

            <input
              id="badge"
              name="badge"
              type="text"
              defaultValue={plan.badge ?? ""}
              className="w-full rounded-[14px] border border-[#113b5e]/15 bg-white px-4 py-3 text-[#032f55] outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="sortOrder"
              className="mb-2 block text-sm font-bold text-[#032f55]"
            >
              Ordre d&apos;affichage
            </label>

            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min="0"
              defaultValue={plan.sortOrder}
              className="w-full rounded-[14px] border border-[#113b5e]/15 bg-white px-4 py-3 text-[#032f55] outline-none"
            />
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-bold text-[#032f55]"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            required
            rows={4}
            defaultValue={plan.description}
            className="w-full rounded-[14px] border border-[#113b5e]/15 bg-white px-4 py-3 text-[#032f55] outline-none"
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="additionalDescription"
            className="mb-2 block text-sm font-bold text-[#032f55]"
          >
            Description supplémentaire
          </label>

          <textarea
            id="additionalDescription"
            name="additionalDescription"
            rows={6}
            defaultValue={
              plan.additionalDescription ?? ""
            }
            className="w-full rounded-[14px] border border-[#113b5e]/15 bg-white px-4 py-3 text-[#032f55] outline-none"
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="mainImageUrl"
              className="mb-2 block text-sm font-bold text-[#032f55]"
            >
              Image principale
            </label>

            <input
              id="mainImageUrl"
              name="mainImageUrl"
              type="text"
              defaultValue={plan.mainImageUrl ?? ""}
              className="w-full rounded-[14px] border border-[#113b5e]/15 bg-white px-4 py-3 text-[#032f55] outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="contractUrl"
              className="mb-2 block text-sm font-bold text-[#032f55]"
            >
              Contrat
            </label>

            <input
              id="contractUrl"
              name="contractUrl"
              type="text"
              defaultValue={plan.contractUrl ?? ""}
              className="w-full rounded-[14px] border border-[#113b5e]/15 bg-white px-4 py-3 text-[#032f55] outline-none"
            />
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor="galleryUrls"
            className="mb-2 block text-sm font-bold text-[#032f55]"
          >
            Galerie
          </label>

          <textarea
            id="galleryUrls"
            name="galleryUrls"
            rows={5}
            defaultValue={plan.galleryUrls.join("\n")}
            className="w-full rounded-[14px] border border-[#113b5e]/15 bg-white px-4 py-3 text-[#032f55] outline-none"
          />

          <p className="mt-2 text-xs text-[#677789]">
            Une URL par ligne.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-6">
          <label className="flex items-center gap-3 text-sm font-bold text-[#032f55]">
            <input
              name="active"
              type="checkbox"
              defaultChecked={plan.active}
              className="h-4 w-4"
            />
            Formule active
          </label>

          <label className="flex items-center gap-3 text-sm font-bold text-[#032f55]">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={plan.featured}
              className="h-4 w-4"
            />
            Mettre en vedette
          </label>
        </div>

        <div className="mt-10 flex justify-end gap-3">
          <Link
            href="/admin/pricing"
            className="rounded-[14px] border border-[#113b5e]/10 bg-white px-5 py-3 text-sm font-black text-[#032f55]"
          >
            Annuler
          </Link>

          <button
            type="submit"
            className="rounded-[14px] bg-[#032f55] px-6 py-3 text-sm font-black text-white"
          >
            Enregistrer
          </button>
        </div>
      </form>

      {/* Delete section */}
      <div className="mt-6 rounded-[24px] border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-black text-red-700">
          Zone dangereuse
        </h2>

        <p className="mt-2 max-w-[600px] text-sm leading-6 text-red-700/80">
          Supprimer cette formule la retirera de l&apos;administration
          et du site public. Cette action est irréversible.
        </p>

        <div className="mt-5">
          <DeletePricingButton
            id={plan.id}
            title={plan.title}
          />
        </div>
      </div>
    </div>
  );
}