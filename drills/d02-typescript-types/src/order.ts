// d02 · A type alias with a literal union.

// TODO d02-3: a type alias that allows ONLY these three values:
//   "pending", "shipped", "delivered"
//   (string is a placeholder so the file compiles. Replace it.)
export type OrderStatus = string;

// TODO d02-3: switch on the status and return:
//   pending -> "Waiting to ship", shipped -> "On its way", delivered -> "Delivered"
export function statusLabel(status: OrderStatus): string {
  throw new Error("TODO d02-3");
}
