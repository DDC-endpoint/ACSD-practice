import { StrictMode } from "react";
import { render, screen } from "@testing-library/react";
import { ApiError, deleteCourse, getCourses } from "../src/courseService";
import { CourseCount } from "../src/CourseCount";

const COURSES = [
  { id: 1, code: "5COSC026W", title: "ACSD" },
  { id: 2, code: "5COSC019C", title: "OOP" },
  { id: 3, code: "5COSC020W", title: "Databases" },
];

// A tiny fake Response: just the parts our code reads.
function fakeResponse(status: number, body?: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn(async () => {
      if (body === undefined) throw new SyntaxError("Unexpected end of JSON input");
      return body;
    }),
  };
}

// A fake fetch that answers after a short delay, and rejects with AbortError
// if the request's signal is aborted first (like the real fetch does).
function slowFetch(status: number, body?: unknown) {
  return vi.fn(
    (_url: string, init?: RequestInit) =>
      new Promise((resolve, reject) => {
        const timer = setTimeout(() => resolve(fakeResponse(status, body)), 20);
        init?.signal?.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(new DOMException("The operation was aborted.", "AbortError"));
        });
      }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

test("1. getCourses: GETs /api/courses, passes the signal on, returns the JSON", async () => {
  const fetchMock = vi.fn(async () => fakeResponse(200, COURSES));
  vi.stubGlobal("fetch", fetchMock);
  const controller = new AbortController();

  const courses = await getCourses(controller.signal);

  expect(courses).toEqual(COURSES);
  expect(fetchMock).toHaveBeenCalledWith(
    "https://example.com/api/courses",
    expect.objectContaining({ signal: controller.signal }),
  );
});

test("2. getCourses: 401 and 403 throw an ApiError with different messages", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => fakeResponse(401)));
  const e401 = await getCourses().catch((e: unknown) => e);
  expect(e401).toBeInstanceOf(ApiError);
  expect(e401).toMatchObject({ status: 401 });
  expect((e401 as Error).message).toMatch(/sign in/i);

  vi.stubGlobal("fetch", vi.fn(async () => fakeResponse(403)));
  const e403 = await getCourses().catch((e: unknown) => e);
  expect(e403).toBeInstanceOf(ApiError);
  expect(e403).toMatchObject({ status: 403 });
  expect((e403 as Error).message).toMatch(/permission/i);
  expect((e403 as Error).message).not.toMatch(/sign in/i); // 403: logging in again won't help
});

test("3. getCourses: 404 and 500 throw an ApiError carrying the status", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => fakeResponse(404)));
  await expect(getCourses()).rejects.toMatchObject({ status: 404, message: expect.stringMatching(/not found/i) });

  vi.stubGlobal("fetch", vi.fn(async () => fakeResponse(500)));
  await expect(getCourses()).rejects.toMatchObject({ status: 500, message: expect.stringMatching(/server/i) });
});

test("4. deleteCourse: sends DELETE, treats 204 as success and never calls res.json()", async () => {
  const res = fakeResponse(204); // no body: json() would throw
  const fetchMock = vi.fn(async () => res);
  vi.stubGlobal("fetch", fetchMock);

  await expect(deleteCourse(7)).resolves.toBeUndefined();
  expect(fetchMock).toHaveBeenCalledWith(
    "https://example.com/api/courses/7",
    expect.objectContaining({ method: "DELETE" }),
  );
  expect(res.json).not.toHaveBeenCalled();

  vi.stubGlobal("fetch", vi.fn(async () => fakeResponse(403)));
  await expect(deleteCourse(7)).rejects.toMatchObject({ status: 403 });
});

test("5. CourseCount: shows Loading… first, then the number of courses", async () => {
  vi.stubGlobal("fetch", slowFetch(200, COURSES));

  render(<CourseCount />);

  expect(screen.getByText("Loading…")).toBeInTheDocument();
  expect(await screen.findByText("3 courses")).toBeInTheDocument();
  expect(screen.queryByText("Loading…")).not.toBeInTheDocument();
});

test("6. CourseCount: shows the error message when the request fails", async () => {
  vi.stubGlobal("fetch", slowFetch(500));

  render(<CourseCount />);

  expect(await screen.findByText(/server error/i)).toBeInTheDocument();
  expect(screen.queryByText("Loading…")).not.toBeInTheDocument();
  expect(screen.queryByText(/courses$/)).not.toBeInTheDocument();
});

test("7. unmount aborts the request, and nothing touches state afterwards", async () => {
  const fetchMock = slowFetch(200, COURSES);
  vi.stubGlobal("fetch", fetchMock);
  const consoleError = vi.spyOn(console, "error");

  const { unmount } = render(<CourseCount />);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  const init = fetchMock.mock.calls[0][1] as RequestInit | undefined;
  expect(init?.signal).toBeInstanceOf(AbortSignal);
  expect(init?.signal?.aborted).toBe(false);

  unmount();

  expect(init?.signal?.aborted).toBe(true);
  await new Promise((r) => setTimeout(r, 40)); // longer than the fake server's delay
  expect(consoleError).not.toHaveBeenCalled();
});

test("8. StrictMode's mount → unmount → mount: the aborted first request is ignored, not shown as an error", async () => {
  const fetchMock = slowFetch(200, COURSES);
  vi.stubGlobal("fetch", fetchMock);

  render(
    <StrictMode>
      <CourseCount />
    </StrictMode>,
  );

  expect(await screen.findByText("3 courses")).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledTimes(2); // StrictMode ran the effect twice
  const first = fetchMock.mock.calls[0][1] as RequestInit;
  expect(first.signal?.aborted).toBe(true); // the first run's cleanup aborted it
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
