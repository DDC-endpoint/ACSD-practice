import { create } from "zustand";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  items: [],
  // TODO d09-3: write the three actions. Never change state.items in place:
  // always return a NEW array from set((state) => ({ items: ... })).
  //   - addItem: if an item with that id is already there, map() it to quantity + 1;
  //     otherwise add { ...product, quantity: 1 } to the end.
  //   - removeItem: filter() out the item with that id.
  //   - clear: set items back to [].
  addItem: () => {
    throw new Error("TODO d09-3");
  },
  removeItem: () => {
    throw new Error("TODO d09-3");
  },
  clear: () => {
    throw new Error("TODO d09-3");
  },
}));

// A selector: takes the whole state, returns just the bit a component needs.
export const selectItemCount = (state: CartState): number => {
  // TODO d09-4: return the total quantity of all items (use reduce, starting at 0).
  throw new Error("TODO d09-4");
};
