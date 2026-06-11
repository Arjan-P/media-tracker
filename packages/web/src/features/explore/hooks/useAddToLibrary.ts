import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { addMedia, libraryKeys } from "@/features/library";
import { useAuthStore } from "@/features/auth";
import { ROUTES } from "@/app/router/routes";
import type { MediaItem } from "@media-tracker/shared";

export function useAddToLibrary() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);

  const mutation = useMutation({
    mutationFn: (item: MediaItem) => addMedia(item),
    onSuccess: () => qc.invalidateQueries({ queryKey: libraryKeys.all }),
  });

  function add(item: MediaItem) {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: location.pathname } });
      return;
    }
    mutation.mutate(item);
  }

  return { add, isPending: mutation.isPending, isSuccess: mutation.isSuccess };
}
