import {
  allHaveQty,
  basketTotal,
  cheapest,
  findItem,
  hasFreeItem,
  itemLabels,
  itemsCheaperThan,
  sumPrices,
  type BasketItem,
} from "../src/basket";

function basket(): BasketItem[] {
  return [
    { name: "Apple", price: 0.5, qty: 4 },
    { name: "Bread", price: 1.2, qty: 1 },
    { name: "Apple", price: 0.45, qty: 2 }, // a second "Apple" line, on purpose
    { name: "Cheese", price: 3.75, qty: 2 },
  ];
}

describe("d01 basket", () => {
  test("1. reduce adds everything up, starting from 0", () => {
    expect(sumPrices([15, 25, 10, 30])).toBe(80); // mock C1
    expect(sumPrices([])).toBe(0); // the initial value 0 is what makes an empty list safe
    // 0.5*4 + 1.2*1 + 0.45*2 + 3.75*2 = 2 + 1.2 + 0.9 + 7.5
    expect(basketTotal(basket())).toBeCloseTo(11.6);
    expect(basketTotal([])).toBe(0);
  });

  test("2. find returns the FIRST match only; filter returns ALL matches", () => {
    const items = basket();
    const apple = findItem(items, "Apple");
    expect(apple).toEqual({ name: "Apple", price: 0.5, qty: 4 }); // one object, not an array
    expect(apple).toBe(items[0]); // the very same object, not a copy
    expect(findItem(items, "Milk")).toBeUndefined(); // no match -> undefined (not null, not [])

    const cheap = itemsCheaperThan(items, 1);
    expect(cheap.map((i) => i.price)).toEqual([0.5, 0.45]); // an array of every match, in order
    expect(itemsCheaperThan(items, 0.1)).toEqual([]); // no match -> empty array
  });

  test("3. map turns each item into a label", () => {
    expect(itemLabels(basket())).toEqual(["4 x Apple", "1 x Bread", "2 x Apple", "2 x Cheese"]);
    expect(itemLabels([])).toEqual([]);
  });

  test("4. some = at least one; every = all of them", () => {
    const items = basket();
    expect(hasFreeItem(items)).toBe(false);
    expect(hasFreeItem([...items, { name: "Sample", price: 0, qty: 1 }])).toBe(true);
    expect(allHaveQty(items)).toBe(true);
    expect(allHaveQty([...items, { name: "Ghost", price: 2, qty: 0 }])).toBe(false);
    // the empty-list trap: some([]) is false, every([]) is true
    expect(hasFreeItem([])).toBe(false);
    expect(allHaveQty([])).toBe(true);
  });

  test("5. cheapest sorts a COPY and slices; the original array is untouched", () => {
    const items = [
      { name: "Ten", price: 10, qty: 1 },
      { name: "Nine", price: 9, qty: 1 },
      { name: "Hundred", price: 100, qty: 1 },
      { name: "Two", price: 2, qty: 1 },
    ];
    const before = items.map((i) => i.name);

    expect(cheapest(items, 3).map((i) => i.name)).toEqual(["Two", "Nine", "Ten"]);
    expect(cheapest(items, 10).map((i) => i.price)).toEqual([2, 9, 10, 100]); // numeric, not "alphabetical"
    expect(items.map((i) => i.name)).toEqual(before); // sort() on the original would have reordered it
  });
});
