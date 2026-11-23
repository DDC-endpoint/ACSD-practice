// d02 · A type alias with a literal union.

// TODO d02-3: a type alias that allows ONLY these three values:
//   "pending", "shipped", "delivered"
export type OrderStatus = "pending" | "shipped" | "delivered";

// TODO d02-3: switch on the status and return:
//   pending -> "Waiting to ship", shipped -> "On its way", delivered -> "Delivered"
export function statusLabel(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "Waiting to ship";
    case "shipped":
      return "On its way";
    case "delivered":
      return "Delivered";
  }
}
