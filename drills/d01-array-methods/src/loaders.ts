// d01 · Loading several things at once with Promise.all / Promise.allSettled.
import { basketTotal, type BasketItem } from "./basket";

export interface User {
  name: string;
}

// The three requests the checkout page needs. Each one returns a Promise.
export interface ShopApi {
  loadUser(): Promise<User>;
  loadBasket(): Promise<BasketItem[]>;
  loadOffers(): Promise<string[]>;
}

export interface Checkout {
  user: User;
  items: BasketItem[];
  offers: string[];
  total: number;
}

// GIVEN (for contrast): one after another. loadBasket doesn't even START until loadUser has finished,
// so the waits add up (e.g. 300ms + 300ms + 300ms = 900ms).
export async function loadCheckoutOneByOne(api: ShopApi): Promise<Checkout> {
  const user = await api.loadUser();
  const items = await api.loadBasket();
  const offers = await api.loadOffers();
  return { user, items, offers, total: basketTotal(items) };
}

// TODO d01-6: load the user, the basket and the offers IN PARALLEL with Promise.all,
//   destructure the three results, and return a Checkout (total = basketTotal(items)).
//   If any one request fails, this function should fail too (that's what Promise.all does).
export async function loadCheckout(api: ShopApi): Promise<Checkout> {
  const [user, items, offers] = await Promise.all([
    api.loadUser(),
    api.loadBasket(),
    api.loadOffers(),
  ]);
  return { user, items, offers, total: basketTotal(items) };
}

export interface LoadReport<T> {
  values: T[]; // the results that succeeded, in the original order
  failed: number; // how many loaders rejected
}

// TODO d01-7: run every loader in parallel with Promise.allSettled, so one failure does NOT
//   sink the rest. Collect the fulfilled values (in order) and count the rejected ones.
export async function loadWhatWeCan<T>(loaders: Array<() => Promise<T>>): Promise<LoadReport<T>> {
  const results = await Promise.allSettled(loaders.map((load) => load()));
  const values: T[] = [];
  let failed = 0;
  for (const result of results) {
    if (result.status === "fulfilled") {
      values.push(result.value);
    } else {
      failed++;
    }
  }
  return { values, failed };
}
