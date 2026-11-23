import type { Product } from "./types";

// Service module: every request to the products API lives here.
// The components never call fetch directly; TanStack Query calls these functions.
const BASE_URL = "/api/products";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    // Throwing is how a queryFn tells TanStack Query "this failed" (isError becomes true).
    throw new Error(`Could not load products (HTTP ${res.status})`);
  }
  return res.json();
}

export async function updateProduct(product: Product): Promise<Product> {
  const res = await fetch(`${BASE_URL}/${product.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    throw new Error(`Could not update product ${product.id} (HTTP ${res.status})`);
  }
  return res.json();
}
