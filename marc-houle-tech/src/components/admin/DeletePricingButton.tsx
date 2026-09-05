"use client";

import { useState } from "react";

import { deletePricingPlan } from "@/app/admin/pricing/actions";

type Props = {
  id: string;
  title: string;
};

export default function DeletePricingButton({
  id,
  title,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Delete button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-[14px] bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700"
      >
        Supprimer
      </button>

      {/* Confirmation modal */}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-[460px] rounded-[24px] bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">
              ⚠️
            </div>

            <h2 className="mt-5 text-2xl font-black text-[#032f55]">
              Supprimer cette formule?
            </h2>

            <p className="mt-3 leading-6 text-[#677789]">
              Vous êtes sur le point de supprimer{" "}
              <strong className="text-[#032f55]">
                {title}
              </strong>
              .
            </p>

            <p className="mt-3 text-sm font-bold text-red-600">
              Cette action est irréversible.
            </p>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-[14px] border border-[#113b5e]/10 bg-white px-5 py-3 text-sm font-black text-[#032f55] transition hover:bg-[#f4f7fb]"
              >
                Annuler
              </button>

              <form action={deletePricingPlan}>
                <input
                  type="hidden"
                  name="id"
                  value={id}
                />

                <button
                  type="submit"
                  className="rounded-[14px] bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700"
                >
                  Oui, supprimer
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}