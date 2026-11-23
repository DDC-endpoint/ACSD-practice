import * as fmt from "../src/format.js";
import formatEvent from "../src/format.js";

const event = { id: 1, title: "Hack Night", date: "2026-11-24", price: 500 };

describe("j03 format.js", () => {
  test("1. formatPrice is exported and turns pence into pounds", () => {
    expect(typeof fmt.formatPrice).toBe("function"); // fails until you add `export`
    expect(fmt.formatPrice(1250)).toBe("£12.50");
    expect(fmt.formatPrice(0)).toBe("£0.00");
  });

  test("2. formatPrice is a one-expression arrow function (implicit return)", () => {
    // An arrow function with a { } body has a longer source text than `(pence) => expr`.
    expect(typeof fmt.formatPrice).toBe("function");
    expect(String(fmt.formatPrice)).not.toMatch(/return/);
  });

  test("3. toSummary returns an object (the ({ ... }) trap)", () => {
    const result = fmt.toSummary({ id: 7, title: "Quiz", date: "2026-12-01" });
    expect(result).not.toBeUndefined();
    expect(result).toEqual({ id: 7, label: "Quiz" });
  });

  test("4. formatEvent is the default export", () => {
    expect(typeof fmt.default).toBe("function"); // fails until you add `export default`
    expect(formatEvent(event)).toBe("Hack Night - 24 Nov 2026 - £5.00");
  });
});
