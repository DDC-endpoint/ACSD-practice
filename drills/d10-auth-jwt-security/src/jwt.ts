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
  // TODO d10-1: split the token on "." (it must have exactly 3 parts, else return null).
  // Decode the MIDDLE part with base64UrlToText(), then JSON.parse it.
  // Return null if decoding/parsing throws (try/catch) or the result isn't a plain object.
  throw new Error("TODO d10-1");
}

/** true when the token is expired, has no numeric exp, or can't be decoded. */
export function isTokenExpired(token: string, nowMs: number = Date.now()): boolean {
  // TODO d10-2: decode the payload. No payload, or exp that isn't a number -> expired (true).
  // exp is in SECONDS, nowMs is in MILLISECONDS: convert before comparing.
  // A token is expired from the exact moment exp is reached.
  throw new Error("TODO d10-2");
}

/** true when the token's role claim (a string or an array of strings) contains `role`. */
export function hasRole(token: string, role: string): boolean {
  // TODO d10-3: read payload.role. It may be a string ("ADMIN") or an array (["USER", "ADMIN"]).
  // Return true if it equals / includes `role`. No role claim or a bad token -> false.
  throw new Error("TODO d10-3");
}
