import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { formatProduct, isProduct, productsFrom } from "../src/product";
import { statusLabel } from "../src/order";
import { formatId } from "../src/ids";

// Types vanish when TypeScript runs, so tests 1, 3 and 5 read your source code as text
// (with comments stripped) to check the type declarations themselves.
function source(file: string): string {
  const text = readFileSync(resolve(__dirname, "../src", file), "utf8");
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

// The members of `type Name = A | B | C;`, sorted, with 'single' quotes turned into "double".
function unionMembers(src: string, name: string): string[] {
  const match = src.match(new RegExp(`type\\s+${name}\\s*=\\s*([^;]+);`));
  if (!match) return [];
  return match[1]
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.replace(/^'(.*)'$/, '"$1"'))
    .sort();
}

describe("d02 TypeScript types", () => {
  test("1. Product is an interface with exactly the C2 fields (description optional)", () => {
    const src = source("product.ts");
    const body = src.match(/export\s+interface\s+Product\s*\{([^}]*)\}/)?.[1] ?? "";
    const fields = body
      .split(/[;,\n]/)
      .map((line) => line.replace(/\s+/g, ""))
      .filter(Boolean)
      .sort();
    expect(fields).toEqual(["description?:string", "id:number", "name:string", "price:number"]);
  });

  test("2. formatProduct uses the optional description, or a fallback", () => {
    const mug = { id: 1, name: "Mug", price: 4.5, description: "Holds 350ml" };
    const pen = { id: 2, name: "Pen", price: 1 };
    expect(formatProduct(mug)).toBe("Mug - £4.50 - Holds 350ml");
    expect(formatProduct(pen)).toBe("Pen - £1.00 - No description");
  });

  test('3. OrderStatus is a literal union: "pending" | "shipped" | "delivered"', () => {
    const src = source("order.ts");
    expect(src).toMatch(/export\s+type\s+OrderStatus\s*=/); // a type alias, not an interface
    // string LITERALS, so each one is quoted: "pending", not pending
    expect(unionMembers(src, "OrderStatus")).toEqual(['"delivered"', '"pending"', '"shipped"']);
  });

  test("4. statusLabel switches on the status", () => {
    expect(statusLabel("pending")).toBe("Waiting to ship");
    expect(statusLabel("shipped")).toBe("On its way");
    expect(statusLabel("delivered")).toBe("Delivered");
  });

  test("5. Id is string | number, and formatId narrows it with typeof", () => {
    expect(unionMembers(source("ids.ts"), "Id")).toEqual(["number", "string"]); // | not &
    expect(formatId(42)).toBe("#42");
    expect(formatId(" ab-12 ")).toBe("AB-12");
    expect(formatId("7")).toBe("7"); // a string that looks like a number is still a string
  });

  test("6. isProduct accepts real Products and rejects everything else", () => {
    expect(isProduct({ id: 1, name: "Mug", price: 4.5 })).toBe(true);
    expect(isProduct({ id: 1, name: "Mug", price: 4.5, description: "Blue" })).toBe(true);

    expect(isProduct(null)).toBe(false);
    expect(isProduct("Mug")).toBe(false);
    expect(isProduct({ id: 1, name: "Mug" })).toBe(false); // price missing
    expect(isProduct({ id: "1", name: "Mug", price: 4.5 })).toBe(false); // id is a string
    expect(isProduct({ id: 1, name: "Mug", price: "4.50" })).toBe(false); // price is a string
    expect(isProduct({ id: 1, name: "Mug", price: 4.5, description: 99 })).toBe(false);
  });

  test("7. productsFrom keeps only valid items from an untrusted API body", () => {
    const body: unknown = JSON.parse(
      '{"items":[{"id":1,"name":"Mug","price":4.5},{"id":2,"name":"Pen"},{"id":3,"name":"Cap","price":9,"description":"Red"}],"total":3}',
    );
    expect(productsFrom(body).map((p) => p.name)).toEqual(["Mug", "Cap"]);
    expect(productsFrom({ items: "nope" })).toEqual([]);
    expect(productsFrom(null)).toEqual([]);
  });
});
