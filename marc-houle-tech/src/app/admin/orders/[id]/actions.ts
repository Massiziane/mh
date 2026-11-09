
"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { fromZonedTime } from "date-fns-tz";

import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/admin-auth";

const TIME_ZONE = "America/Toronto";

const allowedStatuses: OrderStatus[] = [
  "NEW",
  "OPEN",
  "PLANNED",
  "COMPLETED",
  "CANCELLED",
];

export type ActionResult = {
  success: boolean;
  message: string;
};


function refreshOrder(id: string) {
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

function formatAppointment(date: Date) {
  return new Intl.DateTimeFormat("fr-CA", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: TIME_ZONE,
  }).format(date);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<ActionResult> {
  await requireAdmin();

  if (!allowedStatuses.includes(status)) {
    return {
      success: false,
      message: "Statut invalide.",
    };
  }

  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    return {
      success: false,
      message: "Demande introuvable.",
    };
  }

  if (status === "PLANNED" && !order.scheduledAt) {
    return {
      success: false,
      message: "Planifiez d'abord une intervention.",
    };
  }

  await prisma.order.update({
    where: { id },
    data: { status },
  });

  refreshOrder(id);

  return {
    success: true,
    message: "Statut mis à jour.",
  };
}

export async function saveAppointment(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const address = String(
    formData.get("address") ?? ""
  ).trim();
  const notes = String(
    formData.get("notes") ?? ""
  ).trim();

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) ||
    !address ||
    address.length > 300 ||
    notes.length > 2000
  ) {
    return {
      success: false,
      message: "Vérifiez les informations du rendez-vous.",
    };
  }

  const scheduledAt = fromZonedTime(
    `${date}T${time}:00`,
    TIME_ZONE
  );

  if (Number.isNaN(scheduledAt.getTime())) {
    return {
      success: false,
      message: "Date ou heure invalide.",
    };
  }

  // Check the converted time against Montréal local time,
  // including nonexistent DST transition times.
  const localParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(scheduledAt);

  const part = (type: string) =>
    localParts.find((p) => p.type === type)?.value ?? "";

  const roundTrip =
    `${part("year")}-${part("month")}-${part("day")}` +
    `T${part("hour")}:${part("minute")}`;

  if (roundTrip !== `${date}T${time}`) {
    return {
      success: false,
      message: "Cette heure locale n'est pas valide.",
    };
  }

  if (scheduledAt.getTime() <= Date.now()) {
    return {
      success: false,
      message: "Choisissez une date future.",
    };
  }

  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    return {
      success: false,
      message: "Demande introuvable.",
    };
  }

  if (
    order.status === "COMPLETED" ||
    order.status === "CANCELLED"
  ) {
    return {
      success: false,
      message: "Réouvrez cette demande avant de la planifier.",
    };
  }

  await prisma.order.update({
    where: { id },
    data: {
      scheduledAt,
      appointmentAddress: address,
      appointmentNotes: notes || null,
      status: "PLANNED",
      confirmationSentAt: null,
    },
  });

  refreshOrder(id);

  return {
    success: true,
    message:
      "Intervention enregistrée. Vous pouvez maintenant envoyer la confirmation.",
  };
}

export async function sendAppointmentConfirmation(
  id: string
): Promise<ActionResult> {
  await requireAdmin();

  const order = await prisma.order.findUnique({
    where: { id },
    include: { pricingPlan: true },
  });

  if (!order) {
    return {
      success: false,
      message: "Demande introuvable.",
    };
  }

  if (!order.email) {
    return {
      success: false,
      message: "Ajoutez l'adresse courriel du client avant l'envoi.",
    };
  }

  if (
    order.status !== "PLANNED" ||
    !order.scheduledAt ||
    !order.appointmentAddress
  ) {
    return {
      success: false,
      message: "Aucune intervention planifiée à confirmer.",
    };
  }

  if (order.confirmationSentAt) {
    return {
      success: false,
      message: "Une confirmation a déjà été envoyée pour cette planification.",
    };
  }

  if (
    !process.env.RESEND_API_KEY ||
    !process.env.EMAIL_FROM
  ) {
    return {
      success: false,
      message: "Configuration courriel manquante.",
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const appointmentDate = formatAppointment(
    order.scheduledAt
  );

  const service =
    order.pricingPlan?.title ?? "Intervention technique";

  const text = [
    `Bonjour ${order.name},`,
    "",
    "Votre intervention a été planifiée.",
    "",
    `Service : ${service}`,
    `Date et heure : ${appointmentDate}`,
    `Adresse : ${order.appointmentAddress}`,
    "",
    ...(order.appointmentNotes
      ? [`Informations complémentaires : ${order.appointmentNotes}`, ""]
      : []),
    "Pour toute modification, veuillez contacter notre équipe.",
    "",
    "Merci de votre confiance.",
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [order.email],
      subject: `Confirmation de rendez-vous - ${service}`,
      text,
    });

    if (error) {
      console.error("Resend confirmation error:", error);

      return {
        success: false,
        message: "Le courriel n'a pas pu être envoyé.",
      };
    }

    await prisma.order.update({
      where: { id },
      data: {
        confirmationSentAt: new Date(),
      },
    });

    refreshOrder(id);

    return {
      success: true,
      message: "Confirmation acceptée par le service de courriel.",
    };
  } catch (error) {
    console.error("Confirmation error:", error);

    return {
      success: false,
      message: "Une erreur est survenue pendant l'envoi.",
    };
  }
}
