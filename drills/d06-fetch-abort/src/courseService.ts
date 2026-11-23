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
  switch (status) {
    case 401:
      return "Please sign in to continue.";
    case 403:
      return "You don't have permission to do that.";
    case 404:
      return "Course not found.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return `Request failed (HTTP ${status}).`;
  }
}

// GET /api/courses. Pass the signal on to fetch so the request can be cancelled.
export async function getCourses(signal?: AbortSignal): Promise<Course[]> {
  const res = await fetch(`${BASE_URL}/courses`, { signal });
  if (!res.ok) {
    throw new ApiError(res.status, messageFor(res.status));
  }
  return (await res.json()) as Course[];
}

// DELETE /api/courses/:id. The server answers 204 No Content: success, but no body.
export async function deleteCourse(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/courses/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new ApiError(res.status, messageFor(res.status));
  }
  // 204 has no body, so there is nothing to parse. Calling res.json() here would throw.
}
