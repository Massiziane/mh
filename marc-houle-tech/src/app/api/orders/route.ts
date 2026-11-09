
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const MAX_TOTAL_SIZE = 3 * 1024 * 1024;
const MAX_PHOTOS = 2;

const allowedImages = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const allowedContracts = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

function getText(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string"
    ? value.trim()
    : "";
}

function validFile(
  file: File,
  allowedTypes: string[]
) {
  return (
    file.size > 0 &&
    file.size <= MAX_FILE_SIZE &&
    allowedTypes.includes(file.type)
  );
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!apiKey || !emailFrom || !adminEmail) {
      console.error("Missing email configuration");

      return NextResponse.json(
        { error: "Service temporairement indisponible." },
        { status: 503 }
      );
    }

    const form = await request.formData();

    const name = getText(form, "name");
    const phone = getText(form, "phone");
    const address = getText(form, "address");
    const availability = getText(form, "availability");
    const description = getText(form, "description");
    const pricingPlanId = getText(form, "pricingPlanId");

    if (
      !name ||
      !phone ||
      !address ||
      !availability ||
      !description ||
      !pricingPlanId
    ) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs." },
        { status: 400 }
      );
    }

    if (
      name.length > 150 ||
      phone.length > 40 ||
      address.length > 300 ||
      availability.length > 2000 ||
      description.length > 5000
    ) {
      return NextResponse.json(
        { error: "Certains champs sont trop longs." },
        { status: 400 }
      );
    }

    const plan = await prisma.pricingPlan.findUnique({
      where: { id: pricingPlanId },
    });

    if (!plan || !plan.active) {
      return NextResponse.json(
        { error: "Formule de service invalide." },
        { status: 400 }
      );
    }

    const photos = form
      .getAll("photos")
      .filter(
        (value): value is File =>
          value instanceof File && value.size > 0
      );

    const contractValue = form.get("signedContract");

    const contract =
      contractValue instanceof File &&
      contractValue.size > 0
        ? contractValue
        : null;

    const contractRequired =
      plan.slug !== "service-regulier";

    if (contractRequired && !contract) {
      return NextResponse.json(
        { error: "Le contrat signé est requis." },
        { status: 400 }
      );
    }

    if (
      photos.length > MAX_PHOTOS ||
      photos.some(
        (file) => !validFile(file, allowedImages)
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Maximum 2 photos, de 1 Mo chacune (JPG, PNG ou WebP).",
        },
        { status: 400 }
      );
    }

    if (
      contract &&
      !validFile(contract, allowedContracts)
    ) {
      return NextResponse.json(
        {
          error:
            "Le contrat doit être un PDF, JPG ou PNG de 1 Mo maximum.",
        },
        { status: 400 }
      );
    }

    const totalSize =
      photos.reduce((sum, file) => sum + file.size, 0) +
      (contract?.size ?? 0);

    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json(
        { error: "Les fichiers sont trop volumineux." },
        { status: 400 }
      );
    }

    const attachments = await Promise.all(
      [...photos, ...(contract ? [contract] : [])].map(
        async (file, index) => ({
          filename: `${
            index < photos.length ? "photo" : "contrat"
          }-${index + 1}.${
            file.type === "application/pdf"
              ? "pdf"
              : file.type === "image/png"
                ? "png"
                : file.type === "image/webp"
                  ? "webp"
                  : "jpg"
          }`,
          content: Buffer.from(
            await file.arrayBuffer()
          ).toString("base64"),
        })
      )
    );

    // Save customer request in PostgreSQL.
    // Files are sent by email, not stored in Prisma.
    const order = await prisma.order.create({
      data: {
        name,
        phone,
        address,
        availability,
        description,
        pricingPlanId: plan.id,
        status: "NEW",
      },
    });

    const resend = new Resend(apiKey);

    const emailText = [
      "Nouvelle demande de service",
      "",
      `Numéro : ${order.id}`,
      `Formule : ${plan.title}`,
      `Client : ${name}`,
      `Téléphone : ${phone}`,
      `Adresse : ${address}`,
      `Disponibilités : ${availability}`,
      "",
      "Description :",
      description,
      "",
      `Photos : ${photos.length}`,
      `Contrat signé : ${contract ? "Oui" : "Non"}`,
      "",
      "Consultez le tableau de bord administrateur.",
    ].join("\n");

    let emailSent = false;

    try {
      const { error } = await resend.emails.send({
        from: emailFrom,
        to: [adminEmail],
        subject: `Nouvelle demande - ${plan.title}`,
        text: emailText,
        attachments,
      });

      if (error) {
        console.error("Email delivery failed:", error);
      } else {
        emailSent = true;
      }
    } catch (emailError) {
      console.error("Email delivery error:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        emailSent,
        message: emailSent
          ? "Demande enregistrée et notification envoyée."
          : "Demande enregistrée. Notification par courriel indisponible.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order API error:", error);

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de l'enregistrement.",
      },
      { status: 500 }
    );
  }
}
