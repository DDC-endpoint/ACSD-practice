import { loadCheckout, loadWhatWeCan, type ShopApi } from "../src/loaders";
import type { BasketItem } from "../src/basket";

// A promise we can resolve or reject by hand, so we can see WHEN each request starts.
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const items: BasketItem[] = [
  { name: "Apple", price: 0.5, qty: 4 },
  { name: "Cheese", price: 3.75, qty: 2 },
];

describe("d01 loaders", () => {
  test("6. loadCheckout starts all three requests at once (Promise.all) and combines them", async () => {
    const user = deferred<{ name: string }>();
    const basket = deferred<BasketItem[]>();
    const offers = deferred<string[]>();
    const api = {
      loadUser: vi.fn(() => user.promise),
      loadBasket: vi.fn(() => basket.promise),
      loadOffers: vi.fn(() => offers.promise),
    } satisfies ShopApi;

    const pending = loadCheckout(api);
    // Nothing has resolved yet, but in parallel ALL three must already have been started.
    const startedTogether = [api.loadUser, api.loadBasket, api.loadOffers].map(
      (fn) => fn.mock.calls.length,
    );

    offers.resolve(["10% off cheese"]);
    basket.resolve(items);
    user.resolve({ name: "Sam" });
    const result = await pending;

    expect(startedTogether).toEqual([1, 1, 1]);
    expect(result).toEqual({
      user: { name: "Sam" },
      items,
      offers: ["10% off cheese"],
      total: 9.5,
    });
  });

  test("7. if ONE request rejects, Promise.all rejects (fail fast)", async () => {
    const api: ShopApi = {
      loadUser: () => Promise.resolve({ name: "Sam" }),
      loadBasket: () => Promise.reject(new Error("basket service down")),
      loadOffers: () => Promise.resolve([]),
    };
    await expect(loadCheckout(api)).rejects.toThrow("basket service down");
  });

  test("8. Promise.allSettled keeps the successes and counts the failures", async () => {
    const report = await loadWhatWeCan<number>([
      () => Promise.resolve(1),
      () => Promise.reject(new Error("timeout")),
      () => Promise.resolve(3),
      () => Promise.reject(new Error("500")),
    ]);
    expect(report).toEqual({ values: [1, 3], failed: 2 });

    expect(await loadWhatWeCan<string>([])).toEqual({ values: [], failed: 0 });
  });
});
