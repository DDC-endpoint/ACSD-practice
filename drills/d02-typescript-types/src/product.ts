// d02 · Describing data with an interface, and checking API data at runtime.

// TODO d02-1: write the Product interface exactly as mock C2 asks:
//   id: number, name: string, price: number, description: an OPTIONAL string.
export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

// What we EXPECT GET /api/products to send back. Only a promise from us to the compiler:
// at runtime the server can send anything, which is why productsFrom() checks every item.
export interface ProductsResponse {
  items: Product[];
  total: number;
}

// TODO d02-2: format a product as "Mug - £4.50 - Holds 350ml".
//   price always has 2 decimals (toFixed(2)). description is optional: if it is missing,
//   use "No description" instead (try the ?? operator).
export function formatProduct(p: Product): string {
  return `${p.name} - £${p.price.toFixed(2)} - ${p.description ?? "No description"}`;
}

// TODO d02-5: a type guard. Return true only if x is a non-null object whose
//   id is a number, name is a string, price is a number, and description is
//   either missing (undefined) or a string.
export function isProduct(x: unknown): x is Product {
  if (typeof x !== "object" || x === null) return false;
  const p = x as Record<string, unknown>;
  return (
    typeof p.id === "number" &&
    typeof p.name === "string" &&
    typeof p.price === "number" &&
    (p.description === undefined || typeof p.description === "string")
  );
}

// GIVEN: takes the parsed JSON body (unknown!) and keeps only the items that really are Products.
export function productsFrom(data: unknown): Product[] {
  if (typeof data !== "object" || data === null) return [];
  const items = (data as { items?: unknown }).items;
  if (!Array.isArray(items)) return [];
  return items.filter(isProduct);
}
