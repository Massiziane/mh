import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return new NextResponse(
      "Admin authentication is not configured.",
      {
        status: 500,
      }
    );
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");

    if (scheme === "Basic" && encoded) {
      try {
        const decoded = atob(encoded);

        const separatorIndex = decoded.indexOf(":");

        const providedUsername =
          decoded.slice(0, separatorIndex);

        const providedPassword =
          decoded.slice(separatorIndex + 1);

        if (
          providedUsername === username &&
          providedPassword === password
        ) {
          return NextResponse.next();
        }
      } catch {
        // Invalid authorization header
      }
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,

    headers: {
      "WWW-Authenticate":
        'Basic realm="Marc Houle Admin", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};