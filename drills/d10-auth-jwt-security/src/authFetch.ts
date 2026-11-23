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
  // TODO d10-4:
  //  1. copy init.headers into `new Headers(...)` and, if there is a token, set
  //     "Authorization" to `Bearer <token>`
  //  2. await fetch(url, { ...init, headers })
  //  3. 401 -> call onUnauthorized(), then throw new ApiError(401, ...)
  //     403 -> throw new ApiError(403, "Forbidden ...")   (do NOT log the user out)
  //     other !response.ok -> throw new ApiError(response.status, ...)
  //  4. 204 -> return undefined as T; otherwise return the parsed JSON
  throw new Error("TODO d10-4");
}
