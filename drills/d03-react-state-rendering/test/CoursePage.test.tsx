import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModuleList } from "../src/ModuleList";
import { CoursePage } from "../src/CoursePage";
import { LikeButton } from "../src/LikeButton";
import type { Course } from "../src/types";

const course: Course = {
  title: "Advanced Client-Side Development",
  description: "Build React apps with TypeScript.",
  modules: [
    { code: "W01", title: "TypeScript basics" },
    { code: "W02", title: "React state" },
    { code: "W03", title: "Routing" },
  ],
  reviews: [
    { id: 1, author: "Ana", text: "Great labs" },
    { id: 2, author: "Ben", text: "Hard but fair" },
  ],
};

describe("d03-1 ModuleList", () => {
  test("1. renders one list item per module, in order", () => {
    render(<ModuleList modules={course.modules} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent("W01: TypeScript basics");
    expect(items[2]).toHaveTextContent("W03: Routing");
  });

  test("2. an empty list returns early with 'No modules yet.'", () => {
    render(<ModuleList modules={[]} />);
    expect(screen.getByText("No modules yet.")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});

describe("d03-2 CoursePage: early returns + tab state", () => {
  test("3. loading shows 'Loading course…'; no course shows 'Course not found.'", () => {
    const { rerender } = render(<CoursePage course={course} loading={true} />);
    expect(screen.getByText("Loading course…")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    rerender(<CoursePage course={null} loading={false} />);
    expect(screen.getByText("Course not found.")).toBeInTheDocument();
  });

  test("4. starts on Overview: title, three tab buttons and the description", () => {
    render(<CoursePage course={course} loading={false} />);
    expect(screen.getByRole("heading", { name: course.title })).toBeInTheDocument();
    expect(screen.getAllByRole("button").map((b) => b.textContent)).toEqual(["Overview", "Modules", "Reviews"]);
    expect(screen.getByText(course.description)).toBeInTheDocument();
    expect(screen.queryByText("W01: TypeScript basics")).not.toBeInTheDocument();
  });

  test("5. clicking Modules shows the module list and hides the description", async () => {
    const user = userEvent.setup();
    render(<CoursePage course={course} loading={false} />);
    await user.click(screen.getByRole("button", { name: "Modules" }));
    expect(screen.getByText("W02: React state")).toBeInTheDocument();
    expect(screen.queryByText(course.description)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Overview" }));
    expect(screen.getByText(course.description)).toBeInTheDocument();
  });
});

describe("d03-3 CoursePage: the Reviews tab", () => {
  test("6. Reviews lists every review, or 'No reviews yet.' when there are none", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<CoursePage course={course} loading={false} />);
    await user.click(screen.getByRole("button", { name: "Reviews" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Ben: Hard but fair")).toBeInTheDocument();
    expect(screen.queryByText("No reviews yet.")).not.toBeInTheDocument();
    unmount();

    render(<CoursePage course={{ ...course, reviews: [] }} loading={false} />);
    await user.click(screen.getByRole("button", { name: "Reviews" }));
    expect(screen.getByText("No reviews yet.")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});

describe("d03-4 LikeButton", () => {
  test("7. Like adds one each click", async () => {
    const user = userEvent.setup();
    render(<LikeButton />);
    expect(screen.getByText("Likes: 0")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Like" }));
    await user.click(screen.getByRole("button", { name: "Like" }));
    expect(screen.getByText("Likes: 2")).toBeInTheDocument();
  });

  test("8. +2 really adds two (needs the functional update l => l + 1)", async () => {
    const user = userEvent.setup();
    render(<LikeButton />);
    await user.click(screen.getByRole("button", { name: "+2" }));
    expect(screen.getByText("Likes: 2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "+2" }));
    expect(screen.getByText("Likes: 4")).toBeInTheDocument();
  });
});
