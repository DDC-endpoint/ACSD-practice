import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchProducts } from "./productApi";
import type { Product } from "./types";

export function useProducts(): UseQueryResult<Product[], Error> {
  // TODO d08-1: return useQuery({ ... }) with three options:
  //   - queryKey: ["products"]   (the name of this cache entry)
  //   - queryFn: fetchProducts   (pass the function itself, don't call it)
  //   - staleTime: one minute, in milliseconds
  throw new Error("TODO d08-1");
}
