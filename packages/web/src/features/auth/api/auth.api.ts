import { api } from "@/lib/api";
import {
  AuthResponse,
  MeResponse,
  SuccessResponse,
} from "@media-tracker/shared";

export async function login(email: string, password: string) {
  const res = await api.post<SuccessResponse<AuthResponse>>("/api/auth/login", {
    email,
    password,
  });

  return res.data.data;
}

export async function signup(
  email: string,
  firstName: string,
  lastName: string,
  password: string,
) {
  const res = await api.post<SuccessResponse<AuthResponse>>(
    "/api/auth/signup",
    {
      email,
      firstName,
      lastName,
      password,
    },
  );

  return res.data.data;
}

export async function me() {
  const res = await api.get<SuccessResponse<MeResponse>>("/api/auth/me");
  return res.data.data;
}
