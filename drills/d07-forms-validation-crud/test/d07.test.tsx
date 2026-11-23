import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { validateEvent } from "../src/validateEvent";
import { createEvent, deleteEvent, updateEvent } from "../src/eventService";
import { EventForm } from "../src/EventForm";

const VALID = { name: "Hack Night", location: "Room 3.12", maxAttendees: "50" };

// A tiny fake Response: just the parts our code reads.
function fakeResponse(status: number, body?: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn(async () => body),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

test("1. validateEvent: valid input returns no errors (maxAttendees as a string or a number)", () => {
  expect(validateEvent(VALID)).toEqual({});
  expect(validateEvent({ ...VALID, maxAttendees: 50 })).toEqual({});
  expect(validateEvent({ ...VALID, maxAttendees: "1" })).toEqual({});
});

test("2. validateEvent: name and location must not be empty after trim", () => {
  const errors = validateEvent({ name: "   ", location: "", maxAttendees: "10" });
  expect(errors.name).toEqual(expect.any(String));
  expect(errors.location).toEqual(expect.any(String));
  expect(errors.maxAttendees).toBeUndefined();
  expect(Object.keys(errors).sort()).toEqual(["location", "name"]);
});

test("3. validateEvent: maxAttendees must be a positive integer", () => {
  for (const bad of [0, -3, 2.5, "", "  ", "abc", "2.5", "0", "-1"]) {
    expect(validateEvent({ ...VALID, maxAttendees: bad }).maxAttendees, `for ${JSON.stringify(bad)}`).toEqual(
      expect.any(String),
    );
  }
});

test("4. createEvent: POSTs JSON to /api/events and returns the created event", async () => {
  const created = { id: 42, name: "Hack Night", location: "Room 3.12", maxAttendees: 50 };
  const fetchMock = vi.fn(async () => fakeResponse(201, created));
  vi.stubGlobal("fetch", fetchMock);
  const data = { name: "Hack Night", location: "Room 3.12", maxAttendees: 50 };

  await expect(createEvent(data)).resolves.toEqual(created);

  expect(fetchMock).toHaveBeenCalledTimes(1);
  const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
  expect(url).toBe("/api/events");
  expect(init.method).toBe("POST");
  expect(init.headers).toEqual({ "Content-Type": "application/json" });
  expect(init.body).toBe(JSON.stringify(data)); // a JSON string, not the object
});

test("5. createEvent: throws when the response is not ok (e.g. 400)", async () => {
  const res = fakeResponse(400, { message: "Bad request" });
  const fetchMock = vi.fn(async () => res);
  vi.stubGlobal("fetch", fetchMock);
  await expect(createEvent({ name: "x", location: "y", maxAttendees: 1 })).rejects.toThrow();
  expect(fetchMock).toHaveBeenCalledTimes(1); // it really asked the server, then checked res.ok
});

test("6. updateEvent PUTs to /api/events/42; deleteEvent sends DELETE to /api/events/42", async () => {
  const fetchMock = vi.fn(async () => fakeResponse(204));
  vi.stubGlobal("fetch", fetchMock);
  const data = { name: "Hack Night", location: "Lab 1", maxAttendees: 60 };

  await updateEvent(42, data);
  const [putUrl, putInit] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
  expect(putUrl).toBe("/api/events/42");
  expect(putInit.method).toBe("PUT");
  expect(putInit.headers).toEqual({ "Content-Type": "application/json" });
  expect(putInit.body).toBe(JSON.stringify(data));

  await deleteEvent(42);
  const [delUrl, delInit] = fetchMock.mock.calls[1] as unknown as [string, RequestInit];
  expect(delUrl).toBe("/api/events/42");
  expect(delInit.method).toBe("DELETE");

  vi.stubGlobal("fetch", vi.fn(async () => fakeResponse(404)));
  await expect(updateEvent(99, data)).rejects.toThrow();
});

test("7. EventForm: invalid input shows an error per field and does NOT call onCreate", async () => {
  const user = userEvent.setup();
  const onCreate = vi.fn();
  render(<EventForm onCreate={onCreate} />);

  await user.type(screen.getByLabelText("Location"), "Room 3.12");
  await user.type(screen.getByLabelText("Maximum attendees"), "0");
  await user.click(screen.getByRole("button", { name: "Create event" }));

  const alerts = screen.getAllByRole("alert");
  expect(alerts).toHaveLength(2); // name + maxAttendees, not location
  expect(onCreate).not.toHaveBeenCalled();
});

test("8. EventForm: valid input calls onCreate once with trimmed text and a number", async () => {
  const user = userEvent.setup();
  const onCreate = vi.fn();
  render(<EventForm onCreate={onCreate} />);

  await user.type(screen.getByLabelText("Event name"), "  Hack Night ");
  await user.type(screen.getByLabelText("Location"), "Room 3.12");
  await user.type(screen.getByLabelText("Maximum attendees"), "50");
  await user.click(screen.getByRole("button", { name: "Create event" }));

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(onCreate).toHaveBeenCalledTimes(1);
  expect(onCreate).toHaveBeenCalledWith({ name: "Hack Night", location: "Room 3.12", maxAttendees: 50 });
});
