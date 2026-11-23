// d10: reading a JWT in the browser.
// A JWT is "header.payload.signature". Each part is base64url-encoded text.
// The browser can READ the payload, but it can NOT verify the signature
// (that needs the server's secret key). So everything here is a UX hint only:
// the server still checks every request.

export interface JwtPayload {
  sub?: string;
  email?: string;
  exp?: number; // expiry, in SECONDS since 1 Jan 1970 (not milliseconds!)
  role?: string | string[];
  [claim: string]: unknown;
}

/**
 * Given helper: base64url text -> normal string.
 * base64url swaps "+" for "-" and "/" for "_" and drops the "=" padding,
 * so we undo that before calling atob(). Throws on invalid input.
 */
export function base64UrlToText(part: string): string {
  const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Returns the payload (middle part) as an object, or null if the token is malformed. */
export function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload: unknown = JSON.parse(base64UrlToText(parts[1]));
    if (payload === null || typeof payload !== "object" || Array.isArray(payload)) return null;
    return payload as JwtPayload;
  } catch {
    return null;
  }
}

/** true when the token is expired, has no numeric exp, or can't be decoded. */
export function isTokenExpired(token: string, nowMs: number = Date.now()): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return true;
  return payload.exp * 1000 <= nowMs;
}

/** true when the token's role claim (a string or an array of strings) contains `role`. */
export function hasRole(token: string, role: string): boolean {
  const claim = decodeJwtPayload(token)?.role;
  if (typeof claim === "string") return claim === role;
  if (Array.isArray(claim)) return claim.includes(role);
  return false;
}
