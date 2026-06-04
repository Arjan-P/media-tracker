import { useMutation } from "@tanstack/react-query";
import { signup } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

export function useSignup() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
    }) => signup(data.email, data.firstName, data.lastName, data.password),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
    },
  });
}
