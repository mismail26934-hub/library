import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  adminApi,
  authorsApi,
  type AdminListQuery,
} from "@/lib/api-endpoints";
import { getApiErrorMessage } from "@/lib/axios";
import { qk } from "@/lib/query-keys";
import type { BookPayload } from "@/types";

export function useAdminUsers(params: AdminListQuery) {
  return useQuery({
    queryKey: qk.adminUsers(params),
    queryFn: () => adminApi.users(params),
    placeholderData: keepPreviousData,
  });
}

export function useAdminLoans(params: AdminListQuery) {
  return useQuery({
    queryKey: qk.adminLoans(params),
    queryFn: () => adminApi.loans(params),
    placeholderData: keepPreviousData,
  });
}

export function useAuthors() {
  return useQuery({
    queryKey: qk.authors(),
    queryFn: () => authorsApi.list(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookPayload) => adminApi.createBook(payload),
    onSuccess: () => {
      toast.success("Book added successfully");
      qc.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to add book")),
  });
}

export function useUpdateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: BookPayload }) =>
      adminApi.updateBook(id, payload),
    onSuccess: (_data, { id }) => {
      toast.success("Book updated successfully");
      qc.invalidateQueries({ queryKey: ["books"] });
      qc.invalidateQueries({ queryKey: qk.book(id) });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to update book")),
  });
}

export function useDeleteBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.deleteBook(id),
    onSuccess: () => {
      toast.success("Book deleted");
      qc.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to delete book")),
  });
}
