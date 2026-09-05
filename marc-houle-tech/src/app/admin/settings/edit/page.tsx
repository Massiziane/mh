import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { saveSiteSettings } from "../actions";

export default async function EditSettingsPage() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <div className="mx-auto w-full max-w-[800px]">
      <div>
        <span className="inline-flex rounded-full bg-[#eaf5ff] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#0868ad]">
          Paramètres
        </span>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-[#032f55]">
          Modifier les paramètres
        </h1>

        <p className="mt-2 text-sm text-[#677789]">
          Modifiez les informations générales affichées sur le site.
        </p>
      </div>

      <form
        action={saveSiteSettings}
        className="mt-8 rounded-[22px] border border-[#113b5e]/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,38,70,0.06)] sm:p-8"
      >
        {settings && (
          <input
            type="hidden"
            name="id"
            value={settings.id}
          />
        )}

        <div>
          <label
            htmlFor="businessName"
            className="mb-2 block text-sm font-black text-[#032f55]"
          >
            Nom de l&apos;entreprise
          </label>

          <input
            id="businessName"
            name="businessName"
            type="text"
            required
            defaultValue={settings?.businessName ?? ""}
            className="w-full rounded-[14px] border border-[#113b5e]/15 bg-white px-4 py-3 text-[#032f55] outline-none"
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-black text-[#032f55]"
          >
            Téléphone
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={settings?.phone ?? ""}
            placeholder="514-000-0000"
            className="w-full rounded-[14px] border border-[#113b5e]/15 bg-white px-4 py-3 text-[#032f55] outline-none"
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-black text-[#032f55]"
          >
            Courriel
          </label>

          <input
            id="email"
            name="email"
            type="email"
            defaultValue={settings?.email ?? ""}
            placeholder="contact@exemple.com"
            className="w-full rounded-[14px] border border-[#113b5e]/15 bg-white px-4 py-3 text-[#032f55] outline-none"
          />
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Link
            href="/admin/settings"
            className="rounded-[14px] border border-[#113b5e]/10 bg-white px-5 py-3 text-sm font-black text-[#032f55]"
          >
            Annuler
          </Link>

          <button
            type="submit"
            className="rounded-[14px] bg-[#0868ad] px-5 py-3 text-sm font-black !text-white transition hover:bg-[#075a95]"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}