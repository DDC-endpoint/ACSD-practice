import { useProducts } from "./useProducts";
import { useUpdateProduct } from "./useUpdateProduct";

export function ProductList() {
  // TODO d08-3: call useProducts() and useUpdateProduct(), then
  //   - while isPending: render <p>Loading products...</p>
  //   - if isError:      render <p role="alert">Error: {error.message}</p>
  //   - otherwise: a <ul> with one <li> per product showing "{name}: £{price}"
  //     and a button with aria-label={`Raise price of ${p.name}`} whose onClick
  //     calls mutate({ ...p, price: p.price + 1 }) on the mutation.
  return <p>TODO d08-3</p>;
}
