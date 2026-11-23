import { useCourses } from "./useCourses";

export function CourseCount() {
  const { courses, loading, error } = useCourses();

  if (loading) return <p>Loading…</p>;
  if (error) return <p role="alert">{error}</p>;
  return <p>{courses.length} courses</p>;
}
