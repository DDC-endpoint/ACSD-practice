import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchProducts } from "./productApi";
import type { Product } from "./types";

export function useProducts(): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ["products"], // the cache entry's name: every component using this key shares it
    queryFn: fetchProducts, // how to fetch the data when the cache needs it
    staleTime: 60_000, // cached data counts as fresh for 1 minute, so no refetch
  });
}
