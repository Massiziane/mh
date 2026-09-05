"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createPricingPlan(formData: FormData) {
  const title = getString(formData, "title");
  const age = getString(formData, "age");
  const priceInput = getString(formData, "price");
  const description = getString(formData, "description");

  const additionalDescription = getString(
    formData,
    "additionalDescription"
  );

  const customSlug = getString(formData, "slug");
  const mainImageUrl = getString(formData, "mainImageUrl");
  const contractUrl = getString(formData, "contractUrl");
  const badge = getString(formData, "badge");
  const galleryInput = getString(formData, "galleryUrls");

  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";

  const sortOrderInput = getString(formData, "sortOrder");
  const sortOrder = sortOrderInput
    ? Number.parseInt(sortOrderInput, 10)
    : 0;

  if (!title || !age || !priceInput || !description) {
    throw new Error(
      "Titre, âge, prix et description sont obligatoires."
    );
  }

  const normalizedPrice = priceInput.replace(",", ".");
  const numericPrice = Number(normalizedPrice);

  if (
    Number.isNaN(numericPrice) ||
    !Number.isFinite(numericPrice) ||
    numericPrice < 0
  ) {
    throw new Error("Le prix est invalide.");
  }

  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    throw new Error("L'ordre d'affichage est invalide.");
  }

  const slug = createSlug(customSlug || title);

  if (!slug) {
    throw new Error("Le slug est invalide.");
  }

  const existing = await prisma.pricingPlan.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    throw new Error(
      "Une formule avec ce slug existe déjà."
    );
  }

  const galleryUrls = galleryInput
    ? galleryInput
        .split(/\r?\n/)
        .map((url) => url.trim())
        .filter(Boolean)
    : [];

  await prisma.pricingPlan.create({
    data: {
      title,
      age,
      price: normalizedPrice,
      slug,
      description,

      additionalDescription:
        additionalDescription || null,

      mainImageUrl:
        mainImageUrl || null,

      contractUrl:
        contractUrl || null,

      badge:
        badge || null,

      galleryUrls,

      featured,
      active,
      sortOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/pricing");
  revalidatePath(`/tarifs/${slug}`);

  redirect("/admin/pricing");
}

export async function updatePricingPlan(formData: FormData) {
  const id = String(formData.get("id") || "").trim();

  const title = String(formData.get("title") || "").trim();
  const age = String(formData.get("age") || "").trim();
  const price = String(formData.get("price") || "").trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  const additionalDescription = String(
    formData.get("additionalDescription") || ""
  ).trim();

  const customSlug = String(
    formData.get("slug") || ""
  ).trim();

  const mainImageUrl = String(
    formData.get("mainImageUrl") || ""
  ).trim();

  const contractUrl = String(
    formData.get("contractUrl") || ""
  ).trim();

  const badge = String(
    formData.get("badge") || ""
  ).trim();

  const galleryInput = String(
    formData.get("galleryUrls") || ""
  ).trim();

  const featured =
    formData.get("featured") === "on";

  const active =
    formData.get("active") === "on";

  const sortOrder =
    Number(formData.get("sortOrder")) || 0;

  if (!id) {
    throw new Error("ID manquant.");
  }

  if (!title || !age || !price || !description) {
    throw new Error(
      "Titre, âge, prix et description sont obligatoires."
    );
  }

  const numericPrice = Number(
    price.replace(",", ".")
  );

  if (
    Number.isNaN(numericPrice) ||
    numericPrice < 0
  ) {
    throw new Error("Le prix est invalide.");
  }

  const slug = createSlug(
    customSlug || title
  );

  if (!slug) {
    throw new Error("Le slug est invalide.");
  }

  const currentPlan =
    await prisma.pricingPlan.findUnique({
      where: {
        id,
      },
    });

  if (!currentPlan) {
    throw new Error(
      "Cette formule n'existe pas."
    );
  }

  const slugOwner =
    await prisma.pricingPlan.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

  if (
    slugOwner &&
    slugOwner.id !== id
  ) {
    throw new Error(
      "Une autre formule utilise déjà ce slug."
    );
  }

  const galleryUrls = galleryInput
    ? galleryInput
        .split(/\r?\n/)
        .map((url) => url.trim())
        .filter(Boolean)
    : [];

  await prisma.pricingPlan.update({
    where: {
      id,
    },

    data: {
      title,
      age,
      price: price.replace(",", "."),
      slug,
      description,

      additionalDescription:
        additionalDescription || null,

      mainImageUrl:
        mainImageUrl || null,

      contractUrl:
        contractUrl || null,

      badge:
        badge || null,

      galleryUrls,

      featured,
      active,
      sortOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/pricing");

  revalidatePath(
    `/tarifs/${currentPlan.slug}`
  );

  revalidatePath(
    `/tarifs/${slug}`
  );

  redirect("/admin/pricing");
}

export async function deletePricingPlan(formData: FormData) {
  const id = String(formData.get("id") || "").trim();

  if (!id) {
    throw new Error("ID manquant.");
  }

  const plan = await prisma.pricingPlan.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      slug: true,
      title: true,
    },
  });

  if (!plan) {
    throw new Error("Cette formule n'existe pas.");
  }

  await prisma.pricingPlan.delete({
    where: {
      id,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/pricing");
  revalidatePath(`/tarifs/${plan.slug}`);

  redirect("/admin/pricing");
}