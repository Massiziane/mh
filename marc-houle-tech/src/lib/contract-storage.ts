import "server-only";
import { createClient } from "@supabase/supabase-js";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "signed-contracts";

function storage() {
  const url = process.env.SUPABASE_URL;
  // Supabase supports both new secret keys and legacy service-role keys.
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Configuration Supabase manquante.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  }).storage.from(BUCKET);
}

export async function uploadSignedContract(orderId: string, file: File) {
  const extension = file.type === "application/pdf" ? "pdf" : file.type === "image/png" ? "png" : "jpg";
  const path = `${orderId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await storage().upload(path, Buffer.from(await file.arrayBuffer()), {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    console.error("Supabase contract upload failed:", error);
    throw new Error("Impossible d'enregistrer le contrat signé.");
  }
  return path;
}

export async function downloadSignedContract(path: string) {
  const { data, error } = await storage().download(path);
  if (error || !data) {
    console.error("Supabase contract download failed:", error);
    throw new Error("Contrat introuvable dans le stockage.");
  }
  return data;
}

export async function deleteSignedContract(path: string) {
  const { error } = await storage().remove([path]);
  if (error) console.error("Supabase contract cleanup failed:", error);
}
