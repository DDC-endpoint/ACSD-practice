import { useEffect, useState } from "react";
import { getCourses } from "./courseService";
import type { Course } from "./types/Course";

export interface CoursesState {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

export function useCourses(): CoursesState {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO d06-4: load the courses once, when the component mounts:
  //   useEffect(() => { ... }, []) with:
  //   1. const controller = new AbortController();
  //   2. an async function that awaits getCourses(controller.signal), then
  //      setCourses + setLoading(false). On an error: setError(message) + setLoading(false),
  //      BUT if the request was aborted (controller.signal.aborted, or err.name === "AbortError")
  //      return without touching state.
  //   3. call it, and return a cleanup function that calls controller.abort().

  return { courses, loading, error };
}
