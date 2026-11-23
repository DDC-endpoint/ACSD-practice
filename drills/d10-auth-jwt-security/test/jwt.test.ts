import { decodeJwtPayload, hasRole, isTokenExpired } from "../src/jwt";

// Build a fake JWT: base64url(header).base64url(payload).fake-signature
function b64url(json: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(json));
  const binary = String.fromCharCode(...bytes);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function makeToken(payload: Record<string, unknown>): string {
  return `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url(payload)}.fake-signature`;
}

const EXP = 1_800_000_000; // seconds (Jan 2027)

test("1. decodeJwtPayload returns the claims from the middle part", () => {
  // "~~~?" and "Zoë" make base64url produce "-"/"_" and multi-byte UTF-8
  const token = makeToken({ sub: "u1", email: "zoë@uni.ac.uk", note: "~~~?", exp: EXP, role: "ADMIN" });
  expect(decodeJwtPayload(token)).toEqual({ sub: "u1", email: "zoë@uni.ac.uk", note: "~~~?", exp: EXP, role: "ADMIN" });
});

test("2. decodeJwtPayload returns null for a malformed token (never throws)", () => {
  expect(decodeJwtPayload("")).toBeNull();
  expect(decodeJwtPayload("not-a-jwt")).toBeNull();
  expect(decodeJwtPayload("only.two")).toBeNull();
  expect(decodeJwtPayload("a.%%%.c")).toBeNull(); // not base64
  expect(decodeJwtPayload(`a.${btoa("{not json")}.c`)).toBeNull(); // not JSON
  expect(decodeJwtPayload(`a.${b64url(42)}.c`)).toBeNull(); // JSON, but not an object
});

test("3. isTokenExpired compares exp (SECONDS) with now (MILLISECONDS) at the boundary", () => {
  const token = makeToken({ exp: EXP });
  expect(isTokenExpired(token, EXP * 1000 - 1)).toBe(false); // 1 ms before expiry
  expect(isTokenExpired(token, EXP * 1000)).toBe(true); // exactly at expiry
  expect(isTokenExpired(token, EXP * 1000 + 1)).toBe(true);
  // the classic bug: comparing seconds with milliseconds directly
  expect(isTokenExpired(token, 1_700_000_000_000)).toBe(false); // Nov 2023: still valid
});

test("4. isTokenExpired treats missing exp or a malformed token as expired", () => {
  expect(isTokenExpired(makeToken({ sub: "u1" }), 0)).toBe(true);
  expect(isTokenExpired(makeToken({ exp: "tomorrow" }), 0)).toBe(true);
  expect(isTokenExpired("garbage", 0)).toBe(true);
  // default for nowMs is Date.now()
  expect(isTokenExpired(makeToken({ exp: Math.floor(Date.now() / 1000) + 3600 }))).toBe(false);
});

test("5. hasRole handles a role string, a role array, and no role", () => {
  expect(hasRole(makeToken({ role: "ADMIN" }), "ADMIN")).toBe(true);
  expect(hasRole(makeToken({ role: "USER" }), "ADMIN")).toBe(false);
  expect(hasRole(makeToken({ role: ["USER", "ADMIN"] }), "ADMIN")).toBe(true);
  expect(hasRole(makeToken({ role: ["USER"] }), "ADMIN")).toBe(false);
  expect(hasRole(makeToken({ sub: "u1" }), "ADMIN")).toBe(false);
  expect(hasRole("garbage", "ADMIN")).toBe(false);
});
