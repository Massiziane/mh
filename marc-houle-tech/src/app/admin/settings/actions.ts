"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export async function saveSiteSettings(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();

  const businessName = String(
    formData.get("businessName") ?? ""
  ).trim();

  const phone = String(
    formData.get("phone") ?? ""
  ).trim();

  const email = String(
    formData.get("email") ?? ""
  ).trim();

  if (!businessName) {
    throw new Error(
      "Le nom de l'entreprise est obligatoire."
    );
  }

  if (id) {
    await prisma.siteSettings.update({
      where: {
        id,
      },
      data: {
        businessName,
        phone: phone || null,
        email: email || null,
      },
    });
  } else {
    await prisma.siteSettings.create({
      data: {
        businessName,
        phone: phone || null,
        email: email || null,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");

  redirect("/admin/settings");
}