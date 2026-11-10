import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { downloadSignedContract } from "@/lib/contract-storage";

export const runtime = "nodejs";

type Context = { params: Promise<{ orderId: string }> };

export async function GET(request: Request, { params }: Context) {
  // Authorization must happen before looking up or serving any customer file.
  await requireAdmin();
  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { signedContractUrl: true },
  });
  if (!order?.signedContractUrl) {
    return NextResponse.json({ error: "Contrat introuvable." }, { status: 404 });
  }

  try {
    const blob = await downloadSignedContract(order.signedContractUrl);
    const bytes = await blob.arrayBuffer();
    const extension = order.signedContractUrl.split(".").pop()?.toLowerCase();
    const mime = extension === "pdf" ? "application/pdf" : extension === "png" ? "image/png" : "image/jpeg";
    const download = new URL(request.url).searchParams.get("download") === "1";
    const disposition = download ? "attachment" : "inline";
    const filename = `contrat-signe.${extension === "pdf" || extension === "png" ? extension : "jpg"}`;

    return new NextResponse(bytes, {
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `${disposition}; filename="${filename}"`,
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Admin contract download error:", error);
    return NextResponse.json({ error: "Impossible de récupérer le contrat." }, { status: 500 });
  }
}
