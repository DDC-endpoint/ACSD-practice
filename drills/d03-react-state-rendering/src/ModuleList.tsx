import type { CourseModule } from "./types";

interface Props {
  modules: CourseModule[];
}

export function ModuleList({ modules }: Props) {
  if (modules.length === 0) {
    return <p>No modules yet.</p>;
  }

  return (
    <ul>
      {modules.map((m) => (
        <li key={m.code}>
          {m.code}: {m.title}
        </li>
      ))}
    </ul>
  );
}
