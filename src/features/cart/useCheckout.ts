import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { loansApi } from "@/lib/api-endpoints";
import { getApiErrorMessage } from "@/lib/axios";
import { useAppDispatch } from "@/app/hooks";
import { clearCart, type LocalCartItem } from "./cartSlice";
import { useNavigate } from "react-router-dom";

export function useCheckout() {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (items: LocalCartItem[]) => {
      const results = await Promise.allSettled(
        items.map((item) => loansApi.borrow({ bookId: item.book.id, days: item.days })),
      );
      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length > 0) {
        throw new Error(
          `${failed.length} of ${items.length} books could not be borrowed.`,
        );
      }
      return results;
    },
    onSuccess: (_data, items) => {
      toast.success(`Borrowed ${items.length} book(s) successfully`);
      dispatch(clearCart());
      qc.invalidateQueries({ queryKey: ["my-loans"] });
      qc.invalidateQueries({ queryKey: ["books"] });
      navigate("/loans");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Checkout failed"));
      qc.invalidateQueries({ queryKey: ["my-loans"] });
    },
  });
}
