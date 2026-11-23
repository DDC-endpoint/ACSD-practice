import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { updateProduct } from "./productApi";
import type { Product } from "./types";

export function useUpdateProduct(): UseMutationResult<Product, Error, Product> {
  // TODO d08-2: get the client with useQueryClient(), then return useMutation({ ... }) with:
  //   - mutationFn: updateProduct
  //   - onSuccess: invalidate the ["products"] query so the list is fetched again
  throw new Error("TODO d08-2");
}
