import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const USER = process.env.DASH_USER || "";
  const PASS = process.env.DASH_PASS || "";

  if (!USER || !PASS) return NextResponse.next();

  const auth = req.headers.get("authorization");
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = Buffer.from(encoded, "base64").toString("utf8");
      const [u, p] = decoded.split(":");
      if (u === USER && p === PASS) return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Healthchecks Dashboard"' },
  });
}

export const config = { matcher: ["/:path*"] };
