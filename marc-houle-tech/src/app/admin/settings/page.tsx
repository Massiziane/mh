import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div>
        <span className="inline-flex rounded-full bg-[#eaf5ff] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#0868ad]">
          Paramètres
        </span>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-[#032f55]">
          Paramètres du site
        </h1>

        <p className="mt-2 text-sm text-[#677789]">
          Informations générales affichées sur votre site.
        </p>
      </div>

      <div className="mt-8 rounded-[22px] border border-[#113b5e]/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,38,70,0.06)] sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <SettingItem
            label="Nom de l'entreprise"
            value={settings?.businessName ?? "Non configuré"}
          />

          <SettingItem
            label="Téléphone"
            value={settings?.phone ?? "Non configuré"}
          />

          <SettingItem
            label="Courriel"
            value={settings?.email ?? "Non configuré"}
          />
        </div>

        <Link
          href="/admin/settings/edit"
          className="mt-8 inline-flex rounded-[14px] bg-[#0868ad] px-5 py-3 text-sm font-black !text-white hover:bg-[#075a95]"
        >
          Modifier les paramètres
        </Link>
      </div>
    </div>
  );
}

function SettingItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[16px] border border-[#113b5e]/10 bg-[#f8fbfe] p-4">
      <div className="text-xs font-black uppercase tracking-wide text-[#677789]">
        {label}
      </div>

      <div className="mt-2 font-bold text-[#032f55]">
        {value}
      </div>
    </div>
  );
}