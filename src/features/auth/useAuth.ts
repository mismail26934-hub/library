import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi, type LoginPayload, type RegisterPayload } from "@/lib/api-endpoints";
import { getApiErrorMessage } from "@/lib/axios";
import { useAppDispatch } from "@/app/hooks";
import { setCredentials } from "./authSlice";

export function useLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      dispatch(setCredentials({ token: data.token, user: data.user }));
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.role === "ADMIN" ? "/admin" : "/");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Login failed")),
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: () => {
      toast.success("Account created! Please log in.");
      navigate("/login");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Registration failed")),
  });
}
