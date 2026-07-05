import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { loansApi, type BorrowPayload, type MyLoansQuery } from "@/lib/api-endpoints";
import { getApiErrorMessage } from "@/lib/axios";
import { qk } from "@/lib/query-keys";
import type { BookDetail } from "@/types";

export function useMyLoans(params: MyLoansQuery) {
  return useQuery({
    queryKey: qk.myLoans(params),
    queryFn: () => loansApi.my(params),
  });
}

/**
 * Optimistic borrow: availableCopies drops instantly on the book detail cache.
 * Rolls back on error, then refetches on settle.
 */
export function useBorrow() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: BorrowPayload) => loansApi.borrow(payload),
    onMutate: async (payload) => {
      const key = qk.book(payload.bookId);
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<BookDetail>(key);

      qc.setQueryData<BookDetail>(key, (old) =>
        old
          ? { ...old, availableCopies: Math.max(0, old.availableCopies - 1) }
          : old,
      );

      return { previous, bookId: payload.bookId };
    },
    onError: (error, _payload, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(qk.book(ctx.bookId), ctx.previous);
      }
      toast.error(getApiErrorMessage(error, "Failed to borrow book"));
    },
    onSuccess: () => {
      toast.success("Book borrowed successfully");
    },
    onSettled: (_data, _error, payload) => {
      qc.invalidateQueries({ queryKey: qk.book(payload.bookId) });
      qc.invalidateQueries({ queryKey: ["my-loans"] });
      qc.invalidateQueries({ queryKey: ["books"] });
      qc.invalidateQueries({ queryKey: qk.profile() });
    },
  });
}

export function useReturnLoan() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => loansApi.return(id),
    onSuccess: () => {
      toast.success("Book returned. Thank you!");
      qc.invalidateQueries({ queryKey: ["my-loans"] });
      qc.invalidateQueries({ queryKey: qk.profile() });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to return book")),
  });
}
