// Given: the data shapes for the course page. Nothing to do here.

export type TabId = "overview" | "modules" | "reviews";

export interface CourseModule {
  code: string; // unique, e.g. "5COSC026W", so it makes a good React key
  title: string;
}

export interface Review {
  id: number;
  author: string;
  text: string;
}

export interface Course {
  title: string;
  description: string;
  modules: CourseModule[];
  reviews: Review[];
}

// The three tab buttons, in display order.
export const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "modules", label: "Modules" },
  { id: "reviews", label: "Reviews" },
];
