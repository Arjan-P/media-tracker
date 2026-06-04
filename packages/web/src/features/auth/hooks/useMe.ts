import { useQuery } from "@tanstack/react-query";
import { me } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

export const ME_QUERY_KEY = ["auth", "me"] as const;

export function useMe() {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: me,
    enabled: !!accessToken,
    retry: false,
  });
}
