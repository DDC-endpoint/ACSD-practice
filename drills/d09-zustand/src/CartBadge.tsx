import { selectItemCount, useCartStore } from "./useCartStore";

export function CartBadge() {
  const count = useCartStore(selectItemCount);
  return <span aria-label="Items in cart">{count}</span>;
}
