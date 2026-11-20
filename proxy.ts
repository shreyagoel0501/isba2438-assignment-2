import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_USERNAME = "admin";
const WRITE_METHODS = ["POST", "PUT", "DELETE"];

function isProtected(pathname: string, method: string): boolean {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return true;
  if (pathname === "/api/contact") return method === "GET";
  if (/^\/api\/contact\/[^/]+$/.test(pathname)) return true;
  if (
    pathname === "/api/projects" ||
    /^\/api\/projects\/[^/]+$/.test(pathname) ||
    pathname === "/api/blogs" ||
    /^\/api\/blogs\/[^/]+$/.test(pathname)
  ) {
    return WRITE_METHODS.includes(method);
  }
  if (/^\/api\/recommendations\/[^/]+$/.test(pathname)) {
    return method === "PUT" || method === "DELETE";
  }
  return false;
}

function parseBasicCredentials(
  header: string | null,
): { username: string; password: string } | null {
  if (!header) return null;
  const match = /^Basic (.+)$/i.exec(header);
  if (!match) return null;
  let decoded: string;
  try {
    decoded = atob(match[1]);
  } catch {
    return null;
  }
  const separator = decoded.indexOf(":");
  if (separator < 0) return null;
  return {
    username: decoded.slice(0, separator),
    password: decoded.slice(separator + 1),
  };
}

async function passwordMatches(provided: string, expected: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [providedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(provided)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const providedBytes = new Uint8Array(providedHash);
  const expectedBytes = new Uint8Array(expectedHash);
  let diff = 0;
  for (let i = 0; i < providedBytes.length; i += 1) {
    diff |= providedBytes[i] ^ expectedBytes[i];
  }
  return diff === 0;
}

async function isAuthorized(request: NextRequest): Promise<boolean> {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    return process.env.VERCEL !== "1";
  }
  const credentials = parseBasicCredentials(request.headers.get("authorization"));
  if (!credentials || credentials.username !== ADMIN_USERNAME) return false;
  return passwordMatches(credentials.password, expectedPassword);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isProtected(pathname, request.method)) {
    return NextResponse.next();
  }
  if (await isAuthorized(request)) {
    return NextResponse.next();
  }
  return NextResponse.json(
    { ok: false, error: "Unauthorized." },
    { status: 401, headers: { "WWW-Authenticate": 'Basic realm="Admin"' } },
  );
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
