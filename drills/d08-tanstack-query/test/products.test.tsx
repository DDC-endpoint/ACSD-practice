import type { ReactNode } from "react";
import { render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProducts } from "../src/useProducts";
import { useUpdateProduct } from "../src/useUpdateProduct";
import { ProductList } from "../src/ProductList";
import type { Product } from "../src/types";

// ---------- a tiny fake server behind a stubbed fetch ----------

let serverProducts: Product[];
let fetchMock: ReturnType<typeof vi.fn>;

function jsonResponse(body: unknown, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => body } as Response;
}

function getCalls() {
  return fetchMock.mock.calls.filter(([, init]) => !init || !init.method || init.method === "GET");
}

beforeEach(() => {
  serverProducts = [
    { id: 1, name: "Kettle", price: 20 },
    { id: 2, name: "Toaster", price: 30 },
  ];
  fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    if (init?.method === "PUT") {
      const updated = JSON.parse(String(init.body)) as Product;
      serverProducts = serverProducts.map((p) => (p.id === updated.id ? updated : p));
      return jsonResponse(updated);
    }
    return jsonResponse(serverProducts);
  });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// A fresh QueryClient per test, so no cache leaks between tests. retry: false makes errors show at once.
function makeClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

function renderWithClient(ui: ReactNode, client = makeClient()) {
  const result = render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
  return { ...result, client };
}

// ---------- tests ----------

test("1. useProducts fetches /api/products and returns the data", async () => {
  const client = makeClient();
  const { result } = renderHook(() => useProducts(), {
    wrapper: ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>,
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toEqual(serverProducts);
  expect(fetchMock).toHaveBeenCalledWith("/api/products");
});

test("2. two components using useProducts share ONE fetch (the cache)", async () => {
  function ProductCount() {
    const { data } = useProducts();
    return <p>Count: {data ? data.length : "..."}</p>;
  }
  function FirstName() {
    const { data } = useProducts();
    return <p>First: {data ? data[0].name : "..."}</p>;
  }

  renderWithClient(
    <>
      <ProductCount />
      <FirstName />
    </>,
  );

  expect(await screen.findByText("Count: 2")).toBeInTheDocument();
  expect(await screen.findByText("First: Kettle")).toBeInTheDocument();
  expect(getCalls()).toHaveLength(1);
});

test("3. staleTime is 60 seconds: a component mounted later reuses the fresh cache", async () => {
  function ProductCount() {
    const { data } = useProducts();
    return <p>Count: {data ? data.length : "..."}</p>;
  }

  const client = makeClient();
  const first = renderWithClient(<ProductCount />, client);
  expect(await screen.findByText("Count: 2")).toBeInTheDocument();
  first.unmount();

  // Mount again on the SAME client. With the default staleTime (0) this would refetch on mount.
  renderWithClient(<ProductCount />, client);
  expect(screen.getByText("Count: 2")).toBeInTheDocument(); // straight from the cache, no loading state
  await new Promise((r) => setTimeout(r, 20));
  expect(getCalls()).toHaveLength(1); // still the one fetch from the first mount
});

test("4. ProductList shows a loading message, then the products", async () => {
  renderWithClient(<ProductList />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  expect(await screen.findByText(/Kettle/)).toBeInTheDocument();
  expect(screen.getByText(/Toaster/)).toBeInTheDocument();
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});

test("5. ProductList shows an error when the request fails", async () => {
  fetchMock.mockImplementation(async () => jsonResponse({ message: "boom" }, 500));

  renderWithClient(<ProductList />);

  expect(await screen.findByRole("alert")).toHaveTextContent(/error/i);
  expect(screen.queryByText(/Kettle/)).not.toBeInTheDocument();
});

test("6. useUpdateProduct sends a PUT with the product as JSON", async () => {
  const client = makeClient();
  const { result } = renderHook(() => useUpdateProduct(), {
    wrapper: ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>,
  });

  result.current.mutate({ id: 2, name: "Toaster", price: 35 });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  const [url, init] = fetchMock.mock.calls[0];
  expect(url).toBe("/api/products/2");
  expect(init.method).toBe("PUT");
  expect(JSON.parse(init.body)).toEqual({ id: 2, name: "Toaster", price: 35 });
});

test("7. after a successful update, invalidateQueries makes the list refetch", async () => {
  const user = userEvent.setup();
  renderWithClient(<ProductList />);

  expect(await screen.findByText(/Kettle: £20/)).toBeInTheDocument();
  expect(getCalls()).toHaveLength(1);

  await user.click(screen.getByRole("button", { name: "Raise price of Kettle" }));

  // The new price only appears if the list was fetched again from the (fake) server.
  expect(await screen.findByText(/Kettle: £21/)).toBeInTheDocument();
  expect(getCalls()).toHaveLength(2);
});
