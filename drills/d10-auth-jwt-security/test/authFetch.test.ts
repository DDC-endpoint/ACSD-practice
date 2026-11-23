import { ApiError, authFetch } from "../src/authFetch";

function jsonResponse(status: number, body?: unknown): Response {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

test("6. authFetch sends 'Authorization: Bearer <token>' and returns the JSON", async () => {
  const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, [{ id: 1 }]));
  vi.stubGlobal("fetch", fetchMock);

  const data = await authFetch<{ id: number }[]>("/api/bookings", "abc.def.ghi", vi.fn());

  expect(data).toEqual([{ id: 1 }]);
  const [url, init] = fetchMock.mock.calls[0];
  expect(url).toBe("/api/bookings");
  expect(new Headers(init.headers).get("Authorization")).toBe("Bearer abc.def.ghi");
});

test("7. on 401 authFetch calls onUnauthorized() and throws an ApiError with status 401", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(401, { message: "expired" })));
  const onUnauthorized = vi.fn();

  const error = await authFetch("/api/bookings", "old.token.x", onUnauthorized).catch((e: unknown) => e);

  expect(onUnauthorized).toHaveBeenCalledTimes(1);
  expect(error).toBeInstanceOf(ApiError);
  expect((error as ApiError).status).toBe(401);
});

test("8. on 403 authFetch throws a 'forbidden' ApiError and does NOT log the user out", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(403)));
  const onUnauthorized = vi.fn();

  const error = await authFetch("/api/admin/roles", "user.token.x", onUnauthorized).catch((e: unknown) => e);

  expect(error).toBeInstanceOf(ApiError);
  expect((error as ApiError).status).toBe(403);
  expect((error as ApiError).message).toMatch(/forbidden/i);
  expect(onUnauthorized).not.toHaveBeenCalled();
});
