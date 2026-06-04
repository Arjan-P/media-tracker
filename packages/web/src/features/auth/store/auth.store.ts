import { MeResponse } from "@media-tracker/shared";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserProfile = MeResponse["user"];

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
}

interface AuthActions {
  setAuth: (user: UserProfile, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setAuth: (user, token) => set({ user, accessToken: token }),
      logout: () => set({ user: null, accessToken: null }),
    }),
    { name: "auth" },
  ),
);
