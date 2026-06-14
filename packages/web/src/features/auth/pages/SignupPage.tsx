import { useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "@/app/router/routes";
import { SignupForm } from "../components/SignupForm";
import { useSignup } from "../hooks/useSignup";

export function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from ?? ROUTES.HOME;
  const signupMutation = useSignup();

  function handleSignup(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    if (data.password !== data.confirmPassword) {
      // show toast/form error
      return;
    }

    signupMutation.mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => navigate(from, { replace: true }),
      },
    );
  }

  return (
    <SignupForm loading={signupMutation.isPending} onSubmit={handleSignup} />
  );
}
