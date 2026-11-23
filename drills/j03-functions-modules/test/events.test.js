import { applyToAll, capacityOver, myFilter, summariseAll, summariseOpen } from "../src/events.js";

const events = [
  { id: 1, title: "Hack Night", date: "2026-11-24", capacity: 50, price: 500, isOpen: true },
  { id: 2, title: "Careers Fair", date: "2026-12-02", capacity: 300, price: 0, isOpen: true },
  { id: 3, title: "Quiz", date: "2026-12-09", capacity: 120, price: 250, isOpen: false },
];

describe("j03 events.js", () => {
  test("5. myFilter keeps the items where test(item) is true, in a new array", () => {
    const calls = [];
    const result = myFilter([1, 2, 3, 4], (n) => {
      calls.push(n);
      return n % 2 === 0;
    });
    expect(result).toEqual([2, 4]);
    expect(calls).toEqual([1, 2, 3, 4]); // test was called once per item
    expect(myFilter([], () => true)).toEqual([]);
    const input = [1, 2];
    expect(myFilter(input, () => true)).not.toBe(input); // a NEW array
  });

  test("6. applyToAll runs fn on every item and returns the results", () => {
    expect(applyToAll([1, 2, 3], (n) => n * 10)).toEqual([10, 20, 30]);
    expect(applyToAll(events, (e) => e.id)).toEqual([1, 2, 3]);
    expect(applyToAll([], (n) => n)).toEqual([]);
  });

  test("7. myFilter and applyToAll are written by hand (no .filter / .map inside)", () => {
    const filterSpy = vi.spyOn(Array.prototype, "filter");
    const mapSpy = vi.spyOn(Array.prototype, "map");
    let filterCalls = 0;
    let mapCalls = 0;
    try {
      myFilter([1, 2], () => true);
      applyToAll([1, 2], (n) => n);
      filterCalls = filterSpy.mock.calls.length;
      mapCalls = mapSpy.mock.calls.length;
    } finally {
      filterSpy.mockRestore();
      mapSpy.mockRestore();
    }
    expect(filterCalls).toBe(0);
    expect(mapCalls).toBe(0);
  });

  test("8. capacityOver(n) returns a function", () => {
    const bigger = capacityOver(100);
    expect(typeof bigger).toBe("function");
    expect(bigger(events[1])).toBe(true); // 300 > 100
    expect(bigger(events[0])).toBe(false); // 50 > 100 is false
    expect(capacityOver(50)(events[0])).toBe(false); // 50 > 50 is false
  });

  test("9. a function from capacityOver can be passed to myFilter", () => {
    const big = myFilter(events, capacityOver(100));
    expect(big.map((e) => e.title)).toEqual(["Careers Fair", "Quiz"]);
  });

  test("10. events.js imports formatEvent (default) and toSummary (named) from format.js", () => {
    // summariseOpen throws ReferenceError until the import line from TODO j03-4 exists.
    expect(summariseOpen(events)).toEqual([
      "Hack Night - 24 Nov 2026 - £5.00",
      "Careers Fair - 2 Dec 2026 - £0.00",
    ]);
    expect(summariseAll(events)[2]).toEqual({ id: 3, label: "Quiz" });
  });
});
