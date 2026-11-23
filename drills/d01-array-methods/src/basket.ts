// d01 · Array methods on a shopping basket.
// Every function here takes an array and returns something NEW.
// None of them should change the array you were given.

export interface BasketItem {
  name: string;
  price: number; // price of ONE item, in pounds
  qty: number; // how many of it are in the basket
}

// TODO d01-1: add up a plain list of prices with reduce, starting from 0.
//   Mock C1 shape: store the result in a const named total, call the running total sum and each price p.
export function sumPrices(prices: number[]): number {
  throw new Error("TODO d01-1");
}

// TODO d01-1: total value of the basket (price × qty for each line) with reduce, starting from 0.
export function basketTotal(items: BasketItem[]): number {
  throw new Error("TODO d01-1");
}

// TODO d01-2: return the FIRST item with this name (or undefined if there is none). Use find.
export function findItem(items: BasketItem[], name: string): BasketItem | undefined {
  throw new Error("TODO d01-2");
}

// TODO d01-2: return EVERY item whose price is below maxPrice (an empty array if none). Use filter.
export function itemsCheaperThan(items: BasketItem[], maxPrice: number): BasketItem[] {
  throw new Error("TODO d01-2");
}

// TODO d01-3: turn each item into a label like "2 x Apple". Use map.
export function itemLabels(items: BasketItem[]): string[] {
  throw new Error("TODO d01-3");
}

// TODO d01-4: true if AT LEAST ONE item is free (price 0). Use some.
export function hasFreeItem(items: BasketItem[]): boolean {
  throw new Error("TODO d01-4");
}

// TODO d01-4: true if EVERY item has a qty of 1 or more. Use every.
export function allHaveQty(items: BasketItem[]): boolean {
  throw new Error("TODO d01-4");
}

// TODO d01-5: return the n cheapest items, cheapest first.
//   Sort a COPY ([...items]) by price, then slice(0, n). The caller's array must not change.
export function cheapest(items: BasketItem[], n: number): BasketItem[] {
  throw new Error("TODO d01-5");
}
