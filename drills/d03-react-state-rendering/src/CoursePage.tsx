import { useState } from "react";
import { ModuleList } from "./ModuleList";
import { TABS, type Course, type TabId } from "./types";

interface Props {
  course: Course | null;
  loading: boolean;
}

export function CoursePage({ course, loading }: Props) {
  // TODO d03-2: state, early returns and the tab bar.
  //   1. Declare the selected tab with useState<TabId>, starting at "overview".
  //      (Call the Hook FIRST, before any `return`, or you break the Rules of Hooks.)
  //   2. EARLY RETURNS: if loading -> <p>Loading course…</p>
  //                     if course is null -> <p>Course not found.</p>
  //   3. Return a <section> with:
  //      - <h1> with course.title
  //      - one <button> per entry in TABS (use TABS.map, key={t.id}), showing t.label;
  //        onClick sets the selected tab to t.id. Optional: aria-pressed={tab === t.id}
  //      - Overview tab, using &&:  {tab === "overview" && <p>{course.description}</p>}
  //      - Modules tab, using &&:   <ModuleList modules={course.modules} />
  //
  // TODO d03-3: the Reviews tab, using a TERNARY inside `tab === "reviews" && (...)`:
  //      - reviews exist -> <ul> with one <li key={r.id}> per review: "Author: text"
  //      - no reviews    -> <p>No reviews yet.</p>
  return <p>TODO d03-2</p>;
}
