import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { meApi, type UpdateProfilePayload } from "@/lib/api-endpoints";
import { getApiErrorMessage } from "@/lib/axios";
import { qk } from "@/lib/query-keys";
import { useAppDispatch } from "@/app/hooks";
import { setUser } from "@/features/auth/authSlice";

export function useProfile(enabled = true) {
  return useQuery({
    queryKey: qk.profile(),
    queryFn: () => meApi.get(),
    enabled,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => meApi.update(payload),
    onSuccess: (user) => {
      dispatch(setUser(user));
      toast.success("Profile updated");
      qc.invalidateQueries({ queryKey: qk.profile() });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to update profile")),
  });
}
