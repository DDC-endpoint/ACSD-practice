import type { CourseModule } from "./types";

interface Props {
  modules: CourseModule[];
}

export function ModuleList({ modules }: Props) {
  // TODO d03-1: render the course's modules.
  //   - EARLY RETURN: if `modules` is empty, return <p>No modules yet.</p>
  //   - otherwise return a <ul> with one <li> per module, built with modules.map(...)
  //   - each <li> needs a stable key: use m.code (NOT the array index)
  //   - each <li> shows "CODE: Title", e.g. "W01: TypeScript basics"
  return <p>TODO d03-1</p>;
}
