import { useProducts } from "./useProducts";
import { useUpdateProduct } from "./useUpdateProduct";

export function ProductList() {
  const { data, isPending, isError, error } = useProducts();
  const updateMutation = useUpdateProduct();

  if (isPending) return <p>Loading products...</p>;
  if (isError) return <p role="alert">Error: {error.message}</p>;

  return (
    <ul>
      {data.map((p) => (
        <li key={p.id}>
          {p.name}: £{p.price}{" "}
          <button
            aria-label={`Raise price of ${p.name}`}
            onClick={() => updateMutation.mutate({ ...p, price: p.price + 1 })}
          >
            +£1
          </button>
        </li>
      ))}
    </ul>
  );
}
