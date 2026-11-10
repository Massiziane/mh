import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { uploadSignedContract, deleteSignedContract } from "@/lib/contract-storage";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const MAX_TOTAL_SIZE = 3 * 1024 * 1024;
const MAX_PHOTOS = 2;
const allowedImages = ["image/jpeg", "image/png", "image/webp"];
const allowedContracts = ["application/pdf", "image/jpeg", "image/png"];

function getText(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validFile(file: File, allowedTypes: string[]) {
  return file.size > 0 && file.size <= MAX_FILE_SIZE && allowedTypes.includes(file.type);
}

function validEmail(email: string) {
  return email.length > 0 && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM;
    const adminEmail = process.env.ADMIN_EMAIL;
    const form = await request.formData();

    const name = getText(form, "name");
    const email = getText(form, "email").toLowerCase();
    const phone = getText(form, "phone");
    const address = getText(form, "address");
    const availability = getText(form, "availability");
    const description = getText(form, "description");
    const pricingPlanId = getText(form, "pricingPlanId");

    if (!name || !email || !phone || !address || !availability || !description || !pricingPlanId) {
      return NextResponse.json({ error: "Veuillez remplir tous les champs obligatoires." }, { status: 400 });
    }
    if (!validEmail(email)) {
      return NextResponse.json({ error: "Veuillez entrer une adresse courriel valide." }, { status: 400 });
    }
    if (name.length > 150 || phone.length > 40 || address.length > 300 || availability.length > 2000 || description.length > 5000) {
      return NextResponse.json({ error: "Certains champs dépassent la longueur autorisée." }, { status: 400 });
    }

    const plan = await prisma.pricingPlan.findUnique({ where: { id: pricingPlanId } });
    if (!plan || !plan.active) {
      return NextResponse.json({ error: "Formule de service invalide." }, { status: 400 });
    }

    const photos = form.getAll("photos").filter((value): value is File => value instanceof File && value.size > 0);
    const contractValue = form.get("signedContract");
    const contract = contractValue instanceof File && contractValue.size > 0 ? contractValue : null;
    const contractRequired = plan.slug !== "service-regulier";

    if (contractRequired && !contract) {
      return NextResponse.json({ error: "Le contrat signé est requis." }, { status: 400 });
    }
    if (photos.length > MAX_PHOTOS || photos.some((file) => !validFile(file, allowedImages))) {
      return NextResponse.json({ error: "Maximum 2 photos de 1 Mo chacune (JPG, PNG ou WebP)." }, { status: 400 });
    }
    if (contract && !validFile(contract, allowedContracts)) {
      return NextResponse.json({ error: "Le contrat doit être un PDF, JPG ou PNG de 1 Mo maximum." }, { status: 400 });
    }
    const totalSize = photos.reduce((sum, file) => sum + file.size, 0) + (contract?.size ?? 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json({ error: "Les fichiers dépassent la taille totale autorisée de 3 Mo." }, { status: 400 });
    }

    // Store the signed document privately before notifying the business.
    // Create the order first so its ID can be used in the storage path.
    const order = await prisma.order.create({
      data: { name, email, phone, address, availability, description, pricingPlanId: plan.id, status: "NEW" },
    });

    if (contract) {
      let storedPath: string | null = null;
      try {
        storedPath = await uploadSignedContract(order.id, contract);
        await prisma.order.update({ where: { id: order.id }, data: { signedContractUrl: storedPath } });
      } catch (storageError) {
        console.error("Contract persistence failed:", storageError);
        if (storedPath) await deleteSignedContract(storedPath);
        // Avoid accepting an order whose submitted contract was not saved.
        try { await prisma.order.delete({ where: { id: order.id } }); }
        catch (cleanupError) { console.error("Order cleanup failed:", cleanupError); }
        return NextResponse.json(
          { error: "Le contrat signé n'a pas pu être enregistré. Veuillez réessayer." },
          { status: 500 }
        );
      }
    }

    // Keep email attachments separate from persistent storage.
    const attachments = await Promise.all(
      [...photos, ...(contract ? [contract] : [])].map(async (file, index) => {
        const extension = file.type === "application/pdf" ? "pdf" : file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
        return {
          filename: index < photos.length ? `photo-${index + 1}.${extension}` : `contrat-signe.${extension}`,
          content: Buffer.from(await file.arrayBuffer()).toString("base64"),
        };
      })
    );

    let emailSent = false;
    if (!apiKey || !emailFrom || !adminEmail) {
      console.error("Missing Resend email configuration.");
    } else {
      const resend = new Resend(apiKey);
      const emailText = [
        "NOUVELLE DEMANDE DE SERVICE", "",
        `Référence : ${order.id}`, `Formule : ${plan.title}`, "",
        "INFORMATIONS DU CLIENT", "",
        `Nom : ${name}`, `Courriel : ${email}`, `Téléphone : ${phone}`, `Adresse : ${address}`, "",
        "DISPONIBILITÉS", "", availability, "",
        "DESCRIPTION DU PROBLÈME", "", description, "",
        "DOCUMENTS", "", `Photos : ${photos.length}`, `Contrat signé : ${contract ? "Oui" : "Non"}`, "",
        "Cette demande a été enregistrée dans le tableau de bord administrateur.",
      ].join("\n");
      try {
        const { error } = await resend.emails.send({
          from: emailFrom,
          to: [adminEmail],
          subject: `Nouvelle demande - ${plan.title}`,
          text: emailText,
          attachments,
        });
        if (error) console.error("Admin notification error:", error);
        else emailSent = true;
      } catch (emailError) {
        console.error("Admin notification exception:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      emailSent,
      message: emailSent
        ? "Votre demande a été enregistrée avec succès."
        : "Votre demande a été enregistrée. La notification à notre équipe est temporairement indisponible.",
    }, { status: 201 });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json({ error: "Une erreur est survenue lors de l'enregistrement de votre demande." }, { status: 500 });
  }
}
