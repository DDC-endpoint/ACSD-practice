import type { Course } from "./types/Course";

// One place for the endpoint. Every component that needs courses calls this module.
const BASE_URL = "https://example.com/api";

// An Error that also remembers the HTTP status, so the UI can react to 401 vs 403.
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// A friendly message for each status code the UI cares about.
export function messageFor(status: number): string {
  // TODO d06-1: return a message for each status (a switch works well):
  //   401 -> one that tells the user to sign in        (e.g. "Please sign in to continue.")
  //   403 -> one about permission, NOT about signing in (e.g. "You don't have permission to do that.")
  //   404 -> "Course not found."
  //   500 -> one that mentions a server error           (e.g. "Server error. Please try again later.")
  //   anything else -> `Request failed (HTTP ${status}).`
  throw new Error("TODO d06-1");
}

// GET /api/courses. Pass the signal on to fetch so the request can be cancelled.
export async function getCourses(signal?: AbortSignal): Promise<Course[]> {
  // TODO d06-2: with async/await:
  //   1. await fetch(`${BASE_URL}/courses`, { signal })
  //   2. if !res.ok -> throw new ApiError(res.status, messageFor(res.status))
  //   3. return the parsed JSON body as Course[]
  throw new Error("TODO d06-2");
}

// DELETE /api/courses/:id. The server answers 204 No Content: success, but no body.
export async function deleteCourse(id: number): Promise<void> {
  // TODO d06-3: fetch `${BASE_URL}/courses/${id}` with method "DELETE".
  //   Throw an ApiError if !res.ok. On success return nothing:
  //   do NOT call res.json(), because a 204 has no body to parse.
  throw new Error("TODO d06-3");
}
