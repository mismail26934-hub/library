import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartApi } from "@/lib/api-endpoints";
import { getApiErrorMessage } from "@/lib/axios";
import { qk } from "@/lib/query-keys";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearCart, setCartItems } from "./cartSlice";

export function useCartQuery() {
  const token = useAppSelector((s) => s.auth.token);

  return useQuery({
    queryKey: qk.cart(),
    queryFn: () => cartApi.get(),
    enabled: !!token,
  });
}

/** Keeps Redux cart in sync with the API when the user is logged in. */
export function CartSync() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const { data } = useCartQuery();

  useEffect(() => {
    if (!token) {
      dispatch(clearCart());
      return;
    }
    if (data?.items) {
      dispatch(setCartItems(data.items));
    }
  }, [token, data, dispatch]);

  return null;
}

export function useAddToCart() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (bookId: number) => cartApi.addItem(bookId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.cart() });
      toast.success("Added to cart");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Failed to add to cart")),
  });
}

export function useRemoveFromCart() {
  const qc = useQueryClient();
  const items = useAppSelector((s) => s.cart.items);

  return useMutation({
    mutationFn: async (bookId: number) => {
      const item = items.find((i) => i.book.id === bookId);
      if (!item) return;
      return cartApi.removeItem(item.id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.cart() });
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Failed to remove from cart")),
  });
}
