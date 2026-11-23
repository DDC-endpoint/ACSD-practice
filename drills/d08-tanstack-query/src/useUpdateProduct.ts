import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { updateProduct } from "./productApi";
import type { Product } from "./types";

export function useUpdateProduct(): UseMutationResult<Product, Error, Product> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      // Mark every ["products"] query stale and refetch the ones on screen.
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
