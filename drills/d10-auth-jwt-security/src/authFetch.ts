// d10: one place that attaches the token and reacts to 401 / 403.
// Same idea as the module's services/api.ts `request()` helper.

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * fetch() with `Authorization: Bearer <token>` added.
 * - 401 (not logged in / token expired or invalid): call onUnauthorized(), then throw ApiError(401).
 * - 403 (logged in, but not allowed): throw ApiError(403, "Forbidden ...").
 * - any other non-2xx: throw ApiError(status).
 * - 204: return undefined. Otherwise return the parsed JSON body.
 */
export async function authFetch<T>(
  url: string,
  token: string | null,
  onUnauthorized: () => void,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(url, { ...init, headers });

  if (response.status === 401) {
    onUnauthorized();
    throw new ApiError(401, "Unauthorised: please sign in again.");
  }
  if (response.status === 403) {
    throw new ApiError(403, "Forbidden: you do not have permission to do this.");
  }
  if (!response.ok) {
    throw new ApiError(response.status, `Request failed (HTTP ${response.status}).`);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
