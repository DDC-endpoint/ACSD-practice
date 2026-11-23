import { useState } from "react";
import { ModuleList } from "./ModuleList";
import { TABS, type Course, type TabId } from "./types";

interface Props {
  course: Course | null;
  loading: boolean;
}

export function CoursePage({ course, loading }: Props) {
  const [tab, setTab] = useState<TabId>("overview");

  if (loading) return <p>Loading course…</p>;
  if (course === null) return <p>Course not found.</p>;

  return (
    <section>
      <h1>{course.title}</h1>

      <nav>
        {TABS.map((t) => (
          <button key={t.id} aria-pressed={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && <p>{course.description}</p>}

      {tab === "modules" && <ModuleList modules={course.modules} />}

      {tab === "reviews" &&
        (course.reviews.length > 0 ? (
          <ul>
            {course.reviews.map((r) => (
              <li key={r.id}>
                {r.author}: {r.text}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        ))}
    </section>
  );
}
