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

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const data = await getCourses(controller.signal);
        setCourses(data);
        setLoading(false);
      } catch (err) {
        // We cancelled it ourselves (unmount), so fetch rejected with an AbortError.
        // That's not a real error, and the component is gone: don't touch state.
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setLoading(false);
      }
    }

    load();
    return () => controller.abort(); // cleanup: runs on unmount
  }, []);

  return { courses, loading, error };
}
