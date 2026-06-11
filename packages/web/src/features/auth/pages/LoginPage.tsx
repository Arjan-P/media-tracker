import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/app/router/routes";
import { LoginForm } from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";

export function LoginPage() {
  const navigate = useNavigate();

  const loginMutation = useLogin();

  function handleLogin(data: { email: string; password: string }) {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate(ROUTES.HOME, { replace: true });
      },
    });
  }

  return <LoginForm loading={loginMutation.isPending} onSubmit={handleLogin} />;
}
