import { useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { ROUTES } from "@/app/router/routes";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from ?? ROUTES.HOME;
  const loginMutation = useLogin();

  function handleLogin(data: { email: string; password: string }) {
    loginMutation.mutate(data, {
      onSuccess: () => navigate(from, { replace: true }),
    });
  }

  return <LoginForm loading={loginMutation.isPending} onSubmit={handleLogin} />;
}
