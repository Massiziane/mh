
import "server-only";

import { timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";

function safeCompare(a: string, b: string) {
  const first = Buffer.from(a, "utf8");
  const second = Buffer.from(b, "utf8");

  if (first.length !== second.length) {
    return false;
  }

  return timingSafeEqual(first, second);
}

export async function requireAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "Admin authentication is not configured."
    );
  }

  const requestHeaders = await headers();

  const authorization =
    requestHeaders.get("authorization");

  if (!authorization) {
    throw new Error("Unauthorized");
  }

  const match = authorization.match(
    /^Basic\s+([A-Za-z0-9+/]+={0,2})$/i
  );

  if (!match) {
    throw new Error("Unauthorized");
  }

  let decoded: string;

  try {
    decoded = Buffer.from(
      match[1],
      "base64"
    ).toString("utf8");
  } catch {
    throw new Error("Unauthorized");
  }

  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex < 0) {
    throw new Error("Unauthorized");
  }

  const providedUsername = decoded.slice(
    0,
    separatorIndex
  );

  const providedPassword = decoded.slice(
    separatorIndex + 1
  );

  const validUsername = safeCompare(
    providedUsername,
    username
  );

  const validPassword = safeCompare(
    providedPassword,
    password
  );

  if (!validUsername || !validPassword) {
    throw new Error("Unauthorized");
  }
}
